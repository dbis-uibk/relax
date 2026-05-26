/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { CodeInfo } from '../exec/CodeInfo';
import { Column } from '../exec/Column';
import { Difference } from '../exec/Difference';
import { Division } from '../exec/Division';
import { ExecutionError } from '../exec/ExecutionError';
import { AggregateFunction, GroupBy } from '../exec/GroupBy';
import { Intersect } from '../exec/Intersect';
import { AntiJoin } from '../exec/joins/AntiJoin';
import { CrossJoin } from '../exec/joins/CrossJoin';
import { FullOuterJoin } from '../exec/joins/FullOuterJoin';
import { InnerJoin } from '../exec/joins/InnerJoin';
import { JoinCondition } from '../exec/joins/Join';
import { LeftOuterJoin } from '../exec/joins/LeftOuterJoin';
import { RightOuterJoin } from '../exec/joins/RightOuterJoin';
import { SemiJoin } from '../exec/joins/SemiJoin';
import { OrderBy } from '../exec/OrderBy';
import { Projection, ProjectionColumn } from '../exec/Projection';
import { RANode } from '../exec/RANode';
import { Relation } from '../exec/Relation';
import { RenameColumns } from '../exec/RenameColumns';
import { RenameRelation } from '../exec/RenameRelation';
import { Schema } from '../exec/Schema';
import { Selection } from '../exec/Selection';
import { Union } from '../exec/Union';
import * as ValueExpr from '../exec/ValueExpr';
import { EliminateDuplicates } from '../exec/EliminateDuplicates';

function parseJoinCondition(condition: relalgAst.booleanExpr | string[] | null): JoinCondition {
	if (condition === null) {
		return {
			type: 'natural',
			restrictToColumns: null,
		};
	}
	else if (Array.isArray(condition)) {
		return {
			type: 'natural',
			restrictToColumns: (condition as string[]),
		};
	}
	else {
		return {
			type: 'theta',
			joinExpression: recValueExpr(condition as relalgAst.booleanExpr),
		};
	}
}


