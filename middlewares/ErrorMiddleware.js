export const GlobalErrorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  console.error(error.stack);
  res
    .status(status)
    .json({ error: error.message, name: error.name });
};
