/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// cspell:disable

import { Relation } from 'db/exec/Relation';
import { RANode } from '../exec/RANode';
import * as relalgjs from '../relalg';

QUnit.module('translate sql ast to relational algebra');

const srcTableR: Relation = relalgjs.executeRelalg(`{
	R.a, R.b, R.c

	1,   a,   d
	3,   c,   c
	4,   d,   f
	5,   d,   b
	6,   e,   f
}`, {}) as Relation;
const srcTableS: Relation = relalgjs.executeRelalg(`{
	S.b, S.d

	a,   100
	b,   300
	c,   400
	d,   200
	e,   150
}`, {}) as Relation;
const srcTableT: Relation = relalgjs.executeRelalg(`{
	T.b, T.d

	a,   100
	d,   200
	f,   400
	g,   120
}`, {}) as Relation;

const relations: {
	R: Relation,
	S: Relation,
	T: Relation,
} = {
	R: srcTableR,
	S: srcTableS,
	T: srcTableT,
};


function exec_sql(query: string): RANode {
	const ast = relalgjs.parseSQLSelect(query);
	relalgjs.replaceVariables(ast, relations);
	const root = relalgjs.relalgFromSQLAstRoot(ast, relations);
	root.check();
	return root;
}

function exec_ra(query: string) {
	return relalgjs.executeRelalg(query, relations);
}

QUnit.testStart(function () {
	// create the three source tables
	/*srcTableR = relalgjs.executeRelalg(`{
		R.a, R.b, R.c

		1,   a,   d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {}) as Relation;

	srcTableS = relalgjs.executeRelalg(`{
		S.b, S.d

		a,   100
		b,   300
		c,   400
		d,   200
		e,   150
	}`, {}) as Relation;

	srcTableT = relalgjs.executeRelalg(`{
		T.b, T.d

		a,   100
		d,   200
		f,   400
		g,   120
	}`, {}) as Relation;

	relations.R = srcTableR;
	relations.S = srcTableS;
	relations.T = srcTableT;*/
});


QUnit.test('.test relation', function (assert) {
	const query = 'select distinct * from R';
	const root = exec_sql(query);

	assert.deepEqual(root.getResult(), srcTableR.getResult());
});


QUnit.test('test not existant relation', function (assert) {
	try {
		const query = 'select distinct * from X';
		exec_sql(query);

		assert.ok(false, 'table does not exist');
	}
	catch (e) {
		assert.ok(true, 'table not found');
	}
});

QUnit.test('test selection[true](R)', function (assert) {
	const query = 'select distinct * from R';
	const root = exec_sql(query);

	assert.deepEqual(root.getResult(), srcTableR.getResult());
});

