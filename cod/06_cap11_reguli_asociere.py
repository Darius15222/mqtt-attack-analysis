import sys, pandas as pd, numpy as np
from mlxtend.frequent_patterns import apriori, association_rules
d = pd.read_csv(sys.argv[1], low_memory=False)
F={"0x00000010":"ACK","0x00000018":"PSH+ACK","0x00000011":"FIN+ACK","0x00000002":"SYN","0x00000012":"SYN+ACK","0x00000004":"RST","0x00000019":"FIN+PSH+ACK","0x00000014":"RST+ACK"}
M={0:"fara",1:"CONNECT",2:"CONNACK",3:"PUBLISH",4:"PUBACK",5:"PUBREC",8:"SUBSCRIBE",9:"SUBACK",12:"PINGREQ",13:"PINGRESP",14:"DISCONNECT"}
t=pd.DataFrame({"flags":d["tcp.flags"].map(F),"msgtype":d["mqtt.msgtype"].astype(int).map(M),"qos":d["mqtt.qos"].astype(int),"dupflag":d["mqtt.dupflag"].astype(int),
 "len":pd.cut(d["tcp.len"],[-1,0,20,1460,1e9],labels=["0","1-20","21-1460","1461+"]),
 "delta":pd.cut(d["tcp.time_delta"],[-1,3e-6,2.6e-5,1.7e-4,1e9],labels=["Q1","Q2","Q3","Q4"]),"target":d.target})
print(t.head(5).to_string()); print(t.delta.value_counts(normalize=True).round(3).to_dict())
I=pd.get_dummies(t.astype(str),prefix_sep="="); print("items",I.shape[1])
fr=apriori(I,min_support=0.05,use_colnames=True); fr["k"]=fr.itemsets.apply(len); print("frequent per k",fr.k.value_counts().sort_index().to_dict())
r=association_rules(fr,metric="confidence",min_threshold=0.6); r=r[r.consequents.apply(len)==1]; print("rules",len(r))
def prune(r):
    keep=[]
    best={}
    for i,row in r.iterrows():
        c=next(iter(row.consequents)); a=row.antecedents
        sub=r[(r.consequents==row.consequents)&(r.antecedents.apply(lambda x: x<a))]
        keep.append(len(sub)==0 or row.confidence>sub.confidence.max())
    return r[keep]
rp=prune(r); rp=rp.assign(n=rp.antecedents.apply(len)+1); print("pruned",len(rp), rp.n.value_counts().sort_index().to_dict(), rp.support.min(),rp.support.max(),rp.lift.min(),rp.lift.max(),rp.lift.median())
print("RHS classes", rp[rp.consequents.apply(lambda x: next(iter(x)).startswith("target"))].consequents.apply(lambda x:next(iter(x))).value_counts().to_dict())
print(rp.sort_values("lift",ascending=False).head(10)[["antecedents","consequents","support","confidence","lift"]].to_string())
# per attack
for ms in [300,150]:
    fr2=apriori(I,min_support=ms/len(I),use_colnames=True,max_len=7)
    r2=association_rules(fr2,metric="confidence",min_threshold=0.5); r2=r2[r2.consequents.apply(len)==1]
    att=["target="+a for a in ["dos","bruteforce","malformed","slowite","flood"]]
    r2=r2[r2.consequents.apply(lambda x:next(iter(x)) in att) & r2.antecedents.apply(lambda x: not any(i.startswith("target") for i in x))]
    r2p=prune(r2); print(ms, r2p.consequents.apply(lambda x:next(iter(x))).value_counts().to_dict())
    if ms==150:
        if len(sys.argv)>2:  # opțional: regulile pe atacuri ca CSV (pentru graficul interactiv de pe site)
            pd.DataFrame({"stanga":r2p.antecedents.apply(lambda x:" & ".join(sorted(x))),"atac":r2p.consequents.apply(lambda x:next(iter(x))[7:]),
                          "pachete":(r2p.support*len(I)).round().astype(int),"support":r2p.support,"confidence":r2p.confidence,"lift":r2p.lift}).to_csv(sys.argv[2],index=False)
        for a in att:
            s=r2p[r2p.consequents.apply(lambda x:next(iter(x))==a)].sort_values(["confidence","support"],ascending=False).head(3)
            for _,x in s.iterrows(): print(a, sorted(x.antecedents), round(x.support*len(I)), round(x.support,4), round(x.confidence,3), round(x.lift,1))
