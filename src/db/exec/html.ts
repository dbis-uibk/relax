const HTML_ENTITIES: { [char: string]: string } = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
};

/** escapes text so it can be placed in HTML content or a quoted attribute value */
export function escapeHtml(value: string | number): string {
	return String(value).replace(/[&<>"']/g, char => HTML_ENTITIES[char]);
}

/**
 * returns the text content of an HTML string
 *
 * DOMParser creates an inert document: unlike parsing with jQuery or innerHTML
 * it does not load images or fire their event handlers
 */
export function htmlToText(html: string): string {
	return new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
}
