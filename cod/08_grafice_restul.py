import sys, numpy as np, pandas as pd, matplotlib, statsmodels.api as sm
matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from scipy import stats
from mlxtend.frequent_patterns import apriori, association_rules
d=pd.read_csv(sys.argv[1],low_memory=False); out=sys.argv[2]; cook=np.load(sys.argv[3])
d["is_attack"]=(d.target!="legitimate").astype(int)
CL=["legitimate","dos","bruteforce","malformed","slowite","flood"]
def g(v,_=None):
    s=("%g"%v).replace(".",",").replace("-","−"); return s
def ro(v,dec): s=f"{v:.{dec}f}"; return s.replace(".",",").replace("-","−")
def fix(ax,x=True):  # comma decimals on linear axes; x=False keeps category labels
    if x and ax.get_xscale()=="linear": ax.xaxis.set_major_formatter(FuncFormatter(g))
    if ax.get_yscale()=="linear": ax.yaxis.set_major_formatter(FuncFormatter(g))
def lab(v):  # 3.0 -> 3, hex/text unchanged
    if isinstance(v,float) and v.is_integer(): return f"{int(v):,}".replace(",",".")
    return str(v)
def save(fig,name,w,h):
    fig.set_size_inches(w/100,h/100); fig.savefig(f"{out}/{name}",dpi=100); plt.close(fig)
def stars(p): return "***" if p<0.001 else "**" if p<0.01 else "*" if p<0.05 else "ns"
# ---------- ch5 bar charts ----------
C5={2:"mqtt.conack.flags",3:"mqtt.conack.val",4:"mqtt.conflag.cleansess",5:"mqtt.conflag.passwd",6:"mqtt.conflag.uname",7:"mqtt.conflags",8:"mqtt.dupflag",9:"mqtt.hdrflags",12:"mqtt.msgtype",13:"mqtt.proto_len",14:"mqtt.protoname",15:"mqtt.qos",16:"mqtt.retain",17:"mqtt.ver",18:"tcp.flags"}
for k,c in C5.items():
    vc=d[c].value_counts(normalize=True)*100
    if len(vc)>10: vc=pd.concat([vc.iloc[:10],pd.Series({"Altele":vc.iloc[10:].sum()})])
    fig,ax=plt.subplots(); ax.bar([lab(v) for v in vc.index],vc.values); ax.set_title(c); ax.set_ylabel("% din pachete")
    plt.setp(ax.get_xticklabels(),rotation=45,ha="right"); fix(ax,x=False); fig.tight_layout(); save(fig,f"image{k}.png",600,420)
# ---------- ch6 ----------
C6={21:"tcp.flags",22:"tcp.time_delta",23:"tcp.len",24:"mqtt.hdrflags",25:"mqtt.msgtype",26:"mqtt.dupflag",27:"mqtt.qos",28:"mqtt.retain",29:"mqtt.len",30:"mqtt.conflags",31:"mqtt.conflag.cleansess",32:"mqtt.conflag.passwd",33:"mqtt.conflag.uname",34:"mqtt.kalive",35:"mqtt.protoname",36:"mqtt.proto_len",37:"mqtt.ver",38:"mqtt.conack.flags",39:"mqtt.conack.val"}
NUM=["tcp.time_delta","tcp.len","mqtt.len"]; KW_BARS=["mqtt.qos","mqtt.kalive"]
leg=d[d.target=="legitimate"]
def mw(c):
    r={}
    for a in CL[1:]:
        x=leg[c].values; y=d[d.target==a][c].values
        if np.unique(np.r_[x,y]).size==1: r[a]="-"
        else: r[a]=stars(stats.mannwhitneyu(x,y).pvalue)
    return r
