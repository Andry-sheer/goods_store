import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  current : {
    type : Number,
    required : true,
    min : [0, "Min price 0"],
    max : [1000000, "Max price 1000000"]
  },
  old : {
    type : Number,
    min : 0
  },
  currency : {
    type : String,
    default : "UAH"
  }
}, { 
  _id : false,
  toJSON : { virtuals : true },
  toObject : { virtuals : true }
});

priceSchema.virtual("hasDiscount").get(function() {
  return this.old && this.old > this.current;
});

priceSchema.virtual("discountPercent").get(function() {
  if (!this.old) return 0;
  return Math.round(((this.old - this.current) / this.old) * 100);
}).set(function(percent){
  if (!this.old) this.old = this.current;
  this.current = Math.round(this.old * (1 - percent / 100))
});

priceSchema.virtual("discountAmount").get(function() {
  if (!this.old) return 0;
  return this.old - this.current;
});

export default priceSchema;