from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

class Base(DeclarativeBase):
    pass

engine = create_engine(f'mysql+mysqlconnector://{Cred.user}:{Cred.passw}@{Cred.host}/{Cred.base}', echo=True)
Session = sessionmaker()
Session.configure(bind=engine)
session = Session()
