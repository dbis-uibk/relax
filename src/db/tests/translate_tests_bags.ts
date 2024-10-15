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

QUnit.test('test orderBy explicit column of bag', function (assert) {
	const query = 'tau R.a asc (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit column of bag', function (assert) {
	const query = 'tau a asc (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit column of bag from local variable', function (assert) {
	const query = 'k = R tau a asc (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit column of bag from local variable', function (assert) {
	const query = 'k = R tau R.a asc (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit column of local variable', function (assert) {
	const query = 'k = R tau k.a asc (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit columns of bags from natural join', function (assert) {
	const query = 'tau a asc, c desc (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of bags from natural join', function (assert) {
	const query = 'tau R.a asc, S.c desc (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit columns of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 tau a asc, c desc (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 tau R.a asc, S.c desc (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of local variable from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 tau k.a asc, S.c desc (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit columns of bags from join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 tau a asc, c desc (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 tau R.a asc, S.c desc (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of local variable from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 tau R.a asc, S.c desc (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 tau a asc, c desc (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 tau R.a asc, S.c desc (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 tau k.a asc, j.c desc (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'tau a asc, c desc (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'tau R.a asc, S.c desc (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy implicit columns from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 tau a asc, c desc (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of bags from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 tau R.a asc, S.c desc (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test orderBy explicit columns of local variables from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 tau k.a asc, j.c desc (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   4
		1,   2,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit column of bag', function (assert) {
	const query = 'gamma ; count(a)->n (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		n
		3
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit column of bag', function (assert) {
	const query = 'gamma ; count(R.a)->n (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		n
		3
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit column of bag from local variable', function (assert) {
	const query = 'k = R gamma ; sum(a)->n (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		n
		7
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit column of bag from local variable', function (assert) {
	const query = 'k = R gamma ; sum(R.a)->n (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		n
		7
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit column of local variable', function (assert) {
	const query = 'k = R gamma ; sum(k.a)->n (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		n
		7
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit columns of bags from natural join', function (assert) {
	const query = 'gamma a; max(c)->m (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of bags from natural join', function (assert) {
	const query = 'gamma R.a; max(S.c)->m (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit columns of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 gamma a; max(c)->m (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 gamma R.a; max(S.c)->m (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of local variable from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 gamma k.a; max(S.c)->m (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit columns of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 gamma a; max(c)->m (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 gamma R.a; max(S.c)->m (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of bag and local variable from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 gamma R.a; max(j.c)->m (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 gamma R.a; max(S.c)->m (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 gamma k.a; max(j.c)->m (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'k = R j = S2 z = Bag1 gamma a; count(c)->m (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   8
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'k = R j = S2 z = Bag1 gamma R.a; count(S.c)->m (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, m
		1,   8
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy implicit columns from cross join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 gamma c; count(S.b)->m (k x j x z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		S.c, m
		1,   9
		4,   27
		5,   9
		2,   9
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns from cross join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 gamma S.c; min(z.a)->m (k x j x z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		S.c, m
		1,   1
		4,   1
		5,   1
		2,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test groupBy explicit columns of local variables from cross join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 gamma j.c; min(z.a)->m (k x j x z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		S.c, m
		1,   1
		4,   1
		5,   1
		2,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of bag', function (assert) {
	const query = 'pi R.a, R.b (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit column(s) of bag', function (assert) {
	const query = 'pi a, b (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit column(s) of bag from local variable', function (assert) {
	const query = 'k = R pi a, b (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		5,   6
		1,   2
	}`, {});
	
	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of bag from local variable', function (assert) {
	const query = 'k = R pi R.a, R.b (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of local variable', function (assert) {
	const query = 'k = R pi k.a, k.b (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit column(s) of bags from natural join', function (assert) {
	const query = 'pi a, c (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of bags from natural join', function (assert) {
	const query = 'pi R.a, S.c (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit column(s) of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 pi a, c (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of local variable from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 pi k.a, S.c (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit column(s) of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 pi a, c (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit columns of local variable from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 pi R.a, j.c (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi a, c (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi k.a, j.c (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   5
		1,   4
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'pi a, c (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
		1,   5
		1,   5
		1,   4
		1,   4
		1,   5
		1,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit column(s) of local variable from cross join of bags', function (assert) {
	const query = 't = R x S2 pi a (t)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a
		1
		1
		1
		1
		1
		1
		5
		5
		5
		5
		5
		5
		1
		1
		1
		1
		1
		1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of bag(s) from cross join of bags', function (assert) {
	const query = 't = R x S2 pi R.a (t)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a
		1
		1
		1
		1
		1
		1
		5
		5
		5
		5
		5
		5
		1
		1
		1
		1
		1
		1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit column(s) of local variable from cross join of bags', function (assert) {
	const query = 't = R x S2 pi t.a (t)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a
		1
		1
		1
		1
		1
		1
		5
		5
		5
		5
		5
		5
		1
		1
		1
		1
		1
		1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'pi R.a, R.b, S.c (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of implicit columns from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = bag1 pi a, b, c (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit columns of bags from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = bag1 pi R.a, R.b, S.c (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test projection of explicit columns of local variables from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 pi k.a, k.b, j.c (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
		1,   2,   4
		1,   2,   4
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of bag', function (assert) {
	const query = 'sigma R.a > 3 (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit column(s) of bag', function (assert) {
	const query = 'sigma a > 3 (R)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit column(s) of bag from local variable', function (assert) {
	const query = 'k = R sigma a > 3 (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of bag from local variable', function (assert) {
	const query = 'k = R sigma R.a > 3 (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of local variable', function (assert) {
	const query = 'k = R sigma k.a > 3 (k)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit column(s) of bags from natural join', function (assert) {
	const query = 'sigma a = 1 and c > 4 (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of bags from natural join', function (assert) {
	const query = 'sigma R.a = 1 and S.c > 4 (R ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit column(s) of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 sigma a = 1 and c > 4 (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 sigma R.a = 1 and S.c > 4 (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of local variable from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 sigma k.a = 1 and S.c > 4 (k ⨝ S2)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit column(s) of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 sigma a = 1 and c > 4 (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 sigma R.a = 1 and S.c > 4 (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit column(s) of local variable from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 sigma R.a = 1 and j.c > 4 (R ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 sigma a = 1 and c > 4 (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit columns of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 sigma R.a = 1 and S.c > R.b*2 (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 sigma k.a = 1 and j.c > k.b*2 (k ⨝ j)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'sigma a = 1 and c > b*2 (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit columns of bags from natural join of multiple bags', function (assert) {
	const query = 'sigma R.a = 1 and S.c > R.b*2 (R ⨝ S2 ⨝ Bag1)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with implicit columns from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 sigma a = 1 and c > b*2 (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit columns of bags from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 sigma R.a = 1 and S.c > R.b*2 (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection with explicit columns of local variables from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S2 z = Bag1 sigma k.a = 1 and j.c > k.b*2 (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		1,   2,   5
		1,   2,   5
		1,   2,   5
		1,   2,   5
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of bag', function (assert) {
	const query = 'pi R.a, R.b (sigma R.b <= 4 (R))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit column(s) of bag', function (assert) {
	const query = 'pi a, b (sigma b <= 4 (R))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of bag from local variable', function (assert) {
	const query = 'k = R pi R.a, R.b (sigma R.b <= 4 (k))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit column(s) of bag from local variable', function (assert) {
	const query = 'k = R pi a, b (sigma b <= 4 (k))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of local variable', function (assert) {
	const query = 'k = R pi k.a, k.b (sigma k.b <= 4 (k))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit and explicit column(s) of bag and local variable from local variable', function (assert) {
	const query = 'k = R pi k.a, k.b (sigma b <= 4 (k))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of bags from natural join', function (assert) {
	const query = 'pi R.a, S.c (sigma R.b > 1 and S.c < 5 (R ⨝ S2))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit column(s) of bags from natural join', function (assert) {
	const query = 'pi a, c (sigma b > 1 and c < 5 (R ⨝ S2))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (sigma R.b > 1 and S.c < 5 (R ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit column(s) of bags from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 pi R.a, c (sigma b > 1 and c < 5 (R ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of local variable from natural join of bag and local variable', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (sigma R.b > 1 and S.c < 5 (R ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (sigma R.b > 1 and S.c < 5 (k ⨝ S2))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit column(s) of bags from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 pi a, c (sigma b > 1 and c < 5 (k ⨝ S2))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of local variable from natural join of local variable and bag', function (assert) {
	const query = 'k = R j = S2 pi k.a, S.c (sigma k.b > 1 and S.c < 5 (k ⨝ S2))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi R.a, S.c (sigma R.b > 1 and S.c < 5 (k ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit column(s) of bags from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi a, c (sigma b > 1 and c < 5 (k ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of explicit column(s) of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi k.a, j.c (sigma k.b > 1 and j.c < 5 (k ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit and explicit column(s) of bags and local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S2 pi k.a, j.c (sigma R.b > 1 and S.c < 5 (k ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit and explicit column(s) of bags and local variables from cross cross join of local variables', function (assert) {
	const query = 'k = R j = S2 pi a, S.c (sigma k.b > 1 and c < 5 (k ⨝ j))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, S.c
		1,   4
		1,   4
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection and projection of implicit and explicit column(s) of bags and local variables from local variable of cross join of variables', function (assert) {
	const query = 'k = R j = S2 t = k x j pi a, R.b, t.c (sigma R.b > 2 and c < 2 (t))';
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b, S.c
		5,   6,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection, projection, groupBy and orderBy implicit and explicit column(s) of bags and local variables from theta join of multiple variables', function (assert) {
	const query = "k = R j = S2 z = Bag1 t = k ⟕ R.a<z.a z ⟗ k.b=S.b j tau c desc (gamma t.c ; count(R.a)->n (pi R.a, S.b, t.c (sigma t.c>3 and S.b <= 200 and R.b=S.b (t))))";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		S.c, n
		5,   2
		4,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test generalized projection of implicit column of bag from local variable', function (assert) {
	const query = "t = R pi (a * 2)->doublea (t)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		doublea
		2
		10
		2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test generalized projection of explicit column of bag from local variable', function (assert) {
	const query = "t = R pi (R.a * 2)->doublea (t)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		doublea
		2
		10
		2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test generalized projection of explicit column of local variable', function (assert) {
	const query = "t = R pi (t.a * 2)->doublea (t)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		doublea
		2
		10
		2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test rename implicit column of local variable', function (assert) {
	const query = "t = R rho a->aa (t)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.aa, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test rename explicit column of bag from local variable', function (assert) {
	const query = "t = R rho R.a->aa (t)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.aa, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test rename explicit column of local variable', function (assert) {
	const query = "t = R rho t.a->aa (t)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.aa, R.b
		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});
