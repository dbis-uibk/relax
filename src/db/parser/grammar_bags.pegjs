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
	
	/** merges the codeInfo objects of a binary operation 
	 * it is assumed that the right node follows the left one
	 */
	function mergeCodeInfo(left, right){
		var out = {
			location: {
				start: left.location.start,
				end: right.location.end,
			},
			text: left.text + right.text,
		};
		
		// start = min of both ends
		if(left.location.end.offset <= right.location.start.offset === false){
			console.error("mergeCodeInfo: nodes not next to each other (+- whitespace): ", left, right);
		}
		
		return out;
	}
	
	function getNodeInfo(nodeName){
		return {
			type: 'nodeInfo',
			name: nodeName,
			location: location(),
		};
	}

	function checkAssignments(assignments){
		// check if the defined variable names are unique
		var tmp = {}, name;

		for(var i = 0; i < assignments.length; i++){
			name = assignments[i].name;
			if(tmp[name]){
				error(t('db.messages.parser.error-duplicate-variable', {name: name}));
			}

			tmp[name] = true;
		}
	};

	var inlineTableNum = 1;

	function buildBinary(first, rest){
		// all members of rest have a child2

		var root = rest[0];
		root.child = first;
		root.codeInfo = mergeCodeInfo(root.child.codeInfo, root.codeInfo);

		var n;
		for(var i = 1; i < rest.length; i++){
			n = rest[i];

			n.child = root;
			n.codeInfo = mergeCodeInfo(n.child.codeInfo, n.codeInfo);

			root = n;
		}

		return root;
	}

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

	// options.relationNames must be an array of strings
	// containing the names of the relations
	var usedRelationNames = options.relationNames || [];
	var operatorPositions = [];

	function checkGroupNamesUnique(groups){
		// check if the defined variable names are unique
		const tmp = {};

		for(let i = 0; i < groups.length; i++){
			const groupHeader = groups[i].headers.find(g => g.name === 'group');
			if(!groupHeader){
				continue;
				
			}
			const name = groupHeader.text;

			if(tmp[name]){
				error(t('db.messages.parser.error-group-non-unique-group-name', {name: name}));
			}

			tmp[name] = true;
		}
	};
}

start
= r:root
	{ return r; }

groupStart
= r:groupRoot
	{ return r; }


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
	{ return ''; }
/ '--' &(endOfLine / EOF)
	{ return ''; }
/ '--' [ \t] text:$(!endOfLine .)* &(endOfLine / EOF)
	{ return text; }

multiLineComment
= '/*' text:$(!'*/' .)* '*/'
	{ return text; }

__ 'whitespace' // normal whitespace
= (comment* [ \t\r\n]+ comment*)+
	{ return ''; }

_ 'optional whitespace'
= (comment / [ \t\r\n])*

__nc 'whitespace without comments'
= [\r\n\t ]+

_nc 'optional whitespace without comments'
= [\r\n\t ]*

__sl // single line whitespace
= (comment* [ \t]+ comment*)+
	{ return ''; }

_sl // single line optional whitespace
= (comment / [ \t])*
	{ return ''; }

