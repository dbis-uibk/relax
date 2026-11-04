import { escapeHtml, htmlToText } from 'db/exec/html';
import { Relation } from 'db/exec/Relation';
import { RenameRelation } from 'db/exec/RenameRelation';
import { Schema } from 'db/exec/Schema';
import { Table } from 'db/exec/Table';
import * as relalgjs from '../relalg';

QUnit.module('html escaping of user input');

const PAYLOAD = '<img src=x onerror=alert(1)>';
const ESCAPED_PAYLOAD = '&lt;img src=x onerror=alert(1)&gt;';

function assertEscaped(assert: Assert, html: string) {
	assert.notOk(html.includes('<img'), `no live element in: ${html}`);
	assert.ok(html.includes(ESCAPED_PAYLOAD), `payload stays visible as text in: ${html}`);
}

QUnit.test('escapeHtml escapes markup characters', assert => {
	assert.strictEqual(escapeHtml(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
	assert.strictEqual(escapeHtml(42), '42');
});

QUnit.test('string literal in a selection', assert => {
	const root = relalgjs.executeRelalg(`sigma a = '${PAYLOAD}' {a\n'b'}`, {});
	const html = root.getFormulaHtml(true, false);

	assertEscaped(assert, html);
	assert.ok(html.includes('<span class="math">&sigma;</span>'), 'operator markup is kept');
});

QUnit.test('string literal in a projection expression', assert => {
	const root = relalgjs.executeRelalg(`pi concat(a, '${PAYLOAD}')->c {a\n'b'}`, {});

	assertEscaped(assert, root.getFormulaHtml(true, false));
});

QUnit.test('string literal in a join condition', assert => {
	const root = relalgjs.executeRelalg(`{a\n'b'} inner join a = '${PAYLOAD}' {c\n'd'}`, {});

	assertEscaped(assert, root.getFormulaHtml(true, false));
});

QUnit.test('value in a result table', assert => {
	const root = relalgjs.executeRelalg(`{a\n'${PAYLOAD}'}`, {});

	assertEscaped(assert, root.getResult(false).getHtml());
});

QUnit.test('column name in a result table', assert => {
	const schema = new Schema();
	schema.addColumn(PAYLOAD, null, 'string');
	const table = new Table();
	table.setSchema(schema);

	assertEscaped(assert, table.getHtml());
	assertEscaped(assert, table.getHtml(true));
});

QUnit.test('relation name and alias', assert => {
	const relation = new Relation(PAYLOAD);

	assertEscaped(assert, relation.getFormulaHtml());
	assertEscaped(assert, new RenameRelation(relation, PAYLOAD).getArgumentHtml());
});

QUnit.test('htmlToText strips markup without running it', assert => {
	const done = assert.async();
	const win = window as unknown as { __htmlToTextFired?: boolean };
	delete win.__htmlToTextFired;

	const text = htmlToText('a <b>b</b> &lt;c&gt;<img src=x onerror="window.__htmlToTextFired = true">');
	assert.strictEqual(text, 'a b <c>');

	// a broken image would report its error asynchronously
	setTimeout(() => {
		assert.notOk(win.__htmlToTextFired, 'the event handler did not run');
		done();
	}, 200);
});
