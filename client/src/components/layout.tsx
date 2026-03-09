import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Search, Instagram, Facebook, Youtube, LogOut } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";


export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, toggleCart, isOpen: isCartOpen } = useCart();
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/collections/Signature", label: "Signature" },
    { href: "/collections/Performance", label: "Performance" },
    { href: "/collections/Elite", label: "Elite" },
    { href: "/collections/Collections", label: "Collections" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl text-left">The Autovault</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-lg font-medium hover:text-primary/70 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="text-lg font-medium hover:text-primary/70 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            The Autovault
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover-underline uppercase tracking-wider",
                location === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated() ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                logout();
                setLocation("/login");
              }}
              className="hidden md:flex text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden md:flex text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
                Login
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          <Sheet open={isCartOpen} onOpenChange={toggleCart}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Your Collection</SheetTitle>
              </SheetHeader>
              <CartContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function CartContent() {
  const { items, removeItem, updateQuantity, total, toggleCart } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm mt-2">Start collecting some automotive art.</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1 -mx-6 px-6 my-4">
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <h3 className="font-medium line-clamp-2">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity / 100).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between text-lg font-display font-bold">
          <span>Total</span>
          <span>${(total() / 100).toLocaleString()}</span>
        </div>
        <Button 
          className="w-full h-12 text-base uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            toggleCart();
            setLocation("/checkout");
          }}
        >
          Checkout
        </Button>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="font-display text-3xl font-bold">The Autovault</h2>
            <p className="text-primary-foreground/70 max-w-sm leading-relaxed">
              Pionnier de la maquette encadrée, aujourd'hui encadreur des plus grandes collections automobiles autour du monde.
              Une quête perpétuelle du beau, du style & de l'élégance automobile.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl">Collections</h3>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><Link href="/collections/Signature" className="hover:text-white transition-colors">Signature</Link></li>
              <li><Link href="/collections/Performance" className="hover:text-white transition-colors">Performance</Link></li>
              <li><Link href="/collections/Elite" className="hover:text-white transition-colors">Elite</Link></li>
              <li><Link href="/collections/Collections" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link href="/collections/appointments" className="hover:text-white transition-colors">Appointments</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl">Information</h3>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} The Autovault. All rights reserved.</p>
          <p>Designed with passion for automotive art.</p>
        </div>
      </div>
    </footer>
  );
}
