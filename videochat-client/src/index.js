import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import App from './components/App';
import Call from './components/Call'
import NewCall from './components/NewCall';
import Contacts from './components/Contacts';
import History from './components/History';
import './index.css';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
 
const socket = io.connect('http://127.0.0.1:5000');
socket.on('message', msg => console.log(msg));

ReactDOM.render((
		<SocketProvider socket={socket}>
  		<Router history={hashHistory}>
				<Route path="/" component={App} />
				<Route path="/contacts" component={Contacts} />
				<Route path="/history" component={History} />
				<Route path="/calling/:username" component={Call} />
				<Route path="/newcall" component={NewCall} />
			</Router>
		</SocketProvider>
	), document.getElementById('root')
);
