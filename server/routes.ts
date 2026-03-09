import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import express from "express";

const upload = multer({
  storage: multer.diskStorage({
    destination: "client/public/images",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded images
  app.use("/images", express.static("client/public/images"));

  app.post("/api/admin/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `/images/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Public Product Routes
  app.get(api.products.list.path, async (req, res) => {
    const filters = {
      category: req.query.category as string | undefined,
      brand: req.query.brand as string | undefined,
      isBestSeller: req.query.isBestSeller as string | undefined,
    };
    const allProducts = await storage.getProducts(filters);
    res.json(allProducts);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  // Order Creation (Checkout)
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      let total = 0;
      const itemsWithPrice = [];
      
      for (const item of input.items) {
        const product = await storage.getProduct(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        const price = product.price;
        total += price * item.quantity;
        itemsWithPrice.push({ ...item, price });
      }

      const order = await storage.createOrder({
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        total,
        status: 'pending'
      }, itemsWithPrice);

      res.status(201).json({ id: order.id });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // Admin Routes (Simplified for MVP - no auth for now as requested by user's "add an admin dashboard" without specific auth request)
  app.get(api.orders.list.path, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    const updated = await storage.updateOrderStatus(Number(req.params.id), req.body.status);
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.patch(api.products.update.path, async (req, res) => {
    try {
      const input = api.products.update.input.parse(req.body);
      const updated = await storage.updateProduct(Number(req.params.id), input);
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).end();
  });

  // Auth Routes
  const ADMIN_EMAIL = "admin@theautomologist.com";
  const ADMIN_PASSWORD = "password123";

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  return httpServer;
}
