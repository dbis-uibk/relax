/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

{
	function t(key, obj){
		obj = obj || {};

		if(options.i18n){
			return options.i18n.t(key, obj);
		}

		// fallback
		return key+' '+JSON.stringify(obj);
	}

	function getCodeInfo(){
		return {
			location: location(),
			text: text()
		};
	}

	function checkAssignments(assignments){
		// check if the defined variable names are unique
		var tmp = {}, name;

		for(var i = 0; i < assignments.length; i++){
			name = assignments[i].name;
			if(tmp[name])
				error(t('db.messages.parser.error-duplicate-variable', {name: name}));

			tmp[name] = true;
		}
	};

	// builds a binary valueExpression (fills the args array)
	function buildBinaryValueExpr(first, rest){
		// all members of rest have a member args in the form [undefined, child2]

		var root = rest[0];
		root.args[0] = first;
		root.codeInfo = getCodeInfo();

		var n;
		for(var i = 1; i < rest.length; i++){
			n = rest[i];

			n.args[0] = root;
			n.codeInfo = getCodeInfo();

			root = n;
		}

		return root;
	}

	function buildBinary(first, rest){
		// all members of rest have a child2

		var root = rest[0];
		root.child = first;
		root.codeInfo = getCodeInfo();

		var n;
		for(var i = 1; i < rest.length; i++){
			n = rest[i];

			n.child = root;
			n.codeInfo = getCodeInfo();

			root = n;
		}

		return root;
	}
}



start
= r:root
	{ return r; }
/ r:root __
	{ return r; }
/ __ r:root
	{ return r; }

dbDumpStart
= dbDumpRoot

EOF
= !.

endOfLine
= "\r\n"
/ "\n"

comment
= singleLineComment
/ multiLineComment

singleLineComment '-- '
= '--' [ \t] &(endOfLine / EOF)
/ '--' &(endOfLine / EOF)
/ '--' [ \t] text:$(!endOfLine .)* &(endOfLine / EOF)

multiLineComment
= '/*' (!'*/' .)* '*/'

__ 'whitespace' // normal whitespace
= (comment* [ \t\r\n]+ comment*)+
	{ return ''; }

_ 'optional whitespace'
= (comment / [ \t\r\n])*

__nc 'whitespace without comments'
= [\r\n\t ]+

_nc 'optional whitespace without comments'
= [\r\n\t ]*

