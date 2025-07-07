const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error();
    error.statusCode = 401;
    error.data = "Not authenticated, Please Login";
    throw error;
  }
  const token = authHeader;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "**$$ViruKiDukaanSeLayaJootaFromJapan$$**");
  } catch (error) {
    console.log(error,"inHere");
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("not authenticated");
    error.statusCode = 401;
    error.data = "Incorrect credentials , try again";
    throw error;
  }
  console.log(decodedToken)
  if (decodedToken.role !== 'user') {
    const error = new Error("Not a valid user role");
    error.statusCode = 401;
    error.data = "Invalid role";
    throw error;
}
  userModel.findById(decodedToken.userId)
    .then((result) => { 
    //   console.log(result,"resss")
    //   req.userId = decodedToken.userId;
    //   req.name = result?.name
    //   req.email = result?.email;
    //   req.role = result?.role
    //   next();
    if (result?.role == 'user') {
        req.userId = decodedToken.userId;
        req.email = result?.email;
        req.role = result?.role;
        req.name = result?.name
        next();
    }
    else {
        const error = new Error("Not a valid user role");
        error.statusCode = 401;
        error.data = "Invalid role";
        next(error);
    }
    })
    .catch((err) => {
      const error = new Error("api and secret key mismatch");
      error.statusCode = 401;
      error.data = err;
      throw error;
    });
};