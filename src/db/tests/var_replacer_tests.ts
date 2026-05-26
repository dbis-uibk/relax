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
					assignmentName: 'A',
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
					assignmentName: 'B',
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
					assignmentName: 'A',
					metaData: {
						fromVariable: 'A',
					},
					codeInfo: mockCodeInfo(),
					type: 'relation',
					name: 'firstRelation',
				},
				child2: {
					assignmentName: 'B',
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
					assignmentName: 'A',
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
					assignmentName: 'B',
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
					assignmentName: 'A',
					metaData: {
						fromVariable: 'C',
					},
					type: 'relation',
					name: 'firstRelation',
					codeInfo: mockCodeInfo(),
				},
				child2: {
					assignmentName: 'B',
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
					assignmentName: 'A',
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
					assignmentName: 'B',
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
					assignmentName: 'A',
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

QUnit.test('replace operators 4 (#174)', function (assert) {
	const orgQuery = `pi b (sigma a=0 R)`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `π b (σ a=0 R)`);
	assert.deepEqual(cursor, { line: 1, column: 7 });
});

QUnit.test('replace rename relation operator (plain2math)', function (assert) {
	const orgQuery = `rho R_prime  (R)`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `ρ R_prime  (R)`);
	assert.deepEqual(cursor, { line: 1, column: 10 });
});

QUnit.test('replace rename relation operator (math2plain)', function (assert) {
	const orgQuery = `ρ  R_prime (R)`;
	const orgCursor = { line: 1, column: 11 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `rho  R_prime (R)`);
	assert.deepEqual(cursor, { line: 1, column: 13 });
});

QUnit.test('replace rename column operator (plain2math)', function (assert) {
	const orgQuery = `rho a ->A (R)`;
	const orgCursor = { line: 1, column: 9 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `ρ a →A (R)`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace rename column operator (math2plain)', function (assert) {
	const orgQuery = `ρ a-> A (R)`;
	const orgCursor = { line: 1, column: 8 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `rho a-> A (R)`);
	assert.deepEqual(cursor, { line: 1, column: 10 });
});

QUnit.test('replace order by operator (plain2math)', function (assert) {
	const orgQuery = `tau a desc R`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `τ a desc R`);
	assert.deepEqual(cursor, { line: 1, column: 4 });
});

