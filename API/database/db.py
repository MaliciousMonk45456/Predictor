import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()

DATABASE=os.getenv("DATABASE")
USER=os.getenv("USER")
PASSWORD=os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")

def initialize_db():
    conn = psycopg2.connect(database=DATABASE, user=USER,password=PASSWORD, host=HOST, port=PORT) 
    cur = conn.cursor() 
    # cur.execute("CREATE DOMAIN Email AS TEXT CHECK (VALUE ~* '^[A-Za-z0-9. _%-]+@[A-Za-z0-9. -]+[.][ A-Za-z]+$');")
    cur.execute("CREATE TABLE IF NOT EXISTS users (email Email, password TEXT);")
    # cur.execute("ALTER TABLE users ADD PRIMARY KEY (email);")
    conn.commit() 
    cur.close() 
    conn.close() 