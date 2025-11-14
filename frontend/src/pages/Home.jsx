
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

// Dummy data based on the API response
const initialInventory = [
  {
    inventory_id: "883d822d-1d85-4efb-b35f-111657b3953f",
    item_name: "Fanta",
    quantity: 100,
    price_per_item: 10,
    available_qty: 50,
    balance_amount: 500,
    total_price: 1000,
    updated_at: "2025-11-11T11:54:55.524+05:30",
    created_at: "2025-10-11T11:38:00.651+05:30"
  },
  {
    inventory_id: "a94e5604-0abe-4ca9-8994-fa2ebec8e1d4",
    item_name: "Guava",
    quantity: 300,
    price_per_item: 20,
    available_qty: 0,
    balance_amount: 0,
    total_price: 6000,
    updated_at: "2025-11-05T12:21:31.485+05:30",
    created_at: "2025-10-05T12:21:31.487+05:30"
  },
  {
    inventory_id: "ad1ac94d-1ca4-44b9-a653-e0ed9999a709",
    item_name: "Coke",
    quantity: 100,
    price_per_item: 10,
    available_qty: 200,
    balance_amount: 2000,
    total_price: 1000,
    updated_at: "2025-11-11T12:11:52.764+05:30",
    created_at: "2025-11-11T12:09:05.279+05:30"
  },
  {
    inventory_id: "cddc8863-b2bb-49f9-a3bd-0166ab085c9f",
    item_name: "Tomato",
    quantity: 1000,
    price_per_item: 10,
    available_qty: 0,
    balance_amount: 0,
    total_price: 10000,
    updated_at: "2025-11-05T12:27:04.852+05:30",
    created_at: "2025-11-05T10:30:00+05:30"
  },
  {
    inventory_id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
    item_name: "Mango Juice",
    quantity: 150,
    price_per_item: 25,
    available_qty: 120,
    balance_amount: 3000,
    total_price: 3750,
    updated_at: "2025-11-10T09:15:22.123+05:30",
    created_at: "2025-11-01T08:20:15.456+05:30"
  },
  {
    inventory_id: "u1v2w3x4-y5z6-a7b8-c9d0-e1f2g3h4i5j6",
    item_name: "Coconut Water",
    quantity: 200,
    price_per_item: 15,
    available_qty: 35,
    balance_amount: 525,
    total_price: 3000,
    updated_at: "2025-11-11T14:30:45.789+05:30",
    created_at: "2025-10-15T10:45:30.321+05:30"
  }
];

