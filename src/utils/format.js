export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PK', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
}
export function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-PK', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
export function genTicketId() {
  const now = new Date();
  return `PRE-${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*9000)+1000).padStart(4,'0')}`;
}
