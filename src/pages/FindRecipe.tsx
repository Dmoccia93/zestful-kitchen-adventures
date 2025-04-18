import React, { useState } from 'react';
import IngredientCombobox from '../components/IngredientCombobox';
import { findRecipesByIngredients, searchIngredients } from '../services/spoonacularService';

const FindRecipe: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [recipeResults, setRecipeResults] = useState([]);
    const [suggestionResults, setSuggestionResults] = useState<string[]>([]);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
        // Potentially trigger suggestion search here if you still want suggestions
        // fetchSuggestions(value);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, '']);
    };

    const fetchSuggestions = async (query: string) => {
        if (query.length >= 2) {
            setIsSearchingSuggestions(true);
            const suggestions = await searchIngredients(query);
            setSuggestionResults(suggestions.map(s => s.name));
            setIsSearchingSuggestions(false);
        } else {
            setSuggestionResults([]);
        }
    };

    const handleGenerateRecipes = async () => {
        setIsGeneratingRecipes(true);
        const validIngredients = ingredients.filter(ing => ing.trim() !== '');
        if (validIngredients.length > 0) {
            const recipes = await findRecipesByIngredients(validIngredients);
            setRecipeResults(recipes);
        } else {
            // Handle case with no ingredients
            setRecipeResults([]);
        }
        setIsGeneratingRecipes(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleGenerateRecipes();
        }
    };

    return (
        <div>
            {/* ... other components ... */}
            {ingredients.map((ingredient, index) => (
                <div key={index}>
                    <IngredientCombobox
                        value={ingredient}
                        onValueChange={(value) => handleIngredientChange(index, value)}
                        label={`Ingredient ${index + 1}`}
                        // If you still want suggestions, you'd need to manage the trigger
                        // and pass down the results.
                        // triggerSearch={ingredient.length >= 2}
                        // onSearch={fetchSuggestions}
                        suggestions={suggestionResults}
                        isLoading={isSearchingSuggestions}
                        onKeyDown={handleKeyDown} // Listen for Enter key
                    />
                </div>
            ))}
            <button onClick={addIngredientField}>Add another ingredient</button>
            <button onClick={handleGenerateRecipes} disabled={isGeneratingRecipes}>
                {isGeneratingRecipes ? 'Generating...' : 'Generate Recipe'}
            </button>
            {/* ... display recipeResults ... */}
        </div>
    );
};

export default FindRecipe;