/** @jsx React.DOM */
var EditField = React.createClass({
	valueHasChanged: function(event) {
		var form = this.props.formFn();
		form.dataFn(this.props.ref, event.target.value);
	},
	render: function() {
		var cornerIcon = '';
		if(this.props.cornerIcon) {
			cornerIcon =
				<div className="ui corner label">
					<i className={"icon " + this.props.cornerIcon}></i>
				</div>;
		}

		var icon = '';
		if(this.props.icon) {
			icon = <i className={this.props.icon + " icon"}></i>
		}

		var form = this.props.formFn();
		var value = form.dataFn(this.props.ref, undefined);
		var submitting = form.submitting;
		var loading = form.loading;

		var input = <input type={this.props.type} name={this.props.ref} value={value} onChange={this.valueHasChanged} disabled={submitting || loading}/>;

		if(this.props.icon) {
			input =
				<div className="ui left labeled icon input">
					{input}
					{icon}
					{cornerIcon}
				</div>;
			cornerIcon = '';
		}

		var label = '';
		if(this.props.label) {
			label = <label>{this.props.label}</label>;
		}

		return (
			<div className="field">
				{label}
				{input}
				{cornerIcon}
			</div>
		);
	}
});

var TextField = React.createClass({
	render: function() {
		return <EditField type="text" label={this.props.label} icon={this.props.icon} cornerIcon={this.props.cornerIcon} ref={this.props.ref} valueFrom={this.props.valueFrom} formFn={this.props.formFn}/>;
	}
});

var NumberField = React.createClass({
	render: function() {
		return <EditField type="text" label={this.props.label} icon={this.props.icon} cornerIcon={this.props.cornerIcon} ref={this.props.ref} valueFrom={this.props.valueFrom} formFn={this.props.formFn}/>;
	}
});

var EmailField = React.createClass({
	render: function() {
		return <EditField type="text" label={this.props.label} icon={this.props.icon} cornerIcon={this.props.cornerIcon} ref={this.props.ref} valueFrom={this.props.valueFrom} formFn={this.props.formFn}/>;
	}
});

var PasswordField = React.createClass({
	render: function() {
		return <EditField type="password" label={this.props.label} icon={this.props.icon} cornerIcon={this.props.cornerIcon} ref={this.props.ref} valueFrom={this.props.valueFrom} formFn={this.props.formFn}/>;
	}
});

var CheckboxField = React.createClass({
	render: function() {
		return (
			<div className="field">
				<label>{this.props.label}</label>
				<input type="checkbox" name={this.props.ref} ref={this.props.ref} valueFrom={this.props.valueFrom} formFn={this.props.formFn}/>
			</div>
		)
	}
});

var Submit = React.createClass({
	render: function() {
		var form = this.props.formFn();
		var submitting = form.submitting;
		var loading = form.loading;
		return (
			<div className={"ui small blue submit button submitButton" + (submitting ? ' labeled icon' : '') + (loading ? ' disabled' : '')} style={{pointerEvents: submitting || loading ? 'none' : 'auto'}} ref="submitButton">
				<i className="icon" style={{paddingTop: '0.40em', display: submitting ? 'block' : 'none'}}>
				<div className="spinner">
					<div className="rect1"></div>
					<div className="rect2"></div>
					<div className="rect3"></div>
					<div className="rect4"></div>
					<div className="rect5"></div>
				</div>
				</i>
				{this.props.content || "Submit"}
			</div>
		)
	}
});

