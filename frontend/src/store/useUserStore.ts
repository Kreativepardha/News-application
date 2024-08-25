import { create } from "zustand";
import { User } from "../types/userTypes";
import axios from "axios";
import { BACKEND_URL } from "../config/apiRoutes";


interface UserState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    register: (name: string, email: string, password: string) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    clearError: () => void;
    getUserId: () => number | null;
}

const useUserStore = create<UserState>((set) => ({
    user: null, token: null, error: null, isLoading: false,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null, token: null}),

    register: async (name, email, password) => {
        set({ isLoading: true  });
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/register`, {name, email, password})
            const { user } = response.data;
            set({ user, error:null   });
        } catch (err) {
            set({error: 'Registration failed. Please try again'})
        } finally{
            set({ isLoading: false})
        }
    },

    login: async(email, password) => {
        set({ isLoading: true})
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/login`, { email, password})
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, error: null});
        } catch (err) {
            set({ error : "Login failed. Please check your credentials"})
        } finally{
            set({ isLoading: false  })
        }
    },
    clearError: () => set({ error: null}),

    getUserId: () => {
        const state = useUserStore.getState();
        return state.user ? state.user.id : null;
    }
}));


export default useUserStore;