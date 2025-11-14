import { AlertCircle } from "lucide-react";

export default function InvestmentGrowth({ reportData }) {
    const percentage = reportData.totalExpenses > 0
        ? ((reportData.categoryBreakdown.culture.amount / reportData.totalExpenses) * 100).toFixed(1)
        : 0;

    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Investment in Growth</h3>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex justify-between mb-2">
                    <span className="text-green-400 font-semibold">Culture & Education</span>
                    <span className="text-white font-bold">Rs. {reportData.categoryBreakdown.culture.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 my-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                    <AlertCircle className="text-blue-400" size={20} />
                    <p className="text-blue-300 text-sm">
                        You're using {percentage}% of your expenses for growth.
                    </p>
                </div>
            </div>
        </div>
    );
}