string 'string'
= '\'' a:$[^'\n]* '\''
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

dateIso 'date in ISO format (YYYY-MM-DD)'
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

boolean
= 'true'i
	{ return true; }
/ 'false'i
	{ return false; }

assignmentOperator
= _ '=' _

testQueryOperator
= _ '-' _

relationName 'relationName'
= !(RESERVED_KEYWORD !([0-9a-zA-Z_]+)) a:$([a-zA-Z]+ $[0-9a-zA-Z_]*)
	{
		return a;
	}


unqualifiedColumnName
= !(RESERVED_KEYWORD !([0-9a-zA-Z_]+)) a:$([a-zA-Z]+ $[0-9a-zA-Z_]*)
	{
		return a;
	}

columnName
= relAlias:(relationName '.')? name:unqualifiedColumnName
	{
		if(relAlias != null)
			relAlias = relAlias[0];

		return {
			type: 'columnName',
			name: name,
			relAlias: relAlias
		};
	}
/ relAlias:(relationName '.')? '[' index:$[0-9]+ ']'
	{
		if(relAlias != null)
			relAlias = relAlias[0];

		return {
			type: 'columnName',
			name: parseInt(index, 10),
			relAlias: relAlias
		};
	}

// operator names:
delta
= _ o:('∂' { return getNodeInfo('delta'); }) _
	{ return o; }
/ _ o:('delta'i { return getNodeInfo('delta'); }) __
	{ return o; }

pi
= _ o:('π' { return getNodeInfo('pi'); }) _
	{ return o; }
/ _ o:('pi'i { return getNodeInfo('pi'); }) __
	{ return o; }

sigma
= _ o:('σ' { return getNodeInfo('sigma'); }) _
	{ return o; }
/ _ o:('sigma'i { return getNodeInfo('sigma'); }) __
	{ return o; }

rho
= _ o:('ρ' { return getNodeInfo('rho'); }) _
	{ return o; }
/ _ o:('rho'i { return getNodeInfo('rho'); }) __
	{ return o; }

arrowLeft
= _ o:('←' { return getNodeInfo('arrowLeft'); }) _
	{ return o; }
/ _ o:('<-' { return getNodeInfo('arrowLeft'); }) _
	{ return o; }

arrowRight
= _ o:('→' { return getNodeInfo('arrowRight'); }) _
	{ return o; }
/ _ o:('->' { return getNodeInfo('arrowRight'); }) _
	{ return o; }

psi
= _ o:('ψ' { return getNodeInfo('psi'); }) _
	{ return o; }
/ _ o:('psi'i { return getNodeInfo('psi'); }) __
	{ return o; }

tau
= _ o:('τ' { return getNodeInfo('tau'); }) _
	{ return o; }
/ _ o:('tau'i { return getNodeInfo('tau'); }) __
	{ return o; }

gamma
= _ o:('γ' { return getNodeInfo('gamma'); }) _
	{ return o; }
/ _ o:('gamma'i { return getNodeInfo('gamma'); }) __
	{ return o; }


unionOperator
= _ o:('∪' { return getNodeInfo('unionOperator'); }) _
	{ return o; }
/ __ o:('union'i { return getNodeInfo('unionOperator'); }) __
	{ return o; }

intersectOperator
= _ o:('∩' { return getNodeInfo('intersectOperator'); }) _
	{ return o; }
/ __ o:('intersect'i { return getNodeInfo('intersectOperator'); }) __
	{ return o; }

divisionOperator
= _ o:(('÷' / '/') { return getNodeInfo('divisionOperator'); }) _
	{ return o; }

differenceOperator
= _ o:(('-' / '\\') { return getNodeInfo('differenceOperator'); }) _
	{ return o; }
/ __ o:('except'i { return getNodeInfo('differenceOperator'); }) __
	{ return o; }

crossJoinOperator
= _ o:(('⨯' / 'x') { return getNodeInfo('crossJoinOperator'); }) __?
	{ return o; }
/ __ o:(('cross'i __ 'join'i) { return getNodeInfo('crossJoinOperator'); }) __
	{ return o; }

innerJoinOperator
= _ o:(('⨝' / '⋈') { return getNodeInfo('innerJoinOperator'); }) _
	{ return o; }
/ __ o:((('inner'i __)? 'join'i) { return getNodeInfo('innerJoinOperator'); }) __
	{ return o; }

naturalJoinOperator
= _ o:(('⨝' / '⋈') { return getNodeInfo('naturalJoinOperator'); }) _
	{ return o; }
/ __ o:((('natural'i __)? 'join'i) { return getNodeInfo('naturalJoinOperator'); }) __
	{ return o; }

leftSemiJoinOperator
= _ o:('⋉' { return getNodeInfo('leftSemiJoinOperator'); }) _
	{ return o; }
/ __ o:(('left'i __ 'semi'i __ 'join'i) { return getNodeInfo('leftSemiJoinOperator'); }) __
	{ return o; }

rightSemiJoinOperator
= _ o:('⋊' { return getNodeInfo('rightSemiJoinOperator'); }) _
	{ return o; }
/ __ o:(('right'i __ 'semi'i __ 'join'i) { return getNodeInfo('rightSemiJoinOperator'); }) __
	{ return o; }

antiJoinOperator
= _ o:('▷' { return getNodeInfo('antiJoinOperator'); }) _
	{ return o; }
/ __ o:(('anti'i (__ 'semi'i)? __ 'join'i) { return getNodeInfo('antiJoinOperator'); }) __
	{ return o; }

leftOuterJoinOperator
= _ o:('⟕' { return getNodeInfo('leftOuterJoinOperator'); }) _
	{ return o; }
/ __ o:(('left'i (__ 'outer'i)? __ 'join'i) { return getNodeInfo('leftOuterJoinOperator'); }) __
	{ return o; }

rightOuterJoinOperator
= _ o:('⟖' { return getNodeInfo('rightOuterJoinOperator'); }) _
	{ return o; }
/ __ o:(('right'i (__ 'outer'i)? __ 'join'i) { return getNodeInfo('rightOuterJoinOperator'); }) __
	{ return o; }

fullOuterJoinOperator
= _ o:('⟗' { return getNodeInfo('fullOuterJoinOperator'); }) _
	{ return o; }
/ __ o:(('full'i (__ 'outer'i)? __ 'join'i) { return getNodeInfo('fullOuterJoinOperator'); }) __
	{ return o; }







// arguments

// a assignment: e.g. $x := expression
assignment
= n:relationName !{ usedRelationNames.push(n); } assignmentOperator e:expression
	{
		e.assignmentName = n;
		return {
			type: 'assignment',
			name: n,
			child: e,

			codeInfo: getCodeInfo()
		};
	}


namedColumnExpr
= a:valueExpr arrowRight dst:unqualifiedColumnName
	{
		return {
			type: 'namedColumnExpr',
			name: dst,
			relAlias: null,
			child: a,

			codeInfo: getCodeInfo()
		};
	}
/ dst:unqualifiedColumnName arrowLeft a:valueExpr
	{
		return {
			type: 'namedColumnExpr',
			name: dst,
			relAlias: null,
			child: a,

			codeInfo: getCodeInfo()
		};
	}
/ a:columnName
	{
		return a;
	}

// list of columns (kd.id, kd.name, test) e.g. for the projection
listOfNamedColumnExpressions
= a:namedColumnExpr b:(_ ',' _ namedColumnExpr)*
	{
		var t = [a];
		if(b !== null){
			for(var i in b){
				t.push(b[i][3]);
			}
		}
		return t;
	}

// list of columns (kd.id, kd.name, test) e.g. or the group by
listOfColumns
= a:columnName b:(_ ',' _ columnName)*
	{
		var t = [a];
		if(b !== null){
			for(var i in b){
				t.push(b[i][3]);
			}
		}
		return t;
	}

// e.g. "a.newName <- a.oldName" for the renaming of columns
colAssignment
= dst:unqualifiedColumnName arrowLeft src:columnName
	{
		return {
			type: 'colAssignment',
			src: src,
			dst: dst,

			codeInfo: getCodeInfo()
		};
	}
/ src:columnName arrowRight dst:unqualifiedColumnName
	{
		return {
			type: 'colAssignment',
			src: src,
			dst: dst,

			codeInfo: getCodeInfo()
		};
	}

listOfColAssignments
= a:colAssignment b:(_ ',' _ colAssignment)*
{
	var t = [a];
	if(b !== null){
		for(var i in b){
			t.push(b[i][3]);
		}
	}
	return t;
}

orderDirection
= 'asc'i
	{ return true; }
/ 'desc'i
	{ return false; }

orderByArg
= a:columnName asc:(__ orderDirection)?
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
	if(b !== null){
		for(var i in b){
			t.push(b[i][3]);
		}
	}
	return t;
}


