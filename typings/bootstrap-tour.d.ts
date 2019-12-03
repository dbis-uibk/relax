// Type definitions for bootstrap-tour 0.11.0
// Project: http://bootstraptour.com/api/
// Definitions by: ragtime <https://github.com/ragtime>

// it is actually a umd module

declare module 'bootstrap-tour' {
	export = Tour;

	namespace Tour {}
	class Tour {
		constructor(options: Options);
	}

	interface Options {
		/**
		 * This option is used to build the name of the storage item where the tour state is stored. The name should contain only alphanumerics, underscores and hyphens. You can initialize several tours with different names in the same page and application.
		 * 
		 * defaults to 'tour'
		 */
		name?: string,
		/**
		 * A list of object representing the steps to be included in the tour. Jump to Step options for the single step API.
		 * 
		 * defaults to []
		 */
		steps?: Step[],
		/**
		 * Appends the step popover to a specific element.
		 * See Usage section of Popover.
		 * 
		 * defaults to 'body'
		 */
		container?: string,
		/**
		 * It dynamically reorients the popover by default by specifying auto for the placement, every time.
		 * 
		 * defaults to true,
		 */
		smartPlacement?: boolean,
		/**
		 * Autoscrolls the window when the step popover is out of view.
		 * 
		 * defaults to true
		 */
		autoscroll?: boolean,
		/**
		 * This option set the left and right arrow navigation.
		 * 
		 * defaults to true
		 */
		keyboard?: true,
		/**
		 * The storage system you want to use. 
		 * Could be the objects window.localStorage, window.sessionStorage or your own object.
		 * 
		 * You can set this option as false to disable storage persistence (the tour starts from beginning every time the page is loaded).
		 * 
		 * defaults to window.localStorage
		 */
		storage?: object,
		/**
		 * Set this option to true to have some useful informations printed in the console.
		 * 
		 * defaults to false
		 */
		debug?: boolean,
		/**
		 * Show a dark backdrop behind the popover and its element, highlighting the current step.
		 * 
		 * defaults to false
		 */
		backdrop?: false,
		/**
		 * HTML element on which the backdrop should be shown.	
		 * 
		 * 'body'
		 */
		backdropContainer?: JQuery.Selector,
		/**
		 * Add padding to the backdrop element that highlights the step element.
		 * 
		 * It can be a number or a object containing optional top, right, bottom and left numbers.
		 */
		backdropPadding?: number | {top: number, right: number, bottom: number, left: number},
		/**
		 * Set a custom function to execute as redirect function. The default redirect relies on the traditional document.location.href
		 * 
		 * defaults to true
		 */
		redirect?: boolean | Function,
		/**
		 * Allow to show the step regardless whether its element is not set, is not present in the page or is hidden. 
		 * 
		 * The step is fixed positioned in the middle of the page.
		 * 
		 * defaults to false
		 */
		orphan?: boolean | string | Function, // TODO: 
		/**
		 * Set a expiration time for the steps (in milliseconds). 
		 * When the current step expires, the next step is automatically shown. 
		 * See it as a sort of guided, automatized tour functionality. 
		 * The value is specified in milliseconds
		 * 
		 * defaults to false
		 */
		duration?: false | number,
		/**
		 * Specifies a delay for the showing and hiding the tour steps. 
		 * 
		 * It can be:
		 * * a falsy - there is no delay
		 * * a number - used as a delay for both showing and hiding. In milliseconds
		 * * a object containing optional show and hide numbers - defines the delays for showing and hiding respectively
		 * 
		 * defaults to 0
		 */
		delay?: false | number | {show?: number, hide?: number},
		/**
		 * Specify a default base path prepended to the path option of every single step. Very useful if you need to reuse the same tour on different environments or sub-projects.
		 * 
		 * defaults to ''
		 */
		basePath?: string,
		/**
		 * String or function that returns a string of the HTML template for the popovers. If you pass a Function, two parameters are available: i is the position of step in the tour and step is the an object that contains all the other step options.
		 * 
		 * From version 0.5, the navigation template is included inside the template so you can easily rewrite it. However, Bootstrap Tour maps the previous, next and end logics to the elements which have the related data-role attribute. Therefore, you can also have multiple elements with the same data-role attribute.
		 */
		template?: string | ((i: number, step: Step) => string),
		
