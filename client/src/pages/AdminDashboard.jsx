import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "../api/config";

function AdminDashboard(){
  const [analytics, setAnalytics] = useState(null); const [error, setError] = useState("");
  useEffect(() => { let active = true; async function load() { try { const response = await axios.get(`${apiBaseUrl}/admin/analytics`, { headers: { Authorization: `Bearer ${await getToken()}` } }); if (active) setAnalytics(response.data); } catch { if (active) setError("Analytics are unavailable right now."); } } load(); return () => { active = false; }; }, []);
  const cards = analytics ? [["Services", analytics.services], ["Bookings", analytics.bookings], ["Pending", analytics.pendingBookings], ["Completed", analytics.completedBookings]] : [];
  return <main className="care24-page min-h-screen px-4 py-8 sm:px-6 lg:px-8"><section className="care24-card mx-auto max-w-7xl rounded-[2rem] p-7 sm:p-9"><span className="care24-badge">Admin workspace</span><h1 className="mt-3 text-3xl font-semibold text-slate-900">Care24 operations</h1><p className="mt-2 text-slate-600">Live platform activity and care records.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/admin/services" className="care24-btn care24-btn--primary">Manage services</Link></div>{error ? <p className="care24-alert care24-alert--error mt-6">{error}</p> : <div className="mt-7 grid gap-4 md:grid-cols-4">{cards.length ? cards.map(([title, value]) => <div key={title} className="care24-widget p-5"><p className="font-semibold text-slate-900">{title}</p><p className="mt-2 text-2xl font-bold text-primary">{value}</p></div>) : Array.from({ length: 4 }).map((_, index) => <div key={index} className="care24-skeleton h-28" />)}</div>}</section></main>;
}

export default AdminDashboard;
