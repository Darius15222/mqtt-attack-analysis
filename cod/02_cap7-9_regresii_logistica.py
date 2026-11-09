import sys, pandas as pd, numpy as np, statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor as vif
from scipy import stats
d = pd.read_csv(sys.argv[1], low_memory=False); d["is_attack"]=(d.target!="legitimate").astype(int)
r13=["tcp.time_delta","tcp.len","mqtt.len","mqtt.kalive","mqtt.qos","mqtt.dupflag","mqtt.retain","mqtt.conflag.cleansess","mqtt.conflag.passwd","mqtt.conflag.uname","mqtt.proto_len","mqtt.ver","mqtt.conack.val"]
pd.set_option("display.width",250); sp=d[r13].corr("spearman"); print(sp.round(2).to_string())
for k,g in d.groupby("target"):
    c=[x for x in r13 if g[x].nunique()>1]; m=g[c].corr("spearman").values; iu=np.triu_indices(len(c),1); print(k,"pairs",len(iu[0]),"r>=0.995",(m[iu]>=0.995).sum())
print("pearson qos-mqtt.len", d["mqtt.qos"].corr(d["mqtt.len"]))
f=d[d.target=="flood"]; print("flood mqtt.len when tcp.len>1460", f[f["tcp.len"]>1460]["mqtt.len"].describe().to_dict()); print("flood ACK empty", ((f["tcp.flags"]=="0x00000010")&(f["tcp.len"]==0)).sum(), "tcp.len>1460 all", (d["tcp.len"]>1460).sum(), d[d["tcp.len"]>1460].target.unique())
print("legit tcp.len max", d[d.target=="legitimate"]["tcp.len"].max(), "time_delta max", d["tcp.time_delta"].max(), (d["tcp.time_delta"]>50).sum())
X=sm.add_constant(d[["tcp.len"]]); m1=sm.OLS(d["mqtt.len"],X).fit(); print("R1",m1.params.round(4).to_dict(), round(m1.rsquared,4), "ssr",m1.ssr, "res skew/kurt", round(stats.skew(m1.resid),2), round(stats.kurtosis(m1.resid),1))
L=np.log1p(d[["tcp.len","mqtt.len"]]); m1l=sm.OLS(L["mqtt.len"],sm.add_constant(L["tcp.len"])).fit(); print("R1log",m1l.params.round(3).to_dict(), round(m1l.rsquared,3), round(stats.skew(m1l.resid),2), round(stats.kurtosis(m1l.resid),1))
m2=sm.OLS(d["tcp.time_delta"],sm.add_constant(d[["tcp.len","mqtt.len"]])).fit(); print("R2",m2.params.to_dict(), m2.pvalues.to_dict(), m2.rsquared, stats.skew(m2.resid), stats.kurtosis(m2.resid))
for k,g in d.groupby("target"):
    a=sm.OLS(g["mqtt.len"],sm.add_constant(g["tcp.len"])).fit(); gl=np.log1p(g[["tcp.len","mqtt.len"]]); b=sm.OLS(gl["mqtt.len"],sm.add_constant(gl["tcp.len"])).fit()
    print("R3",k,len(g),a.params.round(4).tolist(), round(a.rsquared,3), round(b.rsquared,3))
P=["tcp.len","mqtt.len","tcp.time_delta","mqtt.qos","mqtt.dupflag"]; Xv=sm.add_constant(d[P]).values
print("VIF5",[round(vif(Xv,i),2) for i in range(1,6)]); X3=sm.add_constant(d[["tcp.len","tcp.time_delta","mqtt.len"]]).values; print("VIF3",[round(vif(X3,i),2) for i in range(1,4)])
g6=sm.GLM(d.is_attack,sm.add_constant(d[["tcp.len","tcp.time_delta","mqtt.len"]]),family=sm.families.Binomial()).fit()
print("LOG6",g6.params.round(4).to_dict(), g6.bse.round(4).to_dict(), g6.tvalues.round(2).to_dict(), g6.null_deviance, g6.deviance, g6.aic, "iters", g6.fit_history["iteration"])
for it in [10,15,20,25,30]:
    gA=sm.GLM(d.is_attack,sm.add_constant(d[P]),family=sm.families.Binomial()).fit(maxiter=it, tol=1e-30)
    print("LOG5 it",it, gA.params.round(3).to_dict(), gA.bse.round(1).to_dict(), round(gA.deviance,1))
pr=pd.Series(g6.predict(),index=d.index); 
for k in d.target.unique():
    s=pr[d.target==k]; print("prob",k,"max",round(s.max(),3),"med",round(s.median(),3),">0.9",round((s>0.9).mean(),3),"~0.42",round((np.abs(s-0.4235)<0.005).mean(),3))
att=d[d.is_attack==1]; leg=d[d.is_attack==0]
for c in ["tcp.time_delta","tcp.len","mqtt.len"]: print("9.2",c,att[c].median(),att[c].quantile([.25,.75]).tolist())
print("msgtype by class", pd.crosstab(d["mqtt.msgtype"],d.target).to_string())
