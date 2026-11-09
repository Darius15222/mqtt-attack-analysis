import sys, numpy as np, pandas as pd
d=pd.read_csv(sys.argv[1],low_memory=False,usecols=["tcp.len","mqtt.len","tcp.time_delta","mqtt.qos","mqtt.dupflag","target"])
y=(d.target!="legitimate").values.astype(float)
P=["tcp.len","mqtt.len","tcp.time_delta","mqtt.qos","mqtt.dupflag"]
X=np.column_stack([np.ones(len(d)),d[P].values])
def fit(X,y,fixed=None,it=200):
    b=np.zeros(X.shape[1]); free=np.ones(X.shape[1],bool)
    if fixed is not None: free[fixed]=False
    def pll(b):
        e=np.clip(X@b,-500,500); p=1/(1+np.exp(-e)); w=p*(1-p); I=(X*w[:,None]).T@X
        return np.sum(y*np.log(p+1e-300)+(1-y)*np.log(1-p+1e-300))+0.5*np.linalg.slogdet(I)[1],p,w,I
    for _ in range(it):
        L,p,w,I=pll(b); Ii=np.linalg.inv(I); h=w*np.einsum("ij,jk,ik->i",X,Ii,X)
        U=X.T@(y-p+h*(0.5-p)); Xf=X[:,free]; If=I[np.ix_(free,free)]
        step=np.linalg.solve(If,U[free]); s=1.0
        while True:
            bn=b.copy(); bn[free]+=s*step
            if pll(bn)[0]>=L-1e-9 or s<1e-4: break
            s/=2
        b=bn
        if np.max(np.abs(s*step))<1e-8: break
    L,p,w,I=pll(b); return b,np.sqrt(np.diag(np.linalg.inv(I))),L
b,se,L=fit(X,y); print("coef",np.round(b,4)); print("se",np.round(se,4))
for j,n in enumerate(P,1):
    _,_,L0=fit(X,y,fixed=j); print(n,"chisq",round(2*(L-L0),2))
