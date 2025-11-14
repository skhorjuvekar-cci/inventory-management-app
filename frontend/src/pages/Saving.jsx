import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getSaving, createSaving, uploadSavingCSV, updateSavings, deleteSaving, getTypes } from "../services/SavingService";
import { getCurrentMonth } from "../utils/utils";
import AddSavingForm from "../components/forms/AddSavingForm";
import SavingsPieChart from "../components/savings/SavingsPieChart";
import SavingsBarChart from "../components/savings/SavingsBarChart";
import TotalSavings from "../components/savings/TotalSavings";
import CustomDataTable from "../components/customCharts/CustomDataTable";
import Modal from "../components/modals/Modal";
import DeleteConfirmation from "../components/modals/DeleteConfirmation";
import { Plus } from "lucide-react";
import { TrackerContext } from "../context/tracker-context";

const COLUMNS = [
    { header: "Saving Type", key: "saving_type" },
    { header: "Target Amount", key: "target_amount" },
    { header: "Total Saved", key: "total_amount" },
]

export default function SavingPage() {
    const loadedData = useLoaderData();
    const [savings, setSavings] = useState(loadedData.savings);
    const [savingTypes, setSavingTypes] = useState(loadedData.savingTypes);

    const [errors, setErrors] = useState(null);
    const { currentMonthBalance } = useContext(TrackerContext);

    const [showModal, setShowModal] = useState(false);
    const [isEditForm, setIsEditForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [saving, setSaving] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    function openAddModal() {
        setIsEditForm(false);
        setSaving(null);
        setShowModal(true);
    }

    function openUpdateModal(savingData) {
        setIsEditForm(true);
        setSaving(savingData);
        setShowModal(true);
    }

    function closeModal() {
        setIsEditForm(false);
        setSaving(null);
        setShowModal(false);
        setErrors(null);
    }

    function openDeleteModal(savingData) {
        setSaving(savingData);
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        setSaving(null);
        setShowDeleteModal(false);
    }

    async function handleSubmit(e, formData) {
        e.preventDefault();
        try {
            if (formData.total_amount > currentMonthBalance) {
                setErrors("Cannot add savings as balance is low!!");
                return;
            }
            const response = await createSaving(formData);
            if (response.success) {
                setSavings((prev) => [...prev, response.data]);
                closeModal();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateRow(e, formData) {
        e.preventDefault();
        if (!saving || !saving.savings_id) {
            console.error("No saving selected for update");
            return;
        }
        try {
            const response = await updateSavings(formData, saving.savings_id);
            if (response.success) {
                setSavings((prev) =>
                    prev.map((i) => (i.savings_id === saving.savings_id ? response.data : i))
                );
                closeModal();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteRow() {
        if (!saving) return;
        try {
            const response = await deleteSaving(saving.savings_id);
            if (response.success) {
                setSavings((prev) => prev.filter((i) => i.savings_id !== saving.savings_id));
                closeDeleteModal();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
        setUploadError(null);
        setUploadSuccess(null);
    };

    const handleUpload = async () => {
        if (!csvFile) {
            setUploadError("Please select a CSV file first");
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(null);

        try {
            const response = await uploadSavingCSV(csvFile);

            if (response.success) {
                const data = response.data || [];

                if (data.length > 0) {
                    setSavings((prev) => [...prev, ...data]);
                    setUploadSuccess(`Successfully uploaded ${data.length} saving record(s)`);
                    setCsvFile(null);

                    setTimeout(() => setUploadSuccess(null), 5000);
                } else {
                    setUploadError("No valid records found in CSV file");
                }
            } else {
                setUploadError(response.message || "Failed to upload CSV file");
            }
        } catch (error) {
            console.error("CSV upload failed:", error);
            setUploadError("An unexpected error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    const [month, setMonth] = useState(getCurrentMonth());
    const [type, setType] = useState("");
    let filteredSavings = savings?.filter(i => i.created_at?.startsWith(month));
    if (type) {
        filteredSavings = filteredSavings.filter(i => i.saving_type === type);
    }
    const totalSavings = filteredSavings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

    const pieData = Object.values(
        filteredSavings?.reduce((acc, curr) => {
            acc[curr.saving_type] = acc[curr.saving_type] || { name: curr.saving_type, value: 0 };
            acc[curr.saving_type].value += curr.total_amount;
            return acc;
        }, {})
    );

    const barData = savings.reduce((acc, curr) => {
        const month = curr.created_at?.slice(0, 7);
        acc[month] = (acc[month] || 0) + curr.total_amount;
        return acc;
    }, {});
    const barChartData = Object.entries(barData).map(([month, total]) => ({ month, total }));

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-screen">
            <SavingsPieChart pieData={pieData} />
            <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col gap-y-2">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Savings Transactions</h2>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </div>

                <div className="bg-gray-200 rounded flex flex-col p-2 gap-y-2">
                    <div className="flex items-center gap-x-3">
                        <h3 className="font-bold">Upload CSV</h3>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !csvFile}
                            className={`bg-blue-600 text-white rounded p-2 ${(isUploading || !csvFile) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                }`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>

                    {uploadError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                            {uploadError}
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
                            {uploadSuccess}
                        </div>
                    )}
                </div>

                <div>
                    <select
                        name="type"
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border rounded px-2 py-1"
                    >
                        <option value="">All</option>
                        {loadedData.savingTypes?.map((s) => (
                            <option key={s.saving_type_id} value={s.type}>{s.type}</option>
                        ))}
                    </select>
                </div>

                <CustomDataTable
                    columns={COLUMNS}
                    data={filteredSavings}
                    onUpdate={openUpdateModal}
                    onDelete={openDeleteModal}
                />
            </div>

            <SavingsBarChart barChartData={barChartData} />
            <TotalSavings total={totalSavings} />

            <button
                onClick={openAddModal}
                className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
            >
                <Plus size={24} />
            </button>

            <Modal open={showModal}>
                <AddSavingForm
                    errors={errors}
                    closeModal={closeModal}
                    handleSubmit={isEditForm ? updateRow : handleSubmit}
                    isEditForm={isEditForm}
                    form={saving}
                />
            </Modal>

            <Modal open={showDeleteModal}>
                <DeleteConfirmation onConfirm={deleteRow} onCancel={closeDeleteModal} />
            </Modal>
        </div>
    );
}

export async function loader() {
    try {
        const savingsRes = await getSaving(null);
        const typesRes = await getTypes();
        return {
            savings: savingsRes.data,
            savingTypes: typesRes.data
        };
    } catch (error) {
        throw error;
    }
}