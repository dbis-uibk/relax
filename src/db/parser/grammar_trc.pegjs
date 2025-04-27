{
  function createRelationPredicate(relation, variable) {
    return { type: 'RelationPredicate', relation, variable, codeInfo: getNodeInfo() };
  }

  function createPredicate(condition) {
    return { type: 'Predicate', condition, codeInfo: getCodeInfo() };
  }

  function createLogicalExpression(left, operator, right) {
    return { type: 'LogicalExpression', left, operator, right, codeInfo: getCodeInfo() };
  }

  function createQuantifiedExpression(quantifier, variable, formula) {
    return { type: 'QuantifiedExpression', quantifier, variable, formula, codeInfo: getCodeInfo() };
  }

  function createNegation(formula) {
    return { type: 'Negation', formula, codeInfo: getCodeInfo() };
  }

	function createTrcRoot(variables, formula, projections) {
    return { type: 'TRC_Expr', variables, formula, projections, codeInfo: getCodeInfo() };
	}

	function getCodeInfo() {
		return {
			location: location(),
			text: text()
		};
	}

	// builds a binary valueExpression (fills the args array)
	function buildBinaryValueExpr(first, rest) {
		// all members of rest have a member args in the form [undefined, child2]
		var root = rest[0];
		root.args[0] = first;
		root.codeInfo = getCodeInfo();

		var n;
		for (var i = 1; i < rest.length; i++) {
			n = rest[i];
			n.args[0] = root;
			n.codeInfo = getCodeInfo();
			root = n;
		}

		return root;
	}

	function getNodeInfo(nodeName){
		return {
			type: 'nodeInfo',
			name: nodeName,
			location: location(),
		};
	}
}

start
  = _ expr: TRC_Expr _
    {
      return expr
    }

dbDumpStart
  = dbDumpRoot

dbDumpRoot
  = a: all
    {
      return {
        type: 'groupRoot',
        groups: [],
        codeInfo: undefined,
      }
    }

all
  = chs: .*
    {
      return chs.join('')
    }

TRC_Expr
  = '{' _ proj: (listOfNamedColumnExpressions / listOfColumns)+ _ '|' _ formula:Formula _ '}' 
	{
		const nonUniquevariables = proj[0].flatMap(p => {
			if (p.type === 'namedColumnExpr' && p.child.func === 'columnValue') {
				return [p.child.args[1]]
			}
			if (p.type === 'namedColumnExpr') {
				return p.child.args.map(a => a.args[1])
			}
			return [p.relAlias ? p.relAlias : p.name]
		})
		.filter(v => v)
		.map(v => {
			if (typeof v === 'object' && v.type === 'valueExpr') {
				return v.args[1]
			}
			return v
		})

		const variables = [...new Set(nonUniquevariables)]
		return createTrcRoot(variables, formula, proj[0])
	}

Formula = LogicalExpression

LogicalExpression 
  = left:BaseFormula right:(_ LogicOp _ BaseFormula)*
    {
      return right.reduce((result, element) => {
        const op = element[1]
        return createLogicalExpression(result, op, element[3]);
      }, left);
    }

AtomicFormula
  = RelationPredicate
  / Predicate

BaseFormula 
  =	AtomicFormula 
  / not _ formula:BaseFormula
    {
      return createNegation(formula);
    }
  / '(' _ formula:Formula _ ')'
    {
      return formula;
    }
  / existentialQuantifier _ variable:Variable _ '(' _ formula:Formula _ ')'
    {
      return createQuantifiedExpression('exists', variable, formula);
    }
  / '(' _ existentialQuantifier _ variable:Variable  _ ')' _ '(' _ formula:Formula _ ')'
    {
      return createQuantifiedExpression('exists', variable, formula);
    }
  / universalQuantifier _ variable:Variable _ '(' _ formula:Formula _ ')'
    {
      return createQuantifiedExpression('forAll', variable, formula);
    }
  / '(' _ universalQuantifier _ variable:Variable _ ')' _ '(' _ formula:Formula _ ')'
    {
      return createQuantifiedExpression('forAll', variable, formula);
    }