// translate a TRC-AST to RA
export function relalgFromTRCAstRoot(astRoot: trcAst.TRC_Expr | null, relations: { [key: string]: Relation }): RANode {
	type DataType = 'string' | 'boolean' | 'number' | 'null' | 'date'
	function makeValueExpr(datatype: DataType, func: relalgAst.ValueExprFunction, args: any[]): relalgAst.valueExpr {
		return {
			type: 'valueExpr',
			datatype,
			func,
			args,
			codeInfo: null as any
		}
	}

	function makeBooleanExpr(func: relalgAst.ValueExprFunction, args: any[]) {
		return makeValueExpr('boolean', func, args)
	}

	function checkUnboundRelationPredicates(root: any) {
		const allRelPredicates = getAllRelationPredicates(root)
		const tupleVariables = getAllTupleVariables(root)

		// Create a Set with all variables used in relation predicates
		const declaredVariables = new Set(allRelPredicates.map((p: any) => p.variable))

		// If there is at least one unbound variable, throw an error
		const hasUnboundVariable = tupleVariables.some(v => !declaredVariables.has(v))


		if (hasUnboundVariable) {
			throw new ExecutionError(i18n.t('db.messages.translate.error-trc-unbound-variable'));
		}
	}

	function getAllTupleVariables(root: any) {
		let vars: string[] = []

		function rec(root: any) {
			switch (root.type) {
				case 'TRC_Expr': {
					vars.push(...root.variables)
					return rec(root.formula)
				}
				case 'RelationPredicate': return 
				case 'Negation': return rec(root.formula)
				case 'QuantifiedExpression': {
					vars.push(root.variable)
					return rec(root.formula)
				}
				case 'LogicalExpression': {
					rec(root.left)
					rec(root.right)
					return
				}
				default: return null
			}
		}
		
		rec(root)

		return vars
	}

	function getAllRelationPredicates(root: any) {
		let relPreds: any = []

		function rec(root: any) {
			switch (root.type) {
				case 'TRC_Expr': return rec(root.formula)
				case 'RelationPredicate': {
					relPreds.push(root)
					return null
				}
				case 'Negation': return rec(root.formula)
				case 'QuantifiedExpression': return rec(root.formula)
				case 'LogicalExpression': {
					rec(root.left)
					rec(root.right)
					return
				}
				default: return null
			}
		}
		
		rec(root)

		return relPreds
	}

	function getRelationPredicate(root: any, tupleVar: string, scopeChanges = 0): trcAst.RelationPredicate | null {
		// NOTE: this represents that the scope has changed, so it doesn't make sense to keep searching
		if (scopeChanges >= 2) {
			return null
		}

		switch (root.type) {
			case 'TRC_Expr': return getRelationPredicate(root.formula, tupleVar, ++scopeChanges)
			case 'RelationPredicate': {
				if (!tupleVar || root.variable === tupleVar) {
					return root
				}
				return null
			}
			case 'Negation': return getRelationPredicate(root.formula, tupleVar, scopeChanges)
			case 'QuantifiedExpression': return getRelationPredicate(root.formula, tupleVar, ++scopeChanges)
			case 'LogicalExpression': {
				const left = getRelationPredicate(root.left, tupleVar, scopeChanges)
				const right = getRelationPredicate(root.right, tupleVar, scopeChanges)

				// NOTE: if more than one relationPredicate was encountered
				if (left && right) {
					throw new ExecutionError(
						i18n.t('db.messages.translate.error-relation-predicate-defined-twice',
						{ variable: right.variable }),
						right.codeInfo
					);
				}

				return left ?? right
			}
			default: return null
		}
	}

	const and = (left: any, right: any) => ({
		type: 'LogicalExpression',
		left,
		operator: 'and',
		right
	})

	const or = (left: any, right: any) => ({
		type: 'LogicalExpression',
		left,
		operator: 'or',
		right
	})

	const not = (formula: any) => ({
		type: 'Negation',
		formula
	})

	function handleRenameRelation(nRaw: any, variable: string): RANode {
		const relationPredicate = getRelationPredicate(nRaw, variable)
		if (!relationPredicate) {
			throw new ExecutionError(
				i18n.t('db.messages.translate.error-relation-predicate-not-found',
				{ variable }),
				nRaw.codeInfo
			);
		}

		if (typeof (relations[relationPredicate.relation]) === 'undefined') {
			throw new ExecutionError(
				i18n.t('db.messages.translate.error-relation-not-found',
				{ name: relationPredicate.relation }),
				nRaw.codeInfo
			);
		}

		const rel = relations[relationPredicate.relation].copy()
		if (!rel) {
			throw new Error("Could not get the tuple relation by its reference!")
		}

		return new RenameRelation(rel, relationPredicate.variable)
	}

	function handleTupleVariables(nRaw: trcAst.TRC_Expr): RANode {
		if (nRaw.variables.length <= 1) {
			return handleRenameRelation(nRaw, nRaw.variables[0])
		}

		const renamedRelations = nRaw.variables.map((variable: string) => handleRenameRelation(nRaw, variable))
		const base = renamedRelations.reduce((rel1: RANode, rel2: RANode) => {
			return new CrossJoin(rel1, rel2)
		})

		return base
	}

	function getAllColumns(nRaw: any, variable: string): Column[] {
		const pred = getRelationPredicate(nRaw, variable)
		if (!pred) {
			throw new ExecutionError(
				i18n.t('db.messages.translate.error-relation-predicate-not-found',
				{ variable }),
				nRaw.codeInfo
			);
		}

		if (typeof (relations[pred.relation]) === 'undefined') {
			throw new ExecutionError(
				i18n.t('db.messages.translate.error-relation-not-found',
				{ name: pred.relation }),
				nRaw.codeInfo
			);
		}

		const rel = relations[pred.relation].copy() as Relation
		if (!rel) throw new Error(`Cannot find relation "${pred.relation}"`)

		const cols = rel.getSchema().getColumns()
		cols.forEach(c => c.setRelAlias(pred.variable))

		return cols
	}

	function rec(nRaw: trcAst.TRC_Expr | any, baseRel: RANode | null = null, negated: boolean = false): any {
		if (nRaw.type === 'TRC_Expr') {
			checkUnboundRelationPredicates(nRaw)
		}

		switch (nRaw.type) {
			case 'TRC_Expr': {
				const projections = nRaw.projections.flatMap((e: any) => {
					if (e.type === 'columnName' || 
						(e.type === 'column' && e.name === '*')
					) {
						if (e.relAlias === null) {
							return getAllColumns(nRaw, e.name)
						}

						return [new Column(e.name, e.relAlias)]
					}

					return [{
						name: e.name,
						relAlias: e.relAlias,
						child: recValueExpr(e.child),
					}]
				})

				const base = handleTupleVariables(nRaw)
				const res = rec(nRaw.formula, base)

				return new Projection(res, projections)
			}

			case 'QuantifiedExpression': {
				switch (nRaw.quantifier) {
					case 'exists': {
						if (!baseRel) {
							throw new Error('Base relation is null!')
						}

						const relationPredicate = getRelationPredicate(nRaw, nRaw.variable)
						if (!relationPredicate) {
							throw new ExecutionError(
								i18n.t('db.messages.translate.error-relation-predicate-not-found',
								{ variable: nRaw.variable }),
								nRaw.codeInfo
							);
						}

						if (typeof (relations[relationPredicate.relation]) === 'undefined') {
							throw new ExecutionError(
								i18n.t('db.messages.translate.error-relation-not-found',
								{ name: relationPredicate.relation }),
								nRaw.codeInfo
							);
						}

						const relation = relations[relationPredicate.relation].copy()
						const renamed = new RenameRelation(relation, relationPredicate.variable)
						const newBaseRel = new CrossJoin(renamed, baseRel)

						if (negated) {
							const right = rec(nRaw.formula, newBaseRel, false)
							return new Difference(baseRel, new SemiJoin(baseRel, right, true))
						}

						const right = rec(nRaw.formula, newBaseRel, negated)
						return new SemiJoin(baseRel, right, true)
					}

					case 'forAll': {
						const exists = {
							...nRaw,
							quantifier: 'exists',
							formula: not(nRaw.formula)
						}

						if (nRaw.formula.type === 'RelationPredicate') {
							return rec({ ...exists, formula: nRaw.formula }, baseRel)
						}

						// NOTE: ¬∀xP(x) ≡ ∃x(¬P(x))
						if (negated) {
							return rec(exists, baseRel)
						}

						// NOTE: ∀xP(x) ≡ ¬∃x(¬P(x))
						return rec(not(exists), baseRel)
					}

					default: throw new Error('Unreachable!')
				}
			}

			case 'LogicalExpression': {
				switch (nRaw.operator) {
					case 'iff': {
						// NOTE: ¬(p ⇔ q) = (¬p ∨ ¬q) ∧ (p ∨ q)
						if (negated) {
							return rec(
								and(
									or(
										not(nRaw.left),
										not(nRaw.right)
									),
									or(
										nRaw.left,
										nRaw.right
									)
								),
								baseRel
							)
						}

						// NOTE: p ⇔ q = (p ∧ q) ∨ (¬p ∧ ¬q)
						return rec(
							or(
								and(
									nRaw.left,
									nRaw.right)
								,
								and(
									not(nRaw.left),
									not(nRaw.right)
								)
							),
							baseRel
						)
					}

					case 'implies': {
						// NOTE: ¬(p → q) ≡ p ∧ ¬q
						if (negated) {
							return rec(and(nRaw.left, not(nRaw.right)), baseRel)
						}

						// NOTE: p → q ≡ ¬p ∨ q
						return rec(or(not(nRaw.left), nRaw.right), baseRel)
					}

					case 'xor': {
						// NOTE: p ⊻ q = (p ∨ q) ∧ (¬p ∨ ¬q)
						if (negated) {
							// ¬(p ⊻ q) = (¬p ∧ ¬q) ∨ (p ∧ q)
							return rec(
								or(
									and(
										not(nRaw.left), not(nRaw.right)
									),
									and(nRaw.left, nRaw.right)
								),
								baseRel
							)
						}

						const left = rec(or(nRaw.left, nRaw.right), baseRel) as RANode
						const right = rec(or(not(nRaw.left), not(nRaw.right)), baseRel) as RANode
						return new Intersect(left, right)
					}

					case 'or': {
						// NOTE: ¬(p ∨ q) ≡ ¬p ∧ ¬q
						if (negated) {
							return rec(and(not(nRaw.left), not((nRaw.right))), baseRel)
						}

						const left = rec(nRaw.left, baseRel) as RANode
						const right = rec(nRaw.right, baseRel) as RANode
						return new Union(left, right)
					}

					case 'and': {
						if (nRaw.left.type === 'RelationPredicate' && nRaw.right.type === 'RelationPredicate') {
							return baseRel
						}

						if (nRaw.left.type === 'RelationPredicate') {
							return rec(nRaw.right, baseRel, negated)
						}

						if (nRaw.right.type === 'RelationPredicate') {
							return rec(nRaw.left, baseRel, negated)
						}

						// NOTE: ¬(p ∧ q) ≡ ¬p ∨ ¬q
						if (negated) {
							return rec(or(not(nRaw.left), not((nRaw.right))), baseRel)
						}

						const left = rec(nRaw.left, baseRel) as RANode
						const right = rec(nRaw.right, baseRel) as RANode
						return new Intersect(left, right)
					}

					default: throw new Error('Unreachable!')
				}
			}

			case 'RelationPredicate': {
				if (!baseRel) {
					throw new Error('Base relation is null!')
				}
				return new SemiJoin(baseRel, relations[nRaw.relation].copy(), true)
			}

			case 'Negation': {
				if (nRaw.formula.type === 'RelationPredicate') {
					throw new ExecutionError(
						i18n.t('db.messages.translate.error-trc-unsafe-formula',
						{ 
							relation: nRaw.formula.relation,
							variable: nRaw.formula.variable 
						}),
						nRaw.codeInfo
					);
				}
				return rec(nRaw.formula, baseRel, !negated)
			}

			case 'Predicate': {
				if (!baseRel) {
					throw new Error('Base relation is null!')
				}

				if (negated) {
					return new Selection(baseRel, recValueExpr(makeBooleanExpr('not', [nRaw.condition])))
				}

				return new Selection(baseRel, recValueExpr(nRaw.condition))
			}
		}
	}

	return rec(astRoot)
}


