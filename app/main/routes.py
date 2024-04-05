from flask import render_template, flash, redirect, url_for, request, g, jsonify, current_app
from app.main import bp
from app.models import session

@bp.route('/', methods=['GET'])
def index():
	# return render_template('index.html')
	return "<H1>TEST</H1>"

