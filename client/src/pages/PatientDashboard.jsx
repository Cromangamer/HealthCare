

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings } from "../api/bookings";

function PatientDashboard() {
  const [bookings, setBookings] = useState([]); const [error, setError] = useState("");
  useEffect(() => { let active = true; getBookings().then((data) => { if (active) setBookings(data.data.bookings || []); }).catch(() => { if (active) setError("Bookings are unavailable right now."); }); return () => { active = false; }; }, []);
  return <main className="care24-page mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><section className="care24-card care24-card--elevated rounded-[2rem] p-7 sm:p-9"><span className="care24-badge care24-badge--success">Patient dashboard</span><h1 className="mt-3 text-3xl font-semibold text-slate-900">Your care, in one place</h1><p className="mt-2 text-slate-600">Keep your profile ready and follow every care request.</p></section><section className="care24-card mt-6 p-6"><h2 className="text-lg font-semibold text-slate-900">Your bookings</h2>{error ? <p className="care24-alert care24-alert--error mt-4">{error}</p> : bookings.length ? <ul className="mt-4 space-y-3">{bookings.map((booking) => <li key={booking._id} className="rounded-2xl bg-slate-50 p-4"><p className="font-medium text-slate-900">{booking.serviceId?.serviceType}</p><p className="mt-1 text-sm text-slate-600">Status: {booking.status}</p></li>)}</ul> : <div className="care24-empty mt-4">No bookings yet. Find a service to get started.</div>}</section><div className="mt-6 flex flex-wrap gap-3"><Link to="/services" className="care24-btn care24-btn--primary">Find a care service</Link><Link to="/bookings" className="care24-btn care24-btn--ghost">Manage bookings</Link><Link to="/chat" className="care24-btn care24-btn--ghost">Open chat</Link></div></main>;
}

export default PatientDashboard;
