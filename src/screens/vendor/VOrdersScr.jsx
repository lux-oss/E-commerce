import { useState } from "react";
import Img from "../../components/Img";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import Loading from "../../components/Loading";
import { fmt } from "../../utils/helpers";

function VOrdersScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const { data, loading } = useLoad(() => vendor.getOrders(filter), [filter]);
  const orders = data?.orders || [];
  const counts = data?.counts || { all:0, new:0, preparing:0, shipped:0, delivered:0 };
  return(<div className="scr">
    <div className="appbar">{onBack&&<button onClick={onBack}>←</button>}<h2>Commandes ({counts.all})</h2><div style={{width:38}}/></div>
    <div className="vo-filter">{[["all","Tous",counts.all],["new","🆕 Nouvelles",counts.new],["preparing","🔄 En cours",counts.preparing],["shipped","🚚 Expédiées",counts.shipped],["delivered","✅ Livrées",counts.delivered]].map(([k,l,c])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l} ({c})</button>)}</div>
    <div style={{padding:"0 20px 100px"}}>
      {loading?<Loading/>:orders.map(o=><div key={o.id} className="vo-card" onClick={()=>go("vOrderDetail",o)}>
        <div className="vo-top"><span className="vo-ref">{o.ref}</span><span className={`vo-st ${o.status}`}>{o.status==="new"?"🆕 Nouvelle":o.status==="preparing"?"🔄 Préparation":o.status==="shipped"?"🚚 Expédiée":"✅ Livrée"}</span></div>
        <div className="vo-client">👤 {o.client} · {o.payment}</div>
        <div className="vo-items">{o.items.map((it,i)=><div key={i} className="vo-item"><div className="vo-item-img"><Img src={it.photo} emoji={it.img} style={{width:"100%",height:"100%"}} fit="cover"/></div><span>{it.qty}× {it.name}</span></div>)}</div>
        <div className="vo-bot"><span className="vo-total">{fmt(o.total)}</span><span className="vo-date">{o.date}</span></div>
      </div>)}
    </div>
  </div>);
}

export default VOrdersScr;
