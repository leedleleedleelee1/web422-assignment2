/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ____Frank Fu__________________ Student ID: ____126609197__________ Date: _______May 17 2024_______
*
*  Published URL: __willowy-madeleine-308687.netlify.app_
*
********************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const ListingsDB = require('./modules/listingsDB.js');

dotenv.config();

const app = express();
const db = new ListingsDB();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

app.post('/api/listings', (req, res) => {
    db.addNewListing(req.body).then((listing) => {
        res.status(201).json(listing);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

app.get('/api/listings', (req, res) => {
    const { page = 1, perPage = 10, name = '' } = req.query;
    db.getAllListings(parseInt(page), parseInt(perPage), name).then((listings) => {
        res.status(200).json(listings);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

app.get('/api/listings/:id', (req, res) => {
    db.getListingById(req.params.id).then((listing) => {
        if (listing) {
            res.status(200).json(listing);
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

app.put('/api/listings/:id', (req, res) => {
    db.updateListingById(req.body, req.params.id).then((result) => {
        if (result.nModified > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'Listing not found or data unchanged' });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

app.delete('/api/listings/:id', (req, res) => {
    db.deleteListingById(req.params.id).then((result) => {
        if (result.deletedCount > 0) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

