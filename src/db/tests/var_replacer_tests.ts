/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Relation } from 'db/exec/Relation';
import { RANode } from '../exec/RANode';
import * as relalgjs from '../relalg';

const relations = {
	firstRelation: exec_ra(`{
		a:string
	}`, {}),
	secondRelation: exec_ra(`{
		a:string
	}`, {}),
};

QUnit.module('variable replacer');

function exec_ra(query: string, alternativeRelations: { [name: string]: Relation }): RANode {
	return relalgjs.executeRelalg(query, alternativeRelations || relations);
}

function mockRaRoot(arg: {
	child: Exclude<relalgAst.rootRelalg['child'], 'codeInfo'>,
} & Partial<Pick<relalgAst.rootRelalg, 'operatorPositions' | 'assignments'>>) {
	const root: relalgAst.rootRelalg = {
		type: 'relalgRoot',
		operatorPositions: [],
		assignments: [],
		codeInfo: mockCodeInfo(),
		...arg,
	};
	return root;
}

function mockCodeInfo(): relalgAst.CodeInfo {
	return {
		location: {
			start: { column: 0, line: 0, offset: 0 },
			end: { column: 0, line: 0, offset: 0 },
		},
		text: '',
	};
}

function dropCodeInfo(root: relalgAst.rootRelalg) {
	const rec = (n: any) => {
		if (typeof n === 'object') {
			if (n.hasOwnProperty('codeInfo')) {
				delete n.codeInfo;
			}

			for (const prop of Object.keys(n)) {
				rec(n[prop]);
			}
		}
	};

	rec(root);
}


QUnit.testStart(function () {
	const firstRelation = exec_ra(`{
		a:string
	}`, {});
	const secondRelation = exec_ra(`{
		a:string
	}`, {});

	relations.firstRelation = firstRelation;
	relations.secondRelation = secondRelation;
});

QUnit.test('simple relation', function (assert) {
	const query = 'test';
	const ast = relalgjs.parseRelalg(query);

	const expected = mockRaRoot({
		child: {
			type: 'relation',
			name: 'test',
			codeInfo: mockCodeInfo(),
		},
	});

	dropCodeInfo(ast);
	dropCodeInfo(expected);
	assert.deepEqual(ast, expected);
});

QUnit.test('test selection 0', function (assert) {
	const query = 'sigma true (test)';
	const ast = relalgjs.parseRelalg(query);

	const expected = mockRaRoot({
		child: {
			type: 'selection',
			arg: {
				type: 'valueExpr',
				datatype: 'boolean',
				func: 'constant',
				args: [true],
				codeInfo: mockCodeInfo(),
			},
			child: {
				type: 'relation',
				name: 'test',
				wrappedInParentheses: true,
				codeInfo: mockCodeInfo(),
			},
			codeInfo: mockCodeInfo(),
		},
		operatorPositions: [
			{
				'location': {
					'end': {
						'column': 6,
						'line': 1,
						'offset': 5,
					},
					'start': {
						'column': 1,
						'line': 1,
						'offset': 0,
					},
				},
				'name': 'sigma',
				'type': 'nodeInfo',
			},
		],
	});

	dropCodeInfo(ast);
	dropCodeInfo(expected);
	assert.deepEqual(ast, expected);
});

QUnit.test('test selection 1', function (assert) {
	const query = '(σ (false) (test))';
	const ast = relalgjs.parseRelalg(query);

	const expected = mockRaRoot({
		child: {
			type: 'selection',
			arg: {
				type: 'valueExpr',
				datatype: 'boolean',
				func: 'constant',
				args: [false],
				wrappedInParentheses: true,
				codeInfo: mockCodeInfo(),
			},
			child: {
				type: 'relation',
				name: 'test',
				wrappedInParentheses: true,
				codeInfo: mockCodeInfo(),
			},
			wrappedInParentheses: true,
			codeInfo: mockCodeInfo(),
		},
		operatorPositions: [
			{
				'location': {
					'end': {
						'column': 3,
						'line': 1,
						'offset': 2,
					},
					'start': {
						'column': 2,
						'line': 1,
						'offset': 1,
					},
				},
				'name': 'sigma',
				'type': 'nodeInfo',
			},
		],
	});

	dropCodeInfo(ast);
	dropCodeInfo(expected);
	assert.deepEqual(ast, expected);
});

