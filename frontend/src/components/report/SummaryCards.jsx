export default function SummaryCards({ reportData }) {
    return (
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 mb-6 shadow-xl border border-slate-600">
            <h1 className="text-3xl font-bold text-white mb-6">Financial Report</h1>

            <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Savings Rate</p>
                    <p className="text-3xl font-bold text-green-400">{reportData.savingsRate}%</p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Expense Ratio</p>
                    <p className="text-3xl font-bold text-blue-400">
                        {reportData && reportData.totalIncome > 0
                            ? ((reportData.totalExpenses / reportData.totalIncome) * 100).toFixed(1) + "%"
                            : "0%"}
                    </p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Balance Available</p>
                    <p className="text-3xl font-bold text-yellow-400">Rs. {reportData.balanceLeft.toLocaleString()}</p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Total Saved</p>
                    <p className="text-3xl font-bold text-emerald-400">Rs. {reportData.totalSavings.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
