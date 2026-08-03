import { Link } from "react-router-dom";

function Footer () {
    return (
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div><p className="text-xl font-bold text-primary">Care24</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">Compassionate healthcare and elderly care, made easier for every family.</p></div>
          <div><p className="text-sm font-semibold text-slate-900">Explore</p><div className="mt-3 grid gap-2 text-sm text-slate-600"><Link to="/services">Services</Link><Link to="/caregivers">Caregivers</Link><Link to="/about">About Care24</Link></div></div>
          <div><p className="text-sm font-semibold text-slate-900">Need support?</p><p className="mt-3 text-sm leading-6 text-slate-600">Our care coordinators are here to help you choose the right next step.</p><Link to="/contact" className="mt-3 inline-block text-sm font-semibold text-primary">Contact Care24 →</Link></div>
        </div>
        <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} Care24. Healthcare made human.</div>
      </footer>
    );
}

export default Footer
