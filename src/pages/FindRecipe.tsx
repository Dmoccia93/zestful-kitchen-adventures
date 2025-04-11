
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";

const FindRecipe = () => {
  const [inputMethod, setInputMethod] = useState("manual");
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([
    { name: "", quantity: "" }
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleIngredientChange = (index: number, field: "name" | "quantity", value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleGenerateRecipe = () => {
    // This functionality will be implemented later
    console.log("Generating recipe with ingredients:", ingredients);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-12 px-6 sm:px-8 lg:px-12 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
            Add here the ingredients that you have to get a fab recipe
          </h1>
          
          <div className="mb-8">
            <Select value={inputMethod} onValueChange={setInputMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select input method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Input ingredients manually</SelectItem>
                <SelectItem value="image" disabled>
                  Share a pic of your fridge - coming soon
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4 mb-8">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  className="flex-grow"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                />
                <Input
                  className="w-1/3"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                />
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={handleAddIngredient}
              className="w-full flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add another ingredient
            </Button>
          </div>
          
          <Button 
            className="w-full py-6 text-lg" 
            onClick={handleGenerateRecipe}
          >
            <Search className="w-5 h-5 mr-2" />
            Generate Recipe
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindRecipe;
