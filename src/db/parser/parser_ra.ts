import { i18n } from 'calc2/i18n';

const pegParserRelalg = require('./grammar_ra.pegjs') as any;

export function parseRelalg(text: string, relationNames: string[] = []): relalgAst.rootRelalg {
	// Remove any whitespace before '(' character
	text = text.replace(/\s*\(/g, '(');

	const ast = pegParserRelalg.parse(text, {
		startRule: 'start',
		relationNames: relationNames,
		i18n,
	});
	return ast;
}

export function parseRelalgGroup(text: string): relalgAst.GroupRoot {
	return pegParserRelalg.parse(text, {
		startRule: 'groupStart',
		i18n,
	});
}
