// Source: github.com/netgsm/skills @ 836760b (plugins/sms-skills/skills/netgsm-sms/scripts/netgsm-sms-mock.mjs), MIT License, Copyright (c) 2026 Netgsm
// Netgsm SMS API v3 yerel mock'u — kaynak: github.com/netgsm/skills
// Bu dosya packages/sms-mock/src/cli.mjs dosyasından `npm run build` ile üretilir; elle değiştirmeyin.
import { createRequire as __netgsmCreateRequire } from 'node:module';
const require = __netgsmCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values2 = this._values) {
        return this._reduceValues(values2, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values2 = this._values, usedValues, getCode) {
        return this._reduceValues(values2, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values2, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values2) {
          const vs = values2[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve2.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve2(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isPort = RegExp.prototype.test.bind(/^\d*$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head = hextets.slice(0, bestStart).join(":");
      const tail = hextets.slice(bestStart + bestLength).join(":");
      return head + "::" + tail;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed2 = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed2) return { host, isIPV6: false, error: true };
      let input = bracketed2 ? host.slice(1, -1) : host;
      if (bracketed2 && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed2 };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    function removeDotSegmentsRelative(path) {
      if (path === "" || path[0] === "/") {
        return removeDotSegments(path);
      }
      const segments = path.split("/");
      const last = segments.length - 1;
      const output = [];
      let trailingDirectory = false;
      for (let i = 0; i <= last; i++) {
        const segment = segments[i];
        if (segment === "." || segment === "..") {
          if (segment === "..") {
            if (output.length !== 0 && output[output.length - 1] !== "..") {
              output.pop();
            } else {
              output.push("..");
            }
          }
          trailingDirectory = i === last;
        } else {
          output.push(segment);
        }
      }
      if (trailingDirectory && output[output.length - 1] !== "..") {
        output.push("");
      }
      if (output.length === 0 || output[0] === "" || output[0].includes(":")) {
        output.unshift(".");
      }
      return output.join("/");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP2) {
      const re = isIP2 ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        const port2 = String(component.port);
        if (!isPort(port2)) {
          throw new TypeError("URI port is malformed.");
        }
        uriTokens.push(":");
        uriTokens.push(port2);
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      removeDotSegmentsRelative,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http2 = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http2.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http: http2,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    var MALFORMED_HOST_ERROR = "URI host is malformed.";
    var FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
    function validateScheme(scheme) {
      const stringScheme = String(scheme);
      if (!VALID_SCHEME.test(stringScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return stringScheme;
    }
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve2(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) {
        throw new Error(MALFORMED_HOST_ERROR);
      }
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !new RegExp("\\P{ASCII}", "u").test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base2, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base2 = parse(serialize(base2, options), options);
        relative = parse(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base2.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base2.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              const baseHasAuthority = base2.userinfo !== void 0 || base2.host !== void 0 || base2.port !== void 0;
              if (baseHasAuthority && !base2.path) {
                target.path = "/" + relative.path;
              } else if (!base2.path) {
                target.path = relative.path;
              } else {
                target.path = base2.path.slice(0, base2.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = base2.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base2.userinfo;
          target.host = base2.host;
          target.port = base2.port;
        }
        target.scheme = base2.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = validateScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
      const pathNoScheme = !options.skipEscape && schemelessReference;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = validateScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
        }
        if (schemelessReference) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function isIPLiteral(host) {
      return host[0] === "[" && host[host.length - 1] === "]";
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP2) {
      if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP2)) {
        parsed.error = parsed.error || MALFORMED_HOST_ERROR;
        return true;
      }
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP2 === false && nonSimpleDomain(parsed.host)) {
        let url;
        try {
          url = new URL("http://" + parsed.host);
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
        if (!isHostOnlyURL(url)) {
          parsed.error = parsed.error || MALFORMED_HOST_ERROR;
          return true;
        }
        parsed.host = url.hostname;
      }
      return false;
    }
    function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP2) {
      return Boolean(
        parsed.host && isIP2 === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host)
      );
    }
    function isHostOnlyURL(url) {
      return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP2 = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          if (VALID_SCHEME.test(parsed.scheme)) {
            parsed.scheme = parsed.scheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = isIPLiteral(parsed.host);
            const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
            const ipv6result = normalizeIPv6(parsed.host);
            isIP2 = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
            parsed.host = isIP2 ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || MALFORMED_HOST_ERROR;
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP2 = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!malformedIPLiteral) {
          malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP2);
        }
        if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
          let host = isIP2 ? parsed.host : normalizePercentEncoding(parsed.host, true);
          if (!isIP2) {
            host = normalizePercentEncoding(host.toLowerCase());
          }
          parsed.host = isIP2 || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP2) : host;
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve: resolve2,
      resolveComponent,
      equal,
      serialize,
      parse
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv2 = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv2.ValidationError = validation_error_1.default;
    Ajv2.MissingRefError = ref_error_1.default;
    exports.default = Ajv2;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid5 = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid5}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv2 = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv2;
    module.exports = exports = Ajv2;
    module.exports.Ajv = Ajv2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv2;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv) => {
      ajv.addKeyword(exports.formatLimitDefinition);
      return ajv;
    };
    exports.default = formatLimitPlugin;
  }
});