for k,c in C6.items():
    fig,ax=plt.subplots()
    if c in NUM:
        data=[d[d.target==a][c].values for a in CL]
        if c=="tcp.time_delta": data=[np.where(v==0,1e-6,v) for v in data]; ax.set_yscale("log"); note="; 0 afișat ca 1e-06 s"
        else: ax.set_yscale("symlog",linthresh=1); note=""
        ax.boxplot(data,showfliers=False,widths=0.5); ax.set_xticks(range(1,7)); ax.set_xticklabels(CL)
        top=ax.get_ylim()[1]; s=mw(c)
        for i,a in enumerate(CL[1:],2): ax.text(i,top,s[a],ha="center",va="bottom")
        ax.set_ylim(top=top*(30 if c=="tcp.time_delta" else 8)); ax.set_title(f"{c}  (Kruskal-Wallis ***; stele: atac vs normal{note})",fontsize=9)
        print(c,s)
    else:
        s=d[c].map(lab) if d[c].dtype!=object else d[c].astype(str)
        top=s.value_counts().index[:6]; s=s.where(s.isin(top),"Altele")
        if c=="mqtt.kalive": s=d[c].map(lambda v:{0:"0",60:"60",65535:"65.535"}.get(v,"altele (1, 2, 3, 234)"))
        tab=pd.crosstab(s,d.target,normalize="columns")[CL]*100
        order=[v for v in sorted(tab.index,key=lambda v:(v.startswith(("Altele","altele")),len(v),v))]
        tab=tab.loc[order]; n=len(tab); wdt=0.8/n
        for i,(v,row) in enumerate(tab.iterrows()): ax.bar(np.arange(6)+(i-(n-1)/2)*wdt,row.values,wdt,label=v)
        ax.set_xticks(range(6)); ax.set_xticklabels(CL); ax.set_ylabel("% din clasă")
        if c in KW_BARS:
            st=mw(c); ax.set_ylim(0,112)
            for i,a in enumerate(CL[1:],1): ax.text(i,104,st[a],ha="center")
            ax.set_title(f"{c}  (Kruskal-Wallis ***; stele: atac vs normal)",fontsize=9); print(c,st)
        else: ax.set_title(f"{c}  (chi-pătrat ***)",fontsize=9)
        ax.legend(title="valoare",fontsize=7,title_fontsize=7,loc="upper left",bbox_to_anchor=(1.01,1))
    plt.setp(ax.get_xticklabels(),rotation=30,ha="right"); fix(ax,x=False); fig.set_size_inches(7.8,5.04); fig.tight_layout(); save(fig,f"image{k}.png",780,504)
# ---------- 7.4 Pearson / Spearman ----------
V=["tcp.len","mqtt.len","tcp.time_delta","mqtt.qos","mqtt.dupflag","is_attack"]
fig,axs=plt.subplots(1,2,figsize=(12.53,5.87))
for ax,m in zip(axs,["pearson","spearman"]):
    c=d[V].corr(m).values; im=ax.imshow(c,cmap="RdBu",vmin=-1,vmax=1)
    for i in range(6):
        for j in range(6): ax.text(j,i,ro(c[i,j],2),ha="center",va="center",fontsize=8,color="white" if abs(c[i,j])>0.5 else "black")
    ax.set_xticks(range(6)); ax.set_xticklabels(V,rotation=40,ha="right",fontsize=8); ax.set_yticks(range(6)); ax.set_yticklabels(V if m=="pearson" else [],fontsize=8); ax.set_title(m.capitalize())
cb=fig.colorbar(im,ax=axs,shrink=0.85); cb.ax.yaxis.set_major_formatter(FuncFormatter(lambda v,_:ro(v,2))); save(fig,"image48.png",1253,587)
# ---------- 8.1 / 8.2 / 8.3 ----------
smp=d.sample(8000,random_state=42)
m1=sm.OLS(d["mqtt.len"],sm.add_constant(d["tcp.len"])).fit(); L=np.log1p(d[["tcp.len","mqtt.len"]]); m1l=sm.OLS(L["mqtt.len"],sm.add_constant(L["tcp.len"])).fit()
fig,axs=plt.subplots(1,2)
axs[0].scatter(smp["tcp.len"],smp["mqtt.len"],s=4,alpha=0.4); xx=np.array([0,d["tcp.len"].max()]); axs[0].plot(xx,m1.params.iloc[0]+m1.params.iloc[1]*xx,"r")
axs[0].set_title(f"Valori brute, R² = {ro(m1.rsquared,3)}"); axs[0].set_xlabel("tcp.len"); axs[0].set_ylabel("mqtt.len")
ls=np.log1p(smp[["tcp.len","mqtt.len"]]); axs[1].scatter(ls["tcp.len"],ls["mqtt.len"],s=4,alpha=0.4); xx=np.array([0,L["tcp.len"].max()]); axs[1].plot(xx,m1l.params.iloc[0]+m1l.params.iloc[1]*xx,"r")
axs[1].set_title(f"După logaritm, R² = {ro(m1l.rsquared,3)}"); axs[1].set_xlabel("log(1 + tcp.len)"); axs[1].set_ylabel("log(1 + mqtt.len)")
for a in axs: fix(a)
fig.set_size_inches(14.3,5.46); fig.tight_layout(); save(fig,"image49.png",1430,546)
def rezid(a0,a1,fv,rs,t=""):  # reziduuri față de predicție + histograma cu curba normală (media și abaterea reziduurilor afișate)
    i=smp.index; a0.scatter(fv[i],rs[i],s=4,alpha=0.4); a0.axhline(0,color="r"); a0.set_title("Reziduuri față de predicție"+t); a0.set_xlabel("valoare prezisă"); a0.set_ylabel("reziduu")
    q=rs.quantile([.01,.99]); r=rs[(rs>=q.iloc[0])&(rs<=q.iloc[1])]; _,b,_=a1.hist(r,bins=50)
    xs=np.linspace(b[0],b[-1],300); a1.plot(xs,len(r)*(b[1]-b[0])*stats.norm.pdf(xs,r.mean(),r.std()),"r",lw=2,label="curba normală")
    a1.set_title("Histograma reziduurilor, 1% până la 99%"+t); a1.set_xlabel("reziduu"); a1.legend(frameon=False); fix(a0); fix(a1)
