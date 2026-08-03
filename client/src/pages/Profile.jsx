import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import { userLogout } from "../features/auth/firebaseLogin";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    authProvider,
    isActive,
    firstName,
    lastName,
    email,
    emailVerified,
    role,
    profileImage,
    profileCompleted,
  } = useSelector((state) => state.firebaseLogin);
  const image = profileImage;
  const displayName = `${firstName || "Care"} ${lastName || "User"}`.trim();
  const initials = `${(firstName || "C").charAt(0).toUpperCase()}${(lastName || "U").charAt(0).toUpperCase()}`;
  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Member";
  const accountStatus = isActive ? "Active" : "Suspended";
  const verificationLabel = emailVerified ? "Verified" : "Pending verification";
  const profileStatus = profileCompleted
    ? "Profile completed"
    : "Profile needs a quick update";

  function handlerPatient() {
    navigate("/bePatient");
  }

  function handlerCaregiver() {
    navigate("/beCaregiver");
  }

  function handlerPatientDashboard() {
    navigate("/PatientDashboard");
  }

  function handlerCaregiverDashboard() {
    navigate("/CaregiverDashboard");
  }

  function handlerAdminDashboard() {
    navigate("/admin");
  }

  async function handleLogout() {
    dispatch(userLogout());
    await logout();
    navigate("/");
  }

  if (!isActive) {
    return (
      <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <section className="care24-card care24-card--elevated w-full rounded-[2rem] p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-600">
              !
            </div>
            <h1 className="mt-5 text-3xl font-semibold">Account suspended</h1>
            <p className="mt-3 text-base text-slate-600">
              Your account is currently unavailable. Please contact support to
              restore access.
            </p>
            <button
              onClick={handleLogout}
              className="care24-btn care24-btn--ghost mt-6"
            >
              Return to login
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="care24-card care24-card--elevated overflow-hidden rounded-[2rem]">
          <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-white text-lg font-semibold text-blue-700 shadow-lg sm:h-20 sm:w-20 sm:text-xl">
                  {image ? (
                    <img
                      src={image}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                    My profile
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                    {displayName}
                  </h1>
                  <p className="mt-1 text-sm text-blue-50">
                    {email || "Your email will appear here"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                  {accountStatus}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                  {verificationLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
            <div className="space-y-4">
              <div className="care24-widget p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Account overview
                  </h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {roleLabel}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Role
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {roleLabel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Signed in via
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {authProvider || "Care24 account"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {accountStatus}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Verification
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {verificationLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="care24-widget p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Quick actions
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {role === "user" && (
                    <>
                      <button
                        onClick={handlerPatient}
                        className="care24-btn care24-btn--primary"
                      >
                        Become patient
                      </button>
                      <button
                        onClick={handlerCaregiver}
                        className="care24-btn care24-btn--secondary"
                      >
                        Become caregiver
                      </button>
                    </>
                  )}

                  {role === "patient" && (
                    <button
                      onClick={handlerPatientDashboard}
                      className="care24-btn care24-btn--primary"
                    >
                      Patient dashboard
                    </button>
                  )}

                  {role === "caregiver" && (
                    <button
                      onClick={handlerCaregiverDashboard}
                      className="care24-btn care24-btn--primary"
                    >
                      Caregiver dashboard
                    </button>
                  )}
                  {role === "admin" && (
                    <button
                      onClick={handlerAdminDashboard}
                      className="care24-btn care24-btn--primary"
                    >
                      Admin dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="care24-btn care24-btn--ghost"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>

            <div className="care24-widget p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Profile completion
              </h2>

              <div className="mt-4 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  {profileStatus}
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    style={{ width: `${profileCompleted ? 100 : 72}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A complete profile helps us match you with the right care
                  services faster and more accurately.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Account health
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {isActive
                      ? "Everything looks good. You can continue using Care24 without interruption."
                      : "Your account needs attention before you can continue."}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Need help?
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Reach out to support if you want to update your details or
                    change your role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
