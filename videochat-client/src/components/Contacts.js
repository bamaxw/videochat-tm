import React from 'react';
import cookie from 'react-cookie';
import './App.css';
import ContactList from './ContactList';

var Call = React.createClass({

	getInitialState: function() {
		var username = cookie.load('username');
		if (username) {
			var contacts = this.getContacts(username);
			return {
				username: username,
				contacts: contacts,
				selection: null,
				addContactColor: 'black'
			};
		} else {
			window.location = '/';
		}
	},

	getContacts: function(username) {
		return [
			{
				username: 'anika',
				status: 'available'
			},
			{
				username: 'clementina',
				status: 'idle'
			},
			{
				username: 'max',
				status: 'inactive'
			}
		];
	},

	_selectContact: function(username) {
		var newState = Object.assign({}, this.state);
		newState['selection'] = username;
		this.setState(newState);
	},

	makeCall: function() {
		window.location = '/#/calling/' + this.state.selection;
	},

	cancelSelection: function() {
		var newState = Object.assign({}, this.state);
		newState['selection'] = null;
		this.setState(newState);
	},

	addContact: function(e) {
		if (e.nativeEvent.keyCode !== 13) return;
    var name = e.target.value;
		var newState = Object.assign({}, this.state);
		var contact = this.validateContact(name);
		if (contact === -1) {
			newState['addContactColor'] = 'red';
			e.target.value = "";
		} else {
			newState['contacts'].push(contact);
			newState['addContactColor'] = 'black';
			e.target.value = "";
		}
		this.setState(newState);
	},

	validateContact: function(username) {
		if (username === "donald") {
			return -1
		} else {
			return {
				username: username,
				status: ['active', 'idle', 'inactive'][Math.floor(Math.random() * 3)]
			}
		}
	},

	render: function() {
		return (
			<div className="App">
        <div className="App-header">
					<h1>This is going to be a great call, <b>{this.state.username}</b>!</h1>
				</div>
				<div>
					<ContactList data={this.state.contacts} _selectContact={this._selectContact} />
					<input onKeyPress={this.addContact} ref="AddContact" placeholder="Add contact" style={{borderColor: this.state.addContactColor}} />
					{ this.state.selection ?
						<div>
							<button onClick={this.makeCall}>Call</button>
							<button onClick={this.cancelSelection}>Cancel</button>
						</div>
						:
						<div></div>
					}
				</div>
			</div>
		);
	}

});

export default Call;

