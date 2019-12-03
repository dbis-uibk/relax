/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Data, DataType } from 'db/exec/Schema';

// builds the formated text version of a group
export function textFromGroupAstRoot(astRoot: relalgAst.GroupRoot) {
	if (astRoot.type !== 'groupRoot') {
		throw new Error('wrong ast!?');
	}
	let s = '';

	function group_to_text(group: relalgAst.Group) {
		let s = '';
		// header
		const { headers } = group;
		for (const header of headers) {
			const { name, lang, text } = header;

			s += name;
			if (lang !== null) {
				s += '@' + lang;
			}
			s += ':';

			if (header.text.indexOf('\n') !== -1) {
				s += `[[${header.text}]]\n`;
			}
			else {
				s += header.text + '\n';
			}
		}
		s += '\n';

		// body
		for (let i = 0; i < group.assignments.length; i++) {
			s += group.assignments[i].name + ' = ';
			s += textFromRelalgAstNode(group.assignments[i].child);
			s += '\n\n';
		}

		return s;
	}

	for (let i = 0; i < astRoot.groups.length; i++) {
		s += group_to_text(astRoot.groups[i]);

		if (i !== astRoot.groups.length - 1) {
			s += '\n\n\n\n';
		}
	}

	return s;
}

// builds the formated text version of a relalg root
export function textFromRelalgAstRoot(root: relalgAst.rootRelalg) {
	'use strict';

	if (root.type !== 'relalgRoot') {
		throw new Error('wrong ast!?');
	}
	let s = '';

	// assignments
	for (let i = 0; i < root.assignments.length; i++) {
		s += root.assignments[i].name + ' = ';
		s += textFromRelalgAstNode(root.assignments[i].child);
		s += '\n\n';
	}

	s += textFromRelalgAstNode(root.child);

	return s;
}

