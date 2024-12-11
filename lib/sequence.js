import { TokenStream } from ".";
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
	 * Whether to move the cursor or not.
	 * 
	 * @type {boolean}
	 */
	movesCursor = false;

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
	 * Executes the sequence on the provided stream and logs the current character.
	 *
	 * @param {Object} options - The options object.
	 * @param {TokenStream} options.stream - The stream to execute the sequence on.
	 */
	run({ stream })
	{
		const result = this.handler.call( this, { stream });

		return result;
	}

	/**
	 * Marks the sequence to move the cursor after execution.
	 */
	moveCursor()
	{
		this.movesCursor = true;
		return this;
	}
}

/**
 * @callback SequenceHandler
 * @this {Sequence}
 * @param {object} scope
 * @param {TokenStream} scope.stream
 * @returns {void}
 */
