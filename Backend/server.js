import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
import connectDb from './lib/connectDb.js';
import authRouter from './routes/auth.route.js';
import movieRouter from './routes/movie.route.js';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/movies', movieRouter);

 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on http://localhost:${PORT}`);
})
