import mongoose from "mongoose";
import BasicModel from "./Basic.model.js";
import priceSchema from "./Price.model.js";

const productSchema = new mongoose.Schema({
  basic : {
    type : BasicModel,
    required : true,
  },

  price : {
    type : priceSchema,
    required : true
  },

  color : [{
    type : String,
    required : true,
    trim : true,
    minlength : [3, "color must have min 3 charts"],
    maxlength : [15, "color must hame max 15 charts"],
    lowercase : true
  }]

}, {
  optimisticConcurrency : true,
  timestamps : true
});

productSchema.index({
  "basic.model": 1,
  "variants.color": 1,
  "variants.memory": 1
});

export default mongoose.model('Product', productSchema);