from flask import Flask, render_template, url_for, jsonify, request, Response, session
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from mysite.config import AppConfig, tmdb_api_key as TMDBKey
import os
import requests
import random

from dotenv import load_dotenv


app = Flask(__name__)

app.config.from_object(AppConfig)

server_session = Session(app)

CORS(app, supports_credentials=True)


basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, "users.db")




bcrypt = Bcrypt(app)

db = SQLAlchemy(app)

with app.app_context():
    db.create_all()


from mysite.models import User, Review, Friendship

# https://api.themoviedb.org/3/search/movie?api_key={key}&query=the+avengers
@cross_origin()
@app.route("/getuser")
def home():
    try: 
        cur_user = User.query.filter_by(id=session["user_id"]).first()
        return jsonify({
            "user_id": cur_user.id,
            "username": cur_user.username
        })
    except Exception as e:
        app.logger.warning(e)
        return jsonify({
            "user_id": None,
            "username": None,
            "status": "failure"
        })
    
    
@cross_origin()
@app.route("/searchusers", methods=["POST"])
def searchusers():
    query = request.json["query"]

    users = User.query.filter(User.username.contains(query)).all()
    app.logger.warning(users)

    user_list = []

    for user in users:
        if user.favouriteactor == None:
            fav_actor = None
        else:
            url = f"https://api.themoviedb.org/3/person/{user.favouriteactor}?language=en-US"

            headers = {
                "accept": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjRiNTIwYjViMjhkNDYzMzYwNzExNTkwZWQ2YzBjMyIsInN1YiI6IjY1ZGNiMzczZWQyYWMyMDE4NzQyNzVhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Dr_pRzJEdCm3yYa3LJ-GeTgAZYr40uRjcE2pw_8WqpE"
            }

            response = requests.get(url, headers=headers)
            app.logger.warning(response.json())
            fav_actor = response.json()

        user_list += [{"username": user.username, "id": user.id, "favourite_actor": fav_actor}]

    return jsonify({"users": user_list})
    


@cross_origin()
@app.route("/follow", methods=["POST"])
def follow():
    user = request.json["user"]

    existing = Friendship.query.filter_by(senderID=session["user_id"], recieverID=user).first()

    app.logger.warning(existing)
    if existing == None:
        relationship = Friendship(senderID=session["user_id"], recieverID=user)

        db.session.add(relationship)
        db.session.commit()

        return jsonify({"status": "success"})
    else:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"status": "success"})
    

@cross_origin()
@app.route("/checkfollow", methods=["POST"])
def checkfollow():
    user = request.json["user"]

    existing = Friendship.query.filter_by(senderID=session["user_id"], recieverID=user).first()

    app.logger.warning(existing)
    if existing == None:
        

        return jsonify({"status": "success", "isFollowing": False})
    else:
        
        return jsonify({"status": "success", "isFollowing": True})

@cross_origin()   
@app.route("/editprofile", methods=["POST"])
def editprofile():
    try:
        user = User.query.filter_by(id=session["user_id"]).first()
        user.username = request.json["username"]
        user.email = request.json["email"]
        user.favouritefilm = request.json["favouritefilm"]
        user.favouriteactor = request.json["favouriteactor"]


        db.session.commit()



        return jsonify({"status": "success"})
    except Exception as e:
        raise e
        return jsonify({"status": "failure"})
    
