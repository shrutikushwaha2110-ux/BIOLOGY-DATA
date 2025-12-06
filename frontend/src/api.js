// API configuration for the Biology Data frontend

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all research items
export async function fetchResearchItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/research`);
        if (!response.ok) throw new Error('Failed to fetch research items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching research items:', error);
        throw error;
    }
}

// Fetch a single research item by ID
export async function fetchResearchById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/research/${id}`);
        if (!response.ok) throw new Error('Failed to fetch research');
        return await response.json();
    } catch (error) {
        console.error('Error fetching research:', error);
        throw error;
    }
}

// Fetch categories
export async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// Fetch raw data file
export async function fetchRawData(filename) {
    try {
        const response = await fetch(`${API_BASE_URL}/data/${encodeURIComponent(filename)}`);
        if (!response.ok) throw new Error('Failed to fetch raw data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching raw data:', error);
        throw error;
    }
}

// List all available raw data files
export async function listRawDataFiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/data`);
        if (!response.ok) throw new Error('Failed to list raw data files');
        return await response.json();
    } catch (error) {
        console.error('Error listing raw data files:', error);
        throw error;
    }
}

// Search research items
export async function searchResearch(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search');
        return await response.json();
    } catch (error) {
        console.error('Error searching:', error);
        throw error;
    }
}

// Get filter options
export async function fetchFilterOptions() {
    try {
        const [years, authors, keywords, domains] = await Promise.all([
            fetch(`${API_BASE_URL}/filters/years`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/filters/authors`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/filters/keywords`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/filters/domains`).then(r => r.ok ? r.json() : []),
        ]);
        return { years, authors, keywords, domains };
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return { years: [], authors: [], keywords: [], domains: [] };
    }
}

export default {
    fetchResearchItems,
    fetchResearchById,
    fetchCategories,
    fetchRawData,
    listRawDataFiles,
    searchResearch,
    fetchFilterOptions,
};
