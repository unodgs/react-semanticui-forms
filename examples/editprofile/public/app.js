/** @jsx React.DOM */

var PersonalDataForm = React.createClass({
	mixins: [FormMixin],
	render: function() {
		return (
			<Form errorMsg={this.state.errorMsg} successMsg={this.state.successMsg} header="Personal data" formFn={this.formFn} ref="form" visible={this.props.visible}>
				<div className="two fields">
					<TextField label="First name" ref="firstName" formFn={this.formFn} notEmpty/>
					<TextField label="Last name" ref="lastName" formFn={this.formFn} notEmpty/>
				</div>
				<EmailField label="Email" ref="email" formFn={this.formFn} notEmpty/>
				<TextField label="Username" ref="userName" formFn={this.formFn} notEmpty/>
				<div className="two fields">
					<PasswordField label="Password" ref="password" formFn={this.formFn} notEmpty minLength="6"/>
					<PasswordField label="Repeat password" ref="repeat" valueFrom="password" formFn={this.formFn} notEmpty matchRef="password"/>
				</div>
				<Submit formFn={this.formFn}/>
			</Form>
		);
	}
});

var FormData = React.createClass({
	getInitialState: function() {
		return {
			data: {}
		}
	},
	componentDidMount: function() {
		var _this = this;
		setInterval(function() {
			var data = _this.props.dataFn();
			_this.setState({data: data});
		}, 1000);
	},
	render: function() {
		var formData = JSON.stringify(this.state.data, null, 4);
		return (
			<pre style={{fontFamily: 'Courier New, Monospace', fontSize: 13}}>{formData}</pre>
		);
	}
});

var personalDataForm = <PersonalDataForm url="/api/account/personal"/>;
React.renderComponent(personalDataForm, document.getElementById('personalForm'));
React.renderComponent(<FormData dataFn={personalDataForm.getInternalData}/>, document.getElementById('personalFormData'));
