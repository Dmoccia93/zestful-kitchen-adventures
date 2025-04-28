
import React from 'react';
import RecipeBanner from '../RecipeBanner';
import { MacrosPieChart } from './MacrosPieChart';

interface RecipeBannerWrapperProps {
  recipe: any;
  type: 'recipe1' | 'recipe2';
  onSelect: (recipe: string) => void;
}

export const RecipeBannerWrapper: React.FC<RecipeBannerWrapperProps> = ({
  recipe,
  type,
  onSelect,
}) => {
  const isRecipe1 = type === 'recipe1';
  const containerStyle = isRecipe1 ? { backgroundColor: '#f0fdf4' } : { backgroundColor: '#fef3c7' };
  const headerStyle = isRecipe1 ? 'bg-green-500' : 'bg-yellow-500';
  const headerText = isRecipe1
    ? 'Recipe 1: Do something great with what you have'
    : 'Recipe 2: Add a little touch for something special';

  return (
    <div style={containerStyle}>
      <div className={`${headerStyle} text-white p-2 text-center`}>{headerText}</div>
      <div className="relative">
        <RecipeBanner
          title={recipe.recipeName}
          subtitle={`Cooking Time: ${recipe.totalTime}`}
          cookTime={parseInt(recipe.totalTime)}
          calories={isRecipe1 ? undefined : parseInt(recipe.totalKcals)}
          tags={isRecipe1 ? [recipe.nutritionTag] : [`${recipe.totalKcals} kcal`]}
          onClick={() => onSelect(type)}
        />
        {!isRecipe1 && recipe.macros && (
          <div className="absolute bottom-4 right-4">
            <MacrosPieChart macrosString={recipe.macros} />
          </div>
        )}
      </div>
    </div>
  );
};
