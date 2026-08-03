import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import LocationSearch from "./Elements/locationSearch";

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

function Services() {
  const selectedCity = useSelector((state) => state.ServiceLocation.selectedCity);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedCity) {
      setData([]);
      return;
    }

    const getData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:3000/services/summary?city=${selectedCity.name}&state=${selectedCity.state}`,
        );

        setData(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [selectedCity]);

  const servicesMap = useMemo(() => {
    return data.reduce((acc, service) => {
      acc[service.serviceType] = service;
      return acc;
    }, {});
  }, [data]);

  return (
    <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="care24-card care24-card--elevated overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="care24-badge care24-badge--success">Trusted home care</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Discover the right care service in your city
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Search by city and state, explore available care categories, and book with compassionate professionals.
              </p>
            </div>

            <div className="care24-widget w-full max-w-md p-5">
              <p className="text-sm font-semibold text-slate-700">Current selection</p>
              <p className="mt-2 text-sm text-slate-600">
                {selectedCity
                  ? `${selectedCity.name}, ${selectedCity.state}`
                  : "Choose a city to see services near you"}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-slate-500">Care options</p>
                  <p className="mt-1 font-semibold text-slate-800">{SERVICE_CATALOG.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-slate-500">Availability</p>
                  <p className="mt-1 font-semibold text-slate-800">Live updates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
            <LocationSearch />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="care24-card animate-pulse overflow-hidden">
                  <div className="h-44 w-full bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 rounded-full bg-slate-200" />
                    <div className="h-6 w-3/4 rounded-full bg-slate-200" />
                    <div className="h-4 w-full rounded-full bg-slate-200" />
                    <div className="h-10 w-full rounded-full bg-slate-200" />
                  </div>
                </div>
              ))
            : SERVICE_CATALOG.map((serviceItem) => {
                const availableService = servicesMap[serviceItem.serviceType];
                const isAvailable = Boolean(availableService);

                return (
                  <article
                    key={serviceItem.serviceType}
                    className={`care24-card group relative overflow-hidden ${
                      isAvailable ? "" : "opacity-80"
                    }`}
                  >
                    <img
                      src={serviceItem.image}
                      alt={serviceItem.serviceType}
                      className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

                    <div className="relative flex min-h-[230px] flex-col justify-between p-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`care24-badge ${
                              isAvailable ? "care24-badge--success" : "care24-badge--warning"
                            }`}
                          >
                            {isAvailable ? "Available" : "On request"}
                          </span>
                          {!isAvailable && (
                            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              Nearby support
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {serviceItem.serviceType}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {isAvailable
                              ? `${availableService.availableCaregiver} caregiver${
                                  availableService.availableCaregiver > 1 ? "s" : ""
                                } available in this area.`
                              : "This service is not available in the selected area yet."}
                          </p>
                        </div>
                      </div>

                      <button
                        className={`care24-btn care24-btn--primary mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 ${
                          !isAvailable ? "opacity-80" : ""
                        }`}
                        onClick={() =>
                          isAvailable && navigate(`/service/${encodeURIComponent(serviceItem.serviceType)}`)
                        }
                        disabled={!isAvailable || !selectedCity}
                      >
                        {isAvailable ? "Book now" : "Unavailable"}
                      </button>
                    </div>
                  </article>
                );
              })}

          {!selectedCity && !isLoading && (
            <div className="care24-card md:col-span-2 xl:col-span-3">
              <div className="p-8 text-center">
                <h3 className="text-xl font-semibold text-slate-900">Select a city to start</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Use the location search above to explore caregiver availability in your area.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Services;
