import { useQuery, useMutation } from "@tanstack/react-query";
import { OrderWithItems, Product } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Header, Footer } from "@/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Edit, Eye, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ProductForm } from "@/components/product-form";
import { OrderDetailsDialog } from "@/components/order-details-dialog";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  useEffect(() => {
    // Check authentication status with a slight delay to allow state updates
    const timer = setTimeout(() => {
      if (!isAuthenticated()) {
        setLocation("/login");
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation]);
  
  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    setLocation("/login");
  };
  
  const { data: orders, isLoading: loadingOrders } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Status updated" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
  });

  if (loadingOrders || loadingProducts) {
    return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header/>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
            <Footer/>
    </div>

    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header/>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-primary">Admin Dashboard</h1>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
        
        <Tabs defaultValue="orders">
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>
                          <div>{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                        </TableCell>
                        <TableCell>${(order.total / 100).toLocaleString()}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(val) => updateStatusMutation.mutate({ id: order.id, status: val })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderDetailsOpen(true);
                            }}
                            data-testid="button-view-order-details"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Product Inventory</h2>
              <Button 
                onClick={() => {
                  setEditingProduct(undefined);
                  setIsFormOpen(true);
                }}
                data-testid="button-add-product"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${(product.price / 100).toLocaleString()}</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => {
                              if(confirm("Are you sure?")) deleteProductMutation.mutate(product.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ProductForm 
          product={editingProduct} 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen} 
        />
        
        <OrderDetailsDialog 
          order={selectedOrder}
          open={isOrderDetailsOpen}
          onOpenChange={setIsOrderDetailsOpen}
        />
      </div>
    <Footer/>
    </div>
  );
}