string 'string'
= '"' [^"^\n]* '"'
    { error(t('db.messages.parser.error-sql-string-use-single-quotes')); }
/ '\'' a:$[^'^\n]* '\''
	{ return a; }


integer
= a:$('-'? [0-9]+)
	{return parseInt(a, 10); }

float
= a:$('-'? [0-9]+'.'[0-9]+)
	{return parseFloat(a); }

number
= float
/ integer

boolean
= 'true'i
	{ return true; }
/ 'false'i
	{ return false; }


relationName 'relationName'
= !(RESERVED_KEYWORD !([0-9a-zA-Z_]+)) a:$([a-zA-Z]+ $[0-9a-zA-Z_]*)
	{
		var b = a.toLowerCase();
		if(b === 'true' || b === 'false')
			error(t('db.messages.parser.error-sql-invalid-relation-name', {str: a}));
		return a;
	}

unqualifiedColumnName
= !(RESERVED_KEYWORD !([0-9a-zA-Z_]+)) a:$([a-zA-Z]+ $[0-9a-zA-Z_]*)
	{
		var b = a.toLowerCase();
		if(b === 'true' || b === 'false')
			error(t('db.messages.parser.error-sql-invalid-column-name', {str: a}));
		return a;
	}
	
relation
= a:relationName
	{
		return {
			type: 'relation',
			name: a,
			relAlias: null,

			codeInfo: getCodeInfo()
		};
	}

dateStr
= 'date'i '(\'' d: date '\')'
	{
		return d;
	}

date 'date in ISO format (YYYY-MM-DD)'
= year:$([0-9][0-9][0-9][0-9]) '-' month:$([0-9][0-9]) '-' day:$([0-9][0-9])
	{
		year = parseInt(year, 10);
		month = parseInt(month, 10)-1;
		day = parseInt(day, 10);
		var date = new Date(year, month, day);

		if(date.getFullYear() != year || date.getMonth() != month ||  date.getDate() != day){
			error(t('db.messages.parser.error-invalid-date-format', {str: text()}));
		}
		return date;
	}

columnName
= relAlias:(relationName '.')? name:unqualifiedColumnName
	{
		return {
			type: 'column',
			name: name,
			relAlias: relAlias ? relAlias[0] : null
		};
	}

columnAsterisk
= relAlias:(relationName '.')? '*'
	{
		return {
			type: 'column',
			name: '*',
			relAlias: relAlias ? relAlias[0] : null
		};
	}

columnIndex
= index:$[0-9]+
	{
		return {
			type: 'column',
			name: parseInt(index, 10),
			relAlias: null
		};
	}

aggFunction
= func:$('sum'i / 'count'i / 'avg'i / 'min'i / 'max'i) _ '(' _ ('ALL'i __)? col:columnName _ ')'
	{
		return {
			type: 'aggFunction',
			aggFunction: func.toUpperCase(),
			col: col
		};
	}
/ 'count'i _ '(' _ '*' _ ')'
	{
		return {
			type: 'aggFunction',
			aggFunction: 'COUNT_ALL',
			col: null
		};
	}




columnForSelect
= f:aggFunction __ 'as'i __ as:unqualifiedColumnName
	{
		f.name = as;
		return f;
	}
/ f:aggFunction _
	{
		error('aggregation columns must be named');
	}
/ col:columnAsterisk
	{
		col.alias = null;
		return col;
	}
/ col:columnName __ 'as'i __ dst:unqualifiedColumnName
	{
		col.alias = dst;
		return col;
	}
/ a:valueExpr __ 'as'i __ dst:unqualifiedColumnName
	{
		return {
			type: 'namedColumnExpr',
			name: dst,
			relAlias: null,
			child: a,

			codeInfo: getCodeInfo()
		};
	}
/ col:columnName
	{
		col.alias = null;
		return col;
	}




// arguments


// list of columns (kd.id, kd.name, test, *)
selectArg
= a:columnForSelect b:(_ ',' _ columnForSelect)*
	{
		var t = [a];

		if(b != null){
			for(var i = 0; i < b.length; i++){
				var col = b[i][3];
				t.push(col);
			}
		}
		return t;
	}

listOfColumnNames
= a:columnName b:(_ ',' _ columnName)*
	{
		var t = [a];
		if(b != null){
			for(var i in b){
				t.push(b[i][3]);
			}
		}
		return t;
	}

orderDirection
= 'asc'i
	{
		return true;
	}
/ 'desc'i
	{
		return false;
	}

orderByArg
= a:(columnName/columnIndex) asc:(__ orderDirection)?
	{
		if(asc == null)
			asc = true;
		else
			asc = asc[1];

		return {
			col: a,
			asc: asc
		};
	}

listOfOrderByArgs
= a:orderByArg b:(_ ',' _ orderByArg)*
{
	var t = [a];
	if(b != null){
		for(var i in b){
			t.push(b[i][3]);
		}
	}

	return {
		value: t,

		codeInfo: getCodeInfo()
	};
}

listOfGroupByArgs
= a:(columnName) b:(_ ',' _ columnName)*
{
	var t = [a];
	if(b != null){
		for(var i in b){
			t.push(b[i][3]);
		}
	}

	return t;
}

withClauseArgument
= name:relationName __ 'as'i _ '(' sub:statement ')'
	{
		sub.wrappedInParentheses = true;
		return {
			type: 'assignment',
			name: name,
			child: {
				type: 'relationFromSubstatement',
				statement: sub,
				relAlias: name,

				codeInfo: getCodeInfo()
			},

			codeInfo: getCodeInfo()
		};
	}


// nodes:


root
= a:withClause? _ e:statement _ ';'?
	{
		var assignments = [];
		if(a !== null){
			assignments = a;
			checkAssignments(assignments);
		}

		return {
			type: 'sqlRoot',
			assignments: assignments,
			child: e,

			codeInfo: getCodeInfo()
		};
	}

withClause
= 'with'i __ first:withClauseArgument rest:(_ ',' _ withClauseArgument)*
	{
		var assignments = [first];
		for(var i = 0; i < rest.length; i++){
			assignments.push(rest[i][3]);
		}
		return assignments;
	}


select
= 'select'i __ d:('distinct'i __)? cols:selectArg
	{
		return {
			type: 'select',
			distinct: (d !== null),
			arg: cols,

			codeInfo: getCodeInfo()
		};
	}
orderBy
= 'order'i __ 'by'i __ arg:listOfOrderByArgs
	{
		return {
			type: 'orderBy',
			child: null,
			arg: arg,

			codeInfo: getCodeInfo()
		};
	}


/*
	2: union, except
	1: intersect
	0: select
*/
statement
= compound_operator_precedence_3

compound_operator_precedence_3
= s:compound_operator_precedence_2
o:(__ orderBy)?
l:(__ (limit / fetchFirst))?
	{
		var n = s;
		if(o !== null){
			o[1].child = n;
			n = o[1];
		}
		if(l !== null){
			l[1].child = n;
			n = l[1];
		}
		return n;
	}
/ compound_operator_precedence_2

compound_operator_precedence_2
= first:compound_operator_precedence_1 rest:(
	union
	/ except
)+
	{ return buildBinary(first, rest); }
/ compound_operator_precedence_1


compound_operator_precedence_1
= first:compound_operator_precedence_0 rest:(
	intersect
)+
	{ return buildBinary(first, rest); }
/ compound_operator_precedence_0


compound_operator_precedence_0
= s:select __
'from'i __ f:from_item
w:(__ where)?
g:(__ 'group'i __ 'by'i __ listOfGroupByArgs)?
h:(__ having)?
	{
		// check if group clause is missing: if a agg column in combination with a non agg column appears group by must be set
		var col;
		var numAggregationColumns = 0;
		for(var i = 0; i < s.arg.length; i++){
			if(s.arg[i].type === 'aggFunction')
				numAggregationColumns++;
		}

		if(numAggregationColumns > 0 && numAggregationColumns != s.arg.length && g === null){
			error(t('db.messages.parser.error-sql-group-by-missing'));
		}

		if(h && !g && numAggregationColumns === 0){
			error(t('db.messages.parser.error-sql-having-without-group-by'));
		}


		return {
			type: 'statement',
			select: s,
			from: f,
			where: w ? w[1] : null,
			groupBy: g ? g[5] : null,
			having: h ? h[1] : null,

			numAggregationColumns: numAggregationColumns,
			wrappedInParentheses: false,
			codeInfo: getCodeInfo()
		};
	}
/ '(' _ e:statement _ ')'
	{
		e.wrappedInParentheses = true;
		return e;
	}


union
= __ 'union'i __ all:(
	(
		'all'i __ { return true; }
		/ 'distinct'i __ { return false; }
	)
)? c:compound_operator_precedence_1
	{ return {type: 'union', child2: c, all: all}; }

except
= __ 'except'i __ all:(
	(
		'all'i __ { return true; }
		/ 'distinct'i __ { return false; }
	)
)? c:compound_operator_precedence_1
	{ return {type: 'except', child2: c, all: all}; }

intersect
= __ 'intersect'i __ all:(
	(
		'all'i __ { return true; }
		/ 'distinct'i __ { return false; }
	)
)? c:compound_operator_precedence_1
	{ return {type: 'intersect', child2: c, all: all}; }







from_item
= from_item_precedence_1

from_item_precedence_1
= first:from_item_precedence_0 rest:(
	crossJoin
	/ naturalJoin
	/ innerAndOuterJoins
)+
	{ return buildBinary(first, rest); }
/ from_item_precedence_0

from_item_precedence_0
= name:relationName alias:(__ 'as'i __ relationName)?
	{
		var relation = {
			type: 'relation',
			name: name,
			relAlias: null,

			codeInfo: getCodeInfo()
		};

		if(alias !== null){
			return {
				type: 'renameRelation',
				child: relation,
				newRelAlias: alias[3],
				codeInfo: getCodeInfo()
			};
		}
		else{
			return relation;
		}
	}
/ '(' _ sub:statement _ ')' __ 'as'i __ alias:relationName
	{
		sub.wrappedInParentheses = true;
		return {
			type: 'relationFromSubstatement',
			statement: sub,
			relAlias: alias,

			codeInfo: getCodeInfo()
		};
	}
/ '(' _ e:from_item_precedence_1 _ ')'
	{
		e.wrappedInParentheses = true;
		return e;
	}





crossJoin
= ((__ 'cross'i __ 'join'i __) / (_ ',' _)) c:from_item_precedence_0
	{ return {type: 'crossJoin', child2: c, cond: null}; }

naturalJoin
= __ 'natural'i __ 'join'i __  c:from_item_precedence_0
	{ return {type: 'naturalJoin', child2: c, cond: null}; }

innerAndOuterJoins
= __ type:(
	('inner'i __)? 'join'i                 { return 'innerJoin'; }
	/ ('left'i (__ 'outer'i)? __ 'join'i)   { return 'leftOuterJoin'; }
	/ ('right'i (__ 'outer'i)? __ 'join'i) { return 'rightOuterJoin'; }
	/ ('full'i (__ 'outer'i)? __ 'join'i)  { return 'fullOuterJoin'; }
) __ c:from_item_precedence_0 __ condition:(
	'on'i __ expr:booleanExpr
		{ return expr; }
	/ 'using'i _ '(' _ first:unqualifiedColumnName rest:(_ ',' _ unqualifiedColumnName)* _ ')'
		{
			var restrictToColumns = [first];
			for(var i = 0; i < rest.length; i++){
				restrictToColumns.push(rest[i][3]);
			}
			return restrictToColumns;
		}
	/ 'natural'i
		{ return null; }
)
	{
		return {
			type: type,
			child2: c,
			cond: condition
		};
	}




where
= 'where'i __ cond:booleanExpr
	{
		return {
			type: 'where',
			arg: cond,

			codeInfo: getCodeInfo()
		};
	}

having
= 'having'i __ cond:booleanExpr
	{
		return {
			type: 'having',
			arg: cond,

			codeInfo: getCodeInfo()
		};
	}


limitArg
= 'all'i
	{ return -1; }
/ a:integer
	{
		if(a < 0)
			error(t('db.messages.parser.error-sql-negative-limit'));
		return a;
	}


limit
= 'limit'i __ o:integer _ ',' _ l:limitArg
	{
		return {
			type: 'limit',
			limit: l,
			offset: 0,

			codeInfo: getCodeInfo()
		};
	}
/ 'limit'i __ l:limitArg __ 'offset'i __ o:integer
	{
		return {
			type: 'limit',
			limit: l,
			offset: o,

			codeInfo: getCodeInfo()
		};
	}
/ 'limit'i __ l:limitArg
	{
		return {
			type: 'limit',
			limit: l,
			offset: 0,

			codeInfo: getCodeInfo()
		};
	}



// fetch first syntax from SQL:2008
fetchFirstOffset
= 'offset'i __ o:integer (__ ('rows'i / 'row'i))?
	{
		return o;
	}
fetchFirstLimit
= 'fetch'i __ ('first'i / 'next'i) __ l:integer __ ('rows'i / 'row'i) __ 'only'i
	{
		if(l < 0)
			error(t('db.messages.parser.error-sql-negative-limit'));
		return l;
	}

fetchFirst
= a:(
	o:fetchFirstOffset __ l:fetchFirstLimit { return [o, l]; }
	/ o:fetchFirstOffset { return [o, -1]; }
	/ l:fetchFirstLimit { return [0, l]; }
)
	{
		return {
			type: 'limit',
			child: null,
			limit: a[1],
			offset: a[0],

			codeInfo: getCodeInfo()
		};
	}




// comparisons
comparisonOperators
= comparisonOperatorEquals
/ comparisonOperatorNotEquals
/ comparisonOperatorGreaterEquals
/ comparisonOperatorLesserEquals
/ comparisonOperatorGreater
/ comparisonOperatorLesser

comparisonOperatorsIsOrIsNot
= 'is'i __ 'not'i
	{ return '!='; }
/ 'is'i
	{ return '='; }

comparisonOperatorEquals
= '='

comparisonOperatorNotEquals
= ('<>' / '!=')
	{ return '!='; }

comparisonOperatorGreaterEquals
= '>='
	{ return '>='; }

comparisonOperatorGreater
= '>'

comparisonOperatorLesserEquals
= '<='
	{ return '<='; }

comparisonOperatorLesser
= '<'

and 'logical AND'
= __ 'and'i __
	{ return 'AND'; }

xor 'logical XOR'
= __ 'xor'i __

or 'logical OR'
= __ 'or'i __
	{ return 'OR'; }

not 'logical NOT'
= _ '!' _
	{ return 'NOT'; }



subquery_expression
= negation:('not' __)? 'exists'i _ '(' _ sub:statement _ ')'
	{
		return {
			type: 'existsSubstatement',
			statement: sub,
			negation: (negation != null),

			codeInfo: getCodeInfo()
		};
	}


















/* db dump format
should return an object like
return {
	type: 'groupRoot',
	groups: groups,

	codeInfo: getCodeInfo()
};

table = {
	type: 'table',
	name: 'relationname',
	columns: [
		{name: '', relAlias: '', type: ''}
	],
	rows: [
		[1, 2, 3]
	],
}

*/




dumpComment
= _nc comment _nc ';'?
{ return { type: 'comment' }; }
/ '#' _nc [^\n]* '\n'
{ return { type: 'comment' }; }

dumpTableName
= '`' a: relationName '`'
{ return a; }
/ a:relationName
{ return a; }

dumpColumnName
= dumpTableName

dropTable
= 'drop'i __nc 'table'i __nc ('if'i __nc 'exists'i __nc)? dumpTableName _nc ';'
	{ return { type: 'dropTable' }; }

lockTables
= 'lock'i __nc 'tables'i __nc dumpTableName __nc [a-zA-Z]+ _nc ';'
	{ return { type: 'lockTable' }; }

unlockTables
= 'unlock'i __nc 'tables'i _nc ';'
	{ return { type: 'unlockTable' }; }




dbDumpRoot
= _nc a:((useDbStatement / lockTables / unlockTables / dumpComment / dropTable / createTableStmt / insertStmt) _nc )+ _nc
	{
		var tables = {};
		var column_indices = {};
		var e, i, j, k, row, type;
		var groupName = '';

		for(i = 0; i < a.length; i++){
			e = a[i][0];
			if(!e.type || e.type !== 'table' && e.type !== 'insert' && e.type !== 'groupName')
				continue;

			if(e.type == 'table'){ // create
				if(tables[e.name])
					error('table '+e.name+' already created');

				tables[e.name] = e;

				column_indices[e.name] = {};
				for(j = 0; j < e.columns.length; j++){
					column_indices[e.name][e.columns[j].name] = j;
				}
			}
			else if(e.type === 'groupName'){
				groupName = e.name;
			}
			else if(e.type === 'insert'){ // insert
				if(!tables[e.name])
					error('table '+e.name+' not created');

				for(j = 0; j < e.values.length; j++){
					if(e.columns.length === 0){
						row = e.values[j];
					}
					else{
						row = new Array(tables[e.name].columns.length);

						for(k = 0; k < e.values[j].length; k++){
							row[ column_indices[e.name][e.columns[k]] ] = e.values[j][k];
						}
					}

					// type check
					if(row.length !== tables[e.name].columns.length)
						error(t('db.messages.parser.error-sqldump-invalid-column-number', {line: e.codeInfo.line}));

					for(k = 0; k < row.length; k++){
						type = tables[e.name].columns[k].type;

						if(row[k] === null)
							continue;

						switch(type){
							case 'number':
								if(typeof row[k] !== 'number')
									error(t('db.messages.parser.error-sqldump-invalid-type', {line: e.codeInfo.line}));
								break;

							case 'string':
								if(typeof row[k] !== 'string')
									error(t('db.messages.parser.error-sqldump-invalid-type', {line: e.codeInfo.line}));
								break;

							case 'date':
								if(row[k] instanceof Date === false)
									error(t('db.messages.parser.error-sqldump-invalid-type', {line: e.codeInfo.line}));
								break;
						}
					}

					tables[e.name].rows.push(row);
				}

			}
		}

		var assignments = [];
		for(var name in tables){
			assignments.push({
				type: 'assignment',
				name: name,
				child: tables[name],

				codeInfo: getCodeInfo()
			});
		}

		var root = {
			type: 'groupRoot',
			groups: [
				{
					type: 'tableGroup',
					headers: {
						group: groupName
					},
					assignments: assignments,

					codeInfo: getCodeInfo()
				}
			],

			codeInfo: getCodeInfo()
		};
		return root;

	}
	
useDbStatement
= 'use'i __ name:$([a-zA-Z_0-9-]+) _ ';'
	{ 
		return {
			type: 'groupName', 
			name: name
		}; 
	}

createTableStmt_columnType
= 'decimal'i ('(' _nc [0-9]+ _nc ',' _nc [0-9]+ _nc ')')?
	{ return 'number'; }
/ ('tinyint'i / 'smallint'i / 'mediumint'i / 'bigint'i / 'integer'i / 'int'i / 'decimal'i) ('(' _nc [0-9]+ _nc ')')?
	{ return 'number'; }
/ ('float'i / 'double'i / 'decimal'i) ('(' [0-9]+ _ ',' _ [0-9]+ ')')?
	{ return 'number'; }
/ ('varchar'i / 'char'i / 'text'i) ('(' [0-9]+ ')')?
	{ return 'string'; }
/ 'datetime'i / 'date'i
	{ return 'date'; }


createTableStmt_ignore
= [a-zA-Z0-9_=]+
	{ return null; }
/ '(' _nc dumpColumnName _nc (',' _nc dumpColumnName)* _nc  ')'
	{ return null; }
/ dumpColumnName
	{ return null; }

createTableStmt_column
= name:dumpColumnName __nc type:createTableStmt_columnType (__nc createTableStmt_ignore)*
	{
		return {
			name: name,
			type: type,
			relAlias: null
		};
	}

createTableStmt_list
= '(' _nc  first:(createTableStmt_column / (_nc createTableStmt_ignore)+) rest:(_nc ',' _nc (createTableStmt_column / (_nc createTableStmt_ignore)+))* _nc ')'
	{
		var a = [];
		if(first !== null && first.type)
			a.push(first);

		for(var i = 0; i < rest.length; i++){
			if(rest[i][3] !== null && rest[i][3].type)
				a.push(rest[i][3]);
		}

		return a;
	}


// http://www.postgresql.org/docs/9.1/static/sql-createtable.html
createTableStmt
= 'create'i __ 'table'i __ ( 'if'i __ 'not'i __ 'exists' __)? name:dumpTableName _nc columns:createTableStmt_list _nc (_nc createTableStmt_ignore)* ';'
	{
		var table = {
			type: 'table',
			name: name,
			columns: columns, //{name: '', relAlias: null, type: ''}
			rows: [],

			codeInfo: getCodeInfo()
		};



		return table;
	}

insertStmt_value_null
= 'null'i
	{ return null; }

insertStmt_values
= '(' _ first:(number / string / dateStr / insertStmt_value_null) rest:(_ ',' _ (number / string / dateStr / insertStmt_value_null))* _ ')'
	{
		var a = [first];
		for(var i = 0; i < rest.length; i++){
			a.push(rest[i][3]);
		}
		return a;
	}

insertStmt
= 'insert'i __ 'into'i __ name:dumpTableName __ cols:(_ '(' _ dumpColumnName (_ ',' _ dumpColumnName)+ ')' __)? 'values'i _ value_first:insertStmt_values value_rest:(_ ',' _ insertStmt_values)* _ ';'
	{
		var i;
		var insert = {
			type: 'insert',
			name: name,
			columns: [],
			values: [value_first],

			codeInfo: getCodeInfo()
		};

		if(value_rest){
			for(i = 0; i < value_rest.length; i++){
				insert.values.push(value_rest[i][3]);
			}
		}

		if(cols){
			// first
			insert.columns.push(cols[3]);

			// rest
			for(var i = 0; i < cols[4].length; i++){
				insert.columns.push(cols[4][i][3]);
			}
		}


		// check number of columns
		var numCols = insert.values[0].length;

		for(i = 1; i < insert.values.length; i++){
			if(insert.values[i].length !== numCols)
				error(t('db.messages.parser.error-sqldump-insert-wrong-number-columns'));
		}

		if(cols && insert.columns.length !== numCols)
			error(t('db.messages.parser.error-sqldump-insert-wrong-number-columns'));


		return insert;
	}























/* == value expressions == */
valueExpr
= expr_precedence9

booleanExpr 'boolean expression'
= valueExpr

expr_rest_boolean_disj
= or right:expr_precedence8
	{
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: 'or',
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}

expr_rest_string_concat
= _ '||' _ right:expr_precedence8
	{
		return {
			type: 'valueExpr',
			datatype: 'string',
			func: 'concat',
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}

expr_rest_boolean_xdisj
= xor right:expr_precedence7
	{
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: 'xor',
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}

expr_rest_boolean_conj
= and right:expr_precedence6
	{
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: 'and',
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}




expr_rest_boolean_comparison
= _ o:comparisonOperatorsIsOrIsNot _ right:valueExprConstantNull
	{
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: o,
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}
/ _ o:comparisonOperators _ right:expr_precedence4
	{
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: o,
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}
/ _ o:('like'i / 'ilike'i / 'regexp'i / 'rlike'i) _ right:valueExprConstants
	{
		if(right.datatype !== 'string'){
			error(t('db.messages.parser.error-valueexpr-like-operand-no-string'));
		}
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: o.toLowerCase(),
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}


expr_rest_number_add
= _ o:('-' / '+') _ right:expr_precedence3
	{
		o = {
			'+': 'add',
			'-': 'sub'
		}[o];

		return {
			type: 'valueExpr',
			datatype: 'number',
			func: o,
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}

expr_rest_number_mul
= _ o:('*' / '/' / '%') _ right:expr_precedence2
	{
		o = {
			'*': 'mul',
			'/': 'div',
			'%': 'mod'
		}[o];

		return {
			type: 'valueExpr',
			datatype: 'number',
			func: o,
			args: [undefined, right],

			codeInfo: getCodeInfo()
		};
	}



expr_number_minus
= _ '-' a:expr_precedence1
	{
		return {
			type: 'valueExpr',
			datatype: 'number',
			func: 'minus',
			args: [a],

			codeInfo: getCodeInfo()
		};
	}

expr_boolean_negation
= not a:expr_precedence0
	{
		return {
			type: 'valueExpr',
			datatype: 'boolean',
			func: 'not',
			args: [a],

			codeInfo: getCodeInfo()
		};
	}


valueExprFunctionsNary
= func:(
	('coalesce'i { return ['coalesce', 'null']; })
	/ ('concat'i { return ['concat', 'string']; })
	/ ('replace'i { return ['replace', 'string']; })
)
_ '(' _ arg0:valueExpr _ argn:(',' _ valueExpr _ )* ')'
	{
		var args = [arg0];
		for(var i = 0; i < argn.length; i++){
			args.push(argn[i][2]);
		}

		return {
			type: 'valueExpr',
			datatype: func[1],
			func: func[0],
			args: args,

			codeInfo: getCodeInfo()
		};
	}

valueExprFunctionsBinary
= func:(
	('adddate'i { return ['adddate', 'date']; })
	/ ('subdate'i { return ['subdate', 'date']; })
	/ ('mod'i { return ['mod', 'number']; })
	/ ('add'i { return ['add', 'number']; })
	/ ('sub'i { return ['sub', 'number']; })
	/ ('mul'i { return ['mul', 'number']; })
	/ ('div'i { return ['div', 'number']; })
	/ ('repeat'i { return ['repeat', 'string']; })
)
_ '(' _ arg0:valueExpr _ ',' _ arg1:valueExpr _ ')'
	{
		return {
			type: 'valueExpr',
			datatype: func[1],
			func: func[0],
			args: [arg0, arg1],

			codeInfo: getCodeInfo()
		};
	}

valueExprFunctionsUnary
= func:(
	('upper'i { return ['upper', 'string']; })
	/ ('ucase'i { return ['upper', 'string']; })
	/ ('lower'i { return ['lower', 'string']; })
	/ ('lcase'i { return ['lower', 'string']; })
	/ ('reverse'i { return ['reverse', 'string']; })
	/ ('length'i { return ['strlen', 'number']; })
	/ ('abs'i { return ['abs', 'number']; })
	/ ('floor'i { return ['floor', 'number']; })
	/ ('ceil'i { return ['ceil', 'number']; })
	/ ('round'i { return ['round', 'number']; })

	/ ('date'i { return ['date', 'date']; })

	/ ('year'i { return ['year', 'number']; })
	/ ('month'i { return ['month', 'number']; })
	/ ('day'i { return ['dayofmonth', 'number']; })
	/ ('hour'i { return ['hour', 'number']; })
	/ ('minute'i { return ['minute', 'number']; })
	/ ('second'i { return ['second', 'number']; })
	/ ('dayofmonth'i { return ['dayofmonth', 'number']; })
)
_ '(' _ arg0:valueExpr _ ')'
	{
		return {
			type: 'valueExpr',
			datatype: func[1],
			func: func[0],
			args: [arg0],

			codeInfo: getCodeInfo()
		};
	}

valueExprFunctionsNullary
= func:(
	('rand'i { return ['rand', 'number']; })
	/ ('rownum'i { return ['rownum', 'number']; })

	/ ('now'i { return ['now', 'date']; })
	/ ('current_timestamp'i { return ['now', 'date']; })

	/ ('transaction_timestamp'i { return ['transaction_timestamp', 'date']; })
	/ ('statement_timestamp'i { return ['statement_timestamp', 'date']; })

	/ ('clock_timestamp'i { return ['clock_timestamp', 'date']; })
	/ ('sysdate'i { return ['clock_timestamp', 'date']; })
)
_ '(' _ ')'
	{
		return {
			type: 'valueExpr',
			datatype: func[1],
			func: func[0],
			args: [],

			codeInfo: getCodeInfo()
		};
	}



valueExprConstants
= a:(
	(v:number   { return [v, 'number']; })
	/ (v:boolean  { return [v, 'boolean']; })
	/ (v:string { return [v, 'string']; })
)
	{
		return {
			type: 'valueExpr',
			datatype: a[1],
			func: 'constant',
			args: [a[0]],

			codeInfo: getCodeInfo()
		};
	}
/ valueExprConstantNull

valueExprConstantNull
= a:'null'i
	{
		return {
			type: 'valueExpr',
			datatype: 'null',
			func: 'constant',
			args: [null],

			codeInfo: getCodeInfo()
		};
	}


valueExprColumn
= a:columnName  !'('
	{
		return {
			type: 'valueExpr',
			datatype: 'null',
			func: 'columnValue',
			args: [a.name, a.relAlias],

			codeInfo: getCodeInfo()
		};
	}

valueExprCaseWhen
= 'case'i
	wt:(__ 'when'i __ c:expr_precedence5 __ 'then'i __ r:expr_precedence5 { return {w: c, t:r} })+
	e:(__ 'else'i __ r:expr_precedence5 { return r })?
	__ 'end'i
	{
		var args = [], i;
		for(i = 0; i < wt.length; i++){
			// when on i%2 === 0
			args.push(wt[i].w);

			// then on i%2 === 1
			args.push(wt[i].t);
		}

		// else part
		if(e !== null){
			// when on i%2 === 0
			// constant true is used to give all args a unified interface
			args.push({
				type: 'valueExpr',
				datatype: 'boolean',
				func: 'constant',
				args: [true],

				codeInfo: getCodeInfo()
			});

			// then on i%2 === 1
			args.push(e);
		}

		return {
			type: 'valueExpr',
			datatype: 'null',
			func: e === null ? 'caseWhen' : 'caseWhenElse',
			args: args,

			codeInfo: getCodeInfo()
		};
	}




/*
value Expression

reference: https://dev.mysql.com/doc/refman/5.7/en/operator-precedence.html

0: functions, constants, columns, ( .. )
1: !
2: - (unary minus)
3: *, /, %
4: -, +
5: = (comparison), >=, >, <=, <, <>, !=, IS, LIKE, REGEXP
6: CASE, WHEN, THEN, ELSE
7: AND
8: XOR
9: OR, ||

*/

expr_precedence9
= first:expr_precedence8 rest:(
		expr_rest_boolean_disj
		/ expr_rest_string_concat
	)+
	{ return buildBinaryValueExpr(first, rest); }
/ expr_precedence8

expr_precedence8
= first:expr_precedence7 rest:( expr_rest_boolean_xdisj )+
	{ return buildBinaryValueExpr(first, rest); }
/ expr_precedence7

expr_precedence7
= first:expr_precedence6 rest:( expr_rest_boolean_conj )+
	{ return buildBinaryValueExpr(first, rest); }
/ expr_precedence6

expr_precedence6
= valueExprCaseWhen
/ expr_precedence5

expr_precedence5
= first:expr_precedence4 rest:( expr_rest_boolean_comparison )+
	{ return buildBinaryValueExpr(first, rest); }
/ expr_precedence4

expr_precedence4
= first:expr_precedence3 rest:( expr_rest_number_add )+
	{ return buildBinaryValueExpr(first, rest); }
/ expr_precedence3

expr_precedence3
= first:expr_precedence2 rest:( expr_rest_number_mul )+
	{ return buildBinaryValueExpr(first, rest); }
/ expr_precedence2

expr_precedence2
= expr_number_minus
/ expr_precedence1

expr_precedence1
= expr_boolean_negation
/ expr_precedence0

expr_precedence0
= valueExprConstants
/ valueExprCaseWhen
/ valueExprFunctionsNullary
/ valueExprFunctionsUnary
/ valueExprFunctionsBinary
/ valueExprFunctionsNary
/ valueExprColumn
/ '(' _ e:expr_precedence9 _ ')'
	{
		e.wrappedInParentheses = true;
		return e;
	}


RESERVED_KEYWORD = RESERVED_KEYWORD_RELALG

RESERVED_KEYWORD_RELALG
= 'pi'i
/ 'sigma'i
/ 'rho'i
/ 'tau'i
/ 'gamma'i
/ 'and'i
/ 'or'i
/ 'not'i
/ 'union'i
/ 'intersect'i
/ 'except'i
/ 'join'i
/ 'cross'i
/ 'join'i
/ 'left'i
/ 'right'i
/ 'outer'i
/ 'full'i
/ 'natual'i
/ 'semi'i
/ 'anti'i
/ 'desc'i
/ 'asc'i
/ 'case'i
/ 'when'i
/ 'then'i
/ 'else'i
/ 'end'i
/ 'true'i
/ 'false'i
/ 'null'i
