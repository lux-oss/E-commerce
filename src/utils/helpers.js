export const fmt = n => { const v=Number(n); if(isNaN(v)||!isFinite(v)) return "0 FCFA"; return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA"; };
export const disc = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
