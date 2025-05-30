const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
    userEmail:{type: String},
    accountCode:{type: Number},
    accountName:{type: String},
    account:{type: String},
    balance: {type: Number},
    asof: {type: Date },
    desc:{type: String},
    subAccount:{type: String},
    isLocked:{type: Boolean, default: false}
    
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Chart", ChartSchema);