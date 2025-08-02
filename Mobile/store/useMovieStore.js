import { create } from "zustand";
import { API_URL } from "../constants/api";
const useMovieStore = create((set, get) => ({

    isUploading: false,
    isFetchingMovies: false,
    movies: [],
    UploadMovie: async (title, rating, picture, caption, token) => {
        set({ isUploading: true });
        try {
            console.log("Uploading movie with data:", {
                title,
                rating,
                picture,
                caption,
            });
            const uriParts = picture.split(".");
            const fileType = uriParts[uriParts.length - 1];
            const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
            console.log("Image type determined as:", imageType);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('rating', rating.toString());
            formData.append('description', caption);
            formData.append('imageFile', {
                uri: picture,
                type: imageType, 
                name: 'movie_picture.jpg',
            });

            const response = await fetch(`${API_URL}/movies/post-movie`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }
            const data = await response.json();
            return { success: true };
        } catch (error) {
            console.error('Error during upload:', error);
            return { error: error.message };
        } finally {
            set({ isUploading: false });
        }
    },
    FetchMovies : async (page, token) => {
        set({ isFetchingMovies: true });
        try {
            const response = await fetch(`${API_URL}/movies/get-movies?page=${page}&limit=2`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch movies');
            }

            const data = await response.json();

            if(page === 1) {
                set({movies: data.movies});
            } else{
                set((state) => ({
                    movies: [...state.movies, ...data.movies],
                }));
            }
            return { success: true, movies: data.movies, totalPages: data.totalPages };
        } catch (error) {
            console.error('Error fetching movies:', error);
            return { error: error.message };
        } finally {
            set({ isFetchingMovies: false });
        }
    }


})
);
export default useMovieStore;