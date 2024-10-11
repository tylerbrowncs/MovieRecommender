import { Routes, Route } from 'react-router-dom';


import Home from './pages/home';
import Profile from './pages/profile';
import Register from './pages/register';
import Login from './pages/login';
import Search from './pages/search';
import Navbar from './navbar';
import Movie from './pages/movie';
import LeaveReview from './pages/leaveReview';
import apiClient from './apiClient';
import EditProfile from './pages/editprofile';


function App() {

    
    return (
        <span>
            <Navbar />
            <div className="app">
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/search" element={<Search />} />
                    <Route exact path="/m/:id" element={<Movie />} />
                    <Route exact path="/review/:id" element={<LeaveReview />} />
                    <Route exact path="/u/:id" element={<Profile />} />
                    <Route exact path="/edit/profile" element={<EditProfile />} />
                </Routes>
            </div>
        </span>

    )
}

export default App;
