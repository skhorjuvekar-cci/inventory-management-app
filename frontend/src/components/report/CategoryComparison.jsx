import { BarChart3, CheckCircle } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryComparison({ reportData }) {
    const needs = reportData.categoryBreakdown.needs.amount;
    const wants = reportData.categoryBreakdown.wants.amount;
    const total = needs + wants;

    const needsPercent = total > 0 ? (needs / total) * 100 : 50;
    const wantsPercent = total > 0 ? (wants / total) * 100 : 50;

    const data = {
        labels: ["Needs", "Wants"],
        datasets: [
            {
                data: [needs, wants],
                backgroundColor: ["#3b82f6", "#a78bfa"],
                borderColor: ["#1e40af", "#6d28d9"],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw;
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${tooltipItem.label}: Rs. ${value.toLocaleString()} (${percent}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-green-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Category Comparison</h2>
            </div>

            {/* Needs & Wants summary */}
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex justify-between mb-2">
                    <span className="text-blue-400 font-semibold">Needs</span>
                    <span className="text-white font-bold">Rs. {needs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="text-purple-400 font-semibold">Wants</span>
                    <span className="text-white font-bold">Rs. {wants.toLocaleString()}</span>
                </div>

                {/* Conditional message */}
                {needs > wants ? (
                    <div className="flex items-center gap-2 p-3 bg-green-900/30 rounded-lg border border-green-700 mb-4">
                        <CheckCircle className="text-green-400" size={20} />
                        <p className="text-green-300 text-sm">
                            Great discipline! You spent more on needs than wants.
                        </p>
                    </div>
                ) : needs < wants ? (
                    <div className="flex items-center gap-2 p-3 bg-yellow-900/30 rounded-lg border border-yellow-700 mb-4">
                        <CheckCircle className="text-yellow-400" size={20} />
                        <p className="text-yellow-300 text-sm">
                            Careful! You spent more on wants than needs.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-3 bg-blue-900/30 rounded-lg border border-blue-700 mb-4">
                        <CheckCircle className="text-blue-400" size={20} />
                        <p className="text-blue-300 text-sm">
                            Your spending on needs and wants is exactly equal.
                        </p>
                    </div>
                )}
            </div>

            {/* Centered Donut */}
            <div className="flex flex-col items-center mt-6">
                <div className="relative w-56 h-56">
                    <Doughnut data={data} options={options} />
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Total</p>
                        <p className="text-white font-bold text-lg">Rs. {total.toLocaleString()}</p>
                    </div>
                </div>

                {/* Custom Legend */}
                <div className="flex gap-8 mt-6">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-blue-400 rounded-full"></span>
                        <div className="text-left">
                            <p className="text-white text-sm font-semibold">
                                Needs: {needsPercent.toFixed(1)}%
                            </p>
                            <p className="text-slate-400 text-xs">Rs. {needs.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-purple-400 rounded-full"></span>
                        <div className="text-left">
                            <p className="text-white text-sm font-semibold">
                                Wants: {wantsPercent.toFixed(1)}%
                            </p>
                            <p className="text-slate-400 text-xs">Rs. {wants.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
