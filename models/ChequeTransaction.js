const mongoose = require('mongoose');

const ChequeTransactionSchema = new mongoose.Schema({
    inputList:{ type: Array },
    totalDebit:{ type: Number },
    totalCredit:{ type: Number },
    memo:{type: String},
    journalDate: {type: Date},
    journalNo: {type: String, unique: true},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    path:{type: String},
    type:{type: String, default:'JV'},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("ChequeTransaction", ChequeTransactionSchema);