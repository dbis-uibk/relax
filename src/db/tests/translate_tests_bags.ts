/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Relation } from 'db/exec/Relation';
import * as relalgjs from '../relalg';

QUnit.module('translate multiset algebra ast to multiset algebra');

// const relations = getTestBags();

function exec_ra(query: string, relations: { [key: string]: Relation }) {
	// For Multiset algebra strictRA is false (allow duplicates)
	return relalgjs.executeRelalg(query, relations, false);
}

function getTestBags() {
	// create the three source tables
	const R = relalgjs.executeRelalg(`{
		R.a, R.b

		1,   2
		5,   6
		1,   2
	}`, {}, false);

	const S = relalgjs.executeRelalg(`{
		S.b, S.c

		3,   4
		7,   8
	}`, {}, false);

	const Bag1 = relalgjs.executeRelalg(`{
		B.a

		1
		2
		1
	}`, {}, false);

	const Bag2 = relalgjs.executeRelalg(`{
		B.a

		1
		1
		2
		3
		1
	}`, {}, false);

	const Bag3 = relalgjs.executeRelalg(`{
		B.a

		1
		2
		3
	}`, {}, false);

	const R2 = relalgjs.executeRelalg(`{
		R.a, R.b

		0,   1
		2,   3
		0,   1
		2,   4
		3,   4
	}`, {}, false);

	const S2 = relalgjs.executeRelalg(`{
		S.b, S.c

		0,   1
		2,   4
		2,   5
		3,   4
		0,   2
		3,   4
	}`, {}, false);

	return {
		R: new Relation('R', R),
		S: new Relation('S', S),
		Bag1: new Relation('B', Bag1),
		Bag2: new Relation('B', Bag2),
		Bag3: new Relation('B', Bag3),
		R2: new Relation('R', R2),
		S2: new Relation('S', S2),
	};
}

QUnit.testStart(function () {
});


QUnit.test('test bag R', function (assert) {
	const relations = getTestBags();
	const query = 'R';
	const root = exec_ra(query, relations);
	root.check();

	assert.deepEqual(root.getResult(false), relations.R.getResult(false));
});

QUnit.test('test inline-bag R', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`{
		R.a:number, R.b:number
		1,          2
		5,          6
		1,          2
	}`, relations);

	assert.deepEqual(root.getResult(false), relations.R.getResult(false));
});

