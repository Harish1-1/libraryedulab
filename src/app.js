const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


connectDB();


app.use(cors());
app.use(bodyParser.json());


app.use('/api/users', require('./routes/user.routes'));
app.use('/api/authors', require('./routes/author.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/audit-logs', require('./routes/auditLog.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
