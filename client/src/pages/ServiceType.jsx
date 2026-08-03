import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SERVICE_CATALOG = [
  {
    serviceType: "Companion Care",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.-Gr5bPsbKmDn8ksFO6bFxwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    serviceType: "Doctor Consultation",
    image:
      "https://thumbs.dreamstime.com/z/female-doctor-patient-smiling-consultation-clinic-health-checkup-female-doctor-patient-smiling-consultation-clinic-health-255018566.jpg",
  },
  {
    serviceType: "Elderly Care",
    image:
      "https://hopehospice.com/wp-content/uploads/2020/06/blog-banner-caregiver-help-2.jpg",
  },
  {
    serviceType: "Home Nursing",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.B8QlQ7ir3hp-lH-45QyyFAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    serviceType: "ICU Care",
    image:
      "https://assets.hillrom.com/is/image/hillrom/Hero%20Banner%20-%20Solutions%20-%20Desktop%20-%202880%20x%201400_b?$heroBannerFocusAreaDesktop$",
  },
  {
    serviceType: "Medical Attendant",
    image: "https://images.indianexpress.com/2015/03/medicines-l.jpg",
  },
  {
    serviceType: "Other",
    image:
      "https://caregiverspune.com/wp-content/uploads/2023/03/medium-shot-nurse-checking-man-scaled.jpg",
  },
  {
    serviceType: "Physiotherapy",
    image:
      "https://static.vecteezy.com/system/resources/previews/042/625/450/non_2x/physiotherapist-working-with-patient-in-clinic-closeup-a-modern-rehabilitation-physiotherapy-worker-with-senior-client-physical-therapist-stretching-patient-knee-photo.jpg",
  },
  {
    serviceType: "Post Surgery Care",
    image:
      "https://focusfamilycare.com/wp-content/uploads/2025/04/post_operative_patient_care-1024x572.jpg",
  },
  {
    serviceType: "Palliative Care",
    image:
      "https://www.verywellhealth.com/thmb/_3bT_Bga46-iCh2WLN3bDp7JsKs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-895087964-7949e17fa32f4dd88d1c3b43f94b1d13.jpg",
  },
];

function ServiceType() {
  const { Type } = useParams();
  const navigate = useNavigate();
  const selectedCity = useSelector((state) => state.ServiceLocation.selectedCity);

  const decodedType = decodeURIComponent(Type || "");
  const service = SERVICE_CATALOG.find((item) => item.serviceType === decodedType);

  if (!service) {
    return (
      <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="care24-card rounded-[2rem] p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Service not found</h1>
            <p className="mt-3 text-slate-600">Please return to the services page and select a valid care category.</p>
            <button onClick={() => navigate("/services")} className="care24-btn care24-btn--primary mt-6">
              View services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="care24-card care24-card--elevated overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <button onClick={() => navigate("/services")} className="care24-btn care24-btn--ghost">
            ← Back to services
          </button>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="care24-badge care24-badge--success">Selected service</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {service.serviceType}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Personalized care support with trained professionals available in {selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : "your selected location"}.
              </p>
            </div>

            <div className="care24-widget p-5">
              <p className="text-sm font-semibold text-slate-700">Booking snapshot</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800">Fast booking</p>
                  <p className="mt-1">Choose your preferred care plan and confirm quickly.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800">Verified support</p>
                  <p className="mt-1">Professionals are screened for quality and safety.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="care24-card p-6">
            <h2 className="text-lg font-semibold text-slate-900">What this includes</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Scheduled care visits</li>
              <li>• Flexible support duration</li>
              <li>• Professional communication</li>
            </ul>
          </div>

          <div className="care24-card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Why patients trust Care24</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Each service is designed to feel calm, dependable, and easy to coordinate from start to finish.
            </p>
          </div>

          <div className="care24-card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Next step</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Continue to booking to confirm the care plan that fits your family’s needs.
            </p>
            <button className="care24-btn care24-btn--primary mt-5">Continue booking</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ServiceType;