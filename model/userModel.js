const mongodb = require("mongodb")
const getDB = require("../utilities/db").getDB;

class Users {
    constructor(name, email, password, contact, address, role, wishlist) {
        this.name = name,
            this.email = email,
            this.password = password,
            this.contact = contact,
            this.address = address,
            this.role = role || "user",
            this.wishlist = wishlist
    }

    saveUser() {
        let db = getDB();
        return db
            .collection("Users")
            .insertOne(this)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static getLogin(email) {
        const db = getDB();
        return db
            .collection("Users")
            .findOne(email)
            .then((user) => {
                return user;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    static findById(userId) {
        const db = getDB();
        return db
            .collection("Users")
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then((user) => {
                // console.log("usermodel----", user);
                console.log(user)
                return user;
            })
            .catch((err) => {
                console.log(err);
            });
    }
    static findByIdAndUpdatePassword(userId, password) {
        const db = getDB();
        return db
            .collection("Users")
            .updateOne(
                { _id: new mongodb.ObjectId(userId) },
                { $set: { password: password } }
            )
            .then((user) => {
                // console.log("usermodel----", user);
                return user;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static forgotPassword(email, resetToken, expiry) {
        const db = getDB();
        return db.collection("Users")
            .updateOne(
                { email: email },
                { $set: { resetToken, resetTokenExpiry: expiry } }
            ).then((user) => {
                // console.log("usermodel----", user);
                return user;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static resetPasswordToken(token, hashedPassword) {
        const db = getDB();
        return db.collection("Users")
            .updateOne(
                {
                    resetToken: token,
                    resetTokenExpiry: { $gt: Date.now() }
                },
                {
                    $set: { password: hashedPassword },
                    $unset: { resetToken: "", resetTokenExpiry: "" }
                }
            )
            // .then((user) => {
            //     // console.log("usermodel----", user);
            //     return user;
            // })
            // .catch((err) => {
            //     console.log(err);
            // });
            .then((result) => {
                if (result.modifiedCount === 0) {
                  // Token expired or not found
                  throw new Error("Invalid or expired reset token");
                }
                return result;
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
    }

}


module.exports = Users;