// translate a SQL-AST to RA
export function relalgFromSQLAstRoot(astRoot: sqlAst.rootSql | any, relations: { [key: string]: Relation }): RANode {
	'use strict';

	function setCodeInfoFromNode(raNode: RANode, astNode: sqlAst.astNode) {
		if (!astNode.codeInfo) {
			throw new Error('should not happen');
		}

		raNode.setCodeInfoObject(astNode.codeInfo);
	}

	function rec(nRaw: sqlAst.astNode | any): RANode {
		let node: RANode | null = null;
		switch (nRaw.type) {
			case 'relation':
				{
					const n: any = nRaw;
					const start = Date.now();
					if (typeof (relations[n.name]) === 'undefined') {
						throw new ExecutionError(i18n.t('db.messages.translate.error-relation-not-found', { name: n.name }), n.codeInfo);
					}
					const rel = relations[n.name].copy();
					if (n.relAlias === null) {
						node = rel;
						node._execTime = Date.now() - start;
						break;
					}
					node = new RenameRelation(rel, n.relAlias);
					node._execTime = Date.now() - start;
				}
				break;

			case 'statement':
				{
					const start = Date.now();
					const n: any = nRaw;
					node = parseStatement(n);
					node._execTime = Date.now() - start;
					if (n.select.distinct === false) {
						node.addWarning(i18n.t('db.messages.translate.warning-distinct-missing'), n.codeInfo);
					}
				}
				break;

			case 'renameRelation':
				{
					const start = Date.now();
					const n: any = nRaw;
					node = new RenameRelation(rec(n.child), n.newRelAlias);
					node._execTime = Date.now() - start;
				}
				break;

			case 'relationFromSubstatement':
				{
					const start = Date.now();
					const n: any = nRaw;
					const rel = rec(n.statement);
					node = new RenameRelation(rel, n.relAlias);
					node._execTime = Date.now() - start;
				}
				break;

			case 'innerJoin':
			case 'leftOuterJoin':
			case 'rightOuterJoin':
			case 'fullOuterJoin':
				{
					const start = Date.now();
					const n: any = nRaw;
					const condition: JoinCondition = parseJoinCondition(n.cond);
					switch (n.type) {
						case 'innerJoin':
							node = new InnerJoin(rec(n.child), rec(n.child2), condition);
							node._execTime = Date.now() - start;
							break;
						case 'leftOuterJoin':
							node = new LeftOuterJoin(rec(n.child), rec(n.child2), condition);
							node._execTime = Date.now() - start;
							break;
						case 'rightOuterJoin':
							node = new RightOuterJoin(rec(n.child), rec(n.child2), condition);
							node._execTime = Date.now() - start;
							break;
						case 'fullOuterJoin':
							node = new FullOuterJoin(rec(n.child), rec(n.child2), condition);
							node._execTime = Date.now() - start;
							break;
					}
				}
				break;

			case 'crossJoin':
				{
					const start = Date.now();
					const n: any = nRaw;
					// check out size of resulting cross join!
					const rec1: any = rec(n.child);
					const rec2: any = rec(n.child2);
					const probableJoinCount = getRowLength(rec1) * getRowLength(rec2);

					// tried and tested with multiple devices / browsers
					// this seems to be where the browser starts to freeze up
					if (probableJoinCount > 1000000) {
						alert('The CrossJoin may cause the browser to crash. Alternatively try using an INNER JOIN');
					}
					node = new CrossJoin(rec(n.child), rec(n.child2));
					node._execTime = Date.now() - start;
				}
				break;

			case 'naturalJoin':
				{
					const start = Date.now();
					const n: any = nRaw;
					node = new InnerJoin(rec(n.child), rec(n.child2), {
						type: 'natural',
						restrictToColumns: null,
					});
					node._execTime = Date.now() - start;
				}
				break;

			case 'union':
			case 'intersect':
			case 'except':
				{
					const start = Date.now();
					const n: any = nRaw;
					switch (n.type) {
						case 'union':
							node = new Union(rec(n.child), rec(n.child2));
							node._execTime = Date.now() - start;
							break;
						case 'intersect':
							node = new Intersect(rec(n.child), rec(n.child2));
							node._execTime = Date.now() - start;
							break;
						case 'except':
							node = new Difference(rec(n.child), rec(n.child2));
							node._execTime = Date.now() - start;
							break;
					}

					if (n.all === true) {
						if (!node) {
							throw new Error(`should not happen`);
						}
						node.addWarning(i18n.t('db.messages.translate.warning-ignored-all-on-set-operators'), n.codeInfo);
					}
				}
				break;

			case 'orderBy':
				{
					const start = Date.now();
					const n: any = nRaw;
					const orderCols = [];
					const orderAsc = [];
					for (let i = 0; i < n.arg.value.length; i++) {
						const e = n.arg.value[i];

						orderAsc.push(e.asc);
						orderCols.push(new Column(e.col.name, e.col.relAlias));
					}
					node = new OrderBy(rec(n.child), orderCols, orderAsc);
					node._execTime = Date.now() - start;
				}
				break;

			case 'limit':
				{
					const start = Date.now();
					const n: any = nRaw;
					const limit = n.limit;
					const offset = n.offset;

					const conditionOffset = new ValueExpr.ValueExprGeneric('boolean', '>', [
						new ValueExpr.ValueExprGeneric('number', 'rownum', []),
						new ValueExpr.ValueExprGeneric('number', 'constant', [offset]),
					]);

					if (limit === -1) {
						// === LIMIT ALL => only offset
						node = new Selection(rec(n.child), conditionOffset);
						node._execTime = Date.now() - start;
					}
					else {
						// limit and offset
						const conditionLimit = new ValueExpr.ValueExprGeneric('boolean', '<=', [
							new ValueExpr.ValueExprGeneric('number', 'rownum', []),
							new ValueExpr.ValueExprGeneric('number', 'constant', [limit + offset]),
						]);
						node = new Selection(rec(n.child), new ValueExpr.ValueExprGeneric('boolean', 'and', [conditionOffset, conditionLimit]));
						node._execTime = Date.now() - start;
					}
					break;
				}

			default:
				throw new Error(`type ${nRaw.type} not implemented`);
		}

		if (!node) {
			throw new Error(`should not happen`);
		}



		if (nRaw.wrappedInParentheses === true) {
			node.setWrappedInParentheses(true);
		}

		setCodeInfoFromNode(node, nRaw);
		return node;
	}

	function getSelection(root: RANode, condition: sqlAst.booleanExpr, codeInfo: CodeInfo) {
		root.check();
		const node = new Selection(root, recValueExpr(condition));
		node.setCodeInfoObject(codeInfo);
		return node;
	}


	function isNamedColumn(arg: any): arg is sqlAst.namedColumn {
		return arg.type === 'column' && arg.alias;
	}

	function parseStatement(statement: sqlAst.statement) {
		const projectionArgs = statement.select.arg;

		// from-CLAUSE
		let root = rec(statement.from);
		setCodeInfoFromNode(root, statement.from);
		root.check();

		// selection
		if (statement.where !== null) {
			root = getSelection(root, statement.where.arg, statement.where.codeInfo);
			setCodeInfoFromNode(root, statement.where);
		}

		// group-by + aggregation
		if (statement.groupBy !== null || statement.numAggregationColumns > 0) {
			const aggregateFunctions: AggregateFunction[] = [];
			const groupByCols = statement.groupBy || [];

			// filter aggFunctions from SELECT list
			for (let i = 0; i < projectionArgs.length; i++) {
				const col = projectionArgs[i];
				if (col.type === 'aggFunction') {
					aggregateFunctions.push(col);
				}
			}

			if (aggregateFunctions.length > 0) {
				root = new GroupBy(root, groupByCols, aggregateFunctions);
			}
			else {
				// use projection if no aggregation is used
				const projections: Column[] = [];
				for (let i = 0; i < groupByCols.length; i++) {
					const col = groupByCols[i];
					projections.push(new Column(col.name, col.relAlias));
				}
				root = new Projection(root, projections);
			}
		}


		// having
		if (statement.having !== null) {
			root = getSelection(root, statement.having.arg, statement.having.codeInfo);
			setCodeInfoFromNode(root, statement.having);
		}

		// projection
		let colsRenamed = false;
		if (projectionArgs.length === 1 && projectionArgs[0].type === 'column' && (projectionArgs[0] as sqlAst.columnName).name === '*' && (projectionArgs[0] as sqlAst.columnName).relAlias === null) {
			// select * => no projection needed
		}
		else {
			const projections: ProjectionColumn[] = [];
			for (let i = 0; i < projectionArgs.length; i++) {
				const col = projectionArgs[i];

				if (col.type === 'aggFunction') {
					projections.push(new Column(col.name, null)); // has been renamed by gamma
				}
				else if (col.type === 'namedColumnExpr') {
					projections.push({
						name: col.name,
						relAlias: col.relAlias,
						child: recValueExpr(col.child),
					});
				}
				else if (col.type === 'column') {
					// normal columns
					projections.push(new Column(col.name, col.relAlias));

					if (isNamedColumn(col)) {
						colsRenamed = true;
					}
				}
				else {
					throw new Error('this should not happen');
				}
			}
			root = new Projection(root, projections);
			setCodeInfoFromNode(root, statement.select);
		}

		// rename columns
		if (colsRenamed === true) {
			const tmp = new RenameColumns(root);

			for (let i = 0; i < projectionArgs.length; i++) {
				const arg = projectionArgs[i];
				if (isNamedColumn(arg)) {
					tmp.addRenaming(arg.alias, arg.name, arg.relAlias);
				}
			}
			root = tmp;
		}

		return root;
	}

	return rec(astRoot.child);
}

