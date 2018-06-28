type A = {
	a: number,
	b: never,
};
type B = {
	a: number,
	b: number,
};

type Union = A | B;

function fun(x: Union) {
	if (typeof x.b !== 'undefined') {
		console.log(x.b);
	}
}
