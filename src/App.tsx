import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import ResultsPage from "./pages/ResultsPage";
import DevelopersPage from "./pages/DevelopersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Smart redirect based on user role
function RoleBasedRedirect() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user?.role === "super_admin") {
    return <Navigate to="/super-admin" replace />;
  } else if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Voter Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["voter"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Super Admin Dashboard */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Settings Page */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["voter", "admin", "super_admin"]}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Audit Logs Page */}
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Results Page */}
      <Route
        path="/results"
        element={
          <ProtectedRoute allowedRoles={["voter", "admin", "super_admin"]}>
            <ResultsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Developers Page */}
      <Route path="/developers" element={<DevelopersPage />} />
      
      {/* Auto-redirect to appropriate dashboard */}
      <Route path="/home" element={<RoleBasedRedirect />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
