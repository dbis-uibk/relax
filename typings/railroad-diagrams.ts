/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// https://github.com/tabatkins/railroad-diagrams

declare module 'railroad-diagrams' {
	interface Diagram {
		format(): Diagram,
		toString(): string,
		toSVG(): string,
		addTo(element?: Element): void,
	}
	interface Child { }

	export function Diagram(...children: Child[]): Diagram;
	export function ComplexDiagram(...children: Child[]): Diagram;

	export const Sequence: {
		new(children: Child[]): Child,
		(...children: Child[]): Child,
	};
	export const Stack: {
		new(...children: Child[]): Child,
		(...children: Child[]): Child,
	};
	export const Choice: {
		new(index: number, ...children: Child[]): Child,
		(index: number, ...children: Child[]): Child,
	};
	export const Optional: {
		new(child: Child, skip?: 'skip' | 'normal'): Child,
		(child: Child, skip?: 'skip' | 'normal'): Child,
	};
	export const OneOrMore: {
		new(child: Child, repeat?: string): Child,
		(child: Child, repeat?: string): Child,
	};
	export const ZeroOrMore: {
		new(child: Child, repeat: string, skip?: 'skip' | 'normal'): Child,
		(child: Child, repeat: string, skip?: 'skip' | 'normal'): Child,
	};

	// leaves
	export const Comment: {
		new(text: string, href?: string): Child,
		(text: string, href?: string): Child,
	};
	export const Terminal: {
		new(text: string, href?: string): Child,
		(text: string, href?: string): Child,
	};
	export const NonTerminal: {
		new(text: string, href?: string): Child,
		(text: string, href?: string): Child,
	};
	export const Skip: {
		new(): Child,
		(): Child,
	};
}