QUnit.test('test bag order is unimportant', function (assert) {
	const relations = getTestBags();
	const query = '(Bag1 - (tau a asc (Bag1))) union ((tau a asc (Bag1)) - Bag1)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		B.a:number

	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag selection[a+b<5](R)', function (assert) {
	const relations = getTestBags();
	const query = 'sigma a+b < 5 (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b

		1, 2
		1, 2
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag projection[a](R)', function (assert) {
	const relations = getTestBags();
	const query = 'pi a (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a

		1
		5
		1
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test (R) bag product (S)', function (assert) {
	const relations = getTestBags();
	const root = exec_ra('(R) x (S)', relations);
	const ref = exec_ra(`{
		R.a:number, R.b:number, S.b:number, S.c:number

		1,          2,        3,        4
		1,          2,        7,        8
		5,          6,        3,        4
		5,          6,        7,        8
		1,          2,        3,        4
		1,          2,        7,        8
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test (Bag1) bag union (Bag2)', function (assert) {
	const query = '(Bag1) union (Bag2)';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		B.a:number

		1
		2
		1
		1
		1
		2
		3
		1
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test (Bag1) bag intersect (Bag3)', function (assert) {
	const query = '(Bag1) intersect (Bag3)';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		B.a:number

		1
		2
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test (Bag1) bag difference (Bag3)', function (assert) {
	const query = '(Bag1) - (Bag3)';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		B.a:number

		1
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test commutative law for bag union', function (assert) {
	const query = '((R union S) - (S union R)) union ((S union R) - (R union S))';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, R.b:number

	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag union is not idempotent', function (assert) {
	const query = 'S union S';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b:number, S.c:number

		3,   4
		7,   8
		3,   4
		7,   8
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag duplicate elimination (R)', function (assert) {
	const query = 'delta (R)';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, R.b:number

		1,   2
		5,   6
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag groupBy a; sum[b] (R2)', function (assert) {
	const query = 'gamma a; sum(b)->sum_b (R2)';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, sum_b:number

		0,   2
		2,   7
		3,   4
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test (R2) bag outer join (S2)', function (assert) {
	const query = '(R2) full outer join (S2)';
	const relations = getTestBags();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, R.b:number, S.b:number, S.c:number

		0,   1,   null, null
		2,   3,   3,    4
		2,   3,   3,    4
		0,   1,   null, null
		2,   4,   null, null
		3,   4,   null, null
		null,null,0,   1
		null,null,2,   4
		null,null,2,   5
		null,null,0,   2
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test like operator', function (assert) {
	const result = exec_ra(`pi x, x like 'a%'->a, x like '%b'->b, x like '%a%'->c, x like 'a_a'->d {
	x

	abb
	bba
	bab
	aba
	}`, {}).getResult(false);

	const reference = exec_ra(`{
	x,   a,     b,     c,     d

	abb, true,  true,  true, false
	bba, false, false, true, false
	bab, false, true,  true, false
	aba, true,  false, true, true
	}`, {}).getResult(false);
	assert.deepEqual(result, reference);
});

QUnit.test('test regexp operator', function (assert) {
	const result = exec_ra(`pi x, x regexp '^(a|e)'->starts_a_or_e, x regexp '(a|e)$'->ends_a_or_e, x rlike '(a|e)'->has_a_or_e {
	x

	abb
	bba
	bab
	ebe
	}`, {}).getResult(false);

	const reference = exec_ra(`{
	x, starts_a_or_e, ends_a_or_e, has_a_or_e

	abb, true,  false, true
	bba, false, true,  true
	bab, false, false, true
	ebe, true,  true,  true
	}`, {}).getResult(false);
	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: repeat()', function (assert) {
	const relations = getTestBags();
	const result = exec_ra(" pi repeat('b', 3)->x (R) ", relations).getResult(false);

	const reference = exec_ra('{x:string\n' +
		'bbb\n' +
		'bbb\n' +
		'bbb\n' +
	'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: replace()', function (assert) {
	const relations = getTestBags();
	const result = exec_ra(" pi replace(x, 'c', 'C')->y (pi concat(a, b, 'c')->x (R)) ", relations).getResult(false);

	const reference = exec_ra('{y:string\n' +
		'12C\n' +
		'56C\n' +
		'12C\n' +
	'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: reverse()', function (assert) {
	const relations = getTestBags();
	const result = exec_ra(" pi reverse(x)->y (pi concat(a, b, 'c')->x (R)) ", relations).getResult(false);

	const reference = exec_ra('{y:string\n' +
		'c21\n' +
		'c65\n' +
		'c21\n' +
	'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between aggregate function and opening parenthesis', function (assert) {
	const result = exec_ra("gamma ; sum (a)->total_a (R)", getTestBags()).getResult(false);

	const reference = exec_ra('{total_a\n' +
		'7\n' +
		'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between count(*) function and opening parenthesis', function (assert) {
	const result = exec_ra("gamma ; count    (*)->n (R)", getTestBags()).getResult(false);

	const reference = exec_ra('{n\n' +
		'3\n' +
		'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between n-ary text function and opening parenthesis', function (assert) {
	const result = exec_ra("pi concat  (a, b)->k (R)", getTestBags()).getResult(false);

	const reference = exec_ra(`{k:string
		'12'
		'56'
		'12'
		}`, {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between binary function and opening parenthesis', function (assert) {
	const result = exec_ra("pi add    (a, 5)->a_plus_5 (R)", getTestBags()).getResult(false);

	const reference = exec_ra('{a_plus_5\n' +
		'6\n' +
		'10\n' +
		'6\n' +
		'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between unary function and opening parenthesis', function (assert) {
	const result = exec_ra("pi a + length  ( 'teste' )->x, upper (   'b'  )->k (R)", getTestBags()).getResult(false);

	const reference = exec_ra('{\tx:number, k:string\n' +
		"\t6, 'B'\n" +
		"\t10, 'B'\n" +
		"\t6, 'B'\n" +
		'}', {}).getResult(false);

	assert.deepEqual(result, reference);
});

QUnit.test('pi with wrong date format', function (assert) {
	try {
		const query = "pi date('01-01-1970')->d (R)";
		exec_ra(query, getTestBags());
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});
