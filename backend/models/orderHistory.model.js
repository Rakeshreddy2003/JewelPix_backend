//to store all the user order 

import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'user',  // Reference to the user
  },
  orders: {type:String,require:true},
 

});

const orderHistory = mongoose.model('orderHistory', orderHistorySchema);
export default orderHistory;
