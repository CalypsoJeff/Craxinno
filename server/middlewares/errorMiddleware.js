// middlewares/errorMiddleware.js
export const notFound = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || res.statusCode || 500;
  if (err.name === "CastError") {
    status = 400;
    err.message = "Invalid id format";
  }
  res.status(status).json({ message: err.message || "Server error" });
};
