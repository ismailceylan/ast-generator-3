import { Scope, TokenStream, ASTNode } from ".";
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
	 * @type {SequenceHandler}
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
	 * The name of the scope.
	 * 
	 * @type {string}
	 */
	scopeName;

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
	 * @param {Scope} options.scope - The scope object.
	 * @param {ASTNode} options.astNode - The AST node to update.
	 * @returns {Symbol|true}
	 */
	run({ stream, scope, astNode })
	{
		const result = this.handler.call( this, { stream, scope, astNode });

		return result;
	}

	/**
	 * Marks the sequence to move the cursor after execution.
	 * 
	 * @returns {this}
	 */
	moveCursor()
	{
		this.movesCursor = true;
		return this;
	}

	/**
	 * Sets the scope name for the sequence and returns the current object.
	 *
	 * @param {string} name - The name to set for the scope.
	 * @returns {this}
	 */
	as( name )
	{
		this.scopeName = name;
		return this;
	}
}

/**
 * @callback SequenceHandler
 * @this {Sequence}
 * @param {object} options
 * @param {TokenStream} options.stream
 * @param {Scope} options.scope
 * @param {ASTNode} options.astNode
 * @returns {void}
 */
