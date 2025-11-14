import {Plus} from "lucide-react";

export default function QuickActions({addSaving, addIncome, addExpense}) {
  const QUICK_ACTIONS = [{name: "Income", action: addIncome }, {name:"Expenses", action:addExpense}, {name:"Savings", action:addSaving}]
  return (
    <div className="border-2 rounded-2xl bg-gray-900 border-blue-500 p-5 flex flex-col gap-y-2">
      <h3 className="text-white text-2xl font-bold flex items-center gap-x-2">
        Quick Actions
      </h3>
      <div className="flex items-center justify-around">
        {QUICK_ACTIONS.map((type) => (
          <div
            key={type.name}
            className="w-40 h-40 bg-primary rounded-xl flex flex-col justify-center items-center gap-y-2"
          >
            <button
              type="button"
              onClick={type.action}
              className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition"
            >
              <Plus size={24} />
            </button>
            <h3 className="text-white text-xl font-semibold">Add {type.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}