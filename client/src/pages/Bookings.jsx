import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBooking, getBookings, updateBookingStatus } from "../api/bookings";
import { submitReview } from "../api/reviews";

function Bookings() {
  const role = useSelector((state) => state.firebaseLogin.role);
  const [view, setView] = useState("active");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      setLoading(true);
      setMessage("");
      try {
        const response = await getBookings(view === "history" ? { status: "completed,cancelled" } : { status: "pending,accepted,started,rejected" });
        if (!active) return;

        const items = response.data.bookings || [];
        setBookings(items);
        setSelectedBooking(items[0] || null);
        setReviewedBookingIds((current) => current.filter((id) => items.some((item) => item._id === id)));
      } catch (error) {
        if (!active) return;
        setMessage(error.response?.data?.message || "We could not load bookings right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [view]);

  async function openDetails(bookingId) {
    try {
      const response = await getBooking(bookingId);
      setSelectedBooking(response.data.booking || null);
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not load this booking details.");
    }
  }

  async function handleStatusChange(booking, nextStatus) {
    setBusyId(booking._id);
    try {
      const response = await updateBookingStatus(booking._id, nextStatus);
      const updatedBooking = response.data.booking;
      setBookings((current) =>
        current.map((item) => (item._id === booking._id ? { ...item, status: updatedBooking.status } : item))
      );
      setSelectedBooking((current) =>
        current && current._id === booking._id ? { ...current, status: updatedBooking.status } : current
      );
      setMessage(`Booking ${statusLabel(nextStatus)} successfully.`);
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not update this booking.");
    } finally {
      setBusyId(null);
    }
  }

  function openReviewModal(booking) {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment("");
    setReviewModalOpen(true);
  }

  async function submitBookingReview(event) {
    event.preventDefault();
    if (!reviewBooking) return;
    setReviewSubmitting(true);
    try {
      await submitReview({ bookingId: reviewBooking._id, caregiverId: reviewBooking.caregiverId?._id || reviewBooking.caregiverId, rating: reviewRating, comment: reviewComment });
      setReviewedBookingIds((current) => [...current, reviewBooking._id]);
      setReviewModalOpen(false);
      setReviewBooking(null);
      setMessage("Review submitted successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not submit your review.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  function statusLabel(status) {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
  }

  function allowedActions(booking) {
    const status = booking.status;

    if (role === "patient") {
      return status === "pending" || status === "accepted" ? ["cancelled"] : [];
    }

    if (role === "caregiver") {
      if (status === "pending") return ["accepted", "rejected"];
      if (status === "accepted") return ["started", "cancelled"];
      if (status === "started") return ["completed", "cancelled"];
      return [];
    }

    if (role === "admin") {
      if (status === "pending") return ["accepted", "rejected", "cancelled"];
      if (status === "accepted") return ["started", "cancelled"];
      if (status === "started") return ["completed", "cancelled"];
      return [];
    }

    return [];
  }

  const actionLabel = (action) => {
    if (action === "cancelled") return "Cancel booking";
    if (action === "accepted") return "Accept";
    if (action === "rejected") return "Reject";
    if (action === "started") return "Start service";
    if (action === "completed") return "Mark complete";
    return statusLabel(action);
  };

  return (
    <main className="care24-page mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="care24-card care24-card--elevated rounded-[2rem] p-7 sm:p-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="care24-badge care24-badge--success">Booking management</span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Manage care requests and visits</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Review bookings, update status, cancel requests, and view your complete booking history in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/booking" className="care24-btn care24-btn--primary">Create booking</Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => setView("active")} className={`rounded-full px-4 py-2 text-sm font-semibold ${view === "active" ? "bg-primary text-white" : "bg-slate-100 text-slate-700"}`}>
            Active bookings
          </button>
          <button type="button" onClick={() => setView("history")} className={`rounded-full px-4 py-2 text-sm font-semibold ${view === "history" ? "bg-primary text-white" : "bg-slate-100 text-slate-700"}`}>
            Booking history
          </button>
        </div>

        {message ? <div className={`care24-alert mt-5 ${message.includes("successfully") ? "care24-alert--success" : "care24-alert--error"}`}>{message}</div> : null}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="care24-card rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{view === "history" ? "History" : "Current requests"}</h2>
            <span className="text-sm text-slate-500">{bookings.length} item{bookings.length === 1 ? "" : "s"}</span>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="care24-skeleton h-24" />
              ))}
            </div>
          ) : bookings.length ? (
            <ul className="mt-6 space-y-3">
              {bookings.map((booking) => (
                <li key={booking._id} className={`rounded-[1.5rem] border p-4 ${selectedBooking?._id === booking._id ? "border-primary bg-slate-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.serviceId?.serviceType || "Care service"}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {booking.patientId?.userId?.firstName ? `${booking.patientId.userId.firstName} ${booking.patientId.userId.lastName || ""}`.trim() : "Patient details available"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                      {statusLabel(booking.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{booking.notes || "No notes were added for this request."}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => openDetails(booking._id)} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                      View details
                    </button>
                    {role === "patient" && booking.status === "completed" && !reviewedBookingIds.includes(booking._id) ? (
                      <button type="button" onClick={() => openReviewModal(booking)} className="rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                        Leave Review
                      </button>
                    ) : role === "patient" && booking.status === "completed" ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Review Submitted</span>
                    ) : null}
                    {allowedActions(booking).map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => handleStatusChange(booking, action)}
                        disabled={busyId === booking._id}
                        className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white"
                      >
                        {busyId === booking._id ? "Working..." : actionLabel(action)}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="care24-empty mt-6">No bookings found for this view yet.</div>
          )}
        </div>

        <div className="care24-card rounded-[2rem] p-6">
          <h2 className="text-lg font-semibold text-slate-900">Booking details</h2>
          {selectedBooking ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Service</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{selectedBooking.serviceId?.serviceType || "Care service"}</p>
                <p className="mt-2 text-sm text-slate-600">{selectedBooking.serviceId?.description || "Detailed description will appear here."}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{statusLabel(selectedBooking.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Payment</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedBooking.paymentMethod || "cash"}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Patient</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedBooking.patientId?.userId?.firstName ? `${selectedBooking.patientId.userId.firstName} ${selectedBooking.patientId.userId.lastName || ""}`.trim() : "Patient record"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Caregiver</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedBooking.caregiverId?.userId?.firstName ? `${selectedBooking.caregiverId.userId.firstName} ${selectedBooking.caregiverId.userId.lastName || ""}`.trim() : "Caregiver record"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Notes</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{selectedBooking.notes || "No notes were provided for this booking."}</p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Created</p>
                <p className="mt-2 text-sm text-slate-600">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="care24-empty mt-6">Select a booking to view its details.</div>
          )}
        </div>
      </section>

      {reviewModalOpen && reviewBooking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Leave a review</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Share your experience</h3>
            <form onSubmit={submitBookingReview} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Rating
                <div className="mt-2 flex gap-2 text-2xl text-amber-500">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setReviewRating(value)} className={value <= reviewRating ? "text-amber-500" : "text-slate-300"}>
                      ★
                    </button>
                  ))}
                </div>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Comment
                <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} className="care24-input mt-2 min-h-24" placeholder="Share a few words about your visit" />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="care24-btn care24-btn--ghost">Cancel</button>
                <button type="submit" disabled={reviewSubmitting} className="care24-btn care24-btn--primary">
                  {reviewSubmitting ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default Bookings;
