

const isAdminUser= (req, res, next) => {
if (req.userInfo && req.userInfo.role === 'admin') {
    next(); // User is admin, proceed to the next middleware/route handler
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }

}
module.exports = isAdminUser;
