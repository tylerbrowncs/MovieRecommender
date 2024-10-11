import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import "./leaveReview.css";


const LeaveReview = () => {
    const { id } = useParams();

    const [movie, setMovie] = useState({ credits: {} });
    const [reviewText, setRT] = useState("");
    const [rating, setRating] = useState(0);
    const [privacy, setPrivacy] = useState("public");
    const navigate = useNavigate();



    const moviePoster = "https://image.tmdb.org/t/p/original/" + movie.poster_path;


    const reviewTextChanged = (e) => {
        setRT(e.target.value);
    }

    const ratingChange = (e) => {
        setRating(e.target.value);
    }

    const privacyChange = (e) => {
        setPrivacy(e.target.value);
    }

    const submitClickled = async () => {
        const response = await apiClient.post("http://localhost:44354/leavereview",
        {
            "movie": movie.id,
            "text": reviewText,
            "rating": rating,
            "privacy": privacy
        })

        if (response.data.status == "success") {    
            navigate("/m/" + movie.id);
        }

    }


    useEffect(() => {

        const getMovie = async (id) => {
            const response = await apiClient.post("http://localhost:44354/getmovie",
                {
                    "id": id
                })


            setMovie(response.data);

        }

        getMovie(id);



    }, []);

    return (
        <div className="review-container">

            <div className="image">
                <img src={moviePoster} alt="movie poster" />
            </div>

            <div className="title">
                <span>{movie.title}</span>
                <span className="releaseDate">{movie?.release_date ? movie.release_date.split("-")[0] : ''}</span>
            </div>
            <div className="text-enter">
                <textarea onChange={reviewTextChanged} placeholder="Enter your review or leave empty." rows="20" cols="50">
                </textarea>
            </div>
            <div className="rating-enter">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet" />
                <div class="rate">
                    <input onChange={ratingChange} type="radio" id="star5" name="rating" value="5" />
                    <label for="star5" title="Awesome"></label>

                    <input onChange={ratingChange} type="radio" id="star4.5" name="rating" value="4.5" />
                    <label for="star4.5" class="half"></label>

                    <input onChange={ratingChange} type="radio" id="star4" name="rating" value="4" />
                    <label for="star4"></label>

                    <input onChange={ratingChange} type="radio" id="star3.5" name="rating" value="3.5" />
                    <label for="star3.5" class="half"></label>
                    
                    <input onChange={ratingChange} type="radio" id="star3" name="rating" value="3" />
                    <label for="star3"></label>

                    <input onChange={ratingChange} type="radio" id="star2.5" name="rating" value="2.5" />
                    <label for="star2.5" class="half"></label>

                    <input onChange={ratingChange} type="radio" id="star2" name="rating" value="2" />
                    <label for="star2"></label>

                    <input onChange={ratingChange} type="radio" id="star1.5" name="rating" value="1.5" />
                    <label for="star1.5" class="half"></label>

                    <input onChange={ratingChange} type="radio" id="star1" name="rating" value="1" />
                    <label for="star1"></label>

                    <input onChange={ratingChange} type="radio" id="star0.5" name="rating" value="0.5" />
                    <label for="star0.5" class="half"></label>

                </div>
            </div>
            <div className="pubpriv-enter">
            <label for="privacy">Choose a privacy setting:</label>
                <select onChange={privacyChange} name="privacy">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                </select>
            </div>
            <div className="button"> <button type="submit" onClick={submitClickled}>Submit Review</button> </div>
            <div className="extra"> </div>
        </div>
    )
}


export default LeaveReview;
