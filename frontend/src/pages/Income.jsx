import { useState } from "react";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/forms/AddIncomeForm";
import { createIncome, deleteIncome, getIncome, updateIncome, uploadIncomeCSV } from "../services/IncomeService";
import { useLoaderData } from "react-router-dom";
import Modal from "../components/modals/Modal";
import DeleteConfirmation from "../components/modals/DeleteConfirmation";
import CustomPieChart from "../components/customCharts/CustomPieChart";
import CustomBarChart from "../components/customCharts/CustomBarChart";
import CustomDataTable from "../components/customCharts/CustomDataTable";
import { getCurrentMonth } from "../utils/utils";

const COLUMNS = [
  { header: "Source", key: "income_source" },
  { header: "Type", key: "income_type" },
  { header: "Amount", key: "amount" },
]


export default function IncomePage() {
  const loadedIncomes = useLoaderData();
  const [incomes, setIncomes] = useState(loadedIncomes);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditForm, setIsEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [income, setIncome] = useState(null);

  // CSV file state
  const [csvFile, setCsvFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  function openAddModal() {
    setIsEditForm(false);
    setIncome(null);
    setShowModal(true);
  }

  function openUpdateModal(incomeData) {
    setIsEditForm(true);
    setIncome(incomeData);
    setShowModal(true);
  }

  function closeModal() {
    setIsEditForm(false);
    setIncome(null);
    setShowModal(false);
  }

  function openDeleteModal(incomeData) {
    setIncome(incomeData);
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setIncome(null);
    setShowDeleteModal(false);
  }

  async function handleSubmit(e, formData) {
    e.preventDefault();
    try {
      const response = await createIncome(formData);
      if (response.success) {
        setIncomes((prev) => [...prev, response.data]);
        closeModal();
      } else {
        console.error(response.message);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function updateRow(e, formData) {
    e.preventDefault();
    try {
      const response = await updateIncome(formData, income.income_id);
      if (response.success) {
        setIncomes((prev) =>
          prev.map((i) => (i.income_id === income.income_id ? response.data : i))
        );
        closeModal();
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteRow() {
    try {
      const response = await deleteIncome(income.income_id);
      if (response.success) {
        setIncomes((prev) => prev.filter((i) => i.income_id !== income.income_id));
        closeDeleteModal();
      } else {
        console.error(response.message);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setUploadError(null);
    setUploadSuccess(null);
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

    if (!csvFile) {
      setUploadError("Please select a CSV file first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const response = await uploadIncomeCSV(csvFile);

      if (response.success) {
        const data = response.data || [];

        if (data.length > 0) {
          setIncomes((prev) => [...prev, ...data]);
          setUploadSuccess(`Successfully uploaded ${data.length} income record(s)`);
          setCsvFile(null);

          // Clear success message after 5 seconds
          setTimeout(() => setUploadSuccess(null), 5000);
        } else {
          setUploadError("No valid records found in CSV file");
        }
      } else {
        setUploadError(response.message || "Failed to upload CSV file");
      }
    } catch (error) {
      console.error(error);
      setUploadError("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const [month, setMonth] = useState(getCurrentMonth());

  let filteredIncomes = [];
  filteredIncomes = incomes.filter(
    (income) => income.date_received.startsWith(month)
  );

  const [type, setType] = useState(null);
  if (type) {
    filteredIncomes = filteredIncomes?.filter(income => income.income_type === type)
  }


  const totalIncome = filteredIncomes?.reduce((acc, curr) => acc + Number(curr.amount), 0);
  // const totalIncome = filteredIncomes?.reduce((acc, curr) => {
  //   console.log("curr.amount:", curr.amount, "type:", typeof curr.amount);
  //   return acc + Number(curr.amount); // ensure numeric addition
  // }, 0);

  const pieData = Object.values(
    filteredIncomes.reduce((acc, curr) => {
      acc[curr.income_source] =
        acc[curr.income_source] ||
        { name: curr.income_source, value: 0 };
      acc[curr.income_source].value += Number(curr.amount);
      return acc;
    }, {})
  );

  const barData = incomes.reduce((acc, curr) => {
    const month = curr.date_received.slice(0, 7);
    acc[month] = (acc[month] || 0) + curr.amount;
    return acc;
  }, {});
  const barChartData = Object.entries(barData).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col items-center">
        <h2 className="text-xl font-bold self-start">Income Division</h2>
        <div className="flex justify-center items-center w-full h-full">
          <CustomPieChart data={pieData} />
        </div>
      </div>

      <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col gap-y-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Income Transactions</h2>
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
          <select name="type" id="type" onChange={(e) => setType(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option value="recurring">Recurring</option>
            <option value="one-time">One-time</option>
          </select>
        </div>
        <CustomDataTable
          columns={COLUMNS}
          data={filteredIncomes}
          onUpdate={openUpdateModal}
          onDelete={openDeleteModal}
        />
      </div>

      <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col">
        <h2 className="text-xl font-bold mb-4">Monthly Income</h2>
        <div className="flex justify-center items-center w-full h-full">
          <CustomBarChart data={barChartData} xKey="month" yKey="total" />
        </div>
      </div>

      <div className="bg-gray-300 p-6 rounded-xl shadow flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">
          Total Income for{" "}
          {new Date(month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <p className="text-2xl font-semibold text-green-600">Rs. {totalIncome}</p>
      </div>

      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        <Plus size={24} />
      </button>

      <Modal open={showModal}>
        <AddIncomeForm
          closeModal={closeModal}
          handleSubmit={isEditForm ? updateRow : handleSubmit}
          isEditForm={isEditForm}
          form={income}
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
    const resData = await getIncome(null);
    return resData.data;
  } catch (error) {
    throw error;
  }
}