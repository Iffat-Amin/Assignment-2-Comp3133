require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const connectDB = require('./config/db');
const schema = require('./schemas');
const cors = require('cors');
const uploadRoute = require('./routes/uploadRoute'); 

const app = express();
connectDB();

// Middleware
app.use(cors()); // for frontend access
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// REST route for file upload
app.use(uploadRoute); 

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