var FormMixin = {
	getInitialState: function() {
		return {
			data: {},
			dataLoaded: false,
			submitting: false,
			loading: false,
			errorMsg: false,
			successMsg: false
		}
	},
	getDefaultProps: function() {
		return {
			visible: true
		}
	},
	getInternalData: function() {
		return this.state.data;
	},
	dataFn: function(refName, refValue) {
		if(refValue === undefined)
			return this.state.data[refName];
		else {
			var data = this.state.data;
			data[refName] = refValue;
			this.setState({data: data});
		}
	},
	formFn: function() {
		return {
			submitting: this.state.submitting,
			loading: this.state.loading,
			dataFn: this.dataFn
		}
	},
	acceptField: function(t) {
		return t === 'TextField' ||
			t === 'NumberField' ||
			t === 'EmailField' ||
			t === 'PasswordField' ||
			t === 'CheckboxField' ||
			t === 'TextFieldIcon'
		;
	},
	buildValidationRules: function() {
		var validationRules = {};

		for(var refName in this.refs) {
			var child = this.refs[refName];
			var tagName = child.type.displayName;

			if(this.acceptField(tagName)) {
				var lowerCaseLabel = child.props.label.toLowerCase();
				var label = child.props.label;

				var rules = [];

				if (child.props.notEmpty) {
					rules.push({
						type: tagName == 'EmailField' ? 'email' : 'empty',
						prompt: child.props.notEmpty !== String
							? label + ' cannot be empty'
							: child.props.notEmpty
					});
				}

				if (child.props.matchRef) {
					rules.push({
						type: 'match[' + child.props.matchRef + ']',
						prompt: child.props.matchMsg || label + " should match " + this.refs[child.props.matchRef].props.label.toLowerCase()
					});
				}

				if (child.props.minLength) {
					rules.push({
						type: 'length[' + child.props.minLength + ']',
						prompt: child.props.minLengthMsg || label + ' must be at least ' + child.props.minLength + ' characters'
					});
				}

				if (child.props.checked) {
					rules.push({
						type: 'checked',
						prompt: child.props.checked !== String
							? label + 'Please check ' + lowerCaseLabel
							: child.props.checked
					});
				}

				var validationRule = {
					identifier: refName,
					rules: rules
				};

				validationRules[refName] = validationRule;
			}
		}
		return validationRules;
	},
	loadData: function(props) {
		var _this = this;

		if(props.visible && !_this.state.dataLoaded && (props.url || props.loadUrl)) {
			console.log("Loading form data...");
			_this.setState({loading: true});
			var url = props.url || props.loadUrl;
			$.ajax({
				url: url,
				dataType: 'json',
				contentType: "application/json",
				type: 'GET',
				complete: function () {
					_this.setState({loading: false});
				},
				error: function (e) {
					var errorMsg = null;
					if(props.onError)
						errorMsg = props.onError(e);
					_this.setState({errorMsg: errorMsg ? errorMsg : url + ' - ' + e.statusText});
				},
				success: function(data) {
					for(var refName in _this.refs) {
						var child = _this.refs[refName];
						if(child.props && child.props.valueFrom)
							data[refName] = data[child.props.valueFrom]
					}
					console.log(data);
					_this.setState({dataLoaded: true, data: data});
				}
			});
		}
	},
	componentWillReceiveProps: function(props) {
		this.loadData(props);
	},
	componentDidMount: function() {
		var _this = this;
		this.loadData(this.props);
		var validationRules = this.buildValidationRules();
		console.log(validationRules);
		$('.checkbox').checkbox();
		var formNode = this.refs.form.getDOMNode();
		$(".form", formNode).form(validationRules, {
			inline : true,
			onSuccess: function() {
				var fieldsJson = JSON.stringify(_this.state.data);
				console.log("fieldsJson:");
				console.log(fieldsJson);
				_this.setState({submitting: true});

				$.ajax({
					url: _this.props.url || _this.props.submitUrl,
					dataType: 'json',
					contentType: "application/json",
					type: 'POST',
					data: fieldsJson,
					complete: function() {
						_this.setState({submitting: false});
					},
					error: function(e) {
						var errorMsg = null;
						if(_this.onError)
							errorMsg = _this.onError(e);
						_this.setState({errorMsg: errorMsg ? errorMsg : e.statusText});
					},
					success: function(data) {
						var successMsg = null;
						if(_this.onSuccess)
							successMsg = _this.onSuccess(data);
						_this.setState({successMsg: successMsg});
					}
				});
			}
		});
	}
};

var Form = React.createClass({
	getDefaultProps: function() {
		return {
			header: 'Form header'
		}
	},
	render: function() {
		var msg = this.props.errorMsg || this.props.successMsg;
		var loading = this.props.formFn().loading;
		return (
			<div style={{display: this.props.visible ? 'block' : 'none'}}>
				<div className={"ui small attached message" + (loading ? " icon" : "")} style={{display: this.props.header ? 'block' : 'none'}}>
					<i className="icon spinner" style={{width: '3em', 'verticalAlign': 'top', fontSize: 0, display: loading ? 'table-cell' : 'none'}}>
						<div className="rect1"></div>
						<div className="rect2"></div>
						<div className="rect3"></div>
						<div className="rect4"></div>
						<div className="rect5"></div>
					</i>
					<div className="content" style={{paddingLeft: loading ? '0.5em' : 0}}>
						<div className="header">{this.props.header}</div>
					</div>
				</div>
				<div className={"ui small form" + (this.props.header ? " attached fluid segment" : "")}>
					{this.props.children}
				</div>
				<div className={"ui small bottom attached message " + (this.props.errorMsg ? "error" : "info")} style={{display: msg ? 'block' : 'none'}}>
					{msg}
				</div>
			</div>

		);
	}
});
