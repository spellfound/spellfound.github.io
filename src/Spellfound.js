import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import './Spellfound.css';

const match = (letters, facit) => {
	var m = true;
	facit.map(f => {
		if (((f.model && letters[f.model]) || "").toUpperCase() !== (f.value || "-").toUpperCase()) {
			m = false;
		}
		return 0;
	})
	console.log("Match result: " + m);
	return m;
}

class Spellfound extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			letters : [], facit : {},
			matrix : [],
			typeDown : false,
			puzzle : props.puzzle
		};

		this.handleChange = this.handleChange.bind(this);
		this.checkMatch = this.checkMatch.bind(this);
		this.handleArrowKey = this.handleArrowKey.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleFileSelect = this.handleFileSelect.bind(this);
		this.loadJson = this.loadJson.bind(this);
		document.body.style.display = "background-image: url('/Squirrel.svg'); background-color: whitesmoke; background-repeat:  no-repeat; background-attachment: fixed; background-position: center; background-blend-mode: overlay;";
	}

	handleChange(e) {
		if (e !== undefined) {
			let upperCase = e.target.value.toUpperCase();
			this.setState({
				[e.target.name] : upperCase
			});
			this.state.letters[e.target.name] = upperCase;
			if (match(this.state.letters, this.state.facit)) {
				alert('Correct!');
			}
			if (e.target.className.includes('rightdown')) {
				this.setState({typeDown : true});
				this.moveFocus(this.nextIdDown(e.target.id));
				return;
			}
			if (e.target.className.includes('downright')) {
				this.setState({typeDown : false});
				this.moveFocus(this.nextIdRight(e.target.id));
				return;
			}
			const key = e.nativeEvent.inputType;
			if (key === "deleteContentBackward") {
				if (this.state.typeDown) {
					this.moveFocus(this.nextIdUp(e.target.id));
				} else {
					this.moveFocus(this.nextIdLeft(e.target.id));
				}
			} else {
				if (this.state.typeDown) {
					this.moveFocus(this.nextIdDown(e.target.id));
				} else {
					this.moveFocus(this.nextIdRight(e.target.id));
				}
			}
		}
	}

	moveFocus(nextid) {
		if (document.getElementById(nextid) !== null) {
			document.getElementById(nextid).focus();
		}
	}

	nextIdRight(id) {
		return id.substr(0, 3) + (parseInt(id.substr(3, 2), 10) + 1).toString().padStart(2, "0");
	}
	nextIdLeft(id) {
		return id.substr(0, 3) + (parseInt(id.substr(3, 2), 10) - 1).toString().padStart(2, "0");
	}
	nextIdUp(id) {
		return id.substr(0, 1) + (parseInt(id.substr(1, 2), 10) - 1).toString().padStart(2, "0") + id.substr(3, 2);
	}
	nextIdDown(id) {
		return id.substr(0, 1) + (parseInt(id.substr(1, 2), 10) + 1).toString().padStart(2, "0") + id.substr(3, 2);
	}

	handleArrowKey (e) {
		var nextid;
		switch (e.key) {
			case 'ArrowUp':
				nextid = this.nextIdUp(e.target.id);
				this.setState({typeDown : true});
				break;
			case 'ArrowDown':
				nextid = this.nextIdDown(e.target.id);
				this.setState({typeDown : true});
				break;
			case 'ArrowLeft':
				nextid = this.nextIdLeft(e.target.id);
				this.setState({typeDown : false});
				break;
			case 'ArrowRight':
				nextid = this.nextIdRight(e.target.id);
				this.setState({typeDown : false});
				break;
		}
		this.moveFocus(nextid);
	};

	handleFileSelect(evt) {
		if (evt) {
			let files = evt.target.files;
			if (!files.length) {
				alert('No file select');
				return;
			}
			let file = files[0];
			let reader = new FileReader();
			let that = this;
			reader.onload = function (e) {
				that.loadJson(JSON.parse(e.target.result));
			};
			reader.readAsText(file);
		}
	}

	loadJson(json) {
		this.setState({matrix : json.matrix, facit : json.facit, title : json.title, legend : json.legend});
	}

	checkMatch(event) {
		if (match(this.state.letters, this.state.facit)) {
			alert('Correct!');
		} else {
			alert('Needs more work!');
		}
		event.preventDefault();
	}

	handleFocus(e) {
		e.target.select();
	}

	render() {
		var rowId = 0;
		const matrixTab = this.state.matrix.map(rad => {
			++rowId;
			var colId = 0;
			return (<tr key={rowId}>
					{rad.map(cell => {
						++colId;
						let sqrId = "i" + rowId.toString().padStart(2, "0") + colId.toString().padStart(2, "0");
						let sqrClass = "sqr " + ((cell.class !== undefined) ? cell.class : "");
						return (<td key={sqrId}>
							<input id={sqrId}
										 disabled={this.getDisabled(cell)} className={sqrClass} type="text" size="1" maxLength="1" required
										 style={this.getDisabled(cell) ? {visibility : 'hidden'} : {backgroundColor : 'ivory'}}
										 name={cell.model} value={this.state.letters[cell.model]}
										 onChange={this.handleChange} onKeyUp={this.handleArrowKey} onFocus={this.handleFocus}/>
						</td>);
					})}
				</tr>
			)
		})
		return (
			<div>
				<h2 className="title">{this.state.title}</h2>
				<div className="component">
					<form onSubmit={this.checkMatch}>
						<table>
							<tbody>
							{matrixTab}
							</tbody>
						</table>
					</form>
				</div>
				<div className="legend">
					<div> { ReactHtmlParser (this.state.legend) } </div>
				</div>
			</div>
		)
	}

	getDisabled(cell) {
		return cell.model === '';
	}

	componentDidMount() {
		return fetch('/puzzles/' + this.state.puzzle + '.json')
		.then(response => response.json())
		.then((json) => {
			this.loadJson(json)
		})
		.catch((error) => {
			console.error(error)
		})
	}

	componentWillMount(){
		document.body.style.backgroundColor = "whitesmoke";
		document.body.style.backgroundImage = "url('/Squirrel.svg')";
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundAttachment = "fixed";
		document.body.style.backgroundPosition = "center";
	}
	componentWillUnmount(){
	}
}


export default Spellfound;
