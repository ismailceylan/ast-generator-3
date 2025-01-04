import { Scope, TokenStream, ASTNode, Component, FAILED } from ".";
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
	 * The component associated with this sequence.
	 * 
	 * @type {Component}
	 */
	component;

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
	 * The sub components of the sequence.
	 * 
	 * @type {Component[]}
	 */
	subComponents = [];

	/**
	 * The index of the sequence.
	 * 
	 * @type {number}
	 */
	index;

	/**
	 * The minimum length for the sequence.
	 * 
	 * @type {number}
	 */
	minVal;

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

		if( this.subComponents.length > 0 )
		{
			this.parseSubComponents({ scope, astNode });
		}

		return result;
	}

	/**
	 * Marks the sequence to move the cursor after execution.
	 * 
	 * @returns {this}
	 */
	eat()
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

	/**
	 * Parses the given sub components when the sequence is executed.
	 * 
	 * @param {Component[]} components - The sub components to parse.
	 * @returns {this}
	 */
	parse( components )
	{
		this.subComponents = components;
		return this;
	}

	/**
	 * Parses the sub-components associated with the sequence. It verifies that the sequence
	 * has a scope name set, then retrieves tokens from the scope. Each sub-component is executed
	 * using these tokens, and the results are used to update the AST node.
	 *
	 * @param {Object} options - The options object.
	 * @param {Scope} options.scope - The scope containing the tokens to parse.
	 * @param {ASTNode} options.astNode - The AST node to be updated based on sub-component results.
	 * @throws {Error} If the sequence does not have a scope name set.
	 */
	parseSubComponents({ scope, astNode })
	{
		if( ! this.scopeName )
		{
			throw new Error(
				`sequence.as() must be called when using sequence.parse() for ${ this.index + 1 }. sequence "${ this.component.name }.${ this.name }"`
			);
		}

		const tokens = scope.scope[ this.scopeName ].result;
		const stream = new TokenStream( tokens );

		if( stream.current === undefined )
		{
			return;
		}

		for( const component of this.subComponents )
		{
			const result = component.run({ stream });

			if( result !== FAILED )
			{
				Object.assign(
					astNode[ this.scopeName ],
					result.getSubNodes()
				);
			}
		}
	}

	/**
	 * Sets the minimum number of times the sequence must be matched.
	 *
	 * @param {number} minimum - The minimum number of times the sequence must be matched.
	 * @returns {this}
	 */
	min( minimum )
	{
		this.minVal = minimum;
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
