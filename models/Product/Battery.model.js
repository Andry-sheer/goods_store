import mongoose from "mongoose";

const batterySchema = new mongoose.Schema({
  deviceType: {
    type: String,
    lowercase: true,
    enum: [
      'mobile', 'tablet', 'laptop', 'notebook',
      'watch', 'headphones', 'powerbank', 'accumulator'
    ]
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, 'Min capacity: 1']
  },
  capacityUnit: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['mah', 'ah', 'wh', 'kwh'],
    default: 'mah'
  },
  type: {
    type: String,
    required: true,
    lowercase: true,
    enum: [
      'li-ion', 'li-po', 'nimh', 'nicd', 'lead-acid',
      'lifepo4', 'solid-state', 'alkaline', 'other'
    ]
  },
  voltage: {
    type: Number,
    min: [0.1, 'Min voltage: 0.1V'],
    max: [1000, 'Max voltage: 1000V']
  },
  voltageUnit: {
    type: String,
    lowercase: true,
    enum: ['v', 'mv'],
    default: 'v'
  },
  charging: {
    maxSpeed: { type: Number, min: 0 },
    fastCharging: { type: Boolean, default: false },
    wirelessCharging: { type: Boolean, default: false },
    wirelessChargingSpeed: { type: Number, min: 0, max: 100 }
  },
  removable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    lowercase: true,
    enum: [
      'fast-charge', 'wireless-charge', 'reverse-charge',
      'temperature-control', 'overcharge-protection',
      'waterproof', 'shockproof', 'memory-effect-free'
    ]
  }]
}, {
  _id: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});



batterySchema.virtual('displayCapacity').get(function() {
  const mobileDevices = ['mobile', 'tablet', 'watch', 'headphones', 'powerbank', 'accumulator'];
  
  if (mobileDevices.includes(this.deviceType)) return `${this.capacity} mAh`;
  if (this.deviceType === 'laptop') return `${this.capacity} Wh`;

  return `${this.capacity} ${this.capacityUnit.toUpperCase()}`;
});

batterySchema.virtual('displayVoltage').get(function() {
  if (!this.voltage) return null;
  return `${this.voltage} ${this.voltageUnit.toUpperCase()}`;
});

batterySchema.virtual('displayChargeSpeed').get(function() {
  if (!this.charging?.maxSpeed) return null;
  return `${this.charging.maxSpeed} W`;
});

batterySchema.virtual('hasFastCharging').get(function() {
  return this.charging?.fastCharging || false;
});

batterySchema.virtual('hasWirelessCharging').get(function() {
  return this.charging?.wirelessCharging || false;
});

batterySchema.virtual('isRemovable').get(function() {
  return this.removable;
});

batterySchema.virtual('shortDescription').get(function() {
  let short_description = this.displayCapacity;
  if (this.type) {
    const shortType = this.type === 'li-po' ? 'Li-Po' : this.type === 'li-ion' ? 'Li-Ion' : this.type.toUpperCase();
    short_description += ` ${shortType}`;
  }
  return short_description;
});

export default batterySchema;