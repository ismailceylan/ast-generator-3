/**
 * Represents an abstract syntax tree node.
 */
export default class ASTNode
{
	/**
	 * The name of the AST node.
	 * 
	 * @type {string[]}
	 */
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

	/**
	 * Creates a sub-node within the current AST node with the specified name and value.
	 *
	 * @param {string} name - The name of the sub-node to create.
	 * @param {TokenStack} value - The token stack containing the start and end positions, 
	 *                             and line numbers to be assigned to the sub-node.
	 * @returns {ASTNode} The newly created sub-node.
	 */
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

	/**
	 * Returns a dictionary containing all the sub-nodes of the current
	 * AST node. The keys of the dictionary are the names of the sub-nodes
	 * and the values are the sub-nodes themselves.
	 *
	 * @returns {Object.<string, ASTNode>}
	 */
	getSubNodes()
	{
		const subNodes = {};

		this.subNodeNames.forEach( name =>
			subNodes[ name ] = this[ name ]
		);

		return subNodes;
	}
}
