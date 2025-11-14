import { redirect } from 'react-router-dom';
import { login, signup } from "../services/AuthService";
import AuthForm from '../components/forms/AuthForm';

function AuthenticationPage() {
    return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get("mode") || "login";

    if (mode !== "login" && mode !== "signup") {
        return {
            errors: [{ field: "mode", message: "Unsupported mode." }],
            message: "Invalid request"
        };
    }

    const data = await request.formData();

    if (mode === "login") {
        const authData = {
            email: data.get("email"),
            password: data.get("password"),
        };

        const result = await login(authData);

        if (result.success) {
            localStorage.setItem("access_token", result.data.access_token);
            localStorage.setItem("refresh_token", result.data.refresh_token);

            return redirect("/home");
        } else {
            return result;
        }
    } else {
        const signupData = {
            first_name: data.get("first_name"),
            last_name: data.get("last_name"),
            email: data.get("email"),
            password: data.get("password"),
        };

        const result = await signup(signupData);

        if (result.success) {
            return redirect("/auth?mode=login");
        } else {
            return result;
        }
    }
}