@cross_origin()
@app.route("/getotheruser", methods=["POST"])
def getotheruser():
    userid = request.json["id"]

    user = User.query.filter_by(id=userid).first()

    if user == None:
        return jsonify({"status": "failure", "errormsg": "User not found."})
    
    if (user.id != session["user_id"]) and user.private =="private":
        return jsonify({"status": "failure", "errormsg": "Private profile."})
    
    if (user.id == session["user_id"]):
        email = user.email
    else:
        email = None
    
    reviews_query = Review.query.filter_by(userID=userid).all()

    if reviews_query == None:
        reviews = []
    else:
        reviews = []
        for r in reviews_query:
            data = requests.get(f"https://api.themoviedb.org/3/movie/{r.movieID}?api_key={TMDBKey}&append_to_response=credits")
            film = data.json()
            reviews += [{"id": r.movieID, "movie":film, "text": r.text, "rating": r.rating}]
    
    if user.favouritefilm == None:
        fav_film = None
    else:
        data = requests.get(f"https://api.themoviedb.org/3/movie/{user.favouritefilm}?api_key={TMDBKey}")
        fav_film = data.json()

    if user.favouriteactor == None:
        fav_actor = None
    else:
        url = f"https://api.themoviedb.org/3/person/{user.favouriteactor}?language=en-US"

        headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjRiNTIwYjViMjhkNDYzMzYwNzExNTkwZWQ2YzBjMyIsInN1YiI6IjY1ZGNiMzczZWQyYWMyMDE4NzQyNzVhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Dr_pRzJEdCm3yYa3LJ-GeTgAZYr40uRjcE2pw_8WqpE"
        }

        response = requests.get(url, headers=headers)
        app.logger.warning(response.json())
        fav_actor = response.json()

    followers_query = Friendship.query.filter_by(recieverID=user.id).all()

    if followers_query == None:
        followers = []
    else:
        followers = []
        for f in followers_query:
            follower = User.query.filter_by(id=f.senderID).first()

            if follower.favouritefilm == None:
                follower_fav_actor = None
            else:
                url = f"https://api.themoviedb.org/3/person/{follower.favouriteactor}?language=en-US"

                headers = {
                    "accept": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjRiNTIwYjViMjhkNDYzMzYwNzExNTkwZWQ2YzBjMyIsInN1YiI6IjY1ZGNiMzczZWQyYWMyMDE4NzQyNzVhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Dr_pRzJEdCm3yYa3LJ-GeTgAZYr40uRjcE2pw_8WqpE"
                }

                response = requests.get(url, headers=headers)
                follower_fav_actor = response.json()


            followers += [{"id": follower.id, "username": follower.username, "fav_actor": follower_fav_actor}]
    
    following_query = Friendship.query.filter_by(senderID=user.id).all()

    if following_query == None:
        following = []
    else:
        following = []
        for f in following_query:
            follower = User.query.filter_by(id=f.recieverID).first()

            if follower.favouritefilm == None:
                follower_fav_actor = None
            else:
                url = f"https://api.themoviedb.org/3/person/{follower.favouriteactor}?language=en-US"

                headers = {
                    "accept": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjRiNTIwYjViMjhkNDYzMzYwNzExNTkwZWQ2YzBjMyIsInN1YiI6IjY1ZGNiMzczZWQyYWMyMDE4NzQyNzVhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Dr_pRzJEdCm3yYa3LJ-GeTgAZYr40uRjcE2pw_8WqpE"
                }

                response = requests.get(url, headers=headers)
                follower_fav_actor = response.json()

                
            following += [{"id": follower.id, "username": follower.username, "fav_actor": follower_fav_actor}]
    

    return jsonify({
        "status": "success",
        "user_id": user.id,
        "username": user.username,
        "reviews" : reviews[::-1],
        "followers": followers,
        "following": following,
        "favouritefilm": fav_film,
        "favouriteactor": fav_actor,
        "email": email})
    

@cross_origin()
@app.route("/logout", methods=["GET"])
def logout():
    session.pop("user_id")
    return jsonify({
        "status": "success"
    })

@cross_origin()
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user == None:
        return jsonify({
            "status": "failure",
            "errormsg": "User doesnt exist.",
            "user": None
        })
    
    correct_pass = bcrypt.check_password_hash(user.hashed_password, password)

    if correct_pass == False:
        return jsonify({
            "status": "failure",
            "errormsg": "Password was incorrect.",
            "user": None
        })
    

    session["user_id"] = user.id

    return jsonify({
        "status": "success",
        "errormsg": "",
        "user": session["user_id"]
    })


@app.route("/register", methods=["POST"])
@cross_origin()
def register():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    existingusername = len(User.query.filter_by(username=username).all())
    existingemail = len(User.query.filter_by(email=email).all())

    if existingusername > 0:
        return jsonify({
        "status": "failure",
        "errormsg": "Username already exists!",
        "user_id": None
         })
    
    elif existingemail > 0:
        return jsonify({
        "status": "failure",
        "errormsg": "Email entered is already linked to an account.",
        "user_id": None
         })
    else:
        hash = bcrypt.generate_password_hash(password)
        user = User(username=username, email=email, hashed_password=hash)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            "status": "success",
            "errormsg": "",
            "user_id": user.id
        })
    
