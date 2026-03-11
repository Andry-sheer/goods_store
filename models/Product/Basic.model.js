import mongoose from "mongoose";

const basicSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true,
    trim : true,
    minlength : [3, "title must have min 3 charts"],
    maxlength : [100, "title must hame max 100 charts"],
    lowercase : true
  },
  brand : {
    type : String,
    required : false,
    trim : true,
    minlength : [3, "brand must have min 3 charts"],
    maxlength : [30, "brand must hame max 30 charts"],
    lowercase : true,
    default : "unknown brand"
  },
  model : {
    type : String,
    required : true,
    trim : true,
    minlength : [3, "model must have min 3 charts"],
    maxlength : [20, "model must hame max 20 charts"],
    lowercase : true
  },
  os : {
    type : String,
    required : false,
    trim : true,
    lowercase : true
  },
  releaseYear : {
    type : Number,
    min : [2000, "Min release year: 2000"],
    max : [2077, "Max release year: 2077"]
  },
  description : {
    type : String,
    required : false,
    trim : true,
    minlength : [0, "description must have min 0 charts"],
    maxlength : [5000, "description must hame max 5000 charts"],
    lowercase : true,
    default : "No description"
  },
}, { _id : false });

export default basicSchema;