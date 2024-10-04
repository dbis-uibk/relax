/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { Column } from './Column';
import { RANode, RANodeUnary, Session } from './RANode';
import { Schema } from './Schema';


/**
 * relational algebra anti-join operator
 *
 * the columns that should be renamed are added via `addRenaming()`
 */
export class RenameColumns extends RANodeUnary {
    _renameList: {
        newName: string
        oldName: string | number
        oldRelAlias: string | null,
    }[] = [];
    _schema: Schema | null = null;

    constructor(child: RANode) {
        super('&rho;', child);
    }

    getSchema() {
        if (this._schema === null) {
            throw new Error(`check not called`);
        }
        return this._schema;
    }

    addRenaming(newName: string, oldName: string | number, oldRelAlias: string | null) {
        this._renameList.push({
            newName: newName,
            oldName: oldName,
            oldRelAlias: oldRelAlias,
        });
    }

    check() {
        this._child.check();

        const schemaA = this._child.getSchema().copy();
        const schema = new Schema();
        const list = this._renameList;

        // check the rename list
        for (let i = 0; i < list.length; i++) {
            if (schemaA.getColumnIndex(
                  list[i].oldName,
                  list[i].oldRelAlias != this._child.getMetaData('fromVariable') ?
                    list[i].oldRelAlias : null,
                  false) === -1) {
                this.throwExecutionError(i18n.t('db.messages.exec.error-column-not-found-name', {
                    column: Column.printColumn(list[i].oldName, list[i].oldRelAlias),
                    schema: schemaA.toString(),
                }));
            }
        }


        // create the new schema
        for (let i = 0; i < schemaA.getSize(); i++) {
            const oldColumn = schemaA.getColumn(i);

            let columnRenamed = false;
            for (let j = 0; j < list.length; j++) {
                const e = list[j];
                if (e.oldName === oldColumn.getName() &&
                    (e.oldRelAlias === null ||
                     e.oldRelAlias === oldColumn.getRelAlias() ||
                     e.oldRelAlias === this._child.getMetaData('fromVariable'))
                   ) {

                    // add column with new name
                    schema.addColumn(
                        e.newName,
                        oldColumn.getRelAlias(),
                        oldColumn.getType(),
                    );

                    columnRenamed = true;
                    break;
                }
            }

            if (columnRenamed) {
                continue;
            }

            // add the not renamed column with its original
            schema.addColumn2(schemaA.getColumn(i));
        }

        this._schema = schema;
    }

    getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
        session = this._returnOrCreateSession(session);

        const res = this._child.getResult(doEliminateDuplicateRows, session).copy();
        res.setSchema(this.getSchema());

        this.setResultNumRows(res.getNumRows());
        return res;
    }

    getArgumentHtml() {
        const out = [];
        const list = this._renameList;
        for (let i = 0; i < list.length; i++) {
            const e = list[i];
            out.push(`${e.newName}←${Column.printColumn(e.oldName, e.oldRelAlias)}`);
        }

        return out.join(', ');
    }
}
