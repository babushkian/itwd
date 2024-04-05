from sqlalchemy import Column, String, Integer, Date, ForeignKey
from app.models import Base



class People(Base):
    __tablename__ = 'people'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    second_name = Column(String(50))
    last_name = Column(String(50))
    birth_date = Column(Date, index=True)
    talent = Column(Integer, index=True)
    start_work = Column(Date)
    current_firm_id = Column(Integer, ForeignKey('firms.id'), default= None,  index=True)
    current_status_id =  Column(Integer, ForeignKey('statuses.id'), default= None,  index=True)
    current_position_id = Column(Integer, ForeignKey('positions.id'), index=True)
    death_date = Column(Date, index=True)
    retire_date = Column(Date, index=True)

    def __repr__(self):
        s = "People < "
        s += f'id: {self.id} {self.last_name} {self.first_name} {self.second_name}, {self.birth_date},'\
        f' талант:{self.talent}'
        s += " >"
        return s