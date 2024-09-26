const express = require('express');
const router = express.Router();

// Ruta para renderizar la vista de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para renderizar la vista de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para mostrar el perfil del usuario logueado (usando JWT)
router.get('/current', (req, res) => {
    res.render('current', { user: req.user });
});

module.exports = router;
