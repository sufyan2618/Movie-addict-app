import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isSigningUp: false,
    isCheckingAuth: false,
    isLoggingIn: false,
    isLoggingOut: false,

    Register: async (username, email, password) => {
        set({ isSigningUp: true });
        try {
            const response = await fetch( `${API_URL}/auth/register`  , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
            const data = await response.json();
            // Save user and token to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token });
            return {success: true}
        } catch (error) {
            console.error('Error during registration:', error);
            return { error: error.message };
        } finally {
            set({ isSigningUp: false });
        }
    },
    Logout: async () => {
        set({isLoggingOut: true})
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token")
            set({user: null, token: null});
            return{success: true}
        } catch (error) {
            console.error("Error Logging out");
            return { error: error.message };
        }
        finally{
            set({isLoggingOut: false})
        }
    },
    CheckAuth: async() => {
        set({isCheckingAuth: true})
        try {
            const userString = await AsyncStorage.getItem("user", user);
            const tokenString = await AsyncStorage.getItem("token", token);
            const user = userString ? JSON.parse(userString) : null;
            const token = tokenString ? JSON.parse(tokenString) : null

            if(!user || !token) {
                set({user: null, token: null});
            }

            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000
            if(decodedToken.exp < currentTime){
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("user")
                set({user: null, token: null})
                console.log("Token is expired")
            } else{
                set({user, token});
            }
        } catch (error) {
            console.error("Error Logging out");
        }
        finally{
            set({isCheckingAuth: false})
        }
    }, 
    Login: async (email, password) => {
        set({isLoggingIn: true})
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password }),
            })
            if(!response.ok){
                const err = await response.json()
                throw new Error(err.message || 'Registration failed');
            }
            const data = await response.json();
            set({user: data.user, token: data.token})
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token",JSON.stringify(data.token));
            return {success: true}
        } catch (error) {
            console.error("Error logging in", error);
            return {error: error.message};
        }
        finally{
            set({isLoggingIn: false})
        }
    },
    GetMovies: async (token) => {
        try {
            const response = await fetch(`${API_URL}/movies/get-movies-by-user`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch books');
            }
            const data = await response.json();
            return { success: true, books: data.books };
        } catch (error) {
            console.error('Error fetching books:', error);
            return { error: error.message };
        }
    }
}));
export default useAuthStore;