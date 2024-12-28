/**
 * Represents an abstract syntax tree node.
 */
export default class ASTNode
{
	subNodeNames = [];

	/**
	 * Constructs an AST node.
	 * 
	 * @param {string} name - The name of the node.
	 */
	constructor( name )
	{
		this.name = name;
	}

	createSubNode( name, value )
	{
		if( name === undefined )
		{
			return;
		}

		const entry = this[ name ] = new ASTNode( name );

		this.subNodeNames.push( name );

		entry.tokens = value;
		entry.start = value.first.start;
		entry.end = value.latest.end;
		entry.startLine = value.first.line;
		entry.endLine = this.endLine = value.latest.line;

		return entry;
	}

	getSubNodes()
	{
		const subNodes = {};

		this.subNodeNames.forEach( name =>
			subNodes[ name ] = this[ name ]
		);

		return subNodes;
	}
}
