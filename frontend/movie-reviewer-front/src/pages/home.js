
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import apiClient from '../apiClient';
import "./home.css";


const Home = () => {


    const [user, setUser] = useState(null);
    const [basedOn, setBasedOn] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    const [recommendationExist, setRecommendationExists] = useState(false)

    useEffect(() => {
        async function getUser() {
            const response = await apiClient.get("http://localhost:44354/getuser")

            setUser(response.data.username)

            if (response.data.username == null) {
                navigate("/login")

            }
        }

        async function getRecommendations() {
            const response = await apiClient.get("http://localhost:44354/recommendations")
            setBasedOn(response.data.film_based_on)
            if (response.data.recommendations.length > 0) {
                setRecommendationExists(true)
            }
            setRecommendations(response.data.recommendations)
        }
        getUser();
        getRecommendations();
        console.log(recommendations)
    }, [])

    return (
        <div className="home">
        {!recommendationExist ? <div className="recc_container"><h1> No recommendation</h1></div>:
        <div className="recc_container">
            <h1> Because you liked {basedOn?.original_title}</h1>
            <div className="recommendations">
                {recommendations.slice(0, 8).map((r) => (
                    
                        <div className="recommendation">
                            <a href={"/m/" + r.id}>
                            <img src={"https://image.tmdb.org/t/p/original/" + r.poster_path} />
                            <h3>{r.title}</h3>
                            </a>
                        </div>
                ))}
            </div>
        </div>
}
        </div>

    );
}

export default Home;