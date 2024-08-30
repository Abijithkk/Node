const express = require('express');
const router = express.Router();
const user = require('../controllers/usercontrol');
const jwtMiddleware = require('../middlewares/jwtmiddleware');
const productController = require('../controllers/productController'); // Ensure correct path to your controller

// Public routes
router.post('/user/register', user.register);
router.post('/user/login', user.login);

// Protected routes
router.get('/user/getallusers', user.getAllUsers);

// PUT request to edit user details
router.put('/user/:userId', user.editUser);

router.delete('/users/:userId', user.deleteUser);

router.post('/add-product', productController.addProduct);
router.get('/getallproducts', productController.getAllProducts);

// Route to edit an existing product by ID
router.put('/products/:productId', productController.editProduct);

// Route to delete a product by ID
router.delete('/products/:productId', productController.deleteProduct);

// Add to wishlist
router.post('/wishlist/add', productController.addToWishlist);

// Delete from wishlist
router.post('/wishlist/delete', productController.deleteFromWishlist);

router.get('/wishlist/:userId', productController.getWishlist);


// --------------Cart

router.post('/cart/add', productController.addToCart);
router.get('/cart/:userId', productController.getCart);
router.put('/cart/update', productController.updateCartItem);
router.delete('/cart/remove', productController.removeFromCart);





// --------------------------------Category-------------------------
router.post('/category/add', productController.addCategory);
router.get('/allcategory', productController.getAllCategories);
router.put('/category/update', productController.editCategory);
router.delete('/Category/remove', productController.deleteCategory);
module.exports = router;
