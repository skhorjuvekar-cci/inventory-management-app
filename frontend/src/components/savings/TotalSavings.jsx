import React from "react";

export default function TotalSavings({ total }) {
    return (
        <div className="bg-gray-300 p-6 rounded-xl shadow flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold">Total Savings</h2>
            <p className="text-2xl font-semibold text-green-600">Rs. {total}</p>
        </div>
    );
}