QUnit.test('replace order by operator (math2plain)', function (assert) {
	const orgQuery = `τ a desc R`;
	const orgCursor = { line: 1, column: 4 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `tau a desc R`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace group by operator (plain2math)', function (assert) {
	const orgQuery = `gamma b; count(*)->n (R)`;
	const orgCursor = { line: 1, column: 20 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `γ b; count(*)→n (R)`);
	assert.deepEqual(cursor, { line: 1, column: 15 });
});

QUnit.test('replace group by operator (math2plain)', function (assert) {
	const orgQuery = `γ b; count(*)→n (R)`;
	const orgCursor = { line: 1, column: 15 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `gamma b; count(*)->n (R)`);
	assert.deepEqual(cursor, { line: 1, column: 20 });
});

QUnit.test('replace union operator (plain2math)', function (assert) {
	const orgQuery = `S  union   T`;
	const orgCursor = { line: 1, column: 10 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S  ∪   T`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace union operator (math2plain)', function (assert) {
	const orgQuery = `S   ∪  T`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `S   union  T`);
	assert.deepEqual(cursor, { line: 1, column: 10 });
});

QUnit.test('replace intersect operator (plain2math)', function (assert) {
	const orgQuery = `S  intersect   T`;
	const orgCursor = { line: 1, column: 14 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S  ∩   T`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace intersect operator (math2plain)', function (assert) {
	const orgQuery = `S   ∩  T`;
	const orgCursor = { line: 1, column: 8 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `S   intersect  T`);
	assert.deepEqual(cursor, { line: 1, column: 16 });
});

QUnit.test('replace except operator (plain2math)', function (assert) {
	const orgQuery = `S  except   T`;
	const orgCursor = { line: 1, column: 14 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S  -   T`);
	assert.deepEqual(cursor, { line: 1, column: 9 });
});

QUnit.test('replace except operator (math2plain)', function (assert) {
	const orgQuery = `S   -  T`;
	const orgCursor = { line: 1, column: 8 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `S   except  T`);
	assert.deepEqual(cursor, { line: 1, column: 13 });
});

QUnit.test('replace division operator (plain2math)', function (assert) {
	const orgQuery = `S  /   T`;
	const orgCursor = { line: 1, column: 9 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S  ÷   T`);
	assert.deepEqual(cursor, { line: 1, column: 9 });
});

QUnit.test('replace division operator (math2plain)', function (assert) {
	const orgQuery = `S   ÷  T`;
	const orgCursor = { line: 1, column: 8 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `S   /  T`);
	assert.deepEqual(cursor, { line: 1, column: 8 });
});

QUnit.test('replace natural join operator (plain2math)', function (assert) {
	const orgQuery = `R  natural join S`;
	const orgCursor = { line: 1, column: 16 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⨝ S`);
	assert.deepEqual(cursor, { line: 1, column: 5 });
});

QUnit.test('replace natural join operator (math2plain)', function (assert) {
	const orgQuery = `R ⨝  S`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R natural join  S`);
	assert.deepEqual(cursor, { line: 1, column: 17 });
});

QUnit.test('replace theta join operator (plain2math)', function (assert) {
	const orgQuery = `R join  R.b = S.b S`;
	const orgCursor = { line: 1, column: 13 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R ⨝  R.b = S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 10 });
});

QUnit.test('replace theta join operator (math2plain)', function (assert) {
	const orgQuery = `R  ⨝  R.b = S.b   S`;
	const orgCursor = { line: 1, column: 9 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R  inner join  R.b = S.b   S`);
	assert.deepEqual(cursor, { line: 1, column: 18 });
});

QUnit.test('replace natural left outer join operator (plain2math)', function (assert) {
	const orgQuery = `R  left outer join S`;
	const orgCursor = { line: 1, column: 19 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⟕ S`);
	assert.deepEqual(cursor, { line: 1, column: 5 });
});

QUnit.test('replace natural left outer join operator (math2plain)', function (assert) {
	const orgQuery = `R  ⟕  S`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R  left outer join  S`);
	assert.deepEqual(cursor, { line: 1, column: 20 });
});

QUnit.test('replace theta left outer join operator (plain2math)', function (assert) {
	const orgQuery = `R  left outer join  R.b =   S.b S`;
	const orgCursor = { line: 1, column: 29 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⟕  R.b =   S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 15 });
});

QUnit.test('replace theta left outer join operator (math2plain)', function (assert) {
	const orgQuery = `R ⟕  R.b  = S.b S`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R left outer join  R.b  = S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 26 });
});

QUnit.test('replace natural right outer join operator (plain2math)', function (assert) {
	const orgQuery = `R  right outer join S`;
	const orgCursor = { line: 1, column: 21 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⟖ S`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural right outer join operator (math2plain)', function (assert) {
	const orgQuery = `R  ⟖  S`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R  right outer join  S`);
	assert.deepEqual(cursor, { line: 1, column: 22 });
});

QUnit.test('replace theta right outer join operator (plain2math)', function (assert) {
	const orgQuery = `R  right outer join  R.b =   S.b S`;
	const orgCursor = { line: 1, column: 29 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⟖  R.b =   S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 14 });
});

QUnit.test('replace theta right outer join operator (math2plain)', function (assert) {
	const orgQuery = `R ⟖  R.b  = S.b S`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R right outer join  R.b  = S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 27 });
});

QUnit.test('replace natural full outer join operator (plain2math)', function (assert) {
	const orgQuery = `R  full outer join S`;
	const orgCursor = { line: 1, column: 21 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⟗ S`);
	assert.deepEqual(cursor, { line: 1, column: 7 });
});