aggFunction
= func:$('sum'i / 'count'i / 'avg'i / 'min'i / 'max'i) '(' _ col:columnName _ ')'
	{
		return {
			aggFunction: func.toUpperCase(),
			col: col
		};
	}
/ 'count(*)'i
	{
		return {
			aggFunction: 'COUNT_ALL',
			col: null
		};
	}

aggFunctionArgument
= func:aggFunction arrowRight name:unqualifiedColumnName
	{
		func.name = name;
		return func;
	}
/ name:unqualifiedColumnName arrowLeft func:aggFunction
	{
		func.name = name;
		return func;
	}

listOfAggFunctionArguments
= a:aggFunctionArgument b:(_ ',' _ aggFunctionArgument)*
	{
		var t = [a];
		if(b !== null){
			for(var i in b){
				t.push(b[i][3]);
			}
		}
		return t;
	}

booleanExprWithTrailingWhitspace
= a:booleanExpr __ &{
		/*
		if the expression is only a single unqualified column
		it could also be a relation and should not have been interpreted
		as an expression

		therefore the name of the "column" is checked against all known
		relation-names; if it matches the whole `booleanExprWithTrailingWhitspace` match fails

		if there is a boolean column that should form the whole expression
		the user has to wrap it in parentheses
		*/
		if(a.type === 'valueExpr' && a.func === 'columnValue' && !a.wrappedInParentheses && a.args[1] === null){
			for(var i = 0; i < usedRelationNames.length; i++){
				if(usedRelationNames[i] === a.args[0]){
					return false;
				}
			}
			// not found in the known relations; seems to be a column
			return true;
		}
		return true;
	}
	{ return a; }




