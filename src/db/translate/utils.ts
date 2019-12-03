type astNode = (
	relalgAst.relalgOperation
	| relalgAst.rootRelalg
	| sqlAst.rootSql
	| sqlAst.statement
	| sqlAst.sqlOperation
);

export function mapPostOrder<T extends astNode>(
	node: astNode,
	func: (n: astNode) => astNode,
): astNode {
	// let child: astNode | undefined = node.child;
	// let child2: astNode | undefined = node.child2;
	// let assignments: any[] | undefined = node.assignments;
	// let from: sqlAst.statement['from'] | undefined = node['from'];
	// let statement: sqlAst.relationFromSubstatement['statement'] | undefined = undefined;
	// 
	// let changed = false;

	// descent
	if (node.child !== undefined) {
		const child = mapPostOrder(node.child, func);

		if (child !== node.child) {
			node = Object.assign({}, node, { child });
		}
	}

	if (node.child2 !== undefined) {
		const child2 = mapPostOrder(node.child2, func);

		if (child2 !== node.child2) {
			node = Object.assign({}, node, { child2 });
		}
	}


	if (node.type === 'statement') {
		const from = mapPostOrder(node.from, func);

		if (from !== node.from) {
			node = Object.assign({}, node, { from });
		}
	}
	else if (node.type === 'relationFromSubstatement') {
		const statement = mapPostOrder(node.statement, func);

		if (statement !== node.statement) {
			node = Object.assign({}, node, { statement });
		}
	}
	else if (node.type === 'relalgRoot') {
		let changed = false;
		const assignments = node.assignments.map(a => {
			const x = mapPostOrder(a.child, func);

			if (x !== a.child) {
				changed = true;
				return {
					...a,
					child: x,
				};
			}
			else {
				return a;
			}
		});

		if (changed) {
			node = Object.assign({}, node, { assignments });
		}
	}
	else if (node.type === 'sqlRoot') {
		let changed = false;
		const assignments = node.assignments.map(a => {
			const x = mapPostOrder(a.child, func);

			if (x !== a.child) {
				changed = true;
				return {
					...a,
					child: x,
				};
			}
			else {
				return a;
			}
		});

		if (changed) {
			node = Object.assign({}, node, { assignments });
		}
	}

	const mapped = func(node);
	return mapped;
}

export function forEachPreOrder(
	node: relalgAst.astNode | sqlAst.astNode | relalgAst.GroupRoot,
	func: (node: relalgAst.astNode | sqlAst.astNode | relalgAst.Group | relalgAst.GroupRoot) => void,
	descentIntoAssignments: boolean = true,
): void {
	func(node);

	if (node.type === 'statement') {
		forEachPreOrder(node.from, func, descentIntoAssignments);
	}
	else if (node.type === 'relationFromSubstatement') {
		forEachPreOrder(node.statement, func, descentIntoAssignments);
	}

	if (typeof node.child !== 'undefined') {
		forEachPreOrder(node.child, func, descentIntoAssignments);
	}
	if (typeof node.child2 !== 'undefined') {
		forEachPreOrder(node.child2, func, descentIntoAssignments);
	}
	if (typeof node.assignments !== 'undefined' && descentIntoAssignments === true) {
		for (const a of node.assignments) {
			forEachPreOrder(a, func, descentIntoAssignments);
		}
	}
}
