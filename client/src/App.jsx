import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/use-auth.jsx";
import { ProtectedRoute } from "./lib/protected-route.jsx";
import { NotificationProvider } from "./context/notification-context.jsx";

import NotFound from "./pages/not-found.jsx";
import AuthPage from "./pages/auth-page.jsx";
import Layout from "./pages/layout.jsx";
import DashboardPage from "./pages/dashboard-page.jsx";
import RecipesPage from "./pages/recipes-page.jsx";
import ProductsPage from "./pages/products-page.jsx";
import IngredientsPage from "./pages/ingredients-page.jsx";
import SuppliesPage from "./pages/supplies-page.jsx";
import MerchandisePage from "./pages/merchandise-page.jsx";
import StaffPage from "./pages/staff-page.jsx";

// Placeholder pages for now
const PlaceholderPage = ({ title }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

// Home component that redirects to dashboard
const HomePage = () => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/dashboard");
  }, [setLocation]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin text-border">Redirecting...</div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            
            <ProtectedRoute path="/" component={HomePage} />
            
            <ProtectedRoute path="/:page*">
              <Layout>
                <Switch>
                  <Route path="/dashboard">
                    <DashboardPage />
                  </Route>
                  <Route path="/recipes">
                    <RecipesPage />
                  </Route>
                  <Route path="/products">
                    <ProductsPage />
                  </Route>
                  <Route path="/ingredients">
                    <IngredientsPage />
                  </Route>
                  <Route path="/supplies">
                    <SuppliesPage />
                  </Route>
                  <Route path="/merchandise">
                    <MerchandisePage />
                  </Route>
                  <ProtectedRoute path="/staff" requiredRole="admin">
                    <StaffPage />
                  </ProtectedRoute>
                  <Route path="*">
                    <NotFound />
                  </Route>
                </Switch>
              </Layout>
            </ProtectedRoute>
            
            <Route component={NotFound} />
          </Switch>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;