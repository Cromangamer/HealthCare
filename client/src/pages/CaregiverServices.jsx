import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCaregiverService, deleteCaregiverService, getCaregiverServices, updateCaregiverService } from "../api/services";
import validateLocation from "../utils/locationValidator";


const emptyForm = {
  serviceType: "Companion Care",
  description: "",
  priceType: "hourly",
  price: "",
  duration: "",
  serviceMode: "in_home",
  city: "",
  state: "",
  pincode: "",
  availability: {},
  isActive: true,
};

const serviceTypes = [
  "Companion Care",
  "Doctor Consultation",
  "Elderly Care",
  "Home Nursing",
  "ICU Care",
  "Medical Attendant",
  "Other",
  "Physiotherapy",
  "Post Surgery Care",
  "Palliative Care",
];

const priceTypes = ["hourly", "per_visit", "flat_rate"];
const serviceModes = ["in_home", "clinic", "hospital", "virtual"];

function CaregiverServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getCaregiverServices({ page: 1, limit: 50 });
      setServices(data.services || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your services right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingId(service._id);
    setForm({
      serviceType: service.serviceType || "Companion Care",
      description: service.description || "",
      priceType: service.priceType || "hourly",
      price: service.price ?? "",
      duration: service.duration ?? "",
      serviceMode: service.serviceMode || "in_home",
      city: service.serviceArea?.[0]?.city || "",
      state: service.serviceArea?.[0]?.state || "",
      pincode: service.serviceArea?.[0]?.pincode ?? "",
      availability: service.availability || {},
      isActive: service.isActive !== false,
    });
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const changeField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const location = validateLocation(form.city, form.state);

      const payload = {
        serviceType: form.serviceType,
        description: form.description,
        priceType: form.priceType,
        price: Number(form.price),
        duration: form.duration ? Number(form.duration) : undefined,
        serviceMode: form.serviceMode,
        serviceArea: form.city || form.state || form.pincode ? [{ city: location.city, state: location.state, pincode: form.pincode ? Number(form.pincode) : undefined }] : [],
        availability: form.availability || {},
        isActive: form.isActive,
      };

      if (!payload.serviceType || !payload.description || Number.isNaN(payload.price)) {
        throw new Error("Service type, description, and a valid price are required.");
      }

      if (editingId) {
        await updateCaregiverService(editingId, payload);
        setMessage("Service updated successfully.");
      } else {
        await createCaregiverService(payload);
        setMessage("Service created successfully.");
      }

      await loadServices();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to save the service.");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;
    setSaving(true);
    try {
      await deleteCaregiverService(selectedService._id);
      await loadServices();
      setIsDeleteOpen(false);
      setSelectedService(null);
      setMessage("Service deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete the service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="care24-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="care24-card rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="care24-badge">Caregiver workspace</span>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">My services</h1>
              <p className="mt-2 text-slate-600">Create, edit, and remove the services you offer to patients.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/CaregiverDashboard" className="care24-btn care24-btn--ghost">Back to dashboard</Link>
              <button type="button" onClick={openCreate} className="care24-btn care24-btn--primary">Add service</button>
            </div>
          </div>
        </div>

        {(message || error) && (
          <div className={`rounded-[1.5rem] border px-4 py-3 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {error || message}
          </div>
        )}

        <div className="care24-card rounded-[2rem] p-6 sm:p-8">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="care24-skeleton h-16" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="care24-empty">You have not added any services yet. Create your first one to start receiving patient bookings.</div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service._id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-900">{service.serviceType}</p>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                      <p className="mt-2 text-sm text-slate-500">₹{service.price} • {service.priceType} • {service.duration || "variable"} mins</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => openEdit(service)} className="care24-btn care24-btn--secondary">Edit</button>
                      <button type="button" onClick={() => requestDelete(service)} className="care24-btn care24-btn--ghost">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 pt-[50px] pb-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4 sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">{editingId ? "Edit service" : "Add service"}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{editingId ? "Update your service" : "Create a new service listing"}</h2>
                </div>
                <button type="button" onClick={closeModal} className="text-sm font-semibold text-slate-500">Close</button>
              </div>
            </div>

            <form onSubmit={submitForm} className="space-y-4 px-6 py-6 sm:px-8">
              <label className="care24-form__label text-sm">
                Service type
                <select name="serviceType" value={form.serviceType} onChange={changeField} className="care24-input mt-2">
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="care24-form__label text-sm">
                Description
                <textarea name="description" value={form.description} onChange={changeField} className="care24-input mt-2 min-h-24" placeholder="Describe the service" required />
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="care24-form__label text-sm">
                  Price
                  <input type="number" min="0" name="price" value={form.price} onChange={changeField} className="care24-input mt-2" required />
                </label>

                <label className="care24-form__label text-sm">
                  Price type
                  <select name="priceType" value={form.priceType} onChange={changeField} className="care24-input mt-2">
                    {priceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label className="care24-form__label text-sm">
                  Duration (mins)
                  <input type="number" min="0" name="duration" value={form.duration} onChange={changeField} className="care24-input mt-2" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="care24-form__label text-sm">
                  Service mode
                  <select name="serviceMode" value={form.serviceMode} onChange={changeField} className="care24-input mt-2">
                    {serviceModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <span>Visible to patients</span>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={changeField} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="care24-form__label text-sm">
                  City
                  <input name="city" value={form.city} onChange={changeField} className="care24-input mt-2" />
                </label>
                <label className="care24-form__label text-sm">
                  State
                  <input name="state" value={form.state} onChange={changeField} className="care24-input mt-2" />
                </label>
                <label className="care24-form__label text-sm">
                  Pincode
                  <input type="number" name="pincode" value={form.pincode} onChange={changeField} className="care24-input mt-2" />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="care24-btn care24-btn--ghost">Cancel</button>
                <button type="submit" disabled={saving} className="care24-btn care24-btn--primary">
                  {saving ? "Saving..." : editingId ? "Update service" : "Create service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">Delete service</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Remove this service?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">This action will remove the service from your caregiver profile.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="care24-btn care24-btn--ghost">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={saving} className="care24-btn care24-btn--primary">
                {saving ? "Deleting..." : "Delete service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CaregiverServices;
