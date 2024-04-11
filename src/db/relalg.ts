/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { i18n } from 'calc2/i18n';
import { Relation } from 'db/exec/Relation';
import { parseRelalg } from 'db/parser/parser_ra';
import { RANode } from './exec/RANode';
import { relalgFromRelalgAstRoot } from './translate/relalgFromAst';
import { replaceVariables } from './translate/replaceVariables';


export { parseRelalg, parseRelalgGroup } from './parser/parser_ra';
export { relalgFromRelalgAstNode, relalgFromRelalgAstRoot, relalgFromSQLAstRoot } from './translate/relalgFromAst';
export { replaceVariables } from './translate/replaceVariables';
export { textFromGroupAstRoot, textFromRelalgAstNode, textFromRelalgAstRoot } from './translate/textFromAst';

export type AutoreplaceOperatorsMode = 'none' | 'plain2math' | 'math2plain';

/** indices are 1-based */
type TextCursor = { line: number, column: number };
export function queryWithReplacedOperatorsFromAst(
	query: string,
	operatorPositions: relalgAst.NodeInfo[],
	cursor: TextCursor,
	mode: AutoreplaceOperatorsMode,
): { query: string, cursor: TextCursor } {
	if (mode === 'none') {
		return {
			query,
			cursor,
		};
	}

	const newOperators = {
		'math2plain': {
			'pi': 'pi',
			'sigma': 'sigma',
			'rho': 'rho',
			'arrowLeft': '<-',
			'arrowRight': '->',
			'psi': 'psi',
			'tau': 'tau',
			'gamma': 'gamma',
			'unionOperator': 'union',
			'intersectOperator': 'intersect',
			'divisionOperator': '/',
			'differenceOperator': '-',
			'crossJoinOperator': 'cross join',
			'innerJoinOperator': 'inner join',
			'naturalJoinOperator': 'natural join',
			'leftSemiJoinOperator': 'left semi join',
			'rightSemiJoinOperator': 'right semi join',
			'antiJoinOperator': 'anti join',
			'leftOuterJoinOperator': 'left outer join',
			'rightOuterJoinOperator': 'right outer join',
			'fullOuterJoinOperator': 'full outer join',
		},
		'plain2math': {
			'pi': 'π',
			'sigma': 'σ',
			'rho': 'ρ',
			'arrowLeft': '←',
			'arrowRight': '→',
			'psi': 'ψ',
			'tau': 'τ',
			'gamma': 'γ',
			'unionOperator': '∪',
			'intersectOperator': '∩',
			'divisionOperator': '÷',
			'differenceOperator': '-',
			'crossJoinOperator': '⨯',
			'innerJoinOperator': '⨝',
			'naturalJoinOperator': '⨝',
			'leftSemiJoinOperator': '⋉',
			'rightSemiJoinOperator': '⋊',
			'antiJoinOperator': '▷',
			'leftOuterJoinOperator': '⟕',
			'rightOuterJoinOperator': '⟖',
			'fullOuterJoinOperator': '⟗',
		},
	};
	for (let i = operatorPositions.length - 1; i >= 0; i--) {
		const op = operatorPositions[i];
		const location = op.location; // = location without surrounding whitespace
		const left = query.substr(0, location.start.offset - 1); // fixed offset | #174
		const right = query.substring(location.end.offset);
		const newOperator = (newOperators[mode] as any)[op.name]; // TODO: fix typings
		const oldOperator = query.substring(location.start.offset, location.end.offset);
		if (oldOperator === newOperator) {
			continue;
		}

		// handle cursor position (all new operators are single-lined!)
		if (cursor) {
			// cursor was in the same line(s) (old operator could be split across multiple lines)
			if (cursor.line >= location.start.line && cursor.line <= location.end.line) {
				// cursor is in operator => skip replacement!
				if (cursor.column > location.start.column && cursor.column < location.end.column) {
					continue;
				}
				else if (cursor.column >= location.end.column) {
					cursor.line -= location.end.line - location.start.line;

					const oldLength = op.location.end.offset - op.location.start.offset;
					const newLength = newOperator.length;

					cursor.column -= oldLength - newLength;
				}
			}
			// cursor was above of old operator
			else if (cursor.line < location.start.line) {
				// noop;
			}
			// cursor was below the old operator 
			else if (cursor.line > location.end.line) {
				// just update the line; column is unchanged
				cursor.line -= location.end.line - location.start.line;
			}
		}
		// update query
		query = left + newOperator + right;
	}
	return {
		query,
		cursor,
	};
}




const pegParserSql = require('./parser/grammar_sql.pegjs') as any;

export function parseSQLSelect(text: string): sqlAst.rootSql {

	return pegParserSql.parse(
		// Remove any whitespace before '(' character
		text.replace(/\s*\(/g, '('),
		{
			startRule: 'start',
			tracer: undefined,
			i18n,
		},
	);
}
export function parseSQLDump(text: string): relalgAst.GroupRoot {
	return pegParserSql.parse(
		text,
		{
			startRule: 'dbDumpStart',
			tracer: undefined,
		},
	);
}


export function executeRelalg(text: string, relations: { [name: string]: Relation } = {}): RANode {
	relations = relations || {};

	const ast = parseRelalg(text, Object.keys(relations));
	replaceVariables(ast, relations);

	const root = relalgFromRelalgAstRoot(ast, relations);
	root.check();
	return root;
}
