import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNotification } from "../context/notification-context";

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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showNotification } = useNotification();
  
  // Fetch products
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch products:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });
  
  // Define cafe product categories
  const drinkCategories = [
    "Barista Choice", 
    "Specialty Coffee",
    "Premium Coffee",
    "Non-Coffee",
    "Frappe",
    "Sparkling Series",
    "Milktea"
  ];
  
  const foodCategories = [
    "Rice Meals",
    "Pasta",
    "Snacks",
    "Sandwich"
  ];
  
  // Fetch categories for filter but override with our defined categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      try {
        // Combine drink and food categories
        const allCategories = [
          ...drinkCategories.map(cat => `Drinks - ${cat}`),
          ...foodCategories.map(cat => `Foods - ${cat}`)
        ];
        return allCategories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
  });
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || 
      (product.category && product.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle create/edit product
  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct({ ...product });
      setIsCreating(false);
    } else {
      setCurrentProduct({
        name: "",
        description: "",
        category: categories.length > 0 ? categories[0] : "",
        size: ""
      });
      setIsCreating(true);
    }
    setIsModalOpen(true);
  };
  
  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save product
  const handleSaveProduct = async () => {
    try {
      const url = isCreating ? "/api/products" : `/api/products/${currentProduct.id}`;
      const method = isCreating ? "POST" : "PUT";
      const actionText = isCreating ? "created" : "updated";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentProduct)
      });
      
      if (!res.ok) throw new Error(`Failed to ${isCreating ? 'create' : 'update'} product`);
      
      await refetch();
      setIsModalOpen(false);
      
      // Show success notification
      showNotification(`Product successfully ${actionText}!`, "success");
    } catch (error) {
      console.error("Error saving product:", error);
      // Show error notification
      showNotification(error.message || "Error saving product", "error");
    }
  };
  
  // Handle delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (!res.ok) throw new Error("Failed to delete product");
      
      await refetch();
      
      // Show success notification
      showNotification("Product successfully deleted!", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      // Show error notification
      showNotification(error.message || "Error deleting product", "error");
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Products</h1>
        <p className="text-gray-600 mb-6">
          Manage all cafe products
        </p>
      </div>
      
      {/* Search and filter section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="mb-1 block">Search</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <Input
                id="search"
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-60">
            <Label htmlFor="category" className="mb-1 block">Category</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="self-end">
            <Button onClick={() => handleOpenModal()}>
              Add Product
            </Button>
          </div>
        </div>
      </div>
      
      {/* Products table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">No.</th>
                  <th className="px-6 py-3 text-left">Product Name</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Size</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden overflow-ellipsis">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
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
      
      {/* Product Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreating ? "Add New Product" : "Edit Product"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              Save
            </Button>
          </>
        }
      >
        {currentProduct && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="flex min-h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  name="size"
                  value={currentProduct.size}
                  onChange={handleInputChange}
                  placeholder="e.g., Small, Medium, Large, 12oz"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}