import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST a product (for admin/testing)
router.post("/", async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
