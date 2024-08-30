const Product = require('../models/ProductModel'); // Ensure correct path to your model
const Wishlist = require('../models/Wishlist'); // Ensure correct path to your model
const Cart = require('../models/Cart'); // Ensure correct path to your model
const Category = require('../models/CategoryModel'); // Assuming you have a Category model


// Add a new product
exports.addProduct = async (req, res) => {
    const {
        name, 
        description, 
        price, 
        category,  // categoryId passed here
        stockQuantity, 
        imageUrl, 
        tags, 
        discountPrice, 
        offerStartDate, 
        offerEndDate, 
        variants, 
        weight,
        weightUnit, 
        dimensions 
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!description) missingFields.push('description');
    if (!price) missingFields.push('price');
    if (!category) missingFields.push('category'); // Validate category
    if (stockQuantity == null) missingFields.push('stockQuantity');
    if (!weightUnit) missingFields.push('weightUnit');

    if (missingFields.length > 0) {
        return res.status(400).json({ message: "Required fields are missing", missingFields });
    }

    try {
        // Verify that the category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Create a new product
        const newProduct = new Product({
            name,
            description,
            price,
            category,  // Store category ID
            stockQuantity,
            imageUrl,
            tags,
            discountPrice,
            offerStartDate,
            offerEndDate,
            variants,
            weight,
            weightUnit,
            dimensions,
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: `Add product API failed: ${err.message}` });
    }
};

// Get all products with category name populated
exports.getAllProducts = async (req, res) => {
    try {
        // Fetch all products and populate the category name
        const products = await Product.find().populate('category', 'name');

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: `Get all products API failed: ${err.message}` });
    }
};

// Edit a product by ID
exports.editProduct = async (req, res) => {
    const { productId } = req.params;
    const updatedData = req.body;

    // Debugging: Log the request body
    console.log("Received body for update:", updatedData);

    try {
        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Respond with the updated product
        res.status(200).json(updatedProduct); // 200 for success
    } catch (err) {
        res.status(500).json({ message: `Edit product API failed: ${err.message}` }); // 500 for server error
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "Product deleted successfully" }); // 200 for success
    } catch (err) {
        res.status(500).json({ message: `Delete product API failed: ${err.message}` }); // 500 for server error
    }
};






// ----------------Wishlist--------------------------

exports.addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    try {
        // Check if product ID is valid
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create wishlist for the user
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        // Check if product ID is already in the wishlist
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ message: 'Product added to wishlist' });
        } else {
            return res.status(200).json({ message: 'Product is already in the wishlist' });
        }
    } catch (err) {
        res.status(500).json({ message: `Add to wishlist API failed: ${err.message}` });
    }
};


exports.deleteFromWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    try {
        // Find the wishlist for the user
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Remove product from the wishlist
        wishlist.products = wishlist.products.filter(id => !id.equals(productId));
        await wishlist.save();

        return res.status(200).json({ message: 'Product removed from wishlist' });
    } catch (err) {
        res.status(500).json({ message: `Delete from wishlist API failed: ${err.message}` });
    }
};


exports.getWishlist = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const wishlist = await Wishlist.findOne({ userId }).populate('products');
        console.log("Populated Wishlist:", wishlist);

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json(wishlist.products);
    } catch (err) {
        res.status(500).json({ message: `Get wishlist API failed: ${err.message}` });
    }
};




// ----------------------------Cart------------------------------------------

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the product is already in the cart
        const cartItem = cart.items.find(item => item.productId.equals(productId));
        if (cartItem) {
            // Update the quantity if the product is already in the cart
            cartItem.quantity += quantity || 1;
        } else {
            // Add the new product to the cart
            cart.items.push({ productId, quantity: quantity || 1 });
        }

        // Save the cart
        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: `Add to cart API failed: ${err.message}` });
    }
};


exports.getCart = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Find the cart for the user and populate product details
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: `Get cart API failed: ${err.message}` });
    }
};


exports.updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || typeof quantity !== 'number') {
        return res.status(400).json({ message: 'User ID, Product ID, and quantity are required' });
    }

    try {
        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart
        const cartItem = cart.items.find(item => item.productId.equals(productId));
        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update the quantity
        cartItem.quantity = quantity;

        // Save the cart
        await cart.save();

        res.status(200).json({ message: 'Cart item updated', cart });
    } catch (err) {
        res.status(500).json({ message: `Update cart item API failed: ${err.message}` });
    }
};


exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    try {
        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the product from the cart
        cart.items = cart.items.filter(item => !item.productId.equals(productId));

        // Save the cart
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (err) {
        res.status(500).json({ message: `Remove from cart API failed: ${err.message}` });
    }
};



// ---------------------Category-----------------------
// Add a new category
exports.addCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json(newCategory); // 201 for resource creation
    } catch (err) {
        res.status(500).json({ message: `Add category API failed: ${err.message}` });
    }
};

// Edit an existing category
exports.editCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: `Edit category API failed: ${err.message}` });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: `Delete category API failed: ${err.message}` });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: `Get all categories API failed: ${err.message}` });
    }
};
