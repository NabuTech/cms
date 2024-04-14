const bcrypt = require ('bcrypt') // password hashing
const db = ('../db'); // database connection
const { generateAccessToken } = require('../utils/authUtils'); // generate JWT token

// Register new User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // check user with email exists
        const existingUser = await db.query('SELECT * FROM users WHERE email =?, [email]');
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists'});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert new user
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?', [username, email, hashedPassword]);
    
        res.status(201).json ({ messahe: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const [ email, password] = req.body;

    try {
        // Fetch user by email
        const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

        // Check Password
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

        // Generate access token
        const token = generateAccessToken({ id: user[0].id});

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server Error'});
    }
};

// Logout User
exports.logoutUser = async (req, res) => {
    // No Action needed
    res.json ({ message: 'Logout Successful'});
};

// Fetch User Details
exports.getUserDetails = async (req,res) => {
    const userId = req.user.id;

    try {
        // fetch user details from database
        const user = await db.query('SELECT id, username, email FROM users WHERE id =?', [userID]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found'});
        }

        res.json(user[0]);
    } catch (error) {
        console.error('Error fetching user details: ', error);
        res.status(500).json({ message: 'Internal server error'});
    }
};


