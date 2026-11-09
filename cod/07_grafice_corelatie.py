import sys, numpy as np, pandas as pd, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from scipy import stats
d=pd.read_csv(sys.argv[1],low_memory=False); out=sys.argv[2]
V=["tcp.time_delta","tcp.len","mqtt.len","mqtt.kalive","mqtt.qos","mqtt.dupflag","mqtt.retain","mqtt.conflag.cleansess","mqtt.conflag.passwd","mqtt.conflag.uname","mqtt.proto_len","mqtt.ver","mqtt.conack.val"]
ro=lambda v,dec=2: f"{(0.0 if round(v,dec)==0 else v):.{dec}f}".replace(".",",").replace("-","−")
cm=plt.get_cmap("RdBu").copy(); cm.set_bad("#dddddd")
def heat(g,title,fn):
    c=g[V].corr("spearman").values  # constant columns -> NaN (gray)
    fig,ax=plt.subplots(figsize=(11.7,9.88),dpi=100)
    im=ax.imshow(np.ma.masked_invalid(c),cmap=cm,vmin=-1,vmax=1)
    for i in range(len(V)):
        for j in range(len(V)):
            if not np.isnan(c[i,j]): ax.text(j,i,ro(c[i,j]),ha="center",va="center",fontsize=7.5,color="white" if abs(c[i,j])>0.5 else "black")
    ax.set_xticks(range(len(V))); ax.set_xticklabels(V,rotation=90,fontsize=9); ax.set_yticks(range(len(V))); ax.set_yticklabels(V,fontsize=9)
    cb=fig.colorbar(im,ax=ax,shrink=0.8); cb.ax.yaxis.set_major_formatter(FuncFormatter(lambda v,_: ro(v)))
    ax.set_title(title,fontsize=10); fig.tight_layout(); fig.savefig(f"{out}/{fn}"); plt.close(fig)
heat(d,"Corelația Spearman, variabile numerice, ordinale și binare, tot setul (gri = nu se poate calcula)","image40.png")
for k,cls in zip(range(42,48),["legitimate","dos","bruteforce","malformed","slowite","flood"]):
    heat(d[d.target==cls],f"Corelația Spearman, {cls} (gri = variabilă constantă în această clasă)",f"image{k}.png")
s=d.sample(8000,random_state=42)
fig,axs=plt.subplots(1,3,figsize=(15.6,4.94),dpi=100)
for ax,(x,y) in zip(axs,[("tcp.len","mqtt.len"),("tcp.time_delta","tcp.len"),("tcp.time_delta","mqtt.len")]):
    R,p=stats.spearmanr(d[x],d[y])  # R and p on all packets, plot on the sample
    rx,ry=s[x].rank(),s[y].rank(); ax.scatter(rx,ry,s=4,c="black",alpha=0.3)
    b1,b0=np.polyfit(rx,ry,1); xx=np.array([rx.min(),rx.max()]); ax.plot(xx,b0+b1*xx,color="#3355aa")
    ax.set_xlabel(f"{x} (rang)"); ax.set_ylabel(f"{y} (rang)"); ax.set_title(f"R (Spearman) = {ro(R)}, p < 0,001",fontsize=10)
    print(x,y,R,p)
fig.tight_layout(); fig.savefig(f"{out}/image41.png"); plt.close(fig)
