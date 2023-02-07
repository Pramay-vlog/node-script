const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(() => {
    return
}).catch(err => {
    console.log(err);
})