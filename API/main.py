from flask import Flask, request
from database.db import initialize_db
from flask_restful import Api
from resources.routes import initialize_routes
from flask_bcrypt import Bcrypt

from flask_jwt_extended import jwt_required, JWTManager

app = Flask(__name__) 
app.config.from_envvar('ENV_FILE_LOCATION')

api=Api(app)

bcrypt=Bcrypt(app)

jwt = JWTManager(app)

initialize_db()

initialize_routes(api)

if __name__ == '__main__': 
	app.run(debug=True,port=3001) 