QUnit.test('test selection[a>=3](R)', function (assert) {
	const root = exec_sql('select distinct * from R where a >= 3');

	const ref = relalgjs.executeRelalg(`{
		R.a, R.b, R.c

		3, 'c', 'c'
		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection[not (b=c)](R)', function (assert) {
	const root = exec_sql('select distinct * from R where ! (b = c)');

	const ref = relalgjs.executeRelalg(`{
		R.a, R.b, R.c

		1, 'a', 'd'
		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection[a>3](R)', function (assert) {
	const query = 'select distinct * from R where a > 3';
	const root = exec_sql(query);

	const ref = relalgjs.executeRelalg(`{
		R.a, R.b, R.c

		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection[a = 3 or b = \'e\'](R)', function (assert) {
	const root = exec_sql("select distinct * from  R where a = 3 or b = 'e'");

	const ref = relalgjs.executeRelalg(`{
		R.a, R.b, R.c

		3, 'c', 'c'
		6, 'e', 'f'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[a, b](R)', function (assert) {
	const root = exec_sql('select distinct a, b from R');

	const ref = relalgjs.executeRelalg(`{
		R.a, R.b

		1, 'a'
		3, 'c'
		4, 'd'
		5, 'd'
		6, 'e'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[b, a](R)', function (assert) {
	const query = 'select distinct b, a from R';
	const root = exec_sql(query);

	const ref = relalgjs.executeRelalg(`{
		R.b, R.a

		'a', 1
		'c', 3
		'd', 4
		'd', 5
		'e', 6
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[b, a, a, b](R)', function (assert) {
	const query = 'select distinct b, a, a, b from R';

	try {
		exec_sql(query);
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('test (R) inner join [R.b = S.b] join (S)', function (assert) {
	const root = exec_sql(`
		select distinct *
		from R
			inner join S on (R.b = S.b)
	`);

	const ref = relalgjs.executeRelalg(`{
		R.a, R.b, R.c, S.b, S.d

		1, 'a', 'd', 'a', 100
		3, 'c', 'c', 'c', 400
		4, 'd', 'f', 'd', 200
		5, 'd', 'b', 'd', 200
		6, 'e', 'f', 'e', 150
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});


QUnit.test('test rename relation', function (assert) {
	const query = 'select distinct t.a, b from R as t';
	const root = exec_sql(query);

	const ref = relalgjs.executeRelalg(`{
		t.a, t.b

		1, 'a'
		3, 'c'
		4, 'd'
		5, 'd'
		6, 'e'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});


QUnit.test('test rename column', function (assert) {
	const query = 'select distinct t.a as x, t.b from R as t';
	const root = exec_sql(query);

	const ref = relalgjs.executeRelalg(`{
		t.x, t.b

		1, 'a'
		3, 'c'
		4, 'd'
		5, 'd'
		6, 'e'
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test union 0', function (assert) {
	const query = 'select distinct * from S union select distinct * from T';
	const root = exec_sql(query);

	const ref = relalgjs.executeRelalg(`{
		S.b, S.d

		a,   100
		b,   300
		c,   400
		d,   200
		e,   150
		f,   400
		g,   120
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test union 1', function (assert) {
	const root = exec_sql(`
		select distinct * from R
		union
		select distinct * from R
		union
		select distinct * from R
	`);

	const result = root.getResult();
	assert.deepEqual(result, srcTableR.getResult());
});

QUnit.test('test intersect 0', function (assert) {
	const root = exec_sql(`
		select distinct * from S
		intersect
		select distinct * from T
	`);
	const ref = relalgjs.executeRelalg(`{
		S.b, S.d

		a,   100
		d,   200
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test intersect 1', function (assert) {
	const root = exec_sql(`
		select distinct * from S
		intersect
		select distinct * from S
	`);
	const ref = srcTableS.getResult();

	const result = root.getResult();
	assert.deepEqual(result, ref);
});

QUnit.test('test difference 0', function (assert) {
	const root = exec_sql(`
		select distinct * from S
		except
		select distinct * from T
	`);
	const ref = relalgjs.executeRelalg(`{
		S.b, S.d

		'b', 300
		'c', 400
		'e', 150
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test difference 1', function (assert) {
	const root = exec_sql(`
		select distinct * from T
		except
		select distinct * from S
	`);
	const ref = relalgjs.executeRelalg(`{
		T.b, T.d

		f, 400
		g, 120
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test difference 2', function (assert) {
	const root = exec_sql(`
		select distinct * from T
		except
		select distinct * from T
	`);
	const ref = relalgjs.executeRelalg(`{
		T.b:string, T.d:number
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test renameColumns 0', function (assert) {
	const root = exec_sql(`
		select distinct b as x, d as y
		from S
		where false
	`);
	const ref = relalgjs.executeRelalg(`{
		S.x:string, S.y:number
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test renameRelation 0', function (assert) {
	const query = 'select distinct * from S as t where t.d = 100';
	const root = exec_sql(query);
	const ref = relalgjs.executeRelalg(`{
		t.b, t.d
		a,   100
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test renameRelation 1', function (assert) {
	const query = 'select distinct * from S as t where d = 100';
	const root = exec_sql(query);
	const ref = relalgjs.executeRelalg(`{
		t.b, t.d
		a,   100
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test thetaJoin 0', function (assert) {
	const query = 'select distinct * from S ' +
		'inner join T on S.d = T.d';
	const root = exec_sql(query);
	const ref = exec_ra(`{
		S.b, S.d, T.b, T.d

        'a', 100, 'a', 100
		'c', 400, 'f', 400
		'd', 200, 'd', 200
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test thetaJoin 1', function (assert) {
	const query = 'select distinct * from S ' +
		'inner join T on S.d = T.d and T.b != S.b';
	const root = exec_sql(query);
	const ref = exec_ra(`{
		S.b, S.d, T.b, T.d

		'c', 400, 'f', 400
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test crossJoin 0', function (assert) {
	const query = 'select distinct * from S ' +
		"	cross join (select distinct * from T where b<='d') as T" +
		"	where S.b<='b'";
	const root = exec_sql(query);

	const ref = exec_ra(`{
		S.b:string, S.d:number, T.b:string, T.d:number

		'a',        100,        'a',        100
		'a',        100,        'd',        200
		'b',        300,        'a',        100
		'b',        300,        'd',        200
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test crossJoin 1', function (assert) {
	const query = 'select distinct * from S cross join T';
	const root = exec_sql(query);

	const query2 = 'select distinct * from S inner join T on true';
	const root2 = exec_sql(query2);

	assert.deepEqual(root.getResult(), root2.getResult());
});

QUnit.test('test naturalJoin 0', function (assert) {
	const query = 'select distinct * from S natural join T';
	const root = exec_sql(query);

	const query2 = 'select distinct S.* from S inner join T on S.b=T.b and S.d=T.d';
	const root2 = exec_sql(query2);

	assert.deepEqual(root.getResult(), root2.getResult());
});

QUnit.test('test naturalJoin 1', function (assert) {
	const query = 'select distinct * from R natural join S';
	const root = exec_sql(query);

	const query2 = 'pi a, R.b, c, d (R join R.b=S.b S)';
	const root2 = exec_ra(query2);

	assert.deepEqual(root.getResult(), root2.getResult());
});

QUnit.test('test using clause 0', function (assert) {
	const query = 'select distinct * from R join S using(b)';
	const ref = 'pi a, R.b, c, d (R join R.b=S.b S)';

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(ref).getResult());
});

QUnit.test('test using clause 1', function (assert) {
	const query = `
		select distinct * 
		from R 
		inner join (
			select distinct b, d as a from S
		) as S using(b)
	`;
	const ref = `
		pi R.a, R.b, R.c, S.a (
			R join R.b=S.b rho d->a S
		)
	`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(ref).getResult());
});

QUnit.test('test leftOuterJoin 0', function (assert) {
	const query = 'select distinct * from T left outer join S on T.b=S.b ';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a', 100, 'a',  100
		'd', 200, 'd',  200
		'f', 400, null, null
		'g', 120, null, null
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rightOuterJoin 0', function (assert) {
	const query = 'select distinct * from T right outer join S on T.b=S.b';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a',  100,  'a', 100
		null, null, 'b', 300
		null, null, 'c', 400
		'd',  200,  'd', 200
		null, null, 'e', 150
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test fullOuterJoin 0', function (assert) {
	const query = 'select distinct * from T full outer join S on T.b=S.b';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a',  100,  'a',  100
		'd',  200,  'd',  200
		'f',  400,  null, null
		'g',  120,  null, null
		null, null, 'b',  300
		null, null, 'c',  400
		null, null, 'e',  150
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test is null 0', function (assert) {
	const query = 'select distinct * from T ' +
		'left outer join S on T.b=S.b ' +
		'where S.b is null';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		T.b:string, T.d:number, S.b:string, S.d:number

		'f',  400,  null, null
		'g',  120,  null, null
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test is not null 1', function (assert) {
	const query = 'select distinct * from T ' +
		'left outer join S on T.b=S.b ' +
		'where S.b is not null';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		T.b:string, T.d:number, S.b:string, S.d:number

		'a',  100,  'a',  100
		'd',  200,  'd',  200
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy 0', function (assert) {
	const query = 'select distinct * from R where a >= 3 and a >= 2.1 and a>=3.0 and a>=-1 order by 1';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test cross join', function (assert) {
	const query = 'select distinct * from R, S, T';
	exec_sql(query);

	assert.ok(true, 'ok');
});


QUnit.test('group by 0', function (assert) {
	const query = 'select distinct b, count(*) as test from R group by b order by 2 desc, 1';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.b, test

		d, 2
		a, 1
		c, 1
		e, 1
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('having without group by (not allowed)', function (assert) {
	try {
		const query = 'select distinct * from R having true';
		exec_sql(query);
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('having without group by (allowed)', function (assert) {
	const query = 'select distinct count(*) as x from R where true having true';
	const ref = '{x:number\n5}';

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(ref).getResult());
});

QUnit.test('group without aggregation', function (assert) {
	const query = "select distinct * from R group by b having b > 'c' order by 1 asc";
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.b
		d
		e
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('aggregation without group (working)', function (assert) {
	const query = 'select distinct count(*) as test from R';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		test:number
		5
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('aggregation without group (not working)', function (assert) {
	try {
		const query = 'select distinct b, count(*) as test from R';
		exec_sql(query);
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('group by having 0', function (assert) {
	const query = 'select distinct b, count(*) as test from R group by b having test >= 2 order by 2 desc, 1';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.b:string, test:number
		d, 2
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());
});


QUnit.test('ROWNUM not supported', function (assert) {
	try {
		const query = 'select distinct b from R where ROWNUM > 10';
		exec_sql(query);
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});


QUnit.test('limit 0', function (assert) {
	const query = 'select distinct b from R where true limit 0';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.b:string
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());

	// QUnit.test fetch first syntax
	const root2 = exec_sql('select distinct b from R where true fetch first 0 rows only');
	assert.deepEqual(root2.getResult(), ref.getResult());
});

QUnit.test('limit 1', function (assert) {
	const query = 'select distinct * from R order by 1 limit 2 offset 2';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		4, 'd', 'f'
		5, 'd', 'b'
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());

	// QUnit.test fetch first syntax
	const root2 = exec_sql('select distinct * from R order by 1 offset 2 rows fetch first 2 rows only');
	assert.deepEqual(root2.getResult(), ref.getResult());
});

QUnit.test('limit 2', function (assert) {
	const root1 = exec_sql('select distinct * from R order by 1 limit 1');
	const root2 = exec_sql('select distinct * from R order by 1 desc limit 1');

	assert.ok(root1.getResult().equals(root2.getResult()) === false);
});

QUnit.test('limit 3: non valid limit', function (assert) {
	try {
		exec_sql('select distinct b from R limit -1');
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('limit 3.2: non valid limit', function (assert) {
	try {
		exec_sql('select distinct b from R fetch first -1 rows only');
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('limit 4: limit all with offset', function (assert) {
	const query = 'select distinct * from R order by 1 limit ALL offset 2';
	const root = exec_sql(query);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`);
	assert.deepEqual(root.getResult(), ref.getResult());

	// QUnit.test fetch first syntax
	const root2 = exec_sql('select distinct * from R order by 1 offset 2 rows');
	assert.deepEqual(root2.getResult(), ref.getResult());
});

QUnit.test('limit 5: limit all', function (assert) {
	const query = 'select distinct * from R order by 1 limit ALL';
	const root = exec_sql(query);

	assert.deepEqual(root.getResult(), srcTableR.getResult());
});


QUnit.module('translate sql dump to group definition');


QUnit.test('dbdump 1', function (assert) {
	const query = `
		create table test (a int, b varchar);
		insert into test values(1, 'sadf');
	`;
	const ast = relalgjs.parseSQLDump(query);
	ast.groups[0].headers = [
		{
			name: 'group',
			text: 'test',
			lang: null,
		},
	];

	const ref = `
		group:test
		test = {
			a:number, b:string
			1       , 'sadf'
		}
	`;

	const refAst = relalgjs.parseRelalgGroup(ref);

	assert.deepEqual(relalgjs.textFromGroupAstRoot(ast), relalgjs.textFromGroupAstRoot(refAst));
});

QUnit.test('distinct warning 1', function (assert) {
	let ast, query;

	// QUnit.test if distinct flag is set correctly
	query = 'select distinct a from R';
	ast = relalgjs.parseSQLSelect(query);
	assert.equal(ast.child.select.distinct, true);

	query = 'select a from R';
	ast = relalgjs.parseSQLSelect(query);
	assert.equal(ast.child.select.distinct, false);
});

QUnit.test('join_expression 1', function (assert) {
	const query = 'select distinct * from R, S natural join T';
	const queryRef = 'R x S join T';

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('join_expression 2', function (assert) {
	const query = 'select distinct * from R, (S natural join T)';
	const queryRef = 'R x (S join T)';

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});


QUnit.test('test statement with "with-clause"', function (assert) {
	const query = 'with A as (select * from R) select * from A';
	const queryRef = 'rho A R';

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('test statement with "with-clause" 2', function (assert) {
	const query = 'with A as (select a, b from R) select * from A cross join S';
	const queryRef = 'pi a, b rho A R x S';

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.skip('test having-clause including aggregation 1', function (assert) {
	const query = `
		select b
		from R
		group by b
		having count(*) > 1
	`;
	const queryRef = `
		select b
		from (
			select b, count(*) as x
			from R
			group by b
			having x > 1
		) as x
	`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.skip('test aggregate function in value-expression', function (assert) {
	const query = `
		select count(*) as x
		from R
	`;
	const queryRef = `
		{
			x
			6
		}
	`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('whitespace(s) between aggregate function and opening parenthesis', function (assert) {
	const query = `
		SELECT sum(a) AS total_a
		FROM R`;
	const queryRef = `gamma ; sum (a)->total_a (R)`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('whitespace(s) between count(*) function and opening parenthesis', function (assert) {
	const query = `
		SELECT count    (*) AS n
		FROM R`;
	const queryRef = `gamma ; count(*)->n (R)`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('whitespace(s) between n-ary text function and opening parenthesis', function (assert) {
	const query = `
		SELECT concat  (a, b, c) AS k
		FROM R`;
	const queryRef = `pi concat(a, b, c)->k (R)`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('whitespace(s) between binary function and opening parenthesis', function (assert) {
	const query = `
		SELECT add    (a, 5) AS a_plus_5
		FROM R`;
	const queryRef = `pi add(a, 5)->a_plus_5 (R)`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});

QUnit.test('whitespace(s) between unary function and opening parenthesis', function (assert) {
	const query = `
		SELECT a + length  (  c ) AS x, upper (   b  ) AS k
		FROM R`;
	const queryRef = `pi a + length(c)->x, upper(b)->k (R)`;

	assert.deepEqual(exec_sql(query).getResult(), exec_ra(queryRef).getResult());
});
