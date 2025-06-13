export const LoggerMiddleware = (req, res, next) => {
  console.log(
    `[Logger Middleware] [${new Date().toISOString()} method: ${
      req.method
    } path: ${req.path}] [req.body]: ${req.body}, [req.file]: ${req.file}`
  );
  next();
};
