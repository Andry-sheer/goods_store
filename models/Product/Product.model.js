import mongoose from "mongoose";
import BasicModel from "./Basic.model.js";
import variantSchema from "./Variant.model.js";

const productSchema = new mongoose.Schema({
  basic : {
    type : BasicModel,
    required : true,
  },

  variants : [{
    type : variantSchema,
    required : true,
    validate : {
      validator : function (variants) {
        return variants.length > 0;
      },
      message : 'Product must have at least one variant'
    }
  }],

}, {
  optimisticConcurrency : true,
  timestamps : true
});

productSchema.index({ "basic.brand": 1, "basic.model": 1,});
productSchema.index({ "variants.color": 1 });
productSchema.index({ "variants.memory": 1 });

export default mongoose.model('Product', productSchema);