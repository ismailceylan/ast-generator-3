import { BEGINNING, FAILED, Sequence } from "..";

/**
 * Checks if the current stream value matches the given target.
 *
 * @param {string|symbol|(string|symbol)[]} target - The target value to match with the current stream value.
 * @returns {Sequence} A new Sequence that represents the scenario.
 */
export default function match( target )
{
	return new Sequence( "match", function({ stream, scope, astNode })
	{
		let matches;

		if( matches = stream.match( target ))
		{
			scope.set( this, { match: target, result: matches });
			astNode.createSubNode( this.scopeName, matches );

			if( this.movesCursor )
			{
				stream.cursor += matches.length;
			}

			return true;
		}

		return FAILED;
	});
}