// node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "node_modules/ajv-formats/dist/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats2(ajv, opts, formats_1.fullFormats, fullName);
        return ajv;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats2(ajv, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv);
      return ajv;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats2(ajv, list, fs, exportName) {
      var _a;
      var _b;
      (_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 ? _a : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv.addFormat(f, fs[f]);
    }
    module.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// packages/sms-mock/src/cli.mjs
import { parseArgs } from "node:util";

// packages/sms-mock/src/server.mjs
import http from "node:http";
import { createHash } from "node:crypto";

// packages/sms-mock/src/explain.mjs
var CALL_CENTER = "çağrı merkezi +90 850 303 0 303";
var TEKNIK = "teknikdestek@netgsm.com.tr";
var ABONE = "abone.islemleri@netgsm.com.tr";
var DESTEK = `${CALL_CENTER} ya da ${ABONE}`;
var SENDER_URL = "https://bilgibankasi.netgsm.com.tr/sms/toplu-sms/gonderici-adi-talebi";
var PRICES_URL = "https://www.netgsm.com.tr/fiyatlar/toplu-sms";
var SUB_USERS = "Online İşlemler → Abonelik İşlemleri → Alt Kullanıcı Hesapları";
var API_PERMS = "Abonelik İşlemleri → API İşlemleri → API Erişim İzinleri";
var API_ACTIVATE = "Abonelik İşlemleri → API İşlemleri → Aktifleştir";
var SEND = "/sms/v3/send";
var TEMPLATE = "/sms/v3/send/template";
var DIRECTORY = "/sms/v3/directory/send";
var OTP = "/sms/v3/send/otp";
var CANCEL = "/sms/v3/cancel";
var BALANCE = "/sms/v3/balance";
var SEND_PATHS = /* @__PURE__ */ new Set([SEND, DIRECTORY, TEMPLATE, OTP]);
var REPEAT = (id = "jobId") => `tekrarlıyorsa ${id} ile ${TEKNIK} adresine yazın`;
var TEXTS = {
  // --- SMS API (ApiError.code)
  UNAUTHENTICATED: "Bearer token yok, geçersiz ya da süresi dolmuş (refresh sonrası eski token, revoke ya da aynı hesapta başka kimlikle giriş de bu sonucu verir) → POST /auth/v3/token ile yeniden giriş yapıp isteği yeni token'la bir kez tekrarlayın; yine 401 ise kimlik bilgilerini ve hesabı kontrol edin. Token'ı önbellekte tutun, her istekte yeni token almayın.",
  SERVICE_UNAVAILABLE: `Servis geçici olarak kullanılamıyor → okuma, /send/otp ve /cancel isteklerini artan beklemeyle (1, 2, 4 sn) güvenle tekrar deneyebilirsiniz; /send ve /send/template'te görev kuyruğa alınmış olabilir (toplu gönderimi körlemesine yeniden göndermeden önce GET /report ile kontrol edin), /directory/send'de yeniden göndermeden önce GET /report ile kontrol etmelisiniz; uzun sürerse requestId ile ${TEKNIK} adresine yazın.`,
  E_SIGNATURE_REQUIRED: `Bu gönderim (/directory/send) için hesapta e-imza ile giriş gerekiyor; kodla çözülmez → Netgsm web paneline e-imza ile giriş yapın; sürerse requestId ile ${DESTEK} ile görüşün. Tekrar denemek sonucu değiştirmez.`,
  FORBIDDEN: `Hesap ya da alt kullanıcı bu işlemi yapamaz (alt kullanıcının SMS yetkisi yok, hesapta SMS gönderim/alım hizmeti açık değil ya da hedef operatöre gönderim yapılamıyor, ya da /send/otp'ta x-client başlığı hesabın OTP hizmetine uymuyor: kurumsal OTP hesabı x-client: enterprise gönderir, diğer hesaplar bu başlığı göndermez; message nedeni söyler) → alt kullanıcıysa önce ${SUB_USERS} bölümünde SMS yetkisini kontrol edin; değilse ya da sürüyorsa requestId ile ${DESTEK} ile görüşün. Tekrar denemek sonucu değiştirmez.`,
  ALREADY_EXISTS: "Hesapta bu türde bir webhook kaydı zaten var (var olanın üzerine yazılmaz) ya da hesap için başka bir kayıt sürüyor → adres değişecekse önce DELETE, sonra yeniden POST gönderin; başka bir kayıt sürüyorsa o tamamlanınca tekrar deneyin.",
  NOT_FOUND: "Adres ya da kayıt yok → yolu (/sms/v3 öneki dahil) ve jobId'yi kontrol edin; /stats'ta month'u görevin gönderildiği aya (yyyy-MM) ayarlayın; /cancel'da 404 bekleyen görev kalmadığı anlamına gelir.",
  INVALID_REQUEST: "İstek biçimi geçersiz → violations ve message'a göre isteği düzeltin (413'te gönderimi birden fazla isteğe bölün); aynı isteği değiştirmeden tekrar göndermek işe yaramaz.",
  INVALID_SEND_WINDOW: "Gönderim aralığı geçersiz → /send ve /send/template'te startAt en fazla 18 ay ileride olabilir; /directory/send'de stopAt, startAt'tan 1 ile 21 saat sonra olmalıdır. startAt / stopAt düzeltilmeden tekrar denemeyin.",
  REJECTED_HEADER: `Gönderici başlığı bu hesapta kullanılamıyor (message ret adını söyler) → GET /senders ile kayıtlı başlıkları ve usable / reason değerlerini görün, sender'ı kayıtlı hâliyle birebir (büyük/küçük harf dahil; /send/otp'ta harf farkı önemsizdir) yazın; gerekirse başlık talebi açın: ${SENDER_URL}`,
  REJECTED_IYS: `İstenen İYS filtresi uygulanamıyor (hesap İYS modunda değil ya da başlığın İYS marka kodu yok) → iysFilter kullanımını kontrol edin: ticari (marka/bayi) iletilerde doğru filtre kullanılır ve filtre kaldırılmaz, NONE yalnızca bilgilendirme iletileri içindir. Hesabı İYS moduna almak ya da başlığa marka kodu tanımlamak için requestId ile ${DESTEK} ile görüşün.`,
  NO_DELIVERABLE_MESSAGES: "Kayıtların hepsi reddedildi, görev oluşturulmadı → rejectedItems[].reason değerlerine göre kayıtları düzeltip yeni bir istekte gönderin; aynı gövdeyi tekrar göndermek işe yaramaz.",
  INSUFFICIENT_CREDIT: `Kredi, paket ya da kampanya yetersiz (OTP isteğinde hiçbir şey gönderilmedi; raporda failReason olarak görülürse o kayıt gönderilmedi) → paket tanımlayın ya da bakiye yükleyin (${PRICES_URL}), sonra tekrar deneyin.`,
  QUEUE_UNCONFIRMED: `İstek iletildi ama yanıtı alınamadı (/directory/send'de görev kuyruğa alınmış, /cancel'da görev iptal edilmiş olabilir) → gönderimi körlemesine tekrar göndermeyin (istekler tekilleştirilmez, gruplara iki kez SMS gider); önce GET /report ile kontrol edin, belirsizse requestId ile ${TEKNIK} adresine yazın. İptali yeniden göndermek güvenlidir: görev iptal edildiyse 404 döner.`,
  INTERNAL_ERROR: `Sunucuda beklenmeyen bir hata oluştu → okuma isteğiyse kısa süre sonra tekrar deneyin; gönderim isteğiyse gönderilmiş olabilir, körlemesine tekrar denemeyin, önce GET /report ile kontrol edin. Her durumda requestId ile ${TEKNIK} adresine bildirin.`,
  // --- Kayıt red nedenleri (RejectedMessage.reason)
  INVALID_RECIPIENT: "Numara eksik ya da biçimi yanlış → Türkiye için 90 ve 10 rakam (905061234567), yurt dışı için - ve ülke koduyla 9–17 rakam (-4915112345678) yazın; +, baştaki 0, 00, boşluk, parantez ya da ayraç tire kullanmayın.",
  INVALID_MESSAGE: "Metin eksik ya da boş → metni doldurup kaydı yeni bir istekte gönderin.",
  MESSAGE_TOO_LONG: "Metin, encoding ve gönderici türüne göre sınırı aşıyor (en fazla DEFAULT 917, TURKISH 888, UNICODE 396 karakter; alfanümerik başlıkta her sınır 5 eksik) → POST /length ile ölçün, metni kısaltın ya da uygun encoding'i seçin.",
  MALFORMED_ENTRY: "Kayıt null → messages (şablonda templates) dizisine null eleman eklemeyin.",
  DUPLICATE_RECIPIENT: "Aynı alıcı istekte daha sonra yeniden geçiyor; yalnızca son kayıt işlenir, öncekiler bu nedenle reddedilir → alıcıları istekte tekilleştirin.",
  NO_INTERNATIONAL_PERMISSION: `Numara yurt dışı ve hesabın yurt dışı gönderim izni yok → izin için destek ekibiyle iletişime geçin: ${CALL_CENTER} (+90 312 911 0 911) veya ${ABONE}.`,
  // --- Başlık (REJECTED_HEADER message / GET /senders reason) ayrıntıları
  NO_HEADERS_REGISTERED: `Hesapta kayıtlı gönderici başlığı yok → başlık talebi açın: ${SENDER_URL}`,
  CASE_MISMATCH: "Başlık kayıtlı ama büyük/küçük harfi farklı yazılmış → GET /senders'taki name değerini birebir kullanın.",
  NOT_REGISTERED: "sender hesaba kayıtlı değil → GET /senders ile kayıtlı başlıkları görün; abone numarası başında 0 ya da 90 olmadan yazılır (/send/otp'ta 0 ya da 90 ile de yazılabilir).",
  ROUTING_CODE_MISSING: `Alfanümerik başlık için hesapta yönlendirme kodu tanımlı değil → kodla çözülmez; requestId ile ${DESTEK} ile görüşün.`,
  SUBSCRIBER_NUMBER_RESTRICTED: `Hesapta abone numarasından gönderim kısıtlı → onaylı bir alfanümerik başlık kullanın ya da ${DESTEK} ile görüşün.`,
  // --- Identity (Problem.code)
  validation_failed: `Girdi doğrulanamadı → errors alanındaki her alanı düzeltin; scope olarak "sms" gönderin (boş ya da tanınmayan kapsamda errors.scope izin verilen değerleri listeler); kimlik bilgilerini query string'de değil gövdede gönderin.`,
  invalid_request: `İstek işlenemedi → gövdenin geçerli JSON ya da form olduğunu ve Content-Type başlığını kontrol edin; sürerse request_id ile ${TEKNIK} adresine yazın.`,
  invalid_credentials: "Kullanıcı adı ya da şifre hatalı (username abone numarasıdır; şifre giriş yapılan kimliğin, tercihen API alt kullanıcısının şifresidir) → bilgileri kontrol edin; aynı yanlış bilgiyle tekrar denemeyin: aynı kullanıcı adı ve IP'den dakikada 5 hatalı deneme too_many_failed_attempts getirir.",
  invalid_refresh_token: "Refresh token geçersiz, süresi dolmuş ya da oturum sonlandırılmış → POST /auth/v3/token ile yeniden giriş yapın.",
  invalid_token: "Access token eksik, geçersiz, süresi dolmuş ya da oturumu sonlandırılmış → refresh yerine POST /auth/v3/token ile yeniden giriş yapın ve isteği bir kez tekrarlayın; aynı hesapta API için tek kimlik kullanın.",
  login_not_permitted: `Bu hesapla giriş yapılamıyor → request_id ile destek ekibine başvurun: ${DESTEK}.`,
  api_access_denied: `Hesabın API erişimi yok → panelde ${API_ACTIVATE} yolundan API erişimini açın.`,
  ip_not_allowed: `Bu IP adresinden erişim izni yok → ${API_PERMS} bölümünde isteğin çıktığı (sunucunun dış) IP adresini yetkilendirin.`,
  country_not_allowed: `Yurt dışından erişim izni yok → ${API_PERMS} bölümünde ülke erişimini yetkilendirin.`,
  account_inactive: `Hesap aktif değil → request_id ile destek ekibine başvurun: ${DESTEK}.`,
  service_not_activated: `İstenen hizmet (SMS gönderim/alım) hesapta aktif değil; aktivasyon Netgsm'in sürecine bağlıdır, kod ya da panel çözümü yoktur → request_id ile ${DESTEK} ile görüşün.`,
  sub_user_not_permitted: `Alt kullanıcının SMS yetkisi yok → ${SUB_USERS} bölümünde kullanıcının yetkilerinde SMS hizmetini işaretleyin ya da aynı yerden Yeni Kayıt ile yeni bir API alt kullanıcısı oluşturun.`,
  too_many_failed_attempts: "Aynı kullanıcı adı ve IP'den dakikada 5 hatalı giriş → retry_after / Retry-After kadar bekleyin ve kimlik bilgisini düzeltin; başarılı giriş sayacı sıfırlar.",
  rate_limited: "İstek limiti aşıldı (örneğin her istekte token alınması) → Retry-After kadar bekleyin; token'ı önbellekte tutup süresi dolmadan yeniden kullanın.",
  not_found: "Adres bulunamadı → yolu (/auth/v3 öneki dahil) düzeltin.",
  method_not_allowed: "Bu HTTP metodu bu adreste desteklenmiyor → uç nokta tablosundaki (Allow başlığındaki) metodu kullanın.",
  payload_too_large: "İstek gövdesi çok büyük (1 MB'ı aşıyor) → gövdeyi küçültün.",
  internal_error: `Sunucuda beklenmeyen bir hata oluştu → bir süre sonra tekrar deneyin; sürerse request_id ile ${TEKNIK} adresine yazın.`,
  service_misconfigured: `Sunucu tarafı yapılandırma hatası → bir süre sonra tekrar deneyin; sürerse request_id ile ${TEKNIK} adresine yazın.`,
  service_unavailable: "Kimlik doğrulama altyapısına ulaşılamıyor → Retry-After varsa o kadar, yoksa bir süre bekleyip isteği güvenle tekrar deneyebilirsiniz.",
  https_required: "Gerçek API yalnızca HTTPS kabul eder → adresi https://ext-api.netgsm.com.tr/auth/v3 olarak kullanın (mock'ta http://127.0.0.1:4010 kullanılabilir).",
  // --- Gövdesiz yanıtlar
  not_acceptable: "406: Accept başlığı JSON'u kabul etmiyor (yanıtın gövdesi yok) → Accept: application/json gönderin ya da Accept başlığını kaldırın.",
  // --- İletim hata nedenleri (failReason); "Anlamı" spec'teki tanımdır
  INVALID_NUMBER: "Hatalı numara (yurt dışı numarada, kayıt kabul edildikten sonra hesabın yurt dışı izninin kaldırıldığı anlamına da gelebilir) → numarayı doğrulayıp listenizde işaretleyin; yurt dışı numarada izni kontrol edin.",
  NOT_SENT_TO_OPERATOR: `Operatöre gönderilemedi → ${REPEAT()}; yeniden gönderim sizin kararınızdır (yeni görev, yeni ücret).`,
  OPERATOR_REJECTED: `Operatör kabul etmedi → ${REPEAT()}.`,
  OPERATOR_ERROR: `Operatör hatası → ${REPEAT()}.`,
  SEND_ERROR: `Gönderim hatası → ${REPEAT()}.`,
  DUPLICATE: "Mükerrer gönderim → akışınızda aynı mesajın iki kez gönderilip gönderilmediğini (örneğin 503 ya da 504 sonrası körlemesine tekrar) kontrol edin.",
  BLACKLISTED: "Numara kara listede → GET /blacklist?number=... ile kontrol edin; bu numaraya göndermeyin.",
  IYS_REJECTED: `İYS reddi (spec nedeni ayrıntılandırmaz) → alıcının, gönderimde kullanılan iysFilter (marka/bayi) için İYS izni olup olmadığını kontrol edin; netleşmezse jobId ile ${TEKNIK} adresine yazın.`,
  IYS_ERROR: `İYS kontrolü yapılamadı → ${REPEAT()}.`,
  MESSAGE_NOT_CREATED: `Mesaj oluşturulamadı → jobId ile ${TEKNIK} adresine yazın.`,
  INVALID_NUMBER_FORMAT: "Hatalı numara biçimi → numara biçimini düzeltin.",
  NTS_NOT_APPROVED: `NTS onayı alınamadı (dokümanda ayrıntı yok) → jobId ile ${TEKNIK} adresine yazın.`,
  REPORT_NOT_FORWARDED: `Rapor iletilemedi; bu satır mesajın alıcıya ulaşıp ulaşmadığını göstermeyebilir → körlemesine yeniden göndermeyin (alıcıya iki mesaj ulaşabilir); gerekirse jobId ile ${TEKNIK} adresine yazın.`,
  SMS_DISABLED_ON_DEVICE: "Mobil cihaz SMS almaya kapalı → alıcı tarafında çözülür.",
  DEVICE_NOT_SUPPORTED: "Mobil cihaz desteklemiyor → alıcı tarafında çözülür.",
  ROUTING_FAILED: `Yönlendirme başarısız → ${REPEAT()}.`,
  OPERATOR_TIMEOUT: "Hedef operatörde zaman aşımı oluştu → gerekirse daha sonra yeniden gönderin.",
  UNKNOWN_SUBSCRIBER: "Tanımlanamayan abone → numarayı doğrulayın.",
  ILLEGAL_SUBSCRIBER: "Uyumsuz abone → numarayı doğrulayın.",
  SYSTEM_ERROR: `Sistemsel hata → ${REPEAT()}.`,
  TIMEOUT: "Zaman aşımı → gerekirse daha sonra yeniden gönderin.",
  UNKNOWN: `Tanımlı olmayan bir neden → jobId ile ${TEKNIK} adresine yazın.`
};
function contextual(code, { path, hasRetryAfter } = {}) {
  const isSend = typeof path === "string" && SEND_PATHS.has(path);
  if (code === "INTERNAL_ERROR" && typeof path === "string") {
    if (path === OTP) return `Sunucuda beklenmeyen bir hata oluştu; OTP gönderilmiş olabilir → otomatik tekrar göndermeyin (alıcıya iki farklı şifre ulaşabilir); OTP iletimleri GET /report ile sorgulanamaz, durum için requestId ile ${TEKNIK} adresine yazın.`;
    if (isSend) return `Sunucuda beklenmeyen bir hata oluştu; doküman kuyruk durumunu söylemez, gönderim kuyruğa alınmış ya da gönderilmiş olabilir → körlemesine tekrar denemeyin (çift SMS riski); önce GET /report ile kontrol edin, belirsizse requestId ile ${TEKNIK} adresine yazın.`;
    return `Sunucuda beklenmeyen bir hata oluştu → okuma isteğini kısa süre sonra tekrar deneyebilirsiniz; sürerse requestId ile ${TEKNIK} adresine yazın.`;
  }
  if (code === "QUEUE_UNCONFIRMED" && path === DIRECTORY) {
    return `Gönderim platforma iletildi ama yanıtı alınamadı; görev kuyruğa alınmış olabilir → aynı isteği körlemesine tekrar göndermeyin (gruplara iki kez SMS gider); yeniden göndermeden önce GET /report ile kontrol etmelisiniz, belirsizse requestId ile ${TEKNIK} adresine yazın.`;
  }
  if (code === "QUEUE_UNCONFIRMED" && path === CANCEL) {
    return `İptal iletildi ama yanıtı alınamadı; görev iptal edilmiş olabilir → iptali yeniden gönderebilirsiniz, iptal isteğini tekrarlamak SMS göndermez: görev iptal edildiyse 404 döner; emin olamıyorsanız requestId ile ${TEKNIK} adresine yazın.`;
  }
  if (code === "SERVICE_UNAVAILABLE" && typeof path === "string") {
    if (path === SEND || path === TEMPLATE) return `Servis geçici olarak kullanılamıyor; görev çoğunlukla kuyruğa alınmamıştır, ama bu kesin değildir → toplu gönderimi körlemesine yeniden göndermeden önce GET /report ile kontrol edin (istekler tekilleştirilmez, çift SMS riski); kayıt yoksa artan beklemeyle (1, 2, 4 sn) tekrar deneyebilirsiniz; sürerse requestId ile ${TEKNIK} adresine yazın.`;
    if (path === DIRECTORY) return `Platforma ulaşılamadı, platform bir hata döndü ya da görev numarası vermedi; görev kuyruğa alınmış olabilir → yeniden göndermeden önce GET /report ile kontrol etmelisiniz (aynı istek iki kez gönderilirse gruplara iki kez SMS gider); sürerse requestId ile ${TEKNIK} adresine yazın.`;
    if (path === OTP) return `Servis ya da OTP kanalı geçici olarak kullanılamıyor; hiçbir şey gönderilmedi → aynı isteği artan beklemeyle (1, 2, 4 sn) güvenle tekrar deneyebilirsiniz; sürerse requestId ile ${TEKNIK} adresine yazın.`;
    if (path === CANCEL) return `İptal servisine ulaşılamadı; görev büyük olasılıkla iptal edilmedi → iptali artan beklemeyle güvenle tekrar deneyebilirsiniz (görev bu arada iptal edildiyse 404 döner); sürerse requestId ile ${TEKNIK} adresine yazın.`;
    return `Servis geçici olarak kullanılamıyor; hiçbir şey yapılmadı → aynı isteği artan beklemeyle (1, 2, 4 sn) güvenle tekrar deneyebilirsiniz; uzun sürerse requestId ile ${TEKNIK} adresine yazın.`;
  }
  if (code === "RATE_LIMITED" && path === BALANCE) {
    return "Bakiye sorgu sınırı (hesap başına dakikada 60 istek) aşıldı → Retry-After kadar bekleyip yeniden deneyin; bakiyeyi döngüde ya da her gönderimden önce sorgulamayın, büyük bir kampanyadan önce bir kez bakın (yanıt zaten 10 sn önbellekte tutulur).";
  }
  if (code === "RATE_LIMITED") {
    if (hasRetryAfter === false) return `Hesabın gönderimi askıya alınmış (sending is suspended, Retry-After yok) → beklemeyin ve tekrar denemeyin, beklemek işe yaramaz; requestId ile ${DESTEK} ile görüşün.`;
    if (hasRetryAfter === true) return "Uç noktanın istek sınırı aşıldı → Retry-After başlığındaki saniye kadar bekleyip yeniden deneyin; alıcıları toplu gönderin, rapor için sık sorgulama yerine webhook kullanın.";
    return `İstek sınırı aşıldı ya da gönderim askıya alındı (message hangisi olduğunu söyler) → Retry-After varsa o kadar bekleyip yeniden deneyin; Retry-After yoksa gönderim askıya alınmıştır, tekrar denemeyin ve ${DESTEK} ile görüşün.`;
  }
  return null;
}
function explain(code, context = {}) {
  const c = contextual(code, context);
  if (c) return c;
  const t = TEXTS[code];
  if (t) return t;
  return `Tanınmayan kod (${String(code)}) → yanıt gövdesindeki message alanını okuyun; sürerse requestId ile ${TEKNIK} adresine yazın.`;
}

// packages/sms-mock/src/advisor.mjs
var SEND2 = "/sms/v3/send";
var TEMPLATE2 = "/sms/v3/send/template";
var DIRECTORY2 = "/sms/v3/directory/send";
var REPORT = "/sms/v3/report";
var BALANCE2 = "/sms/v3/balance";
var UNCONFIRMED_PATHS = /* @__PURE__ */ new Set([SEND2, TEMPLATE2, DIRECTORY2]);
var BODY_CAUSED = /* @__PURE__ */ new Set(["INVALID_REQUEST", "NO_DELIVERABLE_MESSAGES", "INVALID_SEND_WINDOW"]);
var NON_RETRYABLE_STATUS = /* @__PURE__ */ new Set([400, 413, 422]);
var REPEAT_WINDOW_MS = 6e4;
var BURST_WINDOW_MS = 1e4;
var BURST_COUNT = 5;
var CHURN_WINDOW_MS = 6e4;
var CHURN_COUNT = 3;
var BALANCE_WINDOW_MS = 6e4;
var BALANCE_COUNT = 10;
var EMIT_INTERVAL_MS = 6e4;
var MAX_FINDINGS = 500;
var MAX_TRACKED = 5e3;
var TOKEN_ADVICE = "token'ı önbellekte tutun, süresi dolmadan (expires_in) POST /auth/v3/token/refresh ile refresh edin; SMS API'den 401 UNAUTHENTICATED ya da Identity'den 401 invalid_token alırsanız yeniden giriş yapın ve isteği bir kez tekrarlayın.";
function jobsOf(query) {
  if (!query) return [];
  const p = new URLSearchParams(query);
  return [...new Set([...p.getAll("jobId"), ...p.getAll("jobIds")].flatMap((v) => v.split(",")).map((s) => s.trim()).filter(Boolean))];
}
function createAdvisor({ clock }) {
  let found = [];
  let lastEmit = /* @__PURE__ */ new Map();
  let bursts = /* @__PURE__ */ new Map();
  let tokens = /* @__PURE__ */ new Map();
  let balanceReads = /* @__PURE__ */ new Map();
  let unconfirmed = /* @__PURE__ */ new Map();
  let failedBodies = /* @__PURE__ */ new Map();
  let blockedUntil = /* @__PURE__ */ new Map();
  function recent(map, key, now, windowMs) {
    const list = (map.get(key) ?? []).filter((t) => now - t < windowMs);
    map.set(key, list);
    return list;
  }
  function observe(e) {
    const now = e.at ?? clock.now();
    const key = e.accountId ?? e.username ?? e.ip ?? "anon";
    const out = [];
    const emit = (rule, severity, message) => {
      const k = `${rule}|${key}`;
      const prev = lastEmit.get(k);
      if (prev !== void 0 && now - prev < EMIT_INTERVAL_MS) return;
      lastEmit.set(k, now);
      const f = { rule, severity, message, requestId: e.requestId, at: new Date(clock.now()).toISOString() };
      out.push(f);
      found.push(f);
      if (found.length > MAX_FINDINGS) found.shift();
    };
    if (e.method === "POST" && e.path === SEND2 && e.messageCount === 1 && e.status >= 200 && e.status < 300) {
      const list = recent(bursts, key, now, BURST_WINDOW_MS);
      list.push(now);
      if (list.length >= BURST_COUNT) {
        emit(
          "SINGLE_RECIPIENT_BURST",
          "warn",
          `${BURST_WINDOW_MS / 1e3} saniyede ${list.length} tek alıcılı /send isteği gönderdiniz → alıcıları tek istekte messages dizisine toplayın; her alıcı için ayrı istek hız sınırına daha çabuk takılır ve gereksiz yük oluşturur.`
        );
      }
    }
    if (e.method === "POST" && e.path === "/auth/v3/token" && e.status === 200) {
      const user = e.username ?? key;
      const list = recent(tokens, user, now, CHURN_WINDOW_MS);
      list.push(now);
      if (list.length >= CHURN_COUNT) {
        emit(
          "TOKEN_CHURN",
          "warn",
          `Aynı kullanıcı için ${CHURN_WINDOW_MS / 1e3} saniyede ${list.length} kez token alındı → her istekte yeni token almayın; ${TOKEN_ADVICE}`
        );
      }
    }
    if (e.method === "GET" && e.path === REPORT && e.status === 200) {
      for (const k of [...unconfirmed.keys()]) if (k.startsWith(`${key}|`)) unconfirmed.delete(k);
    }
    const unconfirmedKey = e.bodyHash && UNCONFIRMED_PATHS.has(e.path) ? `${key}|${e.path}|${e.bodyHash}` : null;
    const first = unconfirmedKey ? unconfirmed.get(unconfirmedKey) : void 0;
    if (first) {
      const label = `${first.status} ${first.code ?? ""}`.trim();
      if (e.path === DIRECTORY2) {
        emit(
          "RETRY_AFTER_QUEUE_UNCONFIRMED",
          "error",
          `/directory/send'de ${label} alan bir gönderimin aynı gövdesi GET /report ile kontrol edilmeden yeniden gönderildi → ilk istek kuyruğa alınmış olabilir, bu gruplara iki kez SMS demektir; yeniden göndermeden önce GET /report ile kontrol etmelisiniz, belirsizse ilk yanıttaki requestId ile teknikdestek@netgsm.com.tr adresine yazın.`
        );
      } else {
        emit(
          "RETRY_AFTER_QUEUE_UNCONFIRMED",
          "warn",
          `${e.path} isteği ${label} aldıktan sonra aynı gövde GET /report ile kontrol edilmeden yeniden gönderildi; ilk görev kuyruğa alınmıştı → 503 çoğunlukla hiçbir şeyin kuyruğa alınmadığını gösterir ama görev kuyruğa alınmış olabilir, körlemesine tekrar çift SMS demektir; toplu gönderimi yeniden göndermeden önce GET /report ile kontrol edin.`
        );
      }
    }
    if (unconfirmedKey && (e.path === DIRECTORY2 && (e.status === 503 || e.status === 504) || e.status === 503 && e.mayHaveBeenQueued)) {
      unconfirmed.delete(unconfirmedKey);
      unconfirmed.set(unconfirmedKey, { status: e.status, code: e.code });
      if (unconfirmed.size > MAX_TRACKED) unconfirmed.delete(unconfirmed.keys().next().value);
    }
    if (e.bodyHash) {
      const k = `${key}|${e.path}|${e.bodyHash}`;
      const failedAt = failedBodies.get(k);
      if (failedAt !== void 0 && now - failedAt >= REPEAT_WINDOW_MS) failedBodies.delete(k);
      if (failedAt !== void 0 && now - failedAt < REPEAT_WINDOW_MS) {
        emit(
          "RETRY_NON_RETRYABLE",
          "warn",
          `${e.method} ${e.path} aynı gövdeyle tekrar gönderildi ve daha önce ${e.code ?? "bir hata"} almıştı → bu hata gövdeden kaynaklanıyor, tekrarla düzelmez; gövdeyi düzeltmeden yeniden denemeyin. ${e.code ? explain(e.code, { path: e.path }) : ""}`.trim()
        );
      }
      if (e.status < 300) failedBodies.delete(k);
      else if (NON_RETRYABLE_STATUS.has(e.status) && BODY_CAUSED.has(e.code)) {
        failedBodies.delete(k);
        failedBodies.set(k, now);
        if (failedBodies.size > MAX_TRACKED) failedBodies.delete(failedBodies.keys().next().value);
      }
    }
    const jobIds = e.path === "/sms/v3/report" || e.path === "/sms/v3/stats" ? jobsOf(e.query) : [];
    const baseKey = `${key}|${e.path}`;
    const checkKeys = [baseKey, ...jobIds.map((id) => `${baseKey}|${id}`)];
    const until = Math.max(-Infinity, ...checkKeys.map((k) => blockedUntil.get(k) ?? -Infinity));
    if (until !== -Infinity) {
      if (now < until) {
        emit(
          "IGNORED_RETRY_AFTER",
          "warn",
          `${e.path} için Retry-After süresi dolmadan (${Math.ceil((until - now) / 1e3)} sn kaldı) yeni istek gönderildi → 429 yanıtındaki Retry-After süresini bekleyin, sonra yeniden deneyin.`
        );
      } else for (const k of checkKeys) blockedUntil.delete(k);
    }
    if (e.status === 429 && typeof e.retryAfterSec === "number" && e.retryAfterSec > 0) {
      const keys = e.perJob && jobIds.length > 0 ? jobIds.map((id) => `${baseKey}|${id}`) : [baseKey];
      for (const k of keys) blockedUntil.set(k, now + e.retryAfterSec * 1e3);
      if (blockedUntil.size > MAX_TRACKED) blockedUntil.delete(blockedUntil.keys().next().value);
    }
    if (e.tokenState === "revoked" || e.tokenState === "superseded" || e.tokenState === "expired") {
      const why = e.tokenState === "revoked" ? "POST /auth/v3/token/revoke ile iptal edilmiş (revoke)" : e.tokenState === "expired" ? "süresi dolmuş (expires_in geçmiş)" : "yenisiyle değiştirilmiş (aynı oturum refresh edilmiş ya da aynı hesapta diğer kimliğin girişi eskisini kapatmış)";
      emit(
        "STALE_TOKEN",
        "warn",
        `Kullandığınız token ${why} → eski token'ı atın; ${TOKEN_ADVICE}`
      );
    }
    if (e.status === 429 && (e.path === "/sms/v3/report" || e.path === "/sms/v3/stats")) {
      emit(
        "REPORT_POLLING",
        "warn",
        `${e.path} sorgulamasında sınıra takıldınız (aynı görev kısa sürede tekrar sorgulandı) → durumu sık sık sorgulamak yerine webhook kullanın: POST /sms/v3/webhooks/report ile iletim raporunu size göndersin.`
      );
    }
    if (e.method === "GET" && e.path === BALANCE2) {
      const list = recent(balanceReads, key, now, BALANCE_WINDOW_MS);
      list.push(now);
      if (e.status === 429 || list.length >= BALANCE_COUNT) {
        emit(
          "BALANCE_POLLING",
          "warn",
          `${BALANCE_WINDOW_MS / 1e3} saniyede ${list.length} bakiye sorgusu (GET /sms/v3/balance) gönderdiniz → bakiyeyi döngüde ya da her gönderimden önce sorgulamayın; büyük bir kampanyadan önce bir kez bakın. Yanıt 10 sn önbellekte tutulur, sık sorgu yeni bilgi getirmez; sınır hesap başına dakikada 60 istektir.`
        );
      }
    }
    return out;
  }
  return {
    observe,
    findings: () => found.map((f) => ({ ...f })),
    clear() {
      found = [];
      lastEmit = /* @__PURE__ */ new Map();
      bursts = /* @__PURE__ */ new Map();
      tokens = /* @__PURE__ */ new Map();
      balanceReads = /* @__PURE__ */ new Map();
      unconfirmed = /* @__PURE__ */ new Map();
      failedBodies = /* @__PURE__ */ new Map();
      blockedUntil = /* @__PURE__ */ new Map();
    }
  };
}

// packages/sms-mock/src/clock.mjs
function createClock() {
  let offset = 0;
  return {
    now: () => Date.now() + offset,
    advance(ms) {
      offset += ms;
    },
    reset() {
      offset = 0;
    }
  };
}

// packages/sms-mock/src/ids.mjs
import { randomBytes, randomUUID } from "node:crypto";
function smsRequestId() {
  return randomBytes(16).toString("hex");
}
function identityRequestId() {
  return randomUUID();
}

// packages/sms-mock/src/sms/api-error.mjs
function smsError(status, code, message, extras = {}, headers = {}) {
  return {
    status,
    headers,
    body: { code, message, requestId: void 0, timestamp: void 0, violations: null, ...extras }
  };
}
var UNREADABLE_BODY = "request body could not be read as json";
function fieldsRejected(violations) {
  return smsError(400, "INVALID_REQUEST", `${violations.length} field(s) rejected`, { violations });
}

// packages/sms-mock/src/identity/problem.mjs
var TYPES = {
  validation_failed: [422, "invalid_request", "Doğrulama hatası", "Girilen bilgiler eksik veya hatalı.", "The given data is missing or invalid."],
  invalid_request: [400, "invalid_request", "Geçersiz istek", "İstek işlenemedi.", "The request could not be processed."],
  invalid_credentials: [401, "invalid_grant", "Kimlik doğrulanamadı", "Kullanıcı adı veya şifre hatalı.", "Username or password is incorrect."],
  invalid_refresh_token: [401, "invalid_grant", "Geçersiz refresh token", "Oturum süresi dolmuş veya sonlandırılmış. Lütfen yeniden giriş yapın.", "The session has expired or been terminated. Please sign in again."],
  invalid_token: [401, "invalid_token", "Geçersiz access token", "Oturum bulunamadı veya süresi dolmuş.", "Session not found or expired."],
  login_not_permitted: [403, "access_denied", "Giriş izni yok", "Bu hesapla giriş yapılamıyor.", "This account cannot sign in."],
  api_access_denied: [403, "access_denied", "API erişimi kapalı", "Hesabınızın API erişimi bulunmuyor.", "This account does not have API access."],
  ip_not_allowed: [403, "access_denied", "IP adresine izin verilmiyor", "Bu IP adresinden erişim izni bulunmuyor.", "Access from this IP address is not permitted."],
  country_not_allowed: [403, "access_denied", "Yurt dışı erişim izni yok", "Hesabınızın yurt dışından erişim izni bulunmuyor.", "This account is not permitted to sign in from abroad."],
  account_inactive: [403, "access_denied", "Hesap aktif değil", "Hesabınız aktif değil.", "This account is not active."],
  service_not_activated: [403, "invalid_scope", "Hizmet aktif değil", "Hesabınızda istenen hizmet aktif değil.", "The requested service is not active on this account."],
  sub_user_not_permitted: [403, "invalid_scope", "Alt kullanıcı yetkisi yok", "Alt kullanıcınızın istenen hizmete yetkisi bulunmuyor.", "The sub-user is not permitted to use the requested service."],
  too_many_failed_attempts: [429, "invalid_grant", "Çok fazla hatalı deneme", "Çok fazla hatalı deneme yapıldı. Lütfen daha sonra tekrar deneyin.", "Too many failed attempts. Please try again later."],
  rate_limited: [429, "temporarily_unavailable", "İstek limiti aşıldı", "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.", "Too many requests. Please try again later."],
  not_found: [404, "invalid_request", "Bulunamadı", "İstenen adres bulunamadı.", "The requested resource was not found."],
  method_not_allowed: [405, "invalid_request", "Metot desteklenmiyor", "Bu HTTP metodu bu adres için desteklenmiyor.", "This HTTP method is not supported for this resource."],
  payload_too_large: [413, "invalid_request", "İstek çok büyük", "İstek gövdesi izin verilen boyutu aşıyor.", "The request body exceeds the allowed size."],
  internal_error: [500, "server_error", "Sunucu hatası", "Beklenmeyen bir hata oluştu.", "An unexpected error occurred."],
  service_misconfigured: [502, "temporarily_unavailable", "Servis yapılandırma hatası", "Kimlik doğrulama servisi şu an isteği işleyemiyor.", "The authentication service cannot process the request right now."],
  service_unavailable: [503, "temporarily_unavailable", "Servis kullanılamıyor", "Kimlik doğrulama servisine şu an ulaşılamıyor. Lütfen daha sonra tekrar deneyin.", "The authentication service is currently unavailable. Please try again later."]
};
function problem(code, opts = {}) {
  const t = TYPES[code];
  if (!t) throw new Error(`unknown problem code: ${code}`);
  const [status, error, title, detail, description] = t;
  const headers = { "Content-Type": "application/problem+json" };
  if (status === 401) headers["WWW-Authenticate"] = error === "invalid_token" ? 'Bearer error="invalid_token"' : "Bearer";
  if (opts.retryAfterSec !== void 0) headers["Retry-After"] = String(opts.retryAfterSec);
  return {
    status,
    headers,
    body: {
      type: `urn:problem-type:identity:${code.replaceAll("_", "-")}`,
      title,
      status,
      detail,
      instance: opts.instance,
      code,
      request_id: void 0,
      error,
      error_description: description,
      ...opts.extras
    }
  };
}

// packages/sms-mock/src/ratelimit.mjs
function createFixedWindowLimiter({ limit, windowMs, countRejected, clock, rateScale: rateScale2 = 1, registry }) {
  const effective = Math.max(1, Math.ceil(limit * rateScale2));
  const windows = /* @__PURE__ */ new Map();
  const limiter = {
    reset() {
      windows.clear();
    },
    hit(key) {
      const now = clock.now();
      let w = windows.get(key);
      if (!w || now >= w.start + windowMs) {
        w = { start: now, count: 0 };
        windows.set(key, w);
      }
      const allowed = w.count < effective;
      if (allowed || countRejected) w.count++;
      const resetSec = Math.max(1, Math.ceil((w.start + windowMs - now) / 1e3));
      return {
        allowed,
        limit: effective,
        count: w.count,
        // penceredeki sayılan istek (countRejected=false iken reddedilenler hariç)
        remaining: Math.max(0, effective - w.count),
        resetSec,
        retryAfterSec: allowed ? 0 : resetSec
      };
    }
  };
  registry?.push(limiter);
  return limiter;
}

// packages/sms-mock/src/identity/routes.mjs
var WINDOW_MS = 6e4;
var FAILED_LIMIT = 5;
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var SERVICES = ["sms", "voice", "voice-sms", "voicemail", "fax", "netsantral", "netasistan", "digital-services", "financial"];
var SUB_SCOPES = [
  "sms:send",
  "sms:receive",
  "sms:send:gsm",
  "sms:receive:gsm",
  "voice:outgoing",
  "voice:incoming",
  "voice:outgoing:gsm",
  "voice:incoming:gsm",
  "fax:send",
  "fax:receive"
];
var ALLOWED_SCOPES = ["profile", "contact", "email", ...SERVICES, ...SUB_SCOPES];
var SERVICE_FIELDS = ["username", "user_code", "contract_accepted", "sub_user_id", "sub_user"];
var PROFILE_FIELDS = ["username", "user_code", "first_name", "last_name", "email", "contract_accepted"];
var ALL_FIELDS = [...PROFILE_FIELDS, "sub_user_id", "sub_user"];
var FIELDS_BY_SCOPE = {
  profile: PROFILE_FIELDS,
  contact: ["first_name", "last_name", "email"],
  email: ["email"],
  financial: ALL_FIELDS
};
var serviceOf = (scope) => scope.split(":")[0];
var actionOf = (scope) => scope.split(":")[1];
function validationFailed(errors) {
  return problem("validation_failed", { extras: { errors } });
}
function bodyFields(req) {
  const j = req.json;
  return j && typeof j === "object" && !Array.isArray(j) ? j : {};
}
function credentialsInQuery(req, names) {
  const errors = {};
  for (const n of names) {
    if (req.query.has(n)) errors[n] = [`${n} alanı query string ile gönderilemez; istek gövdesinde gönderin.`];
  }
  return Object.keys(errors).length ? errors : null;
}
function parseScope(raw) {
  const allowed = `İzin verilen değerler: ${ALLOWED_SCOPES.join(", ")}.`;
  if (typeof raw !== "string" || raw.trim() === "") return { errors: [`Kapsam alanı zorunludur. ${allowed}`] };
  if (raw.length > 255) return { errors: ["Kapsam en fazla 255 karakter olabilir."] };
  const list = [...new Set(raw.trim().split(/\s+/))];
  const bad = list.filter((s) => !ALLOWED_SCOPES.includes(s));
  if (bad.length) return { errors: [`Geçersiz kapsam: ${bad.join(" ")}. ${allowed}`] };
  const scopes = list.filter((s) => !(SERVICES.includes(s) && list.some((o) => o !== s && o.startsWith(`${s}:`))));
  return { scopes };
}
var NO_ACTIVATION = ["financial", "digital-services", "voice-sms"];
function activationOk(account, scope) {
  const service = serviceOf(scope);
  if (NO_ACTIVATION.includes(service)) return true;
  if (service !== "sms") return account.activations.other;
  const action = actionOf(scope);
  if (action === "send") return account.activations.send;
  if (action === "receive") return account.activations.receive;
  return account.activations.send || account.activations.receive;
}
function meBody(account, login, scopeStr) {
  const scopes = scopeStr.split(" ");
  let fields;
  if (scopes.length >= 5) fields = ALL_FIELDS;
  else {
    const first = scopes[0];
    fields = FIELDS_BY_SCOPE[first] ?? SERVICE_FIELDS;
  }
  const values2 = {
    username: account.username,
    user_code: account.subscriberCode,
    first_name: account.firstName,
    last_name: account.lastName,
    email: account.email,
    contract_accepted: true,
    sub_user_id: login.subUserId,
    sub_user: login.subUser
  };
  const body = { user_id: account.userId };
  for (const f of fields) body[f] = values2[f];
  return body;
}
function tokenBody(session, account) {
  return {
    access_token: session.accessToken,
    token_type: "Bearer",
    expires_in: session.expiresIn,
    refresh_token: session.refreshToken,
    scope: session.scope,
    user_id: account.userId,
    sub_user_id: session.login.subUserId
  };
}
function registerIdentityRoutes(ctx) {
  const { clock } = ctx;
  const rateScale2 = ctx.opts.rateScale;
  const mk = (limit2) => createFixedWindowLimiter({ limit: limit2, windowMs: WINDOW_MS, countRejected: false, clock, rateScale: rateScale2, registry: ctx.resettables });
  const tokenIp = mk(30);
  const refreshIp = mk(60);
  const meToken = mk(60);
  const meIp = mk(300);
  const failedLimit = Math.max(1, Math.ceil(FAILED_LIMIT * rateScale2));
  const failed = /* @__PURE__ */ new Map();
  ctx.resettables.push({ reset: () => failed.clear() });
  const failedWindow = (key) => {
    const w = failed.get(key);
    if (w && clock.now() >= w.start + WINDOW_MS) {
      failed.delete(key);
      return void 0;
    }
    return w;
  };
  function limit(limiters) {
    const results = limiters.map(([l, key]) => l.hit(key));
    const rejected = results.find((r2) => !r2.allowed);
    const r = rejected ?? results.reduce((a, b) => b.remaining < a.remaining ? b : a);
    const headers = {
      "RateLimit-Limit": String(r.limit),
      "RateLimit-Remaining": String(r.remaining),
      "RateLimit-Reset": String(r.resetSec),
      "RateLimit-Policy": `${r.limit};w=${WINDOW_MS / 1e3}`
    };
    const blocked = rejected ? problem("rate_limited", { retryAfterSec: rejected.retryAfterSec, extras: { retry_after: rejected.retryAfterSec } }) : null;
    return { headers, blocked };
  }
  const withHeaders = (out, headers) => ({ ...out, headers: { ...out.headers, ...headers } });
  function bearer(req) {
    const m = /^Bearer\s+(\S+)$/i.exec(String(req.headers.authorization || ""));
    return m && m[1].length <= 4096 ? m[1] : null;
  }
  ctx.routes.add("POST", "/auth/v3/token", (req) => {
    const { headers, blocked } = limit([[tokenIp, req.ip]]);
    if (blocked) return withHeaders(blocked, headers);
    const reply = (out) => withHeaders(out, headers);
    const queryErrors = credentialsInQuery(req, ["username", "password"]);
    if (queryErrors) return reply(validationFailed(queryErrors));
    const f = bodyFields(req);
    const errors = {};
    if (typeof f.username !== "string" || f.username === "") errors.username = ["Kullanıcı adı alanı zorunludur."];
    else if (f.username.length > 255) errors.username = ["Kullanıcı adı en fazla 255 karakter olabilir."];
    if (typeof f.password !== "string" || f.password === "") errors.password = ["Şifre alanı zorunludur."];
    else if (f.password.length > 255) errors.password = ["Şifre en fazla 255 karakter olabilir."];
    const parsed = parseScope(f.scope);
    if (parsed.errors) errors.scope = parsed.errors;
    if (Object.keys(errors).length) return reply(validationFailed(errors));
    const failKey = `${f.username}|${req.ip}`;
    const w = failedWindow(failKey);
    if (w && w.count >= failedLimit) {
      const retry = Math.max(1, Math.ceil((w.start + WINDOW_MS - clock.now()) / 1e3));
      return reply(problem("too_many_failed_attempts", { retryAfterSec: retry, extras: { retry_after: retry } }));
    }
    const login = ctx.accounts.login(f.username, f.password);
    if (!login) {
      const cur = failedWindow(failKey) ?? { start: clock.now(), count: 0 };
      cur.count++;
      failed.set(failKey, cur);
      return reply(problem("invalid_credentials"));
    }
    failed.delete(failKey);
    const account = ctx.accounts.get(login.accountId);
    if (!account.active) return reply(problem("account_inactive"));
    if (!account.apiAccess) return reply(problem("api_access_denied"));
    if (!account.ipAllowed) return reply(problem("ip_not_allowed"));
    if (!account.countryAllowed) return reply(problem("country_not_allowed"));
    const serviceScopes = parsed.scopes.filter((s) => SERVICES.includes(serviceOf(s)));
    if (login.subUserId !== 0) {
      const denied = login.smsPermission ? [] : serviceScopes;
      if (denied.length) return reply(problem("sub_user_not_permitted", { extras: { denied_scopes: denied } }));
    }
    const notActive = serviceScopes.filter((s) => !activationOk(account, s));
    if (notActive.length) return reply(problem("service_not_activated", { extras: { denied_scopes: notActive } }));
    const session = ctx.sessions.open(login, parsed.scopes.join(" "));
    return reply({ status: 200, body: tokenBody(session, ctx.accounts.get(session.login.accountId)) });
  });
  ctx.routes.add("POST", "/auth/v3/token/refresh", (req) => {
    const { headers, blocked } = limit([[refreshIp, req.ip]]);
    if (blocked) return withHeaders(blocked, headers);
    const reply = (out) => withHeaders(out, headers);
    const queryErrors = credentialsInQuery(req, ["refresh_token"]);
    if (queryErrors) return reply(validationFailed(queryErrors));
    const f = bodyFields(req);
    if (typeof f.refresh_token !== "string" || f.refresh_token === "") {
      return reply(validationFailed({ refresh_token: ["Refresh token alanı zorunludur."] }));
    }
    if (!UUID_RE.test(f.refresh_token)) return reply(problem("invalid_refresh_token"));
    const session = ctx.sessions.refresh(f.refresh_token.toLowerCase());
    if (!session) return reply(problem("invalid_refresh_token"));
    return reply({ status: 200, body: tokenBody(session, ctx.accounts.get(session.login.accountId)) });
  });
  function authed(req, run) {
    const token = bearer(req);
    const { headers, blocked } = limit([[meToken, token ?? `-${req.ip}`], [meIp, req.ip]]);
    if (blocked) return withHeaders(blocked, headers);
    const resolved = token ? ctx.sessions.resolve(token) : { error: "invalid" };
    if (resolved.error) return withHeaders(problem("invalid_token"), headers);
    return withHeaders(run(token, resolved), headers);
  }
  ctx.routes.add("GET", "/auth/v3/me", (req) => authed(req, (_token, { session, login }) => ({
    status: 200,
    body: meBody(ctx.accounts.get(login.accountId), login, session.scope)
  })));
  ctx.routes.add("POST", "/auth/v3/token/revoke", (req) => authed(req, (token) => {
    ctx.sessions.revoke(token);
    return { status: 204 };
  }));
}

// packages/sms-mock/src/generated/specs.mjs
var smsSpec = {
  "openapi": "3.0.3",
  "info": {
    "title": "Netgsm SMS API",
    "version": "3.0",
    "description": 'Bu API ile SMS gönderebilir, iletim raporlarını takip edebilir ve size gelen SMS\'leri\nokuyabilirsiniz.\n\n## Kimlik doğrulama\n\nHer isteğe `Authorization: Bearer <token>` başlığını eklemelisiniz. Token\'ı Netgsm\nAuthorization API\'nin `POST https://ext-api.netgsm.com.tr/auth/v3/token` ucundan, kullanıcı adınız ve şifrenizle alırsınız.\nSMS API için token alırken `scope` olarak `sms` göndermelisiniz:\n\n```json\n{\n  "username": "312XXXXXXX",\n  "password": "XXXXXXX",\n  "scope": "sms"\n}\n```\n\nToken her şeyden önce kontrol edilir; token yoksa ya da geçersizse istek ne olursa olsun\n`401` döner.\n\n## İstek ve yanıt biçimi\n\n- Gövdeler JSON\'dur: `Content-Type: application/json`.\n- Gövdeyi sıkıştırmadan göndermelisiniz (`Content-Encoding` yalnızca `identity` olabilir).\n- Bir istek gövdesi en fazla 500 MB olabilir.\n- Yanıtlarda tüm alanlar her zaman bulunur; değeri olmayan bir alan `null` olarak gönderilir.\n  Tek istisna hata yanıtındaki `rejectedItems` ve `rejectedItemsTruncated` alanlarıdır; bunlar\n  yalnızca `NO_DELIVERABLE_MESSAGES` hatasında bulunur.\n- Tarih ve saatler saat dilimiyle birlikte ISO-8601 biçimindedir, örneğin\n  `2026-09-10T09:00:00+03:00`.\n\n## Hatalar\n\nHatalar her zaman aynı `ApiError` yapısıyla döner. Destek ekibine yazarken yanıttaki\n`requestId` değerini paylaşmanız, isteğinizi kayıtlarda hızlıca bulmamızı sağlar.\n\nHer uç noktada karşılaşabileceğiniz genel hatalar:\n\n| Durum | Kod | Ne zaman |\n|---|---|---|\n| 401 | `UNAUTHENTICATED` | Token yok veya geçersiz. |\n| 404 | `NOT_FOUND` | Adres yok. |\n| 405 | `INVALID_REQUEST` | Adres bu metodu desteklemiyor. Desteklenen metotlar `Allow` başlığındadır. |\n| 406 | — | `Accept` başlığı JSON\'u kabul etmiyor. Bu yanıtın gövdesi yoktur. |\n| 413 | `INVALID_REQUEST` | Gövde 500 MB\'ı aşıyor. |\n| 415 | `INVALID_REQUEST` | Gövde JSON değil ya da sıkıştırılmış. |\n| 503 | `SERVICE_UNAVAILABLE` | Servis isteği şu anda kabul edemiyor; isteği biraz sonra tekrar gönderebilirsiniz. |\n'
  },
  "servers": [
    {
      "url": "https://ext-api.netgsm.com.tr/sms/v3",
      "description": "Canlı ortam"
    }
  ],
  "security": [
    {
      "bearer": []
    }
  ],
  "tags": [
    {
      "name": "Gönderim",
      "description": "SMS gönderme, rehber gruplarına ve OTP gönderme, mesaj uzunluğu hesaplama ve zamanlanmış görevleri iptal etme."
    },
    {
      "name": "Raporlar ve gelen kutusu",
      "description": "İletim raporları, görev istatistikleri ve hesabınıza gelen SMS'ler."
    },
    {
      "name": "Gönderici adları",
      "description": "Hesabınıza kayıtlı gönderici başlıkları ve varsayılan başlık."
    },
    {
      "name": "Template",
      "description": "Template ile SMS gönderme ve kullanabileceğiniz kayıtlı ve herkese açık template'leri listeleme."
    },
    {
      "name": "Kara liste",
      "description": "Hesabınızın kara listesindeki numaralar."
    },
    {
      "name": "Webhook'lar",
      "description": "İletim raporlarının ve gelen SMS'lerin sizin adresinize gönderilmesi."
    },
    {
      "name": "Hesap",
      "description": "Hesabın kalan paketleri, kampanyaları ve kredi bakiyesi."
    }
  ],
  "paths": {
    "/send": {
      "post": {
        "tags": [
          "Gönderim"
        ],
        "summary": "SMS gönderme",
        "description": "Bir ya da daha fazla alıcıya SMS gönderen bir görev oluşturur. Görev iletim için kabul\nedildiğinde 202 döner; iletim sonradan yapılır. Her alıcı `messages` dizisinde ayrı bir kayıttır\nve her kaydın kendi metni olabilir.\n\n**Kayıt başına doğrulama.** Hatalı kayıtlar toplu gönderimi başarısız kılmaz: geçerli kayıtlar\ngönderilir, hatalılar yanıttaki `rejectedItems` içinde konumları (`index`) ve nedenleriyle\nbildirilir. Kayıtların hepsi hatalıysa görev oluşturulmaz ve 422 `NO_DELIVERABLE_MESSAGES`\ndöner; bu yanıt da reddedilen kayıtları aynı biçimde `rejectedItems` ve\n`rejectedItemsTruncated` alanlarında taşır.\n\n**İstek biçimi.** `Content-Type: application/json`; gövde sıkıştırılmamış olmalı ve 500 MB'ı\naşmamalıdır. Bilinmeyen alanlar yok sayılır; `null` verilen bir alan hiç verilmemiş sayılır.\n\n**İstek sınırı.** Hesap başına dakikada 50.000 istek (mesaj değil, istek). Süre penceresi ilk\nistekle başlar ve sabittir; reddedilen istekler sayılmaz. Aşıldığında 429 `Retry-After` başlığıyla döner.\nToplu gönderimler için çok sayıda alıcıyı tek istekte göndermenizi öneririz.\n\n**Yeniden deneme.** İsteklerin tekilleştirilmesi yoktur: aynı istek iki kez gönderilirse iki\ngörev oluşur. 503 `SERVICE_UNAVAILABLE` çoğunlukla hiçbir şeyin kuyruğa alınmadığını gösterir. Toplu\ngönderimi körlemesine yeniden göndermeden önce `GET /report` ile kontrol edebilirsiniz. 400, 403, 413 ve 422\nyanıtları aynı istekle tekrarlandığında yine aynı sonucu verir.\n\n**Sonrası.** Yanıttaki `jobId` ile iletim raporlarını `GET /report`, gönderim istatistiklerini\n`GET /stats` ile sorgulayabilirsiniz. `status` `SCHEDULED` olan bir görev, başlangıç zamanına kadar\n`POST /cancel` ile iptal edebilirsiniz.\n",
        "operationId": "sendSms",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SmsSendRequest"
              },
              "examples": {
                "immediate": {
                  "summary": "Hemen gönderim",
                  "value": {
                    "sender": "NETGSM",
                    "messages": [
                      {
                        "text": "Merhaba",
                        "recipient": "905xxxxxxxxx"
                      }
                    ],
                    "referenceId": "order-4711"
                  }
                },
                "scheduled": {
                  "summary": "Gönderim aralığı ve Türkçe kodlamayla zamanlanmış",
                  "value": {
                    "sender": "NETGSM",
                    "encoding": "TURKISH",
                    "startAt": "2026-09-10T09:00:00+03:00",
                    "stopAt": "2026-09-10T12:00:00+03:00",
                    "messages": [
                      {
                        "text": "Şubemiz bugün açık.",
                        "recipient": "905xxxxxxxxx"
                      }
                    ]
                  }
                },
                "consentFiltered": {
                  "summary": "Ticari gönderim, marka izinlerine göre İYS filtresinden geçirilmiş",
                  "value": {
                    "sender": "NETGSM",
                    "iysFilter": "BRAND",
                    "messages": [
                      {
                        "text": "Kampanya",
                        "recipient": "905xxxxxxxxx"
                      }
                    ]
                  }
                },
                "international": {
                  "summary": "Yurt içi ve yurt dışı alıcıya farklı metinlerle",
                  "description": "Yurt dışı numara başına `-` konarak ülke koduyla birlikte yazılır (+49 151 12345678 için `-4915112345678`). Hesabın yurt dışı gönderim izni yoksa bu kayıt `NO_INTERNATIONAL_PERMISSION` ile reddedilir ve `rejectedItems` içinde bildirilir; yurt içi kayıt yine gönderilir.",
                  "value": {
                    "sender": "NETGSM",
                    "messages": [
                      {
                        "text": "Siparişiniz kargoya verildi.",
                        "recipient": "905061234567"
                      },
                      {
                        "text": "Your order has been shipped.",
                        "recipient": "-4915112345678"
                      }
                    ]
                  }
                },
                "partiallyRejected": {
                  "summary": "Bir kaydı hatalı toplu gönderim (yanıt örneğindeki istek)",
                  "description": "İkinci kayıttaki numara `+` ile başladığı için reddedilir; ilk kayıt yine gönderilir. Reddedilen kayıt yanıttaki `rejectedItems` içinde, `index` değeri 1 ile bildirilir.",
                  "value": {
                    "sender": "NETGSM",
                    "messages": [
                      {
                        "text": "Merhaba",
                        "recipient": "905xxxxxxxxx"
                      },
                      {
                        "text": "Merhaba",
                        "recipient": "+905xxxxxxxxx"
                      }
                    ],
                    "referenceId": "order-4711"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "Görev oluşturuldu. İletim sonradan yapılır.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmsSendResponse"
                },
                "example": {
                  "jobId": "179309912974612345062827",
                  "status": "QUEUED",
                  "accepted": 1,
                  "rejected": 1,
                  "rejectedItems": [
                    {
                      "index": 1,
                      "recipient": "+905xxxxxxxxx",
                      "reason": "INVALID_RECIPIENT"
                    }
                  ],
                  "rejectedItemsTruncated": false,
                  "referenceId": "order-4711"
                }
              }
            }
          },
          "400": {
            "description": "İstek gövdesi geçersiz. `code` ve `message`:\n\n| `code` | `message` | Ne zaman |\n|---|---|---|\n| `INVALID_REQUEST` | `N field(s) rejected` | Alanlar doğrulamadan geçmedi: `sender` eksik, boş ya da 35 karakterden uzun, `messages` eksik ya da boş, ya da bir alan uzunluk sınırını aşıyor; ya da bir alanın değeri türüne uymuyor: `encoding` listede olmayan bir değer (büyük/küçük harf dahil), `startAt` / `stopAt` saat dilimi farkı olan bir tarih değil, `messages` dizi değil gibi. Hangi alanın neden reddedildiği `violations` içindedir; `encoding` için geçerli değerler de listelenir. |\n| `INVALID_REQUEST` | `request body could not be read as json` | Gövde geçerli bir JSON değil (sözdizimi hatası). `violations` `null`'dır. |\n| `INVALID_REQUEST` | `N messages exceeds the limit of 1000000` | 1.000.000'dan fazla mesaj. |\n| `INVALID_SEND_WINDOW` | — | `startAt` 18 aydan daha ileride. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST",
                            "INVALID_SEND_WINDOW"
                          ]
                        }
                      }
                    }
                  ]
                },
                "example": {
                  "code": "INVALID_REQUEST",
                  "message": "1 field(s) rejected",
                  "requestId": "3b9e2f1a6c4d48e7a05f9d2c1b8e7a64",
                  "timestamp": "2026-09-07T16:42:31.123+03:00",
                  "violations": [
                    {
                      "field": "sender",
                      "message": "must not be blank"
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. Hesap bu gönderimi yapamaz; `message` şunlardan biridir:\n\n| `message` | Anlamı |\n|---|---|\n| `account is not activated for this operation` | Hesapta SMS gönderimi etkin değil. |\n| `sub user may not use the sms api` | Alt kullanıcının SMS API'sini kullanma izni yok. |\n| `account operator is not served for this operation` | Hesabın operatörüne bu uç noktadan hizmet verilmiyor. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "413": {
            "description": "INVALID_REQUEST. Gövde 500 MB'tan büyük ya da toplu gönderim kuyruğa alınamayacak kadar büyük (`message` hangisi olduğunu belirtir). Toplu gönderimi birden fazla isteğe bölmelisiniz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "422": {
            "description": "İstek geçerli ama gönderim yapılamaz. `code` ve `message`:\n\n| `code` | `message` | Anlamı ve çözüm |\n|---|---|---|\n| `REJECTED_HEADER` | `NO_HEADERS_REGISTERED` | Hesapta kayıtlı başlık yok. |\n| `REJECTED_HEADER` | `NOT_REGISTERED` | `sender` hesaba kayıtlı değil. Kayıtlı başlıkları `GET /senders` ile görebilirsiniz. |\n| `REJECTED_HEADER` | `CASE_MISMATCH` | Başlık kayıtlı ama büyük/küçük harfi farklı yazılmış; kayıtlı hâliyle göndermelisiniz. |\n| `REJECTED_HEADER` | `ROUTING_CODE_MISSING` | Alfanümerik başlık için hesapta yönlendirme kodu tanımlı değil. |\n| `REJECTED_HEADER` | `SUBSCRIBER_NUMBER_RESTRICTED` | Hesapta abone numarasından gönderim kısıtlı. |\n| `REJECTED_IYS` | `sender header has no iys brand code` | `BRAND` ya da `RETAILER` filtresi uygulanacak ama başlığın İYS marka kodu yok. |\n| `REJECTED_IYS` | `account is not in iys mode, filtering cannot be applied` | Hesap İYS modunda değil; `iysFilter` `BRAND` ya da `RETAILER` olamaz. |\n| `NO_DELIVERABLE_MESSAGES` | `all N messages rejected` | Kayıtların hepsi reddedildi; görev oluşturulmadı. Hangi kaydın neden reddedildiği `rejectedItems` içindedir (202 yanıtındakiyle aynı biçim ve aynı 100 kayıt sınırı). |\n\nAbone numarasından gönderime onaylı olmayan bir hesapta, tamamı rakamlardan oluşan bir `sender`\niçin `NOT_REGISTERED` ve `NO_HEADERS_REGISTERED` mesajlarının sonuna\n` (subscriber number headers were not offered)` eklenir.\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "REJECTED_HEADER",
                            "REJECTED_IYS",
                            "NO_DELIVERABLE_MESSAGES"
                          ]
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "rejectedHeader": {
                    "summary": "Gönderici kayıtlı değil",
                    "value": {
                      "code": "REJECTED_HEADER",
                      "message": "NOT_REGISTERED",
                      "requestId": "ca6fa668966d42169e615c6d236191e2",
                      "timestamp": "2026-09-07T16:42:31.123+03:00",
                      "violations": null
                    }
                  },
                  "noDeliverableMessages": {
                    "summary": "Tüm kayıtlar reddedildi",
                    "description": "Yalnızca yurt dışı alıcılar içeren bir istek, yurt dışı gönderim izni olmayan bir hesaptan gönderildi.",
                    "value": {
                      "code": "NO_DELIVERABLE_MESSAGES",
                      "message": "all 1 messages rejected",
                      "requestId": "5d1f0c2a7b3e4f6a9c8d7e6f5a4b3c2d",
                      "timestamp": "2026-09-07T16:42:31.123+03:00",
                      "violations": null,
                      "rejectedItems": [
                        {
                          "index": 0,
                          "recipient": "-4915112345678",
                          "reason": "NO_INTERNATIONAL_PERMISSION"
                        }
                      ],
                      "rejectedItemsTruncated": false
                    }
                  }
                }
              }
            }
          },
          "429": {
            "description": "RATE_LIMITED. `message` şunlardan biridir:\n\n- `send rate limit exceeded`: hesap başına dakikada 50.000 istek aşıldı. `Retry-After` kadar\n  bekleyip yeniden denemelisiniz.\n- `sending is suspended for this account`: hesabın gönderimi askıya alınmış. `Retry-After`\n  yoktur; beklemek işe yaramaz, destek ekibiyle iletişime geçmelisiniz.\n",
            "headers": {
              "Retry-After": {
                "description": "Yeniden denemeden önce beklenecek süre (saniye). Askıya alınmış hesapta bulunmaz.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. Servis geçici olarak kullanılamıyor. Görev çoğunlukla kuyruğa alınmamıştır. Toplu gönderimi körlemesine yeniden göndermeden önce `GET /report` ile kontrol edebilirsiniz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/inbox": {
      "get": {
        "tags": [
          "Raporlar ve gelen kutusu"
        ],
        "summary": "Gelen SMS'leri listeleme",
        "description": "Kimliği doğrulanmış hesabın gelen kutusu, isteğe bağlı olarak bir aralıkla sınırlanır. Boş\ngelen kutusu `count` 0 ile 200 döner. Saat dilimi farkındaki `+` işaretini URL'de `%2B`\nolarak kodlamalısınız.\n\n`startAt` ve `stopAt` değerlerini birlikte göndermeli ya da ikisini de\ngöndermemelisiniz. Hiçbiri gönderilmezse içinde bulunulan ayın bugüne kadarki kısmı, yani ayın 1'i 00:00'dan\n(Europe/Istanbul) şimdiye kadar kullanılır. Aralık 2 ayı aşamaz.\n",
        "operationId": "readInbox",
        "parameters": [
          {
            "name": "startAt",
            "in": "query",
            "required": false,
            "description": "Yalnızca `stopAt` ile birlikte.",
            "schema": {
              "type": "string",
              "format": "date-time"
            },
            "example": "2026-08-31T00:00:00+03:00"
          },
          {
            "name": "stopAt",
            "in": "query",
            "required": false,
            "description": "Yalnızca `startAt` ile birlikte. Ondan önce ya da ondan 2 aydan fazla sonra olamaz.",
            "schema": {
              "type": "string",
              "format": "date-time"
            },
            "example": "2026-08-31T23:59:59+03:00"
          }
        ],
        "responses": {
          "200": {
            "description": "Aralıktaki mesajlar; hiç olmayabilir.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InboxResponse"
                },
                "example": {
                  "count": 1,
                  "messages": [
                    {
                      "id": "1",
                      "jobId": "179309912974612345062827",
                      "sender": "5xxxxxxxxx",
                      "text": "Merhaba",
                      "operator": "NETGSM MOBIL",
                      "receivedAt": "2026-08-31T12:00:00+03:00"
                    }
                  ],
                  "truncated": false
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. Sınırlardan biri ISO-8601 değil (`message` parametreyi belirtir); `startAt` ve `stopAt`'tan yalnızca biri gönderilmiş; `stopAt`, `startAt`'tan önce; aralık 2 aydan geniş.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. Hesapta gelen SMS etkin değil ya da SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/report": {
      "get": {
        "tags": [
          "Raporlar ve gelen kutusu"
        ],
        "summary": "İletim raporlarını sorgulama",
        "description": "Kimliği doğrulanmış hesabın iletim raporlarından bir sayfa. Bir sayfada en fazla 100 rapor\nbulunur.\nTüm raporlar için `count` 100'ün altında dönene kadar sonraki sayfalar istenebilir. Boş sayfa `count` 0 ile 200 döner.\n\nRaporlar kaydedildikleri sırayla döner. Sayfalar gezilirken yeni raporlar eklenebilir; bu yüzden\naynı sorgunun sayfaları farklı zamanlarda istendiğinde sonuçlar değişebilir.\n\nGönderdiğiniz bir alıcı raporlarda yoksa iletim raporu henüz gelmemiştir: mesaj hâlâ\nbekliyordur. Raporu daha sonra yeniden sorgulayabilirsiniz. Karşı operatör ya da son kullanıcı adresi kaynaklı nedenlerle\nyeni gelen bir raporun yanıta yansıması 5 dakikayı bulabilir.\n\n`startAt` ve `stopAt`, mesajın gönderildiği zamana uygulanır. İkisini birlikte göndermeli\nya da hiçbirini göndermemelisiniz. Hiçbiri gönderilmezse içinde bulunulan ayın bugüne kadarki kısmı, yani\nayın 1'i 00:00'dan (Europe/Istanbul) şimdiye kadar kullanılır. Aralık 1 ayı aşamaz. Aralık\ndakika hassasiyetindedir: `startAt`'ın bulunduğu dakikanın başından `stopAt`'ın bulunduğu\ndakikanın sonuna kadar gönderilen mesajlar döner. Saat dilimi farkındaki `+` işaretini URL'de\n`%2B` olarak kodlamalısınız.\n",
        "operationId": "readReports",
        "parameters": [
          {
            "name": "jobIds",
            "in": "query",
            "required": false,
            "description": "Tekrarlanabilir ya da virgülle ayrılmış. Gönderilmezse aralıktaki tüm görevler döner.",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "style": "form",
            "explode": true,
            "example": [
              "179309912974612345062827"
            ]
          },
          {
            "name": "startAt",
            "in": "query",
            "required": false,
            "description": "Yalnızca `stopAt` ile birlikte.",
            "schema": {
              "type": "string",
              "format": "date-time"
            },
            "example": "2026-08-01T00:00:00+03:00"
          },
          {
            "name": "stopAt",
            "in": "query",
            "required": false,
            "description": "Yalnızca `startAt` ile birlikte. Ondan önce ya da ondan 1 aydan fazla sonra olamaz.",
            "schema": {
              "type": "string",
              "format": "date-time"
            },
            "example": "2026-08-31T23:59:59+03:00"
          },
          {
            "name": "page",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 0,
              "default": 0
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Raporlardan bir sayfa; boş olabilir.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportResponse"
                },
                "example": {
                  "count": 2,
                  "page": 0,
                  "reports": [
                    {
                      "jobId": "179309912974612345062827",
                      "number": "5xxxxxxxxx",
                      "status": "DELIVERED",
                      "operator": "VODAFONE",
                      "messageLength": 1,
                      "deliveredAt": "2026-08-31T12:34:56+03:00",
                      "failReason": null,
                      "referenceId": "8f3a1c"
                    },
                    {
                      "jobId": "179309912974612345062827",
                      "number": "5xxxxxxxxx",
                      "status": "NOT_DELIVERED",
                      "operator": "VODAFONE",
                      "messageLength": 1,
                      "deliveredAt": null,
                      "failReason": "TIMEOUT",
                      "referenceId": null
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. Sınırlardan biri ISO-8601 değil ya da `page` sayı değil (`message` parametreyi belirtir); `page` negatif; `startAt` ve `stopAt`'tan yalnızca biri gönderilmiş; `stopAt`, `startAt`'tan önce; aralık 1 aydan geniş.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "description": "RATE_LIMITED. Hesap için dakikada 60 istek aşıldı ya da istekteki bir görev numarası son bir dakika içinde sorulmuş; `message` hangisi olduğunu söyler.",
            "headers": {
              "Retry-After": {
                "description": "Engelleyen sayacın süresi dolana kadar kalan saniye.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. İstek daha sonra yeniden gönderilebilir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/senders": {
      "get": {
        "tags": [
          "Gönderici adları"
        ],
        "summary": "Gönderici başlıklarını listeleme",
        "description": "Kimliği doğrulanmış hesaba kayıtlı gönderici başlıkları. Her başlık için `usable`, o başlıkla\nyapılacak bir gönderimin kabul edilip edilmeyeceğini; `reason`, edilmeyecekse nedenini gösterir.\nAbone numaraları yalnızca abone numarasından gönderim için onaylı hesaplarda listelenir.\nBaşlığı olmayan bir hesap `count` 0 ile 200 alır.\n\nEklenen, değiştirilen ya da silinen bir başlık hemen görünür. Hesap ayarlarındaki bir değişikliğin\n(örneğin yönlendirme kodu) `usable` ve `reason` alanlarına yansıması kısa bir süreyi bulabilir.\n",
        "operationId": "listSenders",
        "responses": {
          "200": {
            "description": "Kayıtlı başlıklar; hiç olmayabilir.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SendersResponse"
                },
                "example": {
                  "count": 2,
                  "senders": [
                    {
                      "name": "NETGSM",
                      "type": "ALPHANUMERIC",
                      "brandCode": 4567,
                      "usable": true,
                      "reason": null
                    },
                    {
                      "name": "5xxxxxxxxx",
                      "type": "SUBSCRIBER_NUMBER",
                      "brandCode": 0,
                      "usable": false,
                      "reason": "SUBSCRIBER_NUMBER_RESTRICTED"
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/senders/default": {
      "get": {
        "tags": [
          "Gönderici adları"
        ],
        "summary": "Varsayılan gönderici başlığını öğrenme",
        "description": "Hesabın varsayılan gönderici başlığı, anlık olarak okunur; bu yüzden bir değişiklik hemen\ngörünür. Varsayılan ayarlanmamışsa `sender` açıkça null olarak 200 ile döner.\n",
        "operationId": "readDefaultSender",
        "responses": {
          "200": {
            "description": "Varsayılan başlık; ayarlanmamışsa `sender` null.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DefaultSenderResponse"
                },
                "example": {
                  "sender": {
                    "name": "NETGSM",
                    "type": "ALPHANUMERIC",
                    "brandCode": 4567,
                    "usable": true,
                    "reason": null
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      },
      "put": {
        "tags": [
          "Gönderici adları"
        ],
        "summary": "Varsayılan gönderici başlığını değiştirme",
        "description": "Kayıtlı bir başlığı varsayılan yapar. Ad, kayıtlı bir başlıkla birebir eşleşmelidir:\nbüyük/küçük harf dahil ve yazıldığı gibi - kırpma yapılmaz, 0 ya da 90 öneki olmaz. Yeni\nvarsayılanı döndürür. Gönderim için kullanılamayan bir başlık da varsayılan yapılabilir; bu\ndurumda yanıtta `usable` false olur ve `reason` nedenini belirtir.\n",
        "operationId": "changeDefaultSender",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DefaultSenderChangeRequest"
              },
              "example": {
                "name": "NETGSM"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Yeni varsayılan.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DefaultSenderResponse"
                },
                "example": {
                  "sender": {
                    "name": "NETGSM",
                    "type": "ALPHANUMERIC",
                    "brandCode": 4567,
                    "usable": true,
                    "reason": null
                  }
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `name` eksik ya da boş (`violations` belirtir) veya gövde JSON değil.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "422": {
            "description": "REJECTED_HEADER. `message` NO_HEADERS_REGISTERED, NOT_REGISTERED ya da CASE_MISMATCH.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "REJECTED_HEADER"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. İstek daha sonra yeniden gönderilebilir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/cancel": {
      "post": {
        "tags": [
          "Gönderim"
        ],
        "summary": "Zamanlanmış gönderimi iptal etme",
        "description": "Hesabınızın henüz gönderilmemiş bir görevini geri çeker. Görev numarasını istek gövdesinde\ngönderirsiniz.\n\n**Hangi görevler.** Yalnızca hesabınıza ait ve hâlâ bekleyen bir görev iptal edilebilir; başka bir\nhesabın görevini iptal etmenin yolu yoktur. Bekleyen görev, `POST /send` ya da `POST /send/template` yanıtında `SCHEDULED`\ndurumunu almış görevdir. `QUEUED` yanıtı alan bir görev zaten gönderilmektedir; iptal etmek\n404 döner.\n\n**İstek sınırı.** Hesap başına dakikada 25.000 istek. Süre penceresi ilk istekle başlar ve\nsabittir. Aşıldığında 429 `Retry-After` başlığıyla döner.\n\n**Yeniden deneme.** İptali yeniden göndermek her zaman güvenlidir: görev ilk istekte iptal\nedildiyse ikinci istek 404 döner.\n",
        "operationId": "cancelJob",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CancelRequest"
              },
              "example": {
                "jobId": "179309912974612345062827"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Görev bekliyordu ve artık iptal edildi.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CancelResponse"
                },
                "example": {
                  "jobId": "179309912974612345062827",
                  "cancelledAt": "2026-09-10T12:00:00+03:00"
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `code` ve `message`:\n\n| `message` | Ne zaman |\n|---|---|\n| `1 field(s) rejected` | `jobId` eksik, boş, yalnızca boşluktan oluşuyor ya da 64 karakterden uzun. `violations` belirtir. |\n| `request body could not be read as json` | Gövde JSON değil. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN, `message` `sub user may not use the sms api`. SMS menüsü olmayan bir alt kullanıcı. Ana hesap için ayrıca bir etkinleştirme gerekmez.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "NOT_FOUND, `message` `job not found for this account, or no longer waiting to be sent`. Bu kimlikle hesabınıza ait bekleyen bir görev yok: hiç var olmadı, başka bir hesaba ait, zaten gönderildi ya da daha önce iptal edildi. Bu durumlar birbirinden ayrılmaz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "NOT_FOUND"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "description": "RATE_LIMITED, `message` `cancel rate limit exceeded`. Hesap başına dakikada 25.000 istek aşıldı; `Retry-After` kadar bekleyip yeniden denemelisiniz.",
            "headers": {
              "Retry-After": {
                "description": "Yeniden denemeden önce beklenecek süre (saniye).",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. İptal servisine ulaşılamadı, servis bir hata döndü ya da tanınmayan bir yanıt verdi. Görev büyük olasılıkla iptal edilmedi; isteği daha sonra yeniden gönderebilirsiniz. Görev bu arada iptal edildiyse 404 döner.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "504": {
            "description": "QUEUE_UNCONFIRMED. İptal iletildi ama yanıtı alınamadı; görev iptal edilmiş olabilir. İptali yeniden gönderebilirsiniz: görev iptal edildiyse 404 döner.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "QUEUE_UNCONFIRMED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/stats": {
      "get": {
        "tags": [
          "Raporlar ve gelen kutusu"
        ],
        "summary": "Gönderim istatistiklerini sorgulama",
        "description": "Kimliği doğrulanmış hesabın bir görevi için, gönderildiği ay üzerinden toplanmış, her farklı\nsonuç başına bir satır. Ay varsayılan olarak içinde bulunulan aydır. Satır yoksa 404\nNOT_FOUND döner - bilinmeyen bir görev, başka bir hesabın görevi ve yanlış ay aynı görünür.\n200 yanıtında her zaman en az bir satır bulunur.\n",
        "operationId": "readStats",
        "parameters": [
          {
            "name": "jobId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            },
            "example": "179309912974612345062827"
          },
          {
            "name": "month",
            "in": "query",
            "required": false,
            "description": "Görevin gönderildiği ay. Varsayılan, içinde bulunulan ay.",
            "schema": {
              "type": "string",
              "pattern": "^\\d{4}-\\d{2}$"
            },
            "example": "2026-09"
          }
        ],
        "responses": {
          "200": {
            "description": "Görevin toplamları; en az bir satır.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/StatsResponse"
                },
                "example": {
                  "jobId": "179309912974612345062827",
                  "month": "2026-09",
                  "count": 2,
                  "stats": [
                    {
                      "status": "DELIVERED",
                      "failReason": null,
                      "messageCount": 4,
                      "totalParts": 4,
                      "domestic": true,
                      "charging": "charged",
                      "chargeDescription": "1.26 TL from: credit balance"
                    },
                    {
                      "status": "NOT_DELIVERED",
                      "failReason": "INVALID_NUMBER",
                      "messageCount": 1,
                      "totalParts": 0,
                      "domestic": true,
                      "charging": "uncharged"
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `jobId` eksik ya da boş veya `month` yyyy-MM değil; `message` parametreyi belirtir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "NOT_FOUND, `message` `job not found`. Bu görev için ayda satır yok - bilinmeyen kimlik, başka bir hesabın görevi ya da farklı bir ayda gönderilmiş. Bu durumlar birbirinden ayrılmaz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "NOT_FOUND"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "description": "RATE_LIMITED. Hesap için dakikada 60 istek aşıldı ya da bu görev numarası son 10 dakika içinde sorulmuş; `message` hangisi olduğunu söyler. İkisi de okuma sonunda 404 ya da 503 ile bitse bile sayılır.",
            "headers": {
              "Retry-After": {
                "description": "Engelleyen sayacın süresi dolana kadar kalan saniye.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/webhooks/report": {
      "post": {
        "tags": [
          "Webhook'lar"
        ],
        "summary": "İletim raporu webhook'u kaydetme",
        "description": "Hesabın iletim raporlarının gönderileceği adres. Hesap başına bir tane; var olanın\nüzerine kayıt 409 ile reddedilir; önce mevcut kaydı silmeniz gerekir. Etkinleştirme gerekmez; alt kullanıcı için SMS\nmenüsü gerekir.\n",
        "operationId": "registerReportWebhook",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/WebhookRequest"
              },
              "example": {
                "url": "https://example.com/report",
                "headers": "Authorization: Bearer token123"
              }
            }
          }
        },
        "callbacks": {
          "deliveryReport": {
            "{$request.body#/url}": {
              "post": {
                "tags": [
                  "Webhook'lar"
                ],
                "summary": "İletim raporları webhook adresinize gönderilir",
                "description": "İletim raporları, kayıtlı adrese periyodik olarak ve toplu hâlde `POST` ile gönderilir.\nBir istek, hesabın bekleyen raporlarından bir grubu `numbers` dizisinde taşır. Bekleyen rapor\nsayısı fazlaysa raporlar aynı periyotta birden fazla isteğe bölünebilir.\n\n- Kayıt sırasında `headers` verildiyse o başlık her istekte gönderilir; isteğin\n  Netgsm'den geldiğini bu başlıkla doğrulayabilirsiniz.\n- Bağlantının 60 saniye içinde kurulması, yanıtın 10 dakika içinde gelmesi gerekir; aksi\n  halde istek başarısız sayılır.\n- Herhangi bir `2xx` yanıt, raporların teslim alındığı anlamına gelir. Yanıt gövdesi\n  okunmaz.\n- Zaman aşımı, `2xx` dışındaki bir yanıt ya da bağlantı hatası durumunda o istekteki\n  raporlar **yeniden gönderilmez**. Bu raporlara `GET /report` ile ulaşılabilir.\n- Zamanlar saat dilimi bilgisi olmadan, Türkiye saatiyle (UTC+3) `yyyy-MM-dd HH:mm:ss`\n  biçimindedir.\n- `status`, `operator` ve `errorCode` sayısal kodlardır; `GET /report` ise aynı bilgiyi\n  ad olarak döndürür. Karşılıkları alan açıklamalarındaki tablolardadır.\n",
                "requestBody": {
                  "required": true,
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/ReportWebhookPayload"
                      },
                      "example": {
                        "numbers": [
                          {
                            "jobid": "179309912974612345062827",
                            "number": "5xxxxxxxxx",
                            "status": 1,
                            "operator": 10,
                            "msglen": 1,
                            "deliveredDate": "2026-10-27 14:06:12",
                            "errorCode": 0,
                            "referansID": "8f3a1c"
                          },
                          {
                            "jobid": "179309912974612345062827",
                            "number": "5xxxxxxxxx",
                            "status": 2,
                            "operator": 30,
                            "msglen": 1,
                            "deliveredDate": "2026-10-27 14:09:40",
                            "errorCode": 115,
                            "referansID": null
                          }
                        ]
                      }
                    }
                  }
                },
                "responses": {
                  "200": {
                    "description": "Raporlar teslim alındı. Herhangi bir `2xx` yanıt aynı anlama gelir."
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Kaydedildi.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookResponse"
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `url` eksik, çok uzun ya da host içeren mutlak bir http(s) URL değil; host'u çözümlenmiyor ya da yalnızca genel (public) adreslere çözümlenmiyor; `headers` çok uzun, tek bir `Name: value` satırı değil ya da değerinde virgül veya iki nokta üst üste var; gövde JSON değil.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "409": {
            "description": "ALREADY_EXISTS. Kayıtlı bir iletim raporu webhook'u var; önce silmeniz gerekir. Hesap için başka bir iletim raporu webhook kaydı sürerken de döner; o tamamlandığında istek yeniden gönderilebilir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "ALREADY_EXISTS"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      },
      "delete": {
        "tags": [
          "Webhook'lar"
        ],
        "summary": "İletim raporu webhook'unu silme",
        "operationId": "deleteReportWebhook",
        "responses": {
          "204": {
            "description": "Kaldırıldı."
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. Kayıttaki kuralın aynısı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "NOT_FOUND. Kayıtlı bir iletim raporu webhook'u yok.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "NOT_FOUND"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/webhooks/inbox": {
      "post": {
        "tags": [
          "Webhook'lar"
        ],
        "summary": "Gelen SMS webhook'u kaydetme",
        "description": "Hesaba gelen SMS'lerin gönderileceği adres. Hesap başına bir tane; var olanın\nüzerine kayıt 409 ile reddedilir; önce mevcut kaydı silmeniz gerekir. Etkinleştirme gerekmez; alt kullanıcı için SMS\nmenüsü gerekir.\n",
        "operationId": "registerInboxWebhook",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/WebhookRequest"
              },
              "example": {
                "url": "https://example.com/inbox",
                "headers": "Authorization: Bearer token123"
              }
            }
          }
        },
        "callbacks": {
          "inboundSms": {
            "{$request.body#/url}": {
              "post": {
                "tags": [
                  "Webhook'lar"
                ],
                "summary": "Gelen SMS webhook adresinize gönderilir",
                "description": "Hesaba gelen her SMS, geldiği anda kayıtlı adrese tek tek `POST` ile gönderilir.\n\n- Kayıt sırasında `headers` verildiyse o başlık her istekte gönderilir; isteğin\n  Netgsm'den geldiğini bu başlıkla doğrulayabilirsiniz.\n- Her istekte, isteğe özgü bir `X-Correlation-Id` başlığı bulunur. Destek ekibine\n  yazarken bu değeri paylaşmanız, isteğin kayıtlarda bulunmasını sağlar.\n- Adresin 4 saniye içinde yanıt vermesi gerekir. Herhangi bir `2xx` yanıt, mesajın\n  teslim alındığı anlamına gelir; yanıt gövdesi dikkate alınmaz.\n- Zaman aşımı, `2xx` dışındaki bir yanıt ya da bağlantı hatası durumunda mesaj\n  **yeniden gönderilmez**. Bu mesajlara `GET /inbox` ile ulaşılabilir.\n- Zamanlar saat dilimi bilgisi olmadan, Türkiye saatiyle (UTC+3) `yyyy-MM-dd HH:mm:ss`\n  biçimindedir.\n",
                "parameters": [
                  {
                    "name": "X-Correlation-Id",
                    "in": "header",
                    "required": true,
                    "description": "İsteğe özgü kimlik.",
                    "schema": {
                      "type": "string",
                      "format": "uuid"
                    }
                  }
                ],
                "requestBody": {
                  "required": true,
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/InboxWebhookPayload"
                      },
                      "example": {
                        "messageId": "4815162342",
                        "messageDateTime": "2026-10-27 14:06:12",
                        "sourceNumber": "5xxxxxxxxx",
                        "content": "Merhaba",
                        "subscriberNumber": "850xxxxxxx"
                      }
                    }
                  }
                },
                "responses": {
                  "200": {
                    "description": "Mesaj teslim alındı. Herhangi bir `2xx` yanıt aynı anlama gelir."
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Kaydedildi.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookResponse"
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `url` eksik, çok uzun ya da host içeren mutlak bir http(s) URL değil; host'u çözümlenmiyor ya da yalnızca genel (public) adreslere çözümlenmiyor; `headers` çok uzun, tek bir `Name: value` satırı değil ya da değerinde virgül veya iki nokta üst üste var; gövde JSON değil.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. SMS menüsü olmayan bir alt kullanıcı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "409": {
            "description": "ALREADY_EXISTS. Kayıtlı bir gelen SMS webhook'u var; önce silmeniz gerekir. Hesap için başka bir gelen SMS webhook kaydı sürerken de döner; o tamamlandığında istek yeniden gönderilebilir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "ALREADY_EXISTS"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      },
      "delete": {
        "tags": [
          "Webhook'lar"
        ],
        "summary": "Gelen SMS webhook'unu silme",
        "operationId": "deleteInboxWebhook",
        "responses": {
          "204": {
            "description": "Kaldırıldı."
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. Kayıttaki kuralın aynısı.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "NOT_FOUND. Kayıtlı bir gelen SMS webhook'u yok.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "NOT_FOUND"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "$ref": "#/components/responses/RateLimited"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/blacklist": {
      "get": {
        "tags": [
          "Kara liste"
        ],
        "summary": "Kara listeyi öğrenme",
        "description": "Hesabın kara listesindeki numaraları döndürür. İki kullanımı vardır:\n\n- **Liste:** `number` verilmezse kara liste sayfa sayfa döner. Her sayfada en fazla 200 numara\n  bulunur, en son eklenen önce gelir. İlk sayfa 0'dır.\n- **Tek numara sorgusu:** `number` verilirse yalnızca o numaraya bakılır. Numara kara listedeyse\n  `count` 0'dan büyüktür ve numara `numbers` içinde yer alır; değilse `count` 0 ve `numbers` boştur.\n\nKara listede numara olmaması ya da listenin sonunu geçen bir sayfanın istenmesi hata değildir;\nyanıt `count` 0 ve boş `numbers` ile başarılı döner.\n",
        "operationId": "readBlacklist",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "required": false,
            "description": "İstenen sayfa, 0'dan başlar. Tek numara sorgusunda yanıtı etkilemez.",
            "schema": {
              "type": "integer",
              "minimum": 0,
              "default": 0
            }
          },
          {
            "name": "number",
            "in": "query",
            "required": false,
            "description": "Sorgulanacak tek numara; bir alıcı için 90 ve on rakam. Yalnızca rakam, en fazla 15; başka her şey 400 alır. Baştaki ve sondaki boşluklar kırpılır; boş bir değer `number` hiç gönderilmemiş gibi değerlendirilir.",
            "schema": {
              "type": "string",
              "pattern": "^[0-9]{1,15}$"
            },
            "example": "905xxxxxxxxx"
          }
        ],
        "responses": {
          "200": {
            "description": "Bir sayfa ya da tek bir numara hakkındaki yanıt.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlacklistResponse"
                },
                "examples": {
                  "page": {
                    "value": {
                      "count": 1,
                      "page": 0,
                      "number": null,
                      "numbers": [
                        "905xxxxxxxxx"
                      ]
                    }
                  },
                  "lookup": {
                    "value": {
                      "count": 1,
                      "page": null,
                      "number": "905xxxxxxxxx",
                      "numbers": [
                        "905xxxxxxxxx"
                      ]
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `page` sayı değil ya da negatif veya `number` 1 ile 15 rakam arasında değil; `message` parametreyi belirtir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "429": {
            "description": "RATE_LIMITED. Hesap dakikada 60 istek sınırını aştı ya da aynı sorgu (aynı `page` ve `number` değerleri) son 10 dakika içinde yanıtlandı; `message` hangisi olduğunu belirtir. Hatayla sonuçlanan bir sorgu beklemeden tekrar gönderilebilir.",
            "headers": {
              "Retry-After": {
                "description": "Engelleyen sayacın süresi dolana kadar kalan saniye.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/length": {
      "post": {
        "tags": [
          "Gönderim"
        ],
        "summary": "SMS uzunluğunu hesaplama",
        "description": "Bir metnin kaç parça tuttuğu ve sınıra ne kadar uzak olduğu; send uç noktasının saydığı\nşekilde birebir sayılır. Yalnızca bir hesaplamadır: hiçbir şey gönderilmez ya da saklanmaz.\nFazla uzun bir metin `fits` false ve negatif `remaining` ile 200 döner.\n",
        "operationId": "measureLength",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LengthRequest"
              },
              "example": {
                "text": "Merhaba, şifreniz 123456",
                "encoding": "TURKISH",
                "alphanumericSender": true
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ölçüm.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LengthResponse"
                },
                "example": {
                  "encoding": "TURKISH",
                  "length": 30,
                  "parts": 1,
                  "limit": 888,
                  "fits": true,
                  "remaining": 858,
                  "remainingUntilNextPart": 125
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `text` yok ya da 10000 karakterden uzun, `encoding` bilinmiyor veya gövde JSON değil.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/directory/send": {
      "post": {
        "tags": [
          "Gönderim"
        ],
        "summary": "Rehbere SMS gönderme",
        "description": "Rehberdeki kişi gruplarına, istekte verilen kişilere ya da her ikisine tek bir metinle\ngönderimi kuyruğa alır. Gruplar ve kişiselleştirme, yanıt döndükten sonra işlenir.\n\n- En az bir grup (`groupIds`) ya da kişi (`contacts`) belirtmelisiniz. Yalnızca numaralara\n  göndermek için `POST /send`'i kullanın.\n- `UNICODE` kodlaması bu uç noktada desteklenmez.\n- Onay için bekletilen bir görev de 202 alır; neyin beklettiğini `review` söyler.\n\n**İstek sınırı.** Hesap başına dakikada 60 istek, `/send` sınırından ayrı. Süre penceresi ilk\nistekle başlar ve sabittir. Aşıldığında 429 `Retry-After` başlığıyla döner.\n\n**Yeniden deneme.** Aynı istek iki kez gönderilirse iki görev oluşur ve gruplara iki kez mesaj\ngider. 503 ya da 504 aldıysanız yeniden göndermeden önce `GET /report` ile kontrol etmelisiniz.\n",
        "operationId": "sendToDirectory",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DirectorySendRequest"
              },
              "example": {
                "sender": "NETGSM",
                "text": "Merhaba",
                "encoding": "TURKISH",
                "groupIds": [
                  7,
                  8
                ],
                "contacts": [
                  {
                    "number": "905xxxxxxxxx",
                    "name": "Ali",
                    "surname": "Veli"
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "Kuyruğa alındı. Gönderim, gönderim aralığı içinde yapılır.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DirectorySendResponse"
                },
                "example": {
                  "jobId": "179309912974612345062827",
                  "status": "QUEUED",
                  "review": "NONE"
                }
              }
            }
          },
          "400": {
            "description": "İstek geçersiz. `code` ve `message`:\n\n| `code` | `message` | Ne zaman |\n|---|---|---|\n| `INVALID_REQUEST` | `N field(s) rejected` | Alanlar doğrulamadan geçmedi (eksik `sender` ya da `text`, uzunluk sınırları, `addressType` 0–17 dışında, `contacts[].number` boş) ya da bir değer türüne uymuyor (`encoding` listede yok, tarih saat dilimi farkı olmadan yazılmış gibi). `violations` belirtir. |\n| `INVALID_REQUEST` | `request body could not be read as json` | Gövde geçerli bir JSON değil. |\n| `INVALID_REQUEST` | `encoding UNICODE is not supported for directory sends` | `encoding` `UNICODE`. |\n| `INVALID_REQUEST` | `a directory send names at least one group or contact; for numbers alone use /sms/v3/send` | `groupIds` ve `contacts` ikisi de boş. |\n| `INVALID_REQUEST` | `text exceeds N characters for this encoding and sender` | Metin, `encoding` ve gönderici türüne göre sınırı aşıyor; bkz. `text`. |\n| `INVALID_REQUEST` | `a required field is missing` | Platform eksik bir alan bildirdi. |\n| `INVALID_SEND_WINDOW` | `the send window was rejected` | Platform `startAt` / `stopAt` aralığını kabul etmedi; bkz. `stopAt`. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST",
                            "INVALID_SEND_WINDOW"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "Hesap bu gönderimi yapamaz. `code` ve `message`:\n\n| `code` | `message` | Anlamı |\n|---|---|---|\n| `FORBIDDEN` | `account is not activated for this operation` | Hesapta SMS gönderimi etkin değil. |\n| `FORBIDDEN` | `sub user may not use the sms api` | Alt kullanıcının SMS API'sini kullanma izni yok. |\n| `FORBIDDEN` | `account operator is not served for this operation` | Hesabın operatörüne bu uç noktadan hizmet verilmiyor. |\n| `FORBIDDEN` | `account is not permitted to send` | Platform, hesabın gönderim yetkisi olmadığını bildirdi. |\n| `E_SIGNATURE_REQUIRED` | `the requested menu requires an e-signature login on the account` | Bu gönderim için hesapta e-imza ile giriş gerekiyor. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN",
                            "E_SIGNATURE_REQUIRED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "422": {
            "description": "İstek geçerli ama gönderim yapılamaz. `code` ve `message`:\n\n| `code` | `message` | Anlamı ve çözüm |\n|---|---|---|\n| `REJECTED_HEADER` | `NO_HEADERS_REGISTERED` | Hesapta kayıtlı başlık yok. |\n| `REJECTED_HEADER` | `NOT_REGISTERED` | `sender` hesaba kayıtlı değil. Kayıtlı başlıkları `GET /senders` ile görebilirsiniz. |\n| `REJECTED_HEADER` | `CASE_MISMATCH` | Başlık kayıtlı ama büyük/küçük harfi farklı yazılmış; kayıtlı hâliyle göndermelisiniz. |\n| `REJECTED_HEADER` | `ROUTING_CODE_MISSING` | Alfanümerik başlık için hesapta yönlendirme kodu tanımlı değil. |\n| `REJECTED_HEADER` | `SUBSCRIBER_NUMBER_RESTRICTED` | Hesapta abone numarasından gönderim kısıtlı. |\n| `REJECTED_IYS` | `consent filtering cannot be applied to this sender or account` | Platform, istenen İYS filtresini bu başlık ya da hesap için uygulayamadı. |\n\nAbone numarasından gönderime onaylı olmayan bir hesapta, tamamı rakamlardan oluşan bir `sender`\niçin `NOT_REGISTERED` ve `NO_HEADERS_REGISTERED` mesajlarının sonuna\n` (subscriber number headers were not offered)` eklenir.\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "REJECTED_HEADER",
                            "REJECTED_IYS"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "description": "RATE_LIMITED, `message` `directory send rate limit exceeded`. Hesap başına dakikada 60 istek aşıldı; `Retry-After` kadar bekleyip yeniden denemelisiniz.",
            "headers": {
              "Retry-After": {
                "description": "Yeniden denemeden önce beklenecek süre (saniye).",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. Platforma ulaşılamadı, platform bir hata döndü ya da görev numarası vermedi. Platforma ulaşılamadıysa hiçbir şey kuyruğa alınmamıştır; diğer durumlarda görev kuyruğa alınmış olabilir. Yeniden göndermeden önce `GET /report` ile kontrol etmelisiniz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "504": {
            "description": "QUEUE_UNCONFIRMED. Gönderim platforma iletildi ama yanıtı alınamadı; görev kuyruğa alınmış olabilir. Yeniden göndermeden önce `GET /report` ile kontrol etmelisiniz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "QUEUE_UNCONFIRMED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/send/template": {
      "post": {
        "tags": [
          "Template"
        ],
        "summary": "Template ile SMS gönderme",
        "description": "Kayıtlı template'leri verilen parametrelerle doldurup gönderen bir görev oluşturur. Her kayıt bir\ntemplate, template'in parametreleri ve bir alıcıdır. Kullanılabilecek template'ler hesabın kendi\ntemplate'leri ve herkese açık template'lerdir; kimlikleri ve parametreleri `GET /templates` ile\nlistelenir. Doldurulan metinler `/send`'e verilmiş gibi işlenir ve yanıt `/send` yanıtıyla aynıdır.\n\n**Toplu doğrulama.** Bir istekte en fazla 20 kayıt bulunur. `/send`'den farklı olarak template ile\nilgili hatalar isteğin tamamını reddeder ve hiçbir şey gönderilmez: eksik ya da geçersiz bir\n`templateId` veya `recipient`, hesabın kullanamadığı bir template ya da template'e uymayan parametreler\n400 döndürür. Template'ler doldurulduktan sonra kayıtlar `/send`'deki gibi tek tek değerlendirilir\n(alıcı biçimi, metin uzunluğu, mükerrer alıcı). Hatalı kayıtlar `rejectedItems` içinde\n`templates` dizisindeki konumlarıyla (`index`) bildirilir.\n\n**İstek sınırı.** Hesap başına dakikada 1000 istek, `/send` sınırından ayrı. Pencere ilk istekle\nbaşlar ve sabittir; reddedilen istekler de sayılır. Aşıldığında 429 `Retry-After` başlığıyla döner.\n\n**Yeniden deneme.** `/send` ile aynıdır: aynı istek iki kez gönderilirse iki görev oluşur. 503\nçoğunlukla hiçbir şeyin kuyruğa alınmadığını gösterir. Körlemesine yeniden göndermeden önce\n`GET /report` ile kontrol edebilirsiniz.\n",
        "operationId": "sendFromTemplate",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TemplateSendRequest"
              },
              "example": {
                "sender": "NETGSM",
                "templates": [
                  {
                    "templateId": 3,
                    "recipient": "905061234567",
                    "params": {
                      "otpCode": "123456"
                    }
                  },
                  {
                    "templateId": 4,
                    "recipient": "905061234568"
                  }
                ],
                "encoding": "TURKISH",
                "referenceId": "order-4711"
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "Görev oluşturuldu. İletim sonradan yapılır.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmsSendResponse"
                },
                "example": {
                  "jobId": "179309912974612345078627",
                  "status": "QUEUED",
                  "accepted": 2,
                  "rejected": 0,
                  "rejectedItems": [],
                  "rejectedItemsTruncated": false,
                  "referenceId": "order-4711"
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST ya da INVALID_SEND_WINDOW (`startAt` 18 aydan daha ileride). INVALID_REQUEST\niçin `message`:\n\n| `message` | Anlamı |\n|---|---|\n| gövde doğrulaması, `violations` ile | Zorunlu bir alan eksik, 20'den fazla kayıt, bir kaydın `recipient` alanı boş ya da 17 karakterden uzun. `violations` alanı belirtir (`templates[0].recipient`). |\n| `templates not found: [4]` | Template yok, silinmiş ya da başka bir hesaba ait. Bu durumlar birbirinden ayrılmaz. |\n| `Invalid params for templateId 3. Missing params: [otpCode]` | Template'in bir parametresi verilmemiş ya da boş. |\n| `Invalid params for templateId 3. Unexpected params: [code]` | Template'te olmayan bir parametre verilmiş. |\n| `param 'otpCode' is not a valid BIGINT` | Değer, parametrenin tanımlı türüne ya da uzunluğuna uymuyor; `message` hangi parametre olduğunu belirtir. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST",
                            "INVALID_SEND_WINDOW"
                          ]
                        }
                      }
                    }
                  ]
                },
                "example": {
                  "code": "INVALID_REQUEST",
                  "message": "templates not found: [4]",
                  "requestId": "3b9e0c1d2f4a4b6c8d0e1f2a3b4c5d6e",
                  "timestamp": "2026-10-30T14:05:12.481+03:00",
                  "violations": null
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. Hesap bu gönderimi yapamaz; `message` şunlardan biridir:\n\n| `message` | Anlamı |\n|---|---|\n| `account is not activated for this operation` | Hesapta SMS gönderimi etkin değil. |\n| `sub user may not use the sms api` | Alt kullanıcının SMS API'sini kullanma izni yok. |\n| `account operator is not served for this operation` | Hesabın operatörüne bu uç noktadan hizmet verilmiyor. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "422": {
            "description": "İstek geçerli ama gönderim yapılamaz. `code` ve `message`:\n\n| `code` | `message` | Anlamı ve çözüm |\n|---|---|---|\n| `REJECTED_HEADER` | `NO_HEADERS_REGISTERED` | Hesapta kayıtlı başlık yok. |\n| `REJECTED_HEADER` | `NOT_REGISTERED` | `sender` hesaba kayıtlı değil. Kayıtlı başlıkları `GET /senders` ile görebilirsiniz. |\n| `REJECTED_HEADER` | `CASE_MISMATCH` | Başlık kayıtlı ama büyük/küçük harfi farklı yazılmış; kayıtlı hâliyle göndermelisiniz. |\n| `REJECTED_HEADER` | `ROUTING_CODE_MISSING` | Alfanümerik başlık için hesapta yönlendirme kodu tanımlı değil. |\n| `REJECTED_HEADER` | `SUBSCRIBER_NUMBER_RESTRICTED` | Hesapta abone numarasından gönderim kısıtlı. |\n| `REJECTED_IYS` | `sender header has no iys brand code` | `BRAND` ya da `RETAILER` filtresi uygulanacak ama başlığın İYS marka kodu yok. |\n| `REJECTED_IYS` | `account is not in iys mode, filtering cannot be applied` | Hesap İYS modunda değil; `iysFilter` `BRAND` ya da `RETAILER` olamaz. |\n| `NO_DELIVERABLE_MESSAGES` | `all N messages rejected` | Doldurulan kayıtların hepsi reddedildi; görev oluşturulmadı. Hangi kaydın neden reddedildiği `rejectedItems` içindedir. |\n\nAbone numarasından gönderime onaylı olmayan bir hesapta, tamamı rakamlardan oluşan bir `sender`\niçin `NOT_REGISTERED` ve `NO_HEADERS_REGISTERED` mesajlarının sonuna\n` (subscriber number headers were not offered)` eklenir.\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "REJECTED_HEADER",
                            "REJECTED_IYS",
                            "NO_DELIVERABLE_MESSAGES"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "429": {
            "description": "RATE_LIMITED, `message` `template send rate limit exceeded`. Hesap başına dakikada 1000 istek aşıldı; `Retry-After` kadar bekleyip yeniden denemelisiniz.",
            "headers": {
              "Retry-After": {
                "description": "Yeniden denemeden önce beklenecek saniye.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. Servis geçici olarak kullanılamıyor. Görev çoğunlukla kuyruğa alınmamıştır. Toplu gönderimi körlemesine yeniden göndermeden önce `GET /report` ile kontrol edebilirsiniz.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/send/otp": {
      "post": {
        "tags": [
          "Gönderim"
        ],
        "summary": "OTP SMS gönderme",
        "description": "Tek bir alıcıya OTP (tek kullanımlık şifre) SMS'i gönderir. OTP, toplu SMS'ten ayrı bir kanaldan\nanında gönderilir; her istek tek bir mesaj ve tek bir alıcıdır. 202 döndüğünde mesaj operatöre\niletilmiştir, teslim sonradan olur.\n\n**Değerlerin işlenmesi.** Numara, gönderici ve metin gönderimden önce şu şekilde işlenir:\n\n| Alan | İşlem |\n|---|---|\n| `recipient` | `5XXXXXXXXX`, `05XXXXXXXXX` ya da `905XXXXXXXXX` biçiminde; başına `+` eklenebilir. |\n| `sender` | Büyük/küçük harf fark etmez. Abone numarası `5XXXXXXXXX`, `05XXXXXXXXX` ya da `905XXXXXXXXX` yazılabilir. |\n| `text` | Baştaki ve sondaki boşluklar kırpılır; karakterler aşağıdaki tabloya göre çevrilir. Uzunluk çevrilmiş metin üzerinden sayılır. |\n\n**Yeniden deneme.** 503 hiçbir şeyin gönderilmediğini gösterir; yeniden denemek güvenlidir.\n\n**Raporlar.** OTP iletim raporları toplu gönderim raporlarından ayrı tutulur; `jobId`\n`GET /report` ile sorgulanamaz.\n",
        "operationId": "sendOtp",
        "parameters": [
          {
            "name": "x-client",
            "in": "header",
            "required": false,
            "schema": {
              "type": "string"
            },
            "description": "Kurumsal OTP hizmeti tanımlı hesaplar `enterprise` göndermelidir (küçük harfle, yazıldığı gibi). Diğer hesaplar bu başlığı göndermez."
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OtpSendRequest"
              },
              "example": {
                "sender": "NETGSM",
                "text": "Dogrulama kodunuz: 123456",
                "recipient": "905061234567",
                "appName": "shop"
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "OTP operatöre iletildi.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OtpSendResponse"
                },
                "example": {
                  "jobId": "175518151237512050610525430"
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `message`:\n\n| `message` | Ne zaman |\n|---|---|\n| `N field(s) rejected` | `sender`, `text` ya da `recipient` eksik veya boş. `violations` belirtir. |\n| `request body could not be read as json` | Gövde JSON değil. |\n| `recipient is not a valid number` | `recipient` bir Türkiye cep numarası değil. |\n| `text is longer than 155 characters for this sender` | Çevrilmiş metin alfanümerik başlıkta 155, abone numarasında 160 karakteri aşıyor (`160` yazar). |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "403": {
            "description": "FORBIDDEN. Hesap bu gönderimi yapamaz; `message` şunlardan biridir:\n\n| `message` | Anlamı |\n|---|---|\n| `account is not activated for this operation` | Hesapta SMS gönderimi etkin değil. |\n| `sub user may not use the sms api` | Alt kullanıcının SMS API'sini kullanma izni yok. |\n| `account operator is not served for this operation` | Hesap bu OTP hizmetine tanımlı değil: kurumsal OTP hesabı `x-client: enterprise` göndermeden ya da diğer hesaplar bu başlıkla istek yaptı. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "FORBIDDEN"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "422": {
            "description": "İstek geçerli ama gönderim yapılamaz. `code` ve `message`:\n\n| `code` | `message` | Anlamı ve çözüm |\n|---|---|---|\n| `REJECTED_HEADER` | `NO_HEADERS_REGISTERED` | Hesapta kayıtlı başlık yok. |\n| `REJECTED_HEADER` | `NOT_REGISTERED` | `sender` hesaba kayıtlı değil. Kayıtlı başlıkları `GET /senders` ile görebilirsiniz. |\n| `REJECTED_HEADER` | `ROUTING_CODE_MISSING` | Alfanümerik başlık için hesapta yönlendirme kodu tanımlı değil. |\n| `REJECTED_HEADER` | `SUBSCRIBER_NUMBER_RESTRICTED` | Hesapta abone numarasından gönderim kısıtlı. |\n| `INSUFFICIENT_CREDIT` | `no credit, package or campaign to pay for the otp` | Hesabın OTP gönderimini karşılayacak kredisi, paketi ya da kampanyası yok. Hiçbir şey gönderilmedi; bakiye yükledikten sonra yeniden deneyebilirsiniz. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "REJECTED_HEADER",
                            "INSUFFICIENT_CREDIT"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "description": "SERVICE_UNAVAILABLE. Servis ya da OTP kanalı geçici olarak kullanılamıyor. Hiçbir şey gönderilmedi; yeniden denemek güvenlidir.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "SERVICE_UNAVAILABLE"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/templates": {
      "get": {
        "tags": [
          "Template"
        ],
        "summary": "Template'leri listeleme",
        "description": "Hesabın `POST /send/template` ile kullanabileceği template'leri, en yenisi önce, sayfa sayfa listeler:\nhesabın kendi template'leri ve herkese açık template'ler. Yalnızca hesabın kendi template'leri için\n`includePublic=false` verilir. Boş bir sayfa da 200 döner.\n\nHer template, gönderimde `params` içinde verilmesi gereken parametreleri ve her birinin kabul\nettiği değer türünü taşır.\n\n**İstek sınırı.** Hesap başına dakikada 20 istek. Pencere ilk istekle başlar ve sabittir;\nreddedilen istekler de sayılır. Aşıldığında 429 `Retry-After` başlığıyla döner.\n",
        "operationId": "listTemplates",
        "parameters": [
          {
            "name": "includePublic",
            "in": "query",
            "required": false,
            "description": "`false` yalnızca hesabın kendi template'lerini listeler; herkese açık template'ler dahil edilmez.",
            "schema": {
              "type": "boolean",
              "default": true
            }
          },
          {
            "name": "type",
            "in": "query",
            "required": false,
            "description": "Template tipi, birebir eşleşir.",
            "schema": {
              "type": "string",
              "maxLength": 100
            },
            "example": "AUTH_OTP"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "description": "Açıklamada geçen metin; büyük/küçük harf fark etmez.",
            "schema": {
              "type": "string",
              "maxLength": 100
            }
          },
          {
            "name": "content",
            "in": "query",
            "required": false,
            "description": "Template metninde geçen metin; büyük/küçük harf fark etmez.",
            "schema": {
              "type": "string",
              "maxLength": 100
            }
          },
          {
            "name": "page",
            "in": "query",
            "required": false,
            "description": "Sıfırdan başlayan sayfa numarası.",
            "schema": {
              "type": "integer",
              "minimum": 0,
              "default": 0
            }
          },
          {
            "name": "size",
            "in": "query",
            "required": false,
            "description": "Sayfa başına template.",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Bir sayfa template; en yenisi önce. Boş olabilir.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TemplateListResponse"
                },
                "example": {
                  "count": 1,
                  "page": 0,
                  "total": 1,
                  "totalPages": 1,
                  "templates": [
                    {
                      "templateId": 3,
                      "content": "Dogrulama kodunuz: ${otpCode}",
                      "type": "AUTH_OTP",
                      "description": "Giriş kodu",
                      "public": false,
                      "parameters": [
                        {
                          "name": "otpCode",
                          "type": "BIGINT",
                          "maxLength": null
                        }
                      ],
                      "createdAt": "2026-05-18T11:25:12.502+03:00"
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST. `message` şunlardan biridir:\n\n| `message` | Anlamı |\n|---|---|\n| `page must not be negative` | `page` negatif. |\n| `size must be between 1 and 100` | `size` aralık dışında. |\n| `type must be at most 100 characters` | Bir filtre (`type`, `search`, `content`) 100 karakterden uzun. |\n",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "429": {
            "description": "RATE_LIMITED, `message` `template list rate limit exceeded`. Hesap başına dakikada 20 istek aşıldı; `Retry-After` kadar bekleyip yeniden denemelisiniz.",
            "headers": {
              "Retry-After": {
                "description": "Yeniden denemeden önce beklenecek saniye.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    },
    "/balance": {
      "get": {
        "tags": [
          "Hesap"
        ],
        "summary": "Bakiye sorgulama",
        "description": "Hesabın kalan paketlerini, kampanyalarını ve kredi bakiyesini döner. Hesap token'dan alınır.\nYanıt gövdesi API'nin genel kurallarına uymaz: `amount` metin ya da sayı olabilir,\nkredi virgüllü metindir ve `stip=2` yanıtında bazı alanlar hiç bulunmayabilir.\n\nGeçerli bir token yeterlidir; ayrıca bir yetki istenmez.\n\n**Önbellek.** Aynı hesap, aynı `stip` ve aynı `service` için yanıt 10 saniye saklanır; bir\ngönderimden hemen sonra okunan bakiye en fazla 10 saniye eski olabilir.\n\n**İstek sınırı.** Hesap başına dakikada 60 istek. Pencere ilk istekle başlar ve sabittir; her\nistek sayılır. Aşıldığında 429 `Retry-After` başlığıyla döner.\n",
        "operationId": "getBalance",
        "parameters": [
          {
            "name": "stip",
            "in": "query",
            "required": false,
            "description": "`1`: varlıklar türlerine göre. `2`: tek satırlık özet. `3`: varlıklar ve kredi bakiyesi.\nBaşka bir değer ya da hiç verilmemesi `1` sayılır; hata dönmez.\n",
            "schema": {
              "type": "integer",
              "enum": [
                1,
                2,
                3
              ],
              "default": 1
            }
          },
          {
            "name": "service",
            "in": "query",
            "required": false,
            "description": "Listeyi bir hizmet grubuyla sınırlar: yalnızca o gruptaki hizmetlerin paket ve kampanyaları\ndöner. Verilmezse liste SMS gönderim hizmetinin varlıklarıdır.\nBüyük/küçük harf fark etmez. Kredi bakiyesi bir hizmete ait değildir; listede yer almaz,\n`stip=3` onu her zaman sona ekler. `stip=2` özeti bu parametreden etkilenmez.\n\n| Değer | Grup |\n|---|---|\n| `sms` | SMS (giden, gelen, SMPP, flash, kısa numara, 0800 SMS, GSM ve M2M SMS); OTP SMS paketleri `otp`'dadır |\n| `otp` | OTP ve OTP SMS paketleri |\n| `ses` | Ses (giden, gelen, sesli mesaj, yönlendirme, telesekreter, 0800 çağrı, otomatik arama) |\n| `fax` | Faks (giden, gelen) |\n| `whatsapp` | WhatsApp |\n| `santral` | Santral, SIP / NGN trunk, IP FCT, THK |\n| `netsipp` | Netsipp |\n| `gsm` | GSM hat, data, M2M, NetIOT, SIM kart |\n| `internet` | İnternet, statik IP, alan adı, sunucu barındırma |\n| `numara` | Numara kullanımı, özel numara, numara devri, MSISDN sorgulama |\n| `ai` | Yapay zeka entegrasyonları |\n| `ucret` | Tek seferlik ücretler ve fatura işlemleri |\n",
            "schema": {
              "type": "string",
              "enum": [
                "sms",
                "otp",
                "ses",
                "fax",
                "whatsapp",
                "santral",
                "netsipp",
                "gsm",
                "internet",
                "numara",
                "ai",
                "ucret"
              ]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "`stip` 1 ve 3 için `BalanceListResponse`, `stip` 2 için `BalanceSummaryResponse`.\n",
            "content": {
              "application/json": {
                "schema": {
                  "oneOf": [
                    {
                      "$ref": "#/components/schemas/BalanceListResponse"
                    },
                    {
                      "$ref": "#/components/schemas/BalanceSummaryResponse"
                    }
                  ]
                },
                "examples": {
                  "stip3": {
                    "summary": "Varlıklar ve kredi (stip=3)",
                    "value": {
                      "balance": [
                        {
                          "amount": 277,
                          "balance_name": "Adet SMS"
                        },
                        {
                          "amount": "767",
                          "balance_name": "Adet OTP SMS"
                        },
                        {
                          "amount": "242",
                          "balance_name": "Dakika"
                        },
                        {
                          "amount": "92,150",
                          "balance_name": "Kredi Bakiye"
                        }
                      ]
                    }
                  },
                  "stip2Credit": {
                    "summary": "Özet, faturasız hesap, kredi var (stip=2)",
                    "value": {
                      "code": "00",
                      "balance": "92,150"
                    }
                  },
                  "stip2Sms": {
                    "summary": "Özet, faturasız hesap, kredi yok, SMS var (stip=2)",
                    "value": {
                      "code": "00",
                      "balance": "277",
                      "type": "AdetSMS"
                    }
                  },
                  "stip2Postpaid": {
                    "summary": "Özet, faturalı hesap (stip=2)",
                    "value": {
                      "code": "00",
                      "balance": "0"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "INVALID_REQUEST, `message` `service must be one of sms, otp, ses, ...`. `service` tabloda olmayan bir değer.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "INVALID_REQUEST"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthenticated"
          },
          "429": {
            "description": "RATE_LIMITED, `message` `balance rate limit exceeded`. Hesap başına dakikada 60 istek aşıldı; `Retry-After` kadar bekleyip yeniden denemelisiniz.",
            "headers": {
              "Retry-After": {
                "description": "Yeniden denemeden önce beklenecek saniye.",
                "schema": {
                  "type": "integer"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiError"
                    },
                    {
                      "properties": {
                        "code": {
                          "enum": [
                            "RATE_LIMITED"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/Failed"
          },
          "503": {
            "$ref": "#/components/responses/Unavailable"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "bearer": {
        "type": "http",
        "scheme": "bearer",
        "description": "Bearer erişim token'ı. Herhangi bir gövde okunmadan önce kontrol edilir."
      }
    },
    "responses": {
      "Unauthenticated": {
        "description": "UNAUTHENTICATED. Bearer token yok ya da token geçersiz veya süresi dolmuş; `message` `no bearer token` ya da `invalid or expired token`.",
        "content": {
          "application/json": {
            "schema": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/ApiError"
                },
                {
                  "properties": {
                    "code": {
                      "enum": [
                        "UNAUTHENTICATED"
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      },
      "Unavailable": {
        "description": "SERVICE_UNAVAILABLE. Hiçbir şey yapılmadı; yeniden denemek güvenlidir.",
        "content": {
          "application/json": {
            "schema": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/ApiError"
                },
                {
                  "properties": {
                    "code": {
                      "enum": [
                        "SERVICE_UNAVAILABLE"
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      },
      "RateLimited": {
        "description": "RATE_LIMITED. Hesap için bu uç noktanın sınırı aşıldı; `message` sınırı belirtir. `Retry-After` yalnızca hesabın gönderimi askıya alındığında bulunmaz.",
        "headers": {
          "Retry-After": {
            "description": "İsteğin tekrarlanabileceği zamana kadar kalan tam saniye.",
            "schema": {
              "type": "integer"
            }
          }
        },
        "content": {
          "application/json": {
            "schema": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/ApiError"
                },
                {
                  "properties": {
                    "code": {
                      "enum": [
                        "RATE_LIMITED"
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      },
      "Failed": {
        "description": "INTERNAL_ERROR, `message` `internal error`. Beklenmeyen hata; bildirirken `requestId` değerini paylaşmanız gerekir.",
        "content": {
          "application/json": {
            "schema": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/ApiError"
                },
                {
                  "properties": {
                    "code": {
                      "enum": [
                        "INTERNAL_ERROR"
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    "schemas": {
      "BalanceListResponse": {
        "type": "object",
        "required": [
          "balance"
        ],
        "properties": {
          "balance": {
            "type": "array",
            "description": "Her varlık türü için bir kayıt. Hiç varlık yoksa boş liste. `stip=3` sonuna her zaman `Kredi Bakiye` kaydını ekler.",
            "items": {
              "$ref": "#/components/schemas/BalanceEntry"
            }
          }
        }
      },
      "BalanceEntry": {
        "type": "object",
        "required": [
          "amount",
          "balance_name"
        ],
        "properties": {
          "amount": {
            "description": 'Kalan miktar. Metin ya da sayı olabilir: bir türün tek kaydı varsa metin (`"767"`), birden fazla\nkaydı toplanmışsa sayı (`277`, `242.5`). `Kredi Bakiye` kaydında TL cinsinden, virgülle ve üç\nondalık basamakla metin (`"92,150"` = 92,15 TL).\n',
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "number"
              }
            ]
          },
          "balance_name": {
            "type": "string",
            "description": "Varlığın adı, örneğin `Adet SMS`, `Adet OTP SMS`, `Dakika`, `Kredi Bakiye`. Liste sabit değildir; hesaptaki ürünlere göre değişir."
          }
        }
      },
      "BalanceSummaryResponse": {
        "type": "object",
        "required": [
          "code"
        ],
        "description": "`stip=2` özeti. `balance` ve `type` yalnızca ilgili durumda bulunur.",
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "00"
            ]
          },
          "balance": {
            "type": "string",
            "description": 'Faturasız hesapta kredi varsa TL kredi (`"92,150"`), yoksa kalan SMS adedi (`"277"`, `type`\nile birlikte). Faturalı hesapta her zaman `"0"`. Faturasız hesapta ikisi de yoksa bulunmaz.\n'
          },
          "type": {
            "type": "string",
            "enum": [
              "AdetSMS"
            ],
            "description": "Yalnızca `balance` SMS adedi olduğunda bulunur."
          }
        }
      },
      "SmsSendRequest": {
        "type": "object",
        "required": [
          "sender",
          "messages"
        ],
        "properties": {
          "sender": {
            "type": "string",
            "minLength": 1,
            "maxLength": 35,
            "description": "Gönderici başlığı. Hesaba kayıtlı bir başlıkla yazıldığı gibi birebir eşleşmelidir: büyük/küçük harf dahil, kırpma yapılmaz. Alfanümerik bir başlık (örneğin `NETGSM`) ya da hesabın abone numarası olabilir; abone numarası başında `0` ya da `90` olmadan yazılır (`5061234567`). Kullanabileceğiniz başlıkları ve her birinin kullanılabilir olup olmadığını `GET /senders` ile görebilirsiniz. Eşleşmezse istek 422 `REJECTED_HEADER` ile reddedilir; boş ya da yalnızca boşluktan oluşan bir değer ise 400 ile reddedilir.",
            "example": "NETGSM"
          },
          "messages": {
            "type": "array",
            "minItems": 1,
            "maxItems": 1e6,
            "description": "Gönderilecek mesajlar; her alıcı için bir kayıt. En az 1, en fazla 1.000.000 kayıt; fazlası 400 ile reddedilir.",
            "items": {
              "$ref": "#/components/schemas/SmsMessage"
            }
          },
          "encoding": {
            "type": "string",
            "enum": [
              "DEFAULT",
              "TURKISH",
              "UNICODE"
            ],
            "default": "DEFAULT",
            "description": "Metnin karakter kodlaması. Tüm kayıtlara uygulanır. Büyük/küçük harfe duyarlıdır; listede\nolmayan bir değer (`turkish`, `GSM` dahil) istek 400 `1 field(s) rejected` ile reddedilir;\n`violations` alanı (`encoding`) ve geçerli değerleri belirtir.\n\n| Değer | Ne zaman | En fazla uzunluk |\n|---|---|---|\n| `DEFAULT` | Standart GSM alfabesi. Türkçe karakterler Latin karşılıklarına çevrilir (ç→c, ş→s gibi). | 917 |\n| `TURKISH` | Türkçe karakterlerin (çğıöşüÇĞİÖŞÜ) korunması gerektiğinde. `çğışĞİŞ` iki karakter sayılır. | 888 |\n| `UNICODE` | Emoji ya da Arapça, Kiril gibi GSM alfabesinde olmayan karakterler için. | 396 |\n\nAlfanümerik bir gönderici başlığında her sınır 5 karakter azdır. Sınırı aşan kayıt\n`MESSAGE_TOO_LONG` ile reddedilir. Bir metnin kaç SMS'e bölüneceğini `POST /length` ile\nhesaplayabilirsiniz.\n"
          },
          "iysFilter": {
            "description": "İYS (İleti Yönetim Sistemi) izin filtresi; ticari iletilerde alıcının izni olmayanlar gönderimden\nçıkarılır. Büyük/küçük harf fark etmez:\n\n| Değer | Anlamı |\n|---|---|\n| `NONE` | Filtre yok. Yalnızca bilgilendirme (ticari olmayan) iletiler için. |\n| `BRAND` | Marka adına alınmış izinlere göre filtrelenir. |\n| `RETAILER` | Bayi adına alınmış izinlere göre filtrelenir. |\n| `BRAND_AND_RETAILER` | Her ikisine göre filtrelenir. |\n\nBunların dışındaki her değer `NONE` sayılır. Hesap ticari gönderim (marka ya da bayi) tipinde\ntanımlıysa istekteki değer yok sayılır ve hesabın tipi uygulanır.\n\n`BRAND` ya da `RETAILER` uygulanacaksa göndericinin İYS marka kodu olmalıdır; hesap İYS\nmodunda değilse bu iki değer istek 422 `REJECTED_IYS` ile reddedilir. `BRAND_AND_RETAILER`\niçin bu iki kontrol yapılmaz.\n",
            "default": "NONE",
            "type": "string",
            "enum": [
              "NONE",
              "BRAND",
              "RETAILER",
              "BRAND_AND_RETAILER"
            ]
          },
          "startAt": {
            "type": "string",
            "format": "date-time",
            "description": "En erken gönderim zamanı, saat dilimi farkıyla (`2026-09-10T09:00:00+03:00`). Verilmezse ya da geçmişteyse gönderim hemen başlar. 18 aydan daha ilerisi 400 `INVALID_SEND_WINDOW` ile reddedilir. Bir dakikadan daha ileri bir başlangıç görevi `SCHEDULED` yapar. Saat dilimi farkı olmayan ya da okunamayan bir tarih istek 400 ile reddedilir."
          },
          "stopAt": {
            "type": "string",
            "format": "date-time",
            "description": "En geç gönderim zamanı, saat dilimi farkıyla. Verilmezse ya da geçmişteyse `startAt` + 21 saat kabul edilir. Aralık, 1000 ve üzeri mesajda 10 dakikadan, daha azında 5 dakikadan kısaysa bu süreye uzatılır; 21 saatten uzunsa 21 saate kısaltılır. Bu düzeltmeler hata döndürmez ve belirlenen aralık yanıtta yer almaz."
          },
          "partnerCode": {
            "type": "string",
            "maxLength": 32,
            "description": "İş ortağı (bayi) kodu. Yalnızca kayıt amaçlıdır; gönderimi etkilemez."
          },
          "referenceId": {
            "type": "string",
            "maxLength": 50,
            "description": "Yanıtta aynen geri döndürülür."
          },
          "appName": {
            "type": "string",
            "maxLength": 50,
            "description": "Gönderimi yapan uygulamanın adı. Yalnızca kayıt amaçlıdır; gönderimi etkilemez."
          }
        }
      },
      "SmsMessage": {
        "type": "object",
        "required": [
          "text",
          "recipient"
        ],
        "description": "Tek bir alıcıya gidecek tek bir mesaj. Aynı metni birden fazla alıcıya göndermek için her alıcı ayrı bir kayıt olarak eklenir. Hatalı bir kayıt isteğin tamamını reddettirmez; yalnızca o kayıt `rejectedItems` içinde bildirilir.",
        "properties": {
          "text": {
            "type": "string",
            "description": "Mesaj metni. Boş olamaz (`INVALID_MESSAGE`). En fazla uzunluk `encoding` değerine ve göndericinin türüne bağlıdır (`MESSAGE_TOO_LONG`); bkz. `encoding` ve `/length`.",
            "example": "Siparişiniz kargoya verildi."
          },
          "recipient": {
            "type": "string",
            "pattern": "^(90\\d{10}|-\\d{9,17})$",
            "description": "Alıcı numarası, iki biçimden biriyle yazılır; yalnızca rakamlar ve yurt dışı için baştaki tek `-`\nkullanılabilir, boşluk, parantez ya da tire ayracı olmaz:\n\n| Tür | Biçim | Örnek |\n|---|---|---|\n| Türkiye | `90` ve ardından 10 rakam; `+` ya da baştaki `0` olmadan | `+90 506 123 45 67` için `905061234567` |\n| Yurt dışı | `-` ve ardından ülke koduyla birlikte 9–17 rakam; `+` ya da `00` olmadan | `+49 151 12345678` için `-4915112345678` |\n\nYanlış yazımlar: `+905061234567`, `05061234567`, `5061234567`, `0049151…`, `-+49151…`.\nBu biçimlere uymayan kayıt `INVALID_RECIPIENT` ile reddedilir. Numaranın gerçekte var olup\nolmadığı ya da hangi operatöre ait olduğu burada denetlenmez; iletim sonucunu `GET /report` ile\ngörebilirsiniz. Hesabın yurt dışı gönderim izni yoksa yurt dışı kayıtlar `NO_INTERNATIONAL_PERMISSION`\nile reddedilir.\n",
            "example": "905061234567"
          }
        }
      },
      "TemplateSendRequest": {
        "type": "object",
        "required": [
          "sender",
          "templates"
        ],
        "properties": {
          "sender": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/sender"
          },
          "templates": {
            "type": "array",
            "minItems": 1,
            "maxItems": 20,
            "description": "Gönderilecek kayıtlar; her alıcı için bir template. En az 1, en fazla 20 kayıt. Kayıtlardan biri hatalıysa (eksik alan, kullanılamayan template, uymayan parametre) istek 400 ile reddedilir.",
            "items": {
              "$ref": "#/components/schemas/TemplateMessage"
            }
          },
          "encoding": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/encoding"
          },
          "iysFilter": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/iysFilter"
          },
          "startAt": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/startAt"
          },
          "stopAt": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/stopAt"
          },
          "partnerCode": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/partnerCode"
          },
          "referenceId": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/referenceId"
          },
          "appName": {
            "$ref": "#/components/schemas/SmsSendRequest/properties/appName"
          }
        }
      },
      "TemplateMessage": {
        "type": "object",
        "required": [
          "templateId",
          "recipient"
        ],
        "description": "Tek bir alıcıya gidecek, bir template'ten doldurulacak tek bir mesaj.",
        "properties": {
          "templateId": {
            "type": "integer",
            "format": "int64",
            "minimum": 1,
            "description": "Template'in kimliği. Hesabın kendi template'i ya da herkese açık bir template olmalıdır.",
            "example": 3
          },
          "recipient": {
            "type": "string",
            "maxLength": 17,
            "pattern": "^(90\\d{10}|-\\d{9,17})$",
            "description": "Alıcı numarası, `/send`'deki `recipient` ile aynı biçimde: Türkiye için `90` ve ardından 10 rakam, yurt dışı için `-` ve ardından 9–17 rakam. Boş ya da 17 karakterden uzunsa istek 400 ile reddedilir; biçime uymayan kayıt template doldurulduktan sonra `INVALID_RECIPIENT` ile reddedilir.",
            "example": "905061234567"
          },
          "params": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            },
            "description": "Template'teki yer tutucuların değerleri: yer tutucu adı → değer. Template'in tanımladığı\nparametrelerin hepsini boş olmayan değerlerle vermeli, template'te olmayan bir ad vermemelisiniz.\nYer tutucusu olmayan bir template'te alan verilmez. Değerler her zaman string olarak yazılır ve\nparametrenin tanımlı türüne uymalıdır:\n\n| Tür | Kabul edilen |\n|---|---|\n| `BIGINT` | Tam sayı, örn. `\"123456\"` |\n| `FLOAT` | En fazla 4 ondalık basamaklı sayı, örn. `\"12.50\"` |\n| `TEXT` | Template'te tanımlı uzunluğu aşmayan metin |\n| `DATE` | `dd.MM.yyyy` ya da `dd/MM/yyyy` |\n| `DATETIME` | `dd.MM.yyyy HH:mm[:ss]` ya da `dd/MM/yyyy HH:mm[:ss]` |\n",
            "example": {
              "otpCode": "123456"
            }
          }
        }
      },
      "OtpSendRequest": {
        "type": "object",
        "required": [
          "sender",
          "text",
          "recipient"
        ],
        "properties": {
          "sender": {
            "type": "string",
            "minLength": 1,
            "description": "Gönderici başlığı: hesaba kayıtlı bir alfanümerik başlık (örneğin `NETGSM`) ya da hesabın abone numarası. Büyük/küçük harf fark etmez. Abone numarası `5XXXXXXXXX`, `05XXXXXXXXX` ya da `905XXXXXXXXX` yazılabilir. Kayıtlı başlıkları `GET /senders` ile görebilirsiniz.",
            "example": "NETGSM"
          },
          "text": {
            "type": "string",
            "minLength": 1,
            "description": "OTP metni. Baştaki ve sondaki boşluklar kırpılır, karakterler gönderimden önce çevrilir:\n\n| Metinde | Gönderilen |\n|---|---|\n| `ç ğ ı ö ş ü Ç Ğ İ Ö Ş Ü` | `c g i o s u C G I O S U` |\n| `{ [` / `} ]` | `(` / `)` |\n| `“` `”` `` ` `` | `\"` |\n| `‘ ’` | `'` |\n| `~` | `?` |\n| `€` | `;EO;` |\n| sekme, `\\|` | boşluk |\n| `^` | silinir |\n| satır sonu | `\\n` (iki karakter) |\n| diğer desteklenmeyen karakterler | `?` |\n\nOTP her zaman tek SMS'tir. Çevrilmiş metin alfanümerik başlıkta en fazla 155, abone numarasında\nen fazla 160 karakter olabilir; alfanümerik başlıkta sınır daha kısadır, çünkü operatör kodu\nmetnin sonuna eklenir.\n",
            "example": "Dogrulama kodunuz: 123456"
          },
          "recipient": {
            "type": "string",
            "minLength": 1,
            "description": "Alıcı, bir Türkiye cep numarası: `5XXXXXXXXX`, `05XXXXXXXXX` ya da `905XXXXXXXXX`; başına `+` eklenebilir (`+905XXXXXXXXX`). Boşluk ya da yurt dışı numarası kabul edilmez.",
            "example": "905061234567"
          },
          "appName": {
            "type": "string",
            "description": "Gönderimi yapan uygulamanın adı. Yalnızca kayıt amaçlıdır."
          }
        }
      },
      "OtpSendResponse": {
        "type": "object",
        "required": [
          "jobId"
        ],
        "properties": {
          "jobId": {
            "type": "string",
            "description": "OTP gönderiminin kimliği. Bir sorun bildirirken paylaşmalısınız.",
            "example": "175518151237512050610525430"
          }
        }
      },
      "TemplateListResponse": {
        "type": "object",
        "required": [
          "count",
          "page",
          "total",
          "totalPages",
          "templates"
        ],
        "properties": {
          "count": {
            "type": "integer",
            "description": "Bu sayfadaki template sayısı."
          },
          "page": {
            "type": "integer",
            "description": "İstenen sayfa."
          },
          "total": {
            "type": "integer",
            "format": "int64",
            "description": "Filtreye uyan template'lerin tüm sayfalardaki toplamı."
          },
          "totalPages": {
            "type": "integer",
            "description": "Bu `size` ile toplam sayfa sayısı."
          },
          "templates": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TemplateEntry"
            }
          }
        }
      },
      "TemplateEntry": {
        "type": "object",
        "required": [
          "templateId",
          "content",
          "type",
          "description",
          "public",
          "parameters",
          "createdAt"
        ],
        "description": "Tüm alanlar her zaman bulunur; değeri olmayan bir alan `null` olarak gönderilir.",
        "properties": {
          "templateId": {
            "type": "integer",
            "format": "int64",
            "description": "Template'in kimliği; `POST /send/template` kayıtlarındaki `templateId`.",
            "example": 3
          },
          "content": {
            "type": "string",
            "description": "Template metni. Yer tutucular `${ad}` biçimindedir ve gönderimde `params` ile doldurulur.",
            "example": "Dogrulama kodunuz: ${otpCode}"
          },
          "type": {
            "type": "string",
            "description": "Template tipi, örn. `AUTH_OTP`, `SECURITY_ALERT`, `SERVICE_ALERT`."
          },
          "description": {
            "type": "string",
            "nullable": true,
            "description": "Template'in açıklaması."
          },
          "public": {
            "type": "boolean",
            "description": "Herkese açık bir template'se `true`, hesabın kendi template'iyse `false`."
          },
          "parameters": {
            "type": "array",
            "description": "Template'in yer tutucuları; gönderimde her birini `params` içinde vermelisiniz.",
            "items": {
              "type": "object",
              "required": [
                "name",
                "type",
                "maxLength"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Yer tutucunun adı; `params` anahtarı.",
                  "example": "otpCode"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "BIGINT",
                    "FLOAT",
                    "TEXT",
                    "DATE",
                    "DATETIME"
                  ],
                  "description": "Kabul edilen değer türü; biçimleri `POST /send/template` `params` açıklamasındadır."
                },
                "maxLength": {
                  "type": "integer",
                  "nullable": true,
                  "description": "En fazla değer uzunluğu; yalnızca `TEXT` için dolu."
                }
              }
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "description": "Template'in kayıt zamanı, saat dilimi farkıyla.",
            "example": "2026-05-18T11:25:12.502+03:00"
          }
        }
      },
      "SmsSendResponse": {
        "type": "object",
        "description": "Tüm alanlar her zaman bulunur; değeri olmayan bir alan `null` olarak gönderilir.",
        "required": [
          "jobId",
          "status",
          "accepted",
          "rejected",
          "rejectedItems",
          "rejectedItemsTruncated",
          "referenceId"
        ],
        "properties": {
          "jobId": {
            "type": "string",
            "description": "Oluşturulan görevin numarası. Rapor, istatistik ve iptal için kullanılır; destek taleplerinde belirtmelisiniz."
          },
          "status": {
            "type": "string",
            "enum": [
              "QUEUED",
              "SCHEDULED"
            ],
            "description": "| Değer | Anlamı |\n|---|---|\n| `QUEUED` | Gönderim hemen başladı; görev iptal edilemez. |\n| `SCHEDULED` | Görev `startAt` zamanına kadar bekletiliyor (dakikaya göre bir dakikadan daha ileri bir başlangıç); o zamana kadar `POST /cancel` ile iptal edebilirsiniz. |\n"
          },
          "accepted": {
            "type": "integer",
            "description": "Gönderime alınan kayıt sayısı. `accepted + rejected`, istekteki kayıt sayısına eşittir."
          },
          "rejected": {
            "type": "integer",
            "description": "Reddedilen kayıt sayısı. `rejectedItems` kısaltılsa da bu sayı tamdır."
          },
          "rejectedItems": {
            "type": "array",
            "maxItems": 100,
            "description": "Reddedilen kayıtlar, `index` sırasıyla ilk 100 tanesi. Hiçbiri reddedilmediyse boş dizi.",
            "items": {
              "$ref": "#/components/schemas/RejectedMessage"
            }
          },
          "rejectedItemsTruncated": {
            "type": "boolean",
            "description": "100'den fazla kayıt reddedildiği için `rejectedItems` kısaltıldıysa `true`. `accepted` ve `rejected` yine tamdır."
          },
          "referenceId": {
            "type": "string",
            "nullable": true,
            "description": "İstekte verilen `referenceId`; verilmediyse `null`."
          }
        }
      },
      "RejectedMessage": {
        "type": "object",
        "required": [
          "index",
          "recipient",
          "reason"
        ],
        "properties": {
          "index": {
            "type": "integer",
            "description": "Kaydın istekteki `messages` dizisindeki sırası, sıfırdan başlar."
          },
          "recipient": {
            "type": "string",
            "nullable": true,
            "description": "Kayıttaki alıcı. Kayıt `null` ise ya da alıcısı yoksa `null`."
          },
          "reason": {
            "type": "string",
            "enum": [
              "INVALID_RECIPIENT",
              "INVALID_MESSAGE",
              "MESSAGE_TOO_LONG",
              "MALFORMED_ENTRY",
              "DUPLICATE_RECIPIENT",
              "NO_INTERNATIONAL_PERMISSION"
            ],
            "description": "| Değer | Ne zaman |\n|---|---|\n| `INVALID_RECIPIENT` | Numara eksik ya da biçimi yanlış; bkz. `recipient`. |\n| `INVALID_MESSAGE` | Metin eksik ya da boş. |\n| `MESSAGE_TOO_LONG` | Metin, `encoding` ve gönderici türüne göre sınırı aşıyor; bkz. `encoding`. |\n| `MALFORMED_ENTRY` | Kayıt `null`. |\n| `DUPLICATE_RECIPIENT` | Aynı alıcı istekte daha sonra yeniden geçiyor. Yalnızca son geçen kayıt gönderilir, öncekiler bu nedenle reddedilir; son kayıt başka bir nedenle reddedilse bile. Numaralar yazıldığı gibi karşılaştırılır. Mükerrer gönderime izin verilen hesaplarda uygulanmaz. |\n| `NO_INTERNATIONAL_PERMISSION` | Numara yurt dışı (`-` ile başlıyor) ve hesabın yurt dışı gönderim izni yok. İzin için destek ekibiyle iletişime geçmelisiniz. Yalnızca başka bir hatası olmayan kayıtlarda bildirilir. |\n\nBir kayıt birden fazla nedenle hatalıysa tek neden bildirilir; öncelik: `DUPLICATE_RECIPIENT`,\n`MALFORMED_ENTRY`, `MESSAGE_TOO_LONG`, `INVALID_RECIPIENT`, `INVALID_MESSAGE`,\n`NO_INTERNATIONAL_PERMISSION`.\n"
          }
        }
      },
      "InboxResponse": {
        "type": "object",
        "required": [
          "count",
          "messages",
          "truncated"
        ],
        "properties": {
          "count": {
            "type": "integer"
          },
          "messages": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/InboxMessage"
            }
          },
          "truncated": {
            "type": "boolean",
            "description": "500 mesaj sınırına ulaşıldığında ve aralıkta daha fazlası olabileceğinde true; geri kalanı için daha dar bir aralık sorgulamalısınız. count 500'ün altındayken de true olabilir."
          }
        }
      },
      "InboxMessage": {
        "type": "object",
        "required": [
          "id",
          "jobId",
          "sender",
          "text",
          "operator",
          "receivedAt"
        ],
        "properties": {
          "id": {
            "type": "string",
            "nullable": true
          },
          "jobId": {
            "type": "string",
            "nullable": true,
            "description": "Mesajın ait olduğu görev, atanmışsa; aksi halde `null`."
          },
          "sender": {
            "type": "string",
            "nullable": true,
            "description": "Mesajın geldiği numara; yurt içi numaralar 90 öneki olmadan yazılır."
          },
          "text": {
            "type": "string",
            "nullable": true
          },
          "operator": {
            "type": "string",
            "nullable": true,
            "description": "Mesajın geldiği operatörün adı (örn. NETGSM MOBIL). Bir ad, kod değil."
          },
          "receivedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "description": "Mesajın alındığı zaman, saat dilimi farkı içeren ISO-8601. Zaman bilgisi yoksa `null`."
          }
        }
      },
      "ReportResponse": {
        "type": "object",
        "required": [
          "count",
          "page",
          "reports"
        ],
        "properties": {
          "count": {
            "type": "integer"
          },
          "page": {
            "type": "integer"
          },
          "reports": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ReportEntry"
            }
          }
        }
      },
      "ReportEntry": {
        "type": "object",
        "description": "Her satırda sekiz alanın tamamı bulunur; değeri olmayan bir alan `null` olarak gönderilir.",
        "required": [
          "jobId",
          "number",
          "status",
          "operator",
          "messageLength",
          "deliveredAt",
          "failReason",
          "referenceId"
        ],
        "properties": {
          "jobId": {
            "type": "string",
            "nullable": true
          },
          "number": {
            "type": "string",
            "nullable": true,
            "description": "Alıcı numarası; yurt içi numaralar 90 öneki olmadan yazılır."
          },
          "status": {
            "type": "string",
            "enum": [
              "PENDING",
              "DELIVERED",
              "NOT_DELIVERED"
            ],
            "nullable": true,
            "description": "İletim sonucu. Durum bilgisi yoksa `null`.\n\n| Değer | Anlamı |\n|---|---|\n| `PENDING` | Bekliyor |\n| `DELIVERED` | İletildi |\n| `NOT_DELIVERED` | İletilmedi; nedeni `failReason` alanındadır |\n"
          },
          "operator": {
            "type": "string",
            "enum": [
              "VODAFONE",
              "TURK_TELEKOM",
              "TURKCELL",
              "NETGSM",
              "AKONTEL",
              "INTERNATIONAL",
              "UNKNOWN"
            ],
            "nullable": true,
            "description": "Mesajın gittiği operatör. VODAFONE, TURK_TELEKOM, TURKCELL, NETGSM, AKONTEL, yurt dışı numaralar için INTERNATIONAL; tanınmayan bir operatör için UNKNOWN. Operatör bilgisi yoksa `null`."
          },
          "messageLength": {
            "type": "integer",
            "nullable": true,
            "description": "Mesajın kapladığı SMS parça sayısı."
          },
          "deliveredAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "description": "İletildiği zaman. Yalnızca `status` DELIVERED olduğunda dolu; başarısızlar dahil diğer tüm satırlarda `null`."
          },
          "failReason": {
            "type": "string",
            "enum": [
              "INVALID_NUMBER",
              "NOT_SENT_TO_OPERATOR",
              "OPERATOR_REJECTED",
              "OPERATOR_ERROR",
              "SEND_ERROR",
              "DUPLICATE",
              "INSUFFICIENT_CREDIT",
              "BLACKLISTED",
              "IYS_REJECTED",
              "IYS_ERROR",
              "MESSAGE_NOT_CREATED",
              "INVALID_NUMBER_FORMAT",
              "NTS_NOT_APPROVED",
              "REPORT_NOT_FORWARDED",
              "NO_INTERNATIONAL_PERMISSION",
              "TIMEOUT",
              "SMS_DISABLED_ON_DEVICE",
              "DEVICE_NOT_SUPPORTED",
              "ROUTING_FAILED",
              "OPERATOR_TIMEOUT",
              "UNKNOWN_SUBSCRIBER",
              "ILLEGAL_SUBSCRIBER",
              "SYSTEM_ERROR",
              "UNKNOWN"
            ],
            "nullable": true,
            "description": "İletilmeme nedeni. Yalnızca `status` `NOT_DELIVERED` olduğunda dolu, aksi halde `null`.\n\n| Değer | Anlamı |\n|---|---|\n| `INVALID_NUMBER` | Hatalı numara. Yurt dışı bir numarada, hesabın yurt dışı gönderim izni olmadığı anlamına da gelebilir: izin gönderim sırasında denetlenir (`NO_INTERNATIONAL_PERMISSION`), ama kayıt kabul edildikten sonra izin kaldırılırsa kayıt burada bu kodla döner. |\n| `NOT_SENT_TO_OPERATOR` | Operatöre gönderilemedi |\n| `OPERATOR_REJECTED` | Operatör kabul etmedi |\n| `OPERATOR_ERROR` | Operatör hatası |\n| `SEND_ERROR` | Gönderim hatası |\n| `DUPLICATE` | Mükerrer gönderim |\n| `INSUFFICIENT_CREDIT` | Kredi yetersiz |\n| `BLACKLISTED` | Numara kara listede |\n| `IYS_REJECTED` | İYS reddi |\n| `IYS_ERROR` | İYS kontrolü yapılamadı |\n| `MESSAGE_NOT_CREATED` | Mesaj oluşturulamadı |\n| `INVALID_NUMBER_FORMAT` | Hatalı numara biçimi |\n| `NTS_NOT_APPROVED` | NTS onayı alınamadı |\n| `REPORT_NOT_FORWARDED` | Rapor iletilemedi |\n| `NO_INTERNATIONAL_PERMISSION` | Hesabın yurt dışı gönderim izni yok |\n| `TIMEOUT` | Zaman aşımı |\n| `SMS_DISABLED_ON_DEVICE` | Mobil cihaz SMS almaya kapalı |\n| `DEVICE_NOT_SUPPORTED` | Mobil cihaz desteklemiyor |\n| `ROUTING_FAILED` | Yönlendirme başarısız |\n| `OPERATOR_TIMEOUT` | Hedef operatörde zaman aşımı oluştu |\n| `UNKNOWN_SUBSCRIBER` | Tanımlanamayan abone |\n| `ILLEGAL_SUBSCRIBER` | Uyumsuz abone |\n| `SYSTEM_ERROR` | Sistemsel hata |\n| `UNKNOWN` | Tanımlı olmayan bir neden |\n"
          },
          "referenceId": {
            "type": "string",
            "nullable": true,
            "description": "İletim raporunun referansı. Yoksa `null`."
          }
        }
      },
      "SendersResponse": {
        "type": "object",
        "required": [
          "count",
          "senders"
        ],
        "properties": {
          "count": {
            "type": "integer"
          },
          "senders": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SenderEntry"
            }
          }
        }
      },
      "SenderEntry": {
        "type": "object",
        "required": [
          "name",
          "type",
          "brandCode",
          "usable",
          "reason"
        ],
        "properties": {
          "name": {
            "type": "string",
            "nullable": true,
            "description": "Kayıtlı hâliyle başlık - bir gönderimde `sender` için kullanılacak değer. Abone numaraları yalın numaradır."
          },
          "type": {
            "type": "string",
            "enum": [
              "ALPHANUMERIC",
              "SUBSCRIBER_NUMBER",
              "UNKNOWN"
            ]
          },
          "brandCode": {
            "type": "integer",
            "format": "int64",
            "description": "Kayıtlı İYS marka kodu; başlığın yoksa 0. Her zaman bulunur."
          },
          "usable": {
            "type": "boolean",
            "description": "Bu başlıktan yapılacak bir gönderimin bu hesap için kabul edilip edilmeyeceği."
          },
          "reason": {
            "type": "string",
            "enum": [
              "ROUTING_CODE_MISSING",
              "SUBSCRIBER_NUMBER_RESTRICTED"
            ],
            "nullable": true,
            "description": "Yalnızca usable false olduğunda dolu, aksi halde `null`. Gönderimin reddederken kullandığı adın aynısı. ROUTING_CODE_MISSING, hesapta yönlendirme kodu tanımlı olmadığı için bu başlıktan gönderim yapılamayacağı anlamına gelir; alfanümerik başlıklar yönlendirme kodu gerektirir. SUBSCRIBER_NUMBER_RESTRICTED, hesapta abone numaralarından SMS gönderiminin kısıtlı olduğu anlamına gelir; abone numarası başlıkları için onaylı olmayan hesaplar bunları hiç görmez."
          }
        }
      },
      "DefaultSenderResponse": {
        "type": "object",
        "required": [
          "sender"
        ],
        "properties": {
          "sender": {
            "allOf": [
              {
                "$ref": "#/components/schemas/SenderEntry"
              }
            ],
            "nullable": true,
            "description": "Varsayılan ayarlanmamışsa null."
          }
        }
      },
      "DefaultSenderChangeRequest": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "description": "Varsayılan yapılacak başlık, birebir kayıtlı hâliyle - büyük/küçük harf dahil, kırpma yapılmaz, 0 ya da 90 öneki olmaz."
          }
        }
      },
      "CancelRequest": {
        "type": "object",
        "required": [
          "jobId"
        ],
        "properties": {
          "jobId": {
            "type": "string",
            "minLength": 1,
            "maxLength": 64,
            "description": "`POST /send` yanıtındaki `jobId`, yazıldığı gibi; kırpma yapılmaz."
          }
        }
      },
      "CancelResponse": {
        "type": "object",
        "required": [
          "jobId",
          "cancelledAt"
        ],
        "properties": {
          "jobId": {
            "type": "string",
            "description": "İptal edilen görev; istekteki `jobId`, aynen."
          },
          "cancelledAt": {
            "type": "string",
            "format": "date-time",
            "description": "İptalin onaylandığı zaman, saat dilimi farkıyla."
          }
        }
      },
      "StatsResponse": {
        "type": "object",
        "required": [
          "jobId",
          "month",
          "count",
          "stats"
        ],
        "properties": {
          "jobId": {
            "type": "string"
          },
          "month": {
            "type": "string",
            "description": "Aranan ay, yyyy-MM."
          },
          "count": {
            "type": "integer"
          },
          "stats": {
            "type": "array",
            "minItems": 1,
            "items": {
              "$ref": "#/components/schemas/StatEntry"
            }
          }
        }
      },
      "StatEntry": {
        "type": "object",
        "required": [
          "status",
          "failReason",
          "messageCount",
          "totalParts",
          "domestic",
          "charging",
          "chargeDescription"
        ],
        "description": "Her satırda tüm alanlar bulunur; değeri olmayan bir alan `null` olarak gönderilir.",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "PENDING",
              "DELIVERED",
              "NOT_DELIVERED"
            ],
            "nullable": true,
            "description": "Sonuç; `GET /report` yanıtındaki `status` ile aynı değerler."
          },
          "failReason": {
            "type": "string",
            "enum": [
              "INVALID_NUMBER",
              "NOT_SENT_TO_OPERATOR",
              "OPERATOR_REJECTED",
              "OPERATOR_ERROR",
              "SEND_ERROR",
              "DUPLICATE",
              "INSUFFICIENT_CREDIT",
              "BLACKLISTED",
              "IYS_REJECTED",
              "MESSAGE_NOT_CREATED",
              "TIMEOUT",
              "UNKNOWN"
            ],
            "nullable": true,
            "description": "İletilmeme nedeni. Yalnızca `status` `NOT_DELIVERED` olduğunda dolu, aksi halde `null`. Değerler\n`GET /report` yanıtındaki `failReason` ile aynı adlardır, ancak istatistiklerde yalnızca bu listedekiler\ngörülür. Tanınmayan bir neden `UNKNOWN` olarak döner.\n\nAynı neden birden fazla satırda yer alabilir: satırlar, ücretlendirmenin yanı sıra iç sonuç koduna göre\nde ayrılır ve birden fazla iç kod aynı nedene karşılık gelebilir (örneğin iki ayrı `INVALID_NUMBER`\nsatırı, ikisi de `charged`). Neden başına toplam için aynı `failReason` değerini taşıyan\nsatırların `messageCount` değerlerini toplamalısınız.\n"
          },
          "messageCount": {
            "type": "integer",
            "nullable": true,
            "description": "Bu şekilde sonuçlanan alıcı sayısı."
          },
          "totalParts": {
            "type": "integer",
            "format": "int64",
            "nullable": true,
            "description": "Bu alıcıların kapladığı SMS parçalarının toplamı."
          },
          "domestic": {
            "type": "boolean"
          },
          "charging": {
            "type": "string",
            "nullable": true,
            "description": "Ücretlendirme durumu - `charged`, `refunded` ya da `uncharged`.",
            "example": "charged"
          },
          "chargeDescription": {
            "type": "string",
            "nullable": true,
            "description": "Ücretlendirme hakkında bir cümle. Hiçbir ücret alınmadıysa `null`."
          }
        }
      },
      "WebhookRequest": {
        "type": "object",
        "required": [
          "url"
        ],
        "properties": {
          "url": {
            "type": "string",
            "maxLength": 1024,
            "description": "Host'u yalnızca genel (public) adreslere çözümlenen mutlak bir http ya da https URL - loopback, özel, link-local ya da başka bir şekilde iç adres olamaz. Port verilirse 1 ile 65535 arasındadır."
          },
          "headers": {
            "type": "string",
            "maxLength": 500,
            "description": "Webhook adresinizin Netgsm'den beklediği başlık; örneğin adresiniz bir kimlik doğrulama bilgisi istiyorsa \"Authorization: Bearer <token>\". Netgsm bu başlığı adresinize yaptığı her istekte aynen gönderir; böylece isteğin Netgsm'den geldiğini doğrulayabilirsiniz. Tek bir satır, `Name: value` biçiminde; yalnızca yazdırılabilir ASCII, satır sonu olmadan. Değer virgül (,) ya da iki nokta üst üste (:) içeremez. İsteğe bağlı; boş bırakılırsa ek başlık gönderilmez."
          }
        }
      },
      "WebhookResponse": {
        "type": "object",
        "required": [
          "url",
          "headers",
          "registeredAt"
        ],
        "properties": {
          "url": {
            "type": "string"
          },
          "headers": {
            "type": "string",
            "nullable": true,
            "description": "Kayıtta verilen başlık satırı; verilmediyse `null`."
          },
          "registeredAt": {
            "type": "string",
            "format": "date-time",
            "description": "Webhook'un kaydedildiği zaman."
          }
        }
      },
      "ReportWebhookPayload": {
        "type": "object",
        "required": [
          "numbers"
        ],
        "description": "İletim raporu webhook'unun gövdesi. Alan adları `GET /report` yanıtındakilerden farklıdır.",
        "properties": {
          "numbers": {
            "type": "array",
            "description": "Bu istekle gönderilen raporlar; her alıcı için bir satır.",
            "items": {
              "$ref": "#/components/schemas/ReportWebhookEntry"
            }
          }
        }
      },
      "ReportWebhookEntry": {
        "type": "object",
        "properties": {
          "jobid": {
            "type": "string",
            "description": "Send uç noktasının döndürdüğü görev numarası (`jobId`)."
          },
          "number": {
            "type": "string",
            "description": "Alıcı numarası."
          },
          "status": {
            "type": "integer",
            "description": "İletim sonucu, sayısal kod. Bekleyen (henüz sonuçlanmamış) gönderimler webhook ile\nbildirilmez; yalnızca sonuçlananlar gelir.\n\n| Kod | Anlamı | `GET /report` karşılığı |\n|---|---|---|\n| `1` | İletildi | `DELIVERED` |\n| `2` | Ulaştırılamadı; nedeni `errorCode` alanındadır | `NOT_DELIVERED` |\n| `3` | Hatalı numara | `NOT_DELIVERED`, `INVALID_NUMBER` |\n| `4` | Operatöre gönderilemedi | `NOT_DELIVERED`, `NOT_SENT_TO_OPERATOR` |\n| `8` | Operatör kabul etmedi | `NOT_DELIVERED`, `OPERATOR_REJECTED` |\n| `11` | Operatör hatası | `NOT_DELIVERED`, `OPERATOR_ERROR` |\n| `12` | Gönderim hatası | `NOT_DELIVERED`, `SEND_ERROR` |\n| `13` | Mükerrer | `NOT_DELIVERED`, `DUPLICATE` |\n| `14` | Kredisi yetmedi | `NOT_DELIVERED`, `INSUFFICIENT_CREDIT` |\n| `15` | Kara liste | `NOT_DELIVERED`, `BLACKLISTED` |\n| `16` | İYS ret | `NOT_DELIVERED`, `IYS_REJECTED` |\n| `17` | İYS hata | `NOT_DELIVERED`, `IYS_ERROR` |\n| `18` | Mesaj oluşturulamadı | `NOT_DELIVERED`, `MESSAGE_NOT_CREATED` |\n| `19` | Hatalı numara formatı | `NOT_DELIVERED`, `INVALID_NUMBER_FORMAT` |\n| `20` | NTS'den onay alınamadı | `NOT_DELIVERED`, `NTS_NOT_APPROVED` |\n| `22` | Yurt dışı gönderim izni yok | `NOT_DELIVERED`, `NO_INTERNATIONAL_PERMISSION` |\n"
          },
          "operator": {
            "type": "integer",
            "description": "Alıcının operatörü, sayısal kod.\n\n| Kod | Operatör | `GET /report` karşılığı |\n|---|---|---|\n| `10` | Vodafone | `VODAFONE` |\n| `20` | Türk Telekom | `TURK_TELEKOM` |\n| `30` | Turkcell | `TURKCELL` |\n| `40`, `41`, `43` | Netgsm | `NETGSM` |\n| `45` | Akontel | `AKONTEL` |\n| `210`–`218` | Yurt dışı | `INTERNATIONAL` |\n\nOperatörü belirlenemeyen kayıtlarda (örneğin numara hatalıysa) `0` gelir.\n"
          },
          "msglen": {
            "type": "integer",
            "description": "Mesajın kapladığı SMS parça sayısı."
          },
          "deliveredDate": {
            "type": "string",
            "description": 'İletildiği zaman, `yyyy-MM-dd HH:mm:ss` biçiminde, Türkiye saatiyle. Tarih bilgisi yoksa boş string (`""`).'
          },
          "errorCode": {
            "type": "integer",
            "nullable": true,
            "description": "İletilmeme nedeni. **Yalnızca `status` `2` olduğunda anlamlıdır**; diğer durumlarda\nnedeni `status` belirtir ve bu alanın değeri dikkate alınmamalıdır.\n\n| Kod | Anlamı | `GET /report` `failReason` |\n|---|---|---|\n| `111` | Zaman aşımı | `TIMEOUT` |\n| `112` | Mobil cihaz SMS gönderimine kapalı | `SMS_DISABLED_ON_DEVICE` |\n| `113` | Mobil cihaz desteklemiyor | `DEVICE_NOT_SUPPORTED` |\n| `114` | Yönlendirme başarısız | `ROUTING_FAILED` |\n| `115` | Hedef operatörden zaman aşımı | `OPERATOR_TIMEOUT` |\n| `116` | Tanımlanamayan abone | `UNKNOWN_SUBSCRIBER` |\n| `117` | Yasadışı abone | `ILLEGAL_SUBSCRIBER` |\n| `119` | Sistemsel hata | `SYSTEM_ERROR` |\n\n`status` `2` iken `0` ya da `null` gelirse neden bilinmiyordur (`GET /report`'ta `UNKNOWN`).\n"
          },
          "referansID": {
            "type": "string",
            "nullable": true,
            "description": "Gönderimde verilen referans (`GET /report` yanıtındaki `referenceId`). Verilmediyse `null`."
          }
        }
      },
      "InboxWebhookPayload": {
        "type": "object",
        "required": [
          "messageId",
          "messageDateTime",
          "sourceNumber",
          "content",
          "subscriberNumber"
        ],
        "description": "Gelen SMS webhook'unun gövdesi. Değeri olmayan alanlar boş string olarak gönderilir.",
        "properties": {
          "messageId": {
            "type": "string",
            "description": "Gelen mesajın kimliği."
          },
          "messageDateTime": {
            "type": "string",
            "description": "Mesajın alındığı zaman, `yyyy-MM-dd HH:mm:ss` biçiminde, Türkiye saatiyle."
          },
          "sourceNumber": {
            "type": "string",
            "description": "Mesajı gönderen numaranın son 10 hanesi (90 öneki olmadan)."
          },
          "content": {
            "type": "string",
            "description": "Mesaj metni."
          },
          "subscriberNumber": {
            "type": "string",
            "description": "Mesajın geldiği, hesaba ait numara."
          }
        }
      },
      "BlacklistResponse": {
        "type": "object",
        "required": [
          "count",
          "page",
          "number",
          "numbers"
        ],
        "properties": {
          "count": {
            "type": "integer",
            "description": "`numbers` içindeki numara sayısı. Tek numara sorgusunda 0, numaranın kara listede olmadığını gösterir."
          },
          "page": {
            "type": "integer",
            "nullable": true,
            "description": "Döndürülen, sıfırdan başlayan sayfa. Tek numara sorgusunda `null`."
          },
          "number": {
            "type": "string",
            "nullable": true,
            "description": "Sorgulanan numara, aynen geri döndürülür. Sayfa isteğinde `null`."
          },
          "numbers": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Engellenen numaralar saklandığı biçimde, en yenisi önce."
          }
        }
      },
      "LengthRequest": {
        "type": "object",
        "required": [
          "text"
        ],
        "properties": {
          "text": {
            "type": "string",
            "maxLength": 1e4,
            "description": "Mesaj metni. Boş olabilir."
          },
          "encoding": {
            "type": "string",
            "enum": [
              "DEFAULT",
              "TURKISH",
              "UNICODE"
            ],
            "default": "DEFAULT"
          },
          "alphanumericSender": {
            "type": "boolean",
            "default": false,
            "description": "NETGSM gibi bir metin başlığından gönderilip gönderilmeyeceği; bu beş karakter tutar. Gönderici bir metin başlığı olduğunda her zaman true olmalıdır; false bırakılırsa yanıt, send'in böyle bir başlıktan kabul ettiğinden beş karakter fazlasına izin verir."
          }
        }
      },
      "LengthResponse": {
        "type": "object",
        "required": [
          "encoding",
          "length",
          "parts",
          "limit",
          "fits",
          "remaining",
          "remainingUntilNextPart"
        ],
        "properties": {
          "encoding": {
            "type": "string",
            "enum": [
              "DEFAULT",
              "TURKISH",
              "UNICODE"
            ]
          },
          "length": {
            "type": "integer",
            "description": "Send uç noktasının saydığı şekilde - TURKISH altında kaçışlı her Türkçe harf için iki, alfanümerik gönderici için artı beş."
          },
          "parts": {
            "type": "integer",
            "description": "Metnin kapladığı SMS sayısı. Boş metin için sıfır."
          },
          "limit": {
            "type": "integer",
            "description": "Gönderici maliyeti dahil `length` değerinin alabileceği en büyük değer. En uzun metin değildir - metin başlığı için beş eksiğidir. Ne kadar daha metin sığacağını `remaining` gösterir."
          },
          "fits": {
            "type": "boolean",
            "description": "Send'in bu uzunlukta bir metni kabul edip etmeyeceği."
          },
          "remaining": {
            "type": "integer",
            "description": "Sınıra kadar kalan karakter. Metin sınırı aşıyorsa aştığı kadar negatif."
          },
          "remainingUntilNextPart": {
            "type": "integer",
            "description": "Bir SMS daha gerekmeden önce kalan karakter. Metin sığmıyorsa sıfır."
          }
        }
      },
      "DirectorySendRequest": {
        "type": "object",
        "required": [
          "sender",
          "text"
        ],
        "properties": {
          "sender": {
            "type": "string",
            "minLength": 1,
            "maxLength": 35,
            "description": "Gönderici başlığı, `POST /send`'deki gibi: hesaba kayıtlı bir başlıkla yazıldığı gibi birebir eşleşmelidir, büyük/küçük harf dahil. Eşleşmezse istek 422 `REJECTED_HEADER` ile reddedilir.",
            "example": "NETGSM"
          },
          "text": {
            "type": "string",
            "minLength": 1,
            "maxLength": 917,
            "description": "Mesaj metni; tüm alıcılara aynı metin gider, `addressType` ile kişiselleştirilebilir. En fazla uzunluk `DEFAULT` için 917, `TURKISH` için 888 karakterdir (`çğışĞİŞ` iki karakter sayılır); alfanümerik bir gönderici başlığında her sınır 5 karakter azdır. Sınırı aşan metin 400 ile reddedilir."
          },
          "encoding": {
            "type": "string",
            "enum": [
              "DEFAULT",
              "TURKISH"
            ],
            "default": "DEFAULT",
            "description": "Metnin karakter kodlaması, `POST /send`'deki gibi. Büyük/küçük harfe duyarlıdır. `UNICODE` bu uç noktada 400 ile reddedilir."
          },
          "iysFilter": {
            "description": "İYS filtresi; değerler `POST /send`'deki gibidir ve büyük/küçük harf fark etmez. Listede olmayan bir değer `NONE` sayılır. Filtreyi platform uygular; bu başlık ya da hesap için uygulanamıyorsa istek 422 `REJECTED_IYS` ile reddedilir.",
            "default": "NONE",
            "type": "string",
            "enum": [
              "NONE",
              "BRAND",
              "RETAILER",
              "BRAND_AND_RETAILER"
            ]
          },
          "groupIds": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int64"
            },
            "description": "Hesabın rehberindeki kişi grupları."
          },
          "contacts": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/DirectoryContact"
            }
          },
          "recipients": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Kişiselleştirme uygulanmayan düz numaralar. Yalnızca `groupIds` ya da `contacts` ile birlikte kullanılabilir. Numaranın biçimini platform denetler."
          },
          "address1": {
            "type": "string",
            "maxLength": 500,
            "description": 'Tüm alıcılar için aynı olan ön hitap, örneğin "Sayın". Kullanılıp kullanılmayacağını `addressType` belirler.'
          },
          "address2": {
            "type": "string",
            "maxLength": 500,
            "description": 'Tüm alıcılar için aynı olan son hitap, örneğin "Bey/Hanım,". Kullanılıp kullanılmayacağını `addressType` belirler.'
          },
          "addressType": {
            "type": "integer",
            "minimum": 0,
            "maximum": 17,
            "default": 0,
            "description": 'Mesaj metninin başına hangi kişisel bilgilerin ekleneceğini belirler. Seçilen parçalar aşağıdaki sırayla ve\naralarında birer boşlukla metnin başına eklenir; alıcıda boş olan parça atlanır. 0 ile 17 dışındaki bir değer\n`INVALID_REQUEST` ile reddedilir.\n\n- **Ad** ve **soyad**, rehberdeki kişi kaydından ya da `contacts` içindeki `name` ve `surname` alanlarından gelir.\n- **Kişi hitabı**, rehberdeki kişinin hitap bilgisi ya da `contacts` içindeki `address` alanıdır; her alıcı için ayrıdır.\n- `recipients` içinde düz numara olarak verilen alıcılara kişiselleştirme uygulanmaz.\n\n| Değer | Metnin başına eklenen |\n|---|---|\n| `0` | Hiçbir şey; metin olduğu gibi gönderilir (varsayılan) |\n| `1` | address1 + ad |\n| `2` | address1 + ad + soyad |\n| `3` | address1 + soyad |\n| `4` | address1 + ad + address2 |\n| `5` | address1 + ad + soyad + address2 |\n| `6` | address1 + soyad + address2 |\n| `7` | ad |\n| `8` | soyad |\n| `9` | ad + soyad |\n| `10` | kişi hitabı |\n| `11` | kişi hitabı + ad |\n| `12` | kişi hitabı + ad + soyad |\n| `13` | kişi hitabı + soyad |\n| `14` | kişi hitabı + address2 |\n| `15` | kişi hitabı + ad + address2 |\n| `16` | kişi hitabı + ad + soyad + address2 |\n| `17` | kişi hitabı + soyad + address2 |\n\nÖrnek: `addressType` 5, `address1` "Sayın", `address2` "Bey," ve metin "siparişiniz kargoya verildi." ise\nAhmet Yılmaz\'a giden mesaj "Sayın Ahmet Yılmaz Bey, siparişiniz kargoya verildi." olur.\n'
          },
          "startAt": {
            "type": "string",
            "format": "date-time",
            "description": "En erken gönderim zamanı, saat dilimi farkıyla. Europe/Istanbul saatine çevrilir ve dakikaya yuvarlanır; saniyeler dikkate alınmaz."
          },
          "stopAt": {
            "type": "string",
            "format": "date-time",
            "description": "En geç gönderim zamanı, saat dilimi farkıyla; `startAt` gibi dakikaya yuvarlanır. `startAt`'tan 1 ile 21 saat sonra olmalıdır. Aralığı platform denetler; kabul etmezse istek 400 `INVALID_SEND_WINDOW` ile reddedilir."
          }
        }
      },
      "DirectoryContact": {
        "type": "object",
        "required": [
          "number"
        ],
        "description": "Bilgileriyle birlikte doğrudan verilen bir alıcı.",
        "properties": {
          "number": {
            "type": "string",
            "minLength": 1,
            "maxLength": 20,
            "description": "Alıcının numarası. Biçimini platform denetler."
          },
          "name": {
            "type": "string",
            "maxLength": 100,
            "description": "Alıcının adı. İsteğe bağlı."
          },
          "surname": {
            "type": "string",
            "maxLength": 100,
            "description": "Alıcının soyadı. İsteğe bağlı."
          },
          "address": {
            "type": "string",
            "maxLength": 500,
            "description": 'Kişiye özel hitap, örneğin "Sayın". Kullanılıp kullanılmayacağını `addressType` belirler. İsteğe bağlı.'
          }
        }
      },
      "DirectorySendResponse": {
        "type": "object",
        "required": [
          "jobId",
          "status",
          "review"
        ],
        "properties": {
          "jobId": {
            "type": "string",
            "description": "Oluşturulan görevin numarası. Rapor ve istatistik için kullanılır; destek taleplerinde belirtmelisiniz."
          },
          "status": {
            "type": "string",
            "enum": [
              "QUEUED"
            ],
            "description": "Her zaman `QUEUED`; `startAt` ileride olsa da."
          },
          "review": {
            "type": "string",
            "enum": [
              "NONE",
              "ADMIN_APPROVAL",
              "FORBIDDEN_WORD",
              "UNKNOWN"
            ],
            "description": "Görevin gönderilmeden önce bekletilip bekletilmediği:\n\n| Değer | Anlamı |\n|---|---|\n| `NONE` | Bekletilmedi; gönderim aralığında gönderilir. |\n| `ADMIN_APPROVAL` | Yönetici onayı bekliyor: hesap onay kontrolünde ya da gönderim hesabın sınırından büyük. |\n| `FORBIDDEN_WORD` | Metin yasaklı bir kelime içerdiği için bekletiliyor. |\n| `UNKNOWN` | Görev kuyruğa alındı ama bekletme nedeni bilinmiyor. |\n"
          }
        }
      },
      "ApiError": {
        "type": "object",
        "required": [
          "code",
          "message",
          "requestId",
          "timestamp",
          "violations"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "UNAUTHENTICATED",
              "SERVICE_UNAVAILABLE",
              "FORBIDDEN",
              "E_SIGNATURE_REQUIRED",
              "ALREADY_EXISTS",
              "NOT_FOUND",
              "INVALID_REQUEST",
              "INVALID_SEND_WINDOW",
              "REJECTED_HEADER",
              "REJECTED_IYS",
              "NO_DELIVERABLE_MESSAGES",
              "INSUFFICIENT_CREDIT",
              "RATE_LIMITED",
              "QUEUE_UNCONFIRMED",
              "INTERNAL_ERROR"
            ]
          },
          "message": {
            "type": "string",
            "description": "Okunabilir ayrıntı. `UNAUTHENTICATED` için `no bearer token` ya da `invalid or expired token`. `REJECTED_HEADER` için ret adıdır; yalnızca rakamlardan oluşan bir göndericide ` (subscriber number headers were not offered)` ekini taşıyabilir. `RATE_LIMITED` için sınırı belirtir; `FORBIDDEN` ve `REJECTED_IYS` için sabit bir cümledir. `SERVICE_UNAVAILABLE` ve `INTERNAL_ERROR` genel bir cümle taşır; bildirirken `requestId` değerini paylaşmanız gerekir."
          },
          "requestId": {
            "type": "string",
            "description": "İsteğe özgü kimlik, 32 onaltılık karakter. Bir sorun bildirirken bu değeri paylaşmanız, isteğin kayıtlarda bulunmasını sağlar."
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "violations": {
            "type": "array",
            "nullable": true,
            "description": "Yalnızca gövde doğrulamasından gelen INVALID_REQUEST için dolu, aksi halde `null`.",
            "items": {
              "type": "object",
              "properties": {
                "field": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                }
              }
            }
          },
          "rejectedItems": {
            "type": "array",
            "maxItems": 100,
            "description": "Yalnızca `NO_DELIVERABLE_MESSAGES` yanıtında bulunur; diğer hatalarda alan hiç yer almaz. Reddedilen kayıtlar, `index` sırasıyla ilk 100 tanesi; 202 yanıtındaki `rejectedItems` ile aynıdır.",
            "items": {
              "$ref": "#/components/schemas/RejectedMessage"
            }
          },
          "rejectedItemsTruncated": {
            "type": "boolean",
            "description": "Yalnızca `rejectedItems` ile birlikte bulunur. 100'den fazla kayıt reddedildiğinde true."
          }
        }
      }
    }
  }
};

// packages/sms-mock/src/sms/bind.mjs
var DATE_TIME_MESSAGE = "must be an ISO-8601 date-time with an offset, e.g. 2026-09-10T09:00:00+03:00";
var enumMessage = (values2) => `must be one of ${values2.join(", ")} (case sensitive)`;
var MESSAGES = {
  array: "must be an array",
  number: "must be a number",
  boolean: "must be true or false",
  string: "must be a string",
  other: "has an invalid value"
};
var OFFSET_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/i;
var isOffsetDateTime = (v) => typeof v === "string" && OFFSET_DATE_TIME.test(v) && !Number.isNaN(Date.parse(v));
var NUMERIC = /^\s*[+-]?\d+(\.\d+)?\s*$/;
function resolve(node) {
  while (node && node.$ref) node = node.$ref.replace(/^#\//, "").split("/").reduce((n, p) => n?.[p], smsSpec);
  return node ?? {};
}
var isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
var bound;
function bindValue(schemaRef, value, path, opts) {
  bound = value;
  if (value === null) return null;
  const schema = resolve(schemaRef);
  const fail2 = (message) => ({ field: path, message });
  const values2 = opts.enums?.[path] ?? (opts.loose?.includes(path) ? void 0 : schema.enum);
  if (Array.isArray(values2)) {
    if (typeof value === "string" && values2.includes(value)) return null;
    if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value < values2.length) {
      bound = values2[value];
      return null;
    }
    return fail2(enumMessage(values2));
  }
  if (schema.format === "date-time") {
    if (isOffsetDateTime(value)) return null;
    if (typeof value === "number" && Number.isFinite(value)) {
      const d = new Date(value * 1e3);
      if (!Number.isNaN(d.getTime())) {
        bound = d.toISOString();
        return null;
      }
    }
    return fail2(DATE_TIME_MESSAGE);
  }
  switch (schema.type) {
    case "string":
      if (typeof value === "string") return null;
      if (typeof value === "number" || typeof value === "boolean") {
        bound = String(value);
        return null;
      }
      return fail2(MESSAGES.string);
    case "boolean":
      if (typeof value === "boolean") return null;
      if (typeof value === "string" && /^(true|false)$/i.test(value.trim())) {
        bound = value.trim().toLowerCase() === "true";
        return null;
      }
      return fail2(MESSAGES.boolean);
    case "integer":
    case "number": {
      let n;
      if (typeof value === "number") n = value;
      else if (typeof value === "string" && NUMERIC.test(value)) n = Number(value);
      else return fail2(MESSAGES.number);
      if (!Number.isFinite(n)) return fail2(MESSAGES.number);
      bound = schema.type === "integer" ? Math.trunc(n) : n;
      return null;
    }
    case "array": {
      if (!Array.isArray(value)) return fail2(MESSAGES.array);
      for (let i = 0; i < value.length; i++) {
        const bad = bindValue(schema.items, value[i], `${path}[${i}]`, opts);
        if (bad) return bad;
        if (bound !== value[i]) value[i] = bound;
      }
      bound = value;
      return null;
    }
    case "object": {
      if (!isPlainObject(value)) return fail2(MESSAGES.other);
      const bad = bindObject(schema, value, path, opts);
      bound = value;
      return bad;
    }
    default:
      return null;
  }
}
function bindObject(schema, value, prefix, opts) {
  const props = schema.properties ?? {};
  const extra = schema.additionalProperties && typeof schema.additionalProperties === "object" ? schema.additionalProperties : null;
  for (const key of Object.keys(value)) {
    const sub = Object.hasOwn(props, key) ? props[key] : extra;
    if (!sub) continue;
    const bad = bindValue(sub, value[key], prefix ? `${prefix}.${key}` : key, opts);
    if (bad) return bad;
    if (bound !== value[key]) value[key] = bound;
  }
  return null;
}
function bindBody(schemaName, body, opts = {}) {
  const schema = smsSpec.components.schemas[schemaName];
  if (!schema) throw new Error(`unknown schema: ${schemaName}`);
  const bad = bindObject(schema, body ?? {}, "", opts);
  bound = void 0;
  return bad ? fieldsRejected([bad]) : null;
}

// packages/sms-mock/src/sms/auth.mjs
var MSG = {
  activation: "account is not activated for this operation",
  subUser: "sub user may not use the sms api",
  operator: "account operator is not served for this operation"
};
function authenticate(req, ctx) {
  const raw = req.headers?.authorization;
  const m = typeof raw === "string" ? /^bearer[ \t]+(\S+)[ \t]*$/i.exec(raw.trim()) : null;
  if (!m) {
    req.tokenState = "none";
    return smsError(401, "UNAUTHENTICATED", "no bearer token");
  }
  const r = ctx.sessions.resolve(m[1]);
  if (r.error) {
    req.tokenState = r.error;
    return smsError(401, "UNAUTHENTICATED", "invalid or expired token");
  }
  const account = ctx.accounts.get(r.login.accountId);
  if (!account) {
    req.tokenState = "invalid";
    return smsError(401, "UNAUTHENTICATED", "invalid or expired token");
  }
  req.tokenState = "ok";
  req.accountId = account.id;
  return { login: r.login, account };
}
function authorize(account, login, operation) {
  if (operation === "SEND" && !account.activations.send || operation === "RECEIVE" && !account.activations.receive) {
    return smsError(403, "FORBIDDEN", MSG.activation);
  }
  if (!login.smsPermission) return smsError(403, "FORBIDDEN", MSG.subUser);
  if (operation === "SEND" && !account.operatorOk) return smsError(403, "FORBIDDEN", MSG.operator);
  return null;
}

// packages/sms-mock/src/sms/schema.mjs
var import_ajv = __toESM(require_ajv(), 1);
var import_ajv_formats = __toESM(require_dist(), 1);
function stripNulls(value) {
  if (Array.isArray(value)) return value.map(stripNulls);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) if (v !== null) out[k] = stripNulls(v);
    return out;
  }
  return value;
}
function blank(schema, path) {
  const parts = path.split(".");
  let node = schema;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const last = i === parts.length - 1;
    let holder, key;
    if (p === "items") {
      holder = node;
      key = "items";
    } else {
      holder = node?.properties;
      key = p;
    }
    if (!holder || typeof holder !== "object" || !(key in holder)) return;
    if (last) {
      holder[key] = {};
      return;
    }
    node = holder[key];
  }
}
var toField = (err) => {
  let path = err.instancePath.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~")).join(".");
  if (err.keyword === "required") path = path ? `${path}.${err.params.missingProperty}` : err.params.missingProperty;
  return path;
};
function allowNullEnums(node) {
  if (Array.isArray(node)) {
    node.forEach(allowNullEnums);
    return;
  }
  if (node && typeof node === "object") {
    if (node.nullable === true && Array.isArray(node.enum) && !node.enum.includes(null)) node.enum.push(null);
    if (node.nullable === true && node.type === void 0 && Array.isArray(node.allOf)) {
      node.anyOf = [{ allOf: node.allOf }, { type: "null" }];
      delete node.allOf;
      delete node.nullable;
    }
    Object.values(node).forEach(allowNullEnums);
  }
}
function createSchemaValidator(inputSpec) {
  const spec = { ...inputSpec, components: structuredClone(inputSpec.components) };
  allowNullEnums(spec.components);
  const ajv = new import_ajv.default({ strict: false, allErrors: true });
  (0, import_ajv_formats.default)(ajv);
  ajv.addSchema({ $id: "sms", components: spec.components });
  const cache = /* @__PURE__ */ new Map();
  function compile(name, skip) {
    const key = `${name}|${[...skip].sort().join(",")}`;
    let fn = cache.get(key);
    if (!fn) {
      if (skip.length === 0) {
        fn = ajv.compile({ $ref: `sms#/components/schemas/${name}` });
      } else {
        const base2 = spec.components?.schemas?.[name];
        if (!base2) throw new Error(`unknown schema: ${name}`);
        const clone = structuredClone(base2);
        for (const p of skip) blank(clone, p);
        fn = ajv.compile({ components: spec.components, ...clone });
      }
      cache.set(key, fn);
    }
    return fn;
  }
  return {
    /** `opts.keywords` true ise her ihlal Ajv anahtar sözcüğünü de (`keyword`) taşır; yanıta konmadan önce atılmalıdır. */
    validate(name, value, opts = {}) {
      const fn = compile(name, opts.skipProperties ?? []);
      if (fn(value)) return [];
      return (fn.errors ?? []).map((e) => opts.keywords ? { field: toField(e), message: e.message ?? "invalid", keyword: e.keyword } : { field: toField(e), message: e.message ?? "invalid" });
    }
  };
}

// packages/sms-mock/src/sms/length.mjs
var PROFILES = {
  DEFAULT: { single: 160, perPart: 153, limit: 917 },
  TURKISH: { single: 155, perPart: 148, limit: 888 },
  UNICODE: { single: 70, perPart: 66, limit: 396 }
};
var MAX_PARTS = 6;
var ALPHANUMERIC_SENDER_COST = 5;
var TURKISH_ESCAPED = /* @__PURE__ */ new Set([..."çğışĞİŞ"]);
function weightedLength(text, encoding) {
  if (encoding !== "TURKISH") return text.length;
  let escaped = 0;
  for (let i = 0; i < text.length; i++) if (TURKISH_ESCAPED.has(text[i])) escaped++;
  return text.length + escaped;
}
function measure(text, encoding = "DEFAULT", alphanumericSender = false) {
  const { single, perPart, limit } = PROFILES[encoding];
  const length = weightedLength(text, encoding) + (alphanumericSender ? ALPHANUMERIC_SENDER_COST : 0);
  const parts = length === 0 ? 0 : length <= single ? 1 : Math.ceil(length / perPart);
  const fits = length <= limit && parts <= MAX_PARTS;
  const remaining = limit - length;
  const remainingUntilNextPart = !fits ? 0 : (parts <= 1 ? single : parts * perPart) - length;
  return { encoding, length, parts, limit, fits, remaining, remainingUntilNextPart };
}
function fitsSend(text, encoding = "DEFAULT", alphanumericSender = false) {
  return measure(text, encoding, alphanumericSender).fits;
}
var validator = createSchemaValidator(smsSpec);
function registerLengthRoutes(ctx) {
  ctx.routes.add("POST", "/sms/v3/length", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const unbound = bindBody("LengthRequest", req.json ?? {});
    if (unbound) return unbound;
    const body = stripNulls(req.json ?? {});
    const violations = validator.validate("LengthRequest", body);
    if (violations.length > 0) {
      return fieldsRejected(violations);
    }
    return { status: 200, body: measure(body.text, body.encoding ?? "DEFAULT", body.alphanumericSender ?? false) };
  });
}

// packages/sms-mock/src/scenarios.mjs
var SMS_PREFIX = "/sms/v3";
var AUTH_PREFIX = "/auth/v3";
var DEFAULT_RETRY_AFTER = 30;
var SEND3 = "/sms/v3/send";
var SEND_TEMPLATE = "/sms/v3/send/template";
var SEND_OTP = "/sms/v3/send/otp";
var DIRECTORY_SEND = "/sms/v3/directory/send";
var BALANCE3 = "/sms/v3/balance";
var JOB_CREATING_PATHS = /* @__PURE__ */ new Set([SEND3, SEND_TEMPLATE, DIRECTORY_SEND]);
var SMS_CODES = {
  SERVICE_UNAVAILABLE: () => smsError(503, "SERVICE_UNAVAILABLE", "service is temporarily unavailable"),
  QUEUE_UNCONFIRMED: () => smsError(504, "QUEUE_UNCONFIRMED", "the request could not be confirmed and may have been queued"),
  E_SIGNATURE_REQUIRED: () => smsError(403, "E_SIGNATURE_REQUIRED", "the requested menu requires an e-signature login on the account"),
  INTERNAL_ERROR: () => smsError(500, "INTERNAL_ERROR", "internal error"),
  RATE_LIMITED: (s) => smsError(429, "RATE_LIMITED", "send rate limit exceeded", {}, { "Retry-After": String(s.retryAfter ?? DEFAULT_RETRY_AFTER) }),
  SENDING_SUSPENDED: () => smsError(429, "RATE_LIMITED", "sending is suspended for this account"),
  INSUFFICIENT_CREDIT: () => smsError(422, "INSUFFICIENT_CREDIT", "no credit, package or campaign to pay for the otp"),
  REJECTED_HEADER: () => smsError(422, "REJECTED_HEADER", "NOT_REGISTERED"),
  REJECTED_IYS: () => smsError(422, "REJECTED_IYS", "account is not in iys mode, filtering cannot be applied"),
  FORBIDDEN: () => smsError(403, "FORBIDDEN", "account is not activated for this operation")
};
var retryProblem = (code) => (s) => {
  const retry = s.retryAfter ?? DEFAULT_RETRY_AFTER;
  return problem(code, { retryAfterSec: retry, extras: { retry_after: retry } });
};
var IDENTITY_CODES = {
  service_unavailable: () => problem("service_unavailable"),
  service_misconfigured: () => problem("service_misconfigured"),
  internal_error: () => problem("internal_error"),
  login_not_permitted: () => problem("login_not_permitted"),
  rate_limited: retryProblem("rate_limited"),
  too_many_failed_attempts: retryProblem("too_many_failed_attempts")
};
var SUPPORTED_CODES = [...Object.keys(SMS_CODES), ...Object.keys(IDENTITY_CODES)];
var familyOfCode = (code) => code in SMS_CODES ? "sms" : code in IDENTITY_CODES ? "auth" : null;
var familyOfPath = (path) => {
  if (path === SMS_PREFIX || path.startsWith(`${SMS_PREFIX}/`)) return "sms";
  if (path === AUTH_PREFIX || path.startsWith(`${AUTH_PREFIX}/`)) return "auth";
  return null;
};
function validateScenario(s) {
  if (s === null || typeof s !== "object" || Array.isArray(s)) return "scenario must be a JSON object";
  const family = typeof s.code === "string" ? familyOfCode(s.code) : null;
  if (!family) return `unknown scenario code; supported codes: ${SUPPORTED_CODES.join(", ")}`;
  if (s.times !== void 0 && !(Number.isInteger(s.times) && s.times >= 1)) return "times must be a positive integer";
  if (s.retryAfter !== void 0 && !(Number.isInteger(s.retryAfter) && s.retryAfter >= 0)) return "retryAfter must be a non-negative integer";
  if (s.path !== void 0) {
    if (typeof s.path !== "string") return "path must be a string";
    const pathFamily = familyOfPath(s.path);
    if (pathFamily === null) return "path must start with /sms/v3 or /auth/v3";
    if (pathFamily !== family) {
      return family === "sms" ? `code ${s.code} is an sms code and needs a path under /sms/v3, but path is ${s.path}` : `code ${s.code} is an identity code and needs a path under /auth/v3, but path is ${s.path}`;
    }
  }
  return null;
}
function createScenarioQueue() {
  let items = [];
  return {
    push(s) {
      const invalid5 = validateScenario(s);
      if (invalid5) throw new Error(invalid5);
      const item = { code: s.code, times: s.times ?? 1 };
      if (s.path !== void 0) item.path = s.path;
      if (s.retryAfter !== void 0) item.retryAfter = s.retryAfter;
      items.push(item);
    },
    take(path) {
      const family = familyOfPath(path);
      const i = items.findIndex((s) => s.path !== void 0 ? s.path === path : familyOfCode(s.code) === family);
      if (i < 0) return null;
      const hit = { ...items[i] };
      if (--items[i].times <= 0) items.splice(i, 1);
      return hit;
    },
    /** Tüketmeden bakar. */
    peek(path) {
      const family = familyOfPath(path);
      const s = items.find((x) => x.path !== void 0 ? x.path === path : familyOfCode(x.code) === family);
      return s ? { ...s } : null;
    },
    list() {
      return items.map((s) => ({ ...s }));
    },
    clear() {
      items = [];
    }
  };
}
function scenarioResponse(scenario, path, ctx) {
  if (scenario.code === "QUEUE_UNCONFIRMED" && path === SEND_OTP) return SMS_CODES.SERVICE_UNAVAILABLE(scenario);
  if (scenario.code === "RATE_LIMITED" && path === BALANCE3) {
    return smsError(429, "RATE_LIMITED", "balance rate limit exceeded", {}, { "Retry-After": String(scenario.retryAfter ?? DEFAULT_RETRY_AFTER) });
  }
  const make = SMS_CODES[scenario.code] ?? IDENTITY_CODES[scenario.code];
  return make(scenario);
}
function afterJobCreated(req, ctx, response) {
  if (!req.queueUnconfirmed) return response;
  ctx.scenarios.take(req.path);
  req.mayHaveBeenQueued = true;
  if (req.path === DIRECTORY_SEND) return scenarioResponse({ code: "QUEUE_UNCONFIRMED" }, req.path, ctx);
  return smsError(503, "SERVICE_UNAVAILABLE", "the send could not be confirmed; it may or may not have been queued");
}

// packages/sms-mock/src/sms/send.mjs
var validator2 = createSchemaValidator(smsSpec);
var MAX_REPORTED = 100;
var RECIPIENT = /^(90\d{10}|-\d{9,17})$/;
var MIN_SMALL_MS = 5 * 6e4;
var MIN_LARGE_MS = 10 * 6e4;
var SMALL_BATCH = 1e3;
var MAX_WINDOW_MS = 21 * 36e5;
var MINUTE_MS = 6e4;
var MAX_MESSAGES = 1e6;
var MAX_FUTURE_MONTHS = 18;
function validateRecords(records, { encoding = "DEFAULT", alphanumericSender = false, account }) {
  const n = records.length;
  const duplicate = new Uint8Array(n);
  if (!account.duplicatesAllowed) {
    const seen = /* @__PURE__ */ new Set();
    for (let i = n - 1; i >= 0; i--) {
      const r = records[i];
      const rcp = r !== null && typeof r === "object" ? r.recipient : void 0;
      if (typeof rcp !== "string") continue;
      if (seen.has(rcp)) duplicate[i] = 1;
      else seen.add(rcp);
    }
  }
  const accepted = [];
  const rejected = [];
  let rejectedTotal = 0;
  for (let i = 0; i < n; i++) {
    const r = records[i];
    const isObj = r !== null && typeof r === "object" && !Array.isArray(r);
    const recipient = isObj && typeof r.recipient === "string" ? r.recipient : null;
    const text = isObj ? r.text : void 0;
    let reason = null;
    if (duplicate[i]) reason = "DUPLICATE_RECIPIENT";
    else if (!isObj) reason = "MALFORMED_ENTRY";
    else if (typeof text === "string" && !fitsSend(text, encoding, alphanumericSender)) reason = "MESSAGE_TOO_LONG";
    else if (recipient === null || !RECIPIENT.test(recipient)) reason = "INVALID_RECIPIENT";
    else if (typeof text !== "string" || text.length === 0) reason = "INVALID_MESSAGE";
    else if (recipient.charCodeAt(0) === 45 && !account.international) reason = "NO_INTERNATIONAL_PERMISSION";
    if (reason === null) {
      accepted.push({ index: i, recipient, text });
      continue;
    }
    rejectedTotal++;
    if (rejected.length < MAX_REPORTED) rejected.push({ index: i, recipient, reason });
  }
  return { accepted, rejected, rejectedTotal };
}
function resolveSendWindow({ startAt, stopAt, count, nowMs }) {
  const reqStart = startAt == null ? NaN : Date.parse(startAt);
  const reqStop = stopAt == null ? NaN : Date.parse(stopAt);
  let startMs = nowMs;
  if (!Number.isNaN(reqStart)) {
    const limit = new Date(nowMs);
    limit.setUTCMonth(limit.getUTCMonth() + MAX_FUTURE_MONTHS);
    if (reqStart > limit.getTime()) {
      return smsError(400, "INVALID_SEND_WINDOW", `startAt is further ahead than ${MAX_FUTURE_MONTHS} months`);
    }
    if (reqStart > nowMs) startMs = reqStart;
  }
  let stopMs = Number.isNaN(reqStop) || reqStop < nowMs ? startMs + MAX_WINDOW_MS : reqStop;
  const min = count < SMALL_BATCH ? MIN_SMALL_MS : MIN_LARGE_MS;
  if (stopMs - startMs < min) stopMs = startMs + min;
  else if (stopMs - startMs > MAX_WINDOW_MS) stopMs = startMs + MAX_WINDOW_MS;
  const status = Math.floor((startMs - nowMs) / MINUTE_MS) > 1 ? "SCHEDULED" : "QUEUED";
  return { status, startMs, stopMs };
}
function checkSender(account, sender) {
  const reject = (message) => smsError(422, "REJECTED_HEADER", message);
  const list = account.senders ?? [];
  if (list.length === 0) return reject("NO_HEADERS_REGISTERED");
  const match = list.find((s) => s.name === sender);
  if (!match) {
    const lower = String(sender).toLowerCase();
    return reject(list.some((s) => s.name.toLowerCase() === lower) ? "CASE_MISMATCH" : "NOT_REGISTERED");
  }
  if (!match.usable) return reject(match.reason || "ROUTING_CODE_MISSING");
  return null;
}
function normalizeIysFilter(value) {
  const v = typeof value === "string" ? value.toUpperCase() : "NONE";
  return ["BRAND", "RETAILER", "BRAND_AND_RETAILER"].includes(v) ? v : "NONE";
}
function findOtpSender(account, sender) {
  const reject = (message) => ({ error: smsError(422, "REJECTED_HEADER", message) });
  const list = account.senders ?? [];
  if (list.length === 0) return reject("NO_HEADERS_REGISTERED");
  const lower = sender.toLowerCase();
  const national = /^\d+$/.test(sender) ? sender.replace(/^(?:90|0)(?=\d{10}$)/, "") : null;
  const match = list.find((s) => s.name.toLowerCase() === lower) ?? (national === null ? void 0 : list.find((s) => s.type === "SUBSCRIBER_NUMBER" && s.name === national));
  if (!match) return reject("NOT_REGISTERED");
  if (!match.usable) return reject(match.reason || "ROUTING_CODE_MISSING");
  return { entry: match };
}
function checkIys(account, iysFilter, sender) {
  const filter = normalizeIysFilter(iysFilter);
  if (filter !== "BRAND" && filter !== "RETAILER") return null;
  if (!account.iysMode) return smsError(422, "REJECTED_IYS", "account is not in iys mode, filtering cannot be applied");
  if (sender !== void 0) {
    const header = (account.senders ?? []).find((s) => s.name === sender);
    if (!header || !(header.brandCode > 0)) return smsError(422, "REJECTED_IYS", "sender header has no iys brand code");
  }
  return null;
}
function checkBody(validator7, schema, body, opts = {}) {
  const {
    skipProperties = [],
    dateFields = [],
    blankFields = [],
    sizeFields = {},
    notEmptyFields = [],
    extraViolations = [],
    rename = (v) => v
  } = opts;
  const probe = { ...body };
  for (const f of dateFields) delete probe[f];
  const raw = validator7.validate(schema, probe, { skipProperties, keywords: true });
  const sizeMessage = (f) => `size must be between ${sizeFields[f][0]} and ${sizeFields[f][1]}`;
  let violations = raw.map(({ field, message, keyword }) => {
    if (notEmptyFields.includes(field) && (keyword === "required" || keyword === "minItems")) return { field, message: "must not be empty" };
    if (blankFields.includes(field) && keyword === "required") return { field, message: "must not be blank" };
    if (sizeFields[field] && (keyword === "minLength" || keyword === "maxLength")) return { field, message: sizeMessage(field) };
    return { field, message };
  });
  const blank2 = [];
  for (const f of blankFields) {
    const v = body[f];
    if (typeof v === "string" && v.trim() === "") {
      violations = violations.filter((x) => x.field !== f);
      blank2.push({ field: f, message: "must not be blank" });
      if (sizeFields[f] && v.length < sizeFields[f][0]) blank2.push({ field: f, message: sizeMessage(f) });
    }
  }
  violations = [...blank2, ...violations, ...extraViolations];
  return violations.length > 0 ? fieldsRejected(rename(violations)) : null;
}
var SENDER_RULES = { blankFields: ["sender"], sizeFields: { sender: [1, 35] } };
function stripTopLevelNulls(body) {
  const out = {};
  for (const k of Object.keys(body)) if (body[k] !== null) out[k] = body[k];
  return out;
}
function registerSendRoutes(ctx) {
  const limiter = createFixedWindowLimiter({
    limit: 5e4,
    windowMs: 6e4,
    countRejected: false,
    clock: ctx.clock,
    rateScale: ctx.opts.rateScale,
    registry: ctx.resettables
  });
  ctx.routes.add("POST", "/sms/v3/send", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const unbound = bindBody("SmsSendRequest", req.json ?? {}, { loose: ["iysFilter"] });
    if (unbound) return unbound;
    const body = stripTopLevelNulls(req.json ?? {});
    const iysFilter = normalizeIysFilter(body.iysFilter);
    delete body.iysFilter;
    const probe = { ...body, messages: Array.isArray(body.messages) && body.messages.length > 0 ? [null] : body.messages };
    const bad = checkBody(validator2, "SmsSendRequest", probe, {
      skipProperties: ["messages.items"],
      dateFields: ["startAt", "stopAt"],
      ...SENDER_RULES,
      notEmptyFields: ["messages"]
    });
    if (bad) return bad;
    const denied = authorize(account, login, "SEND");
    if (denied) return denied;
    const hit = limiter.hit(account.id);
    if (!hit.allowed) {
      return smsError(429, "RATE_LIMITED", "send rate limit exceeded", {}, { "Retry-After": String(hit.retryAfterSec) });
    }
    const badHeader = checkSender(account, body.sender);
    if (badHeader) return badHeader;
    const badIys = checkIys(account, iysFilter, body.sender);
    if (badIys) return badIys;
    const count = body.messages.length;
    const window = resolveSendWindow({ startAt: body.startAt, stopAt: body.stopAt, count, nowMs: ctx.clock.now() });
    if (typeof window.status === "number") return window;
    if (count > MAX_MESSAGES) return smsError(400, "INVALID_REQUEST", `${count} messages exceeds the limit of ${MAX_MESSAGES}`);
    const senderEntry = account.senders.find((s) => s.name === body.sender);
    const { accepted, rejected, rejectedTotal } = validateRecords(body.messages, {
      encoding: body.encoding ?? "DEFAULT",
      alphanumericSender: senderEntry.type === "ALPHANUMERIC",
      account
    });
    const truncated = rejectedTotal > rejected.length;
    if (accepted.length === 0) {
      return smsError(422, "NO_DELIVERABLE_MESSAGES", `all ${count} messages rejected`, {
        rejectedItems: rejected,
        rejectedItemsTruncated: truncated
      });
    }
    const job = ctx.jobs.create({
      accountId: account.id,
      kind: "SEND",
      status: window.status,
      startMs: window.startMs,
      stopMs: window.stopMs,
      sender: body.sender,
      records: accepted,
      referenceId: body.referenceId ?? null,
      encoding: body.encoding ?? "DEFAULT",
      alphanumericSender: senderEntry.type === "ALPHANUMERIC"
    });
    return afterJobCreated(req, ctx, {
      status: 202,
      body: {
        jobId: job.jobId,
        status: job.status,
        accepted: accepted.length,
        rejected: rejectedTotal,
        rejectedItems: rejected,
        rejectedItemsTruncated: truncated,
        referenceId: job.referenceId
      }
    });
  });
}

// packages/sms-mock/src/sms/send-family.mjs
var validator3 = createSchemaValidator(smsSpec);
var MINUTE_MS2 = 6e4;
var HOUR_MS = 60 * MINUTE_MS2;
var OTP_MAX_ALPHANUMERIC = 155;
var OTP_MAX_SUBSCRIBER = 160;
var LIST_MAX_SIZE = 100;
var LIST_MAX_FILTER = 100;
var ENCODINGS = ["DEFAULT", "TURKISH", "UNICODE"];
var invalid = (message, extras) => smsError(400, "INVALID_REQUEST", message, extras);
function bracketed(violations) {
  return violations.map((v) => ({ ...v, field: v.field.replace(/\.(\d+)(?=\.|$)/g, "[$1]") }));
}
function rateLimited(message, hit) {
  return smsError(429, "RATE_LIMITED", message, {}, { "Retry-After": String(hit.retryAfterSec) });
}
function validDate(d, m, y) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
function isDate(v) {
  const m = /^(\d{2})([./])(\d{2})\2(\d{4})$/.exec(v);
  return m !== null && validDate(Number(m[1]), Number(m[3]), Number(m[4]));
}
function isDateTime(v) {
  const m = /^(\d{2})([./])(\d{2})\2(\d{4}) (\d{2}):(\d{2})(?::(\d{2}))?$/.exec(v);
  if (m === null || !validDate(Number(m[1]), Number(m[3]), Number(m[4]))) return false;
  return Number(m[5]) <= 23 && Number(m[6]) <= 59 && (m[7] === void 0 || Number(m[7]) <= 59);
}
var INT64_MAX = 9223372036854775807n;
var PARAM_CHECKS = {
  BIGINT: (v) => {
    if (!/^-?\d+$/.test(v)) return false;
    const n = BigInt(v);
    return n <= INT64_MAX && n >= -INT64_MAX - 1n;
  },
  FLOAT: (v) => /^-?\d+(\.\d{1,4})?$/.test(v),
  TEXT: (v, p) => p.maxLength == null || v.length <= p.maxLength,
  DATE: isDate,
  DATETIME: isDateTime
};
function fillTemplate(template, params = {}) {
  const defined = template.parameters.map((p) => p.name);
  const given = Object.keys(params);
  const missing = defined.filter((n) => typeof params[n] !== "string" || params[n] === "");
  if (missing.length > 0) {
    return invalid(`Invalid params for templateId ${template.templateId}. Missing params: [${missing.join(", ")}]`);
  }
  const unexpected = given.filter((n) => !defined.includes(n));
  if (unexpected.length > 0) {
    return invalid(`Invalid params for templateId ${template.templateId}. Unexpected params: [${unexpected.join(", ")}]`);
  }
  for (const p of template.parameters) {
    if (!PARAM_CHECKS[p.type](params[p.name], p)) return invalid(`param '${p.name}' is not a valid ${p.type}`);
  }
  return template.content.replace(/\$\{([^}]+)\}/g, (all, name) => params[name] ?? all);
}
var A1 = "address1";
var A2 = "address2";
var ADDRESS_PARTS = [
  [],
  [A1, "name"],
  [A1, "name", "surname"],
  [A1, "surname"],
  [A1, "name", A2],
  [A1, "name", "surname", A2],
  [A1, "surname", A2],
  ["name"],
  ["surname"],
  ["name", "surname"],
  ["address"],
  ["address", "name"],
  ["address", "name", "surname"],
  ["address", "surname"],
  ["address", A2],
  ["address", "name", A2],
  ["address", "name", "surname", A2],
  ["address", "surname", A2]
];
function personalize(text, addressType, contact, shared) {
  if (!contact || addressType === 0) return text;
  const source = { ...contact, address1: shared.address1, address2: shared.address2 };
  const parts = ADDRESS_PARTS[addressType].map((k) => source[k]).filter((v) => typeof v === "string" && v.length > 0);
  return parts.length === 0 ? text : `${parts.join(" ")} ${text}`;
}
function resolveDirectoryWindow({ startAt, stopAt, nowMs }) {
  const minute = (ms) => Math.floor(ms / MINUTE_MS2) * MINUTE_MS2;
  const start = startAt === void 0 ? null : minute(Date.parse(startAt));
  const stop = stopAt === void 0 ? null : minute(Date.parse(stopAt));
  if (stop !== null) {
    const span = stop - (start ?? minute(nowMs));
    if (span < HOUR_MS || span > 21 * HOUR_MS) return smsError(400, "INVALID_SEND_WINDOW", "the send window was rejected");
  }
  const startMs = start !== null && start > nowMs ? start : nowMs;
  return { startMs, stopMs: stop ?? startMs + 21 * HOUR_MS };
}
var OTP_TRANSLATION = new Map(Object.entries({
  "ç": "c",
  "ğ": "g",
  "ı": "i",
  "ö": "o",
  "ş": "s",
  "ü": "u",
  "Ç": "C",
  "Ğ": "G",
  "İ": "I",
  "Ö": "O",
  "Ş": "S",
  "Ü": "U",
  "{": "(",
  "[": "(",
  "}": ")",
  "]": ")",
  "“": '"',
  "”": '"',
  "`": '"',
  "‘": "'",
  "’": "'",
  "~": "?",
  "€": ";EO;",
  "	": " ",
  "|": " ",
  "^": ""
}));
function translateOtpText(text) {
  let out = "";
  for (const ch of text.trim().replace(/\r\n?/g, "\n")) {
    if (ch === "\n") {
      out += "\\n";
      continue;
    }
    const mapped = OTP_TRANSLATION.get(ch);
    if (mapped !== void 0) {
      out += mapped;
      continue;
    }
    const c = ch.codePointAt(0);
    out += c >= 32 && c <= 125 ? ch : "?";
  }
  return out;
}
var OTP_RECIPIENT = /^\+?(?:90|0)?5\d{9}$/;
var OTP_FIELDS = ["sender", "text", "recipient"];
function checkOtpBody(json) {
  const unbound = bindBody("OtpSendRequest", json);
  if (unbound) return unbound;
  const body = stripNulls(json);
  const violations = OTP_FIELDS.filter((f) => body[f] === void 0 || body[f].trim() === "").map((field) => ({ field, message: "must not be blank" }));
  if (violations.length > 0) return fieldsRejected(violations);
  if (!OTP_RECIPIENT.test(body.recipient)) return invalid("recipient is not a valid number");
  return null;
}
function registerSendFamilyRoutes(ctx) {
  const limiter = (limit, countRejected) => createFixedWindowLimiter({
    limit,
    windowMs: MINUTE_MS2,
    countRejected,
    clock: ctx.clock,
    rateScale: ctx.opts.rateScale,
    registry: ctx.resettables
  });
  const directoryLimiter = limiter(60, false);
  const templateLimiter = limiter(1e3, true);
  const listLimiter = limiter(20, true);
  ctx.routes.add("POST", DIRECTORY_SEND, (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const unbound = bindBody("DirectorySendRequest", req.json ?? {}, { loose: ["iysFilter"], enums: { encoding: ENCODINGS } });
    if (unbound) return unbound;
    const body = stripNulls(req.json ?? {});
    const iysFilter = normalizeIysFilter(body.iysFilter);
    delete body.iysFilter;
    const unicode = body.encoding === "UNICODE";
    if (unicode) delete body.encoding;
    const bad = checkBody(validator3, "DirectorySendRequest", body, {
      dateFields: ["startAt", "stopAt"],
      blankFields: ["sender"],
      rename: bracketed
    });
    if (bad) return bad;
    const denied = authorize(account, login, "SEND");
    if (denied) return denied;
    const hit = directoryLimiter.hit(account.id);
    if (!hit.allowed) return rateLimited("directory send rate limit exceeded", hit);
    if (unicode) return invalid("encoding UNICODE is not supported for directory sends");
    const groupIds = body.groupIds ?? [];
    const contacts = body.contacts ?? [];
    if (groupIds.length === 0 && contacts.length === 0) {
      return invalid("a directory send names at least one group or contact; for numbers alone use /sms/v3/send");
    }
    const groups = account.directory?.groups ?? [];
    const badHeader = checkSender(account, body.sender);
    if (badHeader) return badHeader;
    const senderEntry = account.senders.find((s) => s.name === body.sender);
    const alphanumeric = senderEntry.type === "ALPHANUMERIC";
    const encoding = body.encoding ?? "DEFAULT";
    const m = measure(body.text, encoding, alphanumeric);
    if (!m.fits) return invalid(`text exceeds ${m.limit - (alphanumeric ? 5 : 0)} characters for this encoding and sender`);
    if (iysFilter !== "NONE" && (!account.iysMode || !(senderEntry.brandCode > 0))) {
      return smsError(422, "REJECTED_IYS", "consent filtering cannot be applied to this sender or account");
    }
    const window = resolveDirectoryWindow({ startAt: body.startAt, stopAt: body.stopAt, nowMs: ctx.clock.now() });
    if ("status" in window) return window;
    const addressType = body.addressType ?? 0;
    const shared = { address1: body.address1, address2: body.address2 };
    const entries = [];
    for (const id of groupIds) {
      for (const c of groups.find((g) => g.groupId === id)?.contacts ?? []) entries.push({ number: c.number, contact: c });
    }
    for (const c of contacts) entries.push({ number: c.number, contact: c });
    for (const n of body.recipients ?? []) entries.push({ number: n, contact: null });
    const records = entries.map((e, index) => ({
      index,
      recipient: e.number,
      text: personalize(body.text, addressType, e.contact, shared)
    }));
    const job = ctx.jobs.create({
      accountId: account.id,
      kind: "DIRECTORY",
      status: "QUEUED",
      startMs: window.startMs,
      stopMs: window.stopMs,
      sender: body.sender,
      records,
      referenceId: null,
      encoding,
      alphanumericSender: alphanumeric
    });
    return afterJobCreated(req, ctx, { status: 202, body: { jobId: job.jobId, status: "QUEUED", review: "NONE" } });
  });
  ctx.routes.add("POST", SEND_TEMPLATE, (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const unbound = bindBody("TemplateSendRequest", req.json ?? {}, { loose: ["iysFilter"] });
    if (unbound) return unbound;
    const body = stripNulls(req.json ?? {});
    const iysFilter = normalizeIysFilter(body.iysFilter);
    delete body.iysFilter;
    const itemViolations = [];
    if (Array.isArray(body.templates)) {
      body.templates.forEach((t, i) => {
        const lengthOk = t !== null && typeof t === "object" && typeof t.recipient === "string" && t.recipient.length >= 1 && t.recipient.length <= 17;
        const probe = lengthOk ? { ...t, recipient: "905000000000" } : t;
        for (const v of validator3.validate("TemplateMessage", probe)) {
          itemViolations.push({ ...v, field: v.field === "" ? `templates.${i}` : `templates.${i}.${v.field}` });
        }
      });
    }
    const bad = checkBody(validator3, "TemplateSendRequest", body, {
      skipProperties: ["templates.items"],
      dateFields: ["startAt", "stopAt"],
      ...SENDER_RULES,
      extraViolations: itemViolations,
      rename: bracketed
    });
    if (bad) return bad;
    const denied = authorize(account, login, "SEND");
    if (denied) return denied;
    const hit = templateLimiter.hit(account.id);
    if (!hit.allowed) return rateLimited("template send rate limit exceeded", hit);
    const byId = new Map(account.templates.map((t) => [t.templateId, t]));
    const missingIds = [...new Set(body.templates.map((t) => t.templateId).filter((id) => !byId.has(id)))];
    if (missingIds.length > 0) return invalid(`templates not found: [${missingIds.join(", ")}]`);
    const records = [];
    for (const t of body.templates) {
      const text = fillTemplate(byId.get(t.templateId), t.params);
      if (typeof text !== "string") return text;
      records.push({ recipient: t.recipient, text });
    }
    const badHeader = checkSender(account, body.sender);
    if (badHeader) return badHeader;
    const badIys = checkIys(account, iysFilter, body.sender);
    if (badIys) return badIys;
    const count = records.length;
    const window = resolveSendWindow({ startAt: body.startAt, stopAt: body.stopAt, count, nowMs: ctx.clock.now() });
    if (typeof window.status === "number") return window;
    const senderEntry = account.senders.find((s) => s.name === body.sender);
    const { accepted, rejected, rejectedTotal } = validateRecords(records, {
      encoding: body.encoding ?? "DEFAULT",
      alphanumericSender: senderEntry.type === "ALPHANUMERIC",
      account
    });
    const truncated = rejectedTotal > MAX_REPORTED;
    if (accepted.length === 0) {
      return smsError(422, "NO_DELIVERABLE_MESSAGES", `all ${count} messages rejected`, {
        rejectedItems: rejected,
        rejectedItemsTruncated: truncated
      });
    }
    const job = ctx.jobs.create({
      accountId: account.id,
      kind: "TEMPLATE",
      status: window.status,
      startMs: window.startMs,
      stopMs: window.stopMs,
      sender: body.sender,
      records: accepted,
      referenceId: body.referenceId ?? null,
      encoding: body.encoding ?? "DEFAULT",
      alphanumericSender: senderEntry.type === "ALPHANUMERIC"
    });
    return afterJobCreated(req, ctx, {
      status: 202,
      body: {
        jobId: job.jobId,
        status: job.status,
        accepted: accepted.length,
        rejected: rejectedTotal,
        rejectedItems: rejected,
        rejectedItemsTruncated: truncated,
        referenceId: job.referenceId
      }
    });
  });
  ctx.routes.add("POST", SEND_OTP, (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth && auth.body.message === "no bearer token") return auth;
    const bad = checkOtpBody(req.json ?? {});
    if (bad) return bad;
    const body = stripNulls(req.json ?? {});
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "SEND");
    if (denied) return denied;
    if (Boolean(account.enterpriseOtp) !== (req.headers?.["x-client"] === "enterprise")) {
      return smsError(403, "FORBIDDEN", "account operator is not served for this operation");
    }
    const sender = findOtpSender(account, body.sender);
    if (sender.error) return sender.error;
    const text = translateOtpText(body.text);
    const max = sender.entry.type === "SUBSCRIBER_NUMBER" ? OTP_MAX_SUBSCRIBER : OTP_MAX_ALPHANUMERIC;
    if (text.length > max) return invalid(`text is longer than ${max} characters for this sender`);
    if (!account.otpCredit) {
      return smsError(422, "INSUFFICIENT_CREDIT", "no credit, package or campaign to pay for the otp");
    }
    const now = ctx.clock.now();
    const job = ctx.jobs.create({
      accountId: account.id,
      kind: "OTP",
      status: "QUEUED",
      startMs: now,
      stopMs: now + MINUTE_MS2,
      sender: sender.entry.name,
      records: [{ index: 0, recipient: `90${body.recipient.slice(-10)}`, text }],
      referenceId: null
    });
    return { status: 202, body: { jobId: job.jobId } };
  });
  ctx.routes.add("GET", "/sms/v3/templates", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "USER");
    if (denied) return denied;
    const hit = listLimiter.hit(account.id);
    if (!hit.allowed) return rateLimited("template list rate limit exceeded", hit);
    const q = req.query;
    const intParam = (name, fallback) => {
      const raw = q.get(name);
      if (raw === null || raw === "") return fallback;
      return /^-?\d+$/.test(raw) ? Number(raw) : NaN;
    };
    const page = intParam("page", 0);
    const size = intParam("size", 20);
    if (Number.isNaN(page)) return invalid("page must be an integer");
    if (page < 0) return invalid("page must not be negative");
    if (Number.isNaN(size) || size < 1 || size > LIST_MAX_SIZE) return invalid(`size must be between 1 and ${LIST_MAX_SIZE}`);
    const filters = {};
    for (const name of ["type", "search", "content"]) {
      const v = q.get(name);
      if (v === null || v.trim() === "") continue;
      if (v.length > LIST_MAX_FILTER) return invalid(`${name} must be at most ${LIST_MAX_FILTER} characters`);
      filters[name] = v;
    }
    const includePublic = (q.get("includePublic") ?? "true").toLowerCase() !== "false";
    const lower = (s) => String(s ?? "").toLowerCase();
    const matches = account.templates.filter((t) => includePublic || !t.public).filter((t) => filters.type === void 0 || t.type === filters.type).filter((t) => filters.search === void 0 || lower(t.description).includes(lower(filters.search))).filter((t) => filters.content === void 0 || lower(t.content).includes(lower(filters.content))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const slice = matches.slice(page * size, page * size + size);
    return {
      status: 200,
      body: {
        count: slice.length,
        page,
        total: matches.length,
        totalPages: Math.ceil(matches.length / size),
        templates: slice.map((t) => ({
          templateId: t.templateId,
          content: t.content,
          type: t.type,
          description: t.description ?? null,
          public: t.public,
          parameters: t.parameters.map((p) => ({ name: p.name, type: p.type, maxLength: p.maxLength ?? null })),
          createdAt: t.createdAt ?? null
        }))
      }
    };
  });
}

// packages/sms-mock/src/jobs.mjs
import { randomInt } from "node:crypto";
var DELIVERY_DELAY_MS = 5e3;
function createJobStore({ clock }) {
  const byAccount = /* @__PURE__ */ new Map();
  const usedIds = /* @__PURE__ */ new Set();
  function newJobId() {
    for (; ; ) {
      const id = String(randomInt(1e9, 1e10));
      if (!usedIds.has(id)) {
        usedIds.add(id);
        return id;
      }
    }
  }
  return {
    create(job) {
      const created = { encoding: "DEFAULT", alphanumericSender: false, ...job, jobId: newJobId(), createdMs: clock.now() };
      let jobs = byAccount.get(created.accountId);
      if (!jobs) {
        jobs = /* @__PURE__ */ new Map();
        byAccount.set(created.accountId, jobs);
      }
      jobs.set(created.jobId, created);
      return created;
    },
    get(accountId, jobId) {
      return byAccount.get(accountId)?.get(String(jobId)) ?? null;
    },
    all(accountId) {
      return [...byAccount.get(accountId)?.values() ?? []];
    }
  };
}
function deliveryOf(job, record, nowMs) {
  if (job.status === "CANCELLED") return { status: "PENDING", failReason: null, deliveredAt: null };
  const at = job.startMs + DELIVERY_DELAY_MS;
  if (nowMs < at) return { status: "PENDING", failReason: null, deliveredAt: null };
  if (String(record.recipient).endsWith("00")) {
    return { status: "NOT_DELIVERED", failReason: "UNKNOWN_SUBSCRIBER", deliveredAt: null };
  }
  return { status: "DELIVERED", failReason: null, deliveredAt: at };
}
function isReportable(job) {
  return job.kind !== "OTP" && job.status !== "CANCELLED";
}

// packages/sms-mock/src/http.mjs
var SMS_BODY_LIMIT = 500 * 1024 * 1024;
var AUTH_BODY_LIMIT = 1024 * 1024;
function createRoutes() {
  const table = /* @__PURE__ */ new Map();
  return {
    add(method, path, handler) {
      if (!table.has(path)) table.set(path, /* @__PURE__ */ new Map());
      table.get(path).set(method.toUpperCase(), handler);
    },
    /** @returns {{ handler?: Function, allow: string[] }} */
    match(method, path) {
      const byMethod = table.get(path);
      if (!byMethod) return { allow: [] };
      return { handler: byMethod.get(method), allow: [...byMethod.keys()] };
    }
  };
}
function envelopeFor(path) {
  if (path === "/sms/v3" || path.startsWith("/sms/v3/")) return "sms";
  if (path === "/auth/v3" || path.startsWith("/auth/v3/")) return "auth";
  return "plain";
}
function acceptsJson(accept) {
  if (!accept) return true;
  return accept.split(",").some((part) => {
    const type = part.split(";")[0].trim().toLowerCase();
    const q = /;\s*q=([\d.]+)/i.exec(part);
    if (q && Number(q[1]) === 0) return false;
    return type === "*/*" || type === "application/*" || type === "application/json" || type === "application/problem+json";
  });
}
function istanbulTimestamp(ms) {
  return new Date(ms + 3 * 36e5).toISOString().replace("Z", "+03:00");
}
var BodyTooLarge = class extends Error {
};
function readBody(req, limit) {
  return new Promise((resolve2, reject) => {
    const declared = Number(req.headers["content-length"]);
    if (Number.isFinite(declared) && declared > limit) return reject(new BodyTooLarge());
    const chunks = [];
    let size = 0;
    let done = false;
    req.on("data", (chunk) => {
      if (done) return;
      size += chunk.length;
      if (size > limit) {
        done = true;
        chunks.length = 0;
        return reject(new BodyTooLarge());
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!done) resolve2(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}

// packages/sms-mock/src/sms/jobs-routes.mjs
var validator4 = createSchemaValidator(smsSpec);
var PAGE_SIZE = 100;
var MINUTE_MS3 = 6e4;
var TZ_MS = 3 * 36e5;
var REPORT_JOB_WINDOW_MS = MINUTE_MS3;
var STATS_JOB_WINDOW_MS = 10 * MINUTE_MS3;
var ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
var CANCEL_GONE = "job not found for this account, or no longer waiting to be sent";
var CANCELLABLE_KINDS = /* @__PURE__ */ new Set(["SEND", "TEMPLATE"]);
var invalid2 = (message) => smsError(400, "INVALID_REQUEST", message);
var limited = (message, retryAfterSec) => smsError(429, "RATE_LIMITED", message, {}, { "Retry-After": String(retryAfterSec) });
function operatorOf(recipient) {
  const r = String(recipient);
  if (r.startsWith("-")) return "INTERNATIONAL";
  const p = r.slice(2, 5);
  if (/^53\d$/.test(p) || p === "561") return "TURKCELL";
  if (/^54\d$/.test(p)) return "VODAFONE";
  if (["501", "505", "506", "507"].includes(p) || /^55[1-9]$/.test(p)) return "TURK_TELEKOM";
  return "UNKNOWN";
}
var partsOf = (job, record) => measure(String(record.text ?? ""), job.encoding, job.alphanumericSender).parts;
var monthOf = (ms) => new Date(ms + TZ_MS).toISOString().slice(0, 7);
function createMarkers(clock) {
  const map = /* @__PURE__ */ new Map();
  return {
    remainingMs(key) {
      const exp = map.get(key);
      if (exp === void 0) return 0;
      const left = exp - clock.now();
      if (left <= 0) {
        map.delete(key);
        return 0;
      }
      return left;
    },
    mark(key, windowMs) {
      map.set(key, clock.now() + windowMs);
    },
    reset() {
      map.clear();
    }
  };
}
function resolveWindow(query, nowMs) {
  const rawStart = query.get("startAt");
  const rawStop = query.get("stopAt");
  for (const [name, v] of [["startAt", rawStart], ["stopAt", rawStop]]) {
    if (v !== null && (!ISO.test(v) || Number.isNaN(Date.parse(v)))) return invalid2(`${name} is not an ISO-8601 date-time`);
  }
  if (rawStart === null !== (rawStop === null)) return invalid2("startAt and stopAt must be sent together, or neither");
  let start;
  let stop;
  if (rawStart === null) {
    const d = new Date(nowMs + TZ_MS);
    start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - TZ_MS;
    stop = nowMs;
  } else {
    start = Date.parse(rawStart);
    stop = Date.parse(rawStop);
    if (stop < start) return invalid2("stopAt is before startAt");
    const limit = new Date(start + TZ_MS);
    limit.setUTCMonth(limit.getUTCMonth() + 1);
    if (stop + TZ_MS > limit.getTime()) return invalid2("the window is wider than one month");
  }
  return { from: Math.floor(start / MINUTE_MS3) * MINUTE_MS3, to: (Math.floor(stop / MINUTE_MS3) + 1) * MINUTE_MS3 };
}
function registerJobsRoutes(ctx) {
  const scale = ctx.opts.rateScale;
  const limiter = (limit) => createFixedWindowLimiter({ limit, windowMs: MINUTE_MS3, countRejected: false, clock: ctx.clock, rateScale: scale, registry: ctx.resettables });
  const reportLimiter = limiter(60);
  const statsLimiter = limiter(60);
  const cancelLimiter = limiter(25e3);
  const reportMarks = createMarkers(ctx.clock);
  ctx.resettables.push(reportMarks);
  const statsMarks = createMarkers(ctx.clock);
  ctx.resettables.push(statsMarks);
  ctx.routes.add("GET", "/sms/v3/report", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "REPORT");
    if (denied) return denied;
    const jobIds = [...new Set(req.query.getAll("jobIds").flatMap((v) => v.split(",")).map((s) => s.trim()).filter(Boolean))];
    const hit = reportLimiter.hit(account.id);
    if (!hit.allowed) return limited("report rate limit exceeded", hit.retryAfterSec);
    const wait = Math.max(0, ...jobIds.map((id) => reportMarks.remainingMs(`${account.id}:${id}`)));
    if (wait > 0) return limited("a jobId in this request was queried too recently", Math.ceil(wait / 1e3));
    for (const id of jobIds) reportMarks.mark(`${account.id}:${id}`, REPORT_JOB_WINDOW_MS);
    const rawPage = req.query.get("page");
    let page = 0;
    if (rawPage !== null) {
      if (!/^-?\d+$/.test(rawPage.trim())) return invalid2("page must be an integer");
      page = Number(rawPage.trim());
      if (page < 0) return invalid2("page must not be negative");
    }
    const window = resolveWindow(req.query, ctx.clock.now());
    if ("status" in window) return window;
    const now = ctx.clock.now();
    const want = jobIds.length > 0 ? new Set(jobIds) : null;
    const rows = [];
    for (const job of ctx.jobs.all(account.id)) {
      if (!isReportable(job) || want && !want.has(job.jobId)) continue;
      if (job.startMs < window.from || job.startMs >= window.to) continue;
      for (const record of job.records) rows.push({ job, record });
    }
    const reports = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(({ job, record }) => {
      const d = deliveryOf(job, record, now);
      const recipient = String(record.recipient);
      return {
        jobId: job.jobId,
        number: recipient.startsWith("-") ? recipient.slice(1) : recipient.slice(2),
        status: d.status,
        operator: operatorOf(recipient),
        messageLength: partsOf(job, record),
        deliveredAt: d.deliveredAt === null ? null : istanbulTimestamp(d.deliveredAt),
        failReason: d.failReason,
        referenceId: job.referenceId ?? null
      };
    });
    return { status: 200, body: { count: reports.length, page, reports } };
  });
  ctx.routes.add("GET", "/sms/v3/stats", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "REPORT");
    if (denied) return denied;
    const jobId = (req.query.get("jobId") ?? "").trim();
    if (jobId === "") return invalid2("query parameter 'jobId' must not be blank");
    const rawMonth = req.query.get("month");
    if (rawMonth !== null && !/^\d{4}-(0[1-9]|1[0-2])$/.test(rawMonth)) return invalid2("query parameter 'month' must be yyyy-MM");
    const now = ctx.clock.now();
    const month = rawMonth ?? monthOf(now);
    const hit = statsLimiter.hit(account.id);
    if (!hit.allowed) return limited("stats rate limit exceeded", hit.retryAfterSec);
    const key = `${account.id}:${jobId}`;
    const left = statsMarks.remainingMs(key);
    if (left > 0) return limited("this jobId was queried too recently", Math.ceil(left / 1e3));
    statsMarks.mark(key, STATS_JOB_WINDOW_MS);
    const job = ctx.jobs.get(account.id, jobId);
    if (!job || !isReportable(job) || job.records.length === 0 || monthOf(job.startMs) !== month) {
      return smsError(404, "NOT_FOUND", "job not found");
    }
    const groups = /* @__PURE__ */ new Map();
    for (const record of job.records) {
      const d = deliveryOf(job, record, now);
      const failReason = d.failReason === null ? null : "UNKNOWN";
      const domestic = !String(record.recipient).startsWith("-");
      const k = `${d.status}|${failReason}|${domestic}`;
      let g = groups.get(k);
      if (!g) {
        g = { status: d.status, failReason, domestic, messageCount: 0, totalParts: 0 };
        groups.set(k, g);
      }
      g.messageCount++;
      if (d.status !== "NOT_DELIVERED") g.totalParts += partsOf(job, record);
    }
    const stats = [...groups.values()].map((g) => ({
      status: g.status,
      failReason: g.failReason,
      messageCount: g.messageCount,
      totalParts: g.totalParts,
      domestic: g.domestic,
      charging: g.status === "DELIVERED" ? "charged" : "uncharged",
      chargeDescription: g.status === "DELIVERED" ? `${(g.totalParts * 0.315).toFixed(2)} TL from: credit balance` : null
    }));
    return { status: 200, body: { jobId: job.jobId, month, count: stats.length, stats } };
  });
  ctx.routes.add("POST", "/sms/v3/cancel", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const unbound = bindBody("CancelRequest", req.json ?? {});
    if (unbound) return unbound;
    const body = req.json ?? {};
    let violations = validator4.validate("CancelRequest", body);
    if (typeof body.jobId === "string" && body.jobId.trim() === "") {
      violations = [{ field: "jobId", message: "must not be blank" }];
    }
    if (violations.length > 0) return fieldsRejected(violations);
    const denied = authorize(account, login, "USER");
    if (denied) return denied;
    const hit = cancelLimiter.hit(account.id);
    if (!hit.allowed) return limited("cancel rate limit exceeded", hit.retryAfterSec);
    const now = ctx.clock.now();
    const job = ctx.jobs.get(account.id, body.jobId);
    if (!job || !CANCELLABLE_KINDS.has(job.kind) || job.status !== "SCHEDULED" || job.startMs <= now) {
      return smsError(404, "NOT_FOUND", CANCEL_GONE);
    }
    job.status = "CANCELLED";
    job.cancelledMs = now;
    return { status: 200, body: { jobId: body.jobId, cancelledAt: istanbulTimestamp(now) } };
  });
}

// packages/sms-mock/src/sms/account-routes.mjs
var validator5 = createSchemaValidator(smsSpec);
var MINUTE_MS4 = 6e4;
var HOUR_MS2 = 36e5;
var TZ_MS2 = 3 * HOUR_MS2;
var BLACKLIST_PAGE_SIZE = 200;
var BLACKLIST_QUERY_WINDOW_MS = 10 * MINUTE_MS4;
var INBOX_CAP = 500;
var ISO2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
var OPERATOR = "NETGSM MOBIL";
var invalid3 = (message) => smsError(400, "INVALID_REQUEST", message);
var limited2 = (message, retryAfterSec) => smsError(429, "RATE_LIMITED", message, {}, { "Retry-After": String(retryAfterSec) });
function createInboxStore({ clock }) {
  const byAccount = /* @__PURE__ */ new Map();
  const listeners = [];
  let seq = 0;
  return {
    add(accountId, { from, text, receivedAt }) {
      const message = {
        id: String(++seq),
        accountId,
        from: String(from),
        text: String(text),
        operator: OPERATOR,
        receivedAt: receivedAt ?? clock.now()
      };
      if (!byAccount.has(accountId)) byAccount.set(accountId, []);
      byAccount.get(accountId).push(message);
      for (const fn of listeners) {
        try {
          fn(accountId, message);
        } catch {
        }
      }
      return message;
    },
    all(accountId) {
      return [...byAccount.get(accountId) ?? []];
    },
    /** Mesaj eklendikçe `fn(accountId, message)` çağrılır. */
    onAdd(fn) {
      listeners.push(fn);
    }
  };
}
function senderOf(from) {
  const n = from.replace(/^\+/, "");
  return /^90\d{10}$/.test(n) ? n.slice(2) : n;
}
function toInboxMessage(m) {
  return {
    id: m.id,
    jobId: null,
    sender: senderOf(m.from),
    text: m.text,
    operator: m.operator,
    receivedAt: istanbulTimestamp(m.receivedAt)
  };
}
function resolveWindow2(query, nowMs) {
  const rawStart = query.get("startAt");
  const rawStop = query.get("stopAt");
  for (const [name, v] of [["startAt", rawStart], ["stopAt", rawStop]]) {
    if (v !== null && (!ISO2.test(v) || Number.isNaN(Date.parse(v)))) return invalid3(`${name} is not an ISO-8601 date-time`);
  }
  if (rawStart === null !== (rawStop === null)) return invalid3("startAt and stopAt must be sent together, or neither");
  if (rawStart === null) {
    const d = new Date(nowMs + TZ_MS2);
    return { from: Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - TZ_MS2, to: nowMs };
  }
  const start = Date.parse(rawStart);
  const stop = Date.parse(rawStop);
  if (stop < start) return invalid3("stopAt must not be before startAt");
  const limit = new Date(start + TZ_MS2);
  limit.setUTCMonth(limit.getUTCMonth() + 2);
  if (stop + TZ_MS2 > limit.getTime()) return invalid3("the window between startAt and stopAt may not exceed 2 months");
  return { from: start, to: stop };
}
function registerAccountRoutes(ctx) {
  const scale = ctx.opts.rateScale;
  const limiter = (limit, windowMs) => createFixedWindowLimiter({ limit, windowMs, countRejected: true, clock: ctx.clock, rateScale: scale, registry: ctx.resettables });
  const sendersReadLimiter = limiter(60, MINUTE_MS4);
  const defaultChangeLimiter = limiter(4, HOUR_MS2);
  const inboxLimiter = limiter(60, MINUTE_MS4);
  const blacklistLimiter = limiter(60, MINUTE_MS4);
  const blacklistMarks = /* @__PURE__ */ new Map();
  ctx.resettables.push({ reset: () => blacklistMarks.clear() });
  const entry = (s) => ({ name: s.name, type: s.type, brandCode: s.brandCode, usable: s.usable, reason: s.reason ?? null });
  ctx.routes.add("GET", "/sms/v3/senders", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "USER");
    if (denied) return denied;
    const hit = sendersReadLimiter.hit(account.id);
    if (!hit.allowed) return limited2("sender read rate limit exceeded", hit.retryAfterSec);
    const senders = account.senders.map(entry);
    return { status: 200, body: { count: senders.length, senders } };
  });
  ctx.routes.add("GET", "/sms/v3/senders/default", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "USER");
    if (denied) return denied;
    const hit = sendersReadLimiter.hit(account.id);
    if (!hit.allowed) return limited2("sender read rate limit exceeded", hit.retryAfterSec);
    const current = account.senders.find((s) => s.name === account.defaultSender);
    return { status: 200, body: { sender: current ? entry(current) : null } };
  });
  ctx.routes.add("PUT", "/sms/v3/senders/default", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const bad = bindBody("DefaultSenderChangeRequest", req.json ?? {}) ?? checkBody(validator5, "DefaultSenderChangeRequest", req.json ?? {}, { blankFields: ["name"] });
    if (bad) return bad;
    const denied = authorize(account, login, "USER");
    if (denied) return denied;
    const hit = defaultChangeLimiter.hit(account.id);
    if (!hit.allowed) return limited2("default sender change rate limit exceeded", hit.retryAfterSec);
    const name = req.json.name;
    const reject = (message) => smsError(422, "REJECTED_HEADER", message);
    if (account.senders.length === 0) return reject("NO_HEADERS_REGISTERED");
    const match = account.senders.find((s) => s.name === name);
    if (!match) {
      const lower = name.toLowerCase();
      return reject(account.senders.some((s) => s.name.toLowerCase() === lower) ? "CASE_MISMATCH" : "NOT_REGISTERED");
    }
    account.defaultSender = match.name;
    return { status: 200, body: { sender: entry(match) } };
  });
  ctx.routes.add("GET", "/sms/v3/inbox", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    const denied = authorize(account, login, "RECEIVE");
    if (denied) return denied;
    const hit = inboxLimiter.hit(account.id);
    if (!hit.allowed) return limited2("inbox rate limit exceeded", hit.retryAfterSec);
    const window = resolveWindow2(req.query, ctx.clock.now());
    if ("status" in window) return window;
    const lo = Math.floor(window.from / 1e3);
    const hi = Math.floor(window.to / 1e3);
    const inRange = ctx.inbox.all(account.id).filter((m) => {
      const s = Math.floor(m.receivedAt / 1e3);
      return s >= lo && s <= hi;
    });
    const truncated = inRange.length >= INBOX_CAP;
    const messages = inRange.slice(0, INBOX_CAP).map(toInboxMessage);
    return { status: 200, body: { count: messages.length, messages, truncated } };
  });
  ctx.routes.add("GET", "/sms/v3/blacklist", (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { account } = auth;
    const rawNumber = (req.query.get("number") ?? "").trim();
    const lookup = rawNumber !== "";
    const rawPage = req.query.get("page");
    let page = 0;
    if (rawPage !== null) {
      if (!/^-?\d+$/.test(rawPage.trim())) return invalid3("page must be an integer");
      page = Number(rawPage.trim());
      if (page < 0) return invalid3("page must not be negative");
    }
    if (lookup && !/^[0-9]{1,15}$/.test(rawNumber)) return invalid3("number must be up to 15 digits");
    const hit = blacklistLimiter.hit(account.id);
    if (!hit.allowed) return limited2("blacklist rate limit exceeded", hit.retryAfterSec);
    const key = `${account.id}:${page}:${lookup ? rawNumber : ""}`;
    const now = ctx.clock.now();
    const expires = blacklistMarks.get(key);
    if (expires !== void 0 && expires > now) {
      return limited2("the same blacklist query was made too recently", Math.max(1, Math.ceil((expires - now) / 1e3)));
    }
    let body;
    if (lookup) {
      const found = account.blacklist.includes(rawNumber);
      body = { count: found ? 1 : 0, page: null, number: rawNumber, numbers: found ? [rawNumber] : [] };
    } else {
      const newestFirst = [...account.blacklist].reverse();
      const numbers = newestFirst.slice(page * BLACKLIST_PAGE_SIZE, (page + 1) * BLACKLIST_PAGE_SIZE);
      body = { count: numbers.length, page, number: null, numbers };
    }
    blacklistMarks.set(key, now + BLACKLIST_QUERY_WINDOW_MS);
    return { status: 200, body };
  });
  ctx.routes.add("POST", "/__mock/inbound", (req) => {
    const b = req.json;
    const bad = (m) => ({ status: 400, body: { error: m } });
    if (!b || typeof b !== "object" || Array.isArray(b)) return bad("body must be a JSON object");
    for (const k of ["username", "from", "text"]) {
      if (typeof b[k] !== "string" || b[k] === "") return bad(`${k} is required`);
    }
    const account = ctx.accounts.get(b.username);
    if (!account) return { status: 404, body: { error: `unknown username: ${b.username}` } };
    const stored = ctx.inbox.add(account.id, { from: b.from, text: b.text });
    return { status: 201, body: stored };
  });
}

// packages/sms-mock/src/sms/webhook-routes.mjs
import { isIP } from "node:net";
var validator6 = createSchemaValidator(smsSpec);
var RATE_LIMIT = 10;
var RATE_WINDOW_MS = 6e4;
var HEADER_LINE = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+:[\t\x20-\x2B\x2D-\x39\x3B-\x7E]*$/;
var NUMBER_LABEL = /^(\d+|0x[0-9a-f]*)$/i;
var DOTTED_DECIMAL = /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
var RESERVED_SUFFIX = /\.(local|localhost|internal|localdomain|lan|home|corp|intranet)$/;
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
var invalid4 = (message) => smsError(400, "INVALID_REQUEST", message);
function isPublicIp(ip) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || a === 100 && b >= 64 && b <= 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168);
  }
  const l = ip.toLowerCase();
  if (l === "::" || l === "::1" || /^f[cd]/.test(l) || /^fe[89ab]/.test(l) || l.startsWith("ff")) return false;
  const dotted = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(l);
  if (dotted) return isPublicIp(dotted[1]);
  const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(l);
  if (hex) {
    const hi = parseInt(hex[1], 16);
    const lo = parseInt(hex[2], 16);
    return isPublicIp(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
  }
  return true;
}
function checkUrl(raw, allowLoopback) {
  const url = String(raw).trim();
  let u;
  try {
    u = new URL(url);
  } catch {
    return "url must be an absolute http or https URL with a host";
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return "url must be an absolute http or https URL with a host";
  if (!u.hostname) return "url must be an absolute http or https URL with a host";
  if (u.port !== "" && (Number(u.port) < 1 || Number(u.port) > 65535)) return "port must be between 1 and 65535";
  let host = u.hostname.startsWith("[") ? u.hostname.slice(1, -1) : u.hostname;
  if (host.endsWith(".")) host = host.slice(0, -1);
  const nonPublic = "url must point to a public address";
  if (LOCAL_HOSTS.has(host)) return allowLoopback ? null : nonPublic;
  if (isIP(host) !== 0) return isPublicIp(host) ? null : nonPublic;
  if (host.split(".").every((l) => NUMBER_LABEL.test(l)) && !DOTTED_DECIMAL.test(host)) return nonPublic;
  if (!host.includes(".") || RESERVED_SUFFIX.test(host)) return nonPublic;
  return null;
}
function registerWebhookRoutes(ctx) {
  const limiter = createFixedWindowLimiter({
    limit: RATE_LIMIT,
    windowMs: RATE_WINDOW_MS,
    countRejected: true,
    clock: ctx.clock,
    rateScale: ctx.opts.rateScale,
    registry: ctx.resettables
  });
  const names = { report: "report", inbox: "inbox" };
  function gate(req, validate) {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { login, account } = auth;
    if (validate) {
      const unbound = bindBody("WebhookRequest", req.json ?? {});
      if (unbound) return unbound;
      const violations = validator6.validate("WebhookRequest", req.json ?? {});
      if (violations.length > 0) return fieldsRejected(violations);
    }
    const denied = authorize(account, login, "USER");
    if (denied) return denied;
    const hit = limiter.hit(account.id);
    if (!hit.allowed) return smsError(429, "RATE_LIMITED", "webhook rate limit exceeded", {}, { "Retry-After": String(hit.retryAfterSec) });
    return { account };
  }
  for (const kind of ["report", "inbox"]) {
    const path = `/sms/v3/webhooks/${kind}`;
    ctx.routes.add("POST", path, (req) => {
      const g = gate(req, true);
      if ("status" in g) return g;
      const { account } = g;
      const { url: rawUrl, headers: rawHeaders } = req.json;
      const problem2 = checkUrl(rawUrl, ctx.opts.allowLoopbackWebhooks !== false);
      if (problem2) return invalid4(problem2);
      const headers = typeof rawHeaders === "string" && rawHeaders.trim() !== "" ? rawHeaders.trim() : null;
      if (headers !== null && !HEADER_LINE.test(headers)) {
        return invalid4("headers must be one 'Name: value' line of printable ASCII, with no comma or colon in the value");
      }
      if (ctx.webhooks.has(account.id, kind)) {
        return smsError(409, "ALREADY_EXISTS", `a ${names[kind]} webhook is already registered; delete it first`);
      }
      const url = String(rawUrl).trim();
      const hook = ctx.webhooks.register(account.id, kind, url, headers);
      return { status: 201, body: { url, headers, registeredAt: istanbulTimestamp(hook.registeredMs) } };
    });
    ctx.routes.add("DELETE", path, (req) => {
      const g = gate(req, false);
      if ("status" in g) return g;
      if (!ctx.webhooks.unregister(g.account.id, kind)) {
        return smsError(404, "NOT_FOUND", `no ${names[kind]} webhook is registered`);
      }
      return { status: 204 };
    });
  }
}

// packages/sms-mock/src/sms/balance-routes.mjs
var BALANCE_PATH = "/sms/v3/balance";
var BALANCE_SERVICES = ["sms", "otp", "ses", "fax", "whatsapp", "santral", "netsipp", "gsm", "internet", "numara", "ai", "ucret"];
var CREDIT_NAME = "Kredi Bakiye";
var CACHE_MS = 1e4;
var RATE_LIMIT2 = 60;
var MINUTE_MS5 = 6e4;
var formatCredit = (tl) => tl.toFixed(3).replace(".", ",");
function parseStip(raw) {
  const m = /^\s*([123])\s*$/.exec(raw ?? "");
  return m ? Number(m[1]) : 1;
}
var amountOf = (amounts) => amounts.length === 1 ? String(amounts[0]) : amounts.reduce((a, b) => a + b, 0);
function assetList(balance, service) {
  return balance.assets.filter((a) => service === null ? a.sendService : a.service === service).map((a) => ({ amount: amountOf(a.amounts), balance_name: a.name }));
}
function summary(balance) {
  if (balance.postpaid) return { code: "00", balance: "0" };
  if (balance.credit > 0) return { code: "00", balance: formatCredit(balance.credit) };
  const sms = balance.assets.filter((a) => a.name === "Adet SMS").flatMap((a) => a.amounts).reduce((a, b) => a + b, 0);
  if (sms > 0) return { code: "00", balance: String(sms), type: "AdetSMS" };
  return { code: "00" };
}
function registerBalanceRoutes(ctx) {
  const limiter = createFixedWindowLimiter({
    limit: RATE_LIMIT2,
    windowMs: MINUTE_MS5,
    countRejected: true,
    clock: ctx.clock,
    rateScale: ctx.opts.rateScale,
    registry: ctx.resettables
  });
  const cache = /* @__PURE__ */ new Map();
  ctx.resettables.push({ reset: () => cache.clear() });
  ctx.routes.add("GET", BALANCE_PATH, (req) => {
    const auth = authenticate(req, ctx);
    if ("status" in auth) return auth;
    const { account } = auth;
    const hit = limiter.hit(account.id);
    if (!hit.allowed) {
      return smsError(429, "RATE_LIMITED", "balance rate limit exceeded", {}, { "Retry-After": String(hit.retryAfterSec) });
    }
    const stip = parseStip(req.query.get("stip"));
    const rawService = req.query.get("service");
    const service = rawService === null || rawService.trim() === "" ? null : rawService.trim().toLowerCase();
    if (service !== null && !BALANCE_SERVICES.includes(service)) {
      return smsError(400, "INVALID_REQUEST", `service must be one of ${BALANCE_SERVICES.join(", ")}`);
    }
    const now = ctx.clock.now();
    const key = `${account.id}|${stip}|${service ?? ""}`;
    const cached = cache.get(key);
    if (cached && now - cached.at < CACHE_MS) return { status: 200, body: structuredClone(cached.body) };
    const { balance } = account;
    let body;
    if (stip === 2) {
      body = summary(balance);
    } else {
      const list = assetList(balance, service);
      if (stip === 3) list.push({ amount: formatCredit(balance.credit), balance_name: CREDIT_NAME });
      body = { balance: list };
    }
    cache.set(key, { at: now, body: structuredClone(body) });
    return { status: 200, body };
  });
}

// packages/sms-mock/src/webhooks.mjs
import { randomUUID as randomUUID2 } from "node:crypto";
var TZ_MS3 = 3 * 36e5;
var REPORT_TIMEOUT_MS = 6e5;
var INBOX_TIMEOUT_MS = 4e3;
var REPORT_BATCH = 500;
var REPORT_CONCURRENCY = 2;
function webhookTime(ms) {
  return new Date(ms + TZ_MS3).toISOString().slice(0, 19).replace("T", " ");
}
var WEBHOOK_STATUS = { DELIVERED: 1, NOT_DELIVERED: 2 };
var WEBHOOK_FAIL_STATUS = {
  INVALID_NUMBER: 3,
  NOT_SENT_TO_OPERATOR: 4,
  OPERATOR_REJECTED: 8,
  OPERATOR_ERROR: 11,
  SEND_ERROR: 12,
  DUPLICATE: 13,
  INSUFFICIENT_CREDIT: 14,
  BLACKLISTED: 15,
  IYS_REJECTED: 16,
  IYS_ERROR: 17,
  MESSAGE_NOT_CREATED: 18,
  INVALID_NUMBER_FORMAT: 19,
  NTS_NOT_APPROVED: 20,
  NO_INTERNATIONAL_PERMISSION: 22
};
var WEBHOOK_ERROR_CODE = {
  TIMEOUT: 111,
  SMS_DISABLED_ON_DEVICE: 112,
  DEVICE_NOT_SUPPORTED: 113,
  ROUTING_FAILED: 114,
  OPERATOR_TIMEOUT: 115,
  UNKNOWN_SUBSCRIBER: 116,
  ILLEGAL_SUBSCRIBER: 117,
  SYSTEM_ERROR: 119
};
var WEBHOOK_OPERATOR = {
  VODAFONE: 10,
  TURK_TELEKOM: 20,
  TURKCELL: 30,
  NETGSM: 40,
  AKONTEL: 45,
  INTERNATIONAL: 210,
  UNKNOWN: 0
};
function webhookCodes({ status, failReason }) {
  if (status === "DELIVERED") return { status: WEBHOOK_STATUS.DELIVERED, errorCode: 0 };
  if (failReason !== null && failReason in WEBHOOK_FAIL_STATUS) return { status: WEBHOOK_FAIL_STATUS[failReason], errorCode: 0 };
  return { status: WEBHOOK_STATUS.NOT_DELIVERED, errorCode: WEBHOOK_ERROR_CODE[failReason] ?? 0 };
}
function headerPair(line) {
  if (!line) return null;
  const i = line.indexOf(":");
  return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
}
function createWebhookDispatcher({ fetchImpl, clock, log = () => {
}, jobs, accounts }) {
  const hooks = { report: /* @__PURE__ */ new Map(), inbox: /* @__PURE__ */ new Map() };
  const sent = /* @__PURE__ */ new Set();
  const reported = /* @__PURE__ */ new Set();
  let active = 0;
  const waiting = [];
  async function limited3(task) {
    if (active >= REPORT_CONCURRENCY) await new Promise((resolve2) => waiting.push(resolve2));
    else active++;
    try {
      return await task();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active--;
    }
  }
  async function post(hook, body, timeoutMs, extraHeaders = {}) {
    const doFetch = fetchImpl ?? globalThis.fetch;
    const headers = { "Content-Type": "application/json", ...extraHeaders };
    const pair = headerPair(hook.headers);
    if (pair && !Object.keys(headers).some((k) => k.toLowerCase() === pair[0].toLowerCase())) headers[pair[0]] = pair[1];
    try {
      const res = await doFetch(hook.url, {
        // Yönlendirme izlenmez: kayıtlı adres başka bir (ör. iç ağdaki) adrese yönlendiremez.
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "manual"
      });
      if (!res || res.status < 200 || res.status > 299) log(`webhook delivery failed: ${hook.url} -> ${res?.status}`);
    } catch (err) {
      log(`webhook delivery failed: ${hook.url} -> ${err?.message ?? err}`);
    }
  }
  return {
    register(accountId, kind, url, headers = null) {
      const hook = { url, headers: headers || null, registeredMs: clock.now() };
      hooks[kind].set(accountId, hook);
      return hook;
    },
    unregister(accountId, kind) {
      return hooks[kind].delete(accountId);
    },
    has(accountId, kind) {
      return hooks[kind].has(accountId);
    },
    /** Gelen SMS'i anında, tek istekle iletir. Senkron başlar; sonucu beklemek isteğe bağlıdır. */
    onInbound(accountId, msg) {
      const hook = hooks.inbox.get(accountId);
      if (!hook) return Promise.resolve();
      const digits = String(msg.from).replace(/\D/g, "");
      const body = {
        messageId: String(msg.id ?? ""),
        messageDateTime: webhookTime(msg.receivedAt ?? clock.now()),
        sourceNumber: digits.slice(-10),
        content: String(msg.text ?? ""),
        subscriberNumber: String(accounts?.get(accountId)?.username ?? accountId)
      };
      return post(hook, body, INBOX_TIMEOUT_MS, { "X-Correlation-Id": randomUUID2() });
    },
    /**
     * Nihai duruma geçen ve henüz gönderilmemiş iletimleri hesap başına gruplayıp en fazla 500 kayıtlık
     * isteklerle gönderir; istekler sınırlı eşzamanlılıkla (en fazla 2) çalışır. Her kayıt bir kez
     * gönderilir. Bütün kayıtları gönderilen görev "tamamı raporlandı" olarak işaretlenir, kayıt
     * anahtarları bırakılır ve sonraki tick'lerde atlanır.
     */
    async tick() {
      if (!jobs) return;
      const now = clock.now();
      const pending = [];
      for (const [accountId, hook] of hooks.report) {
        const numbers = [];
        for (const job of jobs.all(accountId)) {
          const jobKey = `${accountId}:${job.jobId}`;
          if (reported.has(jobKey) || !isReportable(job)) continue;
          let allSent = true;
          job.records.forEach((record, i) => {
            const d = deliveryOf(job, record, now);
            if (d.status === "PENDING") {
              allSent = false;
              return;
            }
            const key = `${jobKey}:${record.index ?? i}`;
            if (sent.has(key)) return;
            sent.add(key);
            const recipient = String(record.recipient);
            const { status, errorCode } = webhookCodes(d);
            numbers.push({
              jobid: job.jobId,
              number: recipient.startsWith("-") ? recipient.slice(1) : recipient.slice(2),
              status,
              operator: WEBHOOK_OPERATOR[operatorOf(recipient)] ?? 0,
              msglen: partsOf(job, record),
              deliveredDate: d.deliveredAt === null ? "" : webhookTime(d.deliveredAt),
              errorCode,
              referansID: job.referenceId ?? null
            });
          });
          if (allSent) {
            reported.add(jobKey);
            job.records.forEach((record, i) => sent.delete(`${jobKey}:${record.index ?? i}`));
          }
        }
        for (let i = 0; i < numbers.length; i += REPORT_BATCH) {
          const batch = numbers.slice(i, i + REPORT_BATCH);
          pending.push(limited3(() => post(hook, { numbers: batch }, REPORT_TIMEOUT_MS)));
        }
      }
      await Promise.all(pending);
    },
    /** Test ve teşhis için iç sayaçlar. */
    stats() {
      return { sentKeys: sent.size, reportedJobs: reported.size, inFlight: active };
    }
  };
}

// packages/sms-mock/src/identity/sessions.mjs
import { randomBytes as randomBytes2, randomUUID as randomUUID3 } from "node:crypto";
var b64u = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");
function makeAccessToken(login, scope, iatSec, expSec) {
  return `${b64u({ alg: "none", typ: "JWT" })}.${b64u({ sub: login.accountId, scope, iat: iatSec, exp: expSec })}.${randomBytes2(16).toString("base64url")}`;
}
function createSessionStore({ clock, tokenTtlSec: tokenTtlSec2 }) {
  const byAccess = /* @__PURE__ */ new Map();
  const byRefresh = /* @__PURE__ */ new Map();
  const recs = [];
  const lastLoginSeq = /* @__PURE__ */ new Map();
  let seq = 0;
  function issue(rec) {
    const nowMs = clock.now();
    if (rec.accessToken) byAccess.set(rec.accessToken, { rec, stale: true });
    rec.accessToken = makeAccessToken(rec.login, rec.scope, Math.floor(nowMs / 1e3), Math.floor(nowMs / 1e3) + tokenTtlSec2);
    rec.expiresAt = nowMs + tokenTtlSec2 * 1e3;
    byAccess.set(rec.accessToken, { rec, stale: false });
    return view(rec);
  }
  const view = (rec) => ({ accessToken: rec.accessToken, refreshToken: rec.refreshToken, scope: rec.scope, expiresIn: tokenTtlSec2, login: rec.login });
  return {
    /** @returns {Session} */
    open(login, scope) {
      const mySeq = ++seq;
      let otherLatest = 0;
      for (const [key, v] of lastLoginSeq) {
        const [accountId, identity] = key.split("|");
        if (accountId === login.accountId && identity !== login.identity) otherLatest = Math.max(otherLatest, v);
      }
      for (const r of recs) {
        if (r.login.accountId === login.accountId && r.login.identity === login.identity && r.status === "active" && r.seq < otherLatest) {
          r.status = "superseded";
        }
      }
      lastLoginSeq.set(`${login.accountId}|${login.identity}`, mySeq);
      const rec = { login, scope, seq: mySeq, status: "active", refreshToken: randomUUID3(), accessToken: null, expiresAt: 0 };
      recs.push(rec);
      byRefresh.set(rec.refreshToken, rec);
      return issue(rec);
    },
    /** @returns {Session | null} */
    refresh(refreshToken) {
      const rec = byRefresh.get(refreshToken);
      if (!rec || rec.status !== "active") return null;
      return issue(rec);
    },
    revoke(accessToken) {
      const hit = byAccess.get(accessToken);
      if (!hit || hit.stale || hit.rec.status !== "active") return false;
      hit.rec.status = "revoked";
      return true;
    },
    /** @returns {{ session: Session, login: object } | { error: 'invalid' | 'expired' | 'revoked' | 'superseded' }} */
    resolve(accessToken) {
      const hit = byAccess.get(accessToken);
      if (!hit) return { error: "invalid" };
      const { rec } = hit;
      if (rec.status === "revoked") return { error: "revoked" };
      if (rec.status === "superseded" || hit.stale) return { error: "superseded" };
      if (clock.now() >= rec.expiresAt) return { error: "expired" };
      return { session: view(rec), login: rec.login };
    }
  };
}

// packages/sms-mock/src/accounts.mjs
var DEFAULTS = {
  apiAccess: true,
  ipAllowed: true,
  countryAllowed: true,
  active: true,
  activations: { send: true, receive: true, other: true },
  operatorOk: true,
  international: true,
  iysMode: true,
  duplicatesAllowed: false,
  otpCredit: true,
  // Kurumsal OTP hizmeti tanımlı hesap: POST /send/otp'ta `x-client: enterprise` göndermelidir.
  enterpriseOtp: false,
  balance: "prepaid"
};
var main = (password) => [{ password, subUserId: 0 }];
var BALANCES = {
  // Spec'teki stip=3 örneğiyle aynı: faturasız, kredi var.
  prepaid: () => ({
    postpaid: false,
    credit: 92.15,
    assets: [
      { name: "Adet SMS", service: "sms", sendService: true, amounts: [200, 77] },
      { name: "Adet OTP SMS", service: "otp", sendService: true, amounts: [767] },
      { name: "Dakika", service: "ses", sendService: true, amounts: [242] }
    ]
  }),
  // Faturasız, kredi yok, SMS paketi var: stip=2 `type: AdetSMS` döner.
  smsOnly: () => ({
    postpaid: false,
    credit: 0,
    assets: [{ name: "Adet SMS", service: "sms", sendService: true, amounts: [1500] }]
  }),
  // Faturalı: stip=2 her zaman "0".
  postpaid: () => ({
    postpaid: true,
    credit: 0,
    assets: [{ name: "Adet OTP SMS", service: "otp", sendService: true, amounts: [5e3] }]
  }),
  // Faturasız, ne kredi ne paket: stip=2 yalnızca `code` döner, liste boştur.
  empty: () => ({ postpaid: false, credit: 0, assets: [] })
};
var SEED_ACCOUNTS = [
  // --- Identity sandbox ile aynı hesaplar ---
  { username: "8500000000", userId: 900001, firstName: "Demo", lastName: "Aktif", credentials: main("password001") },
  {
    username: "8500000001",
    userId: 900002,
    firstName: "Demo",
    lastName: "Aktivasyonsuz",
    credentials: main("password002"),
    activations: { send: false, receive: false, other: false }
  },
  { username: "8500000002", userId: 900003, firstName: "Demo", lastName: "IP", credentials: main("password003"), ipAllowed: false },
  {
    username: "8500000003",
    userId: 900004,
    firstName: "Demo",
    lastName: "Ana Hesap",
    credentials: [{ password: "password004", subUserId: 4001, subFirstName: "Demo", subLastName: "Alt Kullanıcı", servicePermission: false }]
  },
  { username: "8500000004", userId: 900005, firstName: "Demo", lastName: "API", credentials: main("password005"), apiAccess: false },
  { username: "8500000005", userId: 900006, firstName: "Demo", lastName: "Pasif", credentials: main("password006"), active: false },
  // --- Yalnızca mock ---
  { username: "8500000006", userId: 900007, firstName: "Mock", lastName: "Operatör", credentials: main("password007"), operatorOk: false },
  { username: "8500000007", userId: 900008, firstName: "Mock", lastName: "Ülke", credentials: main("password008"), countryAllowed: false },
  {
    username: "8500000008",
    userId: 900009,
    firstName: "Mock",
    lastName: "İYS",
    credentials: main("password009"),
    international: false,
    iysMode: false,
    otpCredit: false,
    balance: "smsOnly"
  },
  { username: "8500000009", userId: 900010, firstName: "Mock", lastName: "Ana Hesap", credentials: [
    { password: "password010", subUserId: 0 },
    { password: "password011", subUserId: 1, subFirstName: "API", subLastName: "Kullanıcı", servicePermission: true }
  ], balance: "empty" },
  {
    username: "8500000010",
    userId: 900011,
    firstName: "Demo",
    lastName: "Kurumsal OTP",
    credentials: main("password012"),
    enterpriseOtp: true,
    balance: "postpaid"
  }
];
function buildAccount(seed) {
  const s = { ...DEFAULTS, ...seed };
  const sender = (name, type, usable, reason, brandCode = 0) => ({ name, type, brandCode, usable, reason });
  return {
    id: s.username,
    userId: s.userId,
    username: s.username,
    subscriberCode: s.username,
    firstName: s.firstName,
    lastName: s.lastName,
    email: `${s.username}@sandbox.example.com`,
    apiAccess: s.apiAccess,
    ipAllowed: s.ipAllowed,
    countryAllowed: s.countryAllowed,
    active: s.active,
    activations: { ...s.activations },
    operatorOk: s.operatorOk,
    international: s.international,
    iysMode: s.iysMode,
    duplicatesAllowed: s.duplicatesAllowed,
    otpCredit: s.otpCredit,
    enterpriseOtp: s.enterpriseOtp,
    balance: BALANCES[s.balance](),
    // TESTHEADER: SMS sandbox'ının sabit başlığı; sandbox'a geçen kod başlık değiştirmeden çalışsın diye.
    senders: [
      sender("MOCKTEST", "ALPHANUMERIC", true, null, s.iysMode ? 4567 : 0),
      sender("TESTHEADER", "ALPHANUMERIC", true, null, s.iysMode ? 4567 : 0),
      sender("MOCKKAPALI", "ALPHANUMERIC", false, "ROUTING_CODE_MISSING"),
      sender(s.username, "SUBSCRIBER_NUMBER", true, null)
    ],
    defaultSender: "MOCKTEST",
    // SMS sandbox'ının kara listesi. Liste en yeniden eskiye döner: GET /blacklist 5000000001, 5000000002.
    blacklist: ["5000000002", "5000000001"],
    templates: [
      // SMS sandbox'ının tek şablonu (aynı kimlik, içerik ve parametreler)
      {
        templateId: 1,
        content: "Merhaba ${name}, kodunuz ${code}",
        type: "AUTH_OTP",
        description: "Sandbox template",
        public: true,
        parameters: [{ name: "name", type: "TEXT", maxLength: 50 }, { name: "code", type: "TEXT", maxLength: 10 }],
        createdAt: "2026-01-01T12:00:00+03:00"
      },
      {
        templateId: 3,
        content: "Dogrulama kodunuz: ${otpCode}",
        type: "AUTH_OTP",
        description: "Doğrulama kodu",
        public: false,
        parameters: [{ name: "otpCode", type: "BIGINT", maxLength: null }],
        createdAt: "2026-05-18T11:25:12.502+03:00"
      },
      {
        templateId: 4,
        content: "Siparisiniz kargoya verildi.",
        type: "SERVICE_ALERT",
        description: "Kargo bilgilendirme",
        public: true,
        parameters: [],
        createdAt: "2026-03-02T09:00:00.000+03:00"
      },
      {
        templateId: 5,
        content: "Randevunuz ${date} tarihinde. Not: ${note}",
        type: "SERVICE_ALERT",
        description: "Randevu hatırlatma",
        public: false,
        parameters: [{ name: "date", type: "DATE", maxLength: null }, { name: "note", type: "TEXT", maxLength: 30 }],
        createdAt: "2026-01-10T09:00:00.000+03:00"
      }
    ],
    // rehber: hesap başına tek grup
    directory: {
      groups: [{
        groupId: 7,
        name: "Müşteriler",
        contacts: [
          { number: "905061230001", name: "Ali", surname: "Veli", address: "Sayın" },
          { number: "905061230002", name: "Ayşe", surname: "Yılmaz", address: "Sayın" },
          { number: "905061230003", name: "Can", surname: "Demir", address: "Sayın" }
        ]
      }]
    }
  };
}
function createAccountStore(seed = SEED_ACCOUNTS) {
  const accounts = /* @__PURE__ */ new Map();
  const credentials = /* @__PURE__ */ new Map();
  for (const item of seed) {
    const acc = buildAccount(item);
    accounts.set(acc.id, acc);
    credentials.set(acc.id, item.credentials ?? []);
  }
  return {
    /** @returns {Login | null} */
    login(username, password) {
      const acc = accounts.get(username);
      const c = acc && credentials.get(acc.id).find((x) => x.password === password);
      if (!c) return null;
      if (c.subUserId === 0) return { accountId: acc.id, identity: "main", subUserId: 0, subUser: null, smsPermission: true };
      return {
        accountId: acc.id,
        identity: `sub:${c.subUserId}`,
        subUserId: c.subUserId,
        subUser: { id: c.subUserId, first_name: c.subFirstName, last_name: c.subLastName },
        smsPermission: c.servicePermission
      };
    },
    get(accountId) {
      return accounts.get(accountId);
    }
  };
}

// packages/sms-mock/src/server.mjs
var SMS_ERRORS = {
  not_found: [404, "NOT_FOUND"],
  method_not_allowed: [405, "INVALID_REQUEST"],
  payload_too_large: [413, "INVALID_REQUEST"],
  invalid_request: [400, "INVALID_REQUEST"],
  unsupported: [415, "INVALID_REQUEST"],
  internal: [500, "INTERNAL_ERROR"]
};
var PLAIN_STATUS = { not_found: 404, method_not_allowed: 405, payload_too_large: 413, invalid_request: 400, unsupported: 415, internal: 500 };
function isLoopbackHost(host) {
  const h = String(host).toLowerCase().replace(/^\[|\]$/g, "");
  return h === "localhost" || h === "::1" || /^127\.\d+\.\d+\.\d+$/.test(h) || h === "::ffff:127.0.0.1";
}
var urlHost = (host) => String(host).includes(":") && !String(host).startsWith("[") ? `[${host}]` : String(host);
function frameworkError(env, kind, message) {
  if (env === "sms") {
    const [status, code] = SMS_ERRORS[kind];
    return smsError(status, code, message);
  }
  if (env === "auth") {
    return problem(kind === "unsupported" ? "invalid_request" : kind === "internal" ? "internal_error" : kind);
  }
  return { status: PLAIN_STATUS[kind], body: { error: message } };
}
function createMockServer(options = {}) {
  const {
    port: port2 = 4010,
    host = "127.0.0.1",
    clock = createClock(),
    tokenTtlSec: tokenTtlSec2 = 86400,
    rateScale: rateScale2 = 1,
    bodyLimits = {},
    quiet = false,
    log = (line) => console.log(line),
    fetchImpl = globalThis.fetch
  } = options;
  const ctx = {
    routes: createRoutes(),
    clock,
    // Gerçek API loopback webhook adresini reddeder; mock yalnızca yerelde dinlerken buna izin verir.
    opts: { tokenTtlSec: tokenTtlSec2, rateScale: rateScale2, fetchImpl, allowLoopbackWebhooks: isLoopbackHost(host) },
    log,
    // reset() çağrılan sayaçlar ve işaretleyiciler (sınırlayıcılar, başarısız giriş sayaçları, ...).
    // Route modülleri kendi durumlarını kayıt sırasında buraya ekler.
    resettables: []
  };
  function initState() {
    ctx.accounts = createAccountStore(SEED_ACCOUNTS);
    ctx.sessions = createSessionStore({ clock, tokenTtlSec: tokenTtlSec2 });
    ctx.jobs = createJobStore({ clock });
    ctx.inbox = createInboxStore({ clock });
    ctx.webhooks = createWebhookDispatcher({ fetchImpl, clock, log, jobs: ctx.jobs, accounts: ctx.accounts });
    ctx.inbox.onAdd((accountId, message) => {
      ctx.webhooks.onInbound(accountId, message);
    });
    ctx.scenarios = createScenarioQueue();
    ctx.advisor = createAdvisor({ clock });
  }
  initState();
  function resetAll() {
    initState();
    for (const r of ctx.resettables) r.reset();
    clock.reset?.();
  }
  registerIdentityRoutes(ctx);
  registerLengthRoutes(ctx);
  registerSendRoutes(ctx);
  registerSendFamilyRoutes(ctx);
  registerJobsRoutes(ctx);
  registerAccountRoutes(ctx);
  registerWebhookRoutes(ctx);
  registerBalanceRoutes(ctx);
  registerControlRoutes();
  function registerControlRoutes() {
    const bad = (message) => ({ status: 400, body: { error: message } });
    ctx.routes.add("POST", "/__mock/scenario", (req) => {
      const invalid5 = validateScenario(req.json);
      if (invalid5) return bad(invalid5);
      ctx.scenarios.push(req.json);
      return { status: 201, body: ctx.scenarios.list().at(-1) };
    });
    ctx.routes.add("GET", "/__mock/scenario", () => ({ status: 200, body: { scenarios: ctx.scenarios.list() } }));
    ctx.routes.add("DELETE", "/__mock/scenario", () => {
      ctx.scenarios.clear();
      return { status: 204 };
    });
    ctx.routes.add("GET", "/__mock/advice", () => ({ status: 200, body: { findings: ctx.advisor.findings() } }));
    ctx.routes.add("POST", "/__mock/reset", () => {
      resetAll();
      return { status: 200, body: { reset: true } };
    });
    ctx.routes.add("POST", "/__mock/clock", (req) => {
      const s = req.json?.advanceSeconds;
      if (typeof s !== "number" || !Number.isFinite(s) || s <= 0) return bad("advanceSeconds must be a positive number");
      clock.advance(s * 1e3);
      return { status: 200, body: { now: new Date(clock.now()).toISOString() } };
    });
  }
  function applyScenario(env, parsed) {
    if (env === "sms") {
      const auth = authenticate(parsed, ctx);
      if ("status" in auth) return null;
    } else if (env !== "auth") return null;
    const next = ctx.scenarios.peek(parsed.path);
    if (!next) return null;
    if (next.code === "QUEUE_UNCONFIRMED" && JOB_CREATING_PATHS.has(parsed.path)) {
      parsed.queueUnconfirmed = true;
      return null;
    }
    const scenario = ctx.scenarios.take(parsed.path);
    return scenarioResponse(scenario, parsed.path, ctx);
  }
  const PREFIX = "[netgsm-sms-mock]";
  function observeExchange(meta, status, out) {
    try {
      const { method, path, requestId, parsed } = meta;
      if (path.startsWith("/__mock/") || path.startsWith("/health")) return;
      const body = out?.body && typeof out.body === "object" ? out.body : null;
      const code = body && typeof body.code === "string" ? body.code : null;
      const json = parsed?.json && typeof parsed.json === "object" ? parsed.json : null;
      const arr = json ? Array.isArray(json.messages) ? json.messages : Array.isArray(json.templates) ? json.templates : null : null;
      const messageCount = arr ? arr.length : path === SEND_OTP && json ? 1 : null;
      const username = path === "/auth/v3/token" && typeof json?.username === "string" ? json.username : null;
      const raw = parsed?.rawBody;
      const retryHeader = Object.entries(out?.headers || {}).find(([k]) => k.toLowerCase() === "retry-after")?.[1];
      const retryAfterSec = retryHeader !== void 0 && Number.isFinite(Number(retryHeader)) ? Number(retryHeader) : null;
      const hasRetryAfter = retryHeader !== void 0;
      const findings = ctx.advisor.observe({
        method,
        path,
        status,
        code,
        accountId: parsed?.accountId ?? null,
        username,
        ip: parsed?.ip ?? "",
        bodyHash: raw && raw.length > 0 ? createHash("sha256").update(raw).digest("hex") : null,
        messageCount,
        tokenState: parsed?.tokenState ?? "none",
        requestId,
        at: clock.now(),
        retryAfterSec,
        query: parsed?.query ? parsed.query.toString() : null,
        perJob: status === 429 && typeof body?.message === "string" && body.message.includes("queried too recently"),
        mayHaveBeenQueued: parsed?.mayHaveBeenQueued === true
      });
      if (status >= 400) {
        const errCode = code ?? (status === 404 ? "not_found" : status === 406 ? "not_acceptable" : String(status));
        log(`${PREFIX} ✘ ${status} ${method} ${path} ${errCode} — ${explain(errCode, { path, hasRetryAfter })} (requestId ${requestId})`);
      } else if (!quiet) {
        const counts = status === 202 && body && typeof body.accepted === "number" ? ` — ${body.accepted} kabul, ${body.rejected ?? 0} red` : "";
        log(`${PREFIX} ✔ ${status} ${method} ${path}${counts} (requestId ${requestId})`);
      }
      for (const f of findings) log(`${PREFIX} ⚠ ${f.message}`);
    } catch (err) {
      try {
        log(`${PREFIX} advisor error: ${err?.message ?? err}`);
      } catch {
      }
    }
  }
  function write(res, env, path, requestId, out) {
    const headers = { ...out.headers || {} };
    let payload;
    if (out.body !== void 0) {
      let body = out.body;
      if (env === "sms" && body && typeof body === "object" && "requestId" in body) {
        body = { ...body, requestId: body.requestId ?? requestId, timestamp: body.timestamp ?? istanbulTimestamp(clock.now()) };
      } else if (env === "auth" && body && typeof body === "object" && "request_id" in body) {
        body = { ...body, request_id: body.request_id ?? requestId, instance: body.instance ?? path };
      }
      payload = JSON.stringify(body);
      if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) headers["Content-Type"] = "application/json";
    }
    if (env !== "plain") headers["X-Request-Id"] = requestId;
    if (env === "auth") {
      headers["Cache-Control"] = "no-store";
      headers.Pragma = "no-cache";
    }
    res.writeHead(out.status, headers);
    res.end(payload);
  }
  async function handle(req, res) {
    const method = String(req.method).toUpperCase();
    let url;
    try {
      if (!req.url.startsWith("/") || req.url.startsWith("//")) throw new Error("bad target");
      url = new URL(req.url, "http://mock.local");
    } catch {
      req.resume();
      return write(res, "plain", "/", "", frameworkError("plain", "invalid_request", "malformed request target"));
    }
    const path = url.pathname;
    const env = envelopeFor(path);
    const requestId = env === "auth" ? identityRequestId() : smsRequestId();
    const meta = { method, path, requestId, parsed: null };
    const send = (out) => {
      write(res, env, path, requestId, out);
      observeExchange(meta, out.status, out);
    };
    try {
      const { handler, allow } = ctx.routes.match(method, path);
      if (!handler && allow.length === 0) return send(frameworkError(env, "not_found", env === "sms" ? "no such endpoint" : "not found"));
      if (!handler) {
        const out = frameworkError(env, "method_not_allowed", "method not allowed");
        return send({ ...out, headers: { ...out.headers, Allow: allow.join(", ") } });
      }
      if (!acceptsJson(req.headers.accept)) {
        res.writeHead(406, env !== "plain" ? { "X-Request-Id": requestId } : {});
        res.end();
        return observeExchange(meta, 406, { status: 406 });
      }
      const parsed = {
        method,
        path,
        query: url.searchParams,
        headers: req.headers,
        ip: req.socket.remoteAddress || "",
        rawBody: Buffer.alloc(0),
        json: void 0,
        requestId
      };
      meta.parsed = parsed;
      if (["POST", "PUT", "PATCH"].includes(method)) {
        const encoding = String(req.headers["content-encoding"] || "").trim().toLowerCase();
        if (encoding && encoding !== "identity") {
          return send(frameworkError(env, "unsupported", "compressed request bodies are not supported"));
        }
        let raw;
        try {
          raw = await readBody(req, env === "auth" ? bodyLimits.auth ?? AUTH_BODY_LIMIT : bodyLimits.sms ?? SMS_BODY_LIMIT);
        } catch (e) {
          if (!(e instanceof BodyTooLarge)) throw e;
          req.resume();
          return send(frameworkError(env, "payload_too_large", "request body too large"));
        }
        parsed.rawBody = raw;
        const ctype = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
        const isJson = ctype === "application/json" || ctype.endsWith("+json");
        const isForm = env === "auth" && ctype === "application/x-www-form-urlencoded";
        const control = path.startsWith("/__mock/");
        if (control && !isJson || raw.length > 0 && !isJson && !isForm) {
          return send(frameworkError(env, "unsupported", "content type must be application/json"));
        }
        if (control && raw.length === 0) parsed.json = {};
        if (isForm) {
          parsed.json = Object.fromEntries(new URLSearchParams(raw.toString("utf8")));
        } else if (isJson && !(control && raw.length === 0)) {
          const unreadable = env === "sms" ? UNREADABLE_BODY : null;
          if (raw.length === 0) return send(frameworkError(env, "invalid_request", unreadable ?? "request body is empty"));
          try {
            parsed.json = JSON.parse(raw.toString("utf8"));
          } catch {
            return send(frameworkError(env, "invalid_request", unreadable ?? "malformed JSON"));
          }
          if (env === "sms" && (parsed.json === null || typeof parsed.json !== "object" || Array.isArray(parsed.json))) {
            return send(frameworkError(env, "invalid_request", unreadable));
          }
        }
      } else {
        req.resume();
      }
      const injected = applyScenario(env, parsed);
      send(injected ?? await handler(parsed, ctx));
    } catch (err) {
      log(`internal error: ${err && err.stack || err}`);
      if (res.headersSent) return res.destroy();
      send(frameworkError(env, "internal", "internal error"));
    }
  }
  const server2 = http.createServer((req, res) => {
    handle(req, res).catch((err) => {
      try {
        log(`unhandled error: ${err && err.stack || err}`);
      } catch {
      }
      res.destroy();
    });
  });
  let timer;
  return {
    ctx,
    listen() {
      return new Promise((resolve2, reject) => {
        server2.once("error", reject);
        server2.listen(port2, host, () => {
          server2.off("error", reject);
          clearInterval(timer);
          timer = setInterval(() => {
            ctx.webhooks.tick().catch((err) => log(`webhook tick failed: ${err?.message ?? err}`));
          }, 1e3);
          timer.unref();
          if (!ctx.opts.allowLoopbackWebhooks) {
            log(`${PREFIX} Uyarı: mock ${host} adresinde dinliyor; ağdaki diğer makineler de erişebilir. Kontrol uçlarında (/__mock/*) kimlik doğrulaması yoktur, yalnızca güvendiğiniz bir ağda kullanın. Bu modda loopback webhook adresleri (localhost, 127.0.0.1, ::1) gerçek API'deki gibi reddedilir.`);
          }
          resolve2(`http://${urlHost(host)}:${server2.address().port}`);
        });
      });
    },
    close() {
      clearInterval(timer);
      return new Promise((resolve2) => {
        server2.close(() => resolve2());
        server2.closeAllConnections?.();
      });
    }
  };
}

// packages/sms-mock/src/cli.mjs
var HELP = `Netgsm SMS API v3 yerel mock'u

Kullanım: node netgsm-sms-mock.mjs [seçenekler]

Seçenekler:
  --port <n>          Dinlenecek port (varsayılan 4010)
  --host <h>          Dinlenecek adres (varsayılan 127.0.0.1). Loopback dışı bir adreste uyarı
                      yazılır ve loopback webhook adresleri gerçek API'deki gibi reddedilir.
  --token-ttl <sn>    Token ömrü, saniye (varsayılan 86400)
  --rate-scale <oran> Hız sınırı çarpanı (varsayılan 1; 10 = sınırlar on kat gevşek)
  --quiet             Başarılı istekleri yazma; yalnızca hata (✘) ve bulguları (⚠) göster
  --help              Bu yardımı göster
`;
var OPTIONS = {
  port: { type: "string", default: "4010" },
  host: { type: "string", default: "127.0.0.1" },
  "token-ttl": { type: "string", default: "86400" },
  "rate-scale": { type: "string", default: "1" },
  quiet: { type: "boolean", default: false },
  help: { type: "boolean", default: false }
};
function fail(message) {
  console.error(`Hata: ${message}

${HELP}`);
  process.exit(1);
}
var bannerFor = (base2) => `
Netgsm SMS API v3 mock'u çalışıyor

  Identity base URL : ${base2}/auth/v3
  SMS base URL      : ${base2}/sms/v3

Test hesapları (8500000000–8500000005 Identity sandbox'ının demo hesaplarıyla aynıdır)

  username     şifre         ne gösterir
  8500000000   password001   Her şey açık: gönderim, rapor, gelen kutusu, İYS modu
  8500000001   password002   Hizmet aktivasyonu yok: sms kapsamı 403 service_not_activated
  8500000002   password003   IP izni yok: 403 ip_not_allowed
  8500000003   password004   Hizmet yetkisi olmayan alt kullanıcı (4001): 403 sub_user_not_permitted
  8500000004   password005   API erişimi kapalı: 403 api_access_denied
  8500000005   password006   Hesap pasif: 403 account_inactive
  Yalnızca mock:
  8500000006   password007   Token alınır, /send 403 FORBIDDEN (operatör hizmeti yok)
  8500000007   password008   Ülke izni yok: 403 country_not_allowed
  8500000008   password009   İYS modu, yurt dışı gönderim izni ve OTP kredisi yok; bakiye: yalnızca SMS paketi
  8500000009   password010   Ana hesap; password011 aynı hesabın API alt kullanıcısı (1); bakiye boş
  8500000010   password012   Kurumsal OTP hesabı: /send/otp x-client: enterprise başlığı ister; faturalı

Başlıklar (sender): MOCKTEST ve TESTHEADER (SMS sandbox'ının başlığı) kullanılabilir, MOCKKAPALI
yönlendirme kodu eksik olduğu için reddedilir, abone numarası (username) her hesapta kullanılabilir.
Sandbox'la ortak sabit veri: şablon 1 (Merhaba \${name}, kodunuz \${code}), kara liste 5000000001, 5000000002.
Bakiye (GET /sms/v3/balance): diğer hesaplarda kredi 92,150 TL ve paketler; değerler sabittir.

Kontrol uçları (kimlik doğrulaması gerekmez; POST istekleri Content-Type: application/json ister):
  POST   ${base2}/__mock/scenario   Sıradaki isteğe hata enjekte eder
  GET    ${base2}/__mock/scenario   Kuyruktaki senaryoları listeler
  DELETE ${base2}/__mock/scenario   Senaryo kuyruğunu temizler
  GET    ${base2}/__mock/advice     Mock'un tespit ettiği entegrasyon bulguları
  POST   ${base2}/__mock/clock      Saati ileri alır ({"advanceSeconds": 60})
  POST   ${base2}/__mock/inbound    Gelen SMS ekler
  POST   ${base2}/__mock/reset      Bütün durumu başa döndürür

Mock gerçek başlık onayını, gerçek İYS izinlerini, gerçek bakiye tüketimini ve gerçek operatör iletimini taklit etmez.
Durdurmak için Ctrl+C.
`;
var values;
try {
  ({ values } = parseArgs({ options: OPTIONS, allowPositionals: false }));
} catch (err) {
  fail(err.message);
}
if (values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}
var num = (name, raw, { min, integer }) => {
  const n = Number(raw);
  if (raw.trim() === "" || !Number.isFinite(n) || n < min || integer && !Number.isInteger(n)) {
    fail(`--${name} için geçersiz değer: ${raw}`);
  }
  return n;
};
var port = num("port", values.port, { min: 0, integer: true });
if (port > 65535) fail(`--port için geçersiz değer: ${values.port}`);
var tokenTtlSec = num("token-ttl", values["token-ttl"], { min: 1, integer: true });
var rateScale = num("rate-scale", values["rate-scale"], { min: Number.MIN_VALUE });
var server = createMockServer({ port, host: values.host, tokenTtlSec, rateScale, quiet: values.quiet });
var base;
try {
  base = await server.listen();
} catch (err) {
  if (err?.code === "EADDRINUSE") {
    console.error(`Hata: ${values.host}:${port} portu kullanımda. Başka bir port seçmek için --port <n> kullanın (ör. --port 4011).`);
  } else if (err?.code === "EACCES") {
    console.error(`Hata: ${values.host}:${port} portunu dinleme izni yok. Başka bir port için --port <n> kullanın.`);
  } else {
    console.error(`Hata: mock başlatılamadı: ${err?.message ?? err}`);
  }
  process.exit(1);
}
process.stdout.write(bannerFor(base));
var closing = false;
var shutdown = async () => {
  if (closing) return;
  closing = true;
  await server.close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/*
 * Bu dosyaya gömülen üçüncü taraf paketler ve lisansları
 * Third-party packages bundled into this file and their licenses

ajv@8.20.0 (MIT)

The MIT License (MIT)

Copyright (c) 2015-2021 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----

ajv-formats@3.0.1 (MIT)

MIT License

Copyright (c) 2020 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----

fast-deep-equal@3.1.3 (MIT)

MIT License

Copyright (c) 2017 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----

fast-uri@3.1.9 (BSD-3-Clause)

Copyright (c) 2011-2021, Gary Court until https://github.com/garycourt/uri-js/commit/a1acf730b4bba3f1097c9f52e7d9d3aba8cdcaae
Copyright (c) 2021-present The Fastify team <https://github.com/fastify/fastify#team>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The names of any contributors may not be used to endorse or promote
      products derived from this software without specific prior written
      permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS AND CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

                                  *   *   *

The complete list of contributors can be found at:
- https://github.com/garycourt/uri-js/graphs/contributors

-----

json-schema-traverse@1.0.0 (MIT)

MIT License

Copyright (c) 2017 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
