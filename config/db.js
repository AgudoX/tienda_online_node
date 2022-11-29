const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

//Etructura de una url =  protocol://user:pass@host:port/database