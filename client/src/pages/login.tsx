import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { Header, Footer } from "@/components/layout";


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { setToken } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", values);
      const data = await response.json(); // <-- parse JSON
      // console.log("LOGIN DATA:", data);
      // Set token immediately in both localStorage and Zustand
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
      // Redirect to admin after token is set
      setTimeout(() => setLocation("/admin"), 100);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header/>
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Card className="w-full max-w-md bg-card border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-3xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@theautomologist.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2 font-medium">Demo Credentials:</p>
                  <p>Email: admin@theautomologist.com</p>
                  <p>Password: password123</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full uppercase tracking-widest py-6"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    <Footer/>
    </div>
  );
}
