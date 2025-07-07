const userModel = require("../model/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendResetEmail } = require("../utilities/mailer");
// const getDB = require("../utilities/db").getDB;

// add/edit profile --> address,contact,emailId


exports.userSignUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error();
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
    }
    const { name, email, password, contact, role, address, wishlist } = req.body
    bcrypt
        .hash(password, 12).then((hashedPW) => {
            const addUser = new userModel(name, email, hashedPW, contact, address, role, wishlist);
            return addUser.saveUser()
        })
        .then((result) => {
            console.log(result)
            res.status(200).send({
                message: 'sign up successful'
            })
        }).catch((err) => {
            console.log(err);
            next();
        });
}

exports.Login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error();
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
    }
    const { email, password } = req.body;
    let loggedUser;
    userModel.getLogin({ email: email })
        .then((user) => {
            if (!user) {
                const error = new Error("email is not found");
                error.statusCode = 401;
                error.data = "email not found";
                throw error;
            }
            loggedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error();
                error.statusCode = 401;
                error.data = "password is not matched";
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loggedUser.email,
                    userId: loggedUser._id.toString(),
                    role: loggedUser.role
                },
                "**$$ViruKiDukaanSeLayaJootaFromJapan$$**",
                { expiresIn: "24h" }
            );
            console.log(loggedUser, "logged")
            res.status(200).json({
                message: "User loggedin",
                token: token,
                userId: loggedUser._id.toString(),
                username: loggedUser.name,
                role: loggedUser.role

            });
        })
        .catch((error) => {
            console.log(error);
            next(error);
        });
};

exports.changePassword = async (req, res, next) => {
    const { newPassword, repeatPassword } = req.body
    if (newPassword != repeatPassword) {
        const error = new Error("passwords do not match");
        error.statusCode = 401;
        error.data = "passwords do not match";
        throw error;
    }
    await bcrypt
        .hash(newPassword, 12).
        then((hashedPW) => {
            return userModel.findByIdAndUpdatePassword(req.userId, hashedPW)
        }).then((result) => {
            res.send({ message: 'password updated' })
        }).catch((error) => {
            console.log(error);
            next(error);
        });
}

exports.dashboard = (req, res, next) => {
    res.send({
        message: `Hello ${req.name}`
    })
}


exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;
    //   const db = getDB();
    //   const user = await db.collection("Users").findOne({ email });

    //   if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    //   }

    // const resetToken = crypto.randomBytes(32).toString("hex");
    // const expiry = Date.now() + 15 * 60 * 1000; // 15 mins

    //   await db.collection("Users").updateOne(
    //     { _id: user._id },
    //     { $set: { resetToken, resetTokenExpiry: expiry } }
    //   );

    // res.status(200).json({ message: "Reset email sent" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000; // 15 mins

    userModel.forgotPassword(email, resetToken, expiry).then(async (result) => {
        return await sendResetEmail(email, resetToken);
    }).then((result) => {
        console.log(result, "res")
        res.status(200).json({ message: "Password reset email has been sent" });
    }).catch((error) => {
        console.log(error);
        next(error);
    });
};

exports.resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;
    // const db = getDB();

    // const user = await db.collection("Users").findOne({
    // resetToken: token,
    // resetTokenExpiry: { $gt: Date.now() }
    // });

    // if (!user) {
    //     return res.status(400).json({ message: "Invalid or expired token" });
    // }
    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    // await db.collection("Users").updateOne(
    //     { _id: user._id },
    //     {
    //         $set: { password: hashedPassword },
    //         $unset: { resetToken: "", resetTokenExpiry: "" }
    //     }
    // );

    // res.status(200).json({ message: "Password reset successfully" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    userModel.resetPasswordToken(token, hashedPassword).then((result) => {
        res.status(200).json({ message: "Password reset successfull, please login and try" });
    }).catch((err) => {
        res.status(400).json({
            message:
                err.message === "Invalid or expired reset token"
                    ? "Your reset link is invalid or has expired. Please request a new one."
                    : "Password reset failed",
        });
    });
};
