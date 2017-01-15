import React from 'react';
import cookie from 'react-cookie';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000')
socket.on('message', function(data) {
	console.log(data);
});

var App = React.createClass({

	getInitialState: function() {
		var username = cookie.load('username');
		var secret = cookie.load('secret');
		if (username !== null && secret !== null) {
			socket.emit('signup', {username: username, secret: secret});
			return {
				username: username
			};
		} else {
			return {username: null};
		}
	},

	componentDidMount: function() {
		socket.on('signup', data => {
			console.log('received signup');
			console.log(data);
			var newState = Object.assign({}, this.state);
			if (data.success) {
				if (data.secret) {
					var secret = data.secret;
					cookie.save('secret', secret);
				} else {
					if (cookie.load('secret') === undefined) {
						cookie.remove('user');
						window.location = "/"
					}
				}
				var username = data.username;
				cookie.save('username', username);
				newState.username = username;
				console.log('authenticated as: ' + username);
			} else {
				newState.error = data.error;
				console.log(newState.error);
			}
			this.setState(newState);
		});
		socket.on('call', data => {
			alert(data.username + ' is calling you in room ' + data.room);
			cookie.save('room', data.room);
			alert(cookie.load('room'));
			window.location = "/#/calling/" + data.username;
		});
	},

	_onUserName: function(e) {
		if (e.nativeEvent.keyCode !== 13) return;
    var name = e.target.value;
		socket.emit('signup', {username: name});
	},

	_viewContacts: function() {
		window.location = '/#/contacts';
	},

	_viewHistory: function() {
		window.location = '/#/history';
	},

	_makeCall: function() {
		window.location = '/#/newcall';
	},

	_logout: function() {
		this.setState({username: null});
		cookie.remove('username');
	},

  render: function() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to VideoChat</h2>
        </div>
				{ !this.state.username ?
        	<div>
						<p>Type in your username</p>
						<input onKeyPress={this._onUserName}/>
					</div>
				:
					<div>
						<div>
							<h3>Welcome { this.state.username }!</h3>
						</div>
						<div>
							<button onClick={this._makeCall}>New Call</button>
							<button onClick={this._viewHistory}>View History</button>
							<button onClick={this._logout}>Logout</button>
						</div>
					</div>
				} 
      </div>
    );
  }
});

export default App;
