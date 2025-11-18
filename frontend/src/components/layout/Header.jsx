export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b border-teal-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-800">
                            Sai Island Inventory
                        </h1>
                        <p className="text-sm text-teal-600 mt-1">Goa Business Manager</p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-600">Logged in as</p>
                        <p className="font-semibold text-teal-700">Store Manager</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
