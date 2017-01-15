import React from 'react';

var ContactList = React.createClass({

	render: function() {
		return (
			<div>
				<ul>
					{this.props.data.map((x, key) => <li className={"contact " + x.status} onClick={() => this.props._selectContact(x.username)}>{x.username}</li>)}
				</ul>
			</div>
		)
	}

});

export default ContactList;
