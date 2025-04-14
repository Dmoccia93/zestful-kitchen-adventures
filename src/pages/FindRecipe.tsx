
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { PlusCircle, Search, AlertCircle } from "lucide-react";
import { isValidIngredient } from "@/utils/ingredients";
import IngredientCombobox from "@/components/IngredientCombobox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

// Define the validation schema with Zod
const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required")
    .refine((val) => isValidIngredient(val), {
      message: "This ingredient is not in our database",
    }),
  quantity: z.string().optional(),
});

const formSchema = z.object({
  inputMethod: z.enum(["manual", "image"]),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FindRecipe = () => {
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputMethod: "manual",
      ingredients: [{ name: "", quantity: "" }],
    },
  });

  // Set up field array for handling multiple ingredients
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const onSubmit = (data: FormValues) => {
    // This functionality will be implemented later
    console.log("Generating recipe with ingredients:", data.ingredients);
    toast({
      title: "Recipe request submitted",
      description: "We're generating your recipe based on " + data.ingredients.length + " ingredients",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-12 px-6 sm:px-8 lg:px-12 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground mt-12">
            Add here the ingredients that you have to get a fab recipe
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="inputMethod"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 mb-8">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <div className="flex-grow">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IngredientCombobox
                                value={field.value}
                                onValueChange={field.onChange}
                                label="Ingredient name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="w-1/3">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Quantity"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="mt-2" 
                        onClick={() => remove(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => append({ name: "", quantity: "" })}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add another ingredient
                </Button>
              </div>
              
              <Button 
                type="submit"
                className="w-full py-6 text-lg" 
              >
                <Search className="w-5 h-5 mr-2" />
                Generate Recipe
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindRecipe;
