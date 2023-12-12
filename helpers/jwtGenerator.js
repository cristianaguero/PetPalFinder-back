const jwt = require("jsonwebtoken");

function jwtGenerator(userID) {

    return jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "5d"
    })
};

module.exports = jwtGenerator;