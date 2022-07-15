/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module sqlAst {

	interface CodeInfo extends relalgAst.CodeInfo { }

	interface abstractAstNode {
		codeInfo: CodeInfo,
	}

	interface abstractSqlClause extends abstractAstNode {
		wrappedInParentheses?: boolean,
		metaData?: object,
		codeInfo: CodeInfo,
	}

	type astNode
		= sqlClause
		| sqlOperation
		| assignment
		| rootSql
		| statement
		| valueExpr
		
		;

	type sqlClause
		= select
		| where
		| having
		;

	type sqlOperation
		= relation
		| renameRelation
		| relationFromSubstatement
		| innerAndOuterJoins
		| crossJoin
		| naturalJoin
		| union
		| intersect
		| except
		| orderBy
		| limit
		;

	interface abstractSqlOperation extends abstractAstNode {
		child: undefined,
		child2: undefined,
		assignments: undefined,
		wrappedInParentheses?: boolean,
		metaData?: object,
		codeInfo: CodeInfo,
	}

	interface assignment extends abstractAstNode {
		type: 'assignment',
		name: string,
		child: relationFromSubstatement,
		child2: undefined,
		assignments: undefined,

		codeInfo: CodeInfo,
	}

	interface rootSql extends abstractAstNode {
		type: 'sqlRoot',
		assignments: assignment[],
		child: statement,
		child2: undefined,

		codeInfo: CodeInfo
	}

	interface statement extends abstractAstNode {
		type: 'statement',
		child: undefined,
		child2: undefined,
		assignments: undefined,
		select: select,
		from: from_item,
		where: where,
		groupBy: columnName[],
		having: having,

		numAggregationColumns: number,
		wrappedInParentheses: false,
		codeInfo: CodeInfo
	}

	type columnForSelect
		= aggFunctionArgument
		| columnName
		| columnAsterisk
		| namedColumn
		| namedColumnExpr
		;

	interface select extends abstractSqlClause {
		type: 'select',
		child: undefined,
		child2: undefined,
		assignments: undefined,
		distinct: boolean,
		arg: columnForSelect[],

		codeInfo: CodeInfo
	}

	interface where extends abstractSqlClause {
		type: 'where',
		child: undefined,
		child2: undefined,
		assignments: undefined,
		arg: booleanExpr,

		codeInfo: CodeInfo
	}

	interface having extends abstractSqlClause {
		type: 'having',
		child: undefined,
		child2: undefined,
		assignments: undefined,
		arg: booleanExpr,

		codeInfo: CodeInfo
	}




	interface aggFunction {
		type: 'aggFunction',
		aggFunction: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' | 'COUNT_ALL',
		col: columnName,
	}

	interface aggFunctionArgument extends aggFunction {
		name: string
	}

	interface columnName {
		type: 'column',
		name: string | number,
		relAlias: string | null
	}

	interface columnAsterisk {
		type: 'column',
		name: '*',
		relAlias: string | null
	}

	interface namedColumn {
		type: 'column',
		name: string | number,
		relAlias: string | null
		alias: string,
	}

	interface namedColumnExpr {
		type: 'namedColumnExpr',
		name: string,
		relAlias: string,
		child: valueExpr,

		codeInfo: CodeInfo
	}

	interface valueExpr {
		type: 'valueExpr',
		child: undefined,
		child2: undefined,
		assignments: undefined,
		datatype: 'string' | 'boolean' | 'number' | 'null' | 'date',
		func: relalgAst.ValueExprFunction,
		args: valueExpr[] | any[],
		wrappedInParentheses?: boolean,
		metaData?: object,

		codeInfo: CodeInfo,
	}

	interface booleanExpr extends valueExpr { }

	type from_item = sqlOperation;

	type relation = abstractSqlOperation & {
		type: 'relation',
		name: string,
		relAlias: string,
	}

	type renameRelation = abstractSqlOperation & {
		type: 'renameRelation',
		child: sqlClause,
		newRelAlias: string,
	}

	type relationFromSubstatement = abstractSqlOperation & {
		type: 'relationFromSubstatement',
		statement: statement,
		relAlias: string,

		codeInfo: CodeInfo
	}

	type binarySqlOperation = abstractSqlOperation & {
		child: sqlOperation
		child2: sqlOperation
	}

	// joins
	type innerAndOuterJoins = binarySqlOperation & {
		type: 'innerJoin' | 'leftOuterJoin' | 'rightOuterJoin' | 'fullOuterJoin',
		cond: booleanExpr | string[] | null
	}

	type crossJoin = binarySqlOperation & {
		type: 'crossJoin'
	}

	/**
	* cond is always null
	*/
	type naturalJoin = binarySqlOperation & {
		type: 'naturalJoin'
		cond: any
	}

	type union = binarySqlOperation & {
		type: 'union',
		all: boolean
	}

	type intersect = binarySqlOperation & {
		type: 'intersect',
		all: boolean
	}

	type except = binarySqlOperation & {
		type: 'except',
		all: boolean
	}

	interface orderByArg {
		col: columnName,
		asc: boolean
	}

	type orderBy = abstractSqlOperation & {
		type: 'orderBy',
		child: sqlOperation,
		arg: {
			value: orderByArg[];
			codeInfo: CodeInfo;
		}
	}

	/**
	 * limit is -1 for no limit (= only offset)
	 */
	type limit = abstractSqlOperation & {
		type: 'limit',
		limit: number,
		offset: number,
		child: sqlOperation,

		codeInfo: CodeInfo,
	};



	/*interface tableColumnName {
		name:string,
		relAlias:string,
		type: 'string' | 'boolean' | 'number' | 'date'
	}

	interface table extends relalgOperation {
		type: 'table',
		name: string,
		columns: tableColumnName[],
		rows: (string | boolean | number | Date)[][],
	}

	interface selection extends relalgOperation {
		type: 'selection',
		child: relalgOperation,
		arg: booleanExpr,
	}

	interface projection extends relalgOperation {
		type: 'projection',
		child: relalgOperation,
		arg: (namedColumnExpr | columnName)[],
	}

	interface colAssignment {
		type: 'colAssignment',
		src: columnName,
		dst: string,

		codeInfo: CodeInfo
	}

	interface renameColumns extends relalgOperation {
		type: 'renameColumns',
		child: relalgOperation,
		arg: colAssignment[],
	}







	interface groupBy extends relalgOperation {
		type: 'groupBy',
		child: relalgOperation,
		group: columnName[],
		aggregate: aggFunctionArgument[],
	}

	interface binaryRelalgOperation extends relalgOperation {
		type: string,
		child: relalgOperation
		child2: relalgOperation
	}




*/


}