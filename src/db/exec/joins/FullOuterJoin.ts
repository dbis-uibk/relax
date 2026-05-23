/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Table } from '../Table';
import { Join, JoinCondition } from './Join';


/**
 * relational algebra full outer Join operator
 *
 * A full outer join B = (A left outer join B) union (A right outer join B)
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition see condition of {@link Join}
 * @returns {FullOuterJoin}
 */
export class FullOuterJoin extends Join {
	private keepColumns: any = null;
	private isNaturalJoin: boolean = false;

	constructor(child: RANode, child2: RANode, condition: JoinCondition) {
		super(child, child2, '⟗', condition, false);
	}

	setChild2(child2: RANode) {
		this._child2 = child2;
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		try {
			// full outer join always has a concatenated schema

			if (this._joinConditionOptions.type === 'natural') {
				this.isNaturalJoin = true;
				const tmp = Schema.concatNatural(schemaA, schemaB, true, this._joinConditionOptions.restrictToColumns);
				this.keepColumns = tmp.keep;

				this._schema = tmp.schema;
				this._rowCreatorMatched = (rowA: any[], rowB: any[]): any[] => {
					return Join.createNaturalRowArray(rowA, rowB, this.keepColumns.size, this.keepColumns.keepIndicesA, this.keepColumns.keepIndicesB);
				};
				this._rowCreatorNotMatched = (rowA: any[], rowB: any[]): any[] => {
					return Join.createNaturalRowArray(rowA, rowB, this.keepColumns.size, this.keepColumns.keepIndicesA, this.keepColumns.keepIndicesB);
				};

			}
			else {
				// theta join
				this.isNaturalJoin = false;

				// check columns appearing in both schemas
				const conflicts = schemaA.getConflictingColumnsArray(schemaB);
				if (conflicts.length > 0) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-join-would-produce-non-unique-columns', { conflicts: conflicts.join(', ') }));
				}

				this._schema = Schema.concat(this._child.getSchema(), this._child2.getSchema());
				this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
					return rowA.concat(rowB);
				};
				this._rowCreatorNotMatched = function (rowA: any[], rowB: any[]): any[] {
					return rowA.concat(rowB);
				};
			}
		}
		catch (e) {
			// throw (new) error in the join-context
			this.throwExecutionError(e.message);
		}
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);

		if (this._joinConditionEvaluator === null || this._rowCreatorMatched === null || this._rowCreatorNotMatched === null) {
			throw new Error(`check not called`);
		}

		const resultTable = new Table();
		resultTable.setSchema(this.getSchema());

		let leftUnmatchedCreator: ((rowA: any[], rowB: any[]) => any[]) | null = this._rowCreatorNotMatched;
		let rightUnmatchedCreator: ((rowA: any[], rowB: any[]) => any[]) | null = this._rowCreatorNotMatched;

		if (this.isNaturalJoin && this.keepColumns) {
			const keepColumns = this.keepColumns;
			const schemaA = this.getChild().getSchema();
			const schemaB = this.getChild2().getSchema();

			// Identify common column names between A and B
			const commonColumnNames = new Set<string | number>();
			for (let i = 0; i < schemaA.getSize(); i++) {
				const colName = schemaA.getColumn(i).getName();
				for (let j = 0; j < schemaB.getSize(); j++) {
					if (schemaB.getColumn(j).getName() === colName) {
						commonColumnNames.add(colName);
						break;
					}
				}
			}

			// For unmatched left rows: values from left, NULLs for right-only columns
			leftUnmatchedCreator = (rowA: any[], rowB: any[]): any[] => {
				const nullRow = new Array(schemaB.getSize()).fill(null);
				return Join.createNaturalRowArray(rowA, nullRow, keepColumns.size, keepColumns.keepIndicesA, keepColumns.keepIndicesB);
			};

			// For unmatched right rows: construct row with proper handling of common columns
			rightUnmatchedCreator = (rowA: any[], rowB: any[]): any[] => {
				const row = new Array(keepColumns.size);
				let col = 0;

				// Fill columns from A (left): NULLs for left-only, values from B for common
				for (let k = 0; k < keepColumns.keepIndicesA.length; k++) {
					const colName = schemaA.getColumn(keepColumns.keepIndicesA[k]).getName();
					if (commonColumnNames.has(colName)) {
						// Common column: find it in B and use its value
						for (let j = 0; j < schemaB.getSize(); j++) {
							if (schemaB.getColumn(j).getName() === colName) {
								row[col++] = rowB[j];
								break;
							}
						}
					} else {
						// Left-only column: use NULL
						row[col++] = null;
					}
				}

				// Fill columns from B (right): only right-only columns
				for (let k = 0; k < keepColumns.keepIndicesB.length; k++) {
					row[col++] = rowB[keepColumns.keepIndicesB[k]];
				}

				return row;
			};
		} else {
			// Theta join (not natural): all columns are kept
			const schemaA = this.getChild().getSchema();
			const schemaB = this.getChild2().getSchema();
			const numColsA = schemaA.getSize();
			const numColsB = schemaB.getSize();

			// For unmatched left rows: left values + NULLs for all right columns
			leftUnmatchedCreator = (rowA: any[], rowB: any[]): any[] => {
				return rowA.concat(new Array(numColsB).fill(null));
			};

			// For unmatched right rows: NULLs for all left columns + right values
			rightUnmatchedCreator = (rowA: any[], rowB: any[]): any[] => {
				return new Array(numColsA).fill(null).concat(rowB);
			};
		}

		// left join
		Join.calcNestedLoopJoin(
			doEliminateDuplicateRows,
			session,
			this.getChild(), this.getChild2(),
			resultTable,
			false,
			false,
			this._joinConditionEvaluator,
			this._rowCreatorMatched,
			leftUnmatchedCreator,
		);

		// right join
		Join.calcNestedLoopJoin(
			doEliminateDuplicateRows,
			session,
			this.getChild(), this.getChild2(),
			resultTable,
			true,
			false,
			this._joinConditionEvaluator,
			// Should not create matched rows twice in case of a multiset (left join already did the job)
			// this._rowCreatorMatched,	
			null,
			rightUnmatchedCreator,
		);

		if (doEliminateDuplicateRows === true) {
			resultTable.eliminateDuplicateRows();
		}
		this.setResultNumRows(resultTable.getNumRows());

		return resultTable;
	}
}
