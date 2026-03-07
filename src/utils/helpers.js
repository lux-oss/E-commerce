export const fmt = n => { const v=Number(n); if(isNaN(v)||!isFinite(v)) return "0 FCFA"; return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA"; };
export const disc = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

// Vendor promo: returns {promoPrice, promoDiscount, promoName} or null
export const getVendorPromo = (product, vendors) => {
  if (!vendors || !product) return null;
  const v = vendors.find(x => x.name === product.vendor);
  if (!v || !v.promo || !v.promo.discount) return null;
  const d = v.promo.discount;
  const promoPrice = Math.round(product.price * (1 - d / 100));
  return { promoPrice, promoDiscount: d, promoName: v.promo.name, promoEnds: v.promo.ends };
};

// Effective price (considers both old price discount and vendor promo)
export const effectivePrice = (product, vendors) => {
  const vp = getVendorPromo(product, vendors);
  if (vp) return vp.promoPrice;
  return product.price;
};

// Total discount % (vendor promo takes priority display)
export const totalDisc = (product, vendors) => {
  const vp = getVendorPromo(product, vendors);
  if (vp) return vp.promoDiscount;
  return disc(product);
};
