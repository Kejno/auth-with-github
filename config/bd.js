const mongoose = require('mongoose');

const connectDB = async () => {
  const connection = await mongoose.connect('mongodb+srv://ecommerce:5354431Am@cluster0.l9tuj.azure.mongodb.net/app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`MongoDB connected: ${connection.connection.host}`)
}

module.exports = connectDB