// nodes:

// multiple (optional) assignments followed by a expression (using the variables)
root
= _ a2:(assignment __?)* a:assignment _ //toDo: checken, ob whitespace zwingend nötig oder nicht
	{
		var assignments = [a];
		for(var i in a2){
			assignments.push(a2[i][0]);
		}
		checkAssignments(assignments);

		return {
			type: 'relalgRoot',
			assignments: assignments,
			child: null,
			operatorPositions: operatorPositions,

			codeInfo: getCodeInfo()
		};
	}
/ _ a:(assignment __?)* e:expression? _ //toDo: checken, ob whitespace zwingend nötig oder nicht
	{
		var assignments = [];
		for(var i = 0; i < a.length; i++){
			assignments.push(a[i][0]);
		}
		checkAssignments(assignments);

		return {
			type: 'relalgRoot',
			assignments: assignments,
			child: e,
			operatorPositions: operatorPositions,

			codeInfo: getCodeInfo()
		};
	}

groupRoot
= _nc a:(_nc tableGroup)+ _nc
	{
		var groups = [];
		
		for(var i = 0; i < a.length; i++){
			groups.push(a[i][1]);
		}
		checkGroupNamesUnique(groups);

		return {
			type: 'Root',
			groups: groups,

			codeInfo: getCodeInfo()
		};
	}

tableGroupHeaders
= a:tableGroupHeader b:(__? tableGroupHeader)* //toDo: checken, ob whitespace zwingend nötig oder nicht
	{
		var headers = [];
		
		headers.push(a);

		b.map(function(e){
			var header = e[1];

			headers.push(header);
		});

		return headers;
	}

isoLanguageCode 
= 'en'
/ 'de'
/ 'es'
/ lang:$([a-zA-Z][a-zA-Z])
	{
		return lang.toLocalLowerCase();
	}


exampleSql
 = a:('exampleSql' + ' - {') query:$[0-9 * a-z A-Z ( ) \n = . , ; - / \t]+ '}'
{
	return query;
}  


exampleQueryRelAlg
 = ('exampleRelAlg' + ' - {') query:$[0-9 * a-z A-Z ( ) \n = . , ; - / \t]+ '}'
{
	return query;
}  

tableGroupHeader
= &([a-z@]+ ':') name:$[a-z]+ lang:('@' isoLanguageCode)? ':' text:$(!(endOfLine) .)*
	{
		return {
			name: name,
			lang: !lang ? null : lang[1],
			text: text,
		};
	}
/ &([a-z@]+ '[[') name:$[a-z]+ lang:('@' isoLanguageCode)? '[[' text:$('\\]]' / (!(']]') .))* ']]'
	{
		

		text = text.replace(/\\]]/g, ']]');
		text = text.replace(/\\\\]]/g, '\\]]');

		return {
			name: name,
			lang: !lang ? null : lang[1],
			text: text,
		};
	}

