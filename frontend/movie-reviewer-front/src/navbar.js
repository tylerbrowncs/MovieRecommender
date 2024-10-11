import './navbar.css';
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import apiClient from './apiClient';

const Navbar = () => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const logout = async () => {
        const response = await apiClient.get("http://localhost:44354/logout")

        if (response.data.status == "success") {
            navigate("/");


        }
    }
    useEffect(() => {
        async function getUser() {
            const response = await apiClient.get("http://localhost:44354/getuser")

            if (response.data.user_id == null) {
                setUser(null)
            } else {
                setUser(response.data)
            }
        }

        getUser();

    })

    

    if (user == null) {
        return (
            <div className="navbar">
                <h1 className="navTitle">SCREENSCORE</h1>
                <ul className="navRight">
                    <li><Link to={'/login'}>LOGIN</Link></li>
                    <li><Link to={'/register'}>REGISTER</Link></li>
                </ul>
            </div>
        )

    } else {
        return (
            <div className="navbar">
                <h1 className="navTitle">SCREENSCORE</h1>
                <ul className="navRight">
                    <li><Link to={'/'}>HOME</Link></li>
                    <li><Link to={'/search'}>SEARCH</Link></li>
                    <li><a href={'/u/' + user.user_id }>{ (user.username).toUpperCase() }</a></li>
                    <li><a href="#" onClick={logout}>LOGOUT</a></li>
                </ul>
            </div>
        )

    }
}

export default Navbar;