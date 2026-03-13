import mongoose from "mongoose";

const connectivitySchema = new mongoose.Schema({
  network: [{
    type: String,
    lowercase: true,
    enum: [
      '2g', '3g', '4g', '5g', '5g+', '5g-advanced',
      'lte', 'lte-a', 'lte+', 'nr', 'mmwave', 'sub6'
    ]
  }],
  sim: {
    type: {
      type: String,
      lowercase: true,
      enum: ['standard', 'nano-sim', 'micro-sim', 'mini-sim', 'esim', 'dual-esim']
    },
    count: {
      type: Number,
      min: 1,
      max: 3,
      default: 1
    },
    dualSim: {
      type: Boolean,
      default: false
    },
    tripleSim : {
      type : Boolean,
      default : false
    },
    dualStandby: {
      type: Boolean,
      default: false
    }
  },
  wireless: {
    wifi: {
      version : {
        type: String,
        lowercase: true,
        enum: [
          'wifi-4', 'wifi-5', 'wifi-6', 'wifi-6e', 'wifi-7',
          '802.11a', '802.11b', '802.11g', '802.11n', '802.11ac', '802.11ax'
        ],
      },
      brand : {
        type: String,
        lowercase: true,
        enum: ['qualcomm', 'mediatek', 'apple', 'intel', 'unknown', 'other']
      }
    },
    bluetooth: {
      version: {
        type: String,
        enum: ['4.0', '4.1', '4.2', '5.0', '5.1', '5.2', '5.3', '5.4']
      },
      codecs: [{
        type: String,
        lowercase: true,
        enum: ['sbc', 'aac', 'aptx', 'aptx-hd', 'ldac', 'lc3']
      }],
      brand : {
        type: String,
        lowercase: true,
        enum: ['qualcomm', 'mediatek', 'apple', 'intel', 'unknown', 'other']
      }
    },
    nfc: {
      type: Boolean,
      default: false
    },
    irBlaster: {
      type: Boolean,
      default: false
    },
    ultrawideband: {
      type: Boolean,
      default: false
    }
  },
  navigation: [{
    type: String,
    lowercase: true,
    enum: [
      'gps', 'glonass', 'galileo', 'beidou', 'qzss', 'navic'
    ]
  }],
  ports: [{
    type: {
      type: String,
      lowercase: true,
      enum: [
        'usb-c', 'usb-2.0', 'usb-3.0', 'usb-3.1', 'usb-3.2', 'usb-4',
        'lightning', 'micro-usb', 'mini-usb',
        'hdmi', 'displayport', 'thunderbolt-3', 'thunderbolt-4',
        '3.5mm-audio', 'ethernet', 'sd-card', 'card-reader'
      ]
    },
    count: {
      type: Number,
      min: 0,
      default: 1
    }
  }],
  features: [{
    type: String,
    lowercase: true,
    enum: [
      'wifi-calling', 'volte', 'vowifi', 'dual-band-gps',
      'ai-network', 'smart-antenna', 'mimo', 'carrier-aggregation'
    ]
  }]
}, {
  _id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


connectivitySchema.virtual('has5g').get(function() {
  return this.network?.some(net => net.includes('5g'));
});

connectivitySchema.virtual('hasNfc').get(function() {
  return this.wireless?.nfc || false;
});

connectivitySchema.virtual('hasJack').get(function() {
  return this.ports?.some(jack => jack.type === '3.5mm-audio');
});

connectivitySchema.virtual('simDescription').get(function() {
  if (!this.sim) return 'No SIM';
  const type = this.sim.type || 'nano-sim';
  const count = this.sim.count || 1;
  return `${count}x ${type}${this.sim.dualSim ? ' (Dual SIM)' : ''}`;
});

export default connectivitySchema;