fig,axs=plt.subplots(2,2)
rezid(*axs[0],m1.fittedvalues,m1.resid," (brute)"); rezid(*axs[1],m1l.fittedvalues,m1l.resid," (logaritm)")
fig.set_size_inches(14.3,9.1); fig.tight_layout(); save(fig,"image50.png",1430,910)
m2=sm.OLS(d["tcp.time_delta"],sm.add_constant(d[["tcp.len","mqtt.len"]])).fit()
fig,axs=plt.subplots(1,2); rezid(*axs,m2.fittedvalues,m2.resid)
fig.set_size_inches(14.3,5.46); fig.tight_layout(); save(fig,"image51.png",1430,546)
fig,axs=plt.subplots(2,3)
for ax,a in zip(axs.flat,CL):
    gg=d[d.target==a]; m=sm.OLS(gg["mqtt.len"],sm.add_constant(gg["tcp.len"])).fit(); ss=gg if len(gg)<3000 else gg.sample(3000,random_state=42)
    ax.scatter(ss["tcp.len"],ss["mqtt.len"],s=4,alpha=0.4); xx=np.array([gg["tcp.len"].min(),gg["tcp.len"].max()]); ax.plot(xx,m.params.iloc[0]+m.params.iloc[1]*xx,"r")
    ax.set_title(f"{a}: panta {ro(m.params.iloc[1],3)}, R² = {ro(m.rsquared,3)}",fontsize=9); ax.set_xlabel("tcp.len",fontsize=8); ax.set_ylabel("mqtt.len",fontsize=8); ax.tick_params(labelsize=7); fix(ax)
