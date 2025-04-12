import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// Common UI Components
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

function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B4226] focus:border-transparent ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226] ${className}`}
      {...props}
    />
  );
}

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

function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-xl focus:outline-none"
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

// Status badge component
function StatusBadge({ status }) {
  const statusClasses = {
    "In Stock": "bg-green-100 text-green-800",
    "Low Stock": "bg-yellow-100 text-yellow-800",
    "Out of Stock": "bg-red-100 text-red-800",
    "Expiring Soon": "bg-orange-100 text-orange-800",
    "Expired": "bg-gray-100 text-gray-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

export default function IngredientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Status options
  const statusOptions = ["In Stock", "Low Stock", "Out of Stock", "Expiring Soon", "Expired"];
  
  // Fetch ingredients
  const { data: ingredients = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/ingredients"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch ingredients:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        return [];
      }
    },
  });
  
  // Filter ingredients based on search term and status
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = searchTerm === "" || 
      (ingredient.name && ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === "" || 
      ingredient.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle create/edit ingredient
  const handleOpenModal = (ingredient = null) => {
    if (ingredient) {
      setCurrentIngredient({ 
        ...ingredient,
        bestBefore: ingredient.bestBefore ? new Date(ingredient.bestBefore) : new Date(),
        expiration: ingredient.expiration ? new Date(ingredient.expiration) : new Date()
      });
      setIsCreating(false);
    } else {
      setCurrentIngredient({
        name: "",
        quantity: 0,
        measurement: "",
        bestBefore: new Date(),
        expiration: new Date(),
        status: "In Stock"
      });
      setIsCreating(true);
    }
    setIsModalOpen(true);
  };
  
  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setCurrentIngredient(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setCurrentIngredient(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (name, dateString) => {
    setCurrentIngredient(prev => ({
      ...prev,
      [name]: new Date(dateString)
    }));
  };
  
  // Handle save ingredient
  const handleSaveIngredient = async () => {
    try {
      const url = isCreating ? "/api/ingredients" : `/api/ingredients/${currentIngredient.id}`;
      const method = isCreating ? "POST" : "PUT";
      
      // Format dates for API
      const ingredientData = {
        ...currentIngredient,
        bestBefore: currentIngredient.bestBefore ? currentIngredient.bestBefore.toISOString() : null,
        expiration: currentIngredient.expiration ? currentIngredient.expiration.toISOString() : null
      };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ingredientData)
      });
      
      if (!res.ok) throw new Error("Failed to save ingredient");
      
      await refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving ingredient:", error);
      // Error handling would go here
    }
  };
  
  // Handle delete ingredient
  const handleDeleteIngredient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    
    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (!res.ok) throw new Error("Failed to delete ingredient");
      
      await refetch();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      // Error handling would go here
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Ingredients</h1>
        <p className="text-gray-600 mb-6">
          Manage all cafe ingredients and their inventory status
        </p>
      </div>
      
      {/* Search and filter section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="mb-1 block">Search</Label>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredients..."
            />
          </div>
          
          <div className="w-full md:w-60">
            <Label htmlFor="status" className="mb-1 block">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          
          <div className="self-end">
            <Button onClick={() => handleOpenModal()}>
              Add Ingredient
            </Button>
          </div>
        </div>
      </div>
      
      {/* Ingredients table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            No ingredients found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">No.</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Measurement</th>
                  <th className="px-4 py-3 text-left">Best Before</th>
                  <th className="px-4 py-3 text-left">Expiration</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIngredients.map((ingredient, index) => (
                  <tr key={ingredient.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {ingredient.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {ingredient.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {ingredient.measurement}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(ingredient.bestBefore)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(ingredient.expiration)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={ingredient.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(ingredient)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Ingredient Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreating ? "Add New Ingredient" : "Edit Ingredient"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIngredient}>
              Save
            </Button>
          </>
        }
      >
        {currentIngredient && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ingredient Name</Label>
              <Input
                id="name"
                name="name"
                value={currentIngredient.name || ""}
                onChange={handleInputChange}
                placeholder="Enter ingredient name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentIngredient.quantity || 0}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="measurement">Measurement</Label>
                <Input
                  id="measurement"
                  name="measurement"
                  value={currentIngredient.measurement || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., kg, g, lb, oz, ml, l"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bestBefore">Best Before</Label>
                <Input
                  id="bestBefore"
                  name="bestBefore"
                  type="date"
                  value={currentIngredient.bestBefore 
                    ? format(new Date(currentIngredient.bestBefore), "yyyy-MM-dd") 
                    : format(new Date(), "yyyy-MM-dd")
                  }
                  onChange={(e) => handleDateChange("bestBefore", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration Date</Label>
                <Input
                  id="expiration"
                  name="expiration"
                  type="date"
                  value={currentIngredient.expiration 
                    ? format(new Date(currentIngredient.expiration), "yyyy-MM-dd") 
                    : format(new Date(), "yyyy-MM-dd")
                  }
                  onChange={(e) => handleDateChange("expiration", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={currentIngredient.status || "In Stock"}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}