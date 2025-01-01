var k = Object.defineProperty;
var v = (i, t, e) => t in i ? k(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var o = (i, t, e) => v(i, typeof t != "symbol" ? t + "" : t, e);
const y = Symbol("newline"), w = Symbol("blank");
class m {
  constructor(t, e = "", n = 1, s = 1, r = 1) {
    /**
     * The name of the token.
     * 
     * @type {Symbol}
     */
    o(this, "name");
    /**
     * The value of the token.
     * 
     * @type {string}
     */
    o(this, "value");
    /**
     * The line number of the token.
     * 
     * @type {number}
     */
    o(this, "line");
    /**
     * The start position of the token.
     * 
     * @type {number}
     */
    o(this, "start");
    /**
     * The end position of the token.
     * 
     * @type {number}
     */
    o(this, "end");
    this.name = t, this.value = e, this.line = n, this.start = s, this.end = r;
  }
  /**
   * Returns the length of the token's value.
   * 
   * @returns {number} The length of the value string.
   */
  get length() {
    return this.value.length;
  }
}
class d extends Array {
  /**
   * Gets the first token from the stack.
   * 
   * @returns {Token}
   */
  get first() {
    return this[0];
  }
  /**
   * Gets the last token from the stack.
   * 
   * @returns {Token}
   */
  get latest() {
    return this[this.length - 1];
  }
  /**
   * Appends the given string to the latest text node in the stack.
   * If the stack is empty or the latest token is not a text node,
   * a new text node is created. It returns the latest token.
   *
   * @param {string} text - The text to append
   * @param {string|Symbol} nodeName - The name of the node
   * @returns {Token}
   */
  pushToLatestNode(t, e) {
    const n = t.split(`
`).length - 1;
    let s = this[this.length - 1];
    return s ? s.name !== e ? this.push(
      // create a new text node
      s = new m(
        e,
        t,
        s.line,
        s.start + 1,
        (t || "").length
      )
    ) : s.name === e && (s.value += t, s.end += t.length, n > 0 && (s.line += n)) : this.push(
      // create a new text node
      s = new m(
        e,
        t,
        void 0,
        void 0,
        (t || "").length
      )
    ), s;
  }
  /**
   * Adds a token to the stack and returns the new length of
   * the stack.
   *
   * @param {Token} token The token to add.
   * @returns {number}
   */
  push(t) {
    const e = this[this.length - 1];
    return e && (t.start = e.end + 1, t.end = t.start + t.value.length - 1, t.line = e.line + t.value.split(`
`).length - 1), super.push(t);
  }
  /**
   * Converts the stack of tokens into a single string by
   * concatenating the values of each token.
   *
   * @returns {string} The concatenated string of token values.
   */
  toString() {
    return this.map((t) => t.value).join("");
  }
}
var S = Object.defineProperty, C = (i, t, e) => t in i ? S(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, l = (i, t, e) => C(i, typeof t != "symbol" ? t + "" : t, e);
class T {
  /**
   * Initialize the stream.
   * 
   * @param {string} raw string data to get streamed
   */
  constructor(t) {
    l(this, "BEGINNING", Symbol("beginning")), l(this, "ENDING", Symbol("ending")), l(this, "raw", ""), l(this, "cursor", 0), this.raw = t;
  }
  /**
   * Get the current character.
   * 
   * @type {string|undefined}
   */
  get current() {
    return this.raw[this.cursor];
  }
  /**
   * Returns the next character in the stream and advances the cursor.
   *
   * @type {string|undefined}
   */
  get next() {
    return this.raw[++this.cursor];
  }
  /**
   * Returns the previous character in the stream and decrements the cursor.
   *
   * @type {string}
   */
  get prev() {
    return this.raw[--this.cursor];
  }
  /**
   * Checks if the given needle matches starting from the current
   * position.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".matches( "rem" ); // true
   * ```
   * 
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  matches(t) {
    return this.raw.slice(
      this.cursor,
      this.cursor + t.length
    ) === t;
  }
  /**
   * Checks if the given needle matches before the current position.
   * 
   * ```js
   * //   v  <-- cursor is here
   * "lorem ipsum".before( "lore" ); // true
   * ```
   * 
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  before(t) {
    return this.raw.slice(
      this.cursor - t.length,
      this.cursor
    ) === t;
  }
  /**
   * Checks if the given needle matches after the current position.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".after( "em" ); // true
   * ```
   *
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  after(t) {
    return this.raw.slice(
      this.cursor + 1,
      this.cursor + t.length + 1
    ) === t;
  }
  /**
   * Calculates there are how many characters between the current
   * position and the specified needle in the stream.
   * 
   * If the needle is not found, Infinity will be returned.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".distanceTo( "p" ); // 4
   * ```
   * 
   * It also supports the "beginning" and "ending" symbols.
   * 
   * ```js
   * //   v  <-- cursor is here
   * "lorem ipsum".distanceTo( stream.BEGINNING ); // 4
   * "lorem ipsum".distanceTo( stream.ENDING ); // 6
   * ```
   * 
   * @param {string|Symbol} needle - The string to search for in the
   * stream or the symbol "beginning" or "ending".
   * @returns {number} The index representing the distance to the needle.
   */
  distanceTo(t) {
    const e = t === this.BEGINNING ? this.cursor : t === this.ENDING ? this.raw.length - this.cursor - 1 : this.raw.indexOf(
      t,
      this.cursor
    ) - this.cursor - 1;
    return e < 0 ? 1 / 0 : e;
  }
  /**
   * Returns an array of arrays, where each inner array contains a
   * needle and its distance to the current position in the stream.
   * 
   * The returned array is sorted in ascending order based on the distance.
   *
   * @param {Array<string>} needles - An array of needles to find the closest match for.
   * @returns {[string, number][]}
   */
  closest(t) {
    return t.map(
      (e) => [e, this.distanceTo(e)]
    ).sort(
      (e, n) => e[1] - n[1]
    );
  }
  /**
   * Starts a transaction and returns a rollback function.
   *
   * @returns {Function} The rollback function that resets the cursor.
   */
  startTransaction() {
    const { cursor: t } = this;
    function e() {
      this.cursor = t;
    }
    return e.bind(this);
  }
  /**
   * Returns a substring from the current cursor position to the first
   * occurrence of `target`.
   * 
   * If the target is not found, it returns `undefined`.
   *
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".getUntil( " " ); // "rem"
   * //    ^  <-- cursor is here now
   * ```
   * 
   * @param {string} target - The string to search for in stream.
   * @returns {string|undefined}
   */
  getUntil(t) {
    const e = this.raw.indexOf(t, this.cursor);
    if (e === -1)
      return;
    const n = this.raw.slice(this.cursor, e);
    return this.cursor += n.length, n;
  }
  /**
   * Slices a portion from the current position of the stream to the
   * given `length`.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".slice( 3 ); // "rem"
   * //    ^  <-- cursor is here now
   * ```
   *
   * @param {number} length - The length for slicing.
   * @throws {RangeError} when `length` is negative
   * @returns {string} The sliced portion of the raw data.
   */
  slice(t) {
    if (t < 0)
      throw new RangeError(
        `Cannot slice backwards from ${this.cursor} to ${t}.`
      );
    const e = this.raw.slice(
      this.cursor,
      this.cursor + t
    );
    return this.cursor = t === 1 / 0 ? this.raw.length : this.cursor + t, e;
  }
  /**
   * Moves the cursor by the specified length from the current position.
   *
   * ```js
   * //   v  <-- cursor is here
   *   "lorem ipsum".move( 2 );
   * //     ^  <-- cursor is here now
   * ```
   * 
   * @param {number} length - The amount by which to move the cursor.
   * @returns {this}
   */
  move(t) {
    return this.cursor += t, this;
  }
  /**
   * Sets the cursor to the specified position.
   *
   * ```js
   * //   v  <-- cursor is here
   *   "lorem ipsum".moveTo( 1 );
   * //  ^  <-- cursor is here now
   * ```
   * 
   * @param {number} position - The new cursor position.
   * @returns {this}
   */
  moveTo(t) {
    return this.cursor = t, this;
  }
  /**
   * Finds the index of the target in the stream starting from the
   * current cursor position and move the cursor to that position.
   *
   * @param {string} target - The string to search for in the stream.
   * @returns {number} The index of the target in the stream.
   */
  jumpTo(t) {
    return this.cursor = this.raw.indexOf(
      t,
      this.cursor
    );
  }
  /**
   * It eats the given target character set(s) starting from the position
   * of the cursor in the stream until it encounters something else.
   * 
   * The consumed data will be returned.
   *
   * ```js
   * //  v  <-- cursor is here
   * "fooooo ipsum".consume( "o" ); // ooo
   * //     ^  <-- cursor is here now
   * ```
   * 
   * It supports multibyte character targets.
   * 
   * ```js
   * //     v  <-- cursor is here
   * "Lorem 12 12 12 ipsum".consume( "12 " ); // 12 12 12 
   * //              ^  <-- cursor is here now
   * ```
   * 
   * It supports more than one target. With this, it will consume
   * if the characters at the reached position matches with any of
   * the given targets.
   * 
   * ```js
   * //    v  <-- cursor is here
   * "Lorem\s\t\t\s\sipsum".consume([ "\s", "\t" ]); // \s\t\t\s\s
   * //              ^  <-- cursor is here now
   * ```
   * 
   * @param {string|string[]} target - The string(s) to search for in the stream.
   * @returns {string}
   */
  consume(t) {
    let e;
    const n = this.cursor;
    for (Array.isArray(t) || (t = [t]); (e = t.findIndex((s) => this.matches(s))) > -1; )
      this.move(t[e].length);
    return this.raw.slice(n, this.cursor);
  }
}
function L(i, t, { mergeTokens: e = !1 } = {}) {
  const n = new d(), s = new T(i);
  do {
    let r;
    t: for (let [u, a, { merge: g } = {}] of t) {
      let b = e;
      typeof a == "string" && (a = [a]), g !== void 0 && (b = g);
      for (const h of a)
        if (s.matches(h)) {
          b ? r = n.pushToLatestNode(h, u) : (r = new m(), r.name = u, r.value = h, r.end = s.cursor + h.length, n.push(r)), s.cursor += h.length - 1;
          break t;
        }
    }
    r || n.pushToLatestNode(s.current, w);
  } while (s.next !== void 0);
  return n;
}
class A {
  /**
   * Constructs a new instance of the Parser class.
   *
   * @param {object} options - The options for the parser.
   * @param {Component[]} options.components - The components to use for parsing.
   * @param {TokenizationOptions} options.tokenization - The tokenization options.
   */
  constructor({ components: t, tokenization: e }) {
    /**
     * The components to be used for parsing.
     * 
     * @type {Component[]}
     */
    o(this, "components", []);
    /**
     * The tokenization options.
     * 
     * @type {TokenizationOptions}
     */
    o(this, "tokenization", {});
    this.components = t, this.tokenization = e;
  }
  /**
   * Parses the given string based on the components given in the constructor.
   * 
   * @param {string} raw - The string to parse.
   * @returns {ASTNode[]} - The resulting abstract syntax tree.
   */
  parse(t) {
    const e = L(t, this.tokenization.rules, this.tokenization.merge), n = new N(e), s = [];
    do {
      for (const r of this.components) {
        const u = r.run({ stream: n });
        if (u !== c) {
          s.push(u);
          break;
        }
      }
      n.current && s.push(n.current), n.moveNext();
    } while (n.current !== void 0);
    return s;
  }
}
class q {
  constructor(t, e = []) {
    /**
     * The name of the component.
     * 
     * @type {string}
     */
    o(this, "name");
    /**
     * Component sequences.
     * 
     * @type {Sequence[]}
     */
    o(this, "sequences");
    this.name = t, this.sequences = e;
    for (const [n, s] of this.sequences.entries())
      s.component = this, s.index = n;
  }
  /**
   * Executes the component's structure on the given stream.
   * 
   * @param {object} options - The options for the component.
   * @param {TokenStream} options.stream - The stream to execute the component on.
   */
  run({ stream: t }) {
    if (t.current === void 0)
      return c;
    const e = new E(this), n = t.startTransaction(), s = new p(this.name);
    s.start = t.current.start, s.startLine = t.current.line, s.end = t.current.end, s.endLine = t.current.line;
    for (const r of this.sequences) {
      if (r.run({ stream: t, scope: e, astNode: s }) === c)
        return n(), c;
      s.end = t.prev.end, s.endLine = t.prev.line;
    }
    return s;
  }
}
class f {
  /**
   * Creates a new sequence with the given name.
   * 
   * @param {string} name - The name of the sequence.
   * @param {SequenceHandler} handler - The handler function for the sequence.
   */
  constructor(t, e) {
    /**
     * The name of the sequence.
     * 
     * @type {string}
     */
    o(this, "name");
    /**
     * The component associated with this sequence.
     * 
     * @type {Component}
     */
    o(this, "component");
    /**
     * The handler function for the sequence.
     * 
     * @type {SequenceHandler}
     */
    o(this, "handler");
    /**
     * The matched token or value.
     * 
     * @type {Token|string|undefined}
     */
    o(this, "match");
    /**
     * Whether to move the cursor or not.
     * 
     * @type {boolean}
     */
    o(this, "movesCursor", !1);
    /**
     * The name of the scope.
     * 
     * @type {string}
     */
    o(this, "scopeName");
    /**
     * The sub components of the sequence.
     * 
     * @type {Component[]}
     */
    o(this, "subComponents", []);
    /**
     * The index of the sequence.
     * 
     * @type {number}
     */
    o(this, "index");
    /**
     * The minimum length for the sequence.
     * 
     * @type {number}
     */
    o(this, "minVal");
    this.name = t, this.handler = e;
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
  run({ stream: t, scope: e, astNode: n }) {
    const s = this.handler.call(this, { stream: t, scope: e, astNode: n });
    return this.subComponents.length > 0 && this.parseSubComponents({ scope: e, astNode: n }), s;
  }
  /**
   * Marks the sequence to move the cursor after execution.
   * 
   * @returns {this}
   */
  moveCursor() {
    return this.movesCursor = !0, this;
  }
  /**
   * Sets the scope name for the sequence and returns the current object.
   *
   * @param {string} name - The name to set for the scope.
   * @returns {this}
   */
  as(t) {
    return this.scopeName = t, this;
  }
  /**
   * Parses the given sub components when the sequence is executed.
   * 
   * @param {Component[]} components - The sub components to parse.
   * @returns {this}
   */
  parse(t) {
    return this.subComponents = t, this;
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
  parseSubComponents({ scope: t, astNode: e }) {
    if (!this.scopeName)
      throw new Error(
        `sequence.as() must be called when using sequence.parse() for ${this.index + 1}. sequence "${this.component.name}.${this.name}"`
      );
    const n = t.scope[this.scopeName], s = new N(n);
    if (s.current !== void 0)
      for (const r of this.subComponents) {
        const u = r.run({ stream: s });
        u !== c && Object.assign(
          e[this.scopeName],
          u.getSubNodes()
        );
      }
  }
  /**
   * Sets the minimum number of times the sequence must be matched.
   *
   * @param {number} minimum - The minimum number of times the sequence must be matched.
   * @returns {this}
   */
  min(t) {
    return this.minVal = t, this;
  }
}
class N {
  /**
   * Initializes a new instance of the TokenStream class.
   * 
   * @param {Token[]} tokens - The tokens in the stream.
   */
  constructor(t) {
    /**
     * The tokens in the stream.
     * 
     * @type {Token[]}
     */
    o(this, "tokens");
    /**
     * The current cursor position in the stream.
     * 
     * @type {number}
     */
    o(this, "cursor", 0);
    this.tokens = t;
  }
  /**
   * Moves the cursor to the next token in the stream and returns it.
   * 
   * @type {Token|undefined}
   */
  moveNext() {
    return this.tokens[++this.cursor];
  }
  /**
   * Moves the cursor to the previous token in the stream and returns it.
   * If the cursor is at the beginning of the stream, this will return undefined.
   * 
   * @type {Token|undefined}
   */
  movePrev() {
    return this.tokens[--this.cursor];
  }
  /**
   * Returns the next token in the stream. If the cursor is at the end of the
   * stream, this will return undefined.
   * 
   * @type {Token|undefined}
   */
  get next() {
    return this.tokens[this.cursor + 1];
  }
  /**
   * Returns the previous token in the stream. If the cursor is at the start of
   * the stream, this will return undefined.
   * 
   * @type {Token|undefined}
   */
  get prev() {
    return this.tokens[this.cursor - 1];
  }
  /**
   * Returns the current token in the stream.
   * 
   * @type {Token|undefined}
   */
  get current() {
    return this.tokens[this.cursor];
  }
  /**
   * Checks if the tokens in the stream match the given target(s).
   * 
   * @param {string|symbol|(string|symbol)[]} targets - The target(s) to match.
   * @param {object} [options] - The options for the match.
   * @return {TokenStack|false} Returns true if the tokens match the target(s), false otherwise.
   */
  match(t) {
    Array.isArray(t) || (t = [t]);
    const e = this.tokens.slice(this.cursor, this.cursor + t.length);
    return e.every((s, r) => {
      const u = t[r];
      if (typeof u == "symbol")
        return s.name === u;
      if (typeof u == "string" && s.name === w)
        return s.value === u;
    }) ? e.length === 0 ? !1 : e : !1;
  }
  /**
   * Starts a transaction and returns a rollback function.
   *
   * @returns {Function} The rollback function that resets the cursor.
   */
  startTransaction() {
    const { cursor: t } = this;
    function e() {
      this.cursor = t;
    }
    return e.bind(this);
  }
  consume(t) {
    const e = new d(), n = this.tokens.slice(this.cursor);
    let s;
    for (const r of n)
      if (r.name === t)
        this.cursor++, e.push(r);
      else {
        s = r;
        break;
      }
    return [e, s];
  }
  /**
   * Consumes all the tokens in the stream until it reaches any of the given targets.
   * 
   * @param {symbol|symbol[]} target - The target(s) to match.
   * @returns {undefined|[TokenStack,symbol]} Returns a stack of tokens until it
   * reaches any of the given targets or undefined if any of the targets is not
   * found in the stream.
   */
  until(t) {
    const e = new d(), n = this.tokens.slice(this.cursor);
    Array.isArray(t) || (t = [t]);
    t: for (const s of n)
      for (const r of t)
        if (s.name !== r) {
          e.push(s), this.cursor++;
          continue t;
        } else
          return [e, r];
  }
}
class E {
  /**
   * Initializes a new instance of the Scope class.
   *
   * @param {Component} component - The component associated with this scope.
   */
  constructor(t) {
    /**
     * The component associated with this scope.
     * 
     * @type {Component}
     */
    o(this, "component");
    /**
     * The scope object.
     * 
     * @type {object}
     */
    o(this, "scope", {});
    this.component = t;
  }
  /**
   * Assigns the given value to the scope using the sequence's scope name as the key.
   *
   * @param {Sequence} sequence - The sequence whose scope name is used as the key.
   * @param {*} value - The value to be assigned to the scope.
   */
  set(t, e) {
    t.scopeName && (this.scope[t.scopeName] = e);
  }
}
class p {
  /**
   * Constructs an AST node.
   * 
   * @param {string} name - The name of the node.
   */
  constructor(t) {
    o(this, "subNodeNames", []);
    this.name = t;
  }
  createSubNode(t, e) {
    if (t === void 0)
      return;
    const n = this[t] = new p(t);
    return this.subNodeNames.push(t), n.tokens = e, n.start = e.first.start, n.end = e.latest.end, n.startLine = e.first.line, n.endLine = this.endLine = e.latest.line, n;
  }
  getSubNodes() {
    const t = {};
    return this.subNodeNames.forEach(
      (e) => t[e] = this[e]
    ), t;
  }
}
function G(i, t) {
  return new q(i, t);
}
const c = Symbol("failed"), I = Symbol("beginning");
function z(i) {
  return new f("match", function({ stream: t, scope: e, astNode: n }) {
    var r;
    let s;
    if (i === I) {
      if (((r = t.prev) == null ? void 0 : r.name) === y)
        return this.match = !0, e.set(this, !0), !0;
    } else if (s = t.match(i))
      return this.match = i, e.set(this, s), n.createSubNode(this.scopeName, s), this.movesCursor && (t.cursor += s.length), !0;
    return c;
  });
}
function O(i) {
  return new f("not", function({ stream: t }) {
    return t.match(i) ? c : !0;
  });
}
function $(i) {
  const t = new f("until", function({ stream: e, scope: n, astNode: s }) {
    const r = e.until(i);
    return r === void 0 ? c : (this.match = r[1], n.set(this, r[0]), s.createSubNode(this.scopeName, r[0]), !0);
  });
  return t.movesCursor = !0, t;
}
function j(i) {
  const t = new f("consume", function({ stream: e, scope: n, astNode: s }) {
    const r = e.consume(i);
    return r[0].length === 0 || this.minVal !== void 0 && r[0].toString().length < this.minVal ? c : (this.match = r[1], n.set(this, r[0]), s.createSubNode(this.scopeName, r[0]), !0);
  });
  return t.movesCursor = !0, t;
}
export {
  p as ASTNode,
  I as BEGINNING,
  q as Component,
  c as FAILED,
  A as Parser,
  E as Scope,
  f as Sequence,
  N as TokenStream,
  G as component,
  j as consume,
  z as match,
  O as not,
  $ as until
};
