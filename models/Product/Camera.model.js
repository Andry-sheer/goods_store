import mongoose from "mongoose";
import cameraFrontSchema from "./Camera.front.model.js";
import cameraBackSchema from "./Camera.back.model.js";

const cameraSchema = new mongoose.Schema({
  front: [cameraFrontSchema],
  back: [cameraBackSchema]
}, {
  _id: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});


cameraSchema.virtual('totalCameras').get(function() {
  return (this.back?.length || 0) + (this.front?.length || 0);
});

cameraSchema.virtual('hasFlash').get(function() {
  return this.back?.some(cam => cam.flash) || false;
});


cameraSchema.pre('validate', function(next) {
  if (!this.back || this.back.length === 0) {
    return next(new Error('Camera must have at least one back module'));
  }
  next();
});

export default cameraSchema;