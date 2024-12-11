import Token from "../../tokenizer/lib/token";

export default class Sequence
{
	/**
	 * The name of the sequence.
	 * 
	 * @type {string}
	 */
	name;

	/**
	 * The handler function for the sequence.
	 * 
	 * @type {function}
	 */
	handler;

	/**
	 * The matched token or value.
	 * 
	 * @type {Token|string|undefined}
	 */
	match = undefined;


	/**
	 * Creates a new sequence with the given name.
	 * 
	 * @param {string} name - The name of the sequence.
	 * @param {SequenceHandler} handler - The handler function for the sequence.
	 */
	constructor( name, handler )
	{
		this.name = name;
		this.handler = handler;
	}

/**
 * @callback SequenceHandler
 * @this {Sequence}
 * @param {object} scope
 * @param {TokenStream} scope.stream
 * @returns {void}
 */
