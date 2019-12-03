/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode } from 'db/exec/RANode';
import * as i18n from 'i18next';
import * as Immutable from 'immutable';
import { ExecutionError } from '../exec/ExecutionError';
import { forEachPreOrder, mapPostOrder } from './utils';


type RelationPosition = {
	name: string,
	line: number,
	column: number,
};

// find all relations used in this branch (recursively)
function getRelationsIn(root: relalgAst.astNode | sqlAst.astNode, ignore?: Immutable.Set<string>): RelationPosition[] {
	const relations: RelationPosition[] = [];

	forEachPreOrder(root, node => {
		if (node.type === 'relation' && (ignore === undefined || ignore.has(node.name) === false)) {
			// replace
			relations.push({
				name: node.name,
				line: node.codeInfo.location.start.line,
				column: node.codeInfo.location.start.column,
			});
		}
	});

	return relations;
}

/**
 * replaces all variables with their definition in the assignments of a RA statement
 * @param root
 * @param predefinedRelations
 */
export function replaceVariables(
	root: relalgAst.rootRelalg | relalgAst.Group | sqlAst.rootSql,
	_predefinedRelations: Immutable.Map<string, RANode> | { [name: string]: RANode },
) {
	// root is the real root node! of a statement
	const predefinedRelations: Immutable.Map<string, RANode> = (
		Immutable.Map.isMap(_predefinedRelations)
			? _predefinedRelations
			: Immutable.Map<string, RANode>().withMutations(map => {
				for (const name of Object.keys(_predefinedRelations)) {
					map.set(name, _predefinedRelations[name]);
				}
			}).asImmutable()
	);

	if (root.assignments.length === 0) {
		return;
	}

	const variables: Map<string, {
		name: string,
		child: relalgAst.assignment['child'] | sqlAst.assignment['child'], // definition
		assignmentIndex: number,
		childRelations: RelationPosition[], // variables/relations used in definition
	}> = new Map();

	const variableNames = Immutable.Set<string>().withMutations(set => {
		// names of declared variables
		for (let i = 0; i < root.assignments.length; i++) {
			set.add(root.assignments[i].name);
		}
	});



	for (let i = 0; i < root.assignments.length; i++) {
		const assignment = root.assignments[i];
		const { name, child } = assignment;
		const childRelations: RelationPosition[] = getRelationsIn(assignment.child);

		if (predefinedRelations.has(name) || variables.has(name)) {
			const e = new ExecutionError(i18n.t('db.messages.translate.error-variable-name-conflict', { name }), assignment.codeInfo);
			throw e;
		}

		// save the origin of the node
		child.metaData = {
			...child.metaData,
			fromVariable: name,
		};

		variables.set(name, {
			name: name,
			child: child, // definition
			assignmentIndex: i,
			childRelations, // variables/relations used in definition
		});
	}


	// check for cycles with Depth-first search
	const visited = new Map<string, boolean>();
	const finished = new Map<string, boolean>();

	// initialize
	for (const [varName] of variables) {
		visited.set(varName, false);
		finished.set(varName, false);
	}


	const dfs = (varName: string) => {
		if (finished.get(varName) === true) {
			return;
		}
		if (visited.get(varName) === true) {
			throw new Error(i18n.t('db.messages.translate.error-variable-cyclic-usage', { name: varName }));
		}

		visited.set(varName, true);

		const variable = variables.get(varName);
		if (variable !== undefined) {
			const { childRelations } = variable;
			for (let i = 0; i < childRelations.length; i++) {
				dfs(childRelations[i].name);
			}
		}
		finished.set(varName, true);
	};

	// start dfs for all variables
	for (const [varName] of variables) {
		dfs(varName);
	}

	// => variables are cycle free


	// replace vars in the variables themselves (as they are tested to be cycle free)
	for (let [, i] of variables) {
		for (const [, j] of variables) {
			if (i.name === j.name) {
				// except it selves
				continue;
			}

			// replace all occurrence of var j in i by the definition of j
			const child = mapPostOrder(i.child, n => {
				if (n.type === 'relation' && n.name === j.name) {
					const newNode = {
						...j.child,

						// save the origin of the node
						metaData: {
							...j.child.metaData,
							fromVariable: j.name,
						},
					};
					return newNode;
				}
				else {
					return n;
				}
			}) as (typeof i)['child'];

			// update definition of i
			i = {
				...i,
				child,
			};
		}

		variables.set(i.name, i);
	}

	for (const [, i] of variables) {
		// update variables in root node
		root.assignments[i.assignmentIndex].child = i.child;
	}

	// replace vars in the roots child == the statement (if there is one)
	if (root.type === 'relalgRoot' || root.type === 'sqlRoot') {
		if (root.child !== null && typeof (root.child) !== 'undefined') {
			for (const [varName, variable] of variables) {
				// replace the usage of each variable by its definition

				root.child = mapPostOrder(root.child, n => {
					if (n.type === 'relation' && n.name === varName) {
						return {
							...variable.child,

							// save the origin of the node
							metaData: {
								...variable.child.metaData,
								fromVariable: varName,
							},
						};
					}
					else {
						return n;
					}
				}) as (typeof root)['child'];
			}
		}
	}
}
