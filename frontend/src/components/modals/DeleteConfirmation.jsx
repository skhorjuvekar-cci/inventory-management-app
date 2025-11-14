export default function DeleteConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="p-6 bg-white rounded shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete?</h2>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
