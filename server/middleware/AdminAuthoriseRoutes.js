class AdminAuthoriseRoutes {
  static authenticate(req, res, next) {
    /* if (Object.keys(req.query).length !== 0) {
      next();
    } else  */
    if (!req.user._isadmin) {
      res.status(403).send({
        status: 403,
        error: "Access Denied, Forbidden!",
      });
    } else {
      next();
    }
  }
}
export default AdminAuthoriseRoutes;
