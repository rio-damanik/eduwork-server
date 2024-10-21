const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");


const store = async (req, res, next) => {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".").pop(); // Get the file extension
      let filename = `${req.file.filename}.${originalExt}`; // Generate new filename
      // console.log(config.rootPath);
      let target_path = path.resolve("./", `public/images/products/${filename}`); // Use template literals

      // Create a read stream from the temporary path
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      // Pipe the read stream to the write stream

      src.pipe(dest);

      src.on("end", async () => {
        try {
          // Create a new product with the uploaded image filename
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          // Remove the file if there's an error
          fs.unlinkSync(target_path);
          return res.status(400).json({
            error: 1,
            message: err.message,
            fields: err.errors,
          });
        }
      });

      src.on("error", (err) => {
        // Handle errors in stream
        fs.unlinkSync(target_path); // Clean up the file if there was an error
        next(err); // Forward the error to the error handler
      });
    } else {
      // If no file is uploaded
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    return res.status(500).json({
      error: 1,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// Read all products
const index = async (req, res, next) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(404).json({
        error: 1,
        message: "No products found",
      });
    }
    return res.json(products);
  } catch (err) {
    return res.status(500).json({
      error: 1,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// Read a single product by ID
const show = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: 1,
        message: "Product not found",
      });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({
      error: 1,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// Update a product
const update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({
        error: 1,
        message: "Product not found",
      });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({
      error: 1,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// Delete a product
const destroy = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: 1,
        message: "Product not found",
      });
    }

    // Optionally, delete the associated image file
    const imagePath = path.resolve("./", `public/images/products/${product.image_url}`);
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete image:", err);
    });

    return res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: 1,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// Export all CRUD operations
module.exports = { store, index, show, update, destroy };
