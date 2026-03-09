import { useState } from "react";
import { useLocation } from "wouter";
import { Header, Footer } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CollectionsProps {
  category?: string;
  brand?: string;
}

export default function Collections({ category: propCategory, brand: propBrand }: CollectionsProps) {
  const [location] = useLocation();
  
  // Extract simple routing params manually if needed, or rely on props
  // The route pattern in App.tsx will handle passing props
  
  const [sortBy, setSortBy] = useState("featured");
  const { data: products, isLoading } = useProducts({ 
    category: propCategory, 
    brand: propBrand 
  });
  console.log("category"+propCategory)

  const title = propCategory || propBrand || "All Collections";

  // Client-side sorting for this demo
  const sortedProducts = products ? [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1;
    return 0; // featured (default order)
  }) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-secondary/30 py-16 mb-12">
          <div className="container mx-auto px-4 text-center space-y-4">
            <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Collection</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold capitalize">
              {title.replace('-', ' ')}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 mb-24">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b gap-4">
            <p className="text-sm text-muted-foreground">
              {products?.length || 0} products
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <p className="text-xl text-muted-foreground">No products found in this collection.</p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
