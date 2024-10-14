/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ExecutionError } from './ExecutionError';
import { Column } from './Column';
import { Schema, Data, DataType } from './Schema';
import * as i18n from 'i18next';
import { CodeInfo } from './CodeInfo';
import { Tuple } from './Table';
import { Session } from './RANode';
import { Join } from './joins/Join';


// type DataType = 'string' | 'number' | 'boolean' | 'date' | 'null';
export type Comparator = (
	| '='
	| '>='
	| '<='
	| '>'
	| '<'
	| '!='
);

function isDate(value: Data, type: DataType): value is Date {
	return type === 'date';
}
function isNumber(value: Data, type: DataType): value is Date {
	return type === 'date';
}
function isString(value: Data, type: DataType): value is Date {
	return type === 'date';
}
function isBoolean(value: Data, type: DataType): value is Date {
	return type === 'date';
}

type FunctionType = relalgAst.ValueExprFunction;



const MILLI_SEC_PER_DAY = 24 * 3600 * 1000;

/**
 * RegExp.escape
 * src: https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
 *
 * @param s
 * @returns {string}
 */
function regExpEscape(s: string) {
	return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}


export function printValue(val: Data, type: DataType): string | number {
	if (val === null) {
		return 'null';
	}
	switch (type) {
		case 'number':
			return val as number;
		case 'string':
			return `'${val}'`;
		case 'date': {
			const v = val as Date;
			const year = v.getFullYear();
			const month = (v.getMonth() + 1 < 10 ? '0' + (v.getMonth() + 1) : (v.getMonth() + 1));
			const day = (v.getDate() < 10 ? '0' + v.getDate() : v.getDate());
			return `${year}-${month}-${day}`;
		}
		case 'null':
			return 'null';
		case 'boolean':
			return val ? 'true' : 'false';
		default:
			throw new Error('unknown type ' + type);
	}
}


/**
 * the base class for all valueExpressions
 *
 * the calculation of an expression must follow the following 3 steps:
 * - the instances of the operators get plugged together building a operator tree
 *   at this stage no checking is done
 * - the `check()` function  is called recursively to check the correct nesting
 *   of the expressions like schema compatibility or existence of columns
 *   used in an projection
 *   The `check()` function also calculates the output schema for the specific
 *   operator.
 * - after check has been called the actual result is calculated when `evaluate()` is called
 * @constructor
 * @returns {ValueExpr}
 * @abstract
 */
export abstract class ValueExpr {
	func: FunctionType | null = null;
	dataType: DataType | null = null;
	_wrappedInParentheses: boolean = false;
	_codeInfo: CodeInfo | null = null;

	setCodeInfoObject(codeInfo: CodeInfo) {
		this._codeInfo = codeInfo;
		return this;
	}

	throwExecutionError(message: string): never {
		throw new ExecutionError(message, this._codeInfo);
	}

	/**
	 * evaluates the _checked_ expression against one or two given tuples
	 * if two tuples are given they are considered to be concatenated
	 * @param {Array}  tuple            a tuple of a relation
	 * @param {Array}  tupleB           a second tuple (that is meant to be seen as the right part of the first)
	 * @param {Number} row              the index of the index (this is used for some functions)
	 * @param {Object} statementSession the session object of the relalg statement
	 * @abstract
	 */
	abstract evaluate(tuple: Tuple, tupleB: Tuple, row: number, statementSession: Session): Data;

	/**
	 * get the datatype that is returned by this expression
	 * @abstract
	 */
	abstract getDataType(): DataType;

	/**
	 * this method must be called before calling evaluate
	 * with the schema(s) the tuples will be part of
	 *
	 * in this step the column names are checked and the indices
	 * (used by evaluate) are calculated
	 * @param {Schema} schemaA the schema for the first tuple
	 * @param {Schema} schemaB the schema for the second tuple
	 * @abstract
	 */
	abstract check(schemaA: Schema, schemaB?: Schema): void;

	/**
	 * gets a html representation of the expression (as String)
	 * @abstract
	 */
	abstract getFormulaHtml(): string;

	/**
	 * sets the indicator wether the expression was wrapped in parentheses in the code
	 * this is used for getFormulaHtml because at this stage there is no more information
	 * about the precedence of the operators and how the expression was created
	 * @param {Boolean} wrappedInParentheses true when this (sub) expression was wrapped in parentheses
	 */
	setWrappedInParentheses(wrappedInParentheses: boolean) {
		this._wrappedInParentheses = wrappedInParentheses;
	}
}


