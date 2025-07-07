const productModel = require("../model/productModel");
const { validationResult } = require("express-validator");
const { S3 } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { ObjectId } = require('mongodb');

const s3 = new S3({
    region: 'ap-south-1',

  });

// exports.addProduct = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error();
//         error.statusCode = 403;
//         error.data = errors.array();
//         throw error;
//     }
//     const { name, brand, description, category, price, stock, colorOptions, discount, rating, isFeatured, createdAt, updatedAt, images, thumbnail } = req.body
//     const product = new productModel(name, brand, description, category, price, stock, colorOptions, discount, rating, isFeatured, createdAt, updatedAt, images, thumbnail);
//     product.saveProducts()
//         .then(result => {
//             res.send(result)
//         }).catch(err => {
//             next(err)
//         })
// }

// exports.addProduct = async(req,res,next) => {
//     const { name, brand, description, category, price, stock, colorOptions, discount, rating, isFeatured, createdAt, updatedAt, thumbnail } = req.body;
//        if (!req.files || req.files.length === 0) {
//         return res.status(400).send("No file uploaded");
//       }
//       const files = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];
//       const imageUrls = [];
//       for (const file of files) {
//         const params = {
//           Bucket: "toetotoedev-1",
//           Key: file.name,
//           Body: file.data,
//           ContentType: file.mimetype,
//         };
//        const uploaded =  await s3.putObject(params);
//        console.log(uploaded,"sd")
//         const imageUrl = `https://toetotoedev-1.s3.ap-south-1.amazonaws.com/${params.Key}`;
//         imageUrls.push(imageUrl);
//       }
//     console.log(imageUrls,"imgs")
//         const product = new productModel(name, brand, description, category, price, stock, colorOptions, discount, rating, isFeatured, createdAt, updatedAt, imageUrls, thumbnail);
//     product.saveProducts()
//         .then(result => {
//             res.send(result)
//         }).catch(err => {
//             next(err)
//         })
// }

// upload with unique filename
// exports.addProduct = async (req, res, next) => {
//   try {
//     const {
//       name,
//       brand,
//       description,
//       category,
//       price,
//       stock,
//       colorOptions,
//       discount,
//       rating,
//       isFeatured,
//       createdAt,
//       updatedAt,
//       thumbnail,
//     } = req.body;

//     if (!req.files || !req.files.images || req.files.images.length === 0) {
//       return res.status(400).send("No file uploaded");
//     }

//     const files = Array.isArray(req.files.images)
//       ? req.files.images
//       : [req.files.images];

//     const imageUrls = [];

//     for (const file of files) {
//       const ext = path.extname(file.name);
//       const baseName = path.basename(file.name, ext);
//       const uniqueFileName = `${baseName}-${uuidv4()}${ext}`;

//       const params = {
//         Bucket: "toetotoedev-1",
//         Key: uniqueFileName,
//         Body: file.data,
//         ContentType: file.mimetype,
//       };

//       await s3.putObject(params);

//       const imageUrl = `https://${params.Bucket}.s3.ap-south-1.amazonaws.com/${params.Key}`;
//       imageUrls.push(imageUrl);
//     }

//     console.log(imageUrls, "Uploaded image URLs");

//     const product = new productModel(
//       name,
//       brand,
//       description,
//       category,
//       price,
//       stock,
//       colorOptions,
//       discount,
//       rating,
//       isFeatured,
//       createdAt,
//       updatedAt,
//       imageUrls,
//       thumbnail
//     );

//     const result = await product.saveProducts();
//     res.send(result);

//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// };



exports.addProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      price,
      stock,
      colorOptions,
      discount,
      rating,
      isFeatured,
      createdAt,
      updatedAt,
      thumbnail,
    } = req.body;

    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res.status(400).send("No file uploaded");
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const imageUrls = [];
    const uploadedKeys = [];

    for (const file of files) {
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext);
      const uniqueFileName = `${baseName}-${uuidv4()}${ext}`;

      const params = {
        Bucket: "toetotoedev-1",
        Key: uniqueFileName,
        Body: file.data,
        ContentType: file.mimetype,
      };

      try {
        await s3.putObject(params);
        uploadedKeys.push(params.Key);

        const imageUrl = `https://${params.Bucket}.s3.ap-south-1.amazonaws.com/${params.Key}`;
        imageUrls.push(imageUrl);

      } catch (uploadErr) {
        console.error(`❌ Upload failed for ${file.name}:`, uploadErr);

        // Rollback previously uploaded files
        for (const key of uploadedKeys) {
          try {
            await s3.deleteObject({
              Bucket: params.Bucket,
              Key: key,
            });
            console.log(`🗑️ Rolled back uploaded file: ${key}`);
          } catch (deleteErr) {
            console.error(`⚠️ Failed to rollback file ${key}:`, deleteErr);
          }
        }

        return res.status(500).json({
          error: `Upload failed for ${file.name}. Rolled back all uploaded files.`,
        });
      }
    }

    console.log(imageUrls, "✅ Uploaded image URLs");

    const product = new productModel(
      name,
      brand,
      description,
      category,
      price,
      stock,
      colorOptions,
      discount,
      rating,
      isFeatured,
      createdAt,
      updatedAt,
      imageUrls,
      thumbnail
    );

    const result = await product.saveProducts();
    res.send(result);

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    next(err);
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    // ✅ Get from BODY, not params
    const productId = req.body.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    // 🔍 Get product details
    const product = await productModel.getProductDetail(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 📁 Delete product images from S3
    const deletePromises = [];

    if (product.images && Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        const key = decodeURIComponent(
          imageUrl.split('.amazonaws.com/')[1]
        );

        const params = {
          Bucket: "toetotoedev-1",
          Key: key,
        };

        deletePromises.push(
          s3.deleteObject(params)
            .catch(err => {
              console.error(`Failed to delete image: ${key}`, err);
              return { key, error: err.message };
            })
        );
      }
    }

    const deleteResults = await Promise.all(deletePromises);

    // 🗑️ Delete product from DB
    const dbDeleteResult = await productModel.deleteById(productId);

    if (!dbDeleteResult || dbDeleteResult.deletedCount === 0) {
      return res.status(500).json({ message: "Failed to delete product from database" });
    }

    console.log(`✅ Product ${productId} deleted from DB.`);
    console.log("🗑️ Image delete results:", deleteResults);

    res.json({
      message: "Product deleted successfully",
      imageDeleteResults: deleteResults,
    });

  } catch (err) {
    console.error("❌ Delete product error:", err);
    next(err);
  }
};



exports.getProducts = (req, res, next) => {
  console.log(req.body)
    // const { page } = req.body
    const { page } = req.query
    console.log(page)
    console.log(req.url, "url")
    productModel.getAllProducts(Number(page) - 1).then((result) => {
      console.log(result,"outro")
        res.send(result)
    }).catch(err => {
        next(err)
    })
}

exports.getProductDetail = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const productId = req.params.id;
    console.log(req.url, productId, "url")
    productModel.getProductDetail(productId).then((result) => {
      if(result == null){
        res.status(400).send({status:400,message:'No such Products'})
      }else{
        res.send(result)
      }
       
    }).catch(err => {
        next(err)
    })
}