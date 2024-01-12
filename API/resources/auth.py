from flask import request
from flask_restful import Resource
import psycopg2
from flask_bcrypt import generate_password_hash, check_password_hash
from flask import request
from flask_jwt_extended import create_access_token
import datetime
import os
from dotenv import load_dotenv
load_dotenv()
import re
from functools import wraps

DATABASE=os.getenv("DATABASE")
USER=os.getenv("USER")
PASSWORD=os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")

def validator(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        body = request.get_json()
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"
        pat = re.compile(reg)
        if(re.fullmatch(regex, body['username']) and re.search(pat, body['password'])):
            return f(*args, **kwargs)
        return {"message":"Please enter valid email and password"},400
    return decorated

class RegisterApi(Resource):
    @validator
    def post(self):
        body = request.json
        conn = psycopg2.connect(database=DATABASE, user=USER, 
                            password=PASSWORD, host=HOST, port=PORT) 
        cur = conn.cursor() 
        password = generate_password_hash(body['password']).decode('utf8')
        cur.execute("INSERT INTO users (email, password) VALUES (%s,%s);",(body['username'],password))
        conn.commit()
        cur.close() 
        conn.close()
        message={"message":"User created successfully"}
        return message,200


class LoginApi(Resource):
    def post(self):
        body = request.get_json()
        conn = psycopg2.connect(database=DATABASE, user=USER, 
                        password=PASSWORD, host=HOST, port=PORT) 
        cur = conn.cursor() 
        cur.execute("SELECT * FROM users WHERE email=(%s);", (body['username'],))
        data = cur.fetchall() 
        cur.close() 
        conn.close()
        authorized = check_password_hash(data[0][1], body['password'])
        if not authorized:
            message={"message":"Email or password invalid"}
            return message,400

        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=data[0][0], expires_delta=expires)
        # print(data[0][0])
        token={"token":access_token}
        return token,200
    
# class DeleteApi(Resource):
#     def delete(self):
#         body = request.get_json()
#         conn = psycopg2.connect(database=DATABASE, user=USER, 
#                         password=PASSWORD, host=HOST, port=PORT) 
#         cur = conn.cursor() 
#         cur.execute("DELETE FROM users WHERE email=(%s);", (body['username'],))
#         conn.commit()
#         cur.close() 
#         conn.close()
#         message={"message":"User deleted successfully"}
#         return message,200