tableGroup
= _ headers:tableGroupHeaders s:(__? exampleSql)* r:(__? exampleQueryRelAlg)* a:(__? assignment)+ //toDo: checken, ob whitespace zwingend nötig oder nicht
	{
	
	
		var assignments = [];
		for(var i = 0; i < a.length; i++){
			assignments.push(a[i][1]);
		}
		checkAssignments(assignments);

		// check headers
		for(let i = 0; i < headers.length; i++){
			const header = headers[i];

			if(
				header.name !== 'group' 
				&& header.name !== 'description'
				&& header.name !== 'category'
			){
				error(t('db.messages.parser.error-group-unknown-header', {name: header.name}));
			}

			// check for duplicates (O(n^2))
			for(let j = 0; j < headers.length; j++){
				if(i !== j && header.name === headers[j].name && header.lang === headers[j].lang){
					console.warn(`duplicate header found: ${header.name}`, headers, text());
					error(t('db.messages.parser.error-group-duplicate-header', {name: header.name}));
				}
			}
		}

		const groupHeader = headers.find(h => h.name === 'group');
		if(groupHeader === undefined){
			error(t('db.messages.parser.error-group-header-name-missing')+': "group: ..........\\n"');
		}
		else if(groupHeader.text.trim().length === 0){
			error(t('error-group-header-name-empty'));
		}

		// check for exampleSql
		let exampleSql = '';
		if(s && s.length > 0) {
			if(Array.isArray(s)) {
				exampleSql = s[0][1]
			}
		}
		exampleSql = exampleSql.trim();
		
		// check for exampleRelAlg
		let exampleRelAlg = '';
		if(r && r.length > 0) {
    	if(Array.isArray(r)) {
    			exampleRelAlg = r[0][1]
    	}
    }
		exampleRelAlg = exampleRelAlg.trim();
		

		return {
			type: 'tableGroup',
			headers: headers,
			assignments: assignments,
			exampleSql: exampleSql,
			exampleRA: exampleRelAlg,
			codeInfo: getCodeInfo()
		};
	}


/*
precedence: (low to high)

4: union, difference
3: intersect
2: crossJoin, thetaJoin, naturalJoin, leftOuterJoin, rightOuterJoin, fullOuterJoin, leftSemiJoin, rightSemiJoin, antiJoin, division
1: eliminateDuplicates, projection, selection, renameColumns, renameRelation, groupBy, orderBy
0: table, relation, ( ex )
*/


expression
= expression_precedence4

expression_precedence4
= first:expression_precedence3 rest:(
	union
	/ difference
)+
	{ return buildBinary(first, rest); }
/ expression_precedence3


expression_precedence3
= first:expression_precedence2 rest:(
	intersect
)+
	{ return buildBinary(first, rest); }
/ expression_precedence2


expression_precedence2
= first:expression_precedence1 rest:(
	crossJoin
	/ thetaJoin
	/ naturalJoin
	/ leftOuterJoin
	/ rightOuterJoin
	/ fullOuterJoin
	/ leftSemiJoin
	/ rightSemiJoin
	/ antiJoin
	/ division
)+
	{ return buildBinary(first, rest); }
/ expression_precedence1


expression_precedence1
= orderBy
/ groupBy
/ renameRelation
/ renameColumns
/ selection
/ projection
/ eliminateDuplicates
/ expression_precedence0

expression_precedence0
= table
/ relation
/ '(' _ e:expression_precedence4 _ ')'
	{
		e.wrappedInParentheses = true;
		return e;
	}


intersect
= o:intersectOperator c:expression_precedence2
	{
		operatorPositions.push(o);
		return {type: 'intersect', child2: c, codeInfo: getCodeInfo()};
	}


union
= o:unionOperator c:expression_precedence3
	{
		operatorPositions.push(o);
		return {type: 'union', child2: c, codeInfo: getCodeInfo()};
	}

difference
= o:differenceOperator c:expression_precedence3
	{
		operatorPositions.push(o);
		return {type: 'difference', child2: c, codeInfo: getCodeInfo()};
	}


crossJoin
= o:crossJoinOperator c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'crossJoin', child2: c, codeInfo: getCodeInfo()};
	}

thetaJoin
= o:innerJoinOperator a:booleanExprWithTrailingWhitspace c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'thetaJoin', child2: c, arg:a, codeInfo: getCodeInfo()};
	}

naturalJoin
= o:naturalJoinOperator c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'naturalJoin', child2: c, codeInfo: getCodeInfo()};
	}

leftOuterJoin
= o:leftOuterJoinOperator a:booleanExprWithTrailingWhitspace? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'leftOuterJoin', child2: c, arg:a, codeInfo: getCodeInfo()};
	}

rightOuterJoin
= o:rightOuterJoinOperator a:booleanExprWithTrailingWhitspace? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'rightOuterJoin', child2: c, arg:a, codeInfo: getCodeInfo()};
	}

fullOuterJoin
= o:fullOuterJoinOperator a:booleanExprWithTrailingWhitspace? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'fullOuterJoin', child2: c, arg:a, codeInfo: getCodeInfo()};
	}

leftSemiJoin
= o:leftSemiJoinOperator c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'leftSemiJoin', child2: c, codeInfo: getCodeInfo()};
	}

