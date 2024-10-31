function logger(req, res, next) {
  const date = new Date();
  console.log(`
            REQUEST METHOD: ${req.method}
            REQUEST URL: ${req.originalUrl}
            TIMESTAMP: ${date.toLocaleString()}
        `);
  next();
}

function validateBody(req, res, next) {
  const prompt = req.body;
  if (!prompt) {
    return next({
      status: 400,
      error: "Invalid input",
      message: "No prompt provided.",
    });
  }
  next();
}

module.exports = {
  logger,
  validateBody,
};
