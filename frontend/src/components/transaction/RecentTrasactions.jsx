export default function RecentTransactions({ transactionList }) {
    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'income':
                return 'text-green-400';
            case 'expense':
                return 'text-red-400';
            case 'saving':
            case 'savings':
                return 'text-yellow-400';
            default:
                return 'text-gray-400';
        }
    };

    const getAmountColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'income':
                return 'text-green-300';
            case 'expense':
                return 'text-red-300';
            case 'saving':
            case 'savings':
                return 'text-yellow-300';
            default:
                return 'text-white';
        }
    };

    return (
        <>
            {
                transactionList.length > 0 ? (
                    <ul className="text-white">
                        {transactionList.map((tx, idx) => (
                            <li key={idx} className="border-b border-gray-700 py-3 hover:bg-white/5 transition-colors duration-200 px-2 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{tx.name || tx.saving_type || tx.income_source}</span>
                                    <span className={`font-semibold ${getAmountColor(tx.type)}`}>
                                        Rs.{" "}
                                        {tx.amount || tx.total_amount || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className={`font-medium ${getTypeColor(tx.type)}`}>
                                        {tx.type}
                                    </span>
                                    <span className="text-gray-500">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-white text-sm">No recent transactions</p>
                )
            }
        </>
    )
}