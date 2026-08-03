import { Link } from "react-router-dom";

function CaregiverDashboard() {
    return <main className="care24-page mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><section className="care24-card care24-card--elevated rounded-[2rem] p-7 sm:p-9"><span className="care24-badge care24-badge--success">Caregiver dashboard</span><h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome to your care workspace</h1><p className="mt-2 text-slate-600">Manage your professional profile and keep on top of new care requests.</p></section><section className="mt-6 grid gap-5 md:grid-cols-3">{[["New requests","Requests will appear here when families book your services."],["Profile visibility","A complete profile helps families find you."],["Care activity","No appointments scheduled yet."]].map(([title, text])=><article key={title} className="care24-card p-6"><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</section><div className="mt-6 flex flex-wrap gap-3"><Link to="/bookings" className="care24-btn care24-btn--primary">Manage bookings</Link><Link to="/chat" className="care24-btn care24-btn--ghost">Open chat</Link><Link to="/caregiver-services" className="care24-btn care24-btn--ghost">My services</Link></div></main>;
}

export default CaregiverDashboard;
