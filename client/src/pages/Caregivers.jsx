import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCaregivers } from "../api/caregiver";
import { getCaregiverReviews } from "../api/reviews";

function Caregivers(){
  const [query, setQuery] = useState("");
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewStats, setReviewStats] = useState({});
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try { const data = await getCaregivers(query ? { search: query } : undefined); if (active) { setCaregivers(data.caregivers); setError(""); const stats = {}; await Promise.all(data.caregivers.map(async (caregiver) => { try { const response = await getCaregiverReviews(caregiver._id); stats[caregiver._id] = { averageRating: response.data.averageRating || 0, totalReviews: response.data.totalReviews || 0 }; } catch { stats[caregiver._id] = { averageRating: 0, totalReviews: 0 }; } })); if (active) setReviewStats(stats); } }
      catch { if (active) setError("We couldn’t load caregivers right now. Please try again."); }
      finally { if (active) setLoading(false); }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [query]);
  return <main className="care24-page mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <section className="care24-card care24-card--elevated rounded-[2rem] p-6 sm:p-8 lg:p-10"><span className="care24-badge care24-badge--success">Care you can trust</span><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Meet Care24 caregivers</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Explore caring professionals with the skills and experience to support your family at home.</p><label className="mt-6 block max-w-xl"><span className="sr-only">Search caregivers</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="care24-input" placeholder="Search by name or care specialty" /></label></section>
    <section className="mt-6"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-600">{loading ? "Loading care professionals…" : `${caregivers.length} care professionals`}</p><p className="text-sm font-medium text-slate-500">Verified profiles</p></div>{error ? <div className="care24-alert care24-alert--error">{error}</div> : loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="care24-card p-6"><div className="care24-skeleton h-12 w-48" /><div className="care24-skeleton mt-5 h-5 w-28" /><div className="care24-skeleton mt-3 h-4 w-full" /></div>)}</div> : caregivers.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{caregivers.map(caregiver => { const user = caregiver.userId || {}; const name = `${user.firstName || "Care"} ${user.lastName || "Professional"}`; const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2); return <article key={caregiver._id} className="care24-card p-6"><div className="flex items-center gap-3"><span className="care24-avatar">{user.profileImage ? <img src={user.profileImage} alt="" className="h-full w-full rounded-full object-cover" /> : initials}</span><div><h2 className="font-semibold text-slate-900">{name}</h2><p className="text-sm text-slate-500">{caregiver.qualification?.[0] || "Care professional"}</p></div></div>{caregiver.isVerified && <span className="care24-badge care24-badge--success mt-5">Verified</span>}<p className="mt-3 font-medium text-slate-800">{caregiver.specialization?.join(", ") || "General care"}</p><p className="mt-2 text-sm text-slate-600">Speaks {caregiver.languages?.join(", ") || "Languages not listed"}</p>{reviewStats[caregiver._id] ? <p className="mt-3 text-sm font-semibold text-slate-700">⭐ {reviewStats[caregiver._id].averageRating.toFixed(1)} ({reviewStats[caregiver._id].totalReviews} Reviews)</p> : <p className="mt-3 text-sm font-semibold text-slate-700">⭐ 0.0 (0 Reviews)</p>}<Link to="/services" className="care24-btn care24-btn--ghost mt-5 w-full">View available services</Link></article>; })}</div> : <div className="care24-empty"><p className="font-semibold text-slate-800">No caregivers found</p><p className="text-sm">Try a different name or specialty.</p></div>}</section>
  </main>
}

export default Caregivers;
