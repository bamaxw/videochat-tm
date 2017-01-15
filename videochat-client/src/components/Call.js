import React from 'react';
import cookie from 'react-cookie';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

var Call = React.createClass({

	getInitialState: function() {
		var username = cookie.load('username');
		return {username: username, calling: this.props.params.username}
	},

	componentDidMount: function() {
		var username = cookie.load('username');
    var AppearIn = window.AppearIn || require('appearin-sdk');
    var appearIn = new AppearIn();
    console.log('wooptidoo');
    console.log(this.state);
		var room = null;
		if (cookie.load('room') !== undefined) {
			var newState = Object.assign({}, this.state);
			newState['room'] = cookie.load('room');
			console.log(newState);
			cookie.remove('room');
		}
		this.setState(newState, () => {
			room = this.state.room;
			console.log(this.state);
    	var _this = this;
    	if (room !== undefined) {
    	  appearIn.getRandomRoomName().then(function(notmyroom){
    	    var iframe = document.getElementById("iframe-element-id");
    	    appearIn.addRoomToIframe(iframe, room);
    	  });
    	} else {
    	  appearIn.getRandomRoomName().then(function(room) {
    	    var newState = Object.assign({}, _this.state);
    	    console.log(newState);
    	    newState['room'] = room;
    	    _this.setState(newState);
    	    var recipient = _this.props.params.username
    	    socket.emit('call', cookie.load('secret'), recipient, room);
    	    var iframe = document.getElementById("iframe-element-id");
    	    appearIn.addRoomToIframe(iframe, room);
    	  });
    	}
		});
	},

  _addMore: function(e) {
    if (e.nativeEvent.keyCode !== 13) return;
    var name = e.target.value;
   	socket.emit('call', cookie.load('secret'), name, this.state.room);
  },

	render: function() {
		return (
			<div>
				<iframe width='640' height='400' id="iframe-element-id"></iframe>
				<input onKeyPress={this._addMore} ref={ (input) => { this.textInput = input; }} placeholder="Add another person?"></input>
			</div>
		);
	}

});

export default Call;
