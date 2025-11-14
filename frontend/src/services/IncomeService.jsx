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

export async function getIncome(month = null) {
    const token = getAuthToken();
    const url = month 
        ? `${BASE_URL}/income?month=${month}` 
        : `${BASE_URL}/income`;

    return handleApiRequest(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function createIncome(incomeData) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/income`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(incomeData),
    });
}

export async function deleteIncome(income_id) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/income/${income_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function updateIncome(updateData, income_id) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/income/${income_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });
}

export async function uploadIncomeCSV(file) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    return handleApiRequest(`${BASE_URL}/income/bulk`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
}

export async function getSources() {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/income/sources`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}