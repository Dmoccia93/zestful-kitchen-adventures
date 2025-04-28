
import React from 'react';
import { RecipeBannerWrapper } from './RecipeBannerWrapper';

interface RecipesContainerProps {
  recipe1Content: any;
  recipe2Content: any;
  onRecipeSelect: (recipe: string) => void;
}

export const RecipesContainer: React.FC<RecipesContainerProps> = ({
  recipe1Content,
  recipe2Content,
  onRecipeSelect,
}) => {
  if (!recipe1Content || !recipe2Content) return null;

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <RecipeBannerWrapper
        recipe={recipe1Content}
        type="recipe1"
        onSelect={onRecipeSelect}
      />
      <RecipeBannerWrapper
        recipe={recipe2Content}
        type="recipe2"
        onSelect={onRecipeSelect}
      />
    </div>
  );
};
