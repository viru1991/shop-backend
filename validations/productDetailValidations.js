// const { query } = require('express-validator');
// exports.validateProductId = [
//     query ('productId')
//     .notEmpty().withMessage('productId is required')
//     .isMongoId().withMessage('Invalid Id'),
// ];

const { param } = require('express-validator');
exports.validateProductId = [
    param('id')
        .notEmpty().withMessage('productId is required')
        .isMongoId().withMessage('Invalid Id'),
    (req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return res.status(400).json({
                errors: [{
                    msg: 'No query parameters are allowed in this endpoint',
                }],
            });
        }
        next();
    }
];
