const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
     role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    resetToken: String,
    resetTokenExpire:Date,

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    storeName: {
        type: String,
        trim: true,
    },
    storeDescription: {
        type: String,
        trim: true,
    },
    storeLogo: {
  type: String, 
},
storeAddress: {
  type: String,
},
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
})
userSchema.methods.matchPassword = function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);