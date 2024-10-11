from mysite import db, app
from mysite.models import User

with app.app_context():
    db.drop_all()
    db.create_all()