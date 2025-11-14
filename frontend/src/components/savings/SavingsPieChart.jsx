import React from "react";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"];

export default function SavingsPieChart({ pieData }) {
    return (
        <div className="bg-gray-300 p-4 rounded-xl shadow flex flex-col items-center">
            <h2 className="text-xl font-bold self-start">Savings Division</h2>
            <div className="flex justify-center items-center w-full h-full">
            <PieChart width={400} height={350}>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                >
                    {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <ReTooltip />
                <Legend />
            </PieChart>
            </div>
        </div>
    );
}