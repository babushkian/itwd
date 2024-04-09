from sqlalchemy import select, Column, String, Integer, Date, ForeignKey, Index
from app.models import Base, session



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

class StatusName(Base):
    '''
    таблица содержит перечисление разных статусов человека: безработный, работает, пенсионер, умер
    фактически нужна для извлечения названий статусов человека
    '''
    __tablename__ = 'statuses'
    id = Column(Integer, primary_key=True)
    name = Column(String(200))

    def __repr__(self):
        return f'Status {self.id} {self.name}'

class PeopleStatus(Base):
    '''
    состояния в которых находятся люди: молод для работы, работает, пенсионер
    имеется калонка "дата" - когда человек перешел в указанное состояние
    '''
    __tablename__ = 'people_status'
    id = Column(Integer, primary_key=True)
    people_id = Column(Integer, ForeignKey('people.id'))
    status_id = Column(Integer, ForeignKey('statuses.id'))
    status_date = Column(Date, index=True)
    __table_args__ = (Index('ix_people_status_people_id_status_id', people_id, status_id),)

    @staticmethod
    def get_start_date():
        q = select(PeopleStatus)
        r = session.execute(q).scalars().first()
        print(r)
        return r.status_date

