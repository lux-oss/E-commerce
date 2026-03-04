import { useState } from "react";
import { useLoad } from "../../hooks";
import { user as userSvc } from "../../services";
import { fmt } from "../../utils/helpers";
import Loading from "../../components/Loading";

function CouponsScr({onBack}){
  const [copied,setCopied]=useState(null);
  const { data: COUPONS, loading } = useLoad(() => userSvc.getCoupons());
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Coupons & Codes</h2><div style={{width:38}}/></div>
    {loading?<Loading/>:(COUPONS||[]).map(c=><div key={c.id} className="coupon"><div className="coupon-left">{c.free?"🚚":`${c.discount}%`}</div><div className="coupon-right"><h4>{c.desc}</h4><p>Expire le {c.expires}{c.min>0&&` · Min. ${fmt(c.min)}`}</p><span className="cc" onClick={()=>setCopied(c.code)}>{copied===c.code?"✓ Copié !":c.code}</span></div></div>)}
  </div>);
}

export default CouponsScr;
