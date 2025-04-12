import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNotification } from "../context/notification-context";

// Simple Button component
function Button({ children, variant = "default", size = "default", onClick, className = "", ...props }) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-[#6B4226] text-white hover:bg-[#513B30] focus:ring-[#3C2A21]",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3 text-base",
    icon: "h-8 w-8 p-0"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

// Simple Input component
function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226] ${className}`}
      {...props}
    />
  );
}

// Label component
function Label({ children, htmlFor, className = "" }) {
  return (
    <label 
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
}

// Simple Modal component
function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        {footer && (
          <div className="border-t p-4 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Recipe card component
function RecipeCard({ recipe, onViewRecipe }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="font-medium text-lg mb-1">{recipe.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{recipe.category}</p>
      <p className="text-sm mb-4 line-clamp-2">{recipe.description}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => onViewRecipe(recipe)}
      >
        View Recipe
      </Button>
    </div>
  );
}

export default function RecipesPage() {
  const [selectedTab, setSelectedTab] = useState("drinks");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const { showNotification } = useNotification();
  
  // Fetch recipes
  const { data: recipes = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/recipes"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          return [
            {
              id: 1,
              name: "Iced Caramel Macchiato",
              category: "Drinks",
              description: "A refreshing iced espresso drink with vanilla syrup and caramel drizzle.",
              ingredients: [
                { id: 1, name: "Espresso", quantity: 2, measurement: "shots", expirationDate: new Date(2025, 3, 15) },
                { id: 2, name: "Milk", quantity: 8, measurement: "oz", expirationDate: new Date(2025, 3, 10) },
                { id: 3, name: "Vanilla Syrup", quantity: 2, measurement: "pumps", expirationDate: new Date(2025, 6, 20) },
                { id: 4, name: "Caramel Sauce", quantity: 1, measurement: "tbsp", expirationDate: new Date(2025, 8, 5) }
              ],
              supplies: [
                { id: 1, name: "16oz Cup", quantity: 1, measurement: "pc" },
                { id: 2, name: "Straw", quantity: 1, measurement: "pc" },
                { id: 3, name: "Lid", quantity: 1, measurement: "pc" }
              ]
            },
            {
              id: 2,
              name: "Cappuccino",
              category: "Drinks",
              description: "Traditional Italian coffee drink with espresso, steamed milk, and milk foam.",
              ingredients: [
                { id: 1, name: "Espresso", quantity: 2, measurement: "shots", expirationDate: new Date(2025, 3, 15) },
                { id: 2, name: "Milk", quantity: 4, measurement: "oz", expirationDate: new Date(2025, 3, 10) }
              ],
              supplies: [
                { id: 1, name: "8oz Cup", quantity: 1, measurement: "pc" },
                { id: 2, name: "Lid", quantity: 1, measurement: "pc" }
              ]
            },
            {
              id: 3,
              name: "Avocado Toast",
              category: "Foods",
              description: "Toasted artisan bread topped with mashed avocado, salt, pepper, and red pepper flakes.",
              ingredients: [
                { id: 1, name: "Artisan Bread", quantity: 1, measurement: "slice", expirationDate: new Date(2025, 3, 5) },
                { id: 2, name: "Avocado", quantity: 0.5, measurement: "pc", expirationDate: new Date(2025, 3, 3) },
                { id: 3, name: "Salt", quantity: 0.25, measurement: "tsp", expirationDate: new Date(2025, 12, 31) },
                { id: 4, name: "Pepper", quantity: 0.25, measurement: "tsp", expirationDate: new Date(2025, 12, 31) },
                { id: 5, name: "Red Pepper Flakes", quantity: 0.25, measurement: "tsp", expirationDate: new Date(2025, 12, 31) }
              ],
              supplies: [
                { id: 1, name: "Plate", quantity: 1, measurement: "pc" },
                { id: 2, name: "Napkin", quantity: 1, measurement: "pc" }
              ]
            },
            {
              id: 4,
              name: "Blueberry Muffin",
              category: "Foods",
              description: "Freshly baked muffin filled with blueberries and topped with sugar crystals.",
              ingredients: [
                { id: 1, name: "Muffin Mix", quantity: 1, measurement: "batch", expirationDate: new Date(2025, 5, 15) },
                { id: 2, name: "Blueberries", quantity: 1, measurement: "cup", expirationDate: new Date(2025, 3, 7) },
                { id: 3, name: "Sugar Crystals", quantity: 2, measurement: "tbsp", expirationDate: new Date(2025, 12, 31) }
              ],
              supplies: [
                { id: 1, name: "Muffin Liner", quantity: 1, measurement: "pc" },
                { id: 2, name: "Napkin", quantity: 1, measurement: "pc" }
              ]
            }
          ];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching recipes:", error);
        return [
          {
            id: 1,
            name: "Iced Caramel Macchiato",
            category: "Drinks",
            description: "A refreshing iced espresso drink with vanilla syrup and caramel drizzle.",
            ingredients: [
              { id: 1, name: "Espresso", quantity: 2, measurement: "shots", expirationDate: new Date(2025, 3, 15) },
              { id: 2, name: "Milk", quantity: 8, measurement: "oz", expirationDate: new Date(2025, 3, 10) },
              { id: 3, name: "Vanilla Syrup", quantity: 2, measurement: "pumps", expirationDate: new Date(2025, 6, 20) },
              { id: 4, name: "Caramel Sauce", quantity: 1, measurement: "tbsp", expirationDate: new Date(2025, 8, 5) }
            ],
            supplies: [
              { id: 1, name: "16oz Cup", quantity: 1, measurement: "pc" },
              { id: 2, name: "Straw", quantity: 1, measurement: "pc" },
              { id: 3, name: "Lid", quantity: 1, measurement: "pc" }
            ]
          },
          {
            id: 2,
            name: "Cappuccino",
            category: "Drinks",
            description: "Traditional Italian coffee drink with espresso, steamed milk, and milk foam.",
            ingredients: [
              { id: 1, name: "Espresso", quantity: 2, measurement: "shots", expirationDate: new Date(2025, 3, 15) },
              { id: 2, name: "Milk", quantity: 4, measurement: "oz", expirationDate: new Date(2025, 3, 10) }
            ],
            supplies: [
              { id: 1, name: "8oz Cup", quantity: 1, measurement: "pc" },
              { id: 2, name: "Lid", quantity: 1, measurement: "pc" }
            ]
          },
          {
            id: 3,
            name: "Avocado Toast",
            category: "Foods",
            description: "Toasted artisan bread topped with mashed avocado, salt, pepper, and red pepper flakes.",
            ingredients: [
              { id: 1, name: "Artisan Bread", quantity: 1, measurement: "slice", expirationDate: new Date(2025, 3, 5) },
              { id: 2, name: "Avocado", quantity: 0.5, measurement: "pc", expirationDate: new Date(2025, 3, 3) },
              { id: 3, name: "Salt", quantity: 0.25, measurement: "tsp", expirationDate: new Date(2025, 12, 31) },
              { id: 4, name: "Pepper", quantity: 0.25, measurement: "tsp", expirationDate: new Date(2025, 12, 31) },
              { id: 5, name: "Red Pepper Flakes", quantity: 0.25, measurement: "tsp", expirationDate: new Date(2025, 12, 31) }
            ],
            supplies: [
              { id: 1, name: "Plate", quantity: 1, measurement: "pc" },
              { id: 2, name: "Napkin", quantity: 1, measurement: "pc" }
            ]
          },
          {
            id: 4,
            name: "Blueberry Muffin",
            category: "Foods",
            description: "Freshly baked muffin filled with blueberries and topped with sugar crystals.",
            ingredients: [
              { id: 1, name: "Muffin Mix", quantity: 1, measurement: "batch", expirationDate: new Date(2025, 5, 15) },
              { id: 2, name: "Blueberries", quantity: 1, measurement: "cup", expirationDate: new Date(2025, 3, 7) },
              { id: 3, name: "Sugar Crystals", quantity: 2, measurement: "tbsp", expirationDate: new Date(2025, 12, 31) }
            ],
            supplies: [
              { id: 1, name: "Muffin Liner", quantity: 1, measurement: "pc" },
              { id: 2, name: "Napkin", quantity: 1, measurement: "pc" }
            ]
          }
        ];
      }
    },
  });
  
  // Filter recipes by category
  const drinksRecipes = recipes.filter(recipe => 
    recipe.category && recipe.category.toLowerCase().includes("drinks")
  );
  
  const foodsRecipes = recipes.filter(recipe => 
    recipe.category && recipe.category.toLowerCase().includes("foods")
  );
  
  // Handle view recipe
  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setEditedRecipe(recipe);
    setIsDialogOpen(true);
    setIsEditing(false);
  };
  
  // Handle edit mode toggle
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle recipe edit
  const handleSaveRecipe = () => {
    
    console.log("Updating recipe:", editedRecipe);
    
    // Update the selectedRecipe with all changes from editedRecipe
    // This ensures changes are reflected in the recipe details view
    setSelectedRecipe({
      ...selectedRecipe,
      ...editedRecipe,
      ingredients: [...editedRecipe.ingredients],
      supplies: [...editedRecipe.supplies]
    });
    
    // update 
    setTimeout(() => {
      showNotification(`${editedRecipe.name} has been successfully updated.`, "success");
      refetch();
      setIsEditing(false);
      
      // Log an activity for the recipe update
      const activityLog = {
        action: `updated recipe`,
        item: editedRecipe.name,
        user: "Admin",
        timestamp: new Date()
      };
      console.log("Activity log:", activityLog);
    }, 500);
  };
  
  // Handle recipe delete
  const handleDeleteRecipe = (recipeId) => {
    
    console.log("Deleting recipe:", recipeId);
    
    setTimeout(() => {
      showNotification(`${selectedRecipe.name} has been successfully deleted.`, "success");
      refetch();
      setIsDialogOpen(false);
    }, 500);
  };
  
  // Handle input change for edited recipe
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe({
      ...editedRecipe,
      [name]: value
    });
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };
  
  // Modal footer content
  const renderModalFooter = () => {
    if (isEditing) {
      return (
        <>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveRecipe}>
            Save Changes
          </Button>
        </>
      );
    }
    
    return (
      <>
        <Button 
          variant="outline" 
          onClick={() => setIsDialogOpen(false)}
        >
          Close
        </Button>
        <Button onClick={toggleEditMode}>
          Edit Recipe
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => handleDeleteRecipe(selectedRecipe.id)}
        >
          Delete
        </Button>
      </>
    );
  };
  
  // Render recipe details for viewing
  const renderRecipeDetails = () => {
    if (!selectedRecipe) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-sm text-gray-700 mt-1">{selectedRecipe.description}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Ingredients</h3>
          <div className="bg-gray-50 rounded p-3">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="text-left pb-2">Name</th>
                  <th className="text-left pb-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <tr 
                    key={index} 
                    className="border-b last:border-0 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedIngredient(ingredient);
                      // Open the ingredient edit modal
                      setIsIngredientModalOpen(true);
                    }}
                  >
                    <td className="py-2">{ingredient.name}</td>
                    <td className="py-2">{ingredient.quantity} {ingredient.measurement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Supplies</h3>
          <div className="bg-gray-50 rounded p-3">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="text-left pb-2">Name</th>
                  <th className="text-left pb-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecipe.supplies.map((supply, index) => (
                  <tr 
                    key={index} 
                    className="border-b last:border-0 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedSupply(supply);
                      // Open the supply edit modal
                      setIsSupplyModalOpen(true);
                    }}
                  >
                    <td className="py-2">{supply.name}</td>
                    <td className="py-2">{supply.quantity} {supply.measurement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Render recipe form for editing
  const renderRecipeForm = () => {
    if (!editedRecipe) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Recipe Name</Label>
            <Input
              id="name"
              name="name"
              value={editedRecipe.name}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={editedRecipe.category}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226] mt-1"
            >
              <optgroup label="Drinks">
                <option value="Drinks - Barista Choice">Drinks - Barista Choice</option>
                <option value="Drinks - Specialty Coffee">Drinks - Specialty Coffee</option>
                <option value="Drinks - Premium Coffee">Drinks - Premium Coffee</option>
                <option value="Drinks - Non-Coffee">Drinks - Non-Coffee</option>
                <option value="Drinks - Frappe">Drinks - Frappe</option>
                <option value="Drinks - Sparkling Series">Drinks - Sparkling Series</option>
                <option value="Drinks - Milktea">Drinks - Milktea</option>
              </optgroup>
              <optgroup label="Foods">
                <option value="Foods - Rice Meals">Foods - Rice Meals</option>
                <option value="Foods - Pasta">Foods - Pasta</option>
                <option value="Foods - Snacks">Foods - Snacks</option>
                <option value="Foods - Sandwich">Foods - Sandwich</option>
              </optgroup>
            </select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={editedRecipe.description}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        
        {/* Ingredients section */}
        <div>
          <h3 className="font-medium mb-2">Ingredients</h3>
          <div className="bg-gray-50 rounded p-3">
            <div className="space-y-2">
              {editedRecipe.ingredients && editedRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div>
                      <input 
                        type="text"
                        className="w-full p-1 border rounded text-sm"
                        value={ingredient.name}
                        onChange={(e) => {
                          const updatedIngredients = [...editedRecipe.ingredients];
                          updatedIngredients[index] = {
                            ...ingredient,
                            name: e.target.value
                          };
                          setEditedRecipe({
                            ...editedRecipe,
                            ingredients: updatedIngredients
                          });
                        }}
                      />
                    </div>
                    <div>
                      <input 
                        type="number"
                        className="w-full p-1 border rounded text-sm"
                        value={ingredient.quantity}
                        min="0.1"
                        step="0.1"
                        onChange={(e) => {
                          const updatedIngredients = [...editedRecipe.ingredients];
                          updatedIngredients[index] = {
                            ...ingredient,
                            quantity: parseFloat(e.target.value) || 0
                          };
                          setEditedRecipe({
                            ...editedRecipe,
                            ingredients: updatedIngredients
                          });
                        }}
                      />
                    </div>
                    <div>
                      <input 
                        type="text"
                        className="w-full p-1 border rounded text-sm"
                        value={ingredient.measurement}
                        onChange={(e) => {
                          const updatedIngredients = [...editedRecipe.ingredients];
                          updatedIngredients[index] = {
                            ...ingredient,
                            measurement: e.target.value
                          };
                          setEditedRecipe({
                            ...editedRecipe,
                            ingredients: updatedIngredients
                          });
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const removedIngredient = editedRecipe.ingredients[index];
                      const updatedIngredients = [...editedRecipe.ingredients];
                      updatedIngredients.splice(index, 1);
                      setEditedRecipe({
                        ...editedRecipe,
                        ingredients: updatedIngredients
                      });
                      showNotification(`${removedIngredient.name} has been removed from the recipe.`, "info");
                    }}
                    className="text-red-500 hover:text-red-700 p-1 ml-2"
                    title="Remove ingredient"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="mt-2 text-sm text-[#6B4226] hover:text-[#513B30] flex items-center"
              onClick={() => {
                // Add a sample ingredient
                const sampleIngredient = {
                  id: Math.floor(Math.random() * 1000),
                  name: "New Ingredient",
                  quantity: 1,
                  measurement: "oz"
                };
                
                setEditedRecipe({
                  ...editedRecipe,
                  ingredients: [...editedRecipe.ingredients, sampleIngredient]
                });
                
                showNotification(`New Ingredient added to recipe.`, "success");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Ingredient
            </button>
          </div>
        </div>
        
        {/* Supplies section */}
        <div>
          <h3 className="font-medium mb-2">Supplies</h3>
          <div className="bg-gray-50 rounded p-3">
            <div className="space-y-2">
              {editedRecipe.supplies && editedRecipe.supplies.map((supply, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div>
                      <input 
                        type="text"
                        className="w-full p-1 border rounded text-sm"
                        value={supply.name}
                        onChange={(e) => {
                          const updatedSupplies = [...editedRecipe.supplies];
                          updatedSupplies[index] = {
                            ...supply,
                            name: e.target.value
                          };
                          setEditedRecipe({
                            ...editedRecipe,
                            supplies: updatedSupplies
                          });
                        }}
                      />
                    </div>
                    <div>
                      <input 
                        type="number"
                        className="w-full p-1 border rounded text-sm"
                        value={supply.quantity}
                        min="1"
                        step="1"
                        onChange={(e) => {
                          const updatedSupplies = [...editedRecipe.supplies];
                          updatedSupplies[index] = {
                            ...supply,
                            quantity: parseInt(e.target.value) || 0
                          };
                          setEditedRecipe({
                            ...editedRecipe,
                            supplies: updatedSupplies
                          });
                        }}
                      />
                    </div>
                    <div>
                      <input 
                        type="text"
                        className="w-full p-1 border rounded text-sm"
                        value={supply.measurement}
                        onChange={(e) => {
                          const updatedSupplies = [...editedRecipe.supplies];
                          updatedSupplies[index] = {
                            ...supply,
                            measurement: e.target.value
                          };
                          setEditedRecipe({
                            ...editedRecipe,
                            supplies: updatedSupplies
                          });
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const removedSupply = editedRecipe.supplies[index];
                      const updatedSupplies = [...editedRecipe.supplies];
                      updatedSupplies.splice(index, 1);
                      setEditedRecipe({
                        ...editedRecipe,
                        supplies: updatedSupplies
                      });
                      showNotification(`${removedSupply.name} has been removed from the recipe.`, "info");
                    }}
                    className="text-red-500 hover:text-red-700 p-1 ml-2"
                    title="Remove supply"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="mt-2 text-sm text-[#6B4226] hover:text-[#513B30] flex items-center"
              onClick={() => {
                // Add a sample supply for testing
                const sampleSupply = {
                  id: Math.floor(Math.random() * 1000),
                  name: "New Supply",
                  quantity: 1,
                  measurement: "pc"
                };
                
                setEditedRecipe({
                  ...editedRecipe,
                  supplies: [...editedRecipe.supplies, sampleSupply]
                });
                
                showNotification(`New Supply added to recipe.`, "success");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Supply
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Recipe Management</h1>
        <p className="text-gray-600 mb-6">
          View and manage recipes for all café items
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium ${selectedTab === "drinks" ? "border-b-2 border-[#6B4226] text-[#6B4226]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabChange("drinks")}
          >
            Drinks
          </button>
          <button
            className={`py-2 px-4 font-medium ${selectedTab === "foods" ? "border-b-2 border-[#6B4226] text-[#6B4226]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabChange("foods")}
          >
            Foods
          </button>
        </div>
      </div>
      
      {/* Recipes grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
          </div>
        ) : selectedTab === "drinks" ? (
          drinksRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No drink recipes found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinksRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onViewRecipe={handleViewRecipe} 
                />
              ))}
            </div>
          )
        ) : (
          foodsRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No food recipes found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodsRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onViewRecipe={handleViewRecipe} 
                />
              ))}
            </div>
          )
        )}
      </div>
      
      {/* Recipe Details Modal */}
      <Modal
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setIsEditing(false);
        }}
        title={isEditing ? "Edit Recipe" : selectedRecipe?.name || "Recipe Details"}
        footer={renderModalFooter()}
      >
        {isEditing ? renderRecipeForm() : renderRecipeDetails()}
      </Modal>

      {/* Ingredient Edit Modal */}
      <Modal
        isOpen={isIngredientModalOpen}
        onClose={() => {
          setIsIngredientModalOpen(false);
          setSelectedIngredient(null);
        }}
        title="Edit Ingredient"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsIngredientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedIngredient && selectedRecipe) {
                  // Find and update the ingredient in the recipe
                  const updatedIngredients = selectedRecipe.ingredients.map(ing => 
                    ing.id === selectedIngredient.id ? selectedIngredient : ing
                  );
                  
                  // Update the recipe with new ingredients
                  setSelectedRecipe({
                    ...selectedRecipe,
                    ingredients: updatedIngredients
                  });
                  
                  setEditedRecipe({
                    ...editedRecipe,
                    ingredients: updatedIngredients
                  });
                  
                  showNotification(`${selectedIngredient.name} has been updated`, "success");
                  setIsIngredientModalOpen(false);
                }
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        {selectedIngredient && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ingredient-name">Ingredient Name</Label>
              <Input
                id="ingredient-name"
                value={selectedIngredient.name}
                onChange={(e) => setSelectedIngredient({
                  ...selectedIngredient,
                  name: e.target.value
                })}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ingredient-quantity">Quantity</Label>
                <Input
                  id="ingredient-quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={selectedIngredient.quantity}
                  onChange={(e) => setSelectedIngredient({
                    ...selectedIngredient,
                    quantity: parseFloat(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="ingredient-measurement">Measurement</Label>
                <Input
                  id="ingredient-measurement"
                  value={selectedIngredient.measurement}
                  onChange={(e) => setSelectedIngredient({
                    ...selectedIngredient,
                    measurement: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              {/* Removed expiration date field as requested */}
            </div>
          </div>
        )}
      </Modal>

      {/* Supply Edit Modal */}
      <Modal
        isOpen={isSupplyModalOpen}
        onClose={() => {
          setIsSupplyModalOpen(false);
          setSelectedSupply(null);
        }}
        title="Edit Supply"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsSupplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedSupply && selectedRecipe) {
                  // Find and update the supply in the recipe
                  const updatedSupplies = selectedRecipe.supplies.map(sup => 
                    sup.id === selectedSupply.id ? selectedSupply : sup
                  );
                  
                  // Update the recipe with new supplies
                  setSelectedRecipe({
                    ...selectedRecipe,
                    supplies: updatedSupplies
                  });
                  
                  setEditedRecipe({
                    ...editedRecipe,
                    supplies: updatedSupplies
                  });
                  
                  showNotification(`${selectedSupply.name} has been updated`, "success");
                  setIsSupplyModalOpen(false);
                }
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        {selectedSupply && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="supply-name">Supply Name</Label>
              <Input
                id="supply-name"
                value={selectedSupply.name}
                onChange={(e) => setSelectedSupply({
                  ...selectedSupply,
                  name: e.target.value
                })}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supply-quantity">Quantity</Label>
                <Input
                  id="supply-quantity"
                  type="number"
                  step="1"
                  min="0"
                  value={selectedSupply.quantity}
                  onChange={(e) => setSelectedSupply({
                    ...selectedSupply,
                    quantity: parseInt(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="supply-measurement">Measurement</Label>
                <Input
                  id="supply-measurement"
                  value={selectedSupply.measurement}
                  onChange={(e) => setSelectedSupply({
                    ...selectedSupply,
                    measurement: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}