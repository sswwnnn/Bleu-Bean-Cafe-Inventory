// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import createMemoryStore from "memorystore";
import session from "express-session";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  usersData;
  productsData;
  ingredientsData;
  suppliesData;
  merchandiseData;
  recipesData;
  recipeIngredientsData;
  recipeSuppliesData;
  activityLogsData;
  sessionStore;
  userId = 1;
  productId = 1;
  ingredientId = 1;
  supplyId = 1;
  merchandiseId = 1;
  recipeId = 1;
  recipeIngredientId = 1;
  recipeSupplyId = 1;
  activityLogId = 1;
  constructor() {
    this.usersData = /* @__PURE__ */ new Map();
    this.productsData = /* @__PURE__ */ new Map();
    this.ingredientsData = /* @__PURE__ */ new Map();
    this.suppliesData = /* @__PURE__ */ new Map();
    this.merchandiseData = /* @__PURE__ */ new Map();
    this.recipesData = /* @__PURE__ */ new Map();
    this.recipeIngredientsData = /* @__PURE__ */ new Map();
    this.recipeSuppliesData = /* @__PURE__ */ new Map();
    this.activityLogsData = /* @__PURE__ */ new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // Clear expired sessions every 24h
    });
    this.createUser({
      username: "admin",
      password: "admin_password",
      // This will be hashed in auth.ts
      role: "admin",
      fullName: "Admin User",
      email: "admin@cafeinventory.com",
      phoneNumber: "123-456-7890",
      isActive: true
    });
    this.createUser({
      username: "john.barista",
      password: "password123",
      role: "staff",
      fullName: "John Smith",
      email: "john@bleubeancafe.com",
      phoneNumber: "555-123-4567",
      isActive: true
    });
    this.createUser({
      username: "maria.waitress",
      password: "password123",
      role: "staff",
      fullName: "Maria Garcia",
      email: "maria@bleubeancafe.com",
      phoneNumber: "555-234-5678",
      isActive: true
    });
    this.createUser({
      username: "david.manager",
      password: "password123",
      role: "manager",
      fullName: "David Johnson",
      email: "david@bleubeancafe.com",
      phoneNumber: "555-345-6789",
      isActive: true
    });
    this.createUser({
      username: "sarah.barista",
      password: "password123",
      role: "staff",
      fullName: "Sarah Wilson",
      email: "sarah@bleubeancafe.com",
      phoneNumber: "555-456-7890",
      isActive: false
    });
    this.createSupply({
      name: "Coffee Cups - 12oz",
      quantity: 500,
      measurement: "pieces",
      supplyDate: /* @__PURE__ */ new Date("2023-04-15"),
      status: "In Stock"
    });
    this.createSupply({
      name: "Coffee Sleeves",
      quantity: 350,
      measurement: "pieces",
      supplyDate: /* @__PURE__ */ new Date("2023-04-10"),
      status: "Low Stock"
    });
    this.createSupply({
      name: "Stirring Sticks",
      quantity: 1e3,
      measurement: "pieces",
      supplyDate: /* @__PURE__ */ new Date("2023-03-28"),
      status: "In Stock"
    });
    this.createSupply({
      name: "Espresso Machine Cleaning Solution",
      quantity: 2,
      measurement: "bottles",
      supplyDate: /* @__PURE__ */ new Date("2023-04-05"),
      status: "Low Stock"
    });
    this.createSupply({
      name: "Napkins",
      quantity: 0,
      measurement: "packs",
      supplyDate: /* @__PURE__ */ new Date("2023-03-15"),
      status: "Out of Stock"
    });
    this.createMerchandise({
      name: "Bleu Bean Coffee Mug",
      quantity: 25,
      description: "Ceramic mug with Bleu Bean Cafe logo, dishwasher safe",
      status: "In Stock"
    });
    this.createMerchandise({
      name: "Bleu Bean T-Shirt",
      quantity: 15,
      description: "100% cotton t-shirt with Bleu Bean Cafe logo, available in S, M, L sizes",
      status: "In Stock"
    });
    this.createMerchandise({
      name: "Reusable Cold Cup",
      quantity: 5,
      description: "BPA-free plastic cold cup with straw, perfect for iced drinks",
      status: "Low Stock"
    });
    this.createMerchandise({
      name: "Espresso Blend - 12oz Bag",
      quantity: 0,
      description: "Our signature espresso blend, whole bean, medium-dark roast",
      status: "Out of Stock"
    });
    this.createMerchandise({
      name: "Bleu Bean Tote Bag",
      quantity: 30,
      description: "Canvas tote bag with Bleu Bean Cafe logo, perfect for shopping",
      status: "In Stock"
    });
  }
  // User methods
  async getUser(id) {
    return this.usersData.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(user) {
    const id = this.userId++;
    const newUser = { ...user, id };
    this.usersData.set(id, newUser);
    return newUser;
  }
  async updateUser(id, user) {
    const existingUser = await this.getUser(id);
    if (!existingUser) return void 0;
    const updatedUser = { ...existingUser, ...user };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.usersData.values());
  }
  async getUsersByRole(role) {
    return Array.from(this.usersData.values()).filter((user) => user.role === role);
  }
  async archiveUser(id) {
    const user = await this.getUser(id);
    if (!user) return void 0;
    const updatedUser = { ...user, isActive: false };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  // Product methods
  async getProduct(id) {
    return this.productsData.get(id);
  }
  async getAllProducts() {
    return Array.from(this.productsData.values());
  }
  async getProductsByCategory(category) {
    return Array.from(this.productsData.values()).filter((product) => product.category === category);
  }
  async createProduct(product) {
    const id = this.productId++;
    const newProduct = { ...product, id };
    this.productsData.set(id, newProduct);
    return newProduct;
  }
  async updateProduct(id, product) {
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) return void 0;
    const updatedProduct = { ...existingProduct, ...product };
    this.productsData.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.productsData.delete(id);
  }
  // Ingredient methods
  async getIngredient(id) {
    return this.ingredientsData.get(id);
  }
  async getAllIngredients() {
    return Array.from(this.ingredientsData.values());
  }
  async getIngredientsByStatus(status) {
    return Array.from(this.ingredientsData.values()).filter((ingredient) => ingredient.status === status);
  }
  async getLowStockIngredients() {
    return Array.from(this.ingredientsData.values()).filter((ingredient) => ingredient.status === "low");
  }
  async createIngredient(ingredient) {
    const id = this.ingredientId++;
    const newIngredient = { ...ingredient, id };
    this.ingredientsData.set(id, newIngredient);
    return newIngredient;
  }
  async updateIngredient(id, ingredient) {
    const existingIngredient = await this.getIngredient(id);
    if (!existingIngredient) return void 0;
    const updatedIngredient = { ...existingIngredient, ...ingredient };
    this.ingredientsData.set(id, updatedIngredient);
    return updatedIngredient;
  }
  async deleteIngredient(id) {
    return this.ingredientsData.delete(id);
  }
  // Supply methods
  async getSupply(id) {
    return this.suppliesData.get(id);
  }
  async getAllSupplies() {
    return Array.from(this.suppliesData.values());
  }
  async getSuppliesByStatus(status) {
    return Array.from(this.suppliesData.values()).filter((supply) => supply.status === status);
  }
  async createSupply(supply) {
    const id = this.supplyId++;
    const newSupply = { ...supply, id };
    this.suppliesData.set(id, newSupply);
    return newSupply;
  }
  async updateSupply(id, supply) {
    const existingSupply = await this.getSupply(id);
    if (!existingSupply) return void 0;
    const updatedSupply = { ...existingSupply, ...supply };
    this.suppliesData.set(id, updatedSupply);
    return updatedSupply;
  }
  async deleteSupply(id) {
    return this.suppliesData.delete(id);
  }
  // Merchandise methods
  async getMerchandise(id) {
    return this.merchandiseData.get(id);
  }
  async getAllMerchandise() {
    return Array.from(this.merchandiseData.values());
  }
  async getMerchandiseByStatus(status) {
    return Array.from(this.merchandiseData.values()).filter((merchandise2) => merchandise2.status === status);
  }
  async createMerchandise(merchandise2) {
    const id = this.merchandiseId++;
    const newMerchandise = { ...merchandise2, id };
    this.merchandiseData.set(id, newMerchandise);
    return newMerchandise;
  }
  async updateMerchandise(id, merchandise2) {
    const existingMerchandise = await this.getMerchandise(id);
    if (!existingMerchandise) return void 0;
    const updatedMerchandise = { ...existingMerchandise, ...merchandise2 };
    this.merchandiseData.set(id, updatedMerchandise);
    return updatedMerchandise;
  }
  async deleteMerchandise(id) {
    return this.merchandiseData.delete(id);
  }
  // Recipe methods
  async getRecipe(id) {
    return this.recipesData.get(id);
  }
  async getRecipeByProductId(productId) {
    return Array.from(this.recipesData.values()).find((recipe) => recipe.productId === productId);
  }
  async getAllRecipes() {
    return Array.from(this.recipesData.values());
  }
  async createRecipe(recipe) {
    const id = this.recipeId++;
    const newRecipe = { ...recipe, id };
    this.recipesData.set(id, newRecipe);
    return newRecipe;
  }
  async updateRecipe(id, recipe) {
    const existingRecipe = await this.getRecipe(id);
    if (!existingRecipe) return void 0;
    const updatedRecipe = { ...existingRecipe, ...recipe };
    this.recipesData.set(id, updatedRecipe);
    return updatedRecipe;
  }
  async deleteRecipe(id) {
    return this.recipesData.delete(id);
  }
  // Recipe Ingredient methods
  async getRecipeIngredientsByRecipeId(recipeId) {
    return Array.from(this.recipeIngredientsData.values()).filter((ri) => ri.recipeId === recipeId);
  }
  async addIngredientToRecipe(recipeIngredient) {
    const id = this.recipeIngredientId++;
    const newRecipeIngredient = { ...recipeIngredient, id };
    this.recipeIngredientsData.set(id, newRecipeIngredient);
    return newRecipeIngredient;
  }
  async updateRecipeIngredient(id, recipeIngredient) {
    const existingRecipeIngredient = this.recipeIngredientsData.get(id);
    if (!existingRecipeIngredient) return void 0;
    const updatedRecipeIngredient = { ...existingRecipeIngredient, ...recipeIngredient };
    this.recipeIngredientsData.set(id, updatedRecipeIngredient);
    return updatedRecipeIngredient;
  }
  async removeIngredientFromRecipe(id) {
    return this.recipeIngredientsData.delete(id);
  }
  // Recipe Supply methods
  async getRecipeSuppliesByRecipeId(recipeId) {
    return Array.from(this.recipeSuppliesData.values()).filter((rs) => rs.recipeId === recipeId);
  }
  async addSupplyToRecipe(recipeSupply) {
    const id = this.recipeSupplyId++;
    const newRecipeSupply = { ...recipeSupply, id };
    this.recipeSuppliesData.set(id, newRecipeSupply);
    return newRecipeSupply;
  }
  async updateRecipeSupply(id, recipeSupply) {
    const existingRecipeSupply = this.recipeSuppliesData.get(id);
    if (!existingRecipeSupply) return void 0;
    const updatedRecipeSupply = { ...existingRecipeSupply, ...recipeSupply };
    this.recipeSuppliesData.set(id, updatedRecipeSupply);
    return updatedRecipeSupply;
  }
  async removeSupplyFromRecipe(id) {
    return this.recipeSuppliesData.delete(id);
  }
  // Activity Log methods
  async createActivityLog(log2) {
    const id = this.activityLogId++;
    const newLog = { ...log2, id, timestamp: /* @__PURE__ */ new Date() };
    this.activityLogsData.set(id, newLog);
    return newLog;
  }
  async getRecentActivityLogs(limit) {
    return Array.from(this.activityLogsData.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }
  // Inventory metrics
  async getInventoryMetrics() {
    const ingredients2 = await this.getAllIngredients();
    const supplies2 = await this.getAllSupplies();
    const merchandise2 = await this.getAllMerchandise();
    const totalItems = ingredients2.length + supplies2.length + merchandise2.length;
    const lowStockCount = ingredients2.filter((i) => i.status === "low").length + supplies2.filter((s) => s.status === "low").length + merchandise2.filter((m) => m.status === "low").length;
    const restockCount = ingredients2.filter((i) => i.status === "restock").length + supplies2.filter((s) => s.status === "restock").length;
    const outOfStockCount = ingredients2.filter((i) => i.status === "out").length + supplies2.filter((s) => s.status === "out").length + merchandise2.filter((m) => m.status === "out").length;
    return {
      totalItems,
      lowStockCount,
      restockCount,
      outOfStockCount
    };
  }
};
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "cafe-inventory-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    try {
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        storage.createActivityLog({
          userId: user.id,
          actionType: "USER_CREATED",
          description: `New user registered: ${user.username}`
        });
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    const user = req.user;
    storage.createActivityLog({
      userId: user.id,
      actionType: "USER_LOGIN",
      description: `User logged in: ${user.username}`
    });
    res.status(200).json(user);
  });
  app2.post("/api/logout", (req, res, next) => {
    if (req.user) {
      const user = req.user;
      storage.createActivityLog({
        userId: user.id,
        actionType: "USER_LOGOUT",
        description: `User logged out: ${user.username}`
      });
    }
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user;
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }
      next();
    };
  };
  app2.locals.checkRole = checkRole;
}

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("staff"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  position: text("position").notNull().default("staff"),
  phone: text("phone"),
  joinDate: text("join_date"),
  isActive: boolean("is_active").notNull().default(true)
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  size: text("size")
});
var ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull(),
  bestBefore: timestamp("best_before"),
  expiration: timestamp("expiration"),
  status: text("status").notNull().default("available")
});
var supplies = pgTable("supplies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull(),
  supplyDate: timestamp("supply_date").notNull(),
  status: text("status").notNull().default("available")
});
var merchandise = pgTable("merchandise", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  dateAdded: timestamp("date_added").notNull(),
  status: text("status").notNull().default("available")
});
var recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  bestBefore: text("best_before"),
  expiryDate: timestamp("expiry_date")
});
var recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull()
});
var recipeSupplies = pgTable("recipe_supplies", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  supplyId: integer("supply_id").notNull(),
  quantity: real("quantity").notNull(),
  measurement: text("measurement").notNull()
});
var activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  actionType: text("action_type").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({ id: true });
var insertProductSchema = createInsertSchema(products).omit({ id: true });
var insertIngredientSchema = createInsertSchema(ingredients).omit({ id: true });
var insertSupplySchema = createInsertSchema(supplies).omit({ id: true });
var insertMerchandiseSchema = createInsertSchema(merchandise).omit({ id: true });
var insertRecipeSchema = createInsertSchema(recipes).omit({ id: true });
var insertRecipeIngredientSchema = createInsertSchema(recipeIngredients).omit({ id: true });
var insertRecipeSupplySchema = createInsertSchema(recipeSupplies).omit({ id: true });
var insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, timestamp: true });

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  const { checkRole } = app2.locals;
  app2.get("/api/metrics", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const metrics = await storage.getInventoryMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const category = req.query.category;
      const products2 = category ? await storage.getProductsByCategory(category) : await storage.getAllProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "PRODUCT_CREATED",
        description: `Created product: ${product.name}`
      });
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "PRODUCT_UPDATED",
        description: `Updated product: ${product.name}`
      });
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const result = await storage.deleteProduct(id);
      if (result) {
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "PRODUCT_DELETED",
          description: `Deleted product: ${product.name}`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/ingredients", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const status = req.query.status;
      const ingredients2 = status ? await storage.getIngredientsByStatus(status) : await storage.getAllIngredients();
      res.json(ingredients2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });
  app2.get("/api/ingredients/low-stock", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const ingredients2 = await storage.getLowStockIngredients();
      res.json(ingredients2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock ingredients" });
    }
  });
  app2.get("/api/ingredients/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const ingredient = await storage.getIngredient(id);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredient" });
    }
  });
  app2.post("/api/ingredients", async (req, res) => {
    try {
      const validatedData = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.createIngredient(validatedData);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "INGREDIENT_CREATED",
        description: `Added ingredient: ${ingredient.name}`
      });
      res.status(201).json(ingredient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ingredient" });
    }
  });
  app2.put("/api/ingredients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertIngredientSchema.partial().parse(req.body);
      const ingredient = await storage.updateIngredient(id, validatedData);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "INGREDIENT_UPDATED",
        description: `Updated ingredient: ${ingredient.name}`
      });
      res.json(ingredient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update ingredient" });
    }
  });
  app2.delete("/api/ingredients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ingredient = await storage.getIngredient(id);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      const result = await storage.deleteIngredient(id);
      if (result) {
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "INGREDIENT_DELETED",
          description: `Deleted ingredient: ${ingredient.name}`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ingredient" });
    }
  });
  app2.get("/api/supplies", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const status = req.query.status;
      const supplies2 = status ? await storage.getSuppliesByStatus(status) : await storage.getAllSupplies();
      res.json(supplies2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplies" });
    }
  });
  app2.get("/api/supplies/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const supply = await storage.getSupply(id);
      if (!supply) {
        return res.status(404).json({ message: "Supply not found" });
      }
      res.json(supply);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supply" });
    }
  });
  app2.post("/api/supplies", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const validatedData = insertSupplySchema.parse(req.body);
      const supply = await storage.createSupply(validatedData);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "SUPPLY_CREATED",
        description: `Added supply: ${supply.name}`
      });
      res.status(201).json(supply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supply data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supply" });
    }
  });
  app2.put("/api/supplies/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupplySchema.partial().parse(req.body);
      const supply = await storage.updateSupply(id, validatedData);
      if (!supply) {
        return res.status(404).json({ message: "Supply not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "SUPPLY_UPDATED",
        description: `Updated supply: ${supply.name}`
      });
      res.json(supply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supply data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update supply" });
    }
  });
  app2.delete("/api/supplies/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const supply = await storage.getSupply(id);
      if (!supply) {
        return res.status(404).json({ message: "Supply not found" });
      }
      const result = await storage.deleteSupply(id);
      if (result) {
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "SUPPLY_DELETED",
          description: `Deleted supply: ${supply.name}`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supply" });
    }
  });
  app2.get("/api/merchandise", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const status = req.query.status;
      const merchandise2 = status ? await storage.getMerchandiseByStatus(status) : await storage.getAllMerchandise();
      res.json(merchandise2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchandise" });
    }
  });
  app2.get("/api/merchandise/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const merchandise2 = await storage.getMerchandise(id);
      if (!merchandise2) {
        return res.status(404).json({ message: "Merchandise not found" });
      }
      res.json(merchandise2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchandise" });
    }
  });
  app2.post("/api/merchandise", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const validatedData = insertMerchandiseSchema.parse(req.body);
      const merchandise2 = await storage.createMerchandise(validatedData);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "MERCHANDISE_CREATED",
        description: `Added merchandise: ${merchandise2.name}`
      });
      res.status(201).json(merchandise2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid merchandise data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create merchandise" });
    }
  });
  app2.put("/api/merchandise/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMerchandiseSchema.partial().parse(req.body);
      const merchandise2 = await storage.updateMerchandise(id, validatedData);
      if (!merchandise2) {
        return res.status(404).json({ message: "Merchandise not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "MERCHANDISE_UPDATED",
        description: `Updated merchandise: ${merchandise2.name}`
      });
      res.json(merchandise2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid merchandise data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update merchandise" });
    }
  });
  app2.delete("/api/merchandise/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const merchandise2 = await storage.getMerchandise(id);
      if (!merchandise2) {
        return res.status(404).json({ message: "Merchandise not found" });
      }
      const result = await storage.deleteMerchandise(id);
      if (result) {
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "MERCHANDISE_DELETED",
          description: `Deleted merchandise: ${merchandise2.name}`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete merchandise" });
    }
  });
  app2.get("/api/recipes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const recipes2 = await storage.getAllRecipes();
      res.json(recipes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  app2.get("/api/recipes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const product = await storage.getProduct(recipe.productId);
      const ingredients2 = await storage.getRecipeIngredientsByRecipeId(id);
      const supplies2 = await storage.getRecipeSuppliesByRecipeId(id);
      res.json({
        recipe,
        product,
        ingredients: ingredients2,
        supplies: supplies2
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  app2.post("/api/recipes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const validatedData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(validatedData);
      const product = await storage.getProduct(recipe.productId);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "RECIPE_CREATED",
        description: `Created recipe for: ${product?.name || "Unknown Product"}`
      });
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  app2.put("/api/recipes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRecipeSchema.partial().parse(req.body);
      const recipe = await storage.updateRecipe(id, validatedData);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const product = await storage.getProduct(recipe.productId);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "RECIPE_UPDATED",
        description: `Updated recipe for: ${product?.name || "Unknown Product"}`
      });
      res.json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  app2.delete("/api/recipes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const result = await storage.deleteRecipe(id);
      if (result) {
        const product = await storage.getProduct(recipe.productId);
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "RECIPE_DELETED",
          description: `Deleted recipe for: ${product?.name || "Unknown Product"}`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });
  app2.post("/api/recipe-ingredients", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const validatedData = insertRecipeIngredientSchema.parse(req.body);
      const recipeIngredient = await storage.addIngredientToRecipe(validatedData);
      const recipe = await storage.getRecipe(recipeIngredient.recipeId);
      const product = recipe ? await storage.getProduct(recipe.productId) : null;
      const ingredient = await storage.getIngredient(recipeIngredient.ingredientId);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "RECIPE_INGREDIENT_ADDED",
        description: `Added ${ingredient?.name || "ingredient"} to recipe for: ${product?.name || "Unknown Product"}`
      });
      res.status(201).json(recipeIngredient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe ingredient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add ingredient to recipe" });
    }
  });
  app2.put("/api/recipe-ingredients/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRecipeIngredientSchema.partial().parse(req.body);
      const recipeIngredient = await storage.updateRecipeIngredient(id, validatedData);
      if (!recipeIngredient) {
        return res.status(404).json({ message: "Recipe ingredient not found" });
      }
      const recipe = await storage.getRecipe(recipeIngredient.recipeId);
      const product = recipe ? await storage.getProduct(recipe.productId) : null;
      const ingredient = await storage.getIngredient(recipeIngredient.ingredientId);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "RECIPE_INGREDIENT_UPDATED",
        description: `Updated ${ingredient?.name || "ingredient"} in recipe for: ${product?.name || "Unknown Product"}`
      });
      res.json(recipeIngredient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe ingredient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipe ingredient" });
    }
  });
  app2.delete("/api/recipe-ingredients/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const recipeIngredient = await storage.getRecipeIngredientsByRecipeId(id);
      if (!recipeIngredient || recipeIngredient.length === 0) {
        return res.status(404).json({ message: "Recipe ingredient not found" });
      }
      const result = await storage.removeIngredientFromRecipe(id);
      if (result) {
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "RECIPE_INGREDIENT_REMOVED",
          description: `Removed ingredient from recipe`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove ingredient from recipe" });
    }
  });
  app2.post("/api/recipe-supplies", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const validatedData = insertRecipeSupplySchema.parse(req.body);
      const recipeSupply = await storage.addSupplyToRecipe(validatedData);
      const recipe = await storage.getRecipe(recipeSupply.recipeId);
      const product = recipe ? await storage.getProduct(recipe.productId) : null;
      const supply = await storage.getSupply(recipeSupply.supplyId);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "RECIPE_SUPPLY_ADDED",
        description: `Added ${supply?.name || "supply"} to recipe for: ${product?.name || "Unknown Product"}`
      });
      res.status(201).json(recipeSupply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe supply data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add supply to recipe" });
    }
  });
  app2.put("/api/recipe-supplies/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRecipeSupplySchema.partial().parse(req.body);
      const recipeSupply = await storage.updateRecipeSupply(id, validatedData);
      if (!recipeSupply) {
        return res.status(404).json({ message: "Recipe supply not found" });
      }
      const recipe = await storage.getRecipe(recipeSupply.recipeId);
      const product = recipe ? await storage.getProduct(recipe.productId) : null;
      const supply = await storage.getSupply(recipeSupply.supplyId);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "RECIPE_SUPPLY_UPDATED",
        description: `Updated ${supply?.name || "supply"} in recipe for: ${product?.name || "Unknown Product"}`
      });
      res.json(recipeSupply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe supply data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipe supply" });
    }
  });
  app2.delete("/api/recipe-supplies/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const recipeSupplies2 = await storage.getRecipeSuppliesByRecipeId(id);
      if (!recipeSupplies2 || recipeSupplies2.length === 0) {
        return res.status(404).json({ message: "Recipe supply not found" });
      }
      const result = await storage.removeSupplyFromRecipe(id);
      if (result) {
        await storage.createActivityLog({
          userId: req.user.id,
          actionType: "RECIPE_SUPPLY_REMOVED",
          description: `Removed supply from recipe`
        });
      }
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove supply from recipe" });
    }
  });
  app2.get("/api/staff", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });
  app2.get("/api/staff/active", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const users2 = await storage.getAllUsers();
      const activeStaff = users2.filter((user) => user.isActive);
      res.json(activeStaff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active staff" });
    }
  });
  app2.get("/api/staff/archived", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const users2 = await storage.getAllUsers();
      const archivedStaff = users2.filter((user) => !user.isActive);
      res.json(archivedStaff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch archived staff" });
    }
  });
  app2.put("/api/staff/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserSchema.partial().pick({
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true
      }).parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "STAFF_UPDATED",
        description: `Updated staff member: ${user.username}`
      });
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update staff member" });
    }
  });
  app2.put("/api/staff/:id/archive", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const user = await storage.archiveUser(id);
      if (!user) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "STAFF_ARCHIVED",
        description: `Archived staff member: ${user.username}`
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to archive staff member" });
    }
  });
  app2.get("/api/activity-logs/recent", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const limit = parseInt(req.query.limit || "10");
      const logs = await storage.getRecentActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const userSchema = insertUserSchema.extend({
        fullName: z.string().min(1),
        email: z.string().email(),
        position: z.string().min(1),
        phone: z.string().optional(),
        joinDate: z.string().optional(),
        isActive: z.boolean().optional().default(true)
      });
      const validatedData = userSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "USER_CREATED",
        description: `Created staff record: ${validatedData.username}`
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const userSchema = insertUserSchema.extend({
        fullName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        position: z.string().min(1).optional(),
        phone: z.string().optional(),
        joinDate: z.string().optional(),
        isActive: z.boolean().optional()
      }).partial();
      const validatedData = userSchema.parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "USER_UPDATED",
        description: `Updated staff record: ${user.username}`
      });
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.put("/api/users/:id/archive", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const user = await storage.archiveUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "USER_ARCHIVED",
        description: `Archived staff record: ${user.username}`
      });
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to archive user" });
    }
  });
  app2.put("/api/users/:id/restore", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, { isActive: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createActivityLog({
        userId: req.user.id,
        actionType: "USER_RESTORED",
        description: `Restored staff record: ${user.username}`
      });
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to restore user" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  server: {
    host: "0.0.0.0",
    port: 5e3,
    cors: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
