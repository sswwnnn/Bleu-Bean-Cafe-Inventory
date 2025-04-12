import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import RecipeEditModal from "./recipe-edit-modal"

const RecipeViewModal = ({ recipeId, isOpen, onClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { data: recipeDetails, isLoading } = useQuery({
    queryKey: ["/api/recipes", recipeId],
    enabled: isOpen && recipeId !== null
  })

  const { data: allIngredients } = useQuery({
    queryKey: ["/api/ingredients"],
    enabled: isOpen && recipeId !== null
  })

  const { data: allSupplies } = useQuery({
    queryKey: ["/api/supplies"],
    enabled: isOpen && recipeId !== null
  })

  const getIngredientName = id => {
    const ingredient = allIngredients?.find(i => i.id === id)
    return ingredient?.name || "Unknown Ingredient"
  }

  const getSupplyName = id => {
    const supply = allSupplies?.find(s => s.id === id)
    return supply?.name || "Unknown Supply"
  }

  if (!isOpen) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#6B4226]">
              <i className="bi bi-journal-text me-2"></i> Recipe Details
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="text-center py-8">Loading recipe details...</div>
          ) : recipeDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[#6B4226] text-lg font-medium">
                  {recipeDetails.product.name}
                </h4>
                <Badge className="mb-3 bg-gray-200 text-gray-800">
                  {recipeDetails.product.category}
                </Badge>

                <h5 className="mt-4 mb-3 font-semibold">Ingredients</h5>
                <ul className="space-y-2">
                  {recipeDetails.ingredients.map(ingredient => (
                    <li
                      key={ingredient.id}
                      className="flex justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{getIngredientName(ingredient.ingredientId)}</span>
                      <Badge variant="outline" className="ml-2">
                        {ingredient.quantity} {ingredient.measurement}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="mb-3 font-semibold">Supplies Needed</h5>
                <ul className="space-y-2">
                  {recipeDetails.supplies.map(supply => (
                    <li
                      key={supply.id}
                      className="flex justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{getSupplyName(supply.supplyId)}</span>
                      <Badge variant="outline" className="ml-2">
                        {supply.quantity} {supply.measurement}
                      </Badge>
                    </li>
                  ))}
                </ul>

                <h5 className="mt-4 mb-3 font-semibold">
                  Expiration Information
                </h5>
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded border border-yellow-200">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {recipeDetails.recipe.bestBefore || "Best served when fresh"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">Recipe not found</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)}>
              <i className="bi bi-pencil me-1"></i> Edit Recipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {recipeDetails && (
        <RecipeEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          recipeDetails={recipeDetails}
          allIngredients={allIngredients || []}
          allSupplies={allSupplies || []}
        />
      )}
    </>
  )
}

export default RecipeViewModal

