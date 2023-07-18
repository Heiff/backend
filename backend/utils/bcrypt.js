const bcrypt = require('bcrypt');

const passHash = async(password) =>{
    return await bcrypt.hash(password,10)
}

const passCompare = async(password,hashPass) =>{
    return await bcrypt.compare(password,hashPass)
}

module.exports = {
    passHash,
    passCompare
}