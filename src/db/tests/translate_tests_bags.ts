/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Relation } from 'db/exec/Relation';
import * as relalgjs from '../relalg';

QUnit.module('translate multiset algebra ast to relational algebra');

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

QUnit.test('test dum bag 1', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`pi 1->a {}`, relations);

	const ref = exec_ra(`sigma a<1 {
		a

		10
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dum bag 2', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`gamma count(*)->n {}`, relations);

	const ref = exec_ra(`{
		n

		0
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dum bag 3', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`R x {}`, relations);

	const ref = exec_ra(`R - R`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dum bag 4', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`{} x R`, relations);

	const ref = exec_ra(`R - R`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dee bag 1', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`pi 1->a {()}`, relations);

	const ref = exec_ra(`{
		a

		1
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dee bag 2', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`gamma count(*)->n {()}`, relations);

	const ref = exec_ra(`{
		n

		1
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dee bag 3', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`R x {()}`, relations);

	assert.deepEqual(root.getResult(), relations.R.getResult());
});

QUnit.test('test dee bag 4', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`{()} x R`, relations);

	assert.deepEqual(root.getResult(), relations.R.getResult());
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
