import { useEffect, useState } from "react";
import { getTypes } from "../../services/SavingService";

export default function AddSavingForm({ handleSubmit, isEditForm, form, closeModal, errors }) {
    const [formData, setFormData] = useState({
        saving_type: "",
        total_amount: "",
        target_amount: null,
        description: "",
    });

    const [types, setTypes] = useState([]);
    const [isCustomType, setIsCustomType] = useState(false);

    useEffect(() => {
        async function fetchTypes() {
            try {
                const fetchedTypes = await getTypes();
                const typesData = fetchedTypes.data
                setTypes(typesData);
            } catch (error) {
                console.error("Error fetching types:", error);
            }
        }

        fetchTypes();
    }, []);

    useEffect(() => {
        if (isEditForm && form) {
            setFormData({
                ...form,
                created_at: form.created_at ? form.created_at.slice(0, 10) : "",
            });
            const isCustom = !types.some(type => type.name === form.saving_type);
            setIsCustomType(isCustom);
        }
    }, [isEditForm, form, types]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "saving_type" && value === "other") {
            setIsCustomType(true);
            setFormData(prev => ({ ...prev, saving_type: "" }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">
                    {isEditForm ? "Update Saving" : "New Saving"}
                </h2>
                <p className="text-red-600">
                    {errors}
                </p>
                <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-3">

                    <select
                        name="saving_type"
                        value={isCustomType ? "other" : formData.saving_type}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Select Saving Type</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.type}>
                                {type.type}
                            </option>
                        ))}
                        <option value="other">Other</option>
                    </select>

                    {isCustomType && (
                        <input
                            type="text"
                            name="custom_saving_type"
                            placeholder="Enter new saving type"
                            value={formData.saving_type}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, saving_type: e.target.value }))
                            }
                            className="w-full border p-2 rounded mt-2"
                            required
                        />
                    )}


                    <input
                        type="number"
                        name="total_amount"
                        placeholder="Total Amount"
                        value={formData.total_amount}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {isCustomType && (
                        <input
                            type="number"
                            name="target_amount"
                            placeholder="Target Amount"
                            value={formData.target_amount}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    )}
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
