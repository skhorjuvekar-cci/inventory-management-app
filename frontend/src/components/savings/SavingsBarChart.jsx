import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from "recharts";

export default function SavingsBarChart({ barChartData }) {
    return (
        <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col">
            <h2 className="text-xl font-bold mb-4">Monthly Savings</h2>
             <div className="flex justify-center items-center w-full h-full">
            <BarChart width={400} height={250} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="total" fill="#4CAF50" />
            </BarChart>
            </div>
        </div>
    );
}
