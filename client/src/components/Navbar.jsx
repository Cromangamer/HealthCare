import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../firebase/auth";
import { userLogout } from "../features/auth/firebaseLogin";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, firstName, lastName, profileImage } = useSelector(
    (state) => state.firebaseLogin,
  );

  const fullName = firstName + ' ' + lastName;
  const links = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Caregivers", to: "/caregivers" },
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ];



  const handlerLogout = async () => {
    await logout();
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-soft backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg transition-shadow duration-200 group-hover:shadow-primary/50">
            <i className="fas fa-heart-pulse" />
          </div>
          <div className="space-y-0.5">
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              Care24
            </p>
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
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="group flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-2 py-1.5 shadow-sm transition duration-200 hover:border-sky-200 hover:bg-sky-50 hover:shadow-md"
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-gradient-to-br from-sky-600 to-cyan-500 text-sm font-semibold text-white shadow-sm">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {(fullName?.trim()?.charAt(0) || "U").toUpperCase()}
                  </span>
                )}
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {fullName || "Profile"}
                </p>
                <p className="text-xs text-slate-500">View profile</p>
              </div>
            </Link>
          ) : (
            <Link
              to="/signin"
              className="care24-btn care24-btn--ghost rounded-full px-5 py-2 text-sm font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
