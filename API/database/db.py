import psycopg2

def initialize_db():
    conn = psycopg2.connect(database="flask_db", user="postgres",password="123456", host="localhost", port="5432") 
    cur = conn.cursor() 
    cur.execute('''CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT);''')
    conn.commit() 
    cur.close() 
    conn.close() 