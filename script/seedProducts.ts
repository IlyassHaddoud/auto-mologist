import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../server/db";
import { products } from "../shared/schema";

// ESM workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "../images");

const brands = ["Porsche", "Ferrari", "Lamborghini", "BMW", "Mercedes", "Audi"];
const models = ["911", "F40", "Huracan", "M3", "SLS", "R8"];
const categories = ["performance", "signature", "elite"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCarName(): { name: string; brand: string } {
  const brand = getRandomItem(brands);
  const model = getRandomItem(models);
  const name = `${brand} ${model} 1:18`;
  return { name, brand };
}

async function seed() {
  console.log("🗑 Deleting all products...");
  await db.delete(products);

  const files = fs
    .readdirSync(imagesDir)
    .filter(f => f.endsWith(".jpg") || f.endsWith(".png"));

  console.log(`📦 Found ${files.length} images`);

  for (const file of files) {
    const { name, brand } = generateCarName();

    const product = {
      name,
      description: `Premium framed 1:18 scale model of ${name}`,
      price: Math.floor(Math.random() * 40000) + 10000, // 100€ - 500€
      imageUrl: `/images/${file}`,
      category: getRandomItem(categories),
      brand,
      isBestSeller: Math.random() < 0.3,
      isNew: Math.random() < 0.5,
    };

    await db.insert(products).values(product);
    console.log(`✅ Inserted: ${product.name}`);
  }

  console.log("🚀 Seeding complete!");
}

seed()
  .catch(console.error)
  .finally(() => process.exit());