const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');

dotenv.config();        
connectDB();           

const app = express();


const allowedOrigins = [
  'https://dashing-lolly-71872b.netlify.app', 
  'http://localhost:5173' 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, 
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
