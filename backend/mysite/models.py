from datetime import datetime
from mysite import db
from uuid import uuid4

def get_id():
    return uuid4().hex

class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_id)
    username = db.Column(db.String(25), unique=True)
    email = db.Column(db.String(50), unique=True)
    private = db.Column(db.String(10), default="public")
    favouritefilm = db.Column(db.Integer)
    favouriteactor = db.Column(db.Integer)
    hashed_password = db.Column(db.String(100), unique=True)

    def __repr__(self):
        return f"User('{self.username}')"
    
class Review(db.Model):
    reviewID = db.Column(db.String(32), primary_key=True, default=get_id)
    movieID = db.Column(db.Integer)
    userID = db.Column(db.String(32), db.ForeignKey('user.id'))
    text = db.Column(db.String(500))
    rating = db.Column(db.Float)
    privacy = db.Column(db.String(10))
    
    def __repr__(self):
        return f"Review({self.movieID} by {self.userID})"
    
class Friendship(db.Model):
    friendshipID = db.Column(db.Integer, primary_key=True)
    senderID = db.Column(db.Integer, db.ForeignKey('user.id'))
    recieverID = db.Column(db.Integer, db.ForeignKey('user.id'))
    accepted = db.Column(db.Boolean)
