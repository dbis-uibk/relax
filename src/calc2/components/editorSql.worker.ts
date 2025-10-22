import { Relation } from "db/exec/Relation";
import {
	parseSQLSelect,
	relalgFromSQLAstRoot,
	replaceVariables,
} from "db/relalg";
import {} from "db/relalg";
import { getSerializeValueWithClassName } from "calc2/utils/worker-serde/serializer";
import { deserializeFromParsedObj } from "calc2/utils/worker-serde/deserializer";
import classes from "db/exec/classes";

/**
 * Worker definition for parallel execution of our "db engine", this is intended as a way
 * to reduce the processing overhead on the Main JS Thread for the Web Page,
 * since this process is CPU intensive and may lock it during extensive amounts of time,
 * causing page freezes, the usage of the worker can improve the user experience by handling this
 * on a separated thread.
 * - https://v4.webpack.js.org/loaders/worker-loader/
 * - https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 */
const ctx: Worker & { terminated?: boolean } = self as any;
const MAX_NUM_ROWS_ON_RESULT = 50_000_000;

const relationsCache: Record<string, { [name: string]: Relation }> = {};

function timeout(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function execRelalgText(
	text: string,
	relations: { [name: string]: Relation },
	withResult: boolean
) {
	try {
		// const start = performance.now();
		const ast = parseSQLSelect(text);
		replaceVariables(ast, relations);

		if (ast.child === null) {
			if (ast.assignments.length > 0) {
				return {
					success: null,
					error: "calc.messages.error-query-missing-assignments-found",
				};
			} else {
				return { success: null, error: "calc.messages.error-query-missing" };
			}
		}
		const root = relalgFromSQLAstRoot(ast, relations);
		root.check();
		const result = withResult ? root.getResult(true) : null;
		// this is used as a way to allow any terminate message to be processed before we
		await timeout(0);
		if (result) {
			if (
				ctx.terminated ||
				result.getNumRows() * result.getNumCols() > MAX_NUM_ROWS_ON_RESULT
			) {
				return {
					success: null,
					error: "calc.messages.error-query-large-memory-usage",
				};
			}
		}
		return {
			success: { root: getSerializeValueWithClassName(root), ast, result },
			error: null,
		};
	} catch (error) {
		return { success: null, error };
	}
}

type MessageRelalg =
	| {
			type: "exec";
			payload: {
				text: string;
				id: string;
				groupName: string;
				withResult: boolean;
			};
	  }
	| {
			type: "cacheRelations";
			payload: {
				relations: { [name: string]: Relation };
				groupName: string;
        id: string;
			};
	  }
	| {
			type: "terminated";
	  };

ctx.addEventListener("message", async (event: MessageEvent<MessageRelalg>) => {
	if (!event) return;
	console.log(event);
	if (event.data.type === "terminated") {
		ctx.terminated = true;
	}
	if (event.data.type === "exec") {
		const relations = relationsCache[event.data.payload.groupName];
		const result = await execRelalgText(
			event.data.payload.text,
			relations || {},
			event.data.payload.withResult
		);
		postMessage({
			...result,
			id: event.data.payload.id,
		});
	}
	if (event.data.type === "cacheRelations") {
		if (
			!event.data.payload.relations ||
			!Object.keys(event.data.payload.relations).length
		) {
			postMessage({
				success: null,
				error: new Error("no relations to cache"),
				id: event.data.payload.id,
			});
		} else {
			for (const key of Object.keys(event.data.payload.relations)) {
				event.data.payload.relations[key] = deserializeFromParsedObj(
					event.data.payload.relations[key],
					classes,
					{}
				);
			}
			relationsCache[event.data.payload.groupName] =
				event.data.payload.relations;
			postMessage({
				error: null,
				success: true,
				id: event.data.payload.id,
			});
		}
	}
});