fig.set_size_inches(16.9,9.1); fig.tight_layout(); save(fig,"image52.png",1690,910)
# ---------- 9: Cook, curve, probabilities ----------
fig,ax=plt.subplots(); ax.vlines(np.arange(1,len(cook)+1),0,cook,lw=0.5,alpha=0.6); n=len(cook)
ax.axhline(4/n,color="r",ls="--",lw=0.8,label=f"4/n = {ro(4/n*1e5,1)} · 10⁻⁵"); ax.set_title("Distanța Cook, modelul fără separare (maxim "+ro(cook.max(),4)+", pragul critic 0,5 sau 1)",fontsize=10)
ax.set_xlabel("numărul pachetului (rândul din fișier)"); ax.set_ylabel("distanța Cook"); ax.legend(fontsize=8); fix(ax)
ax.xaxis.set_major_formatter(FuncFormatter(lambda v,_: f"{int(v):,}".replace(",",".")))
fig.set_size_inches(13,5.2); fig.tight_layout(); save(fig,"image53.png",1300,520)
g6=sm.GLM(d.is_attack,sm.add_constant(d[["tcp.len","tcp.time_delta","mqtt.len"]]),family=sm.families.Binomial()).fit(); b=g6.params
t=np.linspace(0,2,200); pr=1/(1+np.exp(-(b.iloc[0]+b["tcp.len"]*12+b["tcp.time_delta"]*t+b["mqtt.len"]*10)))
fig,ax=plt.subplots(); ax.plot(t,pr,color="#d62728",lw=2); ax.axhline(0.5,color="gray",ls=":"); ax.set_ylim(0,1)
ax.set_title("Probabilitatea de atac prezisă de modelul final\n(tcp.len = 12 și mqtt.len = 10, valorile tipice; doar timpul variază)",fontsize=10); ax.set_xlabel("tcp.time_delta (secunde)"); ax.set_ylabel("P(atac)"); fix(ax)
fig.set_size_inches(10.5,4.8); fig.tight_layout(); save(fig,"image56.png",1050,480); print("curve p0",pr[0])
p=g6.predict(); fig,ax=plt.subplots(); bins=np.linspace(0,1,51)
ax.hist(p[d.is_attack==0],bins=bins,alpha=0.6,label="normal (0)"); ax.hist(p[d.is_attack==1],bins=bins,alpha=0.6,color="#e15759",label="atac (1)")
ax.set_yscale("log"); ax.set_xlabel("probabilitatea de atac prezisă"); ax.set_ylabel("pachete (scară log)"); ax.set_title("Ce scoate modelul final pentru fiecare pachet, separat pe grupul real",fontsize=10); ax.legend(); fix(ax)
fig.set_size_inches(10.5,4.8); fig.tight_layout(); save(fig,"image57.png",1050,480)
# ---------- 11.4 rules scatter ----------
F={"0x00000010":"ACK","0x00000018":"PSH+ACK","0x00000011":"FIN+ACK","0x00000002":"SYN","0x00000012":"SYN+ACK","0x00000004":"RST","0x00000019":"FIN+PSH+ACK","0x00000014":"RST+ACK"}
M={0:"fara",1:"CONNECT",2:"CONNACK",3:"PUBLISH",4:"PUBACK",5:"PUBREC",8:"SUBSCRIBE",9:"SUBACK",12:"PINGREQ",13:"PINGRESP",14:"DISCONNECT"}
tr=pd.DataFrame({"flags":d["tcp.flags"].map(F),"msgtype":d["mqtt.msgtype"].astype(int).map(M),"qos":d["mqtt.qos"].astype(int),"dupflag":d["mqtt.dupflag"].astype(int),
 "len":pd.cut(d["tcp.len"],[-1,0,20,1460,1e9],labels=["0","1-20","21-1460","1461+"]),"delta":pd.cut(d["tcp.time_delta"],[-1,3e-6,2.6e-5,1.7e-4,1e9],labels=["Q1","Q2","Q3","Q4"]),"target":d.target})
I=pd.get_dummies(tr.astype(str),prefix_sep="=")
def prune(r):
    keep=[]
    for _,row in r.iterrows():
        sub=r[(r.consequents==row.consequents)&(r.antecedents.apply(lambda x: x<row.antecedents))]
        keep.append(len(sub)==0 or row.confidence>sub.confidence.max())
    return r[keep]
r=association_rules(apriori(I,min_support=0.05,use_colnames=True),metric="confidence",min_threshold=0.6); r=prune(r[r.consequents.apply(len)==1])
r2=association_rules(apriori(I,min_support=150/len(I),use_colnames=True),metric="confidence",min_threshold=0.5); r2=r2[r2.consequents.apply(len)==1]
att=["target="+a for a in CL[1:]]; r2=prune(r2[r2.consequents.apply(lambda x:next(iter(x)) in att)&r2.antecedents.apply(lambda x:not any(i.startswith("target") for i in x))])
fig,axs=plt.subplots(1,2)
sc=axs[0].scatter(r.support,r.confidence,c=r.lift,cmap="Blues",s=14,edgecolors="gray",linewidths=0.3); cb=fig.colorbar(sc,ax=axs[0]); cb.set_label("lift"); cb.ax.yaxis.set_major_formatter(FuncFormatter(g))
axs[0].set_title(f"Rularea generală ({len(r)} reguli)"); axs[0].set_xlabel("support"); axs[0].set_ylabel("confidence")
cols={"dos":"#e8692f","bruteforce":"#1aae80","malformed":"#f0a30a","slowite":"#e377a6","flood":"#008000"}
for a in CL[1:]:
    s=r2[r2.consequents.apply(lambda x:next(iter(x))=="target="+a)]; axs[1].scatter(s.support,s.confidence,s=14,color=cols[a],label=a)
axs[1].set_xscale("log"); axs[1].set_title(f"Reguli pe atacuri ({len(r2)} reguli)"); axs[1].set_xlabel("support (scară logaritmică)"); axs[1].set_ylabel("confidence"); axs[1].legend(fontsize=8)
for a in axs: fix(a)
fig.set_size_inches(18,7.6); fig.tight_layout(); save(fig,"image64.png",1800,760)
