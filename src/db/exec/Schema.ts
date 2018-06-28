/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { Column } from './Column';

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'null';
export type Data = string | number | boolean | Date | null;

/**
 * the schema of a relation
 */
export class Schema {
	private _names: (string | number)[] = [];
	private _relAliases: (string | null)[] = [];
	private _types: DataType[] = [];
	private _size: number = 0;

	/** key: name, value: [] of columns */
	_colIndexPerName: { [name: string]: number[] } = {};

	constructor() {
	}

	getSize() {
		return this._size;
	}

	addColumn(name: string | number, relAlias: string | null, type: DataType) {
		if (!(type === 'string' || type === 'date' || type === 'number' || type === 'boolean')) {
			throw new Error('unknown type! ' + type);
		}


		this._names.push(name);
		this._relAliases.push(relAlias);
		this._types.push(type);
		const index = this._size;

		if (this.isUnique(index) === false) {
			throw new Error(i18n.t('db.messages.exec.error-column-not-unique', { column: relAlias + '.' + name }));
		}

		// names
		this._addColToIndex(name, index);

		this._size++;

		return this;
	}

	addColumn2(column: Column) {
		return this.addColumn(
			column.getName(),
			column.getRelAlias(),
			column.getType(),
		);
	}

	_addColToIndex(name: string | number, index: number) {
		if (typeof (this._colIndexPerName[name]) === 'undefined') {
			this._colIndexPerName[name] = [index];
		}
		else {
			this._colIndexPerName[name].push(index);
		}
	}

	_removeColFromIndex(index: number) {
		const name = this._names[index];
		const indices = this._colIndexPerName[name];
		indices.splice(indices.indexOf(index, 0), 1);
		if (indices.length === 0) {
			delete this._colIndexPerName[name];
		}
	}

	removeColumn(index: number) {
		this._names.splice(index, 1);
		this._relAliases.splice(index, 1);
		this._types.splice(index, 1);
		this._size--;

		// update names because index is 1 lower at all following columns
		for (let i = index; i < this._size; i++) {
			const name = this._names[i];
			const indices = this._colIndexPerName[name];
			for (let j = 0; j < indices.length; j++) {
				indices[j] -= 1;
			}
		}
	}

	copy() {
		const res = new Schema();
		for (let i = 0; i < this._size; i++) {
			res.addColumn(this._names[i], this._relAliases[i], this._types[i]);
		}
		return res;
	}

	isUnique(index: number) {
		for (let j = 0; j < this._size; j++) {
			if (index === j) {
				continue;
			}

			if (this._names[index] === this._names[j] && this._relAliases[index] === this._relAliases[j]) {
				return false;
			}
		}
		return true;
	}

	getColumn(index: number) {
		return new Column(this._names[index], this._relAliases[index], this._types[index]);
	}

	getColumns() {
		const a: Column[] = [];
		for (let i = 0; i < this._size; i++) {
			a.push(this.getColumn(i));
		}
		return a;
	}

	getColumnIndex(name: string | number, relAlias: string | null, throwsExceptions: boolean = true) {
		const indices = this.getColumnIndexArray(name, relAlias);

		if (indices.length === 0) {
			if (throwsExceptions) {
				const error = 'db.messages.exec.error-column-not-found-' + (typeof (name) === 'string' ? 'name' : 'index');
				throw new Error(i18n.t(error, { column: Column.printColumn(name, relAlias), schema: this.toString() }));
			}
			else {
				return -1;
			}
		}
		else if (indices.length === 1) {
			return indices[0];
		}
		else {
			throw new Error(i18n.t('db.messages.exec.error-column-ambiguous', {
				column: Column.printColumn(name, relAlias),
				schema: this.toString(),
			}));
		}

	}

	/**
	 * returns an array of Columns that appear in both
	 * schemas (fully qualified)
	 * @param {Schema} schemaB the other schema
	 * @returns {Column[]} array of Column objects
	 */
	getConflictingColumnsArray(schemaB: Schema) {
		const conflicts = [];

		for (let i = 0; i < this._size; i++) {
			const index = schemaB.getColumnIndex(this._names[i], this._relAliases[i], false);
			if (index !== -1) {
				conflicts.push(this.getColumn(i));
			}
		}
		return conflicts;
	}

	getColumnIndexArray(name: string | number, relAlias: string | null) {
		let index;
		if (typeof (name) === 'string') {
			const indices = this._colIndexPerName[name];
			if (typeof (indices) === 'undefined' || indices === null) {
				return [];
			}

			if (relAlias === null) {
				return indices; // contains all indices of columns with the given name
			}


			// check relAlias for all columns with the same name
			for (let i = 0; i < indices.length; i++) {
				index = indices[i];
				if (this._relAliases[index] === relAlias) {
					return [index]; // found full qualified name; must be unique => only hit
				}
			}
		}
		else {// name is the column index (starting at 1)!!
			index = (name as number) - 1;

			if (name < 1 || name > this._size) {
				throw new Error(i18n.t('db.messages.exec.error-column-index-out-of-range', {
					column: Column.printColumn(name, relAlias),
					schema: this.toString(),
				}));
			}

			if (relAlias === null) {
				return [index];
			}

			// check if column has the given relAlias
			if (this._relAliases[index] === relAlias) {
				return [index];
			}
		}

		return [];
	}

	getType(index: number) {
		return this._types[index];
	}

	equals(schemaB: Schema) {
		if (this.equalsTypeOnly(schemaB) === false) {
			return false;
		}

		for (let i = 0; i < this._size; i++) {
			if (this._names[i] !== schemaB._names[i] || this._relAliases[i] !== schemaB._relAliases[i]) {
				return false;
			}
		}

		return true;
	}

