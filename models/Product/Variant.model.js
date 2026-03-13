import mongoose from "mongoose";
import priceSchema from './Price.model.js';
import { ramValidate, formatSize, memoryValidate } from "../../utils/memory.utils.js";
import processorSchema from "./Processor.model.js";
import batterySchema from "./Battery.model.js";
import connectivitySchema from "./Connectivity.model.js";


const variantSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  color: {
    type: String,
    lowercase: true,
    trim: true
  },

  memory: {
    type: Number,
    required : false,
    min: [1, "Min memory 1 MB"],
    max : [67108864, "memory max 64 TB"],
    set : (value) => {
      if (typeof value === 'object' && value.unit) {
        const resultMemory = memoryValidate(value.value, value.unit);
        if (!resultMemory.isValid) throw new Error(resultMemory.message);
        return resultMemory.value;
      }

      throw new Error('Memory must be an object {value, unit}');
    }
  },

  ram : {
    type: Number,
    required : false,
    min: [1, "Min RAM 1 MB"],
    max : [196608, "Max RAM 192 GB"],
    set : (value)=> {
      if (typeof value === "object" && value.unit) {
        const resultRam = ramValidate(value.value, value.unit);
        if (!resultRam.isValid) throw new Error(resultRam.message);
        return resultRam.value;
      }

      throw new Error('Invalid RAM format')
    }
  },

  processor : {
    type : processorSchema,
    required : false
  },

  connectivity : connectivitySchema,

  battery : batterySchema,

  images : [{
    url : {
      type : String,
      required : [true, "Image URL is required"],
      trim : true
    },
    alt : {
      type : String,
      trim : true,
      lowercase : true,
      default : "product image"
    },
    isMain : {
      type : Boolean,
      default : false
    },
    order : {
      type : Number,
      default : 0
    }
  }],

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

}, { 
  _id: false,
  toJSON : {
    transform : (document, formatting) => {
      if (formatting.ram) {
        formatting.ramFormatted = formatSize(formatting.ram);
      }

      if (formatting.memory) {
        formatting.memoryFormatted = formatSize(formatting.memory)
      }

      return formatting;
    }
  }
});

export default variantSchema;