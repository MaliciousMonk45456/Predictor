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
    cur.execute('''CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT);''')
    conn.commit() 
    cur.close() 
    conn.close() 