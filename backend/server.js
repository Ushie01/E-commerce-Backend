const mongoose = require('mongoose');
const app = require('./index')
const dotenv = require('dotenv');


// CONNECTING TO MONGODB SERVER
dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE_PASSWORD;


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => console.log('DB connection successful'))


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
