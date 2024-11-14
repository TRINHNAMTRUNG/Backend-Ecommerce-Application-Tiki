const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        // Tham số thứ hai là cost factor
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw {
            message: error.message
        }
    }
};

const verifyPassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    hashPassword,
    verifyPassword
}
