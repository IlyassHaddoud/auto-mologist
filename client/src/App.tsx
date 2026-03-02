import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Collections from "@/pages/collections";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import AdminDashboard from "@/pages/admin/dashboard";
import Login from "@/pages/login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      {/* Route for product details */}
      <Route path="/product/:id" component={ProductDetail} />
      
      {/* Routes for specific collections passing props */}
      <Route path="/collections/signature">
        {() => <Collections category="signature" />}
      </Route>
      <Route path="/collections/Performance">
        {() => <Collections category="performance" />}
      </Route>
      <Route path="/collections/elite">
        {() => <Collections category="elite" />}
      </Route>
      
      {/* Routes for brands */}
      {/* <Route path="/collections/porsche">
        {() => <Collections brand="Porsche" />}
      </Route>
      <Route path="/collections/ferrari">
        {() => <Collections brand="Ferrari" />}
      </Route> */}
      
      {/* Generic catch-all collection route if needed or separate pages */}
      <Route path="/collections/Collections">
        {() => <Collections />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
