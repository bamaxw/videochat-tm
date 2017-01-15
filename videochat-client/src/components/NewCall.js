import React from 'react';

var NewCall = React.createClass({

	_makeCall: function(e) {
		if (e.nativeEvent.keyCode !== 13) return;
    var name = e.target.value;
		if (this.validateUser(name)) {
			window.location = "#/calling/" + name;
		} else {
			alert("User" + name + "does not exist!")
		}
	},

	validateUser: function(name) {
		return true;
	},

	render: function() {
		return (
			<div>
				<input ref={(input) => { this.textInput = input; }} onKeyPress={this._makeCall} placeholder="Who you gonna call?" />
			</div>
		);
	}

});

export default NewCall;
