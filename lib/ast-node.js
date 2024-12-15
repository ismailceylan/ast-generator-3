import TokenStack from "../../tokenizer/lib/token-stack";

/**
 * Represents an abstract syntax tree node.
 */
export default class ASTNode
{
	/**
	 * Constructs an AST node.
	 * 
	 * @param {string} name - The name of the node.
	 */
	constructor( name )
	{
		this.name = name;
	}

	/**
	 * Initializes the AST node with the properties of a given token.
	 *
	 * @param {Token} token - The token containing start, end, and
	 * line information.
	 */
	init( token )
	{
		this.start = token.start;
		this.end = token.end;
		this.line = token.line;
	}

	/**
	 * Assigns the properties from the given scope's scope object to
	 * the AST node.
	 * 
	 * @param {Scope} scope - The scope containing the properties to
	 * be assigned to the AST node.
	 */
	assign( scope )
	{
		// Object.assign( this, scope.scope );
		for( const key in scope.scope )
		{
			const value = scope.scope[ key ];

			if( value instanceof TokenStack )
			{
				if( value.length > 0 )
				{
					this[ key ] =
					{
						value,
						start: value.first.start,
						end: value.latest.end
					}
				}
			}
			else
			{
				console.log( "ast-node nasıl karışacak?" )
			}
		}
	}
}
