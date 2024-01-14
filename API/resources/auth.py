from flask import request
from flask_restful import Resource
import psycopg2
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token,get_jwt_identity,jwt_required
import datetime
import os
from dotenv import load_dotenv
load_dotenv()
import re
from functools import wraps
from resources.errors import SchemaValidationError, UserAlreadyExistsError,InternalServerError,UnauthorizedError,DatabaseError



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
        raise SchemaValidationError
    return decorated

class RegisterApi(Resource):
    @validator
    def post(self):
        try:
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
        except psycopg2.errors.UniqueViolation:
            raise UserAlreadyExistsError
        except psycopg2.errors.IntegrityError:
            raise SchemaValidationError
        except psycopg2.errors.ProgrammingError or psycopg2.errors.InternalError or psycopg2.errors.DataError or psycopg2.errors.NotSupportedError or psycopg2.errors.DatabaseError or psycopg2.errors.InterfaceError or psycopg2.errors.OperationalError:
            raise DatabaseError
        except:
            raise InternalServerError

class LoginApi(Resource):
    def post(self):
        try:
            body = request.get_json()
            conn = psycopg2.connect(database=DATABASE, user=USER, 
                        password=PASSWORD, host=HOST, port=PORT) 
            cur = conn.cursor() 
            cur.execute("SELECT * FROM users WHERE email=(%s);", (body['username'],))
            data = cur.fetchall() 
            # print(data)
            cur.close() 
            conn.close()
            authorized = check_password_hash(data[0][1], body['password'])
            # if not data[0][0]:
            #     raise UserNotExistsError
            if not authorized:
                raise UnauthorizedError
            expires = datetime.timedelta(days=7)
            # expires=datetime.timedelta(weeks=15)
            access_token = create_access_token(identity=data[0][0], expires_delta=expires)
            # print(data[0][0])
            token={"token":access_token}
            return token,200
        except UnauthorizedError:
            raise UnauthorizedError
        except psycopg2.errors.ProgrammingError or psycopg2.errors.InternalError or psycopg2.errors.DataError or psycopg2.errors.NotSupportedError or psycopg2.errors.DatabaseError or psycopg2.errors.InterfaceError or psycopg2.errors.OperationalError:
            raise DatabaseError
        except:
            raise InternalServerError
        
class DeleteApi(Resource):
    @jwt_required()
    def delete(self):
        try:
            email = get_jwt_identity()
            conn = psycopg2.connect(database=DATABASE, user=USER, 
                        password=PASSWORD, host=HOST, port=PORT) 
            cur = conn.cursor() 
            cur.execute("DELETE FROM users WHERE email=(%s);", (email,))
            conn.commit()
            cur.close() 
            conn.close()
            message={"message":"User deleted successfully"}
            return message,200
        except psycopg2.errors.IntegrityError:
            raise SchemaValidationError
        except psycopg2.errors.ProgrammingError or psycopg2.errors.InternalError or psycopg2.errors.DataError or psycopg2.errors.NotSupportedError or psycopg2.errors.DatabaseError or psycopg2.errors.InterfaceError or psycopg2.errors.OperationalError:
            raise DatabaseError
        except:
            raise InternalServerError