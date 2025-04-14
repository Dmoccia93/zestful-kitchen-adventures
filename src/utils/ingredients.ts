import { readFileSync } from 'fs';
import path from 'path';

// Modified path to point to src/top-1k-ingredients.csv (YOUR FILE NAME!)
const csvFilePath = path.join(process.cwd(), 'src', 'top-1k-ingredients.csv');

// Read the CSV file
const csvData = readFileSync(csvFilePath, 'utf-8');

// Parse the CSV data
const ingredients = csvData.split('\n').map(ingredient => ingredient.trim());
console.log("Loaded ingredients:", ingredients);

// Function to search for matching ingredients
export const findMatchingIngredients = (query: string): string[] => {
    if (!query) {
        return ingredients; // Return all ingredients if query is empty
    }
    const lowerCaseQuery = query.toLowerCase();
    return ingredients.filter(ingredient =>
        ingredient.toLowerCase().startsWith(lowerCaseQuery)
    );
};

// Function to validate if an ingredient exists
export const isValidIngredient = (ingredient: string): boolean => {
    return ingredients.includes(ingredient.trim());
};

// Export the full ingredients list for autocomplete suggestions
export const allIngredients = ingredients;
