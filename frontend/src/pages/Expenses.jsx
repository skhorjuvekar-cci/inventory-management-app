import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useLoaderData } from "react-router-dom";

import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
  uploadExpenseCSV
} from "../services/ExpensesService";
import AddExpenseForm from "../components/forms/AddExpenseForm";
import Modal from "../components/modals/Modal";
import DeleteConfirmation from "../components/modals/DeleteConfirmation";
import CustomPieChart from "../components/customCharts/CustomPieChart";
import CustomBarChart from "../components/customCharts/CustomBarChart";
import CustomDataTable from "../components/customCharts/CustomDataTable";
import { getCurrentMonth } from "../utils/utils";

const COLUMNS = [
  { header: "Name", key: "name" },
  { header: "Expense Type", key: "expense_type" },
  { header: "Amount", key: "amount", render: (value) => `Rs. ${value}` },
]

export default function ExpensesPage() {
  const loadedExpenses = useLoaderData();
  const [expenses, setExpenses] = useState(loadedExpenses.monthlyExpenses || []);
  const [allExpenses, setAllExpenses] = useState(loadedExpenses.allExpenses || []);

  const [csvFile, setCsvFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditForm, setIsEditForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [month, setMonth] = useState(getCurrentMonth());
  const [type, setType] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    amount: 0,
    expense_type: "needs",
    date_spend_on: "",
    description: "",
  });

  // Fetch data when month changes
  useEffect(() => {
    async function fetchMonthlyData() {
      setLoading(true);
      try {
        const monthNumber = new Date(month + "-01").getMonth() + 1;
        const resData = await getExpenses(monthNumber);
        if (resData.success) {
          setExpenses(resData.data);
        }
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlyData();
  }, [month]);

  const resetForm = () =>
    setForm({
      name: "",
      amount: 0,
      expense_type: "",
      date_spend_on: "",
      description: "",
    });

  let filteredExpenses = expenses;
  if (type) {
    filteredExpenses = filteredExpenses.filter(exp => exp.expense_type === type);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditForm && selectedExpense) {
      const response = await updateExpense(form, selectedExpense.expense_id);
      if (response.success) {
        setExpenses((prev) =>
          prev.map((exp) => (exp.expense_id === selectedExpense.expense_id ? response.data : exp))
        );
        setAllExpenses((prev) =>
          prev.map((exp) => (exp.expense_id === selectedExpense.expense_id ? response.data : exp))
        );
      }
    } else {
      const response = await createExpense(form);
      if (response.success) {
        setExpenses((prev) => [...prev, response.data]);
        setAllExpenses((prev) => [...prev, response.data]);
      }
    }

    resetForm();
    setSelectedExpense(null);
    setIsEditForm(false);
    setShowFormModal(false);
  };

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
      const response = await uploadExpenseCSV(csvFile);

      if (response.success) {
        const data = response.data || [];

        if (data.length > 0) {
          setExpenses((prev) => [...prev, ...data]);
          setAllExpenses((prev) => [...prev, ...data]);
          setUploadSuccess(`Successfully uploaded ${data.length} expense record(s)`);
          setCsvFile(null);

          setTimeout(() => setUploadSuccess(null), 5000);
        } else {
          setUploadError("No valid records found in CSV file");
        }
      } else {
        setUploadError(response.message || "Failed to upload CSV file");
      }
    } catch (error) {
      console.error("Bulk upload failed:", error);
      setUploadError("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const totalExpense = filteredExpenses?.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  const pieData = Object.values(
    filteredExpenses?.reduce((acc, curr) => {
      acc[curr.expense_type] = acc[curr.expense_type] || {
        name: curr.expense_type,
        value: 0,
      };
      acc[curr.expense_type].value += Number(curr.amount);
      return acc;
    }, {})
  );

  const barData = allExpenses.reduce((acc, curr) => {
    const month = curr.date_spend_on.slice(0, 7);
    acc[month] = (acc[month] || 0) + curr.amount;
    return acc;
  }, {});
  const barChartData = Object.entries(barData).map(([month, total]) => ({
    month,
    total,
  }));

  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const deleteRow = async () => {
    if (selectedExpense) {
      const response = await deleteExpense(selectedExpense.expense_id);
      if (response.success) {
        setExpenses((prev) => prev.filter((exp) => exp.expense_id !== selectedExpense.expense_id));
        setAllExpenses((prev) => prev.filter((exp) => exp.expense_id !== selectedExpense.expense_id));
      }
    }
    setShowDeleteModal(false);
    setSelectedExpense(null);
  };

  const openEditModal = (expense) => {
    setForm({ ...expense });
    setSelectedExpense(expense);
    setIsEditForm(true);
    setShowFormModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setSelectedExpense(null);
    setIsEditForm(false);
    setShowFormModal(true);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 self-start">Expenses Division</h2>
        <div className="flex justify-center items-center w-full h-full">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <CustomPieChart data={pieData} />
          )}
        </div>
      </div>

      <div className="bg-gray-300 p-4 rounded-xl shadow flex-col flex gap-y-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Expenses Transactions</h2>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded px-2 py-1"
            disabled={loading}
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
            onChange={(e) => setType(e.target.value || null)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="needs">Needs</option>
            <option value="wants">Wants</option>
            <option value="culture">Culture</option>
            <option value="unexpected">Unexpected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-4">Loading...</div>
        ) : (
          <CustomDataTable
            columns={COLUMNS}
            data={filteredExpenses}
            onUpdate={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col">
        <h2 className="text-xl font-bold">Monthly Expenses</h2>
        <div className="flex justify-center items-center w-full h-full">
          <CustomBarChart data={barChartData} xKey="month" yKey="total" />
        </div>
      </div>

      <div className="bg-gray-300 p-6 rounded-xl shadow flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">
          Total Expenses for{" "}
          {new Date(month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <p className="text-2xl font-semibold text-red-600">Rs. {totalExpense}</p>
      </div>

      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        <Plus size={24} />
      </button>

      <Modal open={showFormModal}>
        <AddExpenseForm
          setShowModal={setShowFormModal}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          form={form}
          isEditForm={isEditForm}
        />
      </Modal>

      <Modal open={showDeleteModal}>
        <DeleteConfirmation
          onConfirm={deleteRow}
          onCancel={() => setShowDeleteModal(false)}
        />
      </Modal>
    </div>
  );
}

export async function loader() {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const monthlyData = await getExpenses(currentMonth);
    const allData = await getExpenses(null);

    return {
      monthlyExpenses: monthlyData.data,
      allExpenses: allData.data
    };
  } catch (error) {
    throw error;
  }
}