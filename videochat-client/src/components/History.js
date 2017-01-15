import React from 'react';
import cookie from 'react-cookie';
import './App.css';

import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

var History = React.createClass({

	getInitialState() {
		var username = cookie.load('username');
		var secret = cookie.load('secret');
		socket.emit('history', secret);
		if (secret) {
			return {
				history: [],
				username: username
			};
		} else {
			window.location = '/';
		}
	},

	componentDidMount: function() {
		socket.on('history', data => {
			var newState = Object.assign({}, this.state);
			newState['history'] = data.history;
		});
	},

	render: function() {
		return (
			<div>
				<h1>We're making history!</h1>
				<ul>
				{this.state.history.map((x) => <li>{x.time}: {x.user1} {x.action} {x.user2} in room {x.room}</li>)
					
				}
				</ul>
			</div>
		);
	}

});

export default History;

