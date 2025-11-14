import { PieChart } from "lucide-react";
import { getCategoryColor } from "../../utils/reportUtils";

export default function SpendingDistribution({ reportData }) {
    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
                <PieChart className="text-purple-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Spending Distribution</h2>
            </div>

            <div className="space-y-4">
                {Object.entries(reportData.categoryBreakdown).map(([category, data]) => (
                    <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-semibold capitalize">{category}</span>
                            <div className="text-right">
                                <p className="text-white font-bold">Rs. {data.amount.toLocaleString()}</p>
                                <p className="text-slate-400 text-sm">{data.percentage}%</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                                className={`${getCategoryColor(category)} h-full rounded-full transition-all duration-500`}
                                style={{ width: `${data.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
