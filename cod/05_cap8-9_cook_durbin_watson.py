import sys, numpy as np, pandas as pd, statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson
d=pd.read_csv(sys.argv[1],low_memory=False); y=(d.target!="legitimate").astype(int).values
X=sm.add_constant(d[["tcp.len","tcp.time_delta","mqtt.len"]]).values
g=sm.GLM(y,X,family=sm.families.Binomial()).fit(); p=np.clip(g.predict(),1e-12,1-1e-12); w=p*(1-p)
Ii=np.linalg.inv((X*w[:,None]).T@X); h=w*np.einsum("ij,jk,ik->i",X,Ii,X)
rp=(y-p)/np.sqrt(w); k=X.shape[1]; cook=rp**2*h/(k*(1-h)**2)
n=len(y); print("cook max",cook.max(),"argmax row",cook.argmax()+1,"n>4/n",(cook>4/n).sum(),(cook>4/n).mean(),"n>0.5",(cook>0.5).sum(),"4/n",4/n)
r=g.resid_deviance; print("reziduuri deviance: max",np.abs(r).max(),">2",(np.abs(r)>2).sum(),">3",(np.abs(r)>3).sum())
print("top5",np.sort(cook)[-5:]); np.save(sys.argv[2],cook)
m1=sm.OLS(d["mqtt.len"],sm.add_constant(d["tcp.len"])).fit(); m2=sm.OLS(d["tcp.time_delta"],sm.add_constant(d[["tcp.len","mqtt.len"]])).fit()
print("DW1",durbin_watson(m1.resid),"DW2",durbin_watson(m2.resid))
ca=d["mqtt.conack.flags"].astype(str); print(pd.crosstab(ca,d["mqtt.msgtype"]))
print(pd.crosstab(d["mqtt.protoname"].astype(str),d["mqtt.msgtype"]))
m0=d[d["mqtt.msgtype"]==0]; print("msgtype0: hdrflags", m0["mqtt.hdrflags"].astype(str).unique()[:5], "mqtt.len max", m0["mqtt.len"].max())
print(pd.crosstab(d["mqtt.kalive"],d.target))