	equalsTypeOnly(schemaB: Schema) {
		if (this._size !== schemaB._size) {
			return false;
		}

		for (let i = 0; i < this._size; i++) {
			if (this._types[i] !== schemaB._types[i]) {
				return false;
			}
		}

		return true;
	}

	// no index => all
	setRelAlias(relAlias: string, index?: number) {
		const setRelAliasAtIndex = function (schema: Schema, relAlias: string, index: number) {
			schema._relAliases[index] = relAlias;

			if (schema.isUnique(index) === false) {
				throw new Error(i18n.t('db.messages.exec.error-could-not-change-rel-alias-ambiguity', { alias: relAlias }));
			}
		};

		if (typeof index === 'undefined') {
			// set all relAliases
			for (let i = 0; i < this._size; i++) {
				setRelAliasAtIndex(this, relAlias, i);
			}
		}
		else {
			setRelAliasAtIndex(this, relAlias, index);
		}
	}

	setName(newName: string, index: number) {
		const oldName = this._names[index];

		// update index
		this._removeColFromIndex(index);
		this._addColToIndex(newName, index);

		this._names[index] = newName;

		if (this.isUnique(index) === false) {
			throw new Error(i18n.t('db.messages.exec.error-could-not-change-rel-alias-ambiguity', {
				newName: newName,
				oldName: oldName,
				schema: this.toString(),
			}));
		}
	}

	needsFullName(index: number) {
		return this._colIndexPerName[this._names[index]].length > 1;
	}

	getName(index: number): string | number {
		return this._names[index];
	}

	getFullName(index: number) {
		return (this._relAliases[index] ? this._relAliases[index] + '.' : '') + this._names[index];
	}

	toString() {
		const list = [];

		for (let i = 0; i < this._size; i++) {
			const c = this.getColumn(i);
			const type = this.getType(i);
			const name = c.toString();

			list.push(`${name} : ${type}`);

		}
		return `[${list.join(', ')}]`;
	}

	/**
	 * concatenates the two given schemas
	 * @param   {Schema} schemaA a Schema
	 * @param   {Schema} schemaB a Schema
	 * @returns {Schema} concatenated schema
	 */
	static concat(schemaA: Schema, schemaB: Schema) {
		const schema = schemaA.copy();

		const numColsB = schemaB.getSize();
		for (let i = 0; i < numColsB; i++) {
			const col = schemaB.getColumn(i);
			const type = schemaB.getType(i);
			schema.addColumn(col.getName(), col.getRelAlias(), type);
		}
		return schema;
	}

	/**
	 * concatenates the two given schemas like required by a natural join
	 */
	static concatNatural(
		/** the first Schema */
		schemaA: Schema,
		/** the second Schema */
		schemaB: Schema,
		/** wether the columns of the left (true) 
		 * or the right (false) schema should be kept if they have the same name 
		 */
		keepColsFromSchemaA: boolean = true,
		/**
		 * optional argument to indicate that only the columns
		 * with names listed in the Array of Strings should
		 * be considered for the equality search.
		 * This is used for the USING() clause in SQL that is
		 * actually a restricted version of a natural join
		 */
		restrictToColumns: string[] | null = null,
	) {
		const sizeA = schemaA.getSize();
		const sizeB = schemaB.getSize();
		const work = {
			keepA: new Array<boolean>(sizeA),
			keepB: new Array<boolean>(sizeB),
			size: -1, // size of schema

			keepIndicesA: [] as number[],
			keepIndicesB: [] as number[],
		};
		let i, j;

		// init
		for (i = 0; i < sizeA; i++) {
			work.keepA[i] = true;
		}
		for (i = 0; i < sizeB; i++) {
			work.keepB[i] = true;
		}

		// find columns with the same name in schemaA and schemaB
		for (i = 0; i < sizeA; i++) {
			const candidate = schemaA.getColumn(i);
			if (restrictToColumns !== null && restrictToColumns.indexOf(candidate.getName() + '') === -1) {
				// skip column if it is not in the restriction set
				continue;
			}

			const colIndicesInA = schemaA.getColumnIndexArray(candidate.getName(), null);
			const colIndicesInB = schemaB.getColumnIndexArray(candidate.getName(), null);

			if (colIndicesInA.length === 0 || colIndicesInB.length === 0) {
				continue;
			}


			if (keepColsFromSchemaA) {
				// keep the all columns (with this name) in A and none (with this name) in B
				for (j = 0; j < colIndicesInB.length; j++) {
					work.keepB[colIndicesInB[j]] = false;
				}
			}
			else {
				// keep the all columns (with this name) in B and none (with this name) in A
				for (j = 0; j < colIndicesInA.length; j++) {
					work.keepA[colIndicesInA[j]] = false;
				}
			}
		}

		// generate concatenated schema from work-information
		const schema = new Schema();
		let col;
		for (i = 0; i < sizeA; i++) {
			if (work.keepA[i] === false) {
				continue;
			}

			col = schemaA.getColumn(i);
			schema.addColumn(col.getName(), col.getRelAlias(), schemaA.getType(i));
		}
		for (i = 0; i < sizeB; i++) {
			if (work.keepB[i] === false) {
				continue;
			}

			col = schemaB.getColumn(i);
			schema.addColumn(col.getName(), col.getRelAlias(), schemaB.getType(i));
		}


		work.size = schema.getSize();

		// create arrays with the indices we want to keep
		for (i = 0; i < sizeA; i++) {
			if (work.keepA[i] === false) {
				continue;
			}
			work.keepIndicesA.push(i);
		}
		for (i = 0; i < sizeB; i++) {
			if (work.keepB[i] === false) {
				continue;
			}
			work.keepIndicesB.push(i);
		}


		return {
			keep: work,
			schema: schema,
		};
	}
}
