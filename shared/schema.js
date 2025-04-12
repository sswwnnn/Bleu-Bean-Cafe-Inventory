import { pgTable, text, serial, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("staff"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  size: text("size"),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull(),
  bestBefore: timestamp("best_before"),
  expiration: timestamp("expiration"),
  status: text("status").notNull().default("available"),
});

export const supplies = pgTable("supplies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull(),
  supplyDate: timestamp("supply_date").notNull(),
  status: text("status").notNull().default("available"),
});

export const merchandise = pgTable("merchandise", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  dateAdded: timestamp("date_added").notNull(),
  status: text("status").notNull().default("available"),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  bestBefore: text("best_before"),
  expiryDate: timestamp("expiry_date"),
});

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull(),
});

export const recipeSupplies = pgTable("recipe_supplies", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  supplyId: integer("supply_id").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  actionType: text("action_type").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertIngredientSchema = createInsertSchema(ingredients).omit({ id: true });
export const insertSupplySchema = createInsertSchema(supplies).omit({ id: true });
export const insertMerchandiseSchema = createInsertSchema(merchandise).omit({ id: true });
export const insertRecipeSchema = createInsertSchema(recipes).omit({ id: true });
export const insertRecipeIngredientSchema = createInsertSchema(recipeIngredients).omit({ id: true });
export const insertRecipeSupplySchema = createInsertSchema(recipeSupplies).omit({ id: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, timestamp: true });