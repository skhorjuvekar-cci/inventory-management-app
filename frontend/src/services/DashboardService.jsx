import { BASE_URL } from "../constants/constants";
import { getAuthToken } from "../utils/auth";

export async function getInsights(month = null) {
    try {
        const token = getAuthToken();
        
        const url = month 
            ? `${BASE_URL}/dashboard?month=${month}` 
            : `${BASE_URL}/dashboard`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();

        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message,
            };
        } else {
            return {
                success: false,
                message: result.message,
                errors: result.errors,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch insights. Please try again.",
            errors: [{ field: "network", message: error.message }],
        };
    }
}
export async function getBalance() {
    try {
        const token = getAuthToken();
        
        const url = `${BASE_URL}/dashboard/balance`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();

        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message,
            };
        } else {
            return {
                success: false,
                message: result.message,
                errors: result.errors,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch insights. Please try again.",
            errors: [{ field: "network", message: error.message }],
        };
    }
}