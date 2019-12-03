/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * a column of a relation
 * @constructor
 * @param   {String} name         
 * @param   {String} relAlias     
 * @param   {String} optionalType 
 * @returns {Column} returns a column with the given attributes
 */
import { DataType } from 'db/exec/Schema';

export class Column {
	_name: string | number;
	_relAlias: string | null;
	_type: DataType = 'null';

	constructor(
		/** the name of the column */
		name: string | number,
		/** the relation alias of the name (or null) */
		relAlias: string | null,
		/** optional type of the column */
		optionalType: DataType = 'null',
	) {
		this._name = name;
		this._relAlias = relAlias;
		this._type = optionalType;
	}

	getName() {
		return this._name;
	}

	getRelAlias() {
		return this._relAlias;
	}

	getType() {
		return this._type;
	}

	setRelAlias(relAlias: string) {
		this._relAlias = relAlias;
	}

	toString() {
		return Column.printColumn(this._name, this._relAlias);
	}

	equals(columnB: Column) {
		return this._name === columnB._name && this._relAlias === columnB._relAlias;
	}

	static printColumn(name: string | number, relAlias: string | null): string {
		let pName;
		if (typeof (name) === 'number') {
			pName = `[${name}]`;
		}
		else {
			pName = name;
		}

		if (relAlias === null) {
			return pName;
		}
		return `${relAlias}.${pName}`;
	}
}
