/**
 * HEFIN Backend Server
 * * This server is built with Node.js and Express.js to provide a backend for the HEFIN frontend.
 * It simulates a database using in-memory data structures (arrays of objects).
 * This approach is ideal for a proof-of-concept, a simple application, or for frontend development
 * and testing without the need for a persistent database.
 * * NOTE: All data will be reset every time the server is restarted.
 * * To run this server:
 * 1. Make sure you have Node.js installed.
 * 2. In your terminal, navigate to your project directory.
 * 3. Initialize your project with: `npm init -y`
 * 4. Install the required dependencies: `npm install express body-parser cors`
 * 5. Save this code as `server.js`.
 * 6. Run the server with: `node server.js`
 */

// ------------------- REQUIRED MODULES -------------------
// Import the Express framework
const express = require('express');
// Import body-parser to parse JSON from incoming requests
const bodyParser = require('body-parser');
// Import cors to enable Cross-Origin Resource Sharing
const cors = require('cors');

// ------------------- APPLICATION SETUP -------------------
const app = express();
const PORT = 3001; // The port the server will listen on

// ------------------- MIDDLEWARE -------------------
// Use the body-parser middleware to automatically parse JSON data from requests
app.use(bodyParser.json());
// Use the cors middleware to allow requests from the frontend
app.use(cors());

// ------------------- IN-MEMORY "DATABASE" -------------------
// Simulate a database by storing data in JavaScript arrays.
// These arrays will hold all the application's data.

/**
 * @typedef {object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} username - User's unique username.
 * @property {string} email - User's email address.
 * @property {string} createdAt - Timestamp of user creation.
 */
let users = [
    { id: 'usr-1', username: 'alex_r', email: 'alex.r@hefin.com', createdAt: new Date().toISOString() },
    { id: 'usr-2', username: 'jess_l', email: 'jess.l@hefin.com', createdAt: new Date().toISOString() },
    { id: 'usr-3', username: 'mike_t', email: 'mike.t@hefin.com', createdAt: new Date().toISOString() }
];

/**
 * @typedef {object} HealthRecord
 * @property {string} id - Unique identifier for the health record.
 * @property {string} userId - ID of the associated user.
 * @property {string} type - Type of the record (e.g., 'Consultation', 'Lab Results').
 * @property {string} date - Date of the record.
 * @property {string} description - A detailed description of the record.
 * @property {string} createdAt - Timestamp of record creation.
 */
let healthRecords = [
    { id: 'hr-1', userId: 'usr-1', type: 'Consultation', date: '2025-08-15', description: 'Annual health check-up. All vitals are within normal range.', createdAt: new Date().toISOString() },
    { id: 'hr-2', userId: 'usr-1', type: 'Lab Results', date: '2025-08-16', description: 'Blood work results. Cholesterol levels are slightly elevated.', createdAt: new Date().toISOString() },
    { id: 'hr-3', userId: 'usr-2', type: 'Medication', date: '2025-08-17', description: 'Prescription for antibiotics for a minor infection.', createdAt: new Date().toISOString() }
];

/**
 * @typedef {object} FinancialRecord
 * @property {string} id - Unique identifier for the financial record.
 * @property {string} userId - ID of the associated user.
 * @property {string} type - Type of the record (e.g., 'Insurance Claim', 'Loan').
 * @property {string} date - Date of the financial transaction.
 * @property {number} amount - The monetary amount of the transaction.
 * @property {string} status - The current status (e.g., 'Pending', 'Approved').
 * @property {string} createdAt - Timestamp of record creation.
 */
let financialRecords = [
    { id: 'fr-1', userId: 'usr-1', type: 'Insurance Claim', date: '2025-08-18', amount: 500.00, status: 'Pending', createdAt: new Date().toISOString() },
    { id: 'fr-2', userId: 'usr-2', type: 'Loan', date: '2025-08-19', amount: 25000.00, status: 'Approved', createdAt: new Date().toISOString() },
    { id: 'fr-3', userId: 'usr-1', type: 'Payment', date: '2025-08-20', amount: 150.00, status: 'Paid', createdAt: new Date().toISOString() }
];

// ------------------- UTILITY FUNCTIONS -------------------
// A simple function to generate unique IDs.
const generateId = (prefix, collection) => {
    let maxId = 0;
    collection.forEach(item => {
        const idNum = parseInt(item.id.replace(prefix + '-', ''));
        if (idNum > maxId) {
            maxId = idNum;
        }
    });
    return `${prefix}-${maxId + 1}`;
};

