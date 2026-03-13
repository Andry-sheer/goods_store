// models/product/Display.model.js
import mongoose from "mongoose";

const displaySchema = new mongoose.Schema({
  deviceType : {
    type : String,
    lowercase : true,
    enum : [
      'mobile', 'tablet', 'laptop', 'desktop', 'watch', 'tv', 'other'
    ]
  },
  size: {
    type: Number,
    required: true,
    get : size => `${size}"`
  },
  type: {
    type: String,
    required: true,
    lowercase: true,
    enum: [
      'dynamic amoled 2x', 'super amoled', 'amoled', 'oled', 'poled', 'retina',
      'lcd', 'ips lcd', 'tft',
      'ips', 'va', 'tn', 'mini-led', 'micro-led', 'qled'
    ]
  },
  resolution: {
    type: String,
    required: true
  },
  ppi: {
    type: Number,
    min: [50, 'Min PPI of display: 50'],
    max: [1000, 'Max PPI of display: 1000']
  },
  refreshRate: {
    type: Number,
    min: [60, 'Min refresh of display: 60'],
    max: [500, 'Max refresh of display: 500'],
    default: 60,
    get : value => `${value} Hz.`
  },
  brightness: {
    typical: Number,
    peak: Number,
    hdr: Boolean
  },
  colorGamut: {
    type: String,
    trim : true,
    lowercase: true
  },
  contrastRatio: {
    type: String,
    trim : true,
    lowercase: true
  },
  hdr: {
    type: [String],
    enum: ['hdr10', 'hdr10+', 'dolby-vision', 'hlg', 'hdr'],
    lowercase: true
  },
  protectionGlass: {
    type: String,
    lowercase: true,
    enum: [
      'gorilla-glass-2', 'gorilla-glass-3', 'gorilla-glass-4', 'gorilla-glass-5',
      'gorilla-glass-victus-2', 'gorilla-glass-armor-2',
      'ceramic-shield', 'sapphire-glass', 'other', 'none', 
    ]
  },
  features: [{
    type: String,
    lowercase: true,
    enum: [
      'always-on', 'pwm-free', 'eye-care', 'pro-scaler',
      'privacy-display', 'stylus-support', 'hdr',
      'amd-free-sync', 'nvidia-g-sync', 'other', 'none',
    ]
  }],
  aspectRatio: {
    type: String,
    trim: true
  },
  stylusSupport: {
    type: Boolean,
    default: false
  },
  backlight: {
    type: String,
    lowercase: true,
    enum: ['led', 'mini-led', 'micro-led', 'ccfl', 'oled', 'lcd', 'other']
  },
  curved: {
    type: Boolean,
    default: false
  },
  viewingAngles: {
    horizontal: Number,
    vertical: Number
  },
  responseTime: {
    type: Number,
    min : 0,
    get : response => `${response}ms`
  },
  certifications: [String]
}, {
  _id: false,
  toJSON: { virtuals: true, getters : true },
  toObject: { virtuals: true, getters : true }
});

displaySchema.virtual('description').get(function() {
  let description = `${this.size} ${this.type.toUpperCase()}`;
  if (this.resolution) description += `, ${this.resolution}`;
  if (this.refreshRate && this.refreshRate > 60) description += `, ${this.refreshRate}`;
  if (this.hdr?.length) description += `, HDR`;
  return description;
});

displaySchema.pre('validate', function(next) {
  if (this.deviceType === 'mobile' && !this.ppi) {
    return next(new Error('Mobile displays should have PPI'));
  }
  next();
});

export default displaySchema;