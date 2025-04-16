import React, { useState } from 'react';
import IngredientCombobox from '../components/IngredientCombobox';

interface MockRecipe {
    id: number;
    title: string;
    ingredients: string[];
}

const FindRecipePage = () => {
    const [generatedRecipes, setGeneratedRecipes] = useState<MockRecipe[]>([]);

    return (
        <div>
            <h1>Find Recipes</h1>
            <IngredientCombobox onRecipesGenerated={setGeneratedRecipes} />

            <h2>Generated Recipes:</h2>
            {generatedRecipes.map(recipe => (
                <div key={recipe.id}>
                    <h3>{recipe.title}</h3>
                    <p>Ingredients: {recipe.ingredients.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default FindRecipePage;