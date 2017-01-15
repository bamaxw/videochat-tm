from flask import Flask, render_template, request
from flask_socketio import SocketIO
import sqlite3
from time import gmtime, strftime

app = Flask('videochat-server')
sio = SocketIO(app)

clients = {}

conn = sqlite3.connect('database.db')

c = conn.cursor()
r = c.execute('select name from sqlite_master where type = "table";')
r = r.fetchall()
if not (u'history',) in r:
	c.execute('''CREATE TABLE history (time TEXT user1 TEXT user2 TEXT room TEXT action TEXT)''')
	conn.commit()

class Client:
	def __init__(self, secret, username):
		self.sid = None
		self.username = username
		self.secret = secret
		self.room = None
		self.connected = True

  # Emits data to a socket's unique room
	def emit(self, event, data):
		sio.emit(event, data, room=self.sid)

	def emit_to_room(self, event, data):
		if room:
			sio.emit(event, data, roomt=self.room)
		else:
			print "User {} can't write to room that doesn't exist!".format(self.username)

	def call(self, recipient):
		recipient.emit('call', {'username': self.username, 'room': self.room})

@sio.on('connect')
def connected():
	pass

@sio.on('message')
def receive_message(data):
	print data
	client = clients[request.sid]
	username = data['username']
	client.emit('message', "Received your message {}!".format(username))

@sio.on('signup')
def signup(data):
	print "Signup request: {}".format(data)
	try:
		if 'secret' in data:
			secret = data['secret']
			if secret in clients:
				print "Session for user {} found as {}".format(data['username'], clients[secret].username)
				client = clients[secret]
				client.sid = request.sid
				if data['username'] != 'null':
					print "changing username from {} to {}".format(client.username, data['username'])
					client.username = data['username'];
				client.emit('signup', {'username': client.username, 'success': True})
			else:
				import random
				secret = '%030x' % random.randrange(16**30)
				clients[secret] = Client(secret, data['username'])
				clients[secret].sid = request.sid
				clients[secret].emit('signup', {'username': data['username'], 'secret': secret, 'success': True})
		else:
			import random
			secret = '%030x' % random.randrange(16**30)
			clients[secret] = Client(secret, data['username'])
			clients[secret].sid = request.sid
			clients[secret].emit('signup', {'username': clients[secret].username, 'secret': secret, 'success': True})
	except Exception as e:
		#client = clients[request.sid]
		print e.message
		#client.emit('signup', {'success': False, 'error': e.message})

def get_recipient(recipient):
	for k, v in clients.iteritems():
		if v.username == recipient:
			return v

@sio.on('history')
def history(secret):
	r = c.execute('select * from history')
	clients[secret].emit('history', r.fetchall())
	print "sending data to {}: {}".format(clients[secret], r.fetchall())

@sio.on('call')
def calling(secret, recipient, room):
	r = get_recipient(recipient)
	try:
		if r != None:
			time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
			print time
			c.execute("INSERT INTO history VALUES ({}, {}, {}, {}, {})".format(time, clients[secret].username, recipient, room, "calling"))
			conn.commit()
			r = c.execute("SELECT * from history")
			conn.commit()
			print r.fetchall()
	except Exception:
		pass
	client = clients[secret]
	client.room = room
	client.call(r)
