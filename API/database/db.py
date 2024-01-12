import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()
from resources.errors import SchemaValidationError, UserAlreadyExistsError,InternalServerError,DatabaseError

DATABASE=os.getenv("DATABASE")
USER=os.getenv("USER")
PASSWORD=os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")

def initialize_db():
    try:
        conn = psycopg2.connect(database=DATABASE, user=USER,password=PASSWORD, host=HOST, port=PORT) 
        cur = conn.cursor() 
        # cur.execute("CREATE DOMAIN Email AS TEXT CHECK (VALUE ~* '^[A-Za-z0-9. _%-]+@[A-Za-z0-9. -]+[.][ A-Za-z]+$');")
        cur.execute("CREATE TABLE IF NOT EXISTS users (email Email, password TEXT);")
        # cur.execute("ALTER TABLE users ADD PRIMARY KEY (email);")
        conn.commit() 
        cur.close() 
        conn.close()
    except psycopg2.errors.UniqueViolation:
        raise UserAlreadyExistsError
    except psycopg2.errors.IntegrityError:
        raise SchemaValidationError
    except psycopg2.errors.ProgrammingError or psycopg2.errors.InternalError or psycopg2.errors.DataError or psycopg2.errors.NotSupportedError or psycopg2.errors.DatabaseError or psycopg2.errors.InterfaceError or psycopg2.errors.OperationalError:
        raise DatabaseError
    except:
        raise InternalServerError