/**
 * Loading & Error states for async screens
 */
function Loading({ text = "Chargement..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 12 }}>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: "rgba(99,102,241,.2)", borderTopColor: "#6366F1" }} />
      <span style={{ fontSize: 13, color: "#908C82" }}>{text}</span>
    </div>
  );
}

function ErrorMsg({ message = "Erreur de chargement", onRetry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 12, textAlign: "center" }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>{message}</span>
      {onRetry && <button onClick={onRetry} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid #E8E6E1", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🔄 Réessayer</button>}
    </div>
  );
}

function Empty({ icon = "📭", text = "Aucun résultat" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 8, textAlign: "center" }}>
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#908C82" }}>{text}</span>
    </div>
  );
}

export { Loading, ErrorMsg, Empty };
export default Loading;