/**
 * value expression with no predefined datatype
 * @constructor
 * @param {String}               name                   the name of a column
 * @param {String}               relAlias               the relation alias of the column
 * @param {Number}               manuallySetColumnIndex the index of the column described; this allows
 *                                                      to set the index within a schema because sometimes
 *                                                      it can not be determined by the check function
 * @returns {ValueExprColumnValue}
 */
export class ValueExprColumnValue extends ValueExpr {
	_name: string | number;
	_relAlias: string | null;
	_index: null | number = null;
	_type: DataType | null = null;

	constructor(name: string | number, relAlias: string | null, manuallySetColumnIndex?: number) {
		super();
		this._name = name;
		this._relAlias = relAlias;
		this._index = null;

		if (typeof manuallySetColumnIndex !== 'undefined') {
			this._index = manuallySetColumnIndex;
		}
	}

	getDataType() {
		if(this._type === null){
			throw new Error(`type should have been set by check`);
		}
		return this._type;
	}

	check(schemaA: Schema, schemaB: Schema): void {
		if (this._index === null) {
			// the index has not been set manually
			this._index = ValueExprColumnValue._getColumnIndex(schemaA, schemaB, this._name, this._relAlias);
		}
		this._type = ValueExprColumnValue._getType(schemaA, schemaB, this._index);
	}

	evaluate(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session) {
		if(this._index === null){
			throw new Error(`index should have been set by check`);
		}
		if (this._index >= tupleA.length) {
			return tupleB[this._index - tupleA.length];
		}
		return tupleA[this._index];
	}

	toString(): string {
		return Column.printColumn(this._name, this._relAlias);
	}

	getFormulaHtml(): string {
		const s = Column.printColumn(this._name, this._relAlias);
		if (this._wrappedInParentheses === true) {
			return '(' + s + ')';
		}
		else {
			return s;
		}
	}

	static _getColumnIndex(schemaA: Schema, schemaB: Schema, name: string | number, relAlias: string | null): number {
		if (!schemaB || schemaB === null) {
			return schemaA.getColumnIndex(name, relAlias, true);
		}

		// if 2 schemas are given make sure the given relAlias.name is not ambiguous
		const index = schemaA.getColumnIndex(name, relAlias, false);
		if (index === -1) {
			// must be in schemaB!
			return schemaB.getColumnIndex(name, relAlias, true) + schemaA.getSize();
		}
		else {
			if (schemaB.getColumnIndex(name, relAlias, false) !== -1) {
				// ambiguous!!
				// throw new Error('column ' + relAlias + '.' + name + ' found in both schemas: ' + schemaA.toString() + ' ' + schemaB.toString());
				return index; // deactivated error logic to allow join conditions after cross joins which may result in duplicate columns
			}
			else {
				return index;
			}
		}
	}

	static _getType(schemaA: Schema, schemaB: Schema, index: number) {
		if (index >= schemaA.getSize()) {
			return schemaB.getType(index - schemaA.getSize());
		}
		return schemaA.getType(index);
	}
}

/**
 * all value expressions that are not column values belong here
 * @constructor
 * @param {String} dataType the datatype the function returns
 * @param {String} func     the name of the function used
 * @param {Array}  args     array containing the specific arguments for the function
 */
export class ValueExprGeneric extends ValueExpr {
	_func: FunctionType;
	_dataType: DataType;
	_dataTypeCalculated: DataType | null;
	_args: any[];
	_regex: RegExp | undefined;

	constructor(dataType: DataType, func: FunctionType, args: any[]) {
		super();
		this._func = func;
		this._dataType = dataType;
		this._dataTypeCalculated = null;
		this._args = args || [];
	}

	evaluate(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session) {
		switch (this._dataType) {
			case 'string':
				return this._evaluateString(tupleA, tupleB, row, statementSession);
			case 'number':
				return this._evaluateNumber(tupleA, tupleB, row, statementSession);
			case 'boolean':
				return this._evaluateBoolean(tupleA, tupleB, row, statementSession);
			case 'date':
				return this._evaluateDate(tupleA, tupleB, row, statementSession);
			case 'null':
				return this._evaluateNull(tupleA, tupleB, row, statementSession);
			default:
				throw new Error('this should not happen!');
		}
	}

