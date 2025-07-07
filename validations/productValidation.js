// const {checkSchema } = require("express-validator");


// exports.productSchema = [
//     checkSchema({
//         name: {
//             trim: true,
//             notEmpty: {
//                 errorMessage: "Name should not be empty",
//             },
//             isLength: {
//                 options: { min: 3 },
//                 errorMessage: "Name should be a minimum of 3 characters",
//             },
//             matches: {
//                 options: [/^[a-zA-Z0-9]+$/],
//                 errorMessage: "Name should contain alphabets,numbers and spaces only",
//             },
//         },
//         brand: {
//             trim: true,
//             notEmpty: {
//                 errorMessage: "brand should not be empty",
//             },
//             isLength: {
//                 options: { min: 3 },
//                 errorMessage: "brand should be a minimum of 3 characters",
//             },
//             matches: {
//                 options: [/^[a-zA-Z0-9 ]+$/],
//                 errorMessage: "brand should contain alphabets,numbers and spaces only",
//             },
//         },
//         description: {
//             trim: true,
//             notEmpty: {
//                 errorMessage: "description should not be empty",
//             },
//             isLength: {
//                 options: { min: 20 },
//                 errorMessage: "description should be a minimum of 3 characters",
//             },
//             matches: {
//                 options: [/^[a-zA-Z0-9]+$/],
//                 errorMessage: "description should contain alphabets,numbers and spaces only",
//             },
//         },
//         price: {
//             trim: true,
//             notEmpty: {
//                 errorMessage: "price should not be empty",
//             },
//             isLength: {
//                 options: { min: 3 },
//                 errorMessage: "price should be a minimum of 3 characters",
//             },
//             matches: {
//                 options: [/^[0-9]+$/],
//                 errorMessage: "price should contain numbers only",
//             },
//         },
//         discount: {
//             trim: true,
//             notEmpty: {
//                 errorMessage: "discount should not be empty",
//             },
//             isLength: {
//                 options: { min: 3 },
//                 errorMessage: "discount should be a minimum of 3 characters",
//             },
//             matches: {
//                 options: [/^[0-9]+$/],
//                 errorMessage: "discount should contain numbers only",
//             },
//         },
//         category: {
//             trim: true,
//             notEmpty: {
//               errorMessage: "Category should not be empty",
//             },
//             isIn: {
//               options: [["running shoes", "sneakers", "casual shoes", "formals"]],
//               errorMessage:
//                 "Category must be one of: running shoes, sneakers, casual shoes, formals",
//             },
//           },
//     }),
// ];

const { checkSchema } = require("express-validator");

exports.productSchema = [
    checkSchema({
        name: {
            trim: true,
            notEmpty: { errorMessage: "Name should not be empty" },
            isLength: {
                options: { min: 3 },
                errorMessage: "Name should be a minimum of 3 characters",
            },
            matches: {
                options: [/^[a-zA-Z0-9 ]+$/],
                errorMessage: "Name should contain alphabets, numbers and spaces only",
            },
        },
        brand: {
            trim: true,
            notEmpty: { errorMessage: "Brand should not be empty" },
            isLength: {
                options: { min: 3 },
                errorMessage: "Brand should be a minimum of 3 characters",
            },
            matches: {
                options: [/^[a-zA-Z0-9 ]+$/],
                errorMessage: "Brand should contain alphabets, numbers and spaces only",
            },
        },
        description: {
            trim: true,
            notEmpty: { errorMessage: "Description should not be empty" },
            isLength: {
                options: { min: 20 },
                errorMessage: "Description should be a minimum of 20 characters",
            },
            matches: {
                options: [/^[a-zA-Z0-9 ,.]+$/],
                errorMessage:
                    "Description should contain alphabets, numbers, commas, periods and spaces only",
            },
        },
        price: {
            notEmpty: { errorMessage: "Price should not be empty" },
            isFloat: {
                options: { min: 0 },
                errorMessage: "Price must be a valid number greater than or equal to 0",
            },
            toFloat: true,
        },
        discount: {
            notEmpty: { errorMessage: "Discount should not be empty" },
            isFloat: {
                options: { min: 0, max: 100 },
                errorMessage: "Discount must be a number between 0 and 100",
            },
            toFloat: true,
        },
        category: {
            notEmpty: { errorMessage: "Category should not be empty" },
            isIn: {
                options: [["running shoes", "sneakers", "casual shoes", "formals"]],
                errorMessage:
                    "Category must be one of: running shoes, sneakers, casual shoes, formals",
            },
        },
        stock: {
            isArray: {
                errorMessage: "Stock must be an array of objects",
            },
            custom: {
                options: (value) => Array.isArray(value) && value.length > 0,
                errorMessage: "Stock must contain at least one item",
            },
        },
        "stock.*.size": {
            isInt: { errorMessage: "Each stock size must be an integer" },
            toInt: true,
        },
        "stock.*.quantity": {
            isInt: { errorMessage: "Each stock quantity must be an integer" },
            toInt: true,
        },
        colorOptions: {
            isArray: { errorMessage: "Color options must be an array of color names" },
            custom: {
                options: (value) => Array.isArray(value) && value.length > 0,
                errorMessage: "Colors must contain at least one item",
            },
        },
        "colorOptions.*": {
            isString: { errorMessage: "Each color must be a string" },
            trim: true,
            notEmpty: { errorMessage: "Color name cannot be empty" },
        },
        // "colorOptions.*.color": {
        //   notEmpty: { errorMessage: "Color is required for each color option" },
        //   isString: { errorMessage: "Color must be a string" },
        // },
        rating: {
            optional: true,
            isFloat: {
                options: { min: 0, max: 5 },
                errorMessage: "Rating must be between 0 and 5",
            },
        },
        isFeatured: {
            optional: true,
            isBoolean: { errorMessage: "isFeatured must be true or false" },
        },
        images: {
            isArray: { errorMessage: "Images must be an array" },
        },
        "images.*": {
            isString: { errorMessage: "Each image must be a string" },
        },
        createdAt: {
            optional: true,
            isISO8601: { errorMessage: "createdAt must be a valid ISO date" },
        },
        updatedAt: {
            optional: true,
            isISO8601: { errorMessage: "updatedAt must be a valid ISO date" },
        },
    }),
];
