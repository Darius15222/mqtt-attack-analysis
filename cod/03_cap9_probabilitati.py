import sys, pandas as pd, numpy as np, statsmodels.api as sm
d = pd.read_csv(sys.argv[1], low_memory=False); d["is_attack"]=(d.target!="legitimate").astype(int)
g6=sm.GLM(d.is_attack,sm.add_constant(d[["tcp.len","tcp.time_delta","mqtt.len"]]),family=sm.families.Binomial()).fit()
pr=pd.Series(np.asarray(g6.predict()),index=d.index)
for k in d.target.unique():
    s=pr[d.target==k]; print("prob",k,"max",round(s.max(),3),"med",round(s.median(),3),">0.9",round((s>0.9).mean(),3),"~0.42",round((np.abs(s-0.4235)<0.005).mean(),3))
b=g6.params; print("curve d=0 typical", 1/(1+np.exp(-(b.const+b["tcp.len"]*13+b["mqtt.len"]*11))))
att=d[d.is_attack==1]
for c in ["tcp.time_delta","tcp.len","mqtt.len"]: print("9.2",c,att[c].median(),att[c].quantile([.25,.75]).tolist())
print(pd.crosstab(d["mqtt.msgtype"],d.target).to_string())
dos=d[(d.target=="dos")&(d["mqtt.msgtype"]==3)&(d["tcp.flags"]=="0x00000010")]; print("dos publish ACK", len(dos), dos["tcp.len"].unique()[:5], "70%", round(len(dos)*.7))
print("time_delta =3e-6 share", (d["tcp.time_delta"]==3e-6).mean(), "<=3e-6", (d["tcp.time_delta"]<=3e-6).mean())
print(pd.Series([1,2,2,3,10]).skew(), pd.Series([1,2,2,3,10]).kurt())
print("conack contrib", (1428-62.5742)**2/62.5742)
