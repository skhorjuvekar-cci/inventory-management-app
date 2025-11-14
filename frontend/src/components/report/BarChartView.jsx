import { getCategoryColor } from "../../utils/reportUtils";

export default function BarChartView({ reportData }) {
    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex justify-center">
            <div className="flex justify-center gap-10 items-end h-80 w-full">
                {Object.entries(reportData.categoryBreakdown).map(([category, data]) => (
                    <div key={category} className="flex flex-col items-center w-20">
                        <div
                            className={`${getCategoryColor(category)} w-full rounded-t-lg transition-all duration-500`}
                            style={{ height: `${data.percentage * 2.5}px` }}
                        />
                        <span className="text-white text-sm mt-2">{data.percentage}%</span>
                        <span className="text-slate-300 text-sm mt-1 capitalize">{category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
