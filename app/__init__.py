import os
from flask import Flask, request, redirect, url_for





def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dbaisy.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['DEBUG'] = True

    print('путь к базе', app.config['SQLALCHEMY_DATABASE_URI'])
    from app.main import bp
    app.register_blueprint(bp)
    return app


