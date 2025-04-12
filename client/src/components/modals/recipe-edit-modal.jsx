import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"

const RecipeEditModal = ({
  isOpen,
  onClose,
  recipeDetails,
  allIngredients,
  allSupplies
}) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    productName: recipeDetails.product.name,
    category: recipeDetails.product.category,
    description: recipeDetails.product.description || "",
    bestBefore: recipeDetails.recipe.bestBefore || "",
    expiryDate: recipeDetails.recipe.expiryDate
      ? new Date(recipeDetails.recipe.expiryDate).toISOString().split("T")[0]
      : ""
  })

  const [ingredients, setIngredients] = useState(
    recipeDetails.ingredients.map(i => ({
      id: i.id,
      ingredientId: i.ingredientId,
      quantity: i.quantity,
      measurement: i.measurement,
      recipeId: i.recipeId
    }))
  )

  const [supplies, setSupplies] = useState(
    recipeDetails.supplies.map(s => ({
      id: s.id,
      supplyId: s.supplyId,
      quantity: s.quantity,
      measurement: s.measurement,
      recipeId: s.recipeId
    }))
  )

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addIngredient = () => {
    if (allIngredients.length === 0) return
    setIngredients([
      ...ingredients,
      {
        ingredientId: allIngredients[0].id,
        quantity: 1,
        measurement: "units",
        recipeId: recipeDetails.recipe.id
      }
    ])
  }

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const removeIngredient = index => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addSupply = () => {
    if (allSupplies.length === 0) return
    setSupplies([
      ...supplies,
      {
        supplyId: allSupplies[0].id,
        quantity: 1,
        measurement: "units",
        recipeId: recipeDetails.recipe.id
      }
    ])
  }

  const updateSupply = (index, field, value) => {
    const newSupplies = [...supplies]
    newSupplies[index] = { ...newSupplies[index], [field]: value }
    setSupplies(newSupplies)
  }

  const removeSupply = index => {
    setSupplies(supplies.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    try {
      // Update product
      await apiRequest("PUT", `/api/products/${recipeDetails.product.id}`, {
        name: formData.productName,
        category: formData.category,
        description: formData.description
      })

      // Update recipe
      await apiRequest("PUT", `/api/recipes/${recipeDetails.recipe.id}`, {
        bestBefore: formData.bestBefore,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null
      })

      // Handle ingredients
      for (const ingredient of ingredients) {
        if (ingredient.id) {
          // Update existing ingredient
          await apiRequest("PUT", `/api/recipe-ingredients/${ingredient.id}`, {
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            measurement: ingredient.measurement
          })
        } else {
          // Add new ingredient
          await apiRequest("POST", "/api/recipe-ingredients", ingredient)
        }
      }

      // Remove deleted ingredients
      for (const originalIngredient of recipeDetails.ingredients) {
        if (!ingredients.some(i => i.id === originalIngredient.id)) {
          await apiRequest(
            "DELETE",
            `/api/recipe-ingredients/${originalIngredient.id}`
          )
        }
      }

      // Handle supplies
      for (const supply of supplies) {
        if (supply.id) {
          // Update existing supply
          await apiRequest("PUT", `/api/recipe-supplies/${supply.id}`, {
            supplyId: supply.supplyId,
            quantity: supply.quantity,
            measurement: supply.measurement
          })
        } else {
          // Add new supply
          await apiRequest("POST", "/api/recipe-supplies", supply)
        }
      }

      // Remove deleted supplies
      for (const originalSupply of recipeDetails.supplies) {
        if (!supplies.some(s => s.id === originalSupply.id)) {
          await apiRequest(
            "DELETE",
            `/api/recipe-supplies/${originalSupply.id}`
          )
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] })
      queryClient.invalidateQueries({
        queryKey: ["/api/recipes", recipeDetails.recipe.id]
      })
      queryClient.invalidateQueries({ queryKey: ["/api/products"] })

      toast({
        title: "Recipe updated",
        description: "The recipe has been successfully updated."
      })

      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the recipe."
      })
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-[#6B4226]">
            <i className="bi bi-pencil-square me-2"></i> Edit Recipe
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={value =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot Beverages">Hot Beverages</SelectItem>
                  <SelectItem value="Cold Beverages">Cold Beverages</SelectItem>
                  <SelectItem value="Bakery Items">Bakery Items</SelectItem>
                  <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <h6 className="font-semibold mb-3">Ingredients</h6>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <Select
                      value={ingredient.ingredientId.toString()}
                      onValueChange={value =>
                        updateIngredient(index, "ingredientId", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {allIngredients.map(ing => (
                          <SelectItem key={ing.id} value={ing.id.toString()}>
                            {ing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={ingredient.quantity}
                      onChange={e =>
                        updateIngredient(
                          index,
                          "quantity",
                          parseFloat(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={ingredient.measurement}
                      onValueChange={value =>
                        updateIngredient(index, "measurement", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">grams</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="units">units</SelectItem>
                        <SelectItem value="oz">oz</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="liters">liters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Ingredient
            </Button>
          </div>

          <div className="border-t pt-4 mt-2">
            <h6 className="font-semibold mb-3">Supplies</h6>
            <div className="space-y-3">
              {supplies.map((supply, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <Select
                      value={supply.supplyId.toString()}
                      onValueChange={value =>
                        updateSupply(index, "supplyId", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supply" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSupplies.map(sup => (
                          <SelectItem key={sup.id} value={sup.id.toString()}>
                            {sup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={supply.quantity}
                      onChange={e =>
                        updateSupply(
                          index,
                          "quantity",
                          parseFloat(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={supply.measurement}
                      onValueChange={value =>
                        updateSupply(index, "measurement", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">grams</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="units">units</SelectItem>
                        <SelectItem value="oz">oz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeSupply(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addSupply}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Supply
            </Button>
          </div>

          <div className="border-t pt-4 mt-2">
            <h6 className="font-semibold mb-3">Expiration Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bestBefore">Best Before</Label>
                <Input
                  id="bestBefore"
                  name="bestBefore"
                  placeholder="e.g. 15 minutes after preparation"
                  value={formData.bestBefore || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <i className="bi bi-save me-1"></i> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RecipeEditModal
