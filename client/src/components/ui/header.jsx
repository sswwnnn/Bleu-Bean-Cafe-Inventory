import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Header = ({ toggleSidebar }) => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      title: "Low Stock Alert",
      message: "Coffee Beans (Arabica) - 250g left",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "danger",
      title: "Expiring Soon",
      message: "Fresh Milk - Expires in 2 days",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "warning",
      title: "Low Stock Alert",
      message: "Brown Sugar - 500g left",
      time: "Yesterday",
    },
  ]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="container-fluid px-4 py-2">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-[#6B4226]"
          >
            <i className="bi bi-list text-xl"></i>
          </Button>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <i className="bi bi-bell text-xl text-[#6B4226]"></i>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="bg-gray-100 py-2">
                  Notifications
                </DropdownMenuLabel>

                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="cursor-pointer p-3">
                    <div className="flex">
                      <div className="mr-3">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center p-2 rounded-full",
                            notification.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          )}
                        >
                          <i
                            className={cn(
                              "text-white",
                              notification.type === "warning"
                                ? "bi-exclamation-triangle"
                                : "bi-clock-history"
                            )}
                          ></i>
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-600">{notification.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                  View All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0E0E0] flex items-center justify-center text-[#6B4226]">
                    <i className="bi bi-person"></i>
                  </div>
                  <span className="hidden md:inline text-[#6B4226] font-medium">
                    {user?.fullName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-semibold">
                  {user && user.role
                    ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Role`
                    : "Role"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <i className="bi bi-person me-2"></i> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <i className="bi bi-gear me-2"></i> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500"
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

