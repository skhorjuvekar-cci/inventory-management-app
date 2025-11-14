import { Download } from "lucide-react";
import { months } from "../../constants/months";

export default function ReportHeader({ selectedMonth, setSelectedMonth, onExport }) {
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <p className="text-slate-300 text-lg">Month:</p>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="rounded-xl p-1 bg-slate-700 text-white"
                >
                    {months.map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                    ))}
                </select>
            </div>
            <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg"
                onClick={onExport}
            >
                <Download size={20} /> Export Report
            </button>
        </div>
    );
}
