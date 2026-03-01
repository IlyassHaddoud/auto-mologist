import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header, Footer } from "@/components/layout";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartTotal = total();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        customerName: z.string().min(1, "Name is required"),
        customerEmail: z.string().email("Invalid email address"),
      })
    ),
    defaultValues: {
      customerName: "",
      customerEmail: "",
    },
  });

  if (items.length === 0) {
    return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header/>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <Button onClick={() => setLocation("/collections/all")}>
            Return to Shop
          </Button>
        </div>
      <Footer/>
    </div>
    );
  }

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/orders", {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });
      
      toast({
        title: "Order Placed Successfully",
        description: "We will contact you soon for Cash on Delivery.",
      });
      
      clearCart();
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header/>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-serif mb-8 text-primary">Checkout</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-testid="input-customerName" className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} data-testid="input-customerEmail" className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-4 bg-muted rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <p className="text-sm text-muted-foreground font-serif">Cash on Delivery (COD)</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg uppercase tracking-widest" 
                  disabled={isSubmitting}
                  data-testid="button-place-order"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Confirm Order
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <Card className="bg-muted/50 border-primary/10">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-center">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 bg-background rounded border overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{item.name} <span className="text-muted-foreground ml-1">x{item.quantity}</span></span>
                    </div>
                    <span className="font-serif">${((item.price * item.quantity) / 100).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-primary/10 pt-4 mt-4 flex justify-between font-bold text-xl">
                  <span className="font-serif">Total</span>
                  <span className="text-primary font-serif">${(cartTotal / 100).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
