import fs from 'fs/promises';
import path from 'path';

// Get the absolute path to the data directory
const dataDir = path.join(process.cwd(), 'data');

export const getJSON = async (filename) => {
    const filePath = path.join(dataDir, filename);
    try {
        // Try to read the file
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or JSON is invalid, return empty array
        console.log(`[DB] Note: Could not read ${filename} (might be new). Returning empty array.`);
        return [];
    }
};

export const saveJSON = async (filename, data) => {
    const filePath = path.join(dataDir, filename);
    try {
        // Ensure the 'data' folder exists before writing
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`[DB] Error writing to ${filename}:`, error);
        throw error;
    }
};