import { useState } from 'react';
import axios from "axios"
import './register.css';

import { useNavigate } from "react-router-dom";

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPass, setconfPass] = useState("");
    const [alertText, setAlertText] = useState("");

    const navigate = useNavigate();

    const registerClick = () => {
        if (email=="" || password=="" || email=="" || confPass=="") 
        {
            setAlertText("Not all required details where entered.")
        } else if (password != confPass) {
            setAlertText("Passwords do not match.")
        } else if (username.length < 6) {
            setUsername("")
            setAlertText("Username should be 6 or more characters.")
        } else if (password.length < 8) {
            setAlertText("Password should be 8 or more characters.")
        } else {
            setAlertText("")
            axios.post("http://localhost:44354/register", {
                username: username,
                email: email,
                password: password })
            .then((response) =>{

                if (response.data.status == "success") {
                    navigate("/login");

                } else {
                    setAlertText(response.data.errormsg)
                }

                
            })
        }
        setPassword("")
        setconfPass("")
    }


    return (

        <div className="register">
            <span className="register-panel">
            <h1> Register </h1>


            <span className="alertText">{alertText}</span>
            <div>
                <span>Username </span>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            
            <div>
                <span>Email </span>
                <input type="text" onChange={(e) => setEmail(e.target.value)}  />
            </div>

            <div>
                <span>Password </span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  />
            </div>

            <div>
                <span>Password Confirmation </span>
                <input type="password" value={confPass} onChange={(e) => setconfPass(e.target.value)}  />
            </div>
.
            <button type="submit" onClick={registerClick}> Register </button>
            </span>
        </div>

    );
}

export default Register;