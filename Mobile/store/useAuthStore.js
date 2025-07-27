import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isSigningUp: false,

    Register: async (username, email, password) => {
        set({ isSigningUp: true });
        try {
            const response = await fetch(`http://10.0.2.2:7000/api/auth/register`, {
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
    }
}));
export default useAuthStore;