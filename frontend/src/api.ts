import { supabase } from "./supabaseClient";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || "Request failed");
    }

    return response.json();
}