
import React from 'react';
import { Button } from '@/components/ui/button';
import IngredientCombobox from '../IngredientCombobox';

interface IngredientsInputProps {
  ingredients: string[];
  onIngredientChange: (index: number, value: string) => void;
  onAddIngredient: () => void;
  onGenerateRecipes: () => void;
  isGenerating: boolean;
}

export const IngredientsInput: React.FC<IngredientsInputProps> = ({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onGenerateRecipes,
  isGenerating,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <IngredientCombobox
            value={ingredient}
            onValueChange={(value) => onIngredientChange(index, value)}
            label={`Ingredient ${index + 1}`}
          />
        </div>
      ))}

      <div className="flex flex-wrap gap-4 mt-4">
        <Button onClick={onAddIngredient} variant="outline">
          Add another ingredient
        </Button>
        <Button onClick={onGenerateRecipes} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Recipe'}
        </Button>
      </div>
    </div>
  );
};
