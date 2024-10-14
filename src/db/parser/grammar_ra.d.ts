/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module relalgAst {
	interface CodeInfo {
		location: {
			start: { offset: number, line: number, column: number },
			end: { offset: number, line: number, column: number },
		},
		text: string
	}

	interface NodeInfo {
		type: 'nodeInfo',
		name: string,
		location: {
			start: { offset: number, line: number, column: number },
			end: { offset: number, line: number, column: number },
		}
	}

	type astNode
		= rootRelalg
		| relalgOperation
		| valueExpr
		| assignment
		;

	interface rootRelalg {
		type: 'relalgRoot',
		assignments: assignment[],
		child: relalgOperation,
		child2?: undefined,
		operatorPositions: NodeInfo[],

		codeInfo: CodeInfo,
	}

	type assignment = {
		type: 'assignment',
		name: string,
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,

		codeInfo: CodeInfo
	};

	type relalgOperation
		= relation
		| table
		| eliminateDuplicates
		| projection
		| selection
		| renameColumns
		| renameRelation
		| orderBy
		| groupBy
		| union
		| intersect
		| division
		| difference
		| thetaJoin
		| crossJoin
		| naturalJoin
		| leftSemiJoin
		| rightSemiJoin
		| antiJoin
		| leftOuterJoin
		| rightOuterJoin
		| fullOuterJoin
		;

	interface columnName {
		type: 'columnName',
		name: string | number,
		relAlias: string | null,
	}

	interface columnAsterisk {
		type: 'column',
		name: '*',
		relAlias: string | null
	}

	interface namedColumnExpr {
		type: 'namedColumnExpr',
		name: string,
		relAlias: string,
		child: valueExpr,

		codeInfo: CodeInfo
	}

	interface relation {
		type: 'relation',
		name: string,

		child?: undefined,
		child2?: undefined,
		assignments?: undefined,

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface tableColumnName {
		name: string,
		relAlias: string,
		type: 'string' | 'boolean' | 'number' | 'date'
	}

	interface table {
		type: 'table',
		name: string,
		columns: tableColumnName[],
		rows: (string | boolean | number | Date)[][],

		child?: undefined,
		child2?: undefined,
		assignments?: undefined,

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface selection {
		type: 'selection',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,
		arg: booleanExpr,

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface projection {
		type: 'projection',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,
		arg: (namedColumnExpr | columnName | columnAsterisk)[],

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface eliminateDuplicates {
		type: 'eliminateDuplicates',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface colAssignment {
		type: 'colAssignment',
		src: columnName,
		dst: string,

		codeInfo: CodeInfo
	}

	interface renameColumns {
		type: 'renameColumns',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,
		arg: colAssignment[],

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface renameRelation {
		type: 'renameRelation',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,
		newRelAlias: string,

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface orderByArg {
		col: columnName,
		asc: boolean
	}

	interface orderBy {
		type: 'orderBy',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,
		arg: orderByArg[],

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface aggFunction {
		aggFunction: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' | 'COUNT_ALL',
		col: columnName,
	}

	interface aggFunctionArgument extends aggFunction {
		name: string
	}

	interface groupBy {
		type: 'groupBy',
		child: relalgOperation,
		child2?: undefined,
		assignments?: undefined,
		group: columnName[],
		aggregate: aggFunctionArgument[],

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface binaryRelalgOperation {
		child: relalgOperation,
		child2: relalgOperation,
		assignments?: undefined,

		wrappedInParentheses?: boolean,
		metaData?: { [key: string]: any },
		codeInfo: CodeInfo,
	}

	interface union extends binaryRelalgOperation {
		type: 'union'
	}

	interface intersect extends binaryRelalgOperation {
		type: 'intersect'
	}

	interface division extends binaryRelalgOperation {
		type: 'division'
	}

	interface difference extends binaryRelalgOperation {
		type: 'difference'
	}

	// joins
	interface thetaJoin extends binaryRelalgOperation {
		type: 'thetaJoin',
		arg: booleanExpr
	}

	interface crossJoin extends binaryRelalgOperation {
		type: 'crossJoin'
	}

	interface naturalJoin extends binaryRelalgOperation {
		type: 'naturalJoin'
	}

	interface leftSemiJoin extends binaryRelalgOperation {
		type: 'leftSemiJoin'
	}

	interface rightSemiJoin extends binaryRelalgOperation {
		type: 'rightSemiJoin'
	}

	interface antiJoin extends binaryRelalgOperation {
		type: 'antiJoin'
		arg: booleanExpr
	}

	interface leftOuterJoin extends binaryRelalgOperation {
		type: 'leftOuterJoin'
		arg: booleanExpr
	}

	interface rightOuterJoin extends binaryRelalgOperation {
		type: 'rightOuterJoin'
		arg: booleanExpr
	}

	interface fullOuterJoin extends binaryRelalgOperation {
		type: 'fullOuterJoin'
		arg: booleanExpr
	}


	interface valueExpr {
		type: 'valueExpr',
		datatype: 'string' | 'boolean' | 'number' | 'null' | 'date',
		func: ValueExprFunction,
		args: valueExpr[] | any[],
		wrappedInParentheses?: boolean,
		metaData?: Object,

		child?: undefined,
		child2?: undefined,
		assignments?: undefined,

		codeInfo: CodeInfo
	}

	interface booleanExpr extends valueExpr { }


	interface GroupRoot {
		type: 'groupRoot',
		groups: Group[],
		codeInfo: CodeInfo,

		child?: undefined,
		child2?: undefined,
		assignments?: undefined,
	}

	type GroupHeader = {
		name: 'group' | 'description' | 'category',
		lang: string | null,
		text: string,
	};

	interface Group {
		type: 'tableGroup',
		/** at least one header named 'group' is present */
		headers: GroupHeader[],
		assignments: assignment[],
		codeInfo: CodeInfo,
		exampleSql?: string,
		exampleBags?: string,
		exampleRA?: string;
	}


	type ValueExprFunction = (
		| 'constant'
		| 'columnValue'
		| 'or'
		| 'concat'
		| 'xor'
		| 'and'
		| 'like'
		| 'ilike'
		| 'regexp'
		| 'rlike'
		| 'add'
		| 'sub'
		| 'mul'
		| 'div'
		| 'mod'
		| 'minus'
		| 'not'
		| 'coalesce'
		| 'concat'
		| 'adddate'
		| 'subdate'
		| 'upper'
		| 'lower'
		| 'repeat'
		| 'replace'
		| 'reverse'
		| 'strlen'
		| 'abs'
		| 'floor'
		| 'ceil'
		| 'round'
		| 'date'
		| 'year'
		| 'month'
		| 'dayofmonth'
		| 'hour'
		| 'minute'
		| 'second'
		| 'dayofmonth'
		| 'rand'
		| 'rownum'
		| 'now'
		| 'transaction_timestamp'
		| 'statement_timestamp'
		| 'clock_timestamp'
		| 'caseWhen'
		| 'caseWhenElse'
		| '='
		| '!='
		| '>='
		| '<='
		| '>'
		| '<'
	);
}
