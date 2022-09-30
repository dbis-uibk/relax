import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { faBars, faPlusCircle, faCircleNotch, faCheckCircle, faTimes, faUpload, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2canvas from 'html2canvas';
import { Offcanvas } from 'react-bootstrap';
import { T, t } from 'calc2/i18n';

type Props = {
	children: React.ReactNode;
	result: any;
	getQuery?: any;
};

type State = {
	show: boolean;
	exercise: Exercise | undefined,
	updateTasks: boolean;
};
require('./exercises.scss');


export class TaskMenu extends React.Component<Props, State> {

	offcanvasRef: React.RefObject<any>;
	uploadJSONRef: React.RefObject<HTMLInputElement>;
	
	constructor(props: Props) {
		super(props);

		this.state = {
			show: false,
			exercise: undefined,
			updateTasks: false,
		};
		
		this.setShow = this.setShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleShow = this.handleShow.bind(this);
		this.checkResult = this.checkResult.bind(this);
		this.downloadResult = this.downloadResult.bind(this);
		this.loadExercise = this.loadExercise.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		
		this.createTempExercise = this.createTempExercise.bind(this);

		this.uploadJSONRef = React.createRef();
		this.offcanvasRef = React.createRef();
		
		
	}
	
	createTempExercise() {
		const e: Exercise = new Exercise();
		e.title = 'Aufgabe 1 (Relationale Algebra 1)';
		e.body = 'Geben Sie für die folgenden Aufgaben sowohl die Abfrage als auch das Ergebnis und die Anzahl an Tupel ab. Bei sehr großen Ergebnismengen geben Sie bitte anstatt des gesamten Ergebnisses nur die ersten zehn Zeilen an.';
		e.tasks = [];
		e.checkingActive = true;
		e.checkingMode = 'result';
		
		const t = new Task();
		t.title = '1a';
		t.body = 'Geben Sie bitte die Id, die CustomerId, das InvoiceDate und die Gesamtsumme (Total) aller Rechnungen aus, die eine Gesamtsumme von über 10 Euro aufweisen.';
		t.completed = false;
		t.attempted = false;
		// tslint:disable-next-line:prefer-template
		t.expectedOutput = 'R.a,R.b,R.c\n' +
			'1,a,d\n' +
			'3,c,c\n' +
			'4,d,f\n' +
			'5,d,b\n' +
			'6,e,f';
		t.output = 'ALL';
		e.tasks.push(t);
		
		const t2 = new Task();
		t2.title = '1b';
		t2.body = 'Geben Sie bitte alle Rechnungen aus, die mit November 2009 datiert sind. Dabei sollten die Id und das Datum der Rechnung, die Gesamtsumme und der Nachname des Kunden ausgegeben werden.';
		t2.completed = false;
		t2.attempted = false;
		t2.expectedOutput = 5;
		t2.hint = 'Datumseinträge werden im Format YYYY-MM-DD gespeichert und angegeben und können mit <, >, etc. verglichen werden. (z.B. birthday > ’1934-01-01’)'
		e.tasks.push(t2);


		const t3 = new Task();
		t3.title = '1c';
		t3.body = 'Finden Sie alle Tracks des Genres Rock, die auch tatsächlich gekauft wurden. Geben Sie dazu den Namen des Tracks und dessen Id aus.';
		t3.completed = false;
		t3.attempted = false;
		t3.expectedOutput = '';
		
		e.tasks.push(t3);
		
		
		
		
		
		this.setState({exercise: e});
	}
	
	
	checkResult(id: number) {
		const task = this.state.exercise?.tasks[id]!;
		task.attempted = true;
		task.userSolution = this.props.result;
		// check depending on config:
		switch (this.state.exercise?.checkingMode) {
			case 'rowCount':
				this.checkRowCount(task);
				break;
			case 'query':
				this.checkQuery(task);
				break;
			case 'result':
				this.checkExactResult(task);
				break;
			default:
				task.completed = true;
		}
		this.setState({updateTasks: !this.state.updateTasks});
	}
		
	checkRowCount(task: Task) {
		if(task.userSolution && task.userSolution.result.result) {
			task.completed = task.userSolution.result._rows.length === task.expectedOutput;
		}
	}
	
	checkQuery(task: Task) {
		if(task.userSolution && task.userSolution.query) {
			task.completed = task.userSolution.query.replaceAll(' ', '') === task.expectedOutput.replaceAll(' ', '');
		}
	}
	
	checkExactResult(task: Task) {
		if(task.userSolution && task.userSolution.result) {
			let csvResult = this.generateCSV(task.userSolution.result._schema, task.userSolution.result._rows);
			if(csvResult && csvResult !== '') {
				csvResult = this.formatCSVForChecking(csvResult).trim();
				const expected = this.formatCSVForChecking(task.expectedOutput).trim();
				task.completed = expected === csvResult;
			}
		}
	}
	
	formatCSVForChecking(csvResult: string) {
		// remove all quotations
		csvResult = this.replaceAllImpl(csvResult, '"', '');
		// replace all linebreaks
		csvResult = this.replaceAllImpl(csvResult, '\n', '');
		csvResult = this.replaceAllImpl(csvResult, '\r', '');
		// replace all tabs
		csvResult = this.replaceAllImpl(csvResult, '\t', '');
		// replace all spaces
		csvResult = this.replaceAllImpl(csvResult, ' ', '');
		
		return csvResult;
	}
	
	
	

	downloadResult(task: Task) {
		switch (task.output) {
			case 'RESULT':
				this.downloadCSV(task);
				break;
			case 'QUERY':
				this.downloadQuery(task);
				break;
			case 'ALL':
				this.downloadCSV(task);
				this.downloadQuery(task);
				this.downloadImage(task);
				break;
			case 'IMAGE':
				this.downloadImage(task);
				break;
			case 'RESULT+QUERY':
				this.downloadCSV(task);
				this.downloadQuery(task);
				break;
			case 'QUERY+IMAGE':
				this.downloadQuery(task);
				this.downloadImage(task);
				break;
			case 'RESULT+IMAGE':
				this.downloadCSV(task);
				this.downloadImage(task);
				break;
			default:
				break;
		}
	}
	
	public generateCSV(schema: any, rows: any){
		// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
		const arrayToCsv = (data: any) => {
			return data.map((row: any) =>
				row
					.map(String)  // convert every value to String
					.map((v: any) => this.replaceAllImpl(v, '"', '""'))  // escape double colons
					.map((v: any) => `"${v}"`)  // quote it
					.join(','),  // comma-separated
			).join('\r\n');  // rows starting on new lines	
		};
		const headers: string[] = [];
		schema._relAliases.forEach((r: any, i: number) => {
			headers.push(`${r}.${schema._names[i]}`);
		});

		let csv: string;
		csv = arrayToCsv([headers]);
		csv += '\r\n' + arrayToCsv(rows);
		return csv;
	}
	
	
	loadExercise(event: any) {
		const files = event.target.files;
		if(files.length > 0) {
			const reader = new FileReader();
			reader.onload = ((e: any) => {
				const fileContent = e.target.result;
				try {
					const ex = new Exercise(JSON.parse(fileContent));
					this.setState({exercise: ex});
				} catch (e) {
					console.warn(e);
					window.alert('Could not load exercise. Please check format.\n' + e);
				}

				
			});
			reader.readAsText(files[0]);
		}
	}
	
	
	
	
	downloadQuery(task: Task) {
		if(task.userSolution && task.userSolution.query) {
			const filename = task.title+'.txt';
			const a = document.createElement('a');
			a.href = window.URL.createObjectURL(new Blob([task.userSolution.query], { 'type': 'text/plain' }));
			a.download = filename;
			a.click();
		}

	}
	
	
	
	downloadCSV(task: Task) {
		const csv = this.generateCSV(task.userSolution.result._schema, task.userSolution.result._rows);
		const filename = task.title+'.csv';
		const a = document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([csv], { 'type': 'text/plain' }));
		a.download = filename;
		a.click();
		
	}
	
	
	downloadImage(task: Task) {
		const imgDiv = document.getElementsByClassName('ra-tree')[0] as HTMLElement;
		if(imgDiv) {
			html2canvas(imgDiv).then(canvas => {
				const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
				const d = document.createElement('a');
				d.href = dataUrl;
				d.download = task.title+'.jpg';
				document.body.appendChild(d);
				d.click();
			});
		}
		else {
			return ;
		}
	}
	

	public replaceAllImpl(text: string, toReplace: string, replaceWith: string) {
		while(text.includes(toReplace)) {
			text = text.replace(toReplace, replaceWith);
		}
		return text;
	}
	
	
	// TODO: DELETE	
	/*
	componentDidMount() {
		this.createTempExercise();
	}
	*/


	setShow(val: boolean) {
		this.setState({show: val});
	}
	handleClose(){
		this.setShow(false);
	} 
	handleShow() {
		this.setShow(true);
	} 
	
	handleFocus(event: React.FocusEvent) {
		console.log(event);
		console.log('focused');
		event.preventDefault();
		event.stopPropagation();
	}
	
	render() {
		return (
			<span onFocus={this.handleFocus} id="test-focus">
				<p onClick={this.handleShow} className="clickable">
					{t('task-menu.exercises')}
				</p>

				<Offcanvas show={this.state.show} onHide={this.handleClose} placement="end">
					<div className="text-right mr-2 mt-2">
						<FontAwesomeIcon icon={faTimes  as IconProp} onClick={this.handleClose} className="offcanvas-close"/>
					</div>
	
					
					<Offcanvas.Header>
						<Offcanvas.Title>
							{!this.state.exercise ?
								<>
								</>
							:
								<div className="task exerciseHeader">
									{this.state.exercise.title}
								</div>
							}
							
							
						</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						
						<span>
							{!this.state.exercise ? 
								<div className="task exerciseHeader">
									{t('task-menu.exercises.no-exercises.header')} <br/>
									<div className="text-center">
										<Button color="primary" onClick={() => { this.uploadJSONRef.current?.click(); }} className="mt-1"><FontAwesomeIcon icon={faUpload  as IconProp} /> {t('task-menu.exercises.no-exercises.header.load')}</Button>
										<input className="hidden" ref={this.uploadJSONRef} onChange={this.loadExercise} type="file" accept="application/JSON"></input>
									</div>

								</div>	
								:
								<div className="task-wrapper">
									{this.state.exercise.tasks.map((t, i) => {
										return <div key={i} className={`task ${t.attempted && t.completed ? 'success-border' : t.attempted && !t.completed ? 'red-border': '' } `}>
												<div className="d-flex taskHeader">
													<h4>{t.title}</h4>
													{t.attempted && !t.completed ?
														<FontAwesomeIcon icon={faPlusCircle as IconProp} />
														:
														<></>
													}
													{t.completed ?
														<FontAwesomeIcon icon={faCheckCircle as IconProp} />
														:
														<></>
													}
													{!t.completed && !t.attempted ?
														<FontAwesomeIcon icon={faCircleNotch as IconProp} />
														:
														<></>
													}
												</div>
												
											
											
												
												<div className="task-body">
													{t.body}
												</div>
											{t.hint && t.hint !== '' ?
												<div className="hint-box">
													<FontAwesomeIcon icon={faInfoCircle  as IconProp} className="mr-2"/>
													{t.hint}
												</div>
												:
												<></>
											}
											<div className={'button-box'}>
												{this.state.exercise?.checkingActive ?

													<div className="text-right">
														<Button variant="primary" disabled={t.completed} onClick={() => this.checkResult(i)}>
															<T id="task-menu.exercises.task.check" />
														</Button>
													</div>
													:
													<></>
												}
												{
													t.output !== ''  && t.output?
														<div className="text-right">
															<Button variant="primary" onClick={() => this.downloadResult(t)}>
																<T id="task-menu.exercises.task.download" />
															</Button>
														</div>
														:
														<></>
												}
												
											</div>
											

											
											
											
											</div>;
									})}
								</div>
							}
						</span>
					</Offcanvas.Body>
				</Offcanvas>


			</span>
		); 
	}
}

export class Task {
	title: string;
	body: string;
	completed: boolean;
	attempted: boolean;
	expectedOutput: any;
	hint: string;
	output: '' | 'RESULT' | 'QUERY' | 'ALL' | 'IMAGE' | 'RESULT+QUERY' | 'QUERY+IMAGE' | 'RESULT+IMAGE';
	userSolution: any;
	constructor(init?: Partial<Task>) {
		Object.assign(this, init);
	}
	
	
}

export class Exercise {
	title: string;
	body: string;
	tasks: Task[] = [];
	
	checkingActive: boolean;
	checkingMode: 'query' | 'rowCount' | 'result';

	constructor(init?: Partial<Exercise>) {
		Object.assign(this, init);
	}
	
}


