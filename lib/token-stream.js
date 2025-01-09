import { BEGINNING, ENDING } from "./constants";
import { NEWLINE } from "../../tokenizer/index";
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
	 * @return {TokenStack|false} Returns true if the tokens match the target(s), false otherwise.
	 */
	match( targets )
	{
		if( ! Array.isArray( targets ))
		{
			targets = [ targets ];
		}

		let matchCount = 0;

		const physicalLength = targets.filter( target =>
			! [ BEGINNING, ENDING ].includes( target )
		).length;
		
		const sample = new TokenStream(
			this.tokens.slice( this.cursor, this.cursor + physicalLength )
		);

		for( const [ i, target ] of targets.entries())
		{
			if( target === BEGINNING )
			{
				if( i === 0 )
				{
					if( this.prev?.name === NEWLINE )
					{
						
						matchCount++;
					}
				}
				else if( sample.prev === NEWLINE )
				{
					matchCount++;
				}
			}
			else if( sample.current?.name === target )
			{
				matchCount++;
				sample.moveNext();
			}
		}
		
		if( matchCount === targets.length )
		{
			return sample.tokens;
		}
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

	consume( target )
	{
		const stack = new TokenStack;
		const rest = this.tokens.slice( this.cursor );
		let breakerToken;

		for( const token of rest )
		{
			if( token.name === target )
			{
				this.cursor++;
				stack.push( token );
			}
			else
			{
				breakerToken = token;
				break;
			}
		}

		return [ stack, breakerToken ];
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
		const rest = this.tokens.slice( this.cursor );

		if( ! Array.isArray( target ))
		{
			target = [ target ];
		}

		const distance = ( new TokenStream( rest ))
			.distance( target )
			.sort( ([ dist1 ], [ dist2 ]) => dist1 - dist2 );

		if( distance.length === 0 )
		{
			return;
		}

		const [ closestTokenDistance, closestToken ] = distance[ 0 ];

		if( closestTokenDistance === Infinity )
		{
			return;
		}

		const tokens = rest.slice( 0, closestTokenDistance + 1 );

		this.cursor += closestTokenDistance + 1;

		return [
			new TokenStack( ...tokens ),
			closestToken
		];
	}

	/**
	 * Returns the distance (how many tokens) between the current token and the
	 * given target in the stream.
	 * 
	 * Returns -1 if the target is not found.
	 * 
	 * @overload
	 * @param {symbol|string} target 
	 * @returns {number}
	 */
	/**
	 * For each target, calculates the distance (how many tokens) between the current
	 * token and the target in the stream.
	 * 
	 * Places Infinity if the target is not found.
	 * 
	 * @overload
	 * @param {(symbol|string)[]} target
	 * @returns {[number, symbol|string][]}
	 */
	distance( target )
	{
		/**
		 * @param {symbol|string} target - The target symbol or string.
		 * @returns {number} The distance from the current token to the given
		 * target token in the stream. Returns -1 if the target is not found.
		 */
		function calc( target )
		{
			const rest = this.tokens.slice( this.cursor );
			const targetName = target?.name || target;

			if( targetName === ENDING )
			{
				return rest.length - 1;
			}
			else if( targetName === BEGINNING )
			{
				return 0;
			}

			for( const [ i, token ] of rest.entries())
			{
				if( token.name === targetName )
				{
					return i - 1;
				}
			}

			return -1;
		}

		if( Array.isArray( target ))
		{
			return target
				.map( i =>
				{
					const dist = calc.call( this, i );
					
					return [
						dist < 0 ? Infinity : dist,
						i
					];
				});
		}
		else
		{
			return calc.call( this, target );
		}
	}
}
