const {checkSchema } = require("express-validator");
const getDB = require("../utilities/db").getDB;

exports.userSignupSchema = [
    checkSchema({
        name: {
            trim: true,
            notEmpty: {
                errorMessage: "Name should not be empty",
            },
            isLength: {
                options: { min: 3 },
                errorMessage: "Name should be a minimum of 3 characters",
            },
            matches: {
                options: [/^[a-zA-Z ]+$/],
                errorMessage: "Name should contain alphabets and spaces only",
            },
        },

        email: {
            trim: true,
            isEmail: {
                errorMessage: "Please enter a valid email ID",
            },
            custom: {
                options: async (value) => {
                    const db = getDB();
                    const user = await db.collection("Users").findOne({ email: value });
                    if (user) {
                        return Promise.reject("Email already exists");
                    }
                },
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

        contact: {
            optional:true,
            trim: true,
            notEmpty: {
                errorMessage: "Contact number is required",
            },
            matches: {
                options: [/^[6-9]\d{9}$/],
                errorMessage: "Contact must be a valid 10-digit mobile number starting with 6-9",
            },
        },

        role: {
            trim: true,
            notEmpty: {
                errorMessage: "Role is required",
            },
            isIn: {
                options: [["user", "admin"]],
                errorMessage: "Role must be either 'user' or 'admin'",
            },
        },

        address: {
            optional: true,
            isArray: {
                errorMessage: "Address must be an array of objects"
            },
            custom: {
                options: (addresses) => {
                    if (!Array.isArray(addresses)) return false;

                    for (const addr of addresses) {
                        if (
                            !addr.line1 ||
                            !addr.city ||
                            !addr.state ||
                            !addr.pincode ||
                            !addr.country
                        ) {
                            throw new Error("Each address must include line1, city, state, pincode, and country");
                        }

                        // Optional: Pincode format check
                        if (!/^\d{5,6}$/.test(addr.pincode)) {
                            throw new Error("Pincode must be a 5 or 6 digit number");
                        }
                    }
                    return true;
                }
            }
        },
        wishlist: {
            optional: true,
            isArray: {
                errorMessage: "Wishlist must be an array",
            },
        },
    }),
];
