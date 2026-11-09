import sys, pandas as pd, numpy as np
from scipy import stats
d = pd.read_csv(sys.argv[1], low_memory=False)
print(d.shape); print(d.target.value_counts(), (d.target.value_counts(normalize=True)*100).round(2))
const=[c for c in d if d[c].nunique()==1]; print("const",len(const),const)
for c in ["tcp.len","tcp.time_delta","mqtt.len","mqtt.kalive"]:
    x=d[c]; print(c, "mean",round(x.mean(),2),"std",round(x.std(),2),"med",x.median(),"q",x.quantile([.25,.75]).tolist(),"skew",round(x.skew(),2),"kurt",round(x.kurt(),1))
    q1,q3=x.quantile([.25,.75]); hi=q3+1.5*(q3-q1); o=(x<q1-1.5*(q3-q1))|(x>hi)  # valori extreme, regula IQR
    print("  IQR: peste",hi,"n",o.sum(),round(o.mean()*100,2),"%", d.target[o].value_counts(normalize=True).round(3).to_dict())
for c in ["tcp.flags","mqtt.hdrflags","mqtt.msgtype","mqtt.conflags","mqtt.protoname","mqtt.conack.flags","mqtt.msg"]:
    vc=d[c].astype(str).value_counts(normalize=True); print(c, vc.index[0], round(vc.iloc[0]*100,2))
for c in ["mqtt.dupflag","mqtt.retain","mqtt.conflag.cleansess","mqtt.conflag.passwd","mqtt.conflag.uname","mqtt.proto_len","mqtt.ver","mqtt.conack.val","mqtt.qos"]:
    print(c, "nonzero%", round((d[c]!=0).mean()*100,2), "count", (d[c]!=0).sum(), d[c].unique()[:6])
# per class
leg=d[d.target=="legitimate"]
print("leg tcp.len med q", leg["tcp.len"].median(), leg["tcp.len"].quantile([.25,.75]).tolist(), "mean", round(leg["tcp.len"].mean(),2), "zero%", round((leg["tcp.len"]==0).mean()*100,1), "10-14%", round(leg["tcp.len"].between(10,14).mean()*100,1))
for c in ["tcp.time_delta","tcp.len","mqtt.len"]:
    print(c, {k:(g.median(), g.quantile(.25), g.quantile(.75)) for k,g in d.groupby("target")[c]})
    print(" KW H", stats.kruskal(*[g.values for _,g in d.groupby("target")[c]]))
for c in ["tcp.flags","mqtt.hdrflags","mqtt.msgtype"]:
    for k,g in d.groupby("target"):
        vc=g[c].astype(str).value_counts(normalize=True); print(" ",c,k,vc.index[0],round(vc.iloc[0]*100,2))
for c in ["mqtt.dupflag","mqtt.retain","mqtt.conflag.cleansess","mqtt.conflag.passwd","mqtt.conflag.uname","mqtt.conack.val","mqtt.qos"]:
    print(c, (d.groupby("target")[c].apply(lambda s:(s!=0).mean()*100)).round(2).to_dict())
print("kalive slowite 65535%", round((d[d.target=="slowite"]["mqtt.kalive"]==65535).mean()*100,2), d["mqtt.kalive"].unique()[:10])
O=pd.crosstab(d["tcp.flags"],d.target); print(O); ch=stats.chi2_contingency(O); print("chi2",ch[0],ch[2])
E=ch[3]; print("E FIN,ACK bf", E[O.index.get_loc("0x00000011"), O.columns.get_loc("bruteforce")])
O2=pd.crosstab(d["mqtt.conack.val"],d.target); c2=stats.chi2_contingency(O2); print(O2, "chi2",c2[0]); print("E", c2[3])
# MW flood vs normal time_delta
n=leg["tcp.time_delta"]; f=d[d.target=="flood"]["tcp.time_delta"]
u=stats.mannwhitneyu(n,f); print("MW",u, len(n)*len(f))
u2=stats.mannwhitneyu(f,n); print("MW flipped",u2)
# rows
for k in d.target.unique(): print(k, list(d.index[d.target==k][:2]+1))
print(d.loc[[0,4,1,46,36,6,1420],["tcp.flags","tcp.len","mqtt.len","target"]])
# Spearman/Pearson
r13=["tcp.time_delta","tcp.len","mqtt.len","mqtt.kalive","mqtt.qos","mqtt.dupflag","mqtt.retain","mqtt.conflag.cleansess","mqtt.conflag.passwd","mqtt.conflag.uname","mqtt.proto_len","mqtt.ver","mqtt.conack.val"]
sp=d[r13].corr("spearman"); print(sp.round(2))
d["is_attack"]=(d.target!="legitimate").astype(int)
for a,b in [("tcp.len","mqtt.len"),("tcp.time_delta","tcp.len"),("tcp.time_delta","mqtt.len"),("tcp.len","is_attack"),("mqtt.len","is_attack"),("tcp.time_delta","is_attack"),("mqtt.qos","is_attack"),("mqtt.dupflag","is_attack")]:
    print(a,b, round(d[a].corr(d[b]),3), round(d[a].corr(d[b],method="spearman"),3))
print("conn nonzero rows", (d["mqtt.ver"]!=0).sum(), ((d["mqtt.ver"]!=0)==(d["mqtt.kalive"]!=0)).all())
q1=d[d["mqtt.qos"]==1]; print("qos1",len(q1), q1.target.unique(), q1["mqtt.len"].min(), q1["mqtt.len"].max(), d[d["mqtt.qos"]==0]["mqtt.len"].mean())
print("dup1 subset qos1", ((d["mqtt.dupflag"]==1)&(d["mqtt.qos"]!=1)).sum())
for k,g in d.groupby("target"):
    print(k, "tcp-mqtt spearman", round(g["tcp.len"].corr(g["mqtt.len"],method="spearman"),2), "nconst", sum(g[c].nunique()==1 for c in r13), [c for c in r13 if g[c].nunique()==1])
print("tcp.len max flood", d[d.target=="flood"]["tcp.len"].max(), "mqtt.len flood max", d[d.target=="flood"]["mqtt.len"].max())
x=d["tcp.len"];y=d["mqtt.len"]; print("sxy",((x-x.mean())*(y-y.mean())).sum(),"sxx",((x-x.mean())**2).sum(),"syy",((y-y.mean())**2).sum())
# example table 4 attack examples
att=d[d.is_attack==1]
for c in ["tcp.flags","tcp.time_delta","tcp.len","mqtt.hdrflags","mqtt.msgtype","mqtt.len","mqtt.qos","mqtt.dupflag","mqtt.kalive"]:
    s=d[c].astype(str); share=d.groupby(s)["is_attack"].mean(); ok=share[share>=0.99].index
    vc=att[c].astype(str).value_counts(); vc=vc[vc.index.isin(ok)]
    nv=leg[c].astype(str).value_counts(normalize=True)
    print("T4",c,"normal",nv.index[0],round(nv.iloc[0]*100,1),"attack", (vc.index[0], round(vc.iloc[0]/len(att)*100,1)) if len(vc) else None)
