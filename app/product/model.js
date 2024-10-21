const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      required: [true, "Nama makanan harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Panjang deskripsi maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("products", productSchema);
