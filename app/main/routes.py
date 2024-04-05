from flask import render_template, flash, redirect, url_for, request, g, jsonify, current_app
from app.main import bp
from app.models import session
from sqlalchemy import select
from app.models.people import People

@bp.route('/', methods=['GET'])
def index():
	q = select(People).limit(20)
	res = session.execute(q).scalars().all()
	for i in res:
		print(i)
	return render_template('index.html', users=res)


