import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createCaregiver } from "../api/caregiver";

const initialState = {
  userId: "",
  qualification: [],
  specialization: [],
  languages: [],
  certificates: [],
  aadhaarNumber: "",
  licenseNumber: "",
  bio: "",
  isVerified: false,
  location: {
    type: "Point",
    coordinates: [0, 0],
  },
};

function CaregiverForm() {
  const [formData, setFormData] = useState(initialState);
  const [qualificationInput, setQualificationInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.firebaseLogin._id);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCertificateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, ...Array.from(e.target.files)],
    }));
  };

  const removeCertificate = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const addTag = (field, value, setValue) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    if (formData[field].includes(trimmedValue)) {
      setValue("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], trimmedValue],
    }));

    setValue("");
  };

  const removeTag = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleTagKeyDown = (e, field, value, setValue) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field, value, setValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!userId) {
      setMessage("Please sign in again before creating your caregiver profile.");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("userId", userId);
    data.append("qualification", JSON.stringify(formData.qualification));
    data.append("specialization", JSON.stringify(formData.specialization));
    data.append("languages", JSON.stringify(formData.languages));
    data.append("aadhaarNumber", formData.aadhaarNumber);
    data.append("licenseNumber", formData.licenseNumber);
    data.append("bio", formData.bio);
    data.append("isVerified", String(formData.isVerified));

    formData.certificates.forEach((file) => {
      data.append("certificates", file);
    });

    try {
      await dispatch(createCaregiver(data)).unwrap();
      alert("Caregiver profile created successfully!");
      navigate("/CaregiverDashboard");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create caregiver profile. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTagField = (label, field, value, setValue, placeholder) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
          {formData[field].length} added
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {formData[field].map((tag, index) => (
          <span
            key={`${field}-${tag}-${index}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
          >
            {tag}
            <button type="button" onClick={() => removeTag(field, index)} className="text-slate-400 transition hover:text-slate-700">
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => handleTagKeyDown(e, field, value, setValue)}
          placeholder={placeholder}
          className="care24-input"
        />
        <button
          type="button"
          onClick={() => addTag(field, value, setValue)}
          className="care24-btn care24-btn--secondary whitespace-nowrap"
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="care24-card care24-card--elevated overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="care24-badge care24-badge--success">Join Care24</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Create your caregiver profile
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Share your qualifications, services, languages, and supporting documents so families can discover you with confidence.
              </p>
            </div>

            <div className="care24-widget w-full max-w-md p-5">
              <p className="text-sm font-semibold text-slate-700">Why a complete profile matters</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Builds trust quickly with families</li>
                <li>• Improves your visibility in local searches</li>
                <li>• Helps you stand out with verified credentials</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="care24-card rounded-[2rem] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">Profile checklist</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">Credentials</p>
                <p className="mt-1">Add your qualifications and specializations to describe your care strengths.</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">Verification</p>
                <p className="mt-1">Use the verified option when you are ready to mark your profile as approved.</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">Documents</p>
                <p className="mt-1">Upload certificates or licenses so patients can review your background quickly.</p>
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="care24-card rounded-[2rem] p-6 sm:p-8">
            <div className="space-y-4">
              {message && <div className="care24-alert care24-alert--error">{message}</div>}
              {renderTagField(
                "Qualification",
                "qualification",
                qualificationInput,
                setQualificationInput,
                "e.g. B.Sc Nursing"
              )}

              {renderTagField(
                "Specialization",
                "specialization",
                specializationInput,
                setSpecializationInput,
                "e.g. Elderly Care"
              )}

              {renderTagField(
                "Languages",
                "languages",
                languageInput,
                setLanguageInput,
                "e.g. English"
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <label className="text-sm font-semibold text-slate-700">Aadhaar number</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    placeholder="Aadhaar Number"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    className="care24-input mt-3"
                  />
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <label className="text-sm font-semibold text-slate-700">License number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="License Number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="care24-input mt-3"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <label className="text-sm font-semibold text-slate-700">Short bio</label>
                <textarea
                  name="bio"
                  placeholder="Tell families about your experience and care approach"
                  value={formData.bio}
                  onChange={handleChange}
                  className="care24-input mt-3 min-h-32 resize-y"
                />
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <label className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                  <span>Mark profile as verified</span>
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <label className="text-sm font-semibold text-slate-700">Certificates & documents</label>
                <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-4 py-7 text-center transition hover:border-primary hover:bg-blue-50/60">
                  <span className="text-sm font-semibold text-slate-800">Upload certificates</span>
                  <span className="mt-2 text-sm text-slate-500">PNG, JPG, or PDF files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleCertificateChange}
                    className="sr-only"
                  />
                </label>

                {formData.certificates.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {formData.certificates.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                        <span className="truncate">{file.name}</span>
                        <button type="button" onClick={() => removeCertificate(index)} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Your profile will be saved once you confirm the details above.</p>
              <button type="submit" disabled={isSubmitting} className="care24-btn care24-btn--primary min-w-[180px]">
                {isSubmitting ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CaregiverForm;
