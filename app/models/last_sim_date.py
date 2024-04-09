from sqlalchemy import select, Column, String, Integer, Date, ForeignKey, Index
from app.models import Base, session
class LastSimDate(Base):
    __tablename__ = 'last_sim_date'
    id = Column(Integer, primary_key=True)
    date = Column(Date)

    @staticmethod
    def get_end_date():
        q = select(LastSimDate.date)
        r = session.execute(q).scalar()
        return r


