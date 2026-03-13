import mongoose from "mongoose";

const cameraFrontSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
    enum: [
      'front', 'main-front', 'ultrawide-front', 'tof-3d', 'infrared',
      'under-display', 'pop-up', 'dual-front', 'punch-hole'
    ]
  },
  megapixels: {
    type: Number,
    required: true,
    min: [1, 'Min megapixels: 1'],
    max: [100, 'Max megapixels: 100']
  },
  aperture: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^f\/\d+(\.\d+)?$/.test(v);
      },
      message: 'Aperture must be in format "f/2.2"'
    }
  },
  sensorSize: {
    type: String,
    trim: true,
    lowercase: true
  },
  pixelSize: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\d+(\.\d+)?[μu]m$/.test(v);
      },
      message: 'Pixel size must be in format "1.4μm"'
    }
  },
  focalLength: {
    type: String,
    trim: true,
    lowercase: true
  },
  fieldOfView: {
    type: Number,
    min: [50, 'Min field of view: 50°'],
    max: [120, 'Max field of view: 120°']
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  autofocusType: {
    type: String,
    lowercase: true,
    enum: ['pdaf', 'dual-pixel', 'contrast', 'laser', 'none'],
    default: 'none'
  },
  stabilization: {
    type: String,
    lowercase: true,
    enum: ['eis', 'gyro-eis', 'ois', 'none'],
    default: 'none'
  },
  hdr: {
    type: Boolean,
    default: false
  },
  nightMode: {
    type: Boolean,
    default: false
  },
  portraitMode: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String,
    lowercase: true,
    enum: [
      'autofocus', 'fixed-focus', 'hdr', 'night-mode', 'portrait-mode',
      'face-detection', 'smile-detection', 'beauty-mode', 'filters',
      'flash-screen', 'retina-flash', 'wide-selfie', 'group-selfie',
      'gesture-control', 'voice-control', 'time-lapse', 'slow-motion',
      '4k-video', '1080p-video', '720p-video', 'stabilization'
    ]
  }],
  video: [{
    type: String,
    lowercase: true,
    enum: [
      '8k-24fps', '8k-30fps', '4k-30fps', '4k-60fps',
      '1080p-30fps', '1080p-60fps', '1080p-120fps', '1080p-240fps',
      '720p-30fps', '720p-60fps', '720p-120fps', '720p-240fps',
      'hdr-video', 'slow-motion', 'time-lapse', 'cinematic-mode'
    ]
  }],
  location: {
    type: String,
    lowercase: true,
    enum: ['center', 'left', 'right', 'under-display', 'pop-up'],
    default: 'center'
  },
  lensCount: {
    type: Number,
    min: 1,
    max: 8
  },
  certifications: [{
    type: String,
    lowercase: true,
    enum: ['tuv-rheinland', 'sgs', 'dolby-vision', 'hdr10+']
  }]

}, {
  _id: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});


cameraFrontSchema.virtual('shortDescription').get(function() {
  let short_description = `${this.megapixels}MP`;
  if (this.type !== 'front') short_description += ` ${this.type}`;
  short_description += ` f/${this.aperture}`;
  return short_description;
});


cameraFrontSchema.virtual('fullDescription').get(function() {
  const parts = [`${this.megapixels}MP`];
  
  if (this.type !== 'front') parts.push(this.type);
  parts.push(`f/${this.aperture}`);
  
  if (this.fieldOfView) parts.push(`${this.fieldOfView}°`);
  if (this.autofocus) parts.push('AF');
  if (this.stabilization !== 'none') parts.push(this.stabilization.toUpperCase());
  if (this.hdr) parts.push('HDR');
  if (this.nightMode) parts.push('Night');
  
  return parts.join(' · ');
});

cameraFrontSchema.virtual('hasAutofocus').get(function() {
  return this.autofocus || this.autofocusType !== 'none';
});

cameraFrontSchema.virtual('maxVideoResolution').get(function() {
  if (!this.video || this.video.length === 0) return null;
  
  const resolutions = ['8k', '4k', '1080p', '720p'];
  for (const res of resolutions) {
    if (this.video.some(v => v.includes(res))) return res;
  }
  return null;
});


cameraFrontSchema.pre('validate', function(next) {
  if (this.autofocus && this.autofocusType === 'none') {
    this.autofocusType = 'contrast';
  }
  
  if (!this.autofocus && this.autofocusType !== 'none') {
    this.autofocus = true;
  }
  
  if (this.stabilization !== 'none' && !this.features.includes(this.stabilization)) {
    this.features.push(this.stabilization);
  }
  
  next();
});

export default cameraFrontSchema;