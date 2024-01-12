from flask import Flask, request
from database.db import initialize_db
from flask_restful import Api
from resources.routes import initialize_routes
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from resources.errors import errors
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__) 

JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY")

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

api=Api(app,errors=errors)

bcrypt=Bcrypt(app)

jwt = JWTManager(app)

initialize_db()

initialize_routes(api)

if __name__ == '__main__': 
	app.run(debug=True,port=3001) 
