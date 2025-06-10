export const LoggerMiddleware = (req, res, next) => {
  console.log(
    `[Logger Middleware] [${new Date().toISOString()} method: ${
      req.method
    } path: ${req.path}]`
  );
  next();
};