@cross_origin()
@app.route("/getmovies", methods=["POST"])
def getmovies():

    query = request.json["query"]
    query = query.replace(" ", "+")

    data = requests.get(f"https://api.themoviedb.org/3/search/movie?api_key={TMDBKey}&query={query}")

    return jsonify(data.json())

@cross_origin()
@app.route("/getmovie", methods=["POST"])
def getmovie():

    id = request.json["id"]

    data = requests.get(f"https://api.themoviedb.org/3/movie/{id}?api_key={TMDBKey}&append_to_response=credits")

    return jsonify(data.json())

@cross_origin()
@app.route("/leavereview", methods=["POST"])
def leavereview():
    movie = request.json["movie"]
    text = request.json["text"]
    rating = request.json["rating"]
    privacy = request.json["privacy"]
    
    app.logger.warning("%s %s %s %s", movie, text, rating, privacy)
    try:
        review = Review(movieID=int(movie), userID=session["user_id"], text=text, rating=rating, privacy=privacy)
        db.session.add(review)
        db.session.commit()
    except Exception as e:
        return jsonify({"status": "failure"})
    
    return jsonify({"status": "success"})

@cross_origin()
@app.route("/getreview", methods=["POST"])
def getreview():
    movie = request.json["movie"]
    user = request.json["user"]

    if 'user_id' in session:
        try:
            review = Review.query.filter_by(movieID=movie, userID=user).first()
            if (user == session["user_id"]) or (review.privacy == "public") or (review.privacy == "unlisted"):
                return jsonify({
                    "status": "success",
                    "review": review.reviewID,
                    "user": review.userID,
                    "movie": review.movieID,
                    "text": review.text,
                    "rating": review.rating})
            else:
                return jsonify({
                    "status": "failure",
                    "errormsg": "You do not have access to this review."
                })
        except Exception as e:
            return jsonify({
                    "status": "failure",
                    "errormsg": "Review not found"
                })
        

        return jsonify({})
        

    return jsonify({"status": "failure"
                    , "errormsg": "You must be logged in to view reviews."})



@cross_origin()
@app.route("/getothersreviews", methods=["POST"])
def getothersreviews():
    movie = request.json["movie"]
    review = Review.query.filter_by(movieID=movie, privacy="public").all()


    all_reviews = [{"userID": r.userID, "id": r.movieID, "text": r.text, "rating": r.rating} for r in review]

    for i in range(0, len(all_reviews)):

        if all_reviews[i]["userID"] == session["user_id"]:
            all_reviews[i] = {}
        else:
            all_reviews[i]["username"] = User.query.filter_by(id=all_reviews[i]["userID"]).first().username

    try:
        all_reviews.remove({})
    except:
        pass
    app.logger.warning(all_reviews)

    return jsonify({"reviews": all_reviews})

@cross_origin()
@app.route("/recommendations", methods=["GET"])
def recommendations():
    user_reviews = Review.query.filter_by(userID=session["user_id"]).order_by(Review.rating.desc()).limit(10).all()

    selected_film = user_reviews[random.randint(0, len(user_reviews)-1)]
    data = requests.get(f"https://api.themoviedb.org/3/movie/{selected_film.movieID}?api_key={TMDBKey}")
    url = f"https://api.themoviedb.org/3/movie/{selected_film.movieID}/recommendations?language=en-US&page=1"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjRiNTIwYjViMjhkNDYzMzYwNzExNTkwZWQ2YzBjMyIsInN1YiI6IjY1ZGNiMzczZWQyYWMyMDE4NzQyNzVhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Dr_pRzJEdCm3yYa3LJ-GeTgAZYr40uRjcE2pw_8WqpE"
    }

    response = requests.get(url, headers=headers)


    return jsonify({"status": "success", "film_based_on": data.json(), "recommendations": response.json()["results"]})

