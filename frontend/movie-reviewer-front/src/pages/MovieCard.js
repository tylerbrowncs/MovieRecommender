import React from 'react'
import { useNavigate } from 'react-router-dom';

const MovieCard = ({movie}) => {

    const navigate = useNavigate();


    const moviePoster = "https://image.tmdb.org/t/p/original/" + movie.poster_path;

    const movieClicked = () => {
        navigate("/m/" + movie.id);
    }
    return (
        <div onClick={movieClicked} className="movie">
            <div>
                <p>{movie.release_date}</p>
            </div>
            <div>
                <img src={moviePoster} alt="movie poster" />
            </div>
            <div className="movieName">
                <h3>{movie.title}</h3>
            </div>
        </div>
    )
}

export default MovieCard