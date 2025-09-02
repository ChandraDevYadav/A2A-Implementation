export default function errorHandler(err, req, res, next) {
  console.error("[error]", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
}
