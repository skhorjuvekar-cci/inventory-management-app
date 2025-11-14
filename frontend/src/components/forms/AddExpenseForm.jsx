import { useEffect, useState } from "react";

export default function AddExpenseForm({
  setShowModal,
  handleChange,
  handleSubmit,
  isEditForm = false,
  form,
}) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    expense_type: "",
    date_spend_on: "",
    description: "",
  });

  useEffect(() => {
    if (isEditForm && form) {
      setFormData((prev) => ({
        ...prev,
        ...form,
        date_spend_on: form.date_spend_on
          ? form.date_spend_on.slice(0, 10)
          : "",
      }));
    }
  }, [isEditForm, form]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {isEditForm ? "Update Expense" : "New Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            defaultValue={formData.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="expense_type"
            defaultValue={formData.expense_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="needs">Needs</option>
            <option value="wants">Wants</option>
            <option value="culture">Culture</option>
            <option value="unexpected">Unexpected</option>
          </select>

          <input
            type="date"
            name="date_spend_on"
            defaultValue={formData.date_spend_on}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
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