		/**
		 * You may want to do something right after Bootstrap Tour read, write or remove the state. Just pass functions to these.
		 * 
		 * @argument key key Contains the name of the state being saved. It can be current_step (for the state where the latest step the visitor viewed is saved) or end (for the state which is saved when the user complete the tour). Note that Bootstrap Tour prepends the key with tour_ when saving the state.
		 * @argument value The value of the state been saved. Can be the index of the current step if the key is current_step, or yes if the key is end.
		 */
		afterGetState?(key: string, value: number | 'yes'): void,
		
		/**
		 * You may want to do something right after Bootstrap Tour read, write or remove the state. Just pass functions to these.
		 * 
		 * @argument key key Contains the name of the state being saved. It can be current_step (for the state where the latest step the visitor viewed is saved) or end (for the state which is saved when the user complete the tour). Note that Bootstrap Tour prepends the key with tour_ when saving the state.
		 * @argument value The value of the state been saved. Can be the index of the current step if the key is current_step, or yes if the key is end.
		 */
		afterSetState?(key: string, value: number | 'yes'): void,
		
		/**
		 * You may want to do something right after Bootstrap Tour read, write or remove the state. Just pass functions to these.
		 * 
		 * @argument key key Contains the name of the state being saved. It can be current_step (for the state where the latest step the visitor viewed is saved) or end (for the state which is saved when the user complete the tour). Note that Bootstrap Tour prepends the key with tour_ when saving the state.
		 * @argument value The value of the state been saved. Can be the index of the current step if the key is current_step, or yes if the key is end.
		 */
		afterRemoveState?(key: string, value: number | 'yes'): void,

		/**
		 * Function to execute when the tour starts.
		 */
		onStart?(tour: this): void,

		/**
		 * Function to execute when the tour ends.
		 */
		onEnd?(tour: this): void,

		/**
		 * Function to execute right before each step is shown.
		 */
		onShow?(tour: this): void,

		/**
		 * Function to execute right after each step is shown.
		 */
		onShown?(tour: this): void,

		/**
		 * Function to execute right before each step is hidden.
		 */
		onHide?(tour: this): void,

		/**
		 * Function to execute right after each step is hidden.
		 */
		onHidden?(tour: this): void,

		/**
		 * Function to execute when next step is called.
		 */
		onNext?(tour: this): void,

		/**
		 * Function to execute when prev step is called.
		 */
		onPrev?(tour: this): void,

		/**
		 * Function to execute when pause is called. The second argument refers to the remaining duration.
		 */
		onPause?(tour: this, duration: number): void,

		/**
		 * Function to execute when resume is called. The second argument refers to the remaining duration.
		 */
		onResume?(tour: this, duration: number): void,

		/**
		 * Function to execute when there is a redirection error. This happens when bootstrap tour cannot redirect to the path of the step
		 */
		onRedirectError?(tour: this): void,
	}

