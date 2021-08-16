const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');
const cors = require('cors');

const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('database connected'))

app.use(cors()) // We're telling express to use CORS
app.use(express.json())
app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
