import mongoose from "mongoose";
import priceSchema from './Price.model.js'


const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    lowercase: true,
    trim: true
  },

  memory: {
    type: Number,
    min: [1, "memory min 1 GB"],
    max : [192, "memory max 192 GB"],
    get : value => `${value}GB`
  },

  ram : {
    type: Number,
    min: [1],
    max : [48],
    set : ()=> {},
    get : ()=> {}
  },

  price: {
    type: priceSchema,
    required: true
  },

  stock: {
    type: Number,
    min : [0, "min stock: 0"],
    max : [999, "max stock: 999"],
    default: 0
  }

}, { _id: false });

export default variantSchema;