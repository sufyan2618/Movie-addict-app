import Movie from "../models/movie.model";
import cloudinary from "../util/cloudinary";

export const createMovie = async (req, res) => {
    const { title, description, rating } = req.body;
    const imageFile = req.file.imageFile;
    const userId = req.user._id; // Assuming user is authenticated and user ID is available

    if (!title || !description || !image || !rating) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (!imageFile){
        return res.status(400).json({ message: "Image file is required." });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;
    const response = await cloudinary.uploader.upload(base64Image, {
        folder: "movie_images",
        resource_type: "image",
    }
    );
    const image = response.secure_url;

    try {
        const newMovie = new Movie({
            title,
            description,
            image,
            user: userId,
            rating
        });

        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        console.error("Error creating movie:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export const getMovies = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const totalMovies = await Movie.countDocuments();
        const movies = await Movie.find()
            .skip(skip)
            .limit(limit)
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            movies,
            totalMovies,
            currentPage: page,
            totalPages: Math.ceil(totalMovies / limit)
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export const getMoviesbyUser = async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated and user ID is available

    try {
        const movies = await Movie.find({ user: userId })
            .sort({ createdAt: -1 });

        if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found for this user." });
        }

        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching user's movies:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export const deleteMovie = async (req, res) => {
    const movieId = req.params.id;
    const userId = req.user._id; // Assuming user is authenticated and user ID is available

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found." });
        }
        if (movie.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this movie." });
        }
        if(movie.image) {
            const publicId = movie.image.split("/").pop().split(".")[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(`movie_images/${publicId}`, { resource_type: "image" });
        }

        await Movie.findByIdAndDelete(movieId);
        res.status(200).json({ message: "Movie deleted successfully." });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Server error." });
    }
}