	_parseIsoDate(str: string) {
		const regex = /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/;
		const groups = regex.exec(str);

		if (groups === null) {
			throw new ExecutionError(i18n.t('db.messages.exec.error-invalid-date-format', {str: str}), this._codeInfo);
		}

		const year = parseInt(groups[1], 10);
		const month = parseInt(groups[2], 10) - 1;
		const day = parseInt(groups[3], 10);
		const date = new Date(year, month, day);

		if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
			this.throwExecutionError(i18n.t('db.messages.exec.error-invalid-date-format', {str: str}));
		}
		return date;
	}

	_evaluateNull(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session) {
		switch (this._func) {
			case 'constant':
				return null;
			case 'coalesce':
				// returns the first non null value or null if all are null
				for (let i = 0; i < this._args.length; i++) {
					const value = this._args[i].evaluate(tupleA, tupleB, row, statementSession);
					if (value !== null) {
						return value;
					}
				}
				return null;
			case 'caseWhen':
			case 'caseWhenElse':
				// conditions are on i%2 === 0
				// values on i%2 === 1

				// see http://www.postgresql.org/docs/9.3/static/functions-conditional.html
				for (let i = 0; i < this._args.length; i += 2) {
					if (this._args[i].evaluate(tupleA, tupleB, row, statementSession) === true) {
						return this._args[i + 1].evaluate(tupleA, tupleB, row, statementSession);
					}
				}
				return null;
			default:
				throw new Error('this should not happen!');
		}
	}

	_evaluateDate(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session) {
		let a, b;

		if (
			this._func === 'transaction_timestamp' 
			|| this._func === 'statement_timestamp' 
			|| this._func === 'now' 
			|| this._func === 'clock_timestamp'
		) {
			// dates are the same due to lack of transaction concept
			// now is alias of transaction_timestamp
			return statementSession.statement_timestamp;
		}

		a = this._args[0].evaluate(tupleA, tupleB, row, statementSession);
		b = this._args.length > 1 && this._args[1].evaluate(tupleA, tupleB, row, statementSession);

		if (a === null || this._args.length > 1 && b === null) {
			return null;
		}

		switch (this._func) {
			case 'date':
				return this._parseIsoDate(a);
			case 'adddate':
				return new Date(a.getTime() + b * MILLI_SEC_PER_DAY);
			case 'subdate':
				return new Date(a.getTime() - b * MILLI_SEC_PER_DAY);
			default:
				throw new Error('this should not happen!');
		}
	}

	_checkDate(schemaA: Schema, schemaB: Schema) {
		switch (this._func) {
			case 'transaction_timestamp':
			case 'statement_timestamp':
			case 'clock_timestamp':
			case 'now':
				return true;

			case 'date':
				// Check wether the date format is valid
				this._parseIsoDate(this._args[0]._args[0]);
				return this._checkArgsDataType(schemaA, schemaB, ['string']);

			case 'adddate':
			case 'subdate':
				return this._checkArgsDataType(schemaA, schemaB, ['date', 'number']);

			default:
				throw new Error('this should not happen!');
		}
	}

	_evaluateBoolean(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session): boolean | 'unknown' {
		let a, b, typeA;

		if (this._func === 'constant') {
			return this._args[0];
		}


		a = this._args[0].evaluate(tupleA, tupleB, row, statementSession);
		b = this._args.length > 1 && this._args[1].evaluate(tupleA, tupleB, row, statementSession);

		switch (this._func) {
			case 'not':
				if (a === 'unknown'){
					return a;
				}
				return !a;
			case 'and':
				if (a === false || b === false){
					return false;
				}
				if (a === true && b === true){
					return true;
				}
				return 'unknown';
			case 'or':
				if (a === true || b === true){
					return true;
				}
				if (a === false && b === false){
					return false;
				}
				return 'unknown';
			case 'xor':
				if (a === 'unknown' || b === 'unknown'){
					return 'unknown';
				}
				return (a !== b);
			case '=':
			case '>=':
			case '<=':
			case '>':
			case '<':
			case '!=':
				typeA = this._args[0].getDataType();
				return ValueExprGeneric._condition_compare(a, b, typeA, this._func);
			case 'like':
			case 'ilike':
			case 'regexp':
			case 'rlike':
				if(!this._regex){
					throw new Error(`regex should have been set by check`);
				}
				return this._regex.test(a);
			default:
				throw new Error('this should not happen!');
		}
	}

	static _condition_compare(valueA: Data, valueB: Data, type: DataType, comparator: Comparator): boolean | 'unknown' {
		if (valueA === null || valueB === null) {
			// null compared with any not null value => 'unknown'

			switch (comparator) {
				case '=':
				case '>=':
				case '<=':
					if (valueA === valueB){
						return true;
					}
					return 'unknown';
				case '<':
				case '>':
					if (valueA === valueB){
						return false;
					}
					return 'unknown';
				case '!=':
					return valueA !== valueB;
				default:
					throw new Error('unknown operator');
			}
		}

		switch (type) {
			case 'number':
			case 'string':
				switch (comparator) {
					case '=':
						return valueA === valueB;
					case '>':
						return valueA > valueB;
					case '<':
						return valueA < valueB;
					case '>=':
						return valueA >= valueB;
					case '<=':
						return valueA <= valueB;
					case '!=':
						return valueA !== valueB;
					default:
						throw new Error('unknown operator');
				}
			case 'date':
				switch (comparator) {
					case '=':
						return (valueA as Date).getTime() === (valueB as Date).getTime();
					case '>':
						return valueA > valueB;
					case '<':
						return valueA < valueB;
					case '>=':
						return valueA >= valueB;
					case '<=':
						return valueA <= valueB;
					case '!=':
						return (valueA as Date).getTime() !== (valueB as Date).getTime();
					default:
						throw new Error('unknown operator');
				}
			case 'boolean':
				if (typeof valueA !== 'boolean' || typeof valueB !== 'boolean') {
					throw new Error('operands have different type');
				}

				switch (comparator) {
					case '=':
						return valueA === valueB;
					case '>':
						return valueA > valueB;
					case '<':
						return valueA < valueB;
					case '>=':
						return valueA >= valueB;
					case '<=':
						return valueA <= valueB;
					case '!=':
						return valueA !== valueB;
					default:
						throw new Error('unknown operator');
				}
			default:
				throw new Error('unknown type ' + type);
		}
	}

	_checkBoolean(schemaA: Schema, schemaB: Schema) {
		let typeA, typeB;

		switch (this._func) {
			case 'constant':
				return true;
			case 'not':
				return this._checkArgsDataType(schemaA, schemaB, ['boolean']);
			case 'and':
			case 'or':
			case 'xor':
				return this._checkArgsDataType(schemaA, schemaB, ['boolean', 'boolean']);
			case '=':
			case '>=':
			case '<=':
			case '>':
			case '<':
			case '!=':
				// check if the datatypes are identical
				this._args[0].check(schemaA, schemaB);
				this._args[1].check(schemaA, schemaB);

				typeA = this._args[0].getDataType();
				typeB = this._args[1].getDataType();
				if (typeA === 'null' || typeB === 'null') {
					return true;
				}
				else if (typeA === typeB) {
					return true;
				}
				else {
					this.throwExecutionError(i18n.t('db.messages.exec.error-could-not-compare-different-types', {
						typeA: typeA,
						typeB: typeB,
					}));
				}
				return this._checkArgsDataType(schemaA, schemaB, ['boolean', 'boolean']);
			case 'like':
			case 'ilike':
				// http://www.postgresql.org/docs/9.4/static/functions-matching.html#FUNCTIONS-LIKE
				this._args[0].check(schemaA, schemaB);
				if (this._args[1].getDataType() !== 'string' || this._args[1]._func !== 'constant') {
					return false;
				}

				// cache regex
				const value = this._args[1]._args[0]; // direct access of constant value
				let regex_str = regExpEscape(value);
				regex_str = regex_str.replace(/([^\\]?)_/g, '$1.');
				regex_str = regex_str.replace(/([^\\]?)%/g, '$1.*');

				const flags = this._func === 'ilike' ? 'i' : '';

				this._regex = new RegExp('^' + regex_str + '$', flags);

				break;
			case 'regexp':
			case 'rlike':
				this._args[0].check(schemaA, schemaB);
				if (this._args[1].getDataType() !== 'string' || this._args[1]._func !== 'constant') {
					return false;
				}

				// cache regex
				const txt = this._args[1]._args[0]; // direct access of constant value
				let regex_txt = txt;
				this._regex = new RegExp(regex_txt);
				break;
			default:
				throw new Error('this should not happen!');
		}
	}

	_evaluateString(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session) {
		switch (this._func) {
			case 'constant':
				return this._args[0];
			case 'lower':
			case 'upper':
				const a = this._args[0].evaluate(tupleA, tupleB, row, statementSession);

				if (a === null) {
					return null;
				}
				else if (this._func === 'lower') {
					return a.toLowerCase();
				}
				else {
					return a.toUpperCase();
				}
			case 'concat':
				let value = '';
				for (let i = 0; i < this._args.length; i++) {
					const a = this._args[i].evaluate(tupleA, tupleB, row, statementSession);
					if (a === null) {
						return null;
					}

					value += a;
				}
				return value;
			case 'repeat':
				const rep = this._args[0].evaluate(tupleA, tupleB, row, statementSession);
				const count = this._args[1].evaluate(tupleA, tupleB, row, statementSession);

				if (rep === null || count === null) {
					return null;
				}
				else {
					return rep.repeat(count >= 0 ? count : 0);
				}
			case 'replace':
				const str = this._args[0].evaluate(tupleA, tupleB, row, statementSession);
				const from_str = this._args[1].evaluate(tupleA, tupleB, row, statementSession);
				const to_str = this._args[2].evaluate(tupleA, tupleB, row, statementSession);
				return str.replace(new RegExp(from_str, 'g'), to_str);
			case 'reverse':
				const r = this._args[0].evaluate(tupleA, tupleB, row, statementSession);

				if (r === null) {
					return null;
				}
				else {
					return r.split('').reverse().join('');
				}
			default:
				throw new Error('this should not happen!');
		}
	}

	_evaluateNumber(tupleA: Tuple, tupleB: Tuple, row: number, statementSession: Session) {
		// no args
		switch (this._func) {
			case 'constant':
				return this._args[0];
		}


		// unary and binary functions
		const valueA = this._args.length > 0 ? this._args[0].evaluate(tupleA, tupleB, row, statementSession) : undefined;
		const valueB = this._args.length > 1 ? this._args[1].evaluate(tupleA, tupleB, row, statementSession) : undefined;

		switch (this._func) {
			case 'add':
				if (valueA === null || valueB === null) {
					return null;
				}
				return valueA + valueB;
			case 'sub':
				if (valueA === null || valueB === null) {
					return null;
				}
				return valueA - valueB;
			case 'mul':
				if (valueA === null || valueB === null) {
					return null;
				}
				return valueA * valueB;
			case 'div':
				if (valueA === null || valueB === null) {
					return null;
				}
				return valueA / valueB;
			case 'mod':
				if (valueA === null || valueB === null) {
					return null;
				}
				return valueA % valueB;

			case 'abs':
				if (valueA === null) {
					return null;
				}
				return Math.abs(valueA);

			case 'floor':
				if (valueA === null) {
					return null;
				}
				return Math.floor(valueA);

			case 'ceil':
				if (valueA === null) {
					return null;
				}
				return Math.ceil(valueA);

			case 'round':
				if (valueA === null) {
					return null;
				}
				return Math.round(valueA);

			case 'minus':
				if (valueA === null) {
					return null;
				}
				return -valueA;

			case 'rand':
				return Math.random();

			case 'rownum':
				return row + 1;


			case 'strlen':
				if (valueA === null) {
					return null;
				}
				return valueA.length;

			case 'year':
				if (valueA === null) {
					return null;
				}
				return valueA.getFullYear();
			case 'month':
				if (valueA === null) {
					return null;
				}
				return valueA.getMonth() + 1;
			case 'dayofmonth':
				if (valueA === null) {
					return null;
				}
				return valueA.getDate();
			case 'hour':
				if (valueA === null) {
					return null;
				}
				return valueA.getHours();
			case 'minute':
				if (valueA === null) {
					return null;
				}
				return valueA.getMinutes();
			case 'second':
				if (valueA === null) {
					return null;
				}
				return valueA.getSeconds();

			default:
				throw new Error('this should not happen!');
		}
	}

	_checkArgsDataType(schemaA: Schema, schemaB: Schema, types_expected: DataType[]) {
		const types_given: DataType[] = [];

		if (this._args.length !== types_expected.length) {
			throw new Error('this should not happen: #args != #types');
		}

		for (let i = 0; i < types_expected.length; i++) {
			this._args[i].check(schemaA, schemaB);
			types_given.push(this._args[i].getDataType());
		}

		for (let i = 0; i < types_given.length; i++) {
			if (types_given[i] !== types_expected[i]) {
				this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-type', {
					func: this._func,
					expected: types_expected,
					given: types_given,
				}));
			}
		}
		return true;
	}

	getDataType() {
		if (this._dataTypeCalculated !== null) {
			return this._dataTypeCalculated;
		}
		return this._dataType;
	}

	check(schemaA: Schema, schemaB: Schema) {
		switch (this._dataType) {
			case 'string':
				return this._checkString(schemaA, schemaB);
			case 'number':
				return this._checkNumber(schemaA, schemaB);
			case 'boolean':
				return this._checkBoolean(schemaA, schemaB);
			case 'date':
				return this._checkDate(schemaA, schemaB);
			case 'null':
				return this._checkNull(schemaA, schemaB);
			default:
				throw new Error('this should not happen!');
		}
	}

	_checkNull(schemaA: Schema, schemaB: Schema) {
		switch (this._func) {
			case 'constant':
				return true;
			case 'coalesce':
				if (this._args.length === 0) {
					throw new Error('this should not happen!');
				}

				// all arguments must be of same type or null
				this._args[0].check(schemaA, schemaB);
				this._dataTypeCalculated = this._args[0].getDataType();

				for (let i = 1; i < this._args.length; i++) {
					this._args[i].check(schemaA, schemaB);
					const dataType = this._args[i].getDataType();

					if (this._dataType === 'null' && dataType !== 'null') {
						this._dataTypeCalculated = dataType;
					}
					else if (dataType !== 'null' && this._dataType !== dataType) {
						this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-arguments-of-same-type', {func: 'COALESCE()'}));
					}
				}
				break;
			case 'caseWhen':
			case 'caseWhenElse':
				// conditions are on i%2 === 0
				// values on i%2 === 1

				// check conditions to be boolean
				for (let i = 0; i < this._args.length; i += 2) {
					this._args[i].check(schemaA, schemaB);
					if (this._args[i].getDataType() !== 'boolean') {
						this.throwExecutionError(i18n.t('db.messages.exec.error-case-when-condition-must-be-boolean'));
					}
				}

				// all values must be of same type
				this._args[1].check(schemaA, schemaB);
				this._dataTypeCalculated = this._args[1].getDataType();

				for (let i = 3; i < this._args.length; i += 2) {
					this._args[i].check(schemaA, schemaB);
					const dataType = this._args[i].getDataType();

					if (this._dataType === 'null' && dataType !== 'null') {
						this._dataTypeCalculated = dataType;
					}
					else if (dataType !== 'null' && this._dataType !== dataType) {
						this.throwExecutionError(i18n.t('db.messages.exec.error-case-when-expects-results-of-same-type'));
					}
				}
				break;
			default:
				throw new Error('this should not happen!');
		}
	}

	_checkString(schemaA: Schema, schemaB: Schema) {
		switch (this._func) {
			case 'constant':
				return true;
			case 'lower':
			case 'upper':
			case 'reverse':
				return this._checkArgsDataType(schemaA, schemaB, ['string']);
			case 'replace':
				return this._checkArgsDataType(schemaA, schemaB, ['string', 'string', 'string']);
			case 'repeat':
				//return this._checkArgsDataType(schemaA, schemaB, ['string', 'number']);

				if (this._args.length !== 2) {
					throw new Error('this should not happen!');
				}

				// arguments must be of type string and number, or null
				this._args[0].check(schemaA, schemaB);
				const typeStr = this._args[0].getDataType();
				this._args[1].check(schemaA, schemaB);
				const typeCount = this._args[1].getDataType();

				if ( (typeStr !== 'string' && typeStr !== 'null') ||
					 (typeCount !== 'number' && typeCount !== 'null') ) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-type', {
						func: 'repeat()',
						expected: ['string', 'number'],
						given: [typeStr, typeCount],
					}));
				}
				break;
			case 'concat':
				if (this._args.length === 0) {
					throw new Error('this should not happen!');
				}

				// all arguments must be of type String or null
				this._args[0].check(schemaA, schemaB);
				this._dataTypeCalculated = 'string';

				for (let i = 1; i < this._args.length; i++) {
					this._args[i].check(schemaA, schemaB);
					const dataType = this._args[i].getDataType();

					if (this._dataType === 'null' && dataType !== 'null') {
						this._dataTypeCalculated = dataType;
					}
					// else if (dataType !== 'null' && this._dataType !== dataType) {
					// 	this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-arguments-of-same-type', {func: 'CONCAT()'}));
					// }
				}
				break;
			default:
				throw new Error('this should not happen!');
		}
	}

	_checkNumber(schemaA: Schema, schemaB: Schema) {
		switch (this._func) {
			case 'constant':
			case 'rand':
			case 'rownum':
				return true;
			case 'add':
			case 'sub':
			case 'mul':
			case 'div':
			case 'mod':
				return this._checkArgsDataType(schemaA, schemaB, ['number', 'number']);
			case 'abs':
			case 'floor':
			case 'ceil':
			case 'round':
			case 'minus':
				return this._checkArgsDataType(schemaA, schemaB, ['number']);
			case 'strlen':
				return this._checkArgsDataType(schemaA, schemaB, ['string']);

			case 'year':
			case 'month':
			case 'dayofmonth':
			case 'hour':
			case 'minute':
			case 'second':
				return this._checkArgsDataType(schemaA, schemaB, ['date']);

			default:
				throw new Error('this should not happen!');
		}
	}

	toString() {
		let str = this._func + '(';
		for (let i = 0; i < this._args.length; i++) {
			if (i !== 0) {
				str += ', ';
			}
			str += this._args[i] === null ? 'null' : this._args[i].toString();
		}
		return str + ')';
	}

	getFormulaHtml(): string {
		const printFunction = (func_name: string) => {
			let str = (func_name || this._func) + '(';
			for (let i = 0; i < this._args.length; i++) {
				if (i !== 0) {
					str += ', ';
				}
				str += this._args[i].getFormulaHtml();
			}
			return str + ')';
		};

		const printCase = (hasElse: boolean) => {
			// conditions are on i%2 === 0
			// values on i%2 === 1
			// else is the very last element (if present)

			let str = 'CASE';
			for (let i = 0; i < this._args.length - (hasElse ? 2 : 0); i += 2) {
				str += ` WHEN ${this._args[i].getFormulaHtml()} THEN ${this._args[i + 1].getFormulaHtml()}`;
			}
			if (hasElse === true) {
				str += ' ELSE ' + this._args[this._args.length - 1].getFormulaHtml();
			}

			return str + ' END';
		};

		const binary = (func_name: string) => {
			let s = '';

			s += `<span> ${(func_name || this._func)} </span>`;
			
			s = this._args[0].getFormulaHtml() + s;
			s += this._args[1].getFormulaHtml();
			return `<span>${s}</span>`;
		};

		function getFormula(this: ValueExprGeneric): string | number {
			const {_func} = this;
			switch (_func) {
				case 'constant': {
					const value = this._args[0] as Data;
					const type = this._dataTypeCalculated || this._dataType;
					return printValue(value, type);
				}
				case 'rand':
				case 'rownum':
				case 'abs':
				case 'ceil':
				case 'floor':
				case 'round':
				case 'year':
				case 'month':
				case 'dayofmonth':
				case 'hour':
				case 'minute':
				case 'second':
				case 'adddate':
				case 'subdate':
				case 'concat':
				case 'upper':
				case 'lower':
				case 'replace':	
				case 'reverse':
				case 'date':
					return printFunction.call(this, _func.toUpperCase());
				case 'strlen':
					return printFunction.call(this, 'length');

				case 'minus':
					return printFunction.call(this, '-');

				case 'not':
					return printFunction.call(this, '!');

				case 'caseWhen':
				case 'caseWhenElse':
					return printCase.call(this, this._func === 'caseWhenElse');

				case 'add':
					return binary.call(this, '+');
				case 'sub':
					return binary.call(this, '-');
				case 'mul':
					return binary.call(this, '*');
				case 'div':
					return binary.call(this, '/');
				case 'mod':
					return binary.call(this, '%');

				case 'and':
				case 'or':
				case 'xor':
				case 'like':
				case 'ilike':
				case 'regexp':
				case 'rlike':
				case '=':
					return binary.call(this, _func);

				case '>=':
					return binary.call(this, '≥');
				case '<=':
					return binary.call(this, '≤');
				case '>':
					return binary.call(this, '&gt;');
				case '<':
					return binary.call(this, '&lt;');
				case '!=':
					return binary.call(this, '≠');
			}

			return this.toString();
		}

		if (this._wrappedInParentheses === true) {
			return `(${getFormula.call(this)})`;
		}
		else {
			return (getFormula.call(this)).toString();
		}
	}
}
