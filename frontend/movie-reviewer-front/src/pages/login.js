import { useState } from 'react';
import axios from "axios"
import './login.css';
import apiClient from '../apiClient';

import { useNavigate } from "react-router-dom";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alertText, setAlertText] = useState("");
    const navigate = useNavigate();

    const registerClick = async () => {

        setAlertText("")

        const response = await apiClient.post("http://localhost:44354/login", {
            username: username,
            password: password})
            

        console.log(response.data)

        if (response.data.status == "success") {
            navigate("/")

        } else {
            setAlertText(response.data.errormsg)
        }

    };
    return (
        <div className="login">
            <span className="login-panel">
            <h1> Login </h1>


            <span className='alertText'>{alertText}</span>
            <div>
                <span>Username </span>
                <input type="text" onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div>
                <span>Password </span>
                <input type="password" onChange={(e) => setPassword(e.target.value)}  />
            </div>
            <button type="submit" onClick={registerClick}> Login! </button>
            </span>
        </div>

    );
}

export default Login;