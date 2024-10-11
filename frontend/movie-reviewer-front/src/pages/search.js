// https://api.themoviedb.org/3/search/movie?api_key=024b520b5b28d463360711590ed6c0c3&query=the+avengers

import React, { useState } from 'react';
import { useEffect } from 'react';
import MovieCard from './MovieCard';
import SearchIcon from './search.svg';

import './search.css';
import apiClient from '../apiClient';
// 9b808b0b

const API_URL = 'http://www.omdbapi.com?apikey=9b808b0b'

const Search = () => {

    const [movies, setMovies] = useState([]);
    const [moviesResults, setMoviesResults] = useState(false);
    const [usersResults, setUsersResults] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);

    const searchMovies = async (title) => {
        setSearchTerm(title);
        const response = await apiClient.post("http://localhost:44354/getmovies",
        {
            "query": title
        })
        const data = response.data.results;
        if (response.data.results.length > 0) {
            setMoviesResults(true)
        }

        setMovies(data);

        if (title !== '') {

            const response2 = await apiClient.post("http://localhost:44354/searchusers",
            {
                "query": title
            })
            const data2 = response2.data.users;

            if (response2.data.users.length > 0) {
                setUsersResults(true)
            }

            setUsers(data2)
            console.log(data2)
        }
    }

    const delayedSearchMovies = async (title) => {
        setSearchTerm(title);
        setTimeout(() => {
            searchMovies(searchTerm);
        }, 10)}


    useEffect(() =>{

        searchMovies('');

    }, [])

    return (
        <div className="searchPage">
            <div className="search">
                <input
                placeholder="Search"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={(e) => searchMovies(searchTerm)}>🔍</button>
            </div>

            <div className="allUsers">
                {
                    users.map(user =>
                        <a className='user' href={"/u/"+user.id}> 
                            <div className="userSearchIMG" style={{ backgroundImage: `url(${"https://image.tmdb.org/t/p/original/".concat( user.favourite_actor.profile_path)})`}}> 
                                <p>{user.username} </p>
                            </div>
                        </a>
                    )
                }

            </div>
            { !usersResults ?
                <h1> No User Results</h1> : null}
            { !moviesResults ?
                <h1> No Movie Results</h1> : null}
            <div className="allMovies">
                {
                    movies.map(movie =>
                        <MovieCard movie={movie} />
                    )
                }
            </div>
        </div>
    )
}

export default Search;