import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import Select from "react-select";

import "./editprofile.css";
const EditProfile = () => {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);
    const [optionsFilm, setOptionsFilm] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [selectedActor, setSelectedActor] = useState(null);
    const [optionsActor, setOptionsActor] = useState([]);
    const [username, setUsername] = useState(null);
    const [errormsg, setErrormsg] = useState("");
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();
    const [icon, setIcon] = useState("https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg");

    const submit = async () => {
        console.log(selectedActor)
        console.log(selectedFilm)

        const response3 = await apiClient.post("http://localhost:44354/editprofile",
            {
                "username": username,
                "email": email,
                "favouriteactor": selectedActor.value,
                "favouritefilm": selectedFilm.value

            })

            if (response3.data.status == "success") {

                navigate("/u/".concat(user.user_id))
            } else {
                setErrormsg("Could not edit profile")
            }
}

    useEffect(() => {
        async function getCurrentUser() {
            const response = await apiClient.get("http://localhost:44354/getuser")


            const response2 = await apiClient.post("http://localhost:44354/getotheruser",
            {
                "id": response.data.user_id
            })

            setUser(response2.data)
        
            setEmail(response2.data.email)
            setUsername(response2.data.username)

            if (response2.data.favouriteactor) {
                setIcon("https://image.tmdb.org/t/p/original/".concat(response2.data.favouriteactor.profile_path))

                setSelectedFilm({
                    "value":response2.data.favouritefilm.id,
                    "label": response2.data.favouritefilm.title
                })

                setSelectedActor({
                    "value":response2.data.favouriteactor.id,
                    "label": response2.data.favouriteactor.name
                })
            }

            var allFilmsChoice = []
            var allActorsChoice = []

            for (let i =0; i < response2.data.reviews.length; i++){
                allFilmsChoice.push(
                    {
                        "value": response2.data.reviews[i].id,
                        "label": response2.data.reviews[i].movie.title
                
                })

                

                for (let j = 0; j < response2.data.reviews[i].movie.credits.cast.length; j++){

                    allActorsChoice.push({
                        "value": response2.data.reviews[i].movie.credits.cast[j].id,
                        "label": response2.data.reviews[i].movie.credits.cast[j].original_name,
                        "profile_path": response2.data.reviews[i].movie.credits.cast[j].profile_path
                    })

                }

                

            }
            console.log(response2.data)

            setOptionsActor(allActorsChoice);
            setOptionsFilm(allFilmsChoice);
        
        }

        getCurrentUser();
    }, []);


    return (

        <div className="container">
            <h1> { errormsg }</h1>
            {user &&

                <div className="grid-parent">   
                    <div className="username-area">
                        <p className="titlesabove">Username: </p>
                        <input className="editinputs" onChange={(e) => setUsername(e.target.value)} value={username}/>
                    </div>
                    <div className="email-area">
                        <p className="titlesabove">Email: </p>
                        <input className="editinputs" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </div>
                    <div className="pfp-area"> 
                        <img src={icon}/> 
                    </div>
                    <div className="film-area">
                        <p className="titles"> Favourite Film: </p>
                        <Select className="selector" options={optionsFilm} value={selectedFilm} onChange={setSelectedFilm} />
                    </div>
                    <div className="actor-area">
                        <p className="titles">Favourite Actor: </p>
                        <Select className="selector" options={optionsActor} value={selectedActor} onChange={setSelectedActor} />
                    </div>
                    <div className="privacy-area"> </div>
                    <button className="submitButton" onClick={submit}>Submit</button>
                </div>
        
            
            }
        </div>
    )
}
export default EditProfile;