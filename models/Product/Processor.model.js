import mongoose from "mongoose";

const processorSchema = new mongoose.Schema({
  brand : {
    type : String,
    required : true,
    lowercase : true,
    enum : [
      'qualcomm', 'samsung', 'mediatek', 'apple', 'google', 'huawei',
      'intel', 'amd',
      'sony', 'microsoft', 'nvidia',
      'rockchip', 'allwinner', 'amlogic', 'unknown'
    ]
  },
  model : {
    type : String,
    lowercase : true,
    trim : true,
    required : true
  },
  deviceType : {
    type : String,
    required : true,
    lowercase : true,
    enum : [
      'mobile', 'laptop', 'desktop', 'console', 'tablet', 'other'
    ]
  },
  architecture : {
    type : String,
    required : true,
    lowercase : true,
    enum : [
      'arm', 'x86', 'x86_64', 'risc-v', 'powerpc', 'other'
    ]
  },
  cores : {
    type : Number,
    min : [1, 'Min cores: 1'],
    max : [128, 'Max cores: 128'],
    required : true
  },
  threads : {
    type : Number,
    min : [1, 'Min thread: 1'],
    max : [256, 'Max threads: 256'],
  },
  frequency : {
    type : mongoose.Schema.Types.Mixed,
    required : true
  },
  cache : {
    l1 : String,
    l2 : String,
    l3 : String,
    lowercase : true,
    trim : true,
    get : levelCache => levelCache.toUpperCase() 
  },
  integratedGraphics : {
    model : {
      type : String,
      lowercase : true,
      minlength : [0, "Min length of graphics-model: 0 charts"],
      maxlength : [50, "Max length of graphics-model: 50 charts"]
    },
    brand : {
      type : String,
      lowercase : true,
      enum : [
        'amd', 'apple', 'nvidia', 'intel', 'qualcomm', 'other'
      ]
    },
    architecture : {
      type : String,
      lowercase : true,
      enum : [
        'rdna', 'cuda', 'apple-silicon', 'xe-lpg', 'qualcomm-adreno', 'other'
      ]
    },
    cores : {
      type : Number,
      min : [1, "Min number of graphics-cores: 1"],
      max : [80, "Max number of graphics-cores: 80"]
    }
  },
  lithography : {
    techProcess : {
      type : String,
      lowercase : true,
      trim : true,
      minlength : [0, "Min length of tech-process: 0 charts"],
      maxlength : [10, "Max length of tech-process: 10 charts"]
    },
    brand : {
      type : String,
      trim : true,
      lowercase : true,
      enum : ['tsmc', 'samsung', 'intel', 'umc', 'globalfoundries', 'other']
    }
  },
  socket : {
    type : String,
    trim : true,
    lowercase : true,
    enum : {
      values : [
        'am1', 'am2', 'am2+', 'am3', 'am3+', 'am4', 'am5',
        'fm1', 'fm2', 'fm2+', 'tr4', 'strx4', 'swrx8', 'str5', 'sp5',
        'socket370', 'socket423', 'socket478', 'lga775', 'lga1155',
        'lga1156', 'lga1366', 'lga1200', 'lga1150', 'lga1151',
        'lga1567', 'lga2011', 'lga3647', 'lga1851', 'lga1700', 'lga2066',
        'bga', 'bga1090', 'bga1168', 'bga1234', 'bga1377', 'bga1440',
        'bga1526', 'bga1824', 'bga2048', 'bga2272'
      ],
      message : '{VALUE} is not valid socket type!'
    }
  },
  tdp : {
    type : Number,
    min : [1, "Min TDP 1"],
    max : [600, "Max TDP 600"]
  },
  ai : {
    hasNPU : {
      type : Boolean,
      default : false
    },
    npuModel : {
      type : String,
      lowercase : true,
      trim : true,
      minlength : [0, "Min length of npu-model: 0 charts"],
      maxlength : [50, "Min length of npu-model: 50 charts"]
    },
    performance : {
      type : String,
      lowercase : true,
      trim : true,
      minlength : [0, "Min length of npu-performance: 0 charts"],
      maxlength : [20, "Min length of npu-performance: 20 charts"],
      get : perform => perform.toUpperCase()
    }
  },
  releaseYear : {
    type : Number,
    min : [2000, 'Min release year: 2000'],
    max : [2077, 'Max release year: 2077']
  },
  features : [{
    type : String,
    lowercase : true,
    trim : true,
    minlength : [0, "Min length of features: 0 charts"],
    maxlength : [100, "Min length of features: 100 charts"],
  }]
}, {
  _id : false,
  toJSON : { virtuals : true, getters : true },
  toObject : { virtuals : true, getters : true }
});

processorSchema.virtual('fullname').get(function(){
  return `${this.brand} ${this.model}`.toLowerCase();
});

processorSchema.pre('validate', function(next){
  if ((this.deviceType === 'laptop' || this.deviceType === 'desktop') && !this.tdp) {
    return next(new Error('Desktop/laptop processors must have TDP'));
  }

  next();
});


export default processorSchema;