from flask import Flask, render_template, redirect, Blueprint
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from data import db_session, jobs_api
from data.jobs import Jobs
from data.users import User
from data.log import Login_form
from data.register import Registr_form

app = Flask(__name__)
app.config['SECRET_KEY'] = 'my_secret_key'
login_manager = LoginManager()
login_manager.init_app(app)


def main():
    db_session.global_init("db/mars.db")
    app.register_blueprint(jobs_api.blueprint)
    app.run()

@app.route('/')
def base():
    return render_template("base.html")

@app.route('/memes')
def meme():
    return render_template("meme.html")

@app.route('/index')
def index():
    db_session.global_init("db/mars.db")
    session = db_session.create_session()
    jobs = session.query(Jobs).all()
    users = session.query(User).all()
    names = {u.id: (u.surname, u.name) for u in users}
    return render_template("index.html", jobs=jobs, names=names)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")

@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    return db_sess.get(User, user_id)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = Login_form()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            return redirect("/")
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = Registr_form()
    if form.validate_on_submit():
        if form.password != form.password_again:
            return render_template('register.html', title="Регистрация", form=form,
                                   message="Введенные пароли не совпадают")
        db_sess = db_session.create_session()
        if db_sess.query(User).filter(User.email == form.email.data).first():
            return render_template('register.html', title="Регистрация", form=form,
                                   message="Пользователь с такой почтой уже есть")
        user = User(
            name=form.name.data,
            surname=form.surname.data,
            age=form.age.data,
            position=form.position.data,
            speciality=form.speciality.data,
            address=form.address.data,
            email=form.email.data,
        )
        user.set_password(form.password.data)
        db_sess.add(user)
        db_sess.commit()
        return redirect('/login')
    return render_template('register.html', title="Регистрация", form=form)

if __name__ == '__main__':
    main()