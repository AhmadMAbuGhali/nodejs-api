const  router = require('express').Router();
const {register, login,changePassword} = require('../controllers/auth-controller');

// middleware can be added here if needed
const authMiddleware = require('../middleware/auth-middleware');

// all routes related to authentication will be here

router.post('/register', register);
router.post('/login', login);
router.post('/changePassword',authMiddleware,changePassword);



module.exports = router;
