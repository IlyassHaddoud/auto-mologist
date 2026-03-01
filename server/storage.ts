import { db } from "./db";
import { products, type Product, type InsertProduct, orders, orderItems, type Order, type OrderItem, type OrderWithItems } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getProducts(filters?: { category?: string; brand?: string; isBestSeller?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  createOrder(order: any, items: any[]): Promise<Order>;
  getOrders(): Promise<OrderWithItems[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(filters?: { category?: string; brand?: string; isBestSeller?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    const results = await query;
    return results.filter(p => {
      let match = true;
      if (filters?.category) match = match && p.category === filters.category;
      if (filters?.brand) match = match && p.brand === filters.brand;
      if (filters?.isBestSeller === 'true') match = match && p.isBestSeller === true;
      return match;
    });
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async createOrder(orderData: any, itemsData: any[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(orderData).returning();
    for (const item of itemsData) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }
    return newOrder;
  }

  async getOrders(): Promise<OrderWithItems[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const ordersWithItems: OrderWithItems[] = [];
    for (const order of allOrders) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      ordersWithItems.push({ ...order, items });
    }
    return ordersWithItems;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
