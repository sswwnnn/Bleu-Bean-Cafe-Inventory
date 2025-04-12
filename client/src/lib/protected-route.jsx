import { useAuth } from "../hooks/use-auth.jsx";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  children
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 animate-spin text-border">Loading...</div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      {Component ? <Component /> : children}
    </Route>
  );
}