function recValueExpr(n: relalgAst.valueExpr | sqlAst.valueExpr): ValueExpr.ValueExpr {
	let node: ValueExpr.ValueExpr;
	if (n.datatype === 'null' && n.func === 'columnValue') {
		node = new ValueExpr.ValueExprColumnValue(n.args[0], n.args[1]);
	}
	else {
		switch (n.datatype) {
			case 'string':
			case 'number':
			case 'boolean':
			case 'date':
			case 'null': // all with unknown type
				const tmp = [];
				for (let i = 0; i < n.args.length; i++) {
					if (n.func === 'constant') {
						tmp.push(n.args[i]);
					}
					else {
						tmp.push(recValueExpr(n.args[i]));
					}
				}

				node = new ValueExpr.ValueExprGeneric(n.datatype, n.func, tmp);
				break;
			default:
				throw new Error('not implemented yet');
		}
	}

	node.setCodeInfoObject(n.codeInfo);
	if (n.wrappedInParentheses === true) {
		node.setWrappedInParentheses(true);
	}
	return node;
}

function getRowLength(node: any, length: number = 0): number {
	if (!node) { return 0; }
	if (node._table) {
		return node._table._rows.length;
	}
	if (node._child) {
		return getRowLength(node._child) * getRowLength(node._child2);
	}
	return 0;
}



