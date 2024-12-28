import { Scope, TokenStream, FAILED, Sequence, ASTNode } from ".";

/**
 * Represents a component.
 */
export default class Component
{
	/**
	 * The name of the component.
	 * 
	 * @type {string}
	 */
	name;

	/**
	 * Component sequences.
	 * 
	 * @type {Sequence[]}
	 */
	sequences;

	constructor( name, sequences = [])
	{
		this.name = name;
		this.sequences = sequences;

		for( const [ i, sequence ] of this.sequences.entries())
		{
			sequence.component = this;
			sequence.index = i;
		}
	}

	/**
	 * Executes the component's structure on the given stream.
	 * 
	 * @param {object} options - The options for the component.
	 * @param {TokenStream} options.stream - The stream to execute the component on.
	 */
	run({ stream })
	{
		const scope = new Scope( this );
		const rollbackStream = stream.startTransaction();
		const astNode = new ASTNode( this.name );

		astNode.start = stream.current.start;
		astNode.startLine = stream.current.line;
		astNode.end = stream.current.end;
		astNode.endLine = stream.current.line;

		for( const sequence of this.sequences )
		{
			if( sequence.run({ stream, scope, astNode }) === FAILED )
			{
				rollbackStream();
				return FAILED;
			}
			else
			{
				astNode.end = stream.prev.end;
				astNode.endLine = stream.prev.line;
			}
		}

		return astNode;
	}
}
