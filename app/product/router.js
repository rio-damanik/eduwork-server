const router = require("express").Router();
const multer = require("multer");
const os = require("os");

const productController = require("./controller");

// Configure multer for file uploads
const upload = multer({ dest: os.tmpdir() });

// Route to create a new product (store)
router.post("/products", upload.single("image_url"), productController.store);

// Route to get all products
router.get("/products", productController.index);

// Route to update a product by ID
router.put("/products/:id", upload.single("image_url"), productController.update);

// Route to delete a product by ID
router.delete("/products/:id", productController.destroy); // Ensure 'destroy' is the correct method name

module.exports = router;
