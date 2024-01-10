from flask import request
from flask_restful import Resource
import psycopg2
from flask_bcrypt import generate_password_hash, check_password_hash
from flask import request
from flask_jwt_extended import create_access_token
import datetime

class RegisterApi(Resource):
    def post(self):
        body = request.json
        conn = psycopg2.connect(database="flask_db", user="postgres", 
                            password="123456", host="localhost", port="5432") 
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
        conn = psycopg2.connect(database="flask_db", user="postgres", 
                        password="123456", host="localhost", port="5432") 
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