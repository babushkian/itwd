import flask
from flask import render_template, flash, redirect, url_for, request, jsonify, current_app
from sqlalchemy import select, func, or_
from sqlalchemy.sql.expression import True_, label

from flask_cors import cross_origin

from app.main import bp
from app.models import session
from app.models.people import People, PeopleFirm, PeoplePosition, PeopleStatus, StatusName, PositionNames
from app.models.firms import Firm, FirmName, FirmRating
from app.models.last_sim_date import LastSimDate

@bp.route('/', methods=['GET'])
def index():
    return redirect(url_for('main.firms_status'))


def get_time_limits():
    # flask.session['start_date'] = None
    # flask.session['end_date'] = None
    sd = flask.session.get('start_date')
    if sd is None:
        sd = PeopleStatus.get_start_date().strftime('%Y-%m-%d')
        flask.session['start_date'] = sd
    fd = flask.session.get('end_date')
    if fd is None:
        fd = LastSimDate.get_end_date().strftime('%Y-%m-%d')
        flask.session['end_date'] = fd
    flask.session.get('current_date')
    if not flask.session.get('current_date'):
        flask.session['current_date'] = sd
    return {'start_date': sd, 'end_date': fd, 'current_date': flask.session['current_date']}


@bp.route('/people_status', methods=['GET'])
@cross_origin()
def people_status():
    tl = get_time_limits()
    prop = {'url': 'pstatus', 'class': 'people'}
    return render_template('people.html', prop=prop, time_limits = tl)


def format_requested_date(did: str) -> str:
    a = did.split('-')
    a.reverse()
    return '.'.join(map(str, a))


@bp.route('/pstatus/', methods=['GET'])
@cross_origin()
def people_status_json():
    cur_date = request.args.get('date')
    flask.session['current_date'] = cur_date
    max_ids = (select(func.max(PeopleStatus.id))
               .where(PeopleStatus.status_date <= cur_date)
               .group_by(PeopleStatus.people_id)
               .cte()
               )
    q = (select(People.id,
                func.concat(People.last_name, ' ', People.first_name, ' ', People.second_name).label('fio'),
                StatusName.name.label('status'), PeopleStatus.status_date)
         .select_from(People)
         .join(PeopleStatus, People.id == PeopleStatus.people_id)
         .join(StatusName, PeopleStatus.status_id == StatusName.id)
         .where(PeopleStatus.id.in_(select(max_ids)))
         .order_by(People.id)
         )
    res = session.execute(q)
    records = []
    for row in res:
        records.append(row._asdict())

    title = f"Информация о людях на {format_requested_date(cur_date)}"
    header = {"id": 'ID', "fio": 'имя', "status": 'статус', "status_date": 'дата получения статуса'}
    order = [i for i in header.keys()]
    return {'title': title, 'order': order, 'header': header, 'data': records}


@bp.route('/firms_status', methods=['GET'])
@cross_origin()
def firms_status():
    tl = get_time_limits()
    prop = {'url': 'fstatus', 'class': 'firms'}
    return render_template('people.html', prop=prop, time_limits = tl)


@bp.route('/fstatus', methods=['GET'])
@cross_origin()
def firm_status_json():
    cur_date = request.args.get('date')
    flask.session['current_date'] = cur_date
    maxrec = (select(func.max(FirmRating.id))
              .where(FirmRating.rate_date <= cur_date)
              .group_by(FirmRating.firm_id)
              .cte()
              )
    actual_rating = select(FirmRating).where(FirmRating.id.in_(select(maxrec))).cte()
    active_firms = (select(Firm.id, label('active', True))
                    .where(or_(Firm.close_date.is_(None), Firm.close_date > cur_date))
                    .where(Firm.open_date <= cur_date).cte())


    q = (select(Firm.id, FirmName.name, Firm.open_date, Firm.close_date,
                actual_rating.c.workers_count, actual_rating.c.rating, actual_rating.c.rate_date, active_firms.c.active)
                .select_from(Firm)
                .join(FirmName, Firm.firmname_id == FirmName.id)
                .join(actual_rating, actual_rating.c.firm_id == Firm.id, isouter=True)
                .join(active_firms, active_firms.c.id == Firm.id, isouter=True )
                )

    res = session.execute(q)
    records = []
    for row in res:
        records.append(row._asdict())

    title = f"Информация о фирмах на {format_requested_date(cur_date)}"
    header = {"id": 'ID', "name": 'название', 'open_date': 'дата открытия', 'close_date': 'дата закрытия',
              'workers_count': 'количество работников', 'rating': 'рейтинг', 'rate_date': 'дата рейтинга', }
    order = [i for i in header.keys()]
    return {'title': title, 'order': order, 'header': header, 'data': records}


@bp.get('/rating_history')
@cross_origin()
def rating_history_json():
    cur_date = request.args.get('date')
    firm_id = request.args.get('firm')
    q = (select(FirmRating.workers_count, FirmRating.rating, FirmRating.rate_date)
         .where(FirmRating.firm_id == firm_id)
         .where(FirmRating.rate_date <= cur_date))
    res = session.execute(q)
    records = []
    for row in res:
        records.append(row._asdict())

    header = {'rate_date': 'дата рейтинга', 'rating': 'рейтинг', 'workers_count': 'количество работников'}
    order = [i for i in header.keys()]
    return {'order': order, 'header': header, 'data':records}

@bp.get('/current_staff')
@cross_origin()
def current_staff():
    cur_date = request.args.get('date')
    firm_id = request.args.get('firm')
    firm_last_event = (select(func.max(PeopleFirm.id))
                       .where(PeopleFirm.move_to_firm_date <= cur_date)
                       .group_by(PeopleFirm.people_id)
                       .cte()
                       )
    assignments = (select(PeopleFirm)
                   .where(PeopleFirm.id.in_(select(firm_last_event)))
                   .where(PeopleFirm.firm_to_id == firm_id)
                   .cte()
                   )

    pep_pos_ids = (select(func.max(PeoplePosition.id))
                   .where(PeoplePosition.people_id.in_(select(assignments.c.people_id)))
                   .where(PeoplePosition.move_to_position_date < cur_date)
                   .group_by(PeoplePosition.people_id)
                   .cte()
                   )
    pep_pos = (select(PeoplePosition)
               .where(PeoplePosition.id.in_(select(pep_pos_ids)))
               .cte()
               )

    q = (select(People.id, func.concat(People.last_name, ' ', People.first_name, ' ', People.second_name).label('fio'),
                People.talent, PositionNames.name.label('position'), pep_pos.c.move_to_position_date.label('position_date'),
                assignments.c.move_to_firm_date.label('assign_date'))
                .select_from(People)
                .join(pep_pos, pep_pos.c.people_id == People.id)
                .join(PositionNames, pep_pos.c.position_id ==PositionNames.id)
                .join(assignments, pep_pos.c.people_id == assignments.c.people_id)
                .order_by(pep_pos.c.position_id.desc(), assignments.c.move_to_firm_date)
         )
    res = session.execute(q)
    records = []
    for row in res:
        records.append(row._asdict())
    header = {'id': 'ID', 'fio': 'ФИО',  'talent': 'талант',  'position': 'должность',
              'position_date': 'в должности с ',  'assign_date': 'работает с'}
    order = [i for i in header.keys()]
    return {'order': order, 'header': header, 'data':records}

