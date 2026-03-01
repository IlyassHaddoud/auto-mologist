import { useState } from "react";
import { Link, useRoute } from "wouter";
import { ChevronRight, Minus, Plus, ShieldCheck, Truck, ShoppingBag, ArrowLeft } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      // Add item multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) return <ProductNotFound />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          <Link href={`/collections/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-secondary/20 rounded-lg overflow-hidden relative group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
                  New Arrival
                </Badge>
              )}
            </div>
            {/* Thumbnails (Mock) */}
            <div className="grid grid-cols-4 gap-4">
              {[product.imageUrl, product.imageUrl, product.imageUrl].map((src, idx) => (
                <div key={idx} className="aspect-square rounded-md overflow-hidden bg-secondary/20 cursor-pointer hover:opacity-80 transition-opacity border border-transparent hover:border-primary">
                  <img src={src} alt="Thumbnail" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">{product.brand}</h2>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-medium">${(product.price / 100).toLocaleString()}</span>
                {product.isBestSeller && (
                  <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">Best Seller</Badge>
                )}
              </div>
            </div>

            <Separator className="mb-8" />

            <div className="prose prose-stone dark:prose-invert max-w-none mb-8 text-muted-foreground">
              <p>{product.description}</p>
              <p>
                Each piece is carefully crafted to highlight the unique character of the automobile. 
                Whether you're a collector or an enthusiast, this piece brings the spirit of the road into your space.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  className="flex-1 h-12 uppercase tracking-widest text-base"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <Truck className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-muted-foreground">On all orders over $500</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <ShieldCheck className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Authenticity Guaranteed</h4>
                  <p className="text-sm text-muted-foreground">Official licensed product</p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="uppercase tracking-wider text-sm">Product Details</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Scale: 1:18</li>
                    <li>Frame Material: Premium Aluminum</li>
                    <li>Glass: Anti-reflective museum grade</li>
                    <li>Dimensions: 40cm x 60cm</li>
                    <li>Includes certificate of authenticity</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="uppercase tracking-wider text-sm">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We ship worldwide. Orders are typically processed within 2-3 business days. 
                  Returns are accepted within 14 days of delivery if the item is in original condition.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-48" />
            <Separator />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="font-display text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