// ------------------- API ROUTES -------------------

// ------------------- USERS API -------------------
/**
 * @api {get} /api/users Get all users
 */
app.get('/api/users', (req, res) => {
    res.json(users);
});

/**
 * @api {get} /api/users/:id Get a single user by ID
 */
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found.');
    }
});

/**
 * @api {post} /api/users Add a new user
 */
app.post('/api/users', (req, res) => {
    if (!req.body.username || !req.body.email) {
        return res.status(400).send('Username and email are required.');
    }
    const newUser = {
        id: generateId('usr', users),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * @api {put} /api/users/:id Update an existing user
 */
app.put('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        res.json(users[index]);
    } else {
        res.status(404).send('User not found.');
    }
});

/**
 * @api {delete} /api/users/:id Delete a user
 */
app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        res.json(deletedUser[0]);
    } else {
        res.status(404).send('User not found.');
    }
});

// ------------------- HEALTH RECORDS API -------------------
/**
 * @api {get} /api/health Get all health records
 */
app.get('/api/health', (req, res) => {
    res.json(healthRecords);
});

/**
 * @api {get} /api/health/:id Get a single health record by ID
 */
app.get('/api/health/:id', (req, res) => {
    const record = healthRecords.find(hr => hr.id === req.params.id);
    if (record) {
        res.json(record);
    } else {
        res.status(404).send('Health record not found.');
    }
});

/**
 * @api {post} /api/health Add a new health record
 */
app.post('/api/health', (req, res) => {
    if (!req.body.userId || !req.body.type || !req.body.description) {
        return res.status(400).send('userId, type, and description are required.');
    }
    const newRecord = {
        id: generateId('hr', healthRecords),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    healthRecords.push(newRecord);
    res.status(201).json(newRecord);
});

/**
 * @api {put} /api/health/:id Update an existing health record
 */
app.put('/api/health/:id', (req, res) => {
    const index = healthRecords.findIndex(hr => hr.id === req.params.id);
    if (index !== -1) {
        healthRecords[index] = { ...healthRecords[index], ...req.body };
        res.json(healthRecords[index]);
    } else {
        res.status(404).send('Health record not found.');
    }
});

/**
 * @api {delete} /api/health/:id Delete a health record
 */
app.delete('/api/health/:id', (req, res) => {
    const index = healthRecords.findIndex(hr => hr.id === req.params.id);
    if (index !== -1) {
        const deletedRecord = healthRecords.splice(index, 1);
        res.json(deletedRecord[0]);
    } else {
        res.status(404).send('Health record not found.');
    }
});

// ------------------- FINANCIAL RECORDS API -------------------
/**
 * @api {get} /api/finance Get all financial records
 */
app.get('/api/finance', (req, res) => {
    res.json(financialRecords);
});

/**
 * @api {get} /api/finance/:id Get a single financial record by ID
 */
app.get('/api/finance/:id', (req, res) => {
    const record = financialRecords.find(fr => fr.id === req.params.id);
    if (record) {
        res.json(record);
    } else {
        res.status(404).send('Financial record not found.');
    }
});

/**
 * @api {post} /api/finance Add a new financial record
 */
app.post('/api/finance', (req, res) => {
    if (!req.body.userId || !req.body.type || !req.body.amount) {
        return res.status(400).send('userId, type, and amount are required.');
    }
    const newRecord = {
        id: generateId('fr', financialRecords),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    financialRecords.push(newRecord);
    res.status(201).json(newRecord);
});

/**
 * @api {put} /api/finance/:id Update an existing financial record
 */
app.put('/api/finance/:id', (req, res) => {
    const index = financialRecords.findIndex(fr => fr.id === req.params.id);
    if (index !== -1) {
        financialRecords[index] = { ...financialRecords[index], ...req.body };
        res.json(financialRecords[index]);
    } else {
        res.status(404).send('Financial record not found.');
    }
});

/**
 * @api {delete} /api/finance/:id Delete a financial record
 */
app.delete('/api/finance/:id', (req, res) => {
    const index = financialRecords.findIndex(fr => fr.id === req.params.id);
    if (index !== -1) {
        const deletedRecord = financialRecords.splice(index, 1);
        res.json(deletedRecord[0]);
    } else {
        res.status(404).send('Financial record not found.');
    }
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => {
    console.log(`HEFIN backend server is running on http://localhost:${PORT}`);
});// Add a new route handler for GET requests to the root path (/)
app.get('/', (req, res) => {
    res.send('Welcome to the HEFIN Backend! The API is running.');
});