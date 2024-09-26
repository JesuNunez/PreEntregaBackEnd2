const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/usuarios.model');
const { createHash, isValidPassword } = require('../utils/util');  
const router = express.Router();

// Ruta para mostrar el formulario de registro (GET)
router.get('/register', (req, res) => {
    res.render('register');  // Aquí asegúrate de que exista la vista "register.handlebars"
});

// Ruta para registrar un nuevo usuario (POST)
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está en uso.' });
        }

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password,  
            cart: null
        });

        console.log('Password antes de guardar:', newUser.password);  
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
    }
});


// Ruta para mostrar el formulario de login (GET)
router.get('/login', (req, res) => {
    res.render('login');  
});

// Ruta para iniciar sesión (login)
router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error('Error en la autenticación:', err);  
            return res.status(500).json({ message: 'Error en el servidor', error: err.message });  
        }

        if (!user) {
            console.log('Información de error:', info);  
            return res.status(400).json({ message: info ? info.message : 'Error en el login' });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                console.error('Error al iniciar sesión:', err);  // Log del error en el login
                return next(err);
            }

            
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
            res.cookie('jwt', token, { httpOnly: true });

           
            return res.redirect('/api/sessions/current'); 
        });
    })(req, res, next);
});


// Ruta para obtener el usuario logueado (basado en JWT de la cookie)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('Bienvenido', { user: req.user });
});

// Ruta para cerrar sesión (logout)
router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;
