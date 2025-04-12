import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth.jsx";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

function Sidebar({ isOpen, onClose }) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Define navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Products", path: "/products", icon: "☕" },
    { name: "Recipes", path: "/recipes", icon: "📝" },
    { name: "Ingredients", path: "/ingredients", icon: "🌿" },
    { name: "Supplies", path: "/supplies", icon: "📦" },
    { name: "Merchandise", path: "/merchandise", icon: "👕" },
    { name: "Staff", path: "/staff", icon: "👥" },
  ];

  // Dynamic class for sidebar
  const sidebarClass = `fixed md:static bg-[#3C2A21] text-white w-64 min-h-screen p-4 z-30 transition-all duration-300 ${
    isOpen ? "left-0" : "-left-64 md:left-0"
  }`;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={onClose}
        ></div>
      )}
      
      <aside className={sidebarClass}>
        <div className="flex justify-between items-center mb-8 pt-4">
          <h1 className="text-2xl font-bold text-white">Bleu Bean Cafe</h1>
          <button 
            className="text-white md:hidden"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <div className={`flex items-center p-3 rounded transition-colors ${
                    location === item.path ? 'bg-[#513B30] text-white' : 'text-gray-300 hover:bg-[#513B30] hover:text-white'
                  }`}>
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-sm text-gray-400 mb-2">
            Café Inventory System
          </div>
          <div className="text-xs text-gray-500">
            © 2025 Bleu Bean Cafe
          </div>
        </div>
      </aside>
    </>
  );
}

function NotificationDropdown({ isOpen, onClose }) {
  const { data: lowStockItems = [] } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
    enabled: isOpen,
  });

  //Get items based on their status

  const expiringItems = lowStockItems.filter(item => item.status === "Expiring Soon" || item.daysRemaining < 7);
  const expiredItems = lowStockItems.filter(item => item.status === "Expired");
  const outOfStockItems = lowStockItems.filter(item => item.status === "Out of Stock" || item.quantity === 0);
  const lowStockOnlyItems = lowStockItems.filter(item => item.status === "Low Stock" && item.quantity > 0);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-40" onClick={e => e.stopPropagation()}>
      <div className="py-2">
        <div className="px-4 py-2 font-semibold text-gray-800 border-b">
          Inventory Alerts
        </div>
        <div className="max-h-64 overflow-y-auto">
          {outOfStockItems.length > 0 && (
            <div className="px-4 py-3 border-b">
              <div className="font-medium text-red-600">
                Out of Stock
              </div>
              <div className="text-sm text-gray-600">
                {outOfStockItems.map(item => item.name).join(", ")}
              </div>
            </div>
          )}
          
          {lowStockOnlyItems.length > 0 && (
            <div className="px-4 py-3 border-b">
              <div className="font-medium text-yellow-600">
                Low Stock
              </div>
              <div className="text-sm text-gray-600">
                {lowStockOnlyItems.map(item => item.name).join(", ")}
              </div>
            </div>
          )}
          
          {expiringItems.length > 0 && (
            <div className="px-4 py-3 border-b">
              <div className="font-medium text-orange-600">
                Expiring Soon
              </div>
              <div className="text-sm text-gray-600">
                {expiringItems.map(item => item.name).join(", ")}
              </div>
            </div>
          )}
          
          {expiredItems.length > 0 && (
            <div className="px-4 py-3 border-b">
              <div className="font-medium text-gray-600">
                Expired
              </div>
              <div className="text-sm text-gray-600">
                {expiredItems.map(item => item.name).join(", ")}
              </div>
            </div>
          )}
          
          {outOfStockItems.length === 0 && lowStockOnlyItems.length === 0 && 
           expiringItems.length === 0 && expiredItems.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-600">
              No alerts at this time
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ isOpen, onClose, onLogout }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-40" onClick={e => e.stopPropagation()}>
      <div className="py-2">
        <div className="px-4 py-3 border-b">
          <div className="font-medium text-gray-800">
            {user?.username || 'User'}
          </div>
        </div>
        <button 
          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          onClick={() => {}}
        >
          Account Settings
        </button>
        <button
          onClick={onLogout}
          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function Header({ onSidebarToggle }) {
  const { user, logoutMutation } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsNotificationOpen(false);
      setIsProfileOpen(false);
    };
    
    if (isNotificationOpen || isProfileOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isNotificationOpen, isProfileOpen]);

  return (
    <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onSidebarToggle}
          className="mr-3 text-2xl text-gray-700 hover:text-[#6B4226] transition-colors"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Welcome, {user?.username || 'User'}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className="p-1 text-gray-600 hover:text-[#6B4226] focus:outline-none text-xl"
          >
            🔔
          </button>
          
          <NotificationDropdown 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
          />
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center p-1 focus:outline-none"
          >
            <div className="bg-[#6B4226] w-8 h-8 rounded-full flex items-center justify-center text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </button>
          
          <ProfileDropdown 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }) {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar when location changes (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);
  
  // Redirect to dashboard if the user is at root
  if (location === '/') {
    navigate('/dashboard');
    return null;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 md:p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}