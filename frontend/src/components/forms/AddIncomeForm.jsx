import { useEffect, useState } from "react";
import { getSources } from "../../services/IncomeService"; // make sure this exists

export default function AddIncomeForm({ handleSubmit, isEditForm, form, closeModal }) {
  const [formData, setFormData] = useState({
    income_source: "",
    amount: "",
    income_type: "recurring",
    date_received: "",
    description: "",
  });

  const [sources, setSources] = useState([]);
  const [isCustomSource, setIsCustomSource] = useState(false);

  useEffect(() => {
    async function fetchSources() {
      try {
        const res = await getSources();
        setSources(res.data);
      } catch (err) {
        console.error("Failed to fetch income sources", err);
      }
    }

    fetchSources();
  }, []);

  useEffect(() => {
    if (isEditForm && form) {
      setFormData({
        ...form,
        date_received: form.date_received ? form.date_received.slice(0, 10) : "",
      });

      const isCustom = sources.length > 0 && !sources.some(s => s.name === form.income_source);
      setIsCustomSource(isCustom);
    }
  }, [isEditForm, form, sources]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "income_source") {
      if (value === "other") {
        setIsCustomSource(true);
        setFormData((prev) => ({ ...prev, income_source: "" }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {isEditForm ? "Update Income" : "New Income"}
        </h2>

        <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-3">

          {/* Income Source Dropdown */}
          <select
            name="income_source"
            value={isCustomSource ? "other" : formData.income_source}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Income Source</option>
            {sources.map((source) => (
              <option key={source.id} value={source.source}>
                {source.source}
              </option>
            ))}
            <option value="other">Other</option>
          </select>

          {/* Custom Source Input (conditionally shown) */}
          {isCustomSource && (
            <input
              type="text"
              name="income_source"
              placeholder="Enter new income source"
              value={formData.income_source}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          )}

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="income_type"
            value={formData.income_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="recurring">Recurring</option>
            <option value="one-time">One-time</option>
          </select>
          <input
            type="date"
            name="date_received"
            value={formData.date_received}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={2}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {isEditForm ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