	interface Step {
		/**
		 * Path to the page on which the step should be shown. This allows you to build tours that span several pages!
		 */
		path?: string | RegExp,
		/**
		 * Host of the page on which the step should be shown. This allows you to build tours for several sub-domains
		 */
		host?: string | RegExp,
		/**
		 * HTML element on which the step popover should be shown.
		 * 
		 * If orphan is false, this option is required.
		 */
		element?: JQuery.Selector,
		/**
		 * How to position the popover. Possible choices: 'top', 'bottom', 'left', 'right', 'auto'. When "auto" is specified, it will dynamically reorient the popover. For example, if placement is "auto left", the popover will display to the left when possible, otherwise it will display right.
		 * 
		 * defaults to 'right'
		 */
		placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto',
		/**
		 * It dynamically reorients the popover by default by specifying auto for the placement.
		 * 
		 * defaults to true
		 */
		smartPlacement?: true,
		/**
		 * Step title
		 * 
		 * defaults to ''
		 */
		title?: string | (() => string),
		/**
		 * Step content	
		 * 
		 * defaults to ''
		 */
		content?: string | (() => string),
		/**
		 * Index of the step to show after this one, starting from 0 for the first step of the tour. -1 to not show the link to next step. By default, the next step (in the order you added them) will be shown.
		 * This option should be used in conjunction with prev.
		 * 
		 * defaults to 0
		 */
		next?: number,
		/**
		 * Index of the step to show before this one, starting from 0 for the first step of the tour. -1 to not show the link to previous step. By default, the previous step (in the order you added them) will be shown.
		 * This option should be used in conjunction with next.
		 * 
		 * defaults to 0
		 */
		prev?: number,
		/**
		 * Apply a css fade transition to the tooltip.	
		 * 
		 * defaults to true
		 */
		animation?: boolean,
		/**
		 * Attachment of popover. Pass an element to append the popover to. By default the popover is appended after the 'element' above. This option is particularly helpful for Internet Explorer.
		 * 
		 * defaults to 'body'
		 */
		container?: JQuery.Selector,
		/**
		 * Show a dark backdrop behind the popover and its element, highlighting the current step.
		 * 
		 * defaults to false
		 */
		backdrop?: boolean,
		/**
		 * HTML element on which the backdrop should be shown.	
		 * 
		 * defaults to 'body'
		 */
		backdropContainer?: JQuery.Selector,
		/**
		 * Add padding to the backdrop element that highlights the step element.
		 * It can be a number or a object containing optional top, right, bottom and left numbers.
		 */
		backdropPadding?: number | {top: number, right: number, bottom: number, left: number},
		/**
		 * Set a custom function to execute as redirect function. The default redirect relies on the traditional document.location.href
		 * 
		 * defaults to true
		 */
		redirect?: boolean | Function,
		
		/**
		 * Enable the reflex mode: attach an handler on click on the step element to continue the tour.
		 * In order to bind the handler to a custom event, you can pass a string with its name.Also, the class tour-step-element-reflex is added to the element, as hook for your custom style (e.g: cursor: pointer).
		 * 
		 * defaults to false
		 */
		reflex?: false | string,
		
		/**
		 * Allow to show the step regardless whether its element is not set, is not present in the page or is hidden. The step is fixed positioned in the middle of the page.
		 * You can use a string or function that returns a string of the HTML template for the orphan popovers
		 * 
		 * defaults to false
		 */
		orphan?: boolean | string | Function,
		
		/**
		 * Set a expiration time for the steps. When the step expires, the next step is automatically shown. See it as a sort of guided, automatized tour functionality. The value is specified in milliseconds
		 */
		duration?: boolean | number,

		/**
		 * String or function that returns a string of the HTML template for the popovers. 
		 * If you pass a Function, two parameters are available: i is the position of step in the tour and step is the object that contains all the other step options.
		 * 
		 * From version 0.5, the navigation template is included inside the template so you can easily rewrite it. However, Bootstrap Tour maps the previous, next and end logics to the elements which have the related data-role attribute. Therefore, you can also have multiple elements with the same data-role attribute.
		 */
		template?: string | ((i: number, step: Step) => string),


		/**
		 * Function to execute right before each step is shown.
		 */
		onShow?(tour: this): void,

		/**
		 * Function to execute right after each step is shown.
		 */
		onShown?(tour: this): void,

		/**
		 * Function to execute right before each step is hidden.
		 */
		onHide?(tour: this): void,

		/**
		 * Function to execute right after each step is hidden.
		 */
		onHidden?(tour: this): void,

		/**
		 * Function to execute when next step is called.
		 */
		onNext?(tour: this): void,

		/**
		 * Function to execute when prev step is called.
		 */
		onPrev?(tour: this): void,

		/**
		 * Function to execute when pause is called. The second argument refers to the remaining duration.
		 */
		onPause?(tour: this, duration: number): void,

		/**
		 * Function to execute when resume is called. The second argument refers to the remaining duration.
		 */
		onResume?(tour: this, duration: number): void,

		/**
		 * Function to execute when there is a redirection error. This happens when bootstrap tour cannot redirect to the path of the step
		 */
		onRedirectError?(tour: this): void,
	}

}

