import { Package, TrendingUp, AlertCircle } from "lucide-react";

export default function Sidebar() {
    return (
        <div className="p-6">

            <nav className="space-y-2">
                <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium"
                >
                    <Package size={20} />
                    <span>Inventory</span>
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-teal-50 transition"
                >
                    <TrendingUp size={20} />
                    <span>Dashboard</span>
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-teal-50 transition"
                >
                    <AlertCircle size={20} />
                    <span>Alerts</span>
                </a>
            </nav>

            {/* Stats Summary */}
            <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-sm text-teal-700 font-medium">Total Items</p>
                    <p className="text-2xl font-bold text-teal-900">--</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700 font-medium">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-900">--</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-medium">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-900">--</p>
                </div>
            </div>
        </div>
    );
}
