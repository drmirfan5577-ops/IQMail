import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import DynamicBackground from "@/components/features/DynamicBackground";
import OrnamentalBackground from "@/components/features/OrnamentalBackground";
import BackgroundManager from "@/components/features/BackgroundManager";
import LauncherDock from "@/components/features/LauncherDock";
import FocusModeButton from "@/components/features/FocusModeButton";
import StarSidebar from "@/components/features/StarSidebar";
import WorldClock from "@/components/features/WorldClock";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import Analytics from "./pages/Analytics";
import AdminPanel from "./pages/AdminPanel";
import Wallpapers from "./pages/Wallpapers";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          {/* Layer 1: CSS animated blobs + parallax */}
          <DynamicBackground />
          {/* Layer 2: Ornamental particles — dots, bubbles, flowers, stars, rings */}
          <OrnamentalBackground />

          {/* Floating UI controls */}
          <FocusModeButton />
          <BackgroundManager />

          {/* Star-triggered slide sidebars */}
          <StarSidebar side="left" />
          <StarSidebar side="right" />

          {/* World clock + calendar */}
          <WorldClock />

          <Navbar />

          <div className="pb-28">
            <Routes>
              <Route path="/"             element={<Index />} />
              <Route path="/signup"       element={<Signup />} />
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/compose"      element={<Compose />} />
              <Route path="/analytics"    element={<Analytics />} />
              <Route path="/admin"        element={<AdminPanel />} />
              <Route path="/wallpapers"   element={<Wallpapers />} />
              <Route path="/integrations" element={<Integrations />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*"             element={<NotFound />} />
            </Routes>
          </div>

          {/* Launcher dock */}
          <LauncherDock />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
