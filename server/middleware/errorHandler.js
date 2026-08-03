function notFound(req, res) { res.status(404).json({ message: "Route not found" }); }
function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error);
  if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
  if (error.name === "CastError") return res.status(400).json({ message: "Invalid resource id" });
  return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
}
module.exports = { notFound, errorHandler };
