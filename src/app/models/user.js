const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        email:String,
        password:String,
        id:String,
        token:String
    }
});

//lo codifica
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);    
};

//para comparar la contraseña que nos esta dando el usuario, con la contraseña de la db
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password)
    
}

module.exports = mongoose.model('User', userSchema);
