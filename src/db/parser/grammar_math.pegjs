/*
* Classic example grammar, which recognizes simple arithmetic expressions like
* "2*(3+4)". The parser generated from this grammar then computes their value.
*/
{
	function cloneObj(obj){
		return JSON.parse(JSON.stringify(obj));
	}
	
	function buildBinary(type, first, rest, childIndex, args){
		var root = {
			type: type,
			child: first,
			child2: null
		};
		
		for(var i = 0; i < rest.length; i++){
			root.child2 = rest[i][childIndex];
			
			if(args){
				for(var name in args){
					root[name] = rest[i][ args[name] ];
				}
			}
			
			
			if(i === rest.length-1)
				continue; // last element
			
			
			
			root = {
				type: type,
				child: root,
				child2: null
			};
		}
		
		return root;
	}
	
	function buildUnary(type, first, firstArgs){
		var root = {
			type: type,
			child: first
		};
		
		if(firstArgs){
			for(var name in firstArgs){
				root[name] = rest[i][ firstArgs[name] ];
			}
		}
		return root;
	}
}

/* precedence 
3: +, -
2: *, /, %
1: - 
0: primary
*/


start
= precedence_3

precedence_3
= first:precedence_2 rest:(
        (a:'+' b:precedence_2 {return [a, b, 'add'];})
        / (a:'-' b:precedence_2 {return [a, b, 'sub'];})
    )+
{
	return buildBinary(null, first, rest, 1, {type: 2});
}
/ precedence_2

precedence_2
= first:precedence_1 rest:(
        (a:'*' b:precedence_1 {return [a, b, 'mul'];})
        / (a:'/' b:precedence_1 {return [a, b, 'div'];})
        / (a:'%' b:precedence_1 {return [a, b, 'mod'];})
    )+
{
	return buildBinary(null, first, rest, 1, {type: 2});
}
/ precedence_1


precedence_1
= negation
/ precedence_0


negation
= '-' first:precedence_0
{
	return buildUnary('neg', first);
}

precedence_0
= integer
/ "(" a:precedence_3 ")" { return a; }

integer "integer"
= digits:$([0-9]+) { return parseInt(digits, 10); } 