RelationPredicate
  = relation:Relation _ '(' _ variable:Variable _ ')'
    {
      return createRelationPredicate(relation, variable);
    }
  / variable:Variable _ ('in'i / '∈') _ relation:Relation
    {
      return createRelationPredicate(relation, variable);
    }

Predicate
	= _ condition: valueExpr _
		{
			return createPredicate(condition)
		}

LogicOp
  = and
  / or
  / xor
  / implication
  / equivalence

Relation = relationName

Variable = variableName

existentialQuantifier
  = 'exists'i
  / '∃'

universalQuantifier
  = 'for all'i
  / '∀'

quantifier
  = existentialQuantifier
  / universalQuantifier


and 'logical AND'
  = ('and'i / '∧')
    {
      return 'and';
    }

or 'logical OR'
  = ('or'i	/ '∨')
    {
      return 'or';
    }

xor 'logical XOR'
  = ('xor'i / '⊻' / '⊕')
    {
      return 'xor';
    }

implication 'logical IMPLICATION'
  = ('implies'i / '=>' / '⇒')
    {
      return 'implies';
    }

equivalence 'logical BICONDITIONAL'
  = ('iff'i / '<=>' / '⇔')
    {
      return 'iff';
    }

not 'logical NOT'
  = _ ('not' / '!' / '¬') _

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

boolean
= 'true'i
	{ return true; }
/ 'false'i
	{ return false; }

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


EOF
= !.

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

variableName 'variableName'
= !(RESERVED_KEYWORD !([0-9a-zA-Z_]+)) a:$([a-zA-Z]+ $[0-9a-zA-Z_]*)
	{
		return a;
	}

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
/ relAlias:(relationName '.')? '[' _ index:$[0-9]+ _ ']'
	{
		if(relAlias != null)
			relAlias = relAlias[0];

		return {
			type: 'columnName',
			name: parseInt(index, 10),
			relAlias: relAlias
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

RESERVED_KEYWORD
= RESERVED_KEYWORD_RELALG
/ RESERVED_KEYWORDS_TRC
/ RESERVED_KEYWORDS_FUNCTIONS

RESERVED_KEYWORD_RELALG
= 'pi'i
/ 'sigma'i
/ 'rho'i
/ 'tau'i
/ 'gamma'i
/ 'and'i
/ 'or'i
/ 'xor'i
/ 'not'i
/ 'union'i
/ 'intersect'i
/ 'except'i
/ 'join'i
/ 'cross'i
/ 'left'i
/ 'right'i
/ 'outer'i
/ 'full'i
/ 'natural'i
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

RESERVED_KEYWORDS_TRC
= 'in'i
/ 'and'i
/ 'or'i
/ 'xor'i
/ 'not'i
/ 'implies'i
/ 'iff'i
/ 'exists'i
/ 'for all'i
/ 'case'i
/ 'when'i
/ 'then'i
/ 'else'i
/ 'end'i
/ 'true'i
/ 'false'i
/ 'null'i

RESERVED_KEYWORDS_FUNCTIONS
= 'coalesce'i
/ 'concat'i
/ 'upper'i
/ 'ucase'i
/ 'lower'i
/ 'lcase'i
/ 'length'i
/ 'strlen'i
/ 'like'i
/ 'ilike'i
/ 'rlike'i
/ 'regexp'i
/ 'repeat'i
/ 'replace'i
/ 'reverse'i
/ 'rand'i
/ 'rownum'i
/ 'add'i
/ 'sub'i
/ 'mul'i
/ 'div'i
/ 'mod'i
/ 'abs'i
/ 'round'i
/ 'floor'i
/ 'ceil'i
/ 'date'i
/ 'adddate'i
/ 'subdate'i
/ 'now'i
/ 'transaction_timestamp'i
/ 'statement_timestamp'i
/ 'clock_timestamp'i
/ 'year'i
/ 'month'i
/ 'day'i
/ 'dayofmonth'i
/ 'hour'i
/ 'minute'i
/ 'second'i
