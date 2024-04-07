from flask import render_template, flash, redirect, url_for, request, g, jsonify, current_app
from sqlalchemy import select, func, or_
from flask_cors import cross_origin

from app.main import bp
from app.models import session
from app.models.people import People, PeopleStatus, StatusName
from app.models.firms import Firm, FirmName, FirmRating

@bp.route('/', methods=['GET'])
def index():
	q = select(People).limit(20)
	res = session.execute(q).scalars().all()
	for i in res:
		print(i)
	return render_template('index.html', users=res)



@bp.route('/people_status', methods=['GET'])
@cross_origin()
def people_status():
	return render_template('people.html', script='people')


@bp.route('/pstatus/<did>', methods=['GET'])
@cross_origin()
def people_status_json(did):
	max_ids = (select(func.max(PeopleStatus.id))
		 .where(PeopleStatus.status_date <= did)
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
	a = did.split('-')
	a.reverse()
	title = f"Информация о людях на {'.'.join(map(str, a))}"
	order = ["id", "fio", "status", "status_date"]
	header = {"id": 'ID', "fio": 'имя', "status": 'статус', "status_date": 'дата получения статуса'}
	x = jsonify({'title': title, 'order':order,'header':header, 'data': records})

	return x


@bp.route('/firms_status', methods=['GET'])
@cross_origin()
def firms_status():
	return render_template('people.html', script='firms')

@bp.route('/fstatus/<did>', methods=['GET'])
@cross_origin()
def firm_status_json(did):
	maxrec = (select(func.max(FirmRating.id))
		 .where(FirmRating.rate_date <= did)
		 .group_by(FirmRating.firm_id)
		 .cte()
	)
	actual_rating = select(FirmRating).where(FirmRating.id.in_(select(maxrec))).cte()

	q = (select(Firm.id, FirmName.name, Firm.open_date, Firm.close_date,
				actual_rating.c.workers_count, actual_rating.c.rating, actual_rating.c.rate_date)
		 .select_from(Firm)
		 .join(FirmName, Firm.firmname_id == FirmName.id)
	     .join(actual_rating, actual_rating.c.firm_id == Firm.id, isouter=True)
		 .where(or_(Firm.close_date.is_(None), Firm.close_date> did))
		 .where(Firm.open_date <= did)
	)
	res = session.execute(q)
	records = []
	for row in res:
		records.append(row._asdict())
	x = jsonify(records)
	# print(x.json)
	return x

