import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col"
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-lg bg-secondary/20 aspect-[4/5] relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
            New
          </span>
        )}
        {product.isBestSeller && !product.isNew && (
          <span className="absolute top-4 left-4 bg-white/90 text-black text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm backdrop-blur-sm">
            Best Seller
          </span>
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <Button
            className="w-full bg-white/90 text-black hover:bg-white shadow-lg backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-medium leading-tight">
          <Link href={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground uppercase tracking-wide text-xs">
          {product.brand} • {product.category}
        </p>
        <p className="text-base font-semibold mt-2">
          ${(product.price / 100).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
