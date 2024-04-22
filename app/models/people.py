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

class PeopleFirm(Base):
    """Таблица показывает, в каких фирмах работали люди. Из какой фирмы пришли и в какой день
    устроились на новое место"""
    __tablename__ = 'people_firms'
    id = Column(Integer, primary_key=True)
    people_id = Column(Integer, ForeignKey('people.id'))
    firm_from_id = Column(Integer)
    firm_to_id = Column(Integer, ForeignKey('firms.id'))
    move_to_firm_date = Column(Date, index=True)
    __table_args__ = (Index('ix_people_firms_people_id_firm_id', people_id, firm_to_id),)

    def __repr__(self):
        return f"<PeopleFirm people_id= {self.people_id} from_firm= {self.firm_from_id} to_firm={self.firm_to_id} date {self.move_to_firm_date}>"

class PeoplePosition(Base):
    """
    Промежуточная таблица, связывающая людей и их должности
    """

    __tablename__ = 'people_positions'
    id = Column(Integer, primary_key=True)
    people_id = Column(Integer, ForeignKey('people.id'))
    position_id = Column(Integer, ForeignKey('positions.id'))
    move_to_position_date = Column(Date, index=True)
    __table_args__ = (Index('ix_people_positions_people_id_pos_id', people_id, position_id),)

    def __repr__(self):
        return f"<PepPos {self.people_id=} {self.position_id=} date {self.move_to_position_date}>"

class PositionNames(Base):
    """Словарь названий позиций"""
    __tablename__ = 'positions'
    id = Column(Integer, primary_key=True)
    name = Column(String(70))

