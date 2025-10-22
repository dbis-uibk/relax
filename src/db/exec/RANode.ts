/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ValueExpr } from 'db/exec/ValueExpr';
import { CodeInfo } from './CodeInfo';
import { ExecutionError } from './ExecutionError';
import { Schema } from './Schema';
import { Table } from './Table';
import Timer from 'calc2/utils/timer';

export interface Warning {
	message: string,
	codeInfo?: CodeInfo,
}
export interface Session {
	statement_timestamp: Date,
}
export interface MetaData extends Object {
	naturalJoinConditions?: ValueExpr[],
	isInlineRelation?: boolean,
	inlineRelationDefinition?: string,
	fromVariable?: string,
}

/**
 * the base class for all relational algebra operations
 *
 * the calculation of an expression must follow the following 3 steps:
 * - the instances of the operators get plugged together building a operator tree
 *   at this stage no checking is done
 * - the `check()` function  is called recursively to check the correct nesting
 *   of the expressions like schema compability or existence of columns
 *   used in an projection
 *   The `check()` function also calculates the output schema for the specific
 *   operator.
 * - after check has been called the actual result is calculated when `getResult()` is called
 *   the results are not cached and return a new of Table that is independant of the results
 *   of their operands
 *   the session object is created automatically at the root of the tree
 * @constructor
 * @abstract
 * @returns {RANode} this is an abstract class
 */
export abstract class RANode {
	_functionName: string;
	_codeInfo: CodeInfo | null = null;
	_metaData: MetaData = {};
	_resultNumRows: number = -1;
	_wrappedInParentheses: boolean = false;
	_warnings: Warning[] = [];
	_timer = new Timer();
	_execTime?: ReturnType<typeof performance.now>;
	_resTime?: ReturnType<typeof performance.now>;
	
	constructor(functionName = '') {
		this._functionName = functionName;
	}

	setCodeInfoObject(codeInfo: CodeInfo | null) {
		this._codeInfo = codeInfo;
		return this;
	}

	addWarning(msg: string, codeInfo: CodeInfo) {
		const w: Warning = {
			message: msg,
			codeInfo: undefined,
		};
		if (codeInfo) {
			w.codeInfo = codeInfo;
		}

		if (!this._warnings) {
			this._warnings = [];
		}

		this._warnings.push(w);
	}

	abstract getWarnings(recursive: boolean): Warning[];

	setWrappedInParentheses(wrappedInBrackets: boolean = true) {
		this._wrappedInParentheses = wrappedInBrackets;
	}

	throwExecutionError(message: string): never {
		throw new ExecutionError(message, this._codeInfo);
	}

	abstract getSchema(): Schema;

	setMetaData<T extends keyof MetaData>(key: T, value: MetaData[T]) {
		this._metaData[key] = value;
	}

	hasMetaData(key: keyof MetaData) {
		return typeof this._metaData[key] !== 'undefined';
	}

	getMetaData<T extends keyof MetaData>(key: T): MetaData[T] | undefined {
		return this._metaData[key];
	}

	getResultNumRows() {
		if (typeof (this._resultNumRows) === 'undefined' || this._resultNumRows === -1) {
			throw new Error('result num rows not set! call only after getResult');
		}

		return this._resultNumRows;
	}

	protected setResultNumRows(num: number) {
		this._resultNumRows = num;
	}

	/**
	 * every implementation has to call
	 *  `session = this._returnOrCreateSession(session);`
	 * to initialize the session if necessary
	 *
	 * @param {Object} [session] the session object or undefined if called on a root node
	 */
	abstract getResult(doEliminateDuplicateRows?: boolean, session?: Session): Table;

	/**
	 * this method is called in every getResult() method
	 *
	 * this is actually a hack due to the lack of a statement object
	 * there is no place to store data that can be used
	 * by all operators
	 *
	 * the method will create a new session when called with undefined
	 * or just returns the argument
	 *
	 * @param   {Object} session the already initialized session object or undefined
	 * @returns {Object} [[Description]]
	 */
	_returnOrCreateSession(session?: Session): Session {
		if (session === undefined) {
			// create a new session
			return {
				statement_timestamp: new Date(),
			};
		}
		else {
			return session;
		}
	}

	getArgumentHtml(): string {
		return '';
	}

	abstract check(): void;

	/**
	 * returns the relalg tree as html formula
	 * @param isChildElement false can be used to prevent brackets for the root element 
	 */
	abstract getFormulaHtml(printChildren: boolean, isChildElement: boolean): string;


	static foreachRecursive(node: RANode, func: (node: RANode) => void): void {
		func(node);

		if (node instanceof RANodeUnary) {
			func(node.getChild());
		}
		else if (node instanceof RANodeBinary) {
			func(node.getChild());
			func(node.getChild2());
		}
	}
}

export abstract class RANodeNullary extends RANode {
	getWarnings(recursive: boolean): Warning[] {
		return this._warnings;
	}

	getFormulaHtml(printChildren: boolean = true, isChildElement: boolean = true): string {
		const wrap = this._wrappedInParentheses === true && isChildElement === true;
		return (
			`${wrap ? '(' : ''}
				<span>
					<span class="math">${this._functionName}</span>
				</span>
			${wrap ? ')' : ''}`
		);
	}
}

export abstract class RANodeUnary extends RANode {
	protected _child: RANode;

	constructor(functionName: string, child: RANode) {
		super(functionName);
		this._child = child;
	}

	getChild(): RANode {
		return this._child;
	}

	getWarnings(recursive: boolean): Warning[] {
		if (recursive === true) {
			return [...this._warnings, ...this.getChild().getWarnings(true)];
		}
		else {
			return [...this._warnings];
		}
	}

	getFormulaHtml(printChildren: boolean = true, isChildElement: boolean = true): string {
		const wrap = this._wrappedInParentheses === true && isChildElement === true;
		return (
			`${wrap ? '(' : ''}

				<span>
					<span class="math">${this._functionName}</span>
					<sub>${this.getArgumentHtml()}</sub>
					${printChildren === true ? this.getChild().getFormulaHtml(printChildren, true) : ''}
				</span>
			${wrap ? ')' : ''}`
		);
	}
}

export abstract class RANodeBinary extends RANode {
	protected _child: RANode;
	protected _child2: RANode;

	constructor(functionName: string, child: RANode, child2: RANode) {
		super(functionName);
		this._child = child;
		this._child2 = child2;
	}

	getChild(): RANode {
		return this._child;
	}

	getChild2(): RANode {
		return this._child2;
	}

	getWarnings(recursive: boolean): Warning[] {
		if (recursive === true) {
			return [
				...this._warnings,
				...this.getChild().getWarnings(true),
				...this.getChild2().getWarnings(true),
			];
		}
		else {
			return [...this._warnings];
		}
	}

	getFormulaHtml(printChildren: boolean = true, isChildElement: boolean = true): string {
		const wrap = this._wrappedInParentheses === true || isChildElement === true;
		return (
			`${wrap ? '(' : ''}

				<span>
					${printChildren === true ? this.getChild().getFormulaHtml(printChildren, true) : ''}
					<span class="math">${this._functionName}</span>
					<sub>${this.getArgumentHtml()}</sub>
					${printChildren === true ? this.getChild2().getFormulaHtml(printChildren, true) : ''}
				</span>
			${wrap ? ')' : ''}`
		);
	}
}
