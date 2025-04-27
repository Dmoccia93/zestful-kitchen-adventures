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
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import IngredientCombobox from "@/components/IngredientCombobox";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const FindRecipe = () => {
    const [inputMethod, setInputMethod] = useState("manual");
    const [ingredients, setIngredients] = useState<string[]>([""]);
    const [webhookUrl, setWebhookUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    const handleIngredientChange = (index: number, value: string) => {
        try {
            const updatedIngredients = [...ingredients];
            updatedIngredients[index] = value;
            setIngredients(updatedIngredients);
        } catch (error) {
            console.error("Error updating ingredient:", error);
        }
    };

    const handleGenerateRecipe = async () => {
        if (!webhookUrl) {
            toast({
                title: "Error",
                description: "Please enter your n8n webhook URL",
                variant: "destructive",
            });
            return;
        }

        const validIngredients = ingredients.filter(ing => ing.trim() !== "");
        if (validIngredients.length === 0) {
            toast({
                title: "Error",
                description: "Please add at least one ingredient",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "no-cors",
                body: JSON.stringify({
                    ingredients: validIngredients
                }),
            });

            toast({
                title: "Request Sent",
                description: "The request was sent to your n8n workflow. Please check your workflow execution history.",
            });
        } catch (error) {
            console.error("Error triggering webhook:", error);
            toast({
                title: "Error",
                description: "Failed to trigger the n8n webhook. Please check the URL and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow py-12 px-6 sm:px-8 lg:px-12 bg-background">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground mt-12">
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

                    <div className="mb-8">
                        <Input
                            type="url"
                            placeholder="Enter your n8n webhook URL"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            className="mb-4"
                        />
                    </div>

                    <div className="space-y-4 mb-8">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-grow">
                                    <IngredientCombobox
                                        value={ingredient}
                                        onValueChange={(value) => handleIngredientChange(index, value)}
                                        label="Ingredient"
                                    />
                                </div>
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
                        disabled={isLoading}
                    >
                        <Search className="w-5 h-5 mr-2" />
                        {isLoading ? "Generating..." : "Generate Recipe"}
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FindRecipe;
