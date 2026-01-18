from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv('SQLALCHEMY_DB_URL')

print("Current working directory:", os.getcwd())  # Check if the .env file is in this directory
print("Database URL from .env:", os.getenv('SQLALCHEMY_DB_URL'))  # Should print your DB URL


SQLALCHEMY_DB_URL = DB_URL

engine = create_engine(SQLALCHEMY_DB_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()