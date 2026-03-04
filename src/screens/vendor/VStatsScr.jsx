import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import Loading from "../../components/Loading";
import { fmt } from "../../utils/helpers";

function VStatsScr({onBack}){
  const [period,setPeriod]=useState("month");
  const { data: V_STATS, loading } = useLoad(() => vendor.getReports(period), [period]);
  if(loading||!V_STATS) return <div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div><Loading/></div>;
  const s=V_STATS[period]||V_STATS.month||V_STATS;
  const chart=V_STATS.chartWeek||[];
  const tp=V_STATS.topProducts||[];
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div>
    <div className="vo-filter">{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
      <div className="vd-stat"><div className="vds-val">{fmt(s?.revenue||0)}</div><div className="vds-lbl">💰 Revenus</div></div>
      <div className="vd-stat"><div className="vds-val">{s?.orders||0}</div><div className="vds-lbl">📦 Commandes</div></div>
      <div className="vd-stat"><div className="vds-val">{s?.visitors||0}</div><div className="vds-lbl">👁️ Visiteurs</div></div>
    </div>
    <div className="sec"><h3>📈 Évolution</h3></div>
    <div className="vd-chart"><div className="vd-bars">{chart.map((v,i)=><div key={i} className="vd-bar" style={{height:v/2+20}}><div className="vd-bv">{v>0?Math.round(v/1000)+"k":""}</div></div>)}</div></div>
    <div className="sec"><h3>🏆 Top produits</h3></div>
    {tp.map((p,i)=><div key={i} className="vd-top"><span className="vdt-r">#{i+1}</span><div className="vdt-i"><h4>{p.name}</h4><span>{p.sold} vendus · {fmt(p.revenue)}</span></div></div>)}
  </div>);
}

export default VStatsScr;
