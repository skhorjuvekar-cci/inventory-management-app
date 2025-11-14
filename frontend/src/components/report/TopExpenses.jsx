import { getCategoryBgColor, getCategoryColor } from "../../utils/reportUtils";

export default function TopExpenses({ reportData }) {
    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Top 5 Expenses</h2>
            <div className="space-y-3">
                {reportData.topExpenses.map((expense, index) => (
                    <div
                        key={index}
                        className={`${getCategoryBgColor(expense.category)} border-l-4 ${getCategoryColor(expense.category)} rounded-lg p-4 flex justify-between items-center`}
                    >
                        <div>
                            <p className="font-semibold text-slate-800">{expense.name}</p>
                            <p className="text-sm text-slate-600 capitalize">{expense.category}</p>
                        </div>
                        <p className="text-xl font-bold text-slate-800">Rs. {expense.amount.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
