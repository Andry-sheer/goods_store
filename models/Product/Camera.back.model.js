import mongoose from "mongoose";

const cameraBackSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
    enum: [
      'wide', 'ultrawide', 'telephoto', 'periscope-telephoto', 
      'macro', 'depth', 'tof-3d', 'infrared', 'monochrome',
      'night-vision', 'thermal', 'main', 'standard'
    ]
  },
  megapixels: {
    type: Number,
    required: true,
    min: [1, 'Min megapixels: 1'],
    max: [300, 'Max megapixels: 300']
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
      message: 'Aperture must be in format "f/1.4"'
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
  focalLength35mm: {
    type: String,
    trim: true,
    lowercase: true
  },
  fieldOfView: {
    type: Number,
    min: [50, 'Min field of view: 50°'],
    max: [180, 'Max field of view: 180°']
  },
  opticalZoom: {
    type: Number,
    min: [1, 'Min optical zoom: 1x'],
    max: [20, 'Max optical zoom: 20x'],
    default: 1
  },
  autofocus: {
    type: Boolean,
    default: true
  },
  autofocusType: {
    type: String,
    lowercase: true,
    enum: ['pdaf', 'dual-pixel', 'laser', 'contrast', 'phase-detect', 'none'],
    default: 'pdaf'
  },
  stabilization: {
    type: String,
    lowercase: true,
    enum: ['ois', 'eis', 'dual-ois', 'ois-eis', 'sensor-shift', 'none'],
    default: 'none'
  },
  hdr: {
    type: Boolean,
    default: true
  },
  nightMode: {
    type: Boolean,
    default: true
  },
  portraitMode: {
    type: Boolean,
    default: true
  },
  macroMode: {
    type: Boolean,
    default: false
  },
  flash: {
    type: Boolean,
    default: false
  },
  flashType: {
    type: String,
    lowercase: true,
    enum: ['led', 'dual-led', 'xenon', 'ring', 'none'],
    default: 'none'
  },
  features: [{
    type: String,
    lowercase: true,
    enum: [
      'ois', 'eis', 'pdaf', 'dual-pixel', 'laser-autofocus',
      'night-mode', 'portrait-mode', 'macro-mode', 'pro-mode',
      'raw-support', 'hdr', 'auto-hdr', 'ai-enhancement',
      'scene-detection', 'face-detection', 'smile-detection',
      'beauty-mode', 'filters', 'watermark', 'time-lapse',
      'slow-motion', 'hyperlapse', 'astro-mode', 'moon-mode',
      'document-mode', 'food-mode', 'panorama', 'ultrawide',
      'telephoto', 'macro', 'depth', 'bokeh', 'night-vision'
    ]
  }],
  video: [{
    type: String,
    lowercase: true,
    enum: [
      '8k-24fps', '8k-30fps', '8k-60fps',
      '6k-30fps', '6k-60fps',
      '5k-30fps', '5k-60fps',
      '4k-30fps', '4k-60fps', '4k-120fps',
      '1080p-30fps', '1080p-60fps', '1080p-120fps', '1080p-240fps',
      '720p-30fps', '720p-60fps', '720p-120fps', '720p-240fps', '720p-960fps',
      'hdr-video', 'dolby-vision', 'log-video', 'raw-video',
      'slow-motion', 'time-lapse', 'cinematic-mode', 'action-mode'
    ]
  }],
  sensorBrand: {
    type: String,
    lowercase: true,
    enum: ['sony', 'samsung', 'omnivision', 'canon', 'nikon', 'other']
  },
  sensorModel: {
    type: String,
    trim: true,
    lowercase: true
  },
  lensCount: {
    type: Number,
    min: 1,
    max: 12
  },
  filterDiameter: {
    type: String,
    trim: true,
    lowercase: true
  },
  minFocusDistance: {
    type: String,
    trim: true,
    lowercase: true
  },
  certifications: [{
    type: String,
    lowercase: true,
    enum: ['tuv-rheinland', 'sgs', 'dolby-vision', 'hdr10+', 'imax-enhanced']
  }]
}, {
  _id: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});


cameraBackSchema.virtual('shortDescription').get(function() {
  let short_description = `${this.megapixels}MP`;
  if (this.type !== 'wide' && this.type !== 'main') short_description += ` ${this.type}`;
  short_description += ` f/${this.aperture}`;
  if (this.opticalZoom > 1) short_description += ` ${this.opticalZoom}x`;
  return short_description;
});


cameraBackSchema.virtual('fullDescription').get(function() {
  const parts = [`${this.megapixels}MP`];
  
  if (this.type !== 'wide' && this.type !== 'main') parts.push(this.type);
  parts.push(`f/${this.aperture}`);
  
  if (this.opticalZoom > 1) parts.push(`${this.opticalZoom}x`);
  if (this.fieldOfView) parts.push(`${this.fieldOfView}°`);
  if (this.stabilization !== 'none') parts.push(this.stabilization.toUpperCase());
  if (this.hdr) parts.push('HDR');
  if (this.nightMode) parts.push('Night');
  
  return parts.join(' · ');
});

cameraBackSchema.virtual('maxOpticalZoom').get(function() {
  return this.opticalZoom || 1;
});

cameraBackSchema.virtual('hasAutofocus').get(function() {
  return this.autofocus || this.autofocusType !== 'none';
});

cameraBackSchema.virtual('maxVideoResolution').get(function() {
  if (!this.video || this.video.length === 0) return null;
  
  const resolutions = ['8k', '6k', '5k', '4k', '1080p', '720p'];
  for (const res of resolutions) {
    if (this.video.some(v => v.includes(res))) return res;
  }
  return null;
});

cameraBackSchema.virtual('maxFps').get(function() {
  if (!this.video || this.video.length === 0) return null;
  
  let maxFps = 0;
  this.video.forEach(v => {
    const match = v.match(/(\d+)fps/);
    if (match) {
      const fps = parseInt(match[1]);
      if (fps > maxFps) maxFps = fps;
    }
  });
  return maxFps || null;
});


cameraBackSchema.pre('validate', function(next) {
  if (this.autofocus && this.autofocusType === 'none') {
    this.autofocusType = 'pdaf';
  }
  
  if (!this.autofocus && this.autofocusType !== 'none') {
    this.autofocus = true;
  }
  
  if (this.flash && this.flashType === 'none') {
    this.flashType = 'led';
  }
  
  if (!this.flash && this.flashType !== 'none') {
    this.flash = true;
  }
  
  if (this.stabilization !== 'none' && !this.features.includes(this.stabilization)) {
    this.features.push(this.stabilization);
  }
  
  if (this.opticalZoom > 1 && !this.features.includes('telephoto')) {
    this.features.push('telephoto');
  }
  
  next();
});

export default cameraBackSchema;