const HomePage = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ item_name: '', price_per_item: '', quantity: '' });

  const getStockLevel = (item) => {
    const percentage = (item.available_qty / item.quantity) * 100;
    if (percentage === 0) return { level: 'out', color: 'bg-red-100 text-red-800', label: 'Out of Stock' };
    if (percentage < 30) return { level: 'low', color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' };
    return { level: 'good', color: 'bg-green-100 text-green-800', label: 'In Stock' };
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const stockLevel = getStockLevel(item).level;
    const matchesFilter = filterStock === 'all' || stockLevel === filterStock;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (item) => {
    setEditingId(item.inventory_id);
    setEditForm({ ...item });
  };

  const handleSave = () => {
    setInventory(inventory.map(item =>
      item.inventory_id === editingId ? {
        ...editForm,
        total_price: editForm.quantity * editForm.price_per_item,
        balance_amount: editForm.available_qty * editForm.price_per_item,
        updated_at: new Date().toISOString()
      } : item
    ));
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.inventory_id !== id));
    }
  };

  const handleAddItem = () => {
    const newInventoryItem = {
      inventory_id: Math.random().toString(36).substr(2, 9),
      item_name: newItem.item_name,
      quantity: parseInt(newItem.quantity),
      price_per_item: parseFloat(newItem.price_per_item),
      available_qty: parseInt(newItem.quantity),
      balance_amount: parseInt(newItem.quantity) * parseFloat(newItem.price_per_item),
      total_price: parseInt(newItem.quantity) * parseFloat(newItem.price_per_item),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    setInventory([...inventory, newInventoryItem]);
    setNewItem({ item_name: '', price_per_item: '', quantity: '' });
    setShowAddForm(false);
  };

  const totalItems = inventory.length;
  const outOfStock = inventory.filter(i => i.available_qty === 0).length;
  const lowStock = inventory.filter(i => {
    const pct = (i.available_qty / i.quantity) * 100;
    return pct > 0 && pct < 30;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-teal-800">Sai Island Inventory</h1>
              <p className="text-sm text-teal-600 mt-1">Goa Business Manager</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-teal-700">Store Manager</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen p-6 hidden md:block">
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
              <Package size={20} />
              <span>Inventory</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-teal-50 transition">
              <TrendingUp size={20} />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-teal-50 transition">
              <AlertCircle size={20} />
              <span>Alerts</span>
            </a>
          </nav>

          {/* Stats Summary */}
          <div className="mt-8 space-y-4">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
              <p className="text-sm text-teal-700 font-medium">Total Items</p>
              <p className="text-2xl font-bold text-teal-900">{totalItems}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-900">{lowStock}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-900">{outOfStock}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-teal-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="good">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition shadow-md"
                >
                  <Plus size={20} />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-4">Add New Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="number"
                    placeholder="Price per Item"
                    value={newItem.price_per_item}
                    onChange={(e) => setNewItem({ ...newItem, price_per_item: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddItem}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    Create Item
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Total Qty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Available</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Price/Item</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Total Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Stock Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.map((item) => {
                    const stockInfo = getStockLevel(item);
                    const isEditing = editingId === item.inventory_id;

                    return (
                      <tr key={item.inventory_id} className="hover:bg-teal-50 transition">
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.item_name}
                              onChange={(e) => setEditForm({ ...editForm, item_name: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            <span className="font-medium text-gray-900">{item.item_name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.quantity}
                              onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            <span className="text-gray-700">{item.quantity}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.available_qty}
                              onChange={(e) => setEditForm({ ...editForm, available_qty: parseInt(e.target.value) })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            <span className="text-gray-700">{item.available_qty}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.price_per_item}
                              onChange={(e) => setEditForm({ ...editForm, price_per_item: parseFloat(e.target.value) })}
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            <span className="text-gray-700">₹{item.price_per_item}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-teal-700">₹{item.total_price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${stockInfo.color}`}>
                            {stockInfo.level === 'good' && <CheckCircle size={14} />}
                            {stockInfo.level === 'low' && <AlertCircle size={14} />}
                            {stockInfo.level === 'out' && <X size={14} />}
                            {stockInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                  title="Save"
                                >
                                  <Save size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.inventory_id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl mt-6 border border-teal-100">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No items found matching your search criteria.</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-teal-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 Sai Island Business Manager. All rights reserved.</p>
            <p className="text-sm text-gray-600 mt-2 md:mt-0">Contact: support@saiisland.com | +91-XXXX-XXXXXX</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
// import {
//   Wallet,
//   IndianRupee,
//   CreditCard,
//   PiggyBank,
//   List,
// } from "lucide-react";

// import { useLoaderData } from "react-router-dom";
// import { useEffect, useState } from "react";
// import QuickActions from "../components/layoutComponents/QuickAction";
// import Card from "../components/cards/Card";
// import RecentTransactions from "../components/transaction/RecentTrasactions";
// import SavingTargetProgress from "../components/savings/SavingTargetProgress";
// import { getInsights } from "../services/DashboardService";
// import Modal from "../components/modals/Modal";
// import AddSavingForm from "../components/forms/AddSavingForm";
// import { createSaving } from "../services/SavingService";
// import { createIncome } from "../services/IncomeService";
// import AddIncomeForm from "../components/forms/AddIncomeForm";
// import { createExpense } from "../services/ExpensesService";
// import AddExpenseForm from "../components/forms/AddExpenseForm";

// export default function HomePage() {
//   const loaderData = useLoaderData();
//   const currentMonth = new Date().getMonth() + 1;
//   const [insightFilter, setInsightFilter] = useState(currentMonth);

//   const [totalIncome, setTotalIncome] = useState(loaderData.total_income || 0);
//   const [totalExpense, setTotalExpense] = useState(loaderData.total_expense || 0);
//   const [totalSaving, setTotalSaving] = useState(loaderData.total_saving || 0);
//   const [totalBalance, setTotalBalance] = useState(loaderData.balance || 0);
//   const [recentTransaction, setRecentTransactions] = useState(loaderData.recent_transactions || []);
//   const [savingTarget, setSavingTarget] = useState(loaderData.saving_target || []);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showIncomeModal, setShowIncomeModal] = useState(false);
//   const [showFormModal, setShowFormModal] = useState(false);

//   const openAddExpenseModal = () => {
//     setShowFormModal(true);
//   };

//   function openAddIncomeModal() {
//     setShowIncomeModal(true);
//   }

//   function closeIncomeModal() {
//     setShowIncomeModal(false);
//   }

//   function openAddModal() {
//     setShowModal(true);
//   }

//   function closeModal() {
//     setShowModal(false);
//   }

//   async function handleIncomeSubmit(e, formData) {
//     e.preventDefault();
//     try {
//       const result = await await createIncome(formData);

//       if (result.success) {
//         closeIncomeModal();
//         const response = await getInsights(insightFilter === 0 ? null : insightFilter);
//         if (response.success) {
//           updateDashboardData(response.data);
//         }
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Failed to create saving");
//     }
//   }

//   async function handleExpenseSubmit(e) {
//     e.preventDefault();
//     try {
//       const formData = new FormData(e.target);
//       const data = {
//         amount: formData.get("amount"),
//         date_spend_on: formData.get("date_spend_on"),
//         description: formData.get("description"),
//         expense_type: formData.get("expense_type"),
//         name: formData.get("name"),
//       }

//       const result = await createExpense(data);

//       if (result.success) {
//         setShowFormModal(false);
//         const response = await getInsights(insightFilter === 0 ? null : insightFilter);
//         if (response.success) {
//           updateDashboardData(response.data);
//         }
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Failed to create saving");
//     }
//   }
//   async function handleSubmit(e, formData) {
//     e.preventDefault();
//     try {
//       const result = await createSaving(formData);

//       if (result.success) {
//         closeModal();
//         const response = await getInsights(insightFilter === 0 ? null : insightFilter);
//         if (response.success) {
//           updateDashboardData(response.data);
//         }
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Failed to create saving");
//     }
//   }

//   function updateDashboardData(data) {
//     setTotalIncome(data.total_income || 0);
//     setTotalExpense(data.total_expense || 0);
//     setTotalSaving(data.total_saving || 0);
//     setTotalBalance(data.balance || 0);
//     setRecentTransactions(data.recent_transactions || []);
//     setSavingTarget(data.saving_target || []);
//   }

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await getInsights(insightFilter === 0 ? null : insightFilter);

//         if (response.success) {
//           updateDashboardData(response.data);
//         } else {
//           setError(response.message);
//         }
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [insightFilter]);

//   return (
//     <section className="h-screen w-full p-3 flex-col flex gap-y-4">
//       <h3 className="text-white text-2xl font-bold flex items-center gap-x-2">
//         <Wallet size={28} /> Dashboard
//       </h3>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-500 text-white p-4 rounded-lg">
//           {error}
//         </div>
//       )}

//       <div className="flex flex-col border-2 rounded-2xl bg-gray-900 border-yellow-500 p-5">
//         <div className="flex justify-between items-center">
//           <h3 className="text-white text-2xl font-bold flex items-center gap-x-2">
//             Insights
//           </h3>
//           <div className="flex gap-x-2">
//             <select
//               value={insightFilter}
//               onChange={(e) => setInsightFilter(Number(e.target.value))}
//               className="rounded-xl p-1"
//               disabled={loading}>
//               <option value={0}>All Time</option>
//               <option value={1}>January</option>
//               <option value={2}>February</option>
//               <option value={3}>March</option>
//               <option value={4}>April</option>
//               <option value={5}>May</option>
//               <option value={6}>June</option>
//               <option value={7}>July</option>
//               <option value={8}>August</option>
//               <option value={9}>September</option>
//               <option value={10}>October</option>
//               <option value={11}>November</option>
//               <option value={12}>December</option>
//             </select>
//             <select className="rounded-xl p-1" disabled={loading}>
//               <option value={0}>2025</option>
//             </select>
//           </div>
//         </div>

//         {loading ? (
//           <div className="p-5 flex justify-center items-center h-40">
//             <div className="text-white text-xl">Loading...</div>
//           </div>
//         ) : (
//           <div className="p-5 flex justify-around w-full flex-wrap gap-y-4">
//             <Card icon={<Wallet size={32} />} title="Balance Left" value={totalBalance} variant="balance" />
//             <Card icon={<IndianRupee size={32} />} title="Total Income" value={totalIncome} variant="income" />
//             <Card icon={<CreditCard size={32} />} title="Total Expenses" value={totalExpense} variant="expense" />
//             <Card icon={<PiggyBank size={32} />} title="Total Savings" value={totalSaving} variant="savings" />
//           </div>
//         )}
//       </div>

//       <div>
//         <QuickActions addSaving={openAddModal} addIncome={openAddIncomeModal} addExpense={openAddExpenseModal} />
//       </div>

//       <div className="flex gap-x-4">
//         <div className="w-1/2 border-2 rounded-2xl bg-gray-900 border-blue-500 p-5 flex flex-col gap-y-4">
//           <h3 className="text-white text-2xl font-bold mb-4">Saving Targets</h3>
//           {loading ? (
//             <div className="text-white text-center">Loading...</div>
//           ) : savingTarget.length > 0 ? (
//             savingTarget.map((saving, index) => (
//               <SavingTargetProgress
//                 key={index}
//                 title={saving.saving_type}
//                 saved={saving.saved}
//                 target={saving.target}
//               />
//             ))
//           ) : (
//             <div className="text-gray-400 text-center">No saving targets yet</div>
//           )}
//         </div>

//         <div className="w-1/2 border-2 rounded-2xl bg-gray-900 border-blue-500 p-5 flex flex-col gap-y-2">
//           <h3 className="text-white text-2xl font-bold flex items-center gap-x-2">
//             <List size={28} /> Recent Transactions
//           </h3>
//           {loading ? (
//             <div className="text-white text-center">Loading...</div>
//           ) : (
//             <RecentTransactions transactionList={recentTransaction} />
//           )}
//         </div>
//       </div>

//       <Modal open={showModal}>
//         <AddSavingForm closeModal={closeModal} handleSubmit={handleSubmit} />
//       </Modal>
//       <Modal open={showIncomeModal}>
//         <AddIncomeForm closeModal={closeIncomeModal} handleSubmit={handleIncomeSubmit} />
//       </Modal>
//       <Modal open={showFormModal}>
//         <AddExpenseForm setShowModal={setShowFormModal} handleSubmit={handleExpenseSubmit} />
//       </Modal>
//     </section>
//   );
// }

// export async function loader() {
//   try {
//     const currentMonth = new Date().getMonth() + 1;
//     const response = await getInsights(currentMonth);

//     if (!response.success) {
//       throw new Response(JSON.stringify({ message: response.message }), {
//         status: 500,
//       });
//     }

//     return response.data;
//   } catch (error) {
//     throw new Response(JSON.stringify({ message: "Failed to load dashboard" }), {
//       status: 500,
//     });
//   }
// }