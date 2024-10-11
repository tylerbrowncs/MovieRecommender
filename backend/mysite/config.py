from dotenv import load_dotenv
load_dotenv()
import redis, os

tmdb_api_key = "024b520b5b28d463360711590ed6c0c3"

class AppConfig:
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI= 'sqlite:///' + os.path.join(basedir, "users.db")
    CORS_HEADERS = 'Content-Type'
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = False
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
    SECRET_KEY = 'bda191b04de31ce993e85f79a304a71c08aa8d041a7c3b71'