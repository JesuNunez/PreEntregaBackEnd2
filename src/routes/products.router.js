const express = require('express');
const router = express.Router();
const Product = require('../models/Products');  

router.get('/', async (req, res) => {
    try {
        const sort = req.query.sort === 'desc' ? -1 : 1; 
        const page = req.query.page;
        const limit = req.query.limit;

        if (!page && !limit && !req.query.sort) {
            const products = await Product.find().exec();
            
            return res.json({
                status: 'success',
                payload: products  
            });
        } else if (req.query.sort) {
            const products = await Product.find().sort({ price: sort }).exec();

            return res.json({
                status: 'success',
                payload: products,  
            });
        } else {
            const currentPage = parseInt(page) || 1;
            const productsPerPage = parseInt(limit) || 5;
            const skip = (currentPage - 1) * productsPerPage;

            const products = await Product.find().skip(skip).limit(productsPerPage).exec();
            const totalProducts = await Product.countDocuments();
            const totalPages = Math.ceil(totalProducts / productsPerPage);

            return res.json({
                status: 'success',
                payload: {
                    docs: products,
                    totalPages,
                    currentPage,
                    hasPrevPage: currentPage > 1,
                    hasNextPage: currentPage < totalPages,
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
