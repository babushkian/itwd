from sqlalchemy import Column, String, Integer, Date, ForeignKey, Boolean
from app.models import Base

class Firm(Base):
    session = None
    __tablename__ = 'firms'
    id = Column(Integer, primary_key=True)
    firmname_id = Column(Integer, ForeignKey('firmnames.id'))
    last_rating = Column(Integer)
    open_date = Column(Date)
    close_date = Column(Date)


class FirmName(Base):
    __tablename__ = 'firmnames'
    id = Column(Integer, primary_key=True)
    name = Column(String(70))
    used = Column(Boolean, default=False)

    def __repr__(self):
        return f'<FirmName  id:{self.id} "{self.name}"  used: {self.used}>'

class FirmRating(Base):
    __tablename__ = 'firm_ratings'
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey('firms.id'))
    rating = Column(Integer)
    workers_count = Column(Integer)
    rate_date = Column(Date)