rightSemiJoin
= o:rightSemiJoinOperator c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'rightSemiJoin', child2: c, codeInfo: getCodeInfo()};
	}

antiJoin
= o:antiJoinOperator  a:booleanExprWithTrailingWhitspace? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'antiJoin', child2: c, arg:a, codeInfo: getCodeInfo()};
	}

division
= o:divisionOperator c:expression_precedence1
	{
		operatorPositions.push(o);
		return {type: 'division', child2: c, codeInfo: getCodeInfo()};
	}








eliminateDuplicates
= o:delta __? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'eliminateDuplicates',
			child: c,
			codeInfo: getCodeInfo(),
		};
	}

projection
= o:pi a:listOfNamedColumnExpressions __? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'projection',
			child: c,
			arg: a,
			codeInfo: getCodeInfo(),
		};
	}

selection
= o:sigma a:booleanExpr __? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'selection',
			child: c,
			arg: a,
			codeInfo: getCodeInfo(),
		};
	}

renameColumns
= o:rho a:listOfColAssignments __? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'renameColumns',
			child: c,
			arg: a,
			codeInfo: getCodeInfo(),
		};
	}

renameRelation
= o:rho a:relationName __? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'renameRelation',
			child: c,
			newRelAlias: a,
			codeInfo: getCodeInfo(),
		};
	}

//toDo: __? oder nicht?
groupBy
= o:gamma arg:listOfColumns _ ';' _ arg2:listOfAggFunctionArguments __? c:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'groupBy',
			child: c,
			group: arg,
			aggregate: arg2,
			codeInfo: getCodeInfo(),
		};
	}
/ o:gamma (_ ';')? _ arg2:listOfAggFunctionArguments __? child:expression_precedence1
	{
		operatorPositions.push(o);
		return {
			type: 'groupBy',
			child: child,
			group: [],
			aggregate: arg2,
			codeInfo: getCodeInfo(),
		};
	}

orderBy
= o:tau a:listOfOrderByArgs __? c:expression_precedence1 //toDo: __? oder nicht?
	{
		operatorPositions.push(o);
		return {
			type: 'orderBy',
			child: c,
			arg: a,
			codeInfo: getCodeInfo(),
		};
	}