function setAdditionalData<T extends RANode>(astNode: relalgAst.relalgOperation, node: T): void {
	node.setCodeInfoObject(astNode.codeInfo);

	if (typeof (astNode.metaData) !== 'undefined') {
		for (const key in astNode.metaData) {
			if (!astNode.metaData.hasOwnProperty(key)) {
				continue;
			}

			node.setMetaData(key as any, astNode.metaData[key]);
		}
	}

	if (astNode.wrappedInParentheses === true) {
		node.setWrappedInParentheses(true);
	}
}


// translates a RA-AST or a BA-AST to RA
export function relalgFromRelalgAstRoot(astRoot: relalgAst.rootRelalg, relations: { [key: string]: Relation }) {
	// root is the real root node! of a statement
	return relalgFromRelalgAstNode(astRoot.child, relations);
}

/**
 * translates a RA-AST node to RA
 * @param   {Object} astNode   a node of a RA-AST
 * @param   {Object} relations hash of the relations that could be used in the statement
 * @returns {Object} an actual RA-expression
 */
export function relalgFromRelalgAstNode(astNode: relalgAst.relalgOperation, relations: { [key: string]: Relation }): RANode {
	function recRANode(n: relalgAst.relalgOperation): RANode {
		switch (n.type) {
			case 'relation':
				{
					if (typeof (relations[n.name]) === 'undefined') {
						throw new ExecutionError(i18n.t('db.messages.translate.error-relation-not-found', { name: n.name }), n.codeInfo);
					}
					const start = Date.now();
					const node = relations[n.name].copy();
					// Passing metadata from inner relation/expression to output relation
					if (n.metaData && n.metaData.fromVariable) {
						let relAlias = n.metaData.fromVariable;
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							relAlias);
					}
					else {
						// Set the fromVariable metadata to the relation name
						// if that is not set
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							n.name);
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;
					return node;
				}

			case 'table':
				{
					const start = Date.now();
					const schema = new Schema();
					for (let i = 0; i < n.columns.length; i++) {
						const col = n.columns[i];
						schema.addColumn(col.name, col.relAlias, col.type);
					}
					const rel = new Relation(n.name);
					rel.setSchema(schema, true);
					rel.addRows(n.rows);
					rel.setMetaData('isInlineRelation', true);
					rel.setMetaData('inlineRelationDefinition', n.codeInfo.text);
					// TODO: inlineRelationDefinition should be replaced; there should be a generic way to get the definition of a node
					const node = rel;
					// Passing metadata from inner relation/expression to output relation
					if (n.metaData && n.metaData.fromVariable) {
						const relAlias = n.metaData.fromVariable;
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							relAlias);
					}
					else {
						// Set the fromVariable metadata to the relation name
						// if that is not set
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							n.name);
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;
					return node;
				}

			case 'eliminateDuplicates':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const node = new EliminateDuplicates(child);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'selection':
				{
					// TODO: Missing here...
					const start = Date.now();
					const child = recRANode(n.child);
					const condition = recValueExpr(n.arg);
					const node = new Selection(child, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;
					return node;
				}

			case 'projection':
				{
					const child = recRANode(n.child);
					const start = Date.now();
					const projections: (Column | {
						name: string | number,
						relAlias: string,
						child: ValueExpr.ValueExpr,
					})[] = [];
					for (let i = 0; i < n.arg.length; i++) {
						const el = n.arg[i];

						if (el.type === 'column' &&
						    el.name === '*') {
							if (el.relAlias === null) {
								// project all columns
								let cols;
								try {
									cols = child.getSchema();
								}
								catch (e) {
									cols = null;
								}
								if (cols) {
									for (let i = 0; i < cols.getSize(); i++) {
										// normal columns
										projections.push(cols.getColumn(i));
									}
								}
								else // normal columns
									projections.push(new Column(el.name, el.relAlias));	
							}
							// project all columns
							else if (child.getMetaData('fromVariable') &&
											 child.getMetaData('fromVariable') === el.relAlias) {
								projections.push(new Column(el.name, null));	
							}
							else {
								projections.push(new Column(el.name, el.relAlias));	
							}
						}
						else if (el.type === 'columnName') {
							const e = el as relalgAst.columnName;
							projections.push(new Column(e.name, e.relAlias));
						}
						else if (el.type === 'namedColumnExpr') {
							const e = el as relalgAst.namedColumnExpr;
							// namedColumnExpr
							projections.push({
								name: e.name,
								relAlias: e.relAlias,
								child: recValueExpr(e.child),
							});
						}
						else {
							throw new Error('should not happen');
						}
					}

					const node = new Projection(child, projections);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;
					return node;
				}

			case 'orderBy':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const orderCols: Column[] = [];
					const orderAsc: boolean[] = [];

					for (let i = 0; i < n.arg.length; i++) {
						const e = n.arg[i];

						orderAsc.push(e.asc);
						orderCols.push(new Column(e.col.name, e.col.relAlias));
					}

					const node = new OrderBy(child, orderCols, orderAsc);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;
					return node;
				}

			case 'groupBy':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const aggregateFunctions = n.aggregate;
					const groupByCols = n.group;

					const node = new GroupBy(child, groupByCols, aggregateFunctions);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'union':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new Union(child, child2);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'intersect':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new Intersect(child, child2);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'division':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new Division(child, child2);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'difference':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new Difference(child, child2);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'renameColumns':
				{
					const start = Date.now();
					const ren = new RenameColumns(recRANode(n.child));

					for (let i = 0; i < n.arg.length; i++) {
						const e = n.arg[i];

						ren.addRenaming(e.dst, e.src.name, e.src.relAlias);
					}

					const node = ren;
					const child = recRANode(n.child);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'renameRelation':
				{
					const start = Date.now();
					const child = recRANode(n.child);
					const node = new RenameRelation(child, n.newRelAlias);
					// Passing metadata from inner relation/expression to output relation
					node.setMetaData(
						'fromVariable',
						(
							node.getMetaData('fromVariable') ?
								node.getMetaData('fromVariable') + ' ' : ''
						) +
						n.newRelAlias);
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'thetaJoin':
				{
					const start = Date.now();
					const condition: JoinCondition = {
						type: 'theta',
						joinExpression: recValueExpr(n.arg),
					};
					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new InnerJoin(child, child2, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'crossJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new CrossJoin(child, child2);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'naturalJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new InnerJoin(child, child2, {
						type: 'natural',
						restrictToColumns: null,
					});
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'leftSemiJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new SemiJoin(child, child2, true);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'rightSemiJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const node = new SemiJoin(child, child2, false);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'leftAntiJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const condition = parseJoinCondition(n.arg);
					const node = new AntiJoin(child, child2, true, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'rightAntiJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const condition = parseJoinCondition(n.arg);
					const node = new AntiJoin(child, child2, false, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'leftOuterJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const condition = parseJoinCondition(n.arg);
					const node = new LeftOuterJoin(child, child2, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'rightOuterJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const condition = parseJoinCondition(n.arg);
					const node = new RightOuterJoin(child, child2, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}

			case 'fullOuterJoin':
				{
					const start = Date.now();

					const child = recRANode(n.child);
					const child2 = recRANode(n.child2);
					const condition = parseJoinCondition(n.arg);
					const node = new FullOuterJoin(child, child2, condition);
					// Passing metadata from inner relation/expression to output relation
					if (child.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child.getMetaData('fromVariable'));
					}
					if (child2.getMetaData('fromVariable')) {
						node.setMetaData(
							'fromVariable',
							(
								node.getMetaData('fromVariable') ?
									node.getMetaData('fromVariable') + ' ' : ''
							) +
							child2.getMetaData('fromVariable'));
					}
					setAdditionalData(n, node);
					node._execTime = Date.now() - start;

					return node;
				}
		}
	}

	return recRANode(astNode);
}