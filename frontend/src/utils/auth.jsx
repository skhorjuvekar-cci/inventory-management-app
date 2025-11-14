import { redirect } from 'react-router-dom';

export function getAuthToken() {
    const token = localStorage.getItem('access_token');
    return token;
}

export function tokenLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect('/auth?mode=login');
    }
    
    return token;
}

export function checkAuthLoader() {
    const token = getAuthToken();

    if (token) {
        return redirect('/home');
    }
    
    return null;
}