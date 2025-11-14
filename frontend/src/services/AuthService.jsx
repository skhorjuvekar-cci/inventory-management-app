import { BASE_URL } from "../constants/constants.jsx";

export async function login(authData) {
    try {

        const response = await fetch(`${BASE_URL}/auth/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(authData),
        });

        const result = await response.json();

        return {
            success: result.success,
            data: result.data,
            message: result.message,
            errors: result.errors,
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error. Please try again.",
            errors: [{ field: "network", message: error.message }],
        };
    }
}

export async function signup(signupData) {
    try {
        console.log(`${BASE_URL}/auth/sign-up`)
        const response = await fetch(`${BASE_URL}/auth/sign-up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        });

        const result = await response.json();
        const data = await result.data
        console.log(data)
        return {
            success: result.success,
            data: result.data,
            message: result.message,
            errors: result.errors,
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error. Please try again.",
            errors: [{ field: "network", message: error.message }],
        };
    }
}