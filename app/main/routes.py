from flask import render_template, flash, redirect, url_for, request, g, jsonify, current_app
from app.main import bp
from app.models import session
from sqlalchemy import select, func
from app.models.people import People, PeopleStatus, StatusName
from flask_cors import cross_origin
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
	return render_template('people.html', test = 'Что-то')


@bp.route('/pstatus/<did>', methods=['GET'])
@cross_origin()
def people_status_json(did):
	max_ids = (select(func.max(PeopleStatus.id))
		 .where(PeopleStatus.status_date <= did)
		 .group_by(PeopleStatus.people_id)
		 .cte()
		 )
	q = (select(People.id, People.last_name, People.first_name, StatusName.name, PeopleStatus.status_date)
		 .select_from(People)
		 .join(PeopleStatus, People.id == PeopleStatus.people_id)
		 .join(StatusName, PeopleStatus.status_id == StatusName.id)
		 .where(PeopleStatus.id.in_(select(max_ids)))
		 )
	res = session.execute(q)
	records = []
	for row in res:
		records.append(row._asdict())
	x = jsonify(records)
	print(x.json)
	return x


