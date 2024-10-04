import { i18n } from 'calc2/i18n';

const pegParserRelalg = require('./grammar_ra.pegjs') as any;
const pegParserBagalg = require('./grammar_bags.pegjs') as any;

export function parseRelalg(text: string, 	relationNames: string[] = [], strictRA: boolean = true): relalgAst.rootRelalg {
	const ast = (strictRA ? pegParserRelalg : pegParserBagalg)
		.parse(text, {
			startRule: 'start',
			relationNames: relationNames,
			i18n,
		});
	return ast;
}

export function parseRelalgGroup(text: string, strictRA: boolean = true): relalgAst.GroupRoot {
	return (strictRA ? pegParserRelalg : pegParserBagalg)
		.parse(text, {
			startRule: 'groupStart',
			i18n,
		});
}
