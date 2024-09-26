const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Products');

// Ruta POST para agregar un producto al carrito
router.post('/add', async (req, res) => {
    try {
        const { cartId, productId } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Ruta DELETE para eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.products = cart.products.filter(p => !p.product.equals(pid));

        if (cart.products.length === 0) {
            await Cart.findByIdAndDelete(cid); 
            return res.status(200).json({ message: 'Cart is empty and has been deleted' });
        }

        await cart.save();
        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta PUT para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();
        res.status(200).json({ message: 'Product quantity updated', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta PUT para actualizar el carrito completo con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        cart.products = products;

        await cart.save();
        res.status(200).json({ message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta DELETE para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.products = []; 

        await cart.save();
        res.status(200).json({ message: 'Cart emptied', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta GET para obtener los detalles completos de los productos en el carrito (con populate)
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid).populate('products.product');  

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();
        res.status(200).json({ message: 'Product quantity updated', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({
            products: []  
        });

        await newCart.save();

        res.status(201).json({ message: 'New cart created', cart: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
