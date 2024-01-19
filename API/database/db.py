import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()
from resources.errors import SchemaValidationError, UserAlreadyExistsError,InternalServerError,DatabaseError
import urllib.parse as up

up.uses_netloc.append("postgres")
url = up.urlparse(os.environ["DATABASE_URL"])

DATABASE=url.path[1:]
USER=url.username
PASSWORD=url.password
HOST=url.hostname
PORT=url.port

def initialize_db():
    try:
        conn = psycopg2.connect(database=DATABASE, user=USER,password=PASSWORD, host=HOST, port=PORT) 
        cur = conn.cursor() 
        # cur.execute("CREATE DOMAIN Check_Email AS TEXT CHECK (VALUE ~* '^[A-Za-z0-9. _%-]+@[A-Za-z0-9. -]+[.][ A-Za-z]+$');")
        cur.execute("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT);")
        cur.execute("CREATE TABLE IF NOT EXISTS otp(email TEXT REFERENCES users(email) on update cascade on delete cascade PRIMARY KEY,otp INT,created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);")
        conn.commit() 
        cur.close() 
        conn.close()
        # print("Initialized Database")
    except psycopg2.errors.UniqueViolation:
        raise UserAlreadyExistsError
    except psycopg2.errors.IntegrityError:
        raise SchemaValidationError
    except psycopg2.errors.ProgrammingError or psycopg2.errors.InternalError or psycopg2.errors.DataError or psycopg2.errors.NotSupportedError or psycopg2.errors.DatabaseError or psycopg2.errors.InterfaceError or psycopg2.errors.OperationalError:
        raise DatabaseError
    except:
        raise InternalServerError