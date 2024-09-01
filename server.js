const express = require("express");
const fs = require("fs");
const path = require("path");
const mysql = require('mysql2');
const Config = require('./config');
const jwt = require('jsonwebtoken');
const key = "ragula-saketh";

//creating express instance
app = express();
app.use(express.json());

//connecting to database
const db = mysql.createConnection({
    host: Config.host,
    user: Config.user,
    password: Config.password,
    database: Config.database
});
db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

//authentication middleware
const authenticateToken = function (req, res, next) {
    const authHeader = req.headers["authorization"]; // Check for authorization header

    if (authHeader) {
        const token = authHeader.split(" ")[1]; // Extract the token
        if (token) {
            jwt.verify(token, key, (err, user) => {
                if (err) {
                    return res.status(403).send("Invalid token"); // Fixed typo: `satus` to `status`
                }
                req.user = user; // Attach the user object to req
                next(); // Proceed to the next middleware
            });
        } else {
            return res.status(401).send("Token missing"); // Handle case where token is missing after Bearer
        }
    } else {
        return res.status(401).send("Authorization header missing"); // Handle case where auth header is missing
    }
};

//Route to access home page
app.post('/home', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        if (result.length === 0) {

            return res.status(401).json({ error: 'Invalid username or password' });
        }
        if (result[0].password === password) { res.json(jwt.sign({ email }, key, { expiresIn: '1h' })); }
        else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

app.get("/register", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "register.html"));
});
app.get("/login", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/home", authenticateToken, (request, response) => {
    response.sendFile(path.join(__dirname, "public", "home.html"));
});

//posting users details in database
app.post('/users', (request, response) => {
    const data = request.body;
    console.log(data.name);
    const { username, email, password } = data;
    const query = 'INSERT INTO users (username,email,password) VALUES (?, ?,?)';
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error in creating user', err);
            response.status(500).send('Error in creating user');
            return;
        }
        response.status(201).send({ message: 'user added successfully', user: { id: result.insertId, ...data } });
    });

});

//Route to get all stores
app.get("/getStores", (request, response) => {
    db.query('SELECT * FROM stores', (err, result) => {
        if (err) {
            console.error('Error in getting stores', err);
            response.status(500).send("Error getting movies");
            return;

        }
        response.status(200).json(result);
    });
});

//Route to create store
app.post('/stores', (request, response) => {
    const data = request.body;
    console.log(data.name);
    const { name, location, contactnumber, openingtime, closingtime, availablenetworks, website, url } = data;
    const query = 'INSERT INTO stores (store_name, location, contact_number, opening_time, closing_time, available_networks, website,img_url ) VALUES (?, ?, ?, ?, ?, ?,?,?)';
    db.query(query, [name, location, contactnumber, openingtime, closingtime, availablenetworks, website, url], (err, result) => {
        if (err) {
            console.error('Error in creating store', err);
            response.status(500).send('Error in creating store');
            return;
        }
        response.status(201).send({ message: 'store added successfully', store: { id: result.insertId, ...data } });
    });

});

//Route to delete store
app.delete('/stores/:id', (request, response) => {
    const store_id = request.params.id;
    const query = 'DELETE FROM stores WHERE id = ?';
    db.query(query, [store_id], (err, result) => {
        if (err) {
            console.error('Error in deleting movie', err);
            response.status(500).send(err.message);
            return;
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Movie not found');
        }
        response.status(200).send('Movie deleted successfully');
    });
});

//Route to update store
app.put('/stores/:id', (request, response) => {
    const store_id = request.params.id;
    const { store_name, location, contact_number, opening_time, closing_time, available_networks, website, img_url } = request.body;
    const query = 'UPDATE stores SET store_name = ?, location = ?, contact_number = ?, opening_time = ?,closing_time=?, available_networks = ?, website = ?,img_url=? WHERE id = ?';
    db.query(query, [store_name, location, contact_number, opening_time, closing_time, available_networks, website, img_url, store_id], (err, result) => {
        if (err) {
            console.error('Error in updating movie', err);

            response.status(500).send({ error: err.message });
            return;
        }

        if (result.affectedRows === 0) {
            return response.status(404).send('Movie not found');
        }

        response.status(200).send('Store updated successfully');
    });
});

//Route to get store by id
app.get('/stores/:id', (request, response) => {
    const store_id = request.params.id;
    db.query('SELECT * FROM stores WHERE id = ?', [store_id], (err, result) => {
        if (err) {
            console.error('Error in getting movie', err);
            response.status(500).send(err.message);
            return;
        }
        if (result.length === 0) return response.status(404).send('Store not found!');
        response.status(200).send(result[0]);
    });
});

// serving static files from the "public"
app.use("/", express.static(path.join(__dirname, "public")));

//Server is running on port 8080
app.listen(8080, () => {
    console.log("server is running on http://localhost:8080 ");
});