QUnit.test('replace natural full outer join operator (math2plain)', function (assert) {
	const orgQuery = `R  ⟗  S`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R  full outer join  S`);
	assert.deepEqual(cursor, { line: 1, column: 21 });
});

QUnit.test('replace theta full outer join operator (plain2math)', function (assert) {
	const orgQuery = `R  full outer join  R.b =   S.b S`;
	const orgCursor = { line: 1, column: 29 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⟗  R.b =   S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 15 });
});

QUnit.test('replace theta full outer join operator (math2plain)', function (assert) {
	const orgQuery = `R ⟗  R.b  = S.b S`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R full outer join  R.b  = S.b S`);
	assert.deepEqual(cursor, { line: 1, column: 26 });
});

QUnit.test('replace natural left semi join operator (plain2math)', function (assert) {
	const orgQuery = `R  left semi join S`;
	const orgCursor = { line: 1, column: 19 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⋉ S`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural left semi join operator (math2plain)', function (assert) {
	const orgQuery = `R  ⋉  S`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R  left semi join  S`);
	assert.deepEqual(cursor, { line: 1, column: 20 });
});

QUnit.test('replace natural right semi join operator (plain2math)', function (assert) {
	const orgQuery = `R  right semi join S`;
	const orgCursor = { line: 1, column: 19 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R  ⋊ S`);
	assert.deepEqual(cursor, { line: 1, column: 5 });
});

QUnit.test('replace natural right semi join operator (math2plain)', function (assert) {
	const orgQuery = `R  ⋊  S`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R  right semi join  S`);
	assert.deepEqual(cursor, { line: 1, column: 21 });
});

QUnit.test('replace natural left anti join operator (plain2math)', function (assert) {
	const orgQuery = `S left anti join R`;
	const orgCursor = { line: 1, column: 19 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S ▷ R`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural left anti semi join operator (plain2math)', function (assert) {
	const orgQuery = `S left anti semi join R`;
	const orgCursor = { line: 1, column: 24 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S ▷ R`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural anti join operator (plain2math)', function (assert) {
	const orgQuery = `S anti join R`;
	const orgCursor = { line: 1, column: 14 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `S ▷ R`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural left anti join operator (math2plain)', function (assert) {
	const orgQuery = `S ▷ R`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `S left anti semi join R`);
	assert.deepEqual(cursor, { line: 1, column: 24 });
});

QUnit.test('replace natural right anti join operator (plain2math)', function (assert) {
	const orgQuery = `R right anti join S`;
	const orgCursor = { line: 1, column: 20 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R ◁ S`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural right anti semi join operator (plain2math)', function (assert) {
	const orgQuery = `R right anti semi join S`;
	const orgCursor = { line: 1, column: 25 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `R ◁ S`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace natural right anti join operator (math2plain)', function (assert) {
	const orgQuery = `R ◁ S`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `R right anti semi join S`);
	assert.deepEqual(cursor, { line: 1, column: 25 });
});

QUnit.test('replace rename column operator (->)', function (assert) {
	const orgQuery = `pi a->A (R)`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `π a→A (R)`);
	assert.deepEqual(cursor, { line: 1, column: 5 });
});

QUnit.test('replace rename column operator (→)', function (assert) {
	const orgQuery = `π a→A (R)`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `pi a->A (R)`);
	assert.deepEqual(cursor, { line: 1, column: 8 });
});

QUnit.test('replace rename column operator (<-)', function (assert) {
	const orgQuery = `pi A<-a (R)`;
	const orgCursor = { line: 1, column: 5 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `π A←a (R)`);
	assert.deepEqual(cursor, { line: 1, column: 4 });
});

QUnit.test('replace rename column operator (←)', function (assert) {
	const orgQuery = `π A←a (R)`;
	const orgCursor = { line: 1, column: 5 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `pi A<-a (R)`);
	assert.deepEqual(cursor, { line: 1, column: 7 });
});

QUnit.test('replace logical operator (and)', function (assert) {
	const orgQuery = `sigma a > 2 and a < 4 R`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a > 2 ∧ a < 4 R`);
	assert.deepEqual(cursor, { line: 1, column: 8 });
});

QUnit.test('replace logical operator (∧)', function (assert) {
	const orgQuery = `σ a > 2 ∧ a < 4 R`;
	const orgCursor = { line: 1, column: 10 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma a > 2 and a < 4 R`);
	assert.deepEqual(cursor, { line: 1, column: 16 });
});

QUnit.test('replace logical operator (or)', function (assert) {
	const orgQuery = `sigma a > 2 or a < 4 R`;
	const orgCursor = { line: 1, column: 9 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a > 2 ∨ a < 4 R`);
	assert.deepEqual(cursor, { line: 1, column: 5 });
});

QUnit.test('replace logical operator (∨)', function (assert) {
	const orgQuery = `σ a > 2 ∨ a < 4 R`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma a > 2 or a < 4 R`);
	assert.deepEqual(cursor, { line: 1, column: 17 });
});

QUnit.test('replace logical operator (xor)', function (assert) {
	const orgQuery = `sigma a > 2 xor a < 4 R`;
	const orgCursor = { line: 1, column: 13 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a > 2 ⊻ a < 4 R`);
	assert.deepEqual(cursor, { line: 1, column: 9 });
});

