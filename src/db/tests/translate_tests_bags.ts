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

QUnit.test('test dum bag 1', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`pi 1->a {}`, relations);

	const ref = exec_ra(`sigma a<1 {
		a

		10
	}`, relations);


	assert.deepEqual(root.getResult(false), ref.getResult(false));

});

QUnit.test('test dum bag 2', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`gamma count(*)->n {}`, relations);

	const ref = exec_ra(`{
		n

		0
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test dum bag 3', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`R x {}`, relations);

	const ref = exec_ra(`R - R`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test dum bag 4', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`{} x R`, relations);

	const ref = exec_ra(`R - R`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test dee bag 1', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`pi 1->a {()}`, relations);

	const ref = exec_ra(`{
		a

		1
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test dee bag 2', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`gamma count(*)->n {()}`, relations);

	const ref = exec_ra(`{
		n

		1
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test dee bag 3', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`R x {()}`, relations);

	assert.deepEqual(root.getResult(false), relations.R.getResult(false));
});

QUnit.test('test dee bag 4', function (assert) {
	const relations = getTestBags();
	const root = exec_ra(`{()} x R`, relations);

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

QUnit.test('test projection[*](R)', function (assert) {
	const relations = getTestBags();
	const query = 'pi * (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b

		1, 2
		5, 6
		1, 2
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

QUnit.test('test (pi * (R)) inner join [R.b = S2.b] (pi * (S2))', function (assert) {
	const relations = getTestBags();
	const root = exec_ra('(pi * R) inner join R.b = S.b (pi * S2)', relations);
	const ref = exec_ra(`{
		R.a:number, R.b:number, S.b:number, S.c:number
		1,          2,          2,          4
		1,          2,          2,          5
		1,          2,          2,          4
		1,          2,          2,          5
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

QUnit.test('test bag leftSemiJoin with natural condition', function (assert) {
	const relations = getTestBags();
	const query = '(R2) left semi join (S2)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, R.b:number

		2,   3
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag leftThetaSemiJoin with simple condition', function (assert) {
	const relations = getTestBags();
	const root = exec_ra('(R2) ⋉ R.b = S.b (S2)', relations);
	const ref = exec_ra(`{
		R.a:number, R.b:number

		2,   3
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag leftThetaSemiJoin with complex condition', function (assert) {
	const relations = getTestBags();
	const query = '(R2) ⋉ R.b = S.b and S.c > 3 (S2)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, R.b:number

		2,   3
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag rightSemiJoin with natural condition', function (assert) {
	const relations = getTestBags();
	const query = '(R2) right semi join (S2)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b:number, S.c:number

		3,   4
		3,   4
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag rightThetaSemiJoin with simple condition', function (assert) {
	const relations = getTestBags();
	const root = exec_ra('(R2) ⋊ R.b = S.b (S2)', relations);
	const ref = exec_ra(`{
		S.b:number, S.c:number

		3,   4
		3,   4
	}`, relations);

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test bag rightThetaSemiJoin with complex condition', function (assert) {
	const relations = getTestBags();
	const query = '(R2) ⋊ R.b = S.b and S.c > 2 (S2)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b:number, S.c:number

		3,   4
		3,   4
	}`, relations);

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

QUnit.test('test sqrt of negative number', function (assert) {
	const query = "pi a, sqrt(-4)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   null
		5,   null
		1,   null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test sqrt of zero', function (assert) {
	const query = "pi sqrt(0)->k {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k
		0
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test sqrt of one', function (assert) {
	const query = "pi sqrt(1)->k {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k
		1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test sqrt of one hundred', function (assert) {
	const query = "pi a, sqrt(100)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   10
		5,   10
		1,   10
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test e raised to the power of 0', function (assert) {
	const query = "pi a, exp(0)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		5,   1
		1,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test e raised to the power of 1', function (assert) {
	const query = "pi a, exp(1)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   2.718281828459045
		5,   2.718281828459045
		1,   2.718281828459045
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test e raised to the power of 2', function (assert) {
	const query = "pi a, exp(2)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   7.38905609893065
		5,   7.38905609893065
		1,   7.38905609893065
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test column raised to the power of 0', function (assert) {
	const query = "pi a, power(a, 0)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		5,   1
		1,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test column raised to the power of 1', function (assert) {
	const query = "pi a, power(a, 1)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		5,   5
		1,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test column raised to the power of 2', function (assert) {
	const query = "pi a, power(a, 2)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		5,   25
		1,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test natural logarithm of a negative number', function (assert) {
	const query = "pi a, ln(-1)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   null
		5,   null
		1,   null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test natural logarithm of 0', function (assert) {
	const query = "pi a, ln(0)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   null
		5,   null
		1,   null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test natural logarithm of 1', function (assert) {
	const query = "pi a, ln(exp(1))->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		5,   1
		1,   1
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test natural logarithm of 2', function (assert) {
	const query = "pi ln(exp(2))->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		2
		2
		2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 2, of -1', function (assert) {
	const query = "pi log(2, -1)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		null
		null
		null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 2, of 0', function (assert) {
	const query = "pi log(2, 0)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		null
		null
		null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 2, of 1', function (assert) {
	const query = "pi log(2, 1)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		0
		0
		0
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base -1, of 16', function (assert) {
	const query = "pi log(-1, 16)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		null
		null
		null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 0, of 16', function (assert) {
	const query = "pi log(0, 16)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		null
		null
		null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 1, of 16', function (assert) {
	const query = "pi log(1, 16)->k R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		null
		null
		null
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 2, of 4', function (assert) {
	const query = "pi log(2, 4)->k {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test logarithm, base 10, of 1000', function (assert) {
	const query = "pi round(log(10, 1000))->k {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		k:number
		3
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 2 args comma style', function (assert) {
	const query = "pi SUBSTRING('Quadratically',5) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'ratically'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 2 args from style', function (assert) {
	const query = "pi SUBSTRING('foobarbar' FROM 4) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'barbar'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 2 args negative pos', function (assert) {
	const query = "pi SUBSTRING('Sakila', -3) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'ila'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args comma style', function (assert) {
	const query = "pi SUBSTRING('Quadratically',5,6) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'ratica'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args from/for style', function (assert) {
	const query = "pi SUBSTRING('Quadratically' FROM 5 for 6) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'ratica'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args negative pos', function (assert) {
	const query = "pi SUBSTRING('Sakila', -5, 3) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'aki'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args pos equals to 0', function (assert) {
	const query = "pi SUBSTRING('abcdef', 0, 5) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'abcde'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args pos greater than string length', function (assert) {
	const query = "pi SUBSTRING('abcdef', 100, 5) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		''
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args negative length', function (assert) {
	const query = "pi SUBSTRING('abcdef', 5, -3) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		''
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args length equals to 0', function (assert) {
	const query = "pi SUBSTRING('abcdef', 5, 0) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		''
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test substring 3 args length greater than string length', function (assert) {
	const query = "pi SUBSTRING('abcdef', 5, 10) -> str {()}";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string
		'ef'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test cast function', function (assert) {
	const query = "pi cast(a as string) -> str, cast('100' as number)->n , cast('false' as boolean) -> bool, cast('2025-04-16' as date)->dt R";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		str:string	n:number	bool:boolean	dt:date
		'1',	100,	false,	2025-04-16
		'5',	100,	false,	2025-04-16
		'1',	100,	false,	2025-04-16
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using BETWEEN with numbers 1', function (assert) {
	const query = "sigma a between 3 and 5 (R)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using BETWEEN with numbers 2', function (assert) {
	const query = "σ a between 3 ∧ 5 (R)";
	const root = exec_ra(query, getTestBags());

	const ref = exec_ra(`{
		R.a, R.b
		5,   6
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using NOT BETWEEN with numbers 1', function (assert) {
	const query = "sigma a not between 3 and 5 (R)";
	const root = exec_ra(query, getTestBags());
	
	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});
	
	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using NOT BETWEEN with numbers 2', function (assert) {
	const query = "σ a not between 3 ∧ 5 (R)";
	const root = exec_ra(query, getTestBags());
	
	const ref = exec_ra(`{
		R.a, R.b
		1,   2
		1,   2
	}`, {});
	
	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using BETWEEN with strings 1', function (assert) {
	const query = "sigma c between 'c' and 'd' (pi *, 'c' ->c R)";
	const root = exec_ra(query, getTestBags());
	
	const ref = exec_ra(`{
		R.a, R.b, c
		1,   2,   'c'
		5,   6,   'c'
		1,   2,   'c'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using BETWEEN with strings 2', function (assert) {
	const query = "σ c between 'c' ∧ 'd' (pi *, 'c' ->c R)";
	const root = exec_ra(query, getTestBags());
	
	const ref = exec_ra(`{
		R.a, R.b, c
		1,   2,   'c'
		5,   6,   'c'
		1,   2,   'c'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using NOT BETWEEN with strings 1', function (assert) {
	const query = "sigma c not between 'c' and 'd' (pi *, 'a' ->c R)";
	const root = exec_ra(query, getTestBags());
	
	const ref = exec_ra(`{
		R.a, R.b, c
		1,   2,   'a'
		5,   6,   'a'
		1,   2,   'a'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using NOT BETWEEN with strings 2', function (assert) {
	const query = "σ c not between 'c' ∧ 'd' (pi *, 'a' ->c R)";
	const root = exec_ra(query, getTestBags());
	
	const ref = exec_ra(`{
		R.a, R.b, c
		1,   2,   'a'
		5,   6,   'a'
		1,   2,   'a'
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using BETWEEN with date constant 1', function (assert) {
	const query = "σ date('2020-01-05') between date('2020-01-02') and date('2020-01-05') (R)";
	const root = exec_ra(query, getTestBags());
	
	// condition is TRUE → all tuples are kept
	const ref = exec_ra(`{
		R.a, R.b

		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using BETWEEN with date constant 2', function (assert) {
	const query = "σ date('2020-01-02') between date('2020-01-02') ∧ date('2020-01-05') (R)";
	const root = exec_ra(query, getTestBags());
	
	// condition is TRUE → all tuples are kept
	const ref = exec_ra(`{
		R.a, R.b

		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using NOT BETWEEN with date constant 1', function (assert) {
	const query = "sigma date('2020-01-03') not between date('2020-01-02') and date('2020-01-05') (R)";
	const root = exec_ra(query, getTestBags());
	
	// condition is FALSE → NOT BETWEEN = false → selection returns nothing
	const ref = exec_ra(`{
		R.a:number, R.b:number
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});

QUnit.test('test selection using NOT BETWEEN with date constant 2', function (assert) {
	const query = "σ date('2020-01-01') not between date('2020-01-02') ∧ date('2020-01-05') (R)";
	const root = exec_ra(query, getTestBags());
	
	// condition is TRUE → all tuples are kept
	const ref = exec_ra(`{
		R.a, R.b

		1,   2
		5,   6
		1,   2
	}`, {});

	assert.deepEqual(root.getResult(false), ref.getResult(false));
});
