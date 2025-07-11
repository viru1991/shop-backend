const getDB = require("../utilities/db").getDB;
const mongodb = require("mongodb");
const { ObjectId } = mongodb;
class Product {
    constructor(name, brand, description, category, price, stock, colorOptions, discount, rating, isFeatured, createdAt, updatedAt, images, thumbnail) {
        this.name = name,
            this.brand = brand,
            this.description = description,
            this.category = category,
            this.price = price,
            this.stock = stock,
            this.colorOptions = colorOptions || [],
            this.discount = discount,
            this.rating = rating,
            this.isFeatured = isFeatured,
            this.createdAt = createdAt,
            this.updatedAt = updatedAt,
            this.images = images,
            this.thumbnail = thumbnail
    }
    saveProducts() {
        let db = getDB();
        return db
            .collection("Products")
            .insertOne(this)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }
    static getAllProducts(skip) {
        const db = getDB();
        return db
            .collection("Products")
            .find()
            .project({
                name: 1, brand: 1, description: 1, price: 1, thumbnail: 1, stock: 1, images:1,colorOptions:1
            })
            .skip(skip)
            .limit(10)
            .toArray()
            .then((result) => {
                const filteredResult = result.map((product) => {
                    return {
                        ...product,
                        // stock: product.stock.filter((item) => item.quantity > 0),
                        stockLabel:'in stock'
                    };
                });
                console.log(filteredResult);
                return filteredResult;
                // return result 
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static getProductDetail(productId) {
        console.log(productId)
        const db = getDB()
        if (!ObjectId.isValid(productId)) {
            return Promise.reject(new Error("Invalid ObjectId format"));
          }
        return db
            .collection("Products")
            .findOne({ _id: ObjectId.createFromHexString(productId) })
            // .toArray()
            .then((result) => {
                return result
            })
            .catch((err) => {
                console.log(err)
            })
    }

    static deleteById(productId) {
        const db = getDB();
    
        if (!ObjectId.isValid(productId)) {
          return Promise.reject(new Error("Invalid ObjectId format"));
        }
    
        return db
          .collection("Products")
          .deleteOne({ _id: new ObjectId(productId) })
          .then(result => {
            return result; // Will have result.deletedCount
          })
          .catch(err => {
            console.error("DB error in deleteById:", err);
            throw err;
          });
      }
}

module.exports = Product