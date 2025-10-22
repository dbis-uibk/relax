/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { printValue } from 'db/exec/ValueExpr';
import { Relation } from './Relation';
import { Data, DataType, Schema } from './Schema';

export type Tuple = Data[];

export class Table {
	_rows: Tuple[];
	_schema: Schema;

	constructor() {
		this._rows = [];
		this._schema = new Schema();
	}

	static rowEqualsRow(rowA: Tuple, rowB: Tuple) {
		if (rowA.length !== rowB.length) {
			return false;
		}

		for (let i = 0; i < rowA.length; i++) {
			if (rowA[i] !== rowB[i]) {
				return false;
			}
		}

		return true;
	}

	addRow(dataArray: Tuple) {
		this._rows.push(dataArray);
	}

	addRows(rows: Tuple[]) {
		for (let i = 0; i < rows.length; i++) {
			this.addRow(rows[i]);
		}
	}

	setSchema(schema: Schema) {
		if (schema instanceof Schema === false) {
			throw new Error('illegal argument: no schema');
		}

		this._schema = schema;

		return this;
	}

	getSchema() {
		return this._schema;
	}

	getRow(i: number) {
		return this._rows[i];
	}

	getNumRows() {
		return this._rows.length;
	}

	getNumCols() {
		return this._schema.getSize();
	}

	getValueHtmlAt(row: number, col: number) {
		const value = this._rows[row][col];
		const type = this._schema.getType(col);

		const text = printValue(value, type);
		return '<span class="' + (value === null ? 'null ' + type : type) + '">' + text + '</span>';
	}

	getRows(offset: number = 0, maxRows?: number): Tuple[] {
		if (offset === 0 && maxRows === undefined) {
			return this._rows;
		}
		else {
			const numRows = this._rows.length;
			let end = numRows;
			if (maxRows && maxRows > 0) {
				end = Math.min(numRows, offset + maxRows);
			}

			this._rows.slice(offset, end);

			const rows: Tuple[] = [];
			for (let i = offset; i < end; i++) {
				rows.push(this._rows[i]);
			}
			return rows;
		}
	}

	getHtml(unqualifiedColumnNames = false, maxRows = -1, offset = 0) {
		const numCols = this.getNumCols();

		let thead = '<thead><tr>';
		for (let i = 0; i < numCols; i++) {
			const c = this._schema.getColumn(i);

			if (unqualifiedColumnNames) {
				thead += '<th>' + c.getName() + '</th>';
			}
			else {
				thead += '<th>' + c.toString() + '</th>';
			}
		}
		thead += '</tr></thead>';


		let tbody = '<tbody>';
		const numRows = this.getNumRows();
		let end = numRows;
		if (maxRows && maxRows > 0) {
			end = Math.min(numRows, offset + maxRows);
		}

		for (let i = offset; i < end; i++) {
			let tr = '<tr>';
			for (let j = 0; j < numCols; j++) {
				tr += '<td>' + this.getValueHtmlAt(i, j) + '</td>';
			}

			tbody += tr + '</tr>';
		}

		return '<table>' + thead + tbody + '</table>';
	}

	equals(table: Table) {
		if (table instanceof Table === false) {
			throw new Error('can not compare');
		}

		// compare schema
		if (this._schema.equals(table._schema) === false) {
			return false;
		}

		// compare rows
		if (this._rows.length !== table._rows.length) {
			return false;
		}

		for (let i = 0; i < this._rows.length; i++) {
			if (Table.rowEqualsRow(this._rows[i], table._rows[i]) === false) {
				return false;
			}
		}

		return true;
	}

	eliminateDuplicateRows() {
		const uniqueRows = new Map<string, Tuple>();
		for (let i = 0; i < this._rows.length; i++) {
			const key = JSON.stringify(this._rows[i]);
			if (uniqueRows.has(key) === false) {
				uniqueRows.set(key, this._rows[i]);
			}
		}

		this._rows = [];
		for (const value of uniqueRows.values()) {
			this._rows.push(value);
		}
	}

	sort(
		sortByColumnIndicesArg?: number[],
		sortAscendingArg?: boolean[],
	) {
		const size = this.getNumCols();

		// initialize
		const sortByColumnIndices = sortByColumnIndicesArg || [];
		if (sortByColumnIndicesArg === undefined) {
			for (let i = 0; i < size; i++) {
				sortByColumnIndices[i] = i;
			}
		}
		const sortAscending = sortAscendingArg || [];
		if (sortAscendingArg === undefined) {
			for (let i = 0; i < sortByColumnIndices.length; i++) {
				sortAscending[i] = true;
			}
		}


		// check indices
		if (sortByColumnIndices.length > size) {
			throw new Error('invalid sort cols');
		}

		for (let i = 0; i < sortByColumnIndices.length; i++) {
			if (sortByColumnIndices[i] >= size || sortByColumnIndices[i] < 0) {
				throw new Error('invalid sort cols');
			}
		}

		// check sort order array
		const sortByColumnIndicesLength = sortByColumnIndices.length;
		if (sortByColumnIndicesLength !== sortAscending.length) {
			throw new Error('invalid sort cols');
		}


		const sortByColumnIndicesTypes = sortByColumnIndices.map(index => this._schema.getType(index));

		const compare = function (rowA: Tuple, rowB: Tuple, col: number, mul: number, type: DataType): number {
			const o1 = rowA[col];
			const o2 = rowB[col];

			if (o1 === null && o2 === null) {
				return 0;
			}
			else if (o1 === null && o2 !== null) {
				return mul * 1;
			}
			else if (o1 !== null && o2 === null) {
				return mul * -1;
			}

			switch (type) {
				case 'number':
				case 'date':
				case 'boolean':
					return mul * ((o1 as number) - (o2 as number));

				case 'string':
					return mul * ((o1 as string).localeCompare(o2 as string));

				case 'null':
					return 0;
			}
		};

		const compareAll = function (rowA: Tuple, rowB: Tuple) {
			let last = 0;
			for (let i = 0; i < sortByColumnIndicesLength; i++) {
				const mul = sortAscending[i] ? 1 : -1;
				const col = sortByColumnIndices[i];
				const type = sortByColumnIndicesTypes[i];

				last = compare(rowA, rowB, col, mul, type);
				if (last === 0) {
					continue;
				}

				return last;
			}
			return last;
		};

		this._rows.sort(compareAll);
	}

	getEstimatedMemoryUsage(): number {
		let estimatedMemoryUsage = 0;
		for (let i = 0; i < this._schema.getSize(); i++) {
			switch (this._schema.getType(i)) {
				case 'boolean':
					estimatedMemoryUsage += this._rows.length * 4;
				case 'number':
					estimatedMemoryUsage += this._rows.length * 8;
				case 'date':
					estimatedMemoryUsage += this._rows.length * 16;
				case 'string':
					estimatedMemoryUsage += this._rows.reduce((acc, row) => (row[i] as string).length * 2 + acc, 0)
				default:
					break;
			}
		}
		return estimatedMemoryUsage;
	}

	copy() {
		const res = new Table();
		res.setSchema(this.getSchema().copy());
		res.addRows(this.getRows());
		return res;
	}

	createRelation(name: string) {
		const relation = new Relation(name);
		relation.setSchema(this.getSchema().copy());
		relation.addRows(this.getRows());
		return relation;
	}
}
