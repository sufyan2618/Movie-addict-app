import { getMovies, createMovie, getMoviesbyUser, deleteMovie } from "../controllers/movie.controller.js";
import express from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import  authMiddleware  from "../middleware/auth.middleware.js";
const movieRouter = express.Router();

movieRouter.post("/post-movie", authMiddleware, upload.single("imageFile"), createMovie);
movieRouter.get("/get-movies", authMiddleware, getMovies);
movieRouter.get("/get-movies-by-user", authMiddleware, getMoviesbyUser);
movieRouter.delete("/delete-movie/:id", authMiddleware, deleteMovie);

export default movieRouter;