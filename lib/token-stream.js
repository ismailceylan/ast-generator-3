import { BLANK } from "../../tokenizer/index";
import Token from "../../tokenizer/lib/token";
import TokenStack from "../../tokenizer/lib/token-stack";

/**
 * Represents a stream of tokens.
 */
export default class TokenStream
{
	/**
	 * The tokens in the stream.
	 * 
	 * @type {Token[]}
	 */
	tokens;

	/**
	 * The current cursor position in the stream.
	 * 
	 * @type {number}
	 */
	cursor = 0;

	/**
	 * Initializes a new instance of the TokenStream class.
	 * 
	 * @param {Token[]} tokens - The tokens in the stream.
	 */
	constructor( tokens )
	{
		this.tokens = tokens;
	}

	/**
	 * Moves the cursor to the next token in the stream and returns it.
	 * 
	 * @type {Token|undefined}
	 */
	moveNext()
	{
		return this.tokens[ ++this.cursor ];
	}

	/**
	 * Moves the cursor to the previous token in the stream and returns it.
	 * If the cursor is at the beginning of the stream, this will return undefined.
	 * 
	 * @type {Token|undefined}
	 */
	movePrev()
	{
		return this.tokens[ --this.cursor ];
	}

	/**
	 * Returns the next token in the stream. If the cursor is at the end of the
	 * stream, this will return undefined.
	 * 
	 * @type {Token|undefined}
	 */
	get next()
	{
		return this.tokens[ this.cursor + 1 ];
	}

	/**
	 * Returns the previous token in the stream. If the cursor is at the start of
	 * the stream, this will return undefined.
	 * 
	 * @type {Token|undefined}
	 */
	get prev()
	{
		return this.tokens[ this.cursor - 1 ];
	}

	/**
	 * Returns the current token in the stream.
	 * 
	 * @type {Token|undefined}
	 */
	get current()
	{
		return this.tokens[ this.cursor ];
	}

	/**
	 * Checks if the tokens in the stream match the given target(s).
	 * 
	 * @param {string|symbol|(string|symbol)[]} targets - The target(s) to match.
	 * @param {object} [options] - The options for the match.
	 * @param {boolean} [moveCursor=false] - Whether to move the cursor or not.
	 * @return {boolean} Returns true if the tokens match the target(s), false otherwise.
	 */
	match( targets, { moveCursor = false } = {})
	{
		if( ! Array.isArray( targets ))
		{
			targets = [ targets ];
		}

		const sample = this.tokens.slice( this.cursor, this.cursor + targets.length );

		const result = sample.every( ( token, index ) =>
		{
			const target = targets[ index ];

			if( typeof target == "symbol" )
			{
				return token.name === target;
			}

			if( typeof target == "string" && token.name === BLANK )
			{
				
				return token.value === target;
			}
		});

		if( result && moveCursor )
		{
			this.cursor += targets.length;
		}

		return result;
	}

	/**
	 * Starts a transaction and returns a rollback function.
	 *
	 * @returns {Function} The rollback function that resets the cursor.
	 */
	startTransaction()
	{
		const { cursor: t } = this;
		
		function rollback()
		{
			this.cursor = t;
		}

		return rollback.bind( this );
	}

	/**
	 * Consumes all the tokens in the stream until it reaches any of the given targets.
	 * 
	 * @param {symbol|symbol[]} target - The target(s) to match.
	 * @returns {undefined|[TokenStack,symbol]} Returns a stack of tokens until it
	 * reaches any of the given targets or undefined if any of the targets is not
	 * found in the stream.
	 */
	until( target )
	{
		const stack = new TokenStack;
		const rest = this.tokens.slice( this.cursor );

		if( ! Array.isArray( target ))
		{
			target = [ target ];
		}

		TokenLoop: for( const token of rest )
		{
			for( const tr of target )
			{
				if( token.name !== tr )
				{
					stack.push( token );
					this.cursor++;
					continue TokenLoop;
				}
				else
				{
					return [ stack, tr ];
				}
			}
		}

		return undefined;
	}
}
