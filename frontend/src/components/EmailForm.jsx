import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const fields = [
  {
    key: "target_persona",
    label: "Target Persona",
    placeholder: "e.g. VP of Marketing",
    required: true,
  },
  {
    key: "target_industry",
    label: "Target Industry",
    placeholder: "e.g. E-commerce brands",
    required: true,
  },
  {
    key: "pain_point",
    label: "Prospect's Pain Point",
    placeholder: "e.g. High customer acquisition costs on paid ads",
    required: true,
  },
  {
    key: "product_service",
    label: "Your Product / Service",
    placeholder: "e.g. AI-driven creative testing platform",
    required: true,
  },
  {
    key: "core_benefit",
    label: "Core Benefit / Result",
    placeholder: "e.g. Reduces CAC by 25% within 30 days",
    required: true,
  },
  {
    key: "social_proof",
    label: "Social Proof / Metric",
    placeholder: "e.g. Helped Brand X scale from $1M to $3M ARR",
    required: true,
  },
  {
    key: "prospect_first_name",
    label: "Prospect First Name",
    placeholder: "[First Name]",
    required: false,
    optional: true,
  },
  {
    key: "company_name",
    label: "Company Name",
    placeholder: "[Company Name]",
    required: false,
    optional: true,
  },
  {
    key: "specific_insight",
    label: "Specific Insight",
    placeholder: "e.g. Saw you recently hired 40+ sales reps",
    required: false,
    optional: true,
  },
];

export default function EmailForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    target_persona: "",
    target_industry: "",
    pain_point: "",
    product_service: "",
    core_benefit: "",
    social_proof: "",
    prospect_first_name: "",
    company_name: "",
    specific_insight: "",
  });
  const [showOptional, setShowOptional] = useState(false);

  const requiredFields = fields.filter((f) => !f.optional);
  const optionalFields = fields.filter((f) => f.optional);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isValid = requiredFields.every((f) => form[f.key].trim() !== "");

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Required Fields */}
      <div className="space-y-4">
        {requiredFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {field.label}
              <span className="text-indigo-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        ))}
      </div>

      {/* Optional Fields Toggle */}
      <button
        type="button"
        onClick={() => setShowOptional((v) => !v)}
        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showOptional ? "Hide" : "Add"} personalization details (optional)
      </button>

      {showOptional && (
        <div className="space-y-4 animate-fade-in">
          {optionalFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {field.label}
                <span className="ml-2 text-xs text-gray-500 font-normal">
                  optional
                </span>
              </label>
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          "✨ Generate Email"
        )}
      </button>
    </form>
  );
}
