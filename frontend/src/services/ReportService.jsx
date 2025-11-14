import { BASE_URL } from "../constants/constants";
import { getAuthToken } from "../utils/auth";

export async function getReport(month = null) {
    try {
        const token = getAuthToken();
        let url = `${BASE_URL}/report`;
        if (month) {
            url += `?month=${month}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const resData = await response.json();
        return resData;
    } catch (error) {
        throw error;
    }
}
