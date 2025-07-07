const sanitizeEmptyStrings = (req, res, next) => {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string' && req.body[key].trim() === '') {
        req.body[key] = undefined;
      }
    }
    next();
  };
  
  module.exports = sanitizeEmptyStrings