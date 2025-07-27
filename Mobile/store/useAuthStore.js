import create from 'zustand';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isSigningUp: false,
    baseUrl: 'http://localhost:7000/api',

    Register: async (username, email, password) => {
        set({ isSigningUp: true });
        const { baseUrl } = get(); 
        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            const data = await response.json();
            set({ user: data.user, token: data.token });
        } catch (error) {
            console.error('Error during registration:', error);
            return { error: error.message };
        } finally {
            set({ isSigningUp: false });
        }
    }
}));
export default useAuthStore;