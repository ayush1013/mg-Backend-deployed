const express = require("express");
const productsRoute = express.Router();
const ProductsModel = require("../Models/ProductsModel");

productsRoute.get("/", async (req, res) => {
  const text = req.query.text;
  const { limit = 20, page = 1, sort, order, category, id } = req.query;

  if (id) {
    try {
      const product = await ProductsModel.findById(id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      return res.send(product);
    } catch (err) {
      return res.status(500).send("Internal Server Error");
    }
  }

  try {
    let query = {};
    if (text) {
      query.title = { $regex: text, $options: "i" };
    }
    if (category) {
      //   query.category = { $regex: category, $options: "i" };
      const categories = Array.isArray(category) ? category : [category];
      query.category = { $in: categories };
    }

    let productsQuery = ProductsModel.find(query);

    // Sorting based on price
    if (sort === "price") {
      let sortOption = {};
      sortOption.price = order === "desc" ? -1 : 1;
      productsQuery.sort(sortOption);
    } else if (sort === "title") {
      let sortOption = {};
      sortOption.title = order === "desc" ? -1 : 1;
      productsQuery.sort(sortOption);
    }

    // Count total number of products matching the query
    const totalCount = await ProductsModel.countDocuments(query);

    // Pagination
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = parseInt(page);
    productsQuery.limit(limit).skip(limit * (currentPage - 1));

    let products = await productsQuery.exec();

    res.send({
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: currentPage,
      items: products,
    });
  } catch (err) {
    res.send(err.message);
  }
});

productsRoute.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await ProductsModel.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    return res.send(product);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = productsRoute;
