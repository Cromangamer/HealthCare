import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Caregivers", to: "/caregivers" },
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-soft backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg transition-shadow duration-200 group-hover:shadow-primary/50">
            <i className="fas fa-heart-pulse" />
          </div>
          <div className="space-y-0.5">
            <p className="text-lg font-semibold tracking-tight text-slate-900">Care24</p>
            <p className="text-sm text-slate-500">Healthcare made human</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/signin"
            className="care24-btn care24-btn--ghost rounded-full px-4 py-2 text-sm font-semibold"
          >
            Sign In
          </Link>
          <Link
            to="/get-started"
            className="care24-btn care24-btn--primary rounded-full px-4 py-2 text-sm font-semibold"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white/98 px-4 pb-4 pt-2 shadow-soft lg:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${
                    isActive
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="care24-btn care24-btn--ghost rounded-full px-4 py-2 text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/get-started"
              onClick={() => setMenuOpen(false)}
              className="care24-btn care24-btn--primary rounded-full px-4 py-2 text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
