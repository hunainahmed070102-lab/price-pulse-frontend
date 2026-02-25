import axios from 'axios';

const API_URL = 'https://price-pulse-backend-blond.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Product API calls
export const productAPI = {
    getAll: async (category = '') => {
        try {
            const response = await api.get(`/products${category ? `?category=${category}` : ''}`);
            console.log('Products API Response:', response.data);
            if (response.data && response.data.success && response.data.data) {
                return { data: response.data };
            }
            return { data: response.data };
        } catch (error) {
            console.error('Error fetching products:', error);
            return { data: { data: [] } };
        }
    },
    
    getOne: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },
    
    create: async (data) => {
        try {
            const response = await api.post('/products', data);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },
    
    update: async (id, data) => {
        try {
            const response = await api.put(`/products/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },
};

// Complaint API calls
export const complaintAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/complaints');
            console.log('Complaints API Response:', response.data);
            if (response.data && response.data.success && response.data.data) {
                return { data: response.data };
            }
            return { data: response.data };
        } catch (error) {
            console.error('Error fetching complaints:', error);
            return { data: { data: [] } };
        }
    },
    
    getOne: async (id) => {
        try {
            const response = await api.get(`/complaints/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching complaint:', error);
            throw error;
        }
    },
    
    updateStatus: async (id, status) => {
        try {
            console.log(`Updating complaint ${id} to status: ${status}`);
            const response = await api.put(`/complaints/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating complaint status:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await api.delete(`/complaints/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting complaint:', error);
            throw error;
        }
    },
};

// Auth API calls
export const authAPI = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },
};

export default api;
