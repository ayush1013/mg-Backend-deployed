const express = require("express");
const adminRoute = express.Router();
const ProductsModel = require("../Models/ProductsModel");
// const UserModel = require("../Models/UserModel");
const AdminMiddleware = require("../Middlewares/AdminMiddleware");

// adminRoute.use(AdminMiddleware);

adminRoute.get("/", async (req, res) => {
  const { find, limit = 20, page = 1 } = req.query;

  try {
    if (find) {
      const products = await ProductsModel.find({
        model: { $regex: find, $options: "i" },
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
      const count = await ProductsModel.countDocuments();
      res.json({
        products,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      const products = await ProductsModel.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
      const count = await ProductsModel.countDocuments();
      res.json({
        products,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

adminRoute.post("/", async (req, res) => {
  const data = req.body;
  try {
    const product = new ProductsModel(data);
    await product.save();
    res.status(200).send("Product added successfully");
  } catch (err) {
    res.status(400).send("Product failed to be added");
    console.log(err);
  }
});

adminRoute.patch("/:id", async(req, res) => {
    const id = req.params.id;
    const payload = req.body;
    try {
        const editProduct = await ProductsModel.findByIdAndUpdate({_id:id},payload);
        res.status(200).send("Product updated successfully");
    } catch (err) {
        res.status(400).send("Product failed to be updated");
        console.log(err);
    }
})

adminRoute.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteProduct = await ProductsModel.findByIdAndDelete({ _id: id });
    res.status(200).send("Product Delete Successfully")
  } catch (err) {
    res.status(400).send("Could not delete product");
    console.log(err);
  }
});

module.exports = adminRoute;
