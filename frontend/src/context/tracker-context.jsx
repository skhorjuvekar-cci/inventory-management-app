import { createContext, useEffect, useState } from "react"
import { getBalance } from "../services/DashboardService";

export const TrackerContext = createContext({
    currentMonthBalance: 0,
})
export default function TrackerContextProvider({ children }) {
    const [currentMonthBalance, setCurrentMonthBalance] = useState(0);

    useEffect(() => {
        async function fetchCurrentBalance() {
            try {
                const resData = await getBalance();
                const data = resData.data
                setCurrentMonthBalance(data.balance);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
                setCurrentMonthBalance(0);
            }
        }
        fetchCurrentBalance();
    }, []);


    const contextValue = {
        currentMonthBalance
    }
    return (
        <TrackerContext.Provider value={contextValue}>{children}</TrackerContext.Provider>
    )
}