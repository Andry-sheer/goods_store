import mongoose from "mongoose";

const basicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "title must have min 3 charts"],
    maxlength: [50, "title must have max 50 charts"],
    lowercase: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "brand must have min 2 charts"],
    maxlength: [50, "brand must have max 50 charts"],
    lowercase: true
  },
  model: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "model must have min 1 chart"],
    maxlength: [50, "model must have max 50 charts"],
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Category',
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, "description must have max 5000 charts"],
    default: "No description"
  },
  releaseDate: {
    type: Date
  },
  releaseYear: {
    type: Number,
    min: [2000, "Min release year: 2000"],
    max: [2077, "Max release year: 2077"]
  },
  country: {
    type: String,
    uppercase: true,
    minlength: 2,
    maxlength: 10
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'mg'],
      default: 'g'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['mm', 'cm', 'm', 'in'],
      default: 'mm'
    }
  },
  materials: [{
    type: String,
    lowercase: true,
    enum: [
      'aluminum', 'stainless-steel', 'titanium', 'plastic',
      'glass', 'ceramic', 'leather', 'silicone', 'carbon-fiber'
    ]
  }],
  protection: {
    waterResistant: {
      type: Boolean,
      default: false
    },
    waterResistantRating: String,
    dustResistant: Boolean,
    shockproof: Boolean
  },
  boxContents: [{
    item: String,
    quantity: {
      type: Number,
      min: 1,
      default: 1
    }
  }],
  warranty: {
    months: {
      type: Number,
      min: 0,
      max: 120
    },
    type: {
      type: String,
      enum: ['manufacturer', 'seller', 'none'],
      default: 'manufacturer'
    }
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    lowercase: true,
    enum: ['active', 'discontinued', 'upcoming', 'hidden'],
    default: 'active'
  }
}, { 
  _id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


basicSchema.virtual('fullName').get(function() {
  return `${this.brand} ${this.model}`.toLowerCase();
});

basicSchema.virtual('hasProtection').get(function() {
  return this.protection?.waterResistant || 
          this.protection?.dustResistant || 
          this.protection?.shockproof;
});


basicSchema.pre('validate', function(next) {
  if (this.releaseDate && !this.releaseYear) {
    this.releaseYear = this.releaseDate.getFullYear();
  }
  
  if (this.protection?.waterResistantRating) {
    const ipPattern = /^IP[0-9]{2}$/;
    if (!ipPattern.test(this.protection.waterResistantRating)) {
      return next(new Error('Water resistant rating must be like IP67, IP68'));
    }
  }
  
  next();
});

export default basicSchema;