export function textFromRelalgAstNode(node: relalgAst.astNode) {
	'use strict';

	function unaryFormula(className: string | null, funcName: string | null, argument: string | null, body: string | null) {
		const s = $('<span>'); // TODO: remove jquery!
		if (className !== null) {
			s.addClass(className);
		}

		if (funcName !== null) {
			s.append(funcName);
		}

		if (argument !== null) {
			const sub = $('<sub>');
			sub.append(argument);
			s.append(' ').append(sub);
		}

		if (body !== null) {
			s.append(' ( ').append(body).append(' ) ');
		}
		return s.text();
	}

	function binaryFormula(className: string | null, funcName: string, argument: string | null, child: string, child2: string) {
		const s = $('<span>');
		if (className !== null) {
			s.addClass(className);
		}

		s.append('( ').append(child).append(' ) ');

		s.append(funcName);
		if (argument !== null) {
			const sub = $('<sub>');
			sub.append(argument);
			s.append(sub);
		}

		s.append(' ( ').append(child2).append(' ) ');
		return s.text();
	}

	function columnName(name: string | number, relAlias: string | null) {
		if (typeof name === 'number') {
			name = `[${name}]`;
		}

		if (relAlias === null) {
			return name;
		}
		return `${relAlias}.${name}`;
	}

	function comparison(className: string | null, comparator: '!=' | '>=' | '<=', child: string, child2: string, ltr: boolean) {
		const s = $('<span>');
		if (className !== null) {
			s.addClass(className);
		}

		if (ltr === true) {
			s.append(child);
		}
		else {
			s.append(child2);
		}

		let c: string = comparator;

		// nice comparator symbol
		switch (comparator) {
			case '!=':
				c = '≠';
				break;
			case '>=':
				c = '≥';
				break;
			case '<=':
				c = '≤';
				break;
		}
		s.append(c);

		if (ltr === true) {
			s.append(child2);
		}
		else {
			s.append(child);
		}

		return s.text();
	}

	function booleanOp(className: string | null, operator: string, child: string, child2: string) {
		const s = $('<span>');
		if (className !== null) {
			s.addClass(className);
		}

		s.append('(').append(child).append(') ');
		s.append(operator);
		s.append(' (').append(child2).append(')');
		return s.text();
	}

	function dateFormatISO(val: Date) {
		const month = (
			val.getMonth() + 1 < 10
				? '0' + (val.getMonth() + 1)
				: (val.getMonth() + 1)
		);
		const day = (
			val.getDate() < 10
				? '0' + val.getDate()
				: val.getDate()
		);
		return `${val.getFullYear()}-${month}-${day}`;
	}

	function value(val: Data, type: DataType) {
		if (val === null || type === 'null') {
			return 'null';
		}

		if (val instanceof Date) {
			return dateFormatISO(val);
		}
		else if (typeof val === 'string') {
			return `'${val}'`;
		}
		else if (typeof val === 'number') {
			return val.toString();
		}
		else {
			throw new Error('unknown type ' + type);
		}
	}

	function variable(name: string) {
		const s = $('<span>');
		s.append(name);
		return s.text();
	}

	function formatInlineTable(rows: string[][], delimiter: string, compact: boolean) {
		// calculate max length per column
		const colLengths = [];
		if (compact === false) {
			for (let i = 0; i < rows.length; i++) {
				for (let j = 0; j < rows[i].length; j++) {
					const length = rows[i][j].length;
					if (i === 0 || length > colLengths[j]) {
						colLengths[j] = length;
					}
				}
			}
		}

		// build output
		let s = '{\n';

		for (let i = 0; i < rows.length; i++) {
			for (let j = 0; j < rows[i].length; j++) {
				if (compact === false) {
					// pad with spaces (right)
					rows[i][j] = (rows[i][j] + (new Array(colLengths[j] + 1 - rows[i][j].length)).join(' '));
				}
			}
			if (compact === false) {
				s += '\t';
			}
			s += rows[i].join(delimiter) + '\n';
		}

		return s + '}';
	}

	function rec(n: relalgAst.astNode): string {
		// π σ ρ ←   ∧ ∨   ≠ = ¬ ≥ ≤   ∩ ∪ ÷ -   ✕ ⋈ ⟕ ⟖ ⟗ ⋉ ⋊

		switch (n.type) {
			case 'relation':
				return unaryFormula(n.type, n.name, null, null);

			case 'table':
				{
					const rows: string[][] = [];

					// header
					let row: string[] = [];
					for (let i = 0; i < n.columns.length; i++) {
						const col = n.columns[i];

						row.push(`${columnName(col.name, col.relAlias)}:${col.type}`);
					}
					rows.push(row);


					// rows
					for (let i = 0; i < n.rows.length; i++) {
						row = [];
						for (let j = 0; j < n.rows[i].length; j++) {
							row.push(value(n.rows[i][j], n.columns[i].type));
						}
						rows.push(row);
					}
					return formatInlineTable(rows, ', ', false);
				}
			case 'selection':
				return unaryFormula(n.type, 'σ', rec(n.arg), rec(n.child));

			case 'projection':
				{
					const args = [];
					for (let i = 0; i < n.arg.length; i++) {
						args.push(columnName(n.arg[i].name, n.arg[i].relAlias));
					}

					return unaryFormula(n.type, 'π', args.join(', '), rec(n.child));
				}
			case 'union':
				return binaryFormula(n.type, '∪', null, rec(n.child), rec(n.child2));

			case 'intersect':
				return binaryFormula(n.type, '∩', null, rec(n.child), rec(n.child2));

			case 'division':
				return binaryFormula(n.type, '÷', null, rec(n.child), rec(n.child2));

			case 'difference':
				return binaryFormula(n.type, '-', null, rec(n.child), rec(n.child2));

			case 'renameColumns':
				{
					const args = [];
					for (let i = 0; i < n.arg.length; i++) {
						const e = n.arg[i];
						args.push(`${e.dst}←${columnName(e.src.name, e.src.relAlias)}`);
					}

					return unaryFormula(n.type, 'ρ', args.join(', '), rec(n.child));
				}
			case 'renameRelation':
				return unaryFormula(n.type, 'ρ', n.newRelAlias, rec(n.child));

			case 'orderBy':
				{
					const args = [];
					for (let i = 0; i < n.arg.length; i++) {
						const e = n.arg[i];
						const s = `${columnName(e.col.name, e.col.relAlias)} ${e.asc ? 'asc' : 'desc'}`;
						args.push(s);
					}

					return unaryFormula(n.type, 'ψ', args.join(', '), rec(n.child));
				}
			case 'groupBy':
				{
					let argument = '';
					let tmp = [];

					// group
					if (n.group.length > 0) {
						for (let i = 0; i < n.group.length; i++) {
							tmp.push(columnName(n.group[i].name, n.group[i].relAlias));
						}
						argument += tmp.join(', ') + ' ; ';
					}

					// aggregate
					tmp = [];
					for (let i = 0; i < n.aggregate.length; i++) {
						const f = n.aggregate[i];
						// tmp.push(f.name + '←');

						if (f.aggFunction === 'COUNT_ALL') {
							tmp.push(f.name + ' ← COUNT(*)');
						}
						else {
							tmp.push(`${f.name} ← ${f.aggFunction}(${columnName(f.col.name, f.col.relAlias)})`);
						}
					}
					argument += tmp.join(', ');

					return unaryFormula(n.type, 'γ', argument, rec(n.child));
				}
			case 'thetaJoin':
				return binaryFormula(n.type, '⋈', rec(n.arg), rec(n.child), rec(n.child2));

			case 'crossJoin':
				return binaryFormula(n.type, '⨯', null, rec(n.child), rec(n.child2));

			case 'naturalJoin':
				return binaryFormula(n.type, '⋈', null, rec(n.child), rec(n.child2));

			case 'leftSemiJoin':
				return binaryFormula(n.type, '⋉', null, rec(n.child), rec(n.child2));

			case 'rightSemiJoin':
				return binaryFormula(n.type, '⋊', null, rec(n.child), rec(n.child2));

			case 'antiJoin':
				return binaryFormula(n.type, '▷', null, rec(n.child), rec(n.child2));

			case 'leftOuterJoin':
				{
					const condition = (n.arg === null ? null : rec(n.arg));
					return binaryFormula(n.type, '⟕', condition, rec(n.child), rec(n.child2));
				}
			case 'rightOuterJoin':
				{
					const condition = (n.arg === null ? null : rec(n.arg));
					return binaryFormula(n.type, '⟖', condition, rec(n.child), rec(n.child2));
				}
			case 'fullOuterJoin':
				{
					const condition = (n.arg === null ? null : rec(n.arg));
					return binaryFormula(n.type, '⟗', condition, rec(n.child), rec(n.child2));
				}

			// FIXME: expression???

			/*case 'ConditionConst':
				return unaryFormula(n.type, n.value + '', null, null);

			case 'ConditionAnd':
				return booleanOp(n.type, '∧', rec(n.child), rec(n.child2));

			case 'ConditionNot':
				return unaryFormula(n.type, '¬', null, rec(n.child));

			case 'ConditionOr':
				return booleanOp(n.type, '∨', rec(n.child), rec(n.child2));

			case 'ConditionColEqualsValue':
				return comparison(n.type, n.comparator, columnName(n.col.name, n.col.relAlias), value(n.value, n.valType), n.ltr);

			case 'ConditionColEqualsCol':
				return comparison(n.type, n.comparator, columnName(n.col.name, n.col.relAlias), columnName(n.col2.name, n.col2.relAlias), false);

			case 'variable':
				return variable(n.name);*/

			default:
				throw new Error(`type ${n.type} not implemented`);
		}
	}

	return rec(node);
}
