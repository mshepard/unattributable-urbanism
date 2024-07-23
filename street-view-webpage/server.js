const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Environment variable for API Key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.use(express.static('public')); // Make sure your static files are in a 'public' directory
app.get('/', (req, res) => {
    res.render('index', { apiKey: GOOGLE_MAPS_API_KEY });
});

app.get('/config', (req, res) => {
    res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
