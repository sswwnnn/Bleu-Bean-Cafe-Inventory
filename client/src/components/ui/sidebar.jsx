import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const Sidebar = ({ isOpen, isMobile }) => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [activeLink, setActiveLink] = useState(location);

  useEffect(() => {
    setActiveLink(location);
  }, [location]);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/recipes", label: "Recipe Management", icon: "bi-journal-text" },
    { path: "/products", label: "Products", icon: "bi-basket" },
    { path: "/ingredients", label: "Ingredients", icon: "bi-egg" },
    { path: "/supplies", label: "Supplies & Materials", icon: "bi-box" },
    { path: "/merchandise", label: "Merchandise", icon: "bi-shop" },
    { path: "/staff", label: "Staff", icon: "bi-people" },
  ];

  const sidebarClasses = cn(
    "bg-[#6B4226] text-white h-screen fixed z-50 transition-all duration-300 w-64",
    isOpen ? "" : "-translate-x-full",
    isMobile ? "shadow-lg" : ""
  );

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        <div className="p-3 bg-[#5A371F] text-white flex items-center">
          <i className="bi bi-cup-hot-fill me-2 text-xl"></i>
          <h5 className="m-0 font-poppins">Cafe Inventory</h5>
        </div>

        <div className="p-3">
          <div className="text-gray-400 text-sm mb-2">MAIN NAVIGATION</div>
          <ul className="nav flex-column">
            {navItems.map((item) => {
              // Check if user has access to this item
              let hasAccess = true;
              if (item.path === "/staff" && user?.role !== "admin") {
                hasAccess = false;
              }

              if (!hasAccess) return null;

              return (
                <li key={item.path} className="nav-item">
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-white/80 hover:bg-white/10 rounded-sm",
                      activeLink === item.path && "bg-white/20 font-semibold text-white"
                    )}
                    aria-label={item.label} // Added accessibility support
                  >
                    <i className={`${item.icon} me-2`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto p-3 bg-[#5A371F] text-gray-400">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-[#4CAF50] rounded-full mr-2"></span>
            <small>v1.0.0</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

