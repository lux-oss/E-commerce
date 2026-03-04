import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import Loading from "../../components/Loading";
import { fmt } from "../../utils/helpers";

function VDashboardScr({go}){
  const [period,setPeriod]=useState("month");
  const { data, loading } = useLoad(() => vendor.getDashboard(period), [period]);
  if(loading||!data) return <div className="scr" style={{padding:20}}><h2 style={{marginBottom:16}}>📊 Tableau de bord</h2><Loading/></div>;
  const { stats:s, new_orders:newOrders, recent_orders:recentOrders=[], chart=[], top_products:topProducts=[] } = data;
  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><h2>📊 Tableau de bord</h2><button onClick={()=>go("vNotif")}>🔔</button></div>
    <div className="vo-filter">{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
      <div className="vd-stat" onClick={()=>go("vWallet")}><div className="vds-val">{fmt(s?.revenue||0)}</div><div className="vds-lbl">💰 Revenus</div></div>
      <div className="vd-stat" onClick={()=>go("vOrdersList")}><div className="vds-val">{s?.orders||0}</div><div className="vds-lbl">📦 Commandes</div></div>
      <div className="vd-stat" onClick={()=>go("vStats")}><div className="vds-val">{s?.visitors||0}</div><div className="vds-lbl">👁️ Visiteurs</div></div>
    </div>
    {newOrders>0&&<div className="vd-alert" onClick={()=>go("vOrdersList")}><span>🆕</span> {newOrders} nouvelle{newOrders>1?"s":""} commande{newOrders>1?"s":""} !</div>}
    <div className="sec"><h3>🗓️ Ventes de la semaine</h3></div>
    <div className="vd-chart"><div className="vd-bars">{chart.map((v,i)=><div key={i} className="vd-bar" style={{height:v/2+20}}><div className="vd-bv">{v>0?Math.round(v/1000)+"k":""}</div></div>)}</div></div>
    <div className="sec"><h3>🏆 Top produits</h3><span onClick={()=>go("vProducts")}>Voir tout</span></div>
    {topProducts.map((p,i)=><div key={i} className="vd-top"><span className="vdt-r">#{i+1}</span><div className="vdt-i"><h4>{p.name}</h4><span>{p.sold} vendus · {fmt(p.revenue)}</span></div></div>)}
    <div className="vd-quick">{[["vProducts","📦","Articles"],["vOrdersList","📋","Commandes"],["vReviews","⭐","Avis"],["vStats","📈","Stats"],["vWallet","💰","Wallet"],["vPromos","🏷️","Promos"]].map(([k,i,l])=><div key={k} className="vdq" onClick={()=>go(k)}><span>{i}</span><div>{l}</div></div>)}</div>
  </div>);
}

export default VDashboardScr;
