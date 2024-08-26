import { create } from "zustand";
import { News } from "../types/userTypes";
import axios from "axios";
import { BACKEND_URL } from "../config/apiRoutes";








interface NewsState {
    news: News []
    error: string | null;
    isLoading: boolean;
    fetchAllNews: () => Promise<void>;
    createNews: (title: string, content: string, image: File, userId: number) => Promise<void>
    updateNews: (id: number, title: string, content: string, image?: File) => Promise<void>
    deleteNews: (id: number) => Promise<void>
}


const useNewsStore = create<NewsState>((set) => ({
    news: [], error:null, isLoading: false,

    fetchAllNews: async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/news`, {
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")
                }
            })
            console.log(response.data)
            if (Array.isArray(response.data.news)) {
                set({ news: response.data.news, error: null });
              } else {
                set({ news: [], error: "Unexpected response format" });
              }
        } catch (err) {
            set({ error: 'Failed to fetch News.'})
        } finally{
            set({ isLoading: false })
        }
    },

    createNews: async (title, content, image, userId) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append('title', title)
            formData.append('content', content)
            formData.append('image', image)
            formData.append('userId', userId.toString())
        
            await axios.post(`${BACKEND_URL}/news/`, formData, {
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")
                }
            });
            await useNewsStore.getState().fetchAllNews();
        } catch (err) {
            set({ error: "failed tp create news"})
        } finally{
            set({ isLoading: false})
        }
    },
    updateNews: async (id, title, content, image) => {
        set({isLoading: true});
        try {
            const formData = new FormData();
            formData.append('title', title)
            formData.append('content', content);
            if(image) formData.append('image', image);

            await axios.put(`${BACKEND_URL}/news/${id}`, formData, {
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")
                }
            });
            await useNewsStore.getState().fetchAllNews();
        } catch (err) {
            set({ error: 'failed to update news.'})
        } finally{
            set({ isLoading: false })
        }
    },
    deleteNews: async (id) => {
        set({ isLoading: true})
        try {
            await axios.delete(`${BACKEND_URL}/news/${id}`);

            await useNewsStore.getState().fetchAllNews();
        } catch (err) {
            set({ error: "Failed to deleted news"})
        } finally {
            set({ isLoading: false})
        }
    },
}))



export default useNewsStore;