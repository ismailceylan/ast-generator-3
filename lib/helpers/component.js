import { Component } from "..";

/**
 * Creates a new instance of the Component class with
 * the given arguments.
 *
 * @param {string} name - The name of the component.
 * @param {Sequence[]} sequences - The sequences that define the behavior of the component.
 * @returns {Component} The created component.
 */
export default function component( name, sequences )
{
	return new Component( name, sequences );
}
