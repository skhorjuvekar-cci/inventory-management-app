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

export async function getSaving(month = null) {
    const token = getAuthToken();
    const url = month 
        ? `${BASE_URL}/savings?month=${month}` 
        : `${BASE_URL}/savings`;

    return handleApiRequest(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function createSaving(savingData) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/savings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(savingData),
    });
}

export async function deleteSaving(saving_id) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/savings/${saving_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function updateSavings(updateData, saving_id) {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/savings/${saving_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });
}

export async function uploadSavingCSV(file) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    return handleApiRequest(`${BASE_URL}/savings/bulk`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
}

export async function getTypes() {
    const token = getAuthToken();

    return handleApiRequest(`${BASE_URL}/savings/types`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}