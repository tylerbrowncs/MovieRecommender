import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import "./movie.css";


const Movie = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const [movie, setMovie] = useState({ credits: { cast: [] } });
    const [releaseDate, setRD] = useState("");
    const [director, setDirector] = useState("Loading");
    const [review, setReview] = useState(null);
    const [overview, setOverview] = useState("Loading");
    const [otherReviews, setOtherReviews] = useState(1);

    const getMovie = async (id) => {
        const response = await apiClient.post("http://localhost:44354/getmovie",
            {
                "id": id
            });

        const data = response.data;

        setMovie(data);

        console.log(data);

        if (data && data.credits && data.credits.crew) {
            try {
                setDirector(((data.credits.crew).find((element) => element.job === "Director")).name);
            } catch {
                setDirector("No director");
            }

            setOverview(data.overview);

            if (data?.overview?.length > 550) {
                setOverview(data.overview.substring(0, 550) + "...");
            }
    
        }
    };

    const getOtherReviews = async (movieid) => {
        const userresponse = await apiClient.get("http://localhost:44354/getuser");

        const userid = userresponse.data.user_id;

        const reviewresponse = await apiClient.post("http://localhost:44354/getothersreviews",
        {
            "movie": movieid,
        });

        if (reviewresponse.data.reviews.length > 0) {
            setOtherReviews(reviewresponse.data.reviews);
        }
        

        console.log(otherReviews);

        

    }

    const getReview = async (movieid) => {
        const userresponse = await apiClient.get("http://localhost:44354/getuser");

        const userid = userresponse.data.user_id;

        const reviewresponse = await apiClient.post("http://localhost:44354/getreview",
        {
            "movie": movieid,
            "user": userid
        });

        if (reviewresponse.data.status == "success") {
            setReview(reviewresponse.data);
        }
        

        console.log(review);

        

    }
    const reviewClicked = () => {
        navigate("/review/" + movie.id);
    };

    const moviePoster = "https://image.tmdb.org/t/p/original/" + movie.poster_path;
    const backPoster = "https://image.tmdb.org/t/p/original/" + movie.backdrop_path;

    useEffect(() => {
        const getData = async () => {
            await getMovie(id);
            await getReview(id);
            await getOtherReviews(id);



        }


        getData();
    }, [id]);

    return (
        <div>
            <div style={{ backgroundImage: `url(${backPoster})`}} className="outer-container-grid">
            <div className="movie-container-grid">
                <div className="div1"><img src={moviePoster} alt="Movie poster" /> </div>
                <div className="div2">
                    <p className="titleCard">
                        <span>{movie.title}</span>
                        <span className="releaseDate">{movie?.release_date ? movie.release_date.split("-")[0] : ''}</span>
                    </p>
                    <p><span className="directedPrefix" >Director: </span> <span className="director">{director}</span></p>
                </div>
                <div className="div3"> <p>{overview}</p> </div>
                <div className="div4">
                    <p className="groupTitles"> Actors </p>
                    <div className="cast">
                        {
                            movie.credits.cast.length > 0 ? (
                            movie.credits?.cast?.slice(0, 9).map(cast =>
                                <a href={ "https://image.tmdb.org/t/p/original/".concat(cast.profile_path) }  className="cast-member"> {cast.name} <span className="tooltiptext">as {cast.character}</span></a>
                            )): (
                                <p className="cast-member"> No cast found</p>
                            )

                            
                        } 
                    </div>
                </div>
                <div className="div5">
                    <p className="groupTitles"> Genres</p>
                    <div className="genres">
                        {
                            movie.genres?.map(genre =>
                                <p className="genre"> {genre.name}</p>
                            )
                        }
                    </div>
                </div>
                <div className="div6">
                    <span>Avergage Rating: </span>
                    <p className="stars">{"★".repeat(Math.round(movie.vote_average / 2))}{"☆".repeat(5 - Math.round(movie.vote_average / 2))} {(movie.vote_average / 2).toFixed(1)}/5</p>
                    
                

                    <button onClick={reviewClicked} className="reviewButtom">+ Leave Review </button>
                </div>
            </div>
            </div>
            {review &&
                    <a href={"../u/" + review.user}>
                        <div className="review-card">
                            <span>Your Review: </span>
                            <p className="yourreview-stars">
                                {"★".repeat(Math.round(review.rating))}
                                {"☆".repeat(5 - Math.round(review.rating))}
                                &nbsp;{review.rating}
                            </p>

                            <p className="review-text"> {review.text}</p>
                        </div>
                    </a>
            }

            {otherReviews &&
            <div className="other-title">
                <h1>Others' Reviews</h1>
            </div>
            
            }

            {
                otherReviews.length > 0 ? (
                otherReviews.map(review =>
                    <a href={"../u/" + review.userID}>
                        <div className="review-card">
                                <span>{review.username}'s' Review: </span>
                                <p className="yourreview-stars">
                                    {"★".repeat(Math.round(review.rating))}
                                    {"☆".repeat(5 - Math.round(review.rating))}
                                    &nbsp;{review.rating}
                                </p>

                                <p className="review-text"> {review.text}</p>
                            </div>
                    </a>
                        
                )): (
                    <div className="noreviews-card"><h1>No reviews found.</h1></div>
                  )

                            
                }

            {otherReviews &&
            <div className="end-title">
            </div>
            
            }





    </div>

    );
}



export default Movie;