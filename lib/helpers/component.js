import { Component } from "..";

/**
 * Creates a new instance of the Component class with
 * the given arguments.
 *
 * @param {string} name - The name of the component.
 * @returns {Component} The created component.
 */
export default function component( name )
{
	return new Component( name );
}
