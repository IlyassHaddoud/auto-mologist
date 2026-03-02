import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { data: bestSellers, isLoading: isBestSellersLoading } = useProducts({ isBestSeller: "true" });
  const { data: Signature, isLoading: isSignatureLoading } = useProducts({ category: "Signature" });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            {/* Scenic mountain road with classic car vibe */}
            <img
              src="https://images.unsplash.com/photo-1762803942915-033c7f0ea82b?q=80&w=1761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Classic car on scenic road"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center max-w-4xl space-y-8">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base uppercase tracking-[0.2em] font-medium"
            >
              The Art of Automotive Culture
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              L'encadreur des plus grandes Collections
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl font-light"
            >
              Discover our exclusive collection of 1:18 scale model frames and artistic automotive signature.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/collections/classic-icons">
                <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-white/90">
                  Explore Collections
                </Button>
              </Link>
              <Link href="/collections/Signature">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white text-white hover:bg-white/10 hover:text-white">
                  View Signature Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">Curated Selection</span>
              <h2 className="font-display text-4xl font-bold">Our Best Sellers</h2>
            </div>
            <Link href="/collections/best-sellers">
              <Button variant="ghost" className="group text-lg">
                View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isBestSellersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {bestSellers?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Branding Banner */}
        <section className="bg-primary text-primary-foreground py-24">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
              </div>
              <h3 className="font-display text-2xl font-bold">Official License</h3>
              <p className="text-primary-foreground/70">Partnering with major automotive brands to bring you authentic collectibles.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-8 w-8 border-2 border-current rounded-full flex items-center justify-center font-serif italic font-bold">A</div>
              </div>
              <h3 className="font-display text-2xl font-bold">Artisan Craftsmanship</h3>
              <p className="text-primary-foreground/70">Each frame is assembled by hand in our workshop with premium materials.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="font-display text-2xl font-bold">Worldwide Shipping</h3>
              <p className="text-primary-foreground/70">Secure packaging and insured delivery to automotive enthusiasts globally.</p>
            </div>
          </div>
        </section>

        {/* Signature Collection */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <span className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">New Arrivals</span>
            <h2 className="font-display text-5xl font-bold">Affiches "signature"</h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A curated collection of vintage magazine style signature reimagined for the modern wall.
            </p>
            <Link href="/collections/signature">
              <Button variant="outline" className="mt-4 border-black text-black hover:bg-black hover:text-white transition-colors">
                Discover Collection
              </Button>
            </Link>
          </div>

          {isSignatureLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} className="h-[500px] w-full" />
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Signature?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 text-center max-w-2xl space-y-8">
            <h2 className="font-display text-3xl font-bold">Join "The Autovault" Community</h2>
            <p className="text-muted-foreground">
              Be the first to hear about our participation in key automotive events, new products, limited editions & promotions.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-12 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" size="lg" className="h-12 uppercase tracking-wide">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
