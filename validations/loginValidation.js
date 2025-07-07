const { checkSchema } = require("express-validator");
const getDB = require("../utilities/db").getDB;

exports.loginSchema = [
    checkSchema({
        email: {
            trim: true,
            isEmail: {
                errorMessage: "Please enter a valid email ID",
            },
        },
        password: {
            trim: true,
            isLength: {
                options: { min: 5, max: 15 },
                errorMessage: "Password should be between 5 and 15 characters",
            },
            errorMessage: "Please enter a valid password",
        },

    }),
];
