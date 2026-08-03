import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createBooking } from "../api/bookings";

function Booking() {
  const location = useLocation();
  const service = location.state?.service;
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function confirm() {
    if (!service?._id) return;
    setSaving(true);
    setMessage("");
    try {
      await createBooking({ serviceId: service._id, notes });
      setMessage("Your booking request has been sent successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "We couldn’t create this booking. Ensure your patient profile is complete.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="care24-page mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="care24-card care24-card--elevated rounded-[2rem] p-7 sm:p-10">
        <span className="care24-badge care24-badge--success">
          Secure booking
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Let’s arrange your care
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          {service
            ? `You selected ${service.serviceType}. `
            : "Choose a provider first, then "}
          we’ll help you coordinate the details with a suitable care
          professional.
        </p>
        {message && (
          <div
            className={`care24-alert mt-5 ${message.startsWith("Your") ? "care24-alert--success" : "care24-alert--error"}`}
          >
            {message}
          </div>
        )}
        {service?._id && (
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">
              {service.serviceType}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              ₹{service.price} / {service.priceType.replace("_", " ")}
            </p>
            <label className="care24-form__label mt-5">
              Notes for your care team
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="care24-input min-h-24 resize-y"
                maxLength="1000"
              />
            </label>
            <button
              disabled={saving}
              onClick={confirm}
              className="care24-btn care24-btn--primary mt-5"
            >
              {saving ? "Sending request…" : "Confirm booking"}
            </button>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/bePatient" className="care24-btn care24-btn--ghost">
            Complete patient profile
          </Link>
          <Link to="/services" className="care24-btn care24-btn--ghost">
            Browse services
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Booking;