relation
= a:relationName
	{
		return {
			type: 'relation',
			name: a,
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
= comparisonOperatorEquals
/ comparisonOperatorNotEquals

comparisonOperatorEquals
= '='

comparisonOperatorNotEquals
= ('!=' / '≠' / '<>')
	{ return '!='; }

comparisonOperatorGreaterEquals
= ('>=' / '≥')
	{ return '>='; }

comparisonOperatorGreater
= '>'

comparisonOperatorLesserEquals
= ('<=' / '≤')
	{ return '<='; }

comparisonOperatorLesser
= '<'

and 'logical AND'
= __ 'and'i __
/ _ '∧' _

xor 'logical XOR'
= __ 'xor'i __
/ _ ('⊻' / '⊕') _

or 'logical OR'
= __ 'or'i __
/ _ '∨' _

not 'logical NOT'
= _ ('!' / '¬') _







/* this is a syntax for a constant table


*/

tableDelimiter 'delimiter'
= _sl ',' _sl
/ _sl ';' _sl
/ __sl

tableColumnName
= col:columnName type:(':' ('string'i / 'number'i / 'date'i / 'boolean'i))?
	{
		return {
			name: col.name,
			relAlias: col.relAlias,
			type: type === null ? null : type[1].toLowerCase()
		};
	}

tableValue
= v:dateIso
	{
		return {
			type: 'date',
			value: v
		};
	}
/ ('null' / 'NULL')
	{
		return {
			type: 'null',
			value: null
		};
	}
/ a:boolean &(tableDelimiter / endOfLine / '}')
	{
		return {
			type: 'boolean',
			value: a,
			quoted: false
		};
	}
/ a:$[\-_a-z0-9\.]i+ /* simple strings and numbers */
	{
		return {
			type: 'string',
			value: a,
			quoted: false
		};
	}
/ "'" a:$[^'\n]* "'"
	{
		return {
			type: 'string',
			value: a,
			quoted: true
		};
	}
/ '"' a:$[^"\n]* '"'
	{
		return {
			type: 'string',
			value: a,
			quoted: true
		};
	}


tableHeader
= a:tableColumnName b:(tableDelimiter tableColumnName)*
	{
		var cols = [a];
		var newCol;
		for(var i = 0; i < b.length; i++){
			newCol = b[i][1];

			// attributes must be unique
			for(var j = 0; j < cols.length; j++){
				if(cols[j].name == newCol.name && cols[j].relAlias == newCol.relAlias){
					var n = newCol.relAlias == null ? '' : newCol.relAlias+'.';
					error(t('db.messages.parser.error-group-non-unique-attribute', {name: n+newCol.name, index: i+2}));
				}
			}

			cols.push(newCol);
		}

		return cols;
	}

tableRow
= a:tableValue b:(tableDelimiter tableValue)*
	{
		var t = [a];
		for(var i = 0; i < b.length; i++){
			t.push(b[i][1]);
		}

		return t;
	}

tableDum
= '{' _ '}' // relation of degree zero and cardinality zero
	{
		return {
			type: 'table',
			name: '_inlineRelation'+(inlineTableNum++),
			columns: [],
			rows: [],

			codeInfo: getCodeInfo()
		};
	}

tableDee
= '{' _ '(' _ ')' _ '}' // relation of degree zero and cardinality one
	{
		return {
			type: 'table',
			name: '_inlineRelation'+(inlineTableNum++),
			columns: [],
			rows: [[]],

			codeInfo: getCodeInfo()
		};
	}

table
= tableDum
/ tableDee
/ '{' _ cols:tableHeader _sl trows:(endOfLine _ tableRow _sl)* _ '}'
	{
		var numCols = cols.length;

		var rows = [], row, val, newRow;
		for(var i = 0; i < trows.length; i++){
			row = trows[i][2];

			if(row.length != numCols)
				error('expected '+numCols+' columns in row '+(i+1)+' but '+row.length+' found');

			// check types
			newRow = new Array(numCols); // for blank data only
			for(var j = 0; j < numCols; j++){
				val = row[j];

				if(val.type === 'null'){
					newRow[j] = null;
					continue;
				}

				// type not defined yet: define column type by first not null value
				if(cols[j].type === null){
					if(val.type == 'date')
						cols[j].type = 'date';
					else if(val.type == 'boolean')
						cols[j].type = 'boolean';
					else if(val.type == 'number' || val.value.match(/^-?[0-9]+(\.[0-9]+)?$/) && !val.quoted)
						cols[j].type = 'number';
					else if(val.type == 'string')
						cols[j].type = 'string';
				}

				switch(cols[j].type){
					case 'date':
						if(val.type !== 'date'){
							error('no valid date in row '+(i+1)+' column '+(j+1));
						}
						newRow[j] = val.value;
						break;

					case 'number':
						if(val.type === 'number'){
							newRow[j] = val.value;
						}
						else if(val.value.match(/^-?[0-9]+$/)){
							newRow[j] = parseInt(val.value, 10);
						}
						else if(val.value.match(/^-?[0-9]+\.[0-9]+$/)){
							newRow[j] = parseFloat(val.value);
						}
						else{
							error('no number in row '+(i+1)+' column '+(j+1) + '; found: "'+val.value+'"');
						}
						break;

					case 'string':
						newRow[j] = val.value.toString();
						break;

					case 'boolean':
						newRow[j] = val.value;
						break;

					default:
						throw new Error('should not happen: '+cols[j].type);
				}
			}

			rows.push(newRow);
		}

		// check if types are set for all columns (could be missing if table has no rows or only null values in a column)
		for(var i = 0; i < numCols; i++){
			if(cols[i].type === null){
				error('type for column '+cols[i].name+' must be set explicitly');
			}
		}


		return {
			type: 'table',
			name: '_inlineRelation'+(inlineTableNum++),
			columns: cols,
			rows: rows,

			codeInfo: getCodeInfo()
		};
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
/ _ o:('like'i / 'ilike'i) _ right:valueExprConstants
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
)
'(' _ arg0:valueExpr _ argn:(',' _ valueExpr _ )* ')'
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
)
'(' _ arg0:valueExpr _ ',' _ arg1:valueExpr _ ')'
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
'(' _ arg0:valueExpr _ ')'
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
'(' _ ')'
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
5: = (comparison), >=, >, <=, <, <>, !=, IS, LIKE
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
= 'delta'i
/ 'pi'i
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

