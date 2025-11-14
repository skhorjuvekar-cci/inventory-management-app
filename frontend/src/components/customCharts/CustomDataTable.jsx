import { Pencil, Trash2 } from "lucide-react";

export default function DataTable({ columns, data, onDelete, onUpdate }) {
  return (
    <div className="w-full max-h-80 overflow-y-auto border">
      <table className="w-full border text-sm table-fixed">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-2 border text-left">
                {col.header}
              </th>
            ))}
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-2 border">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="p-2 border flex gap-x-3 items-center justify-center">
                  <button onClick={() => onUpdate(row)}>
                    <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
                  </button>
                  <button onClick={() => onDelete(row)}>
                    <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
