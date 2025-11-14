import { CheckCircle } from "lucide-react";

export default function EmergencyPreparedness({ reportData }) {
    const unexpectedPercentage = reportData.totalExpenses > 0
        ? (reportData.categoryBreakdown.unexpected.amount / reportData.totalExpenses) * 100
        : 0;

    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Emergency Preparedness</h3>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex justify-between mb-2">
                    <span className="text-orange-400 font-semibold">Unexpected Expenses</span>
                    <span className="text-white font-bold">Rs. {reportData.categoryBreakdown.unexpected.amount.toLocaleString()}</span>
                </div>

                <div
                    className={`flex items-center gap-2 p-3 rounded-lg border ${unexpectedPercentage < 5
                            ? "bg-yellow-900/30 border-yellow-700"
                            : "bg-green-900/30 border-green-700"
                        }`}
                >
                    <CheckCircle className="text-green-400" size={20} />
                    <p className="text-green-300 text-sm">
                        {unexpectedPercentage < 5
                            ? `You spent only ${unexpectedPercentage.toFixed(1)}% on unexpected expenses — keep it up!`
                            : unexpectedPercentage <= 15
                                ? `Balanced! ${unexpectedPercentage.toFixed(1)}% went to unexpected costs.`
                                : `Wow! ${unexpectedPercentage.toFixed(1)}% went to unexpected costs — you're handling surprises well!`}
                    </p>
                </div>
            </div>
        </div>
    );
}
