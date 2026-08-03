import { useState } from "react";
import { signInWithGoogle, sendOTP, verifyOTP } from "../firebase/auth";
import { useDispatch } from "react-redux";
import { userLogin } from "../api/login";
import { useNavigate, useLocation } from "react-router-dom";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.55Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.24-2.5c-.9.6-2.04.96-3.37.96-2.59 0-4.79-1.75-5.57-4.1H3.07v2.57A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.43 13.93A6.02 6.02 0 0 1 6.43 10.07V7.5H3.07a10 10 0 0 0 0 12.86l3.36-2.43Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.04c1.46 0 2.78.5 3.82 1.48l2.86-2.86A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.36 2.43C7.21 7.79 9.41 6.04 12 6.04Z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 2.75A2.25 2.25 0 0 0 4.35 5v14A2.25 2.25 0 0 0 6.6 21.25h10.8A2.25 2.25 0 0 0 19.65 19V5a2.25 2.25 0 0 0-2.25-2.25H6.6Zm0 1.5h10.8a.75.75 0 0 1 .75.75v14a.75.75 0 0 1-.75.75H6.6a.75.75 0 0 1-.75-.75V5a.75.75 0 0 1 .75-.75Zm5.4 2.25a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm0 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
      />
    </svg>
  );
}

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a phone number first.");
      return;
    }

    setIsSubmitting(true);
    const formattedNumber = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;

    const result = await sendOTP(formattedNumber);
    if (result.success) {
      setOtpSent(true);
      alert("OTP sent successfully!");
    } else if (result.error?.includes("billing-not-enabled")) {
      alert(
        "We're currently experiencing technical issues with phone login. Please continue with Google.",
      );
    } else {
      alert(result.error || "Unable to send OTP right now.");
    }
    setIsSubmitting(false);
  };

  const handleVerifyOTP = async () => {
    setIsSubmitting(true);
    const result = await verifyOTP(otp);

    if (result.success) {
      try {
        await dispatch(userLogin(result.token)).unwrap();
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Phone login failed", error);
        alert("Login failed. Please try again in a moment.");
      }
    } else {
      alert(result.error || "Unable to verify OTP.");
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const result = await signInWithGoogle();
    console.log("Google Result:", result);
    if (!result.success) {
      alert(result.error || "Google sign-in is unavailable right now.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Dispatching login...");
      const user = await dispatch(userLogin(result.token)).unwrap();
      console.log("Backend returned:", user);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login failed", error);
      alert("Login failed. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="care24-card care24-card--elevated overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <span className="care24-badge care24-badge--success">
            Secure sign-in
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back to Care24
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
            Sign in quickly with your Google account or your phone number to
            continue booking trusted care services.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm font-semibold text-slate-700">
              Why patients choose Care24
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Verified caregivers and fast booking</li>
              <li>• Support for home care, nursing, and consultations</li>
              <li>• Simple and secure sign-in from any device</li>
            </ul>
          </div>
        </section>

        <section className="care24-card rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div id="recaptcha-container" className="mb-4" />

          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="care24-btn care24-btn--ghost flex w-full items-center justify-center gap-3 rounded-[1rem] border-slate-200 bg-white py-3 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium text-slate-500">
              or continue with phone
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <label className="care24-form__label text-sm">
            Phone number
            <div className="mt-2 flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3">
              <PhoneIcon />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="care24-input border-0 bg-transparent p-0 shadow-none focus:ring-0"
              />
            </div>
          </label>

          <button
            onClick={handleSendOTP}
            disabled={isSubmitting}
            className="care24-btn care24-btn--primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : "Send OTP"}
          </button>

          {otpSent && (
            <div className="mt-5 space-y-4">
              <label className="care24-form__label text-sm">
                One-time password
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="care24-input mt-2"
                />
              </label>

              <button
                onClick={handleVerifyOTP}
                disabled={isSubmitting}
                className="care24-btn care24-btn--secondary w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Login;