QUnit.test('replace logical operator (⊻)', function (assert) {
	const orgQuery = `σ a > 2 ⊻ a < 4 R`;
	const orgCursor = { line: 1, column: 10 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma a > 2 xor a < 4 R`);
	assert.deepEqual(cursor, { line: 1, column: 16 });
});

QUnit.test('replace logical operator (!)', function (assert) {
	const orgQuery = `sigma !(a > 3) R`;
	const orgCursor = { line: 1, column: 15 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ ¬(a > 3) R`);
	assert.deepEqual(cursor, { line: 1, column: 11 });
});

QUnit.test('replace logical operator (not)', function (assert) {
	const orgQuery = `sigma not(a > 3) R`;
	const orgCursor = { line: 1, column: 10 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ ¬(a > 3) R`);
	assert.deepEqual(cursor, { line: 1, column: 4 });
});

QUnit.test('replace logical operator (¬)', function (assert) {
	const orgQuery = `σ ¬(a > 3) R`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma !(a > 3) R`);
	assert.deepEqual(cursor, { line: 1, column: 11 });
});

QUnit.test('replace comparison operator (!=)', function (assert) {
	const orgQuery = `sigma a != 5 (R)`;
	const orgCursor = { line: 1, column: 11 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a ≠ 5 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace comparison operator (<>)', function (assert) {
	const orgQuery = `sigma a <> 5 (R)`;
	const orgCursor = { line: 1, column: 11 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a ≠ 5 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 6 });
});

QUnit.test('replace comparison operator (≠)', function (assert) {
	const orgQuery = `σ a ≠ 5 (R)`;
	const orgCursor = { line: 1, column: 6 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma a != 5 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 11 });
});

QUnit.test('replace comparison operator (>=)', function (assert) {
	const orgQuery = `sigma a >=3 (R)`;
	const orgCursor = { line: 1, column: 12 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a ≥3 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 7 });
});

QUnit.test('replace comparison operator (≥)', function (assert) {
	const orgQuery = `σ a ≥3 (R)`;
	const orgCursor = { line: 1, column: 7 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma a >=3 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 12 });
});

QUnit.test('replace comparison operator (<=)', function (assert) {
	const orgQuery = `sigma a<= 4 (R)`;
	const orgCursor = { line: 1, column: 10 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'plain2math');
	assert.equal(query, `σ a≤ 4 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 5 });
});

QUnit.test('replace comparison operator (≥)', function (assert) {
	const orgQuery = `σ a≤ 4 (R)`;
	const orgCursor = { line: 1, column: 5 };
	const ast = relalgjs.parseRelalg(orgQuery);

	const { query, cursor } = relalgjs.queryWithReplacedOperatorsFromAst(orgQuery, ast.operatorPositions, orgCursor, 'math2plain');
	assert.equal(query, `sigma a<= 4 (R)`);
	assert.deepEqual(cursor, { line: 1, column: 10 });
});
