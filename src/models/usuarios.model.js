const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,  
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});


userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    
    // Hasheamos la contraseña solo si fue modificada
    this.password = bcrypt.hashSync(this.password, 10);  
    next();
});


userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

