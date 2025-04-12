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

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showNotification } = useNotification();
  
  // Cafe staff positions
  const cafePositions = [
    "Barista",
    "Waitress",
    "Manager",
    "Chef",
    "Cashier",
    "Driver",
    "Cleaner"
  ];
  
  // Fetch staff data
  const { data: staffData = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch staff data:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching staff data:", error);
        return [];
      }
    },
  });
  
  // Filter staff based on search term, position, and archived status
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = !searchTerm || 
      (staff.fullName && staff.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.position && staff.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.email && staff.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPosition = !selectedPosition || 
      (staff.position && staff.position === selectedPosition);
    
    const matchesArchiveStatus = showArchived ? true : staff.isActive !== false;
    
    return matchesSearch && matchesPosition && matchesArchiveStatus;
  });
  
  // Handle create/edit staff
  const handleOpenModal = (staff = null) => {
    if (staff) {
      setCurrentStaff({ ...staff });
      setIsCreating(false);
    } else {
      setCurrentStaff({
        fullName: "",
        email: "",
        position: cafePositions.length > 0 ? cafePositions[0] : "",
        phone: "",
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true
      });
      setIsCreating(true);
    }
    setIsModalOpen(true);
  };
  
  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentStaff(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  // Handle save staff
  const handleSaveStaff = async () => {
    try {
      const url = isCreating ? "/api/users" : `/api/users/${currentStaff.id}`;
      const method = isCreating ? "POST" : "PUT";
      const actionText = isCreating ? "created" : "updated";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentStaff)
      });
      
      if (!res.ok) throw new Error(`Failed to ${isCreating ? 'create' : 'update'} staff record`);
      
      await refetch();
      setIsModalOpen(false);
      
      // Show success notification
      showNotification(`Staff record successfully ${actionText}!`, "success");
    } catch (error) {
      console.error("Error saving staff record:", error);
      // Show error notification
      showNotification(error.message || "Error saving staff record", "error");
    }
  };
  
  // Handle archive staff
  const handleArchiveStaff = async (id) => {
    if (!window.confirm("Are you sure you want to archive this staff record?")) return;
    
    try {
      const res = await fetch(`/api/users/${id}/archive`, {
        method: "PUT",
        credentials: "include"
      });
      
      if (!res.ok) throw new Error("Failed to archive staff record");
      
      await refetch();
      
      // Show success notification
      showNotification("Staff record successfully archived!", "success");
    } catch (error) {
      console.error("Error archiving staff record:", error);
      // Show error notification
      showNotification(error.message || "Error archiving staff record", "error");
    }
  };
  
  // Handle restore staff
  const handleRestoreStaff = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}/restore`, {
        method: "PUT",
        credentials: "include"
      });
      
      if (!res.ok) throw new Error("Failed to restore staff record");
      
      await refetch();
      
      // Show success notification
      showNotification("Staff record successfully restored!", "success");
    } catch (error) {
      console.error("Error restoring staff record:", error);
      // Show error notification
      showNotification(error.message || "Error restoring staff record", "error");
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Staff Management</h1>
        <p className="text-gray-600 mb-6">
          Manage cafe staff records and roles
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
                placeholder="Search by name, position, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-60">
            <Label htmlFor="position" className="mb-1 block">Position</Label>
            <select
              id="position"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="">All Positions</option>
              {cafePositions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-60 flex items-end">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6B4226]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B4226]"></div>
              <span className="ms-3 text-sm font-medium text-gray-800">Show Archived Staff</span>
            </label>
          </div>
          
          <div className="self-end">
            <Button onClick={() => handleOpenModal()}>
              Add Staff
            </Button>
          </div>
        </div>
      </div>
      
      {/* Staff table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            No staff records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">No.</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Position</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Join Date</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((staff, index) => (
                  <tr key={staff.id} className={`hover:bg-gray-50 ${!staff.isActive ? 'bg-gray-100' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {staff.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(staff.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {staff.isActive !== false ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(staff)}
                        >
                          Edit
                        </Button>
                        {staff.isActive !== false ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleArchiveStaff(staff.id)}
                          >
                            Archive
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleRestoreStaff(staff.id)}
                          >
                            Restore
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Staff Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreating ? "Add New Staff" : "Edit Staff Record"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStaff}>
              Save
            </Button>
          </>
        }
      >
        {currentStaff && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={currentStaff.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentStaff.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={currentStaff.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  name="position"
                  value={currentStaff.position}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
                >
                  <option value="">Select Position</option>
                  {cafePositions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={currentStaff.joinDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={currentStaff.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#6B4226] bg-gray-100 border-gray-300 rounded focus:ring-[#6B4226]"
                />
                <Label htmlFor="isActive" className="ml-2">Active Status</Label>
              </div>
              <p className="text-xs text-gray-500">
                Uncheck to archive staff record
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}