QUnit.test('test variables (unreplaced)', function (assert) {
	const query = 'A = firstRelation ' +
		'B = secondRelation ' +
		'σ false (A union B)';
	const ast = relalgjs.parseRelalg(query);

	const expected = mockRaRoot({
		child: {
			type: 'selection',
			arg: {
				type: 'valueExpr',
				datatype: 'boolean',
				func: 'constant',
				args: [false],
				codeInfo: mockCodeInfo(),
			},
			child: {
				type: 'union',
				child: {
					type: 'relation',
					name: 'A',
					codeInfo: mockCodeInfo(),
				},
				child2: {
					type: 'relation',
					name: 'B',
					codeInfo: mockCodeInfo(),
				},
				wrappedInParentheses: true,
				codeInfo: mockCodeInfo(),
			},
			codeInfo: mockCodeInfo(),
		},
		assignments: [
			{
				type: 'assignment',
				name: 'A',
				child: {
					type: 'relation',
					name: 'firstRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
			{
				type: 'assignment',
				name: 'B',
				child: {
					type: 'relation',
					name: 'secondRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
		],
		operatorPositions: [
			{
				'location': {
					'end': {
						'column': 54,
						'line': 1,
						'offset': 53,
					},
					'start': {
						'column': 49,
						'line': 1,
						'offset': 48,
					},
				},
				'name': 'unionOperator',
				'type': 'nodeInfo',
			},
			{
				'location': {
					'end': {
						'column': 39,
						'line': 1,
						'offset': 38,
					},
					'start': {
						'column': 38,
						'line': 1,
						'offset': 37,
					},
				},
				'name': 'sigma',
				'type': 'nodeInfo',
			},
		],
	});

	dropCodeInfo(ast);
	dropCodeInfo(expected);
	assert.deepEqual(ast, expected);
});


QUnit.test('test variables (replaced)', function (assert) {
	const query = 'A = firstRelation ' +
		'B = secondRelation ' +
		'σ false (A union B)';
	const ast = relalgjs.parseRelalg(query);

	const expected = mockRaRoot({
		child: {
			type: 'selection',
			arg: {
				type: 'valueExpr',
				datatype: 'boolean',
				func: 'constant',
				args: [false],
				codeInfo: mockCodeInfo(),
			},
			child: {
				type: 'union',
				child: {
					metaData: {
						fromVariable: 'A',
					},
					codeInfo: mockCodeInfo(),
					type: 'relation',
					name: 'firstRelation',
				},
				child2: {
					metaData: {
						fromVariable: 'B',
					},
					codeInfo: mockCodeInfo(),
					type: 'relation',
					name: 'secondRelation',
				},
				wrappedInParentheses: true,
				codeInfo: mockCodeInfo(),
			},
			codeInfo: mockCodeInfo(),
		},
		operatorPositions: [
			{
				'location': {
					'end': {
						'column': 54,
						'line': 1,
						'offset': 53,
					},
					'start': {
						'column': 49,
						'line': 1,
						'offset': 48,
					},
				},
				'name': 'unionOperator',
				'type': 'nodeInfo',
			},
			{
				'location': {
					'end': {
						'column': 39,
						'line': 1,
						'offset': 38,
					},
					'start': {
						'column': 38,
						'line': 1,
						'offset': 37,
					},
				},
				'name': 'sigma',
				'type': 'nodeInfo',
			},
		],
		assignments: [
			{
				type: 'assignment',
				name: 'A',
				child: {
					metaData: {
						fromVariable: 'A',
					},
					type: 'relation',
					name: 'firstRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
			{
				type: 'assignment',
				name: 'B',
				child: {
					metaData: {
						fromVariable: 'B',
					},
					type: 'relation',
					name: 'secondRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
		],
	});

	relalgjs.replaceVariables(ast, relations);

	dropCodeInfo(ast);
	dropCodeInfo(expected);
	assert.deepEqual(ast, expected);
});

QUnit.test('test variables without cycle', function (assert) {
	const query = 'A = firstRelation ' +
		'B = secondRelation ' +
		'C = A ' +
		'σ false (C union B)';
	const ast = relalgjs.parseRelalg(query);

	const expected = mockRaRoot({
		child: {
			type: 'selection',
			arg: {
				type: 'valueExpr',
				datatype: 'boolean',
				func: 'constant',
				args: [false],
				codeInfo: mockCodeInfo(),
			},
			child: {
				type: 'union',
				child: {
					metaData: {
						fromVariable: 'C',
					},
					type: 'relation',
					name: 'firstRelation',
					codeInfo: mockCodeInfo(),
				},
				child2: {
					metaData: {
						fromVariable: 'B',
					},
					type: 'relation',
					name: 'secondRelation',
					codeInfo: mockCodeInfo(),
				},
				wrappedInParentheses: true,
				codeInfo: mockCodeInfo(),
			},
			codeInfo: mockCodeInfo(),
		},
		assignments: [
			{
				type: 'assignment',
				name: 'A',
				child: {
					metaData: {
						fromVariable: 'A',
					},
					type: 'relation',
					name: 'firstRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
			{
				type: 'assignment',
				name: 'B',
				child: {
					metaData: {
						fromVariable: 'B',
					},
					type: 'relation',
					name: 'secondRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
			{
				type: 'assignment',
				name: 'C',
				child: {
					metaData: {
						fromVariable: 'A',
					},
					type: 'relation',
					name: 'firstRelation',
					codeInfo: mockCodeInfo(),
				},
				codeInfo: mockCodeInfo(),
			},
		],
		operatorPositions: [
			{
				'location': {
					'end': {
						'column': 60,
						'line': 1,
						'offset': 59,
					},
					'start': {
						'column': 55,
						'line': 1,
						'offset': 54,
					},
				},
				'name': 'unionOperator',
				'type': 'nodeInfo',
			},
			{
				'location': {
					'end': {
						'column': 45,
						'line': 1,
						'offset': 44,
					},
					'start': {
						'column': 44,
						'line': 1,
						'offset': 43,
					},
				},
				'name': 'sigma',
				'type': 'nodeInfo',
			},
		],
	});

	relalgjs.replaceVariables(ast, relations);

	dropCodeInfo(ast);
	dropCodeInfo(expected);
	assert.deepEqual(ast, expected);
});

QUnit.test('test variables with cycle', function (assert) {
	const query = 'A = B ' +
		'B = C ' +
		'C = A ' +
		'(σ (false) ((C) union (B)))';
	const ast = relalgjs.parseRelalg(query);

	try {
		relalgjs.replaceVariables(ast, relations);
		assert.ok(false, 'execution should fail as the query contains a cycle');
	}
	catch (e) {
		assert.equal(e.message.toLocaleLowerCase().indexOf('variable "a"') > -1, true);
	}
});

QUnit.test('test variables with name conflict', function (assert) {
	const query = 'A = B ' +
		'secondRelation = A ' +
		'(A)';
	const ast = relalgjs.parseRelalg(query);

	try {
		relalgjs.replaceVariables(ast, relations);
		assert.ok(false);
	}
	catch (e) {
		assert.equal(e.message.indexOf('conflict') > -1, true);
	}
});

QUnit.test('extract operators with the tracer', function (assert) {
	const query = `R x S cross join T`;
	const ast = relalgjs.parseRelalg(query);

	assert.equal(ast.operatorPositions.length, 2);
	assert.deepEqual(ast.operatorPositions, [
		{
			type: 'nodeInfo',
			name: 'crossJoinOperator',
			'location': {
				'end': {
					'column': 4,
					'line': 1,
					'offset': 3,
				},
				'start': {
					'column': 3,
					'line': 1,
					'offset': 2,
				},
			},
		},
		{
			type: 'nodeInfo',
			name: 'crossJoinOperator',
			'location': {
				'end': {
					'column': 17,
					'line': 1,
					'offset': 16,
				},
				'start': {
					'column': 7,
					'line': 1,
					'offset': 6,
				},
			},
		},
	]);
});

QUnit.test('replace operators 2', function (assert) {
	const orgQuery = `R
		x S cross join T`;
	const orgCursor = { line: 2, column: 4 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R
		cross join S cross join T`);
	assert.deepEqual(cursor, { line: 2, column: 13 });
});

QUnit.test('replace operators 3', function (assert) {
	const orgQuery = `pi a R join S`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `π a R ⨝ S`);
	assert.deepEqual(cursor, { line: 1, column: 8 });
});
