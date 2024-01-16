from flask import Flask, request
from database.db import initialize_db
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from resources.errors import errors
import os
from flask_mail import Mail
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__) 

JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY")

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

EMAIL=os.getenv("EMAIL")
EMAIL_PASSWORD=os.getenv("EMAIL_PASSWORD")

app.config['MAIL_SERVER']='smtp.gmail.com'  
app.config['MAIL_PORT']=465  
app.config['MAIL_USERNAME'] = EMAIL 
app.config['MAIL_PASSWORD'] = EMAIL_PASSWORD  
app.config['MAIL_USE_TLS'] = False  
app.config['MAIL_USE_SSL'] = True  

api=Api(app,errors=errors)

bcrypt=Bcrypt(app)

jwt = JWTManager(app)

mail = Mail(app) 

initialize_db()

from resources.routes import initialize_routes

initialize_routes(api)

# if __name__ == '__main__': 
