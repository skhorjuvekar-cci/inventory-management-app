import { BASE_URL } from "../constants/constants";
import { getAuthToken } from "../utils/auth";

async function handleApiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || `HTTP Error: ${response.status}`,
                errors: errorData.errors || null,
            };
        }

        const result = await response.json();

        if (result.success !== undefined) {
            return result;
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error. Please check your connection and try again.",
            errors: [{ field: "network", message: error.message }],
        };
    }
}

export async function getExpenses(month = null) {
    const token = getAuthToken();
    const url = month 
        ? `${BASE_URL}/expenses?month=${month}` 
        : `${BASE_URL}/expenses`;

    return handleApiRequest(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function createExpense(expenseData) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
    });
}

export async function deleteExpense(expense_id) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/expenses/${expense_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function updateExpense(updateData, expense_id) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/expenses/${expense_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });
}

export async function uploadExpenseCSV(file) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    return handleApiRequest(`${BASE_URL}/expenses/bulk`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
}