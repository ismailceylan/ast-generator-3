(function(i,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(i=typeof globalThis<"u"?globalThis:i||self,c(i["ast-gen"]={}))})(this,function(i){"use strict";var z=Object.defineProperty;var O=(i,c,a)=>c in i?z(i,c,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[c]=a;var o=(i,c,a)=>O(i,typeof c!="symbol"?c+"":c,a);const c=Symbol("blank");class a{constructor(t,s="",e=1,n=1,u=1){o(this,"name");o(this,"value");o(this,"line");o(this,"start");o(this,"end");this.name=t,this.value=s,this.line=e,this.start=n,this.end=u}get length(){return this.value.length}}class p extends Array{get first(){return this[0]}get latest(){return this[this.length-1]}pushToLatestNode(t,s){let e=this[this.length-1];return e?e.name!==s?this.push(e=new a(s,t,e.line,e.start+1,(t||"").length)):e.name===s&&(e.value+=t,e.end+=t.length):this.push(e=new a(s,t,void 0,void 0,(t||"").length)),e}push(t){const s=this[this.length-1];return s&&(t.start=s.end+1,t.end=t.start+t.value.length-1,t.line=s.line+t.value.split(`
`).length-1),super.push(t)}}var T=Object.defineProperty,S=(r,t,s)=>t in r?T(r,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[t]=s,m=(r,t,s)=>S(r,typeof t!="symbol"?t+"":t,s);class A{constructor(t){m(this,"BEGINNING",Symbol("beginning")),m(this,"ENDING",Symbol("ending")),m(this,"raw",""),m(this,"cursor",0),this.raw=t}get current(){return this.raw[this.cursor]}get next(){return this.raw[++this.cursor]}get prev(){return this.raw[--this.cursor]}matches(t){return this.raw.slice(this.cursor,this.cursor+t.length)===t}before(t){return this.raw.slice(this.cursor-t.length,this.cursor)===t}after(t){return this.raw.slice(this.cursor+1,this.cursor+t.length+1)===t}distanceTo(t){const s=t===this.BEGINNING?this.cursor:t===this.ENDING?this.raw.length-this.cursor-1:this.raw.indexOf(t,this.cursor)-this.cursor-1;return s<0?1/0:s}closest(t){return t.map(s=>[s,this.distanceTo(s)]).sort((s,e)=>s[1]-e[1])}startTransaction(){const{cursor:t}=this;function s(){this.cursor=t}return s.bind(this)}getUntil(t){const s=this.raw.indexOf(t,this.cursor);if(s===-1)return;const e=this.raw.slice(this.cursor,s);return this.cursor+=e.length,e}slice(t){if(t<0)throw new RangeError(`Cannot slice backwards from ${this.cursor} to ${t}.`);const s=this.raw.slice(this.cursor,this.cursor+t);return this.cursor=t===1/0?this.raw.length:this.cursor+t,s}move(t){return this.cursor+=t,this}moveTo(t){return this.cursor=t,this}jumpTo(t){return this.cursor=this.raw.indexOf(t,this.cursor)}consume(t){let s;const e=this.cursor;for(Array.isArray(t)||(t=[t]);(s=t.findIndex(n=>this.matches(n)))>-1;)this.move(t[s].length);return this.raw.slice(e,this.cursor)}}function I(r,t,{mergeTokens:s=!1}={}){const e=new p,n=new A(r);do{let u;t:for(let[h,g,{merge:b}={}]of t){let N=s;typeof g=="string"&&(g=[g]),b!==void 0&&(N=b);for(const f of g)if(n.matches(f)){N?u=e.pushToLatestNode(f,h):(u=new a,u.name=h,u.value=f,u.end=n.cursor+f.length,e.push(u)),n.cursor+=f.length-1;break t}}u||e.pushToLatestNode(n.current,c)}while(n.next!==void 0);return e}class C{constructor({components:t,tokenization:s}){o(this,"components",[]);o(this,"tokenization",{});this.components=t,this.tokenization=s}parse(t){const s=I(t,this.tokenization.rules,this.tokenization.merge),e=new v(s),n=[];do{for(const u of this.components){const h=u.run({stream:e});if(h!==l){n.push(h);break}}n.push(e.current),e.moveNext()}while(e.current!==void 0);return n}}class w{constructor(t,s=[]){o(this,"name");o(this,"sequences");this.name=t,this.sequences=s}run({stream:t}){const s=new k(this),e=t.startTransaction(),n=new y(this.name);n.init(t.current);for(const u of this.sequences){if(u.run({stream:t,scope:s,astNode:n})===l)return e(),l;n.end=t.prev.end}return n.assign(s),n}}class d{constructor(t,s){o(this,"name");o(this,"handler");o(this,"match");o(this,"movesCursor",!1);o(this,"scopeName");this.name=t,this.handler=s}run({stream:t,scope:s,astNode:e}){return this.handler.call(this,{stream:t,scope:s,astNode:e})}moveCursor(){return this.movesCursor=!0,this}as(t){return this.scopeName=t,this}}class v{constructor(t){o(this,"tokens");o(this,"cursor",0);this.tokens=t}moveNext(){return this.tokens[++this.cursor]}movePrev(){return this.tokens[--this.cursor]}get next(){return this.tokens[this.cursor+1]}get prev(){return this.tokens[this.cursor-1]}get current(){return this.tokens[this.cursor]}match(t){Array.isArray(t)||(t=[t]);const s=this.tokens.slice(this.cursor,this.cursor+t.length);return s.every((n,u)=>{const h=t[u];if(typeof h=="symbol")return n.name===h;if(typeof h=="string"&&n.name===c)return n.value===h})?s:!1}startTransaction(){const{cursor:t}=this;function s(){this.cursor=t}return s.bind(this)}until(t){const s=new p,e=this.tokens.slice(this.cursor);Array.isArray(t)||(t=[t]);t:for(const n of e)for(const u of t)if(n.name!==u){s.push(n),this.cursor++;continue t}else return[s,u]}}class k{constructor(t){o(this,"component");o(this,"scope",{});this.component=t}set(t,s){t.scopeName&&(this.scope[t.scopeName]=s)}}class y{constructor(t){this.name=t}init(t){this.start=t.start,this.end=t.end,this.line=t.line}assign(t){for(const s in t.scope){const e=t.scope[s];e instanceof p?e.length>0&&(this[s]={value:e,start:e.first.start,end:e.latest.end}):console.log("ast-node nasıl karışacak?")}}}function E(r,t){return new w(r,t)}const l=Symbol("failed");function G(r){return new d("match",function({stream:t,scope:s}){let e;return(e=t.match(r))?(this.match=r,s.set(this,e),this.movesCursor&&(t.cursor+=e.length),!0):l})}function L(r){return new d("not",function({stream:t}){return t.match(r)?l:!0})}function q(r){return new d("until",function({stream:t,scope:s}){const e=t.until(r);return e===void 0?l:(this.match=e[1],s.set(this,e[0]),!0)})}i.ASTNode=y,i.Component=w,i.FAILED=l,i.Parser=C,i.Scope=k,i.Sequence=d,i.TokenStream=v,i.component=E,i.match=G,i.not=L,i.until=q,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})});