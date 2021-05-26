from flask import Flask, render_template, request, redirect, url_for
from werkzeug.exceptions import RequestEntityTooLarge
from services.get_trello import trello_data, card_remove, card_add
import sys

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def start():
   if request.method == "POST":
      if request.form.get("remove"):
         card_remove(request.form.get("remove"))
      elif request.form.get("add"):
         card_add(request.form.get("list_name"), request.form.get("add"))
      return redirect(request.url)
   trello_dict = trello_data()
   return render_template('index.html', trello_dict = trello_dict.items())

if __name__ == '__main__':
   app.run()