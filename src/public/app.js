(() => {
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

  // node_modules/mithril/render/vnode.js
  var require_vnode = __commonJS({
    "node_modules/mithril/render/vnode.js"(exports, module) {
      "use strict";
      function Vnode(tag, key, attrs, children, text, dom) {
        return { tag, key, attrs, children, text, dom, domSize: void 0, state: void 0, events: void 0, instance: void 0 };
      }
      Vnode.normalize = function(node) {
        if (Array.isArray(node)) return Vnode("[", void 0, void 0, Vnode.normalizeChildren(node), void 0, void 0);
        if (node == null || typeof node === "boolean") return null;
        if (typeof node === "object") return node;
        return Vnode("#", void 0, void 0, String(node), void 0, void 0);
      };
      Vnode.normalizeChildren = function(input) {
        var children = [];
        if (input.length) {
          var isKeyed = input[0] != null && input[0].key != null;
          for (var i = 1; i < input.length; i++) {
            if ((input[i] != null && input[i].key != null) !== isKeyed) {
              throw new TypeError(
                isKeyed && (input[i] != null || typeof input[i] === "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys."
              );
            }
          }
          for (var i = 0; i < input.length; i++) {
            children[i] = Vnode.normalize(input[i]);
          }
        }
        return children;
      };
      module.exports = Vnode;
    }
  });

  // node_modules/mithril/render/hyperscriptVnode.js
  var require_hyperscriptVnode = __commonJS({
    "node_modules/mithril/render/hyperscriptVnode.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      module.exports = function() {
        var attrs = arguments[this], start = this + 1, children;
        if (attrs == null) {
          attrs = {};
        } else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
          attrs = {};
          start = this;
        }
        if (arguments.length === start + 1) {
          children = arguments[start];
          if (!Array.isArray(children)) children = [children];
        } else {
          children = [];
          while (start < arguments.length) children.push(arguments[start++]);
        }
        return Vnode("", attrs.key, attrs, children);
      };
    }
  });

  // node_modules/mithril/util/hasOwn.js
  var require_hasOwn = __commonJS({
    "node_modules/mithril/util/hasOwn.js"(exports, module) {
      "use strict";
      module.exports = {}.hasOwnProperty;
    }
  });

  // node_modules/mithril/render/hyperscript.js
  var require_hyperscript = __commonJS({
    "node_modules/mithril/render/hyperscript.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var hyperscriptVnode = require_hyperscriptVnode();
      var hasOwn = require_hasOwn();
      var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
      var selectorCache = /* @__PURE__ */ Object.create(null);
      function isEmpty(object) {
        for (var key in object) if (hasOwn.call(object, key)) return false;
        return true;
      }
      function compileSelector(selector) {
        var match, tag = "div", classes = [], attrs = {};
        while (match = selectorParser.exec(selector)) {
          var type = match[1], value = match[2];
          if (type === "" && value !== "") tag = value;
          else if (type === "#") attrs.id = value;
          else if (type === ".") classes.push(value);
          else if (match[3][0] === "[") {
            var attrValue = match[6];
            if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
            if (match[4] === "class") classes.push(attrValue);
            else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true;
          }
        }
        if (classes.length > 0) attrs.className = classes.join(" ");
        if (isEmpty(attrs)) attrs = null;
        return selectorCache[selector] = { tag, attrs };
      }
      function execSelector(state, vnode) {
        var attrs = vnode.attrs;
        var hasClass = hasOwn.call(attrs, "class");
        var className = hasClass ? attrs.class : attrs.className;
        vnode.tag = state.tag;
        if (state.attrs != null) {
          attrs = Object.assign({}, state.attrs, attrs);
          if (className != null || state.attrs.className != null) attrs.className = className != null ? state.attrs.className != null ? String(state.attrs.className) + " " + String(className) : className : state.attrs.className != null ? state.attrs.className : null;
        } else {
          if (className != null) attrs.className = className;
        }
        if (hasClass) attrs.class = null;
        if (state.tag === "input" && hasOwn.call(attrs, "type")) {
          attrs = Object.assign({ type: attrs.type }, attrs);
        }
        vnode.attrs = attrs;
        return vnode;
      }
      function hyperscript(selector) {
        if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
          throw Error("The selector must be either a string or a component.");
        }
        var vnode = hyperscriptVnode.apply(1, arguments);
        if (typeof selector === "string") {
          vnode.children = Vnode.normalizeChildren(vnode.children);
          if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode);
        }
        vnode.tag = selector;
        return vnode;
      }
      module.exports = hyperscript;
    }
  });

  // node_modules/mithril/render/trust.js
  var require_trust = __commonJS({
    "node_modules/mithril/render/trust.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      module.exports = function(html) {
        if (html == null) html = "";
        return Vnode("<", void 0, void 0, html, void 0, void 0);
      };
    }
  });

  // node_modules/mithril/render/fragment.js
  var require_fragment = __commonJS({
    "node_modules/mithril/render/fragment.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var hyperscriptVnode = require_hyperscriptVnode();
      module.exports = function() {
        var vnode = hyperscriptVnode.apply(0, arguments);
        vnode.tag = "[";
        vnode.children = Vnode.normalizeChildren(vnode.children);
        return vnode;
      };
    }
  });

  // node_modules/mithril/hyperscript.js
  var require_hyperscript2 = __commonJS({
    "node_modules/mithril/hyperscript.js"(exports, module) {
      "use strict";
      var hyperscript = require_hyperscript();
      hyperscript.trust = require_trust();
      hyperscript.fragment = require_fragment();
      module.exports = hyperscript;
    }
  });

  // node_modules/mithril/render/domFor.js
  var require_domFor = __commonJS({
    "node_modules/mithril/render/domFor.js"(exports, module) {
      "use strict";
      var delayedRemoval = /* @__PURE__ */ new WeakMap();
      function* domFor(vnode, object = {}) {
        var dom = vnode.dom;
        var domSize = vnode.domSize;
        var generation = object.generation;
        if (dom != null) do {
          var nextSibling = dom.nextSibling;
          if (delayedRemoval.get(dom) === generation) {
            yield dom;
            domSize--;
          }
          dom = nextSibling;
        } while (domSize);
      }
      module.exports = {
        delayedRemoval,
        domFor
      };
    }
  });

  // node_modules/mithril/render/render.js
  var require_render = __commonJS({
    "node_modules/mithril/render/render.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var df = require_domFor();
      var delayedRemoval = df.delayedRemoval;
      var domFor = df.domFor;
      module.exports = function() {
        var nameSpace = {
          svg: "http://www.w3.org/2000/svg",
          math: "http://www.w3.org/1998/Math/MathML"
        };
        var currentRedraw;
        var currentRender;
        function getDocument(dom) {
          return dom.ownerDocument;
        }
        function getNameSpace(vnode) {
          return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag];
        }
        function checkState(vnode, original) {
          if (vnode.state !== original) throw new Error("'vnode.state' must not be modified.");
        }
        function callHook(vnode) {
          var original = vnode.state;
          try {
            return this.apply(original, arguments);
          } finally {
            checkState(vnode, original);
          }
        }
        function activeElement(dom) {
          try {
            return getDocument(dom).activeElement;
          } catch (e) {
            return null;
          }
        }
        function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
          for (var i = start; i < end; i++) {
            var vnode = vnodes[i];
            if (vnode != null) {
              createNode(parent, vnode, hooks, ns, nextSibling);
            }
          }
        }
        function createNode(parent, vnode, hooks, ns, nextSibling) {
          var tag = vnode.tag;
          if (typeof tag === "string") {
            vnode.state = {};
            if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
            switch (tag) {
              case "#":
                createText(parent, vnode, nextSibling);
                break;
              case "<":
                createHTML(parent, vnode, ns, nextSibling);
                break;
              case "[":
                createFragment(parent, vnode, hooks, ns, nextSibling);
                break;
              default:
                createElement(parent, vnode, hooks, ns, nextSibling);
            }
          } else createComponent(parent, vnode, hooks, ns, nextSibling);
        }
        function createText(parent, vnode, nextSibling) {
          vnode.dom = getDocument(parent).createTextNode(vnode.children);
          insertDOM(parent, vnode.dom, nextSibling);
        }
        var possibleParents = { caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup" };
        function createHTML(parent, vnode, ns, nextSibling) {
          var match = vnode.children.match(/^\s*?<(\w+)/im) || [];
          var temp = getDocument(parent).createElement(possibleParents[match[1]] || "div");
          if (ns === "http://www.w3.org/2000/svg") {
            temp.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + vnode.children + "</svg>";
            temp = temp.firstChild;
          } else {
            temp.innerHTML = vnode.children;
          }
          vnode.dom = temp.firstChild;
          vnode.domSize = temp.childNodes.length;
          var fragment = getDocument(parent).createDocumentFragment();
          var child;
          while (child = temp.firstChild) {
            fragment.appendChild(child);
          }
          insertDOM(parent, fragment, nextSibling);
        }
        function createFragment(parent, vnode, hooks, ns, nextSibling) {
          var fragment = getDocument(parent).createDocumentFragment();
          if (vnode.children != null) {
            var children = vnode.children;
            createNodes(fragment, children, 0, children.length, hooks, null, ns);
          }
          vnode.dom = fragment.firstChild;
          vnode.domSize = fragment.childNodes.length;
          insertDOM(parent, fragment, nextSibling);
        }
        function createElement(parent, vnode, hooks, ns, nextSibling) {
          var tag = vnode.tag;
          var attrs = vnode.attrs;
          var is = attrs && attrs.is;
          ns = getNameSpace(vnode) || ns;
          var element = ns ? is ? getDocument(parent).createElementNS(ns, tag, { is }) : getDocument(parent).createElementNS(ns, tag) : is ? getDocument(parent).createElement(tag, { is }) : getDocument(parent).createElement(tag);
          vnode.dom = element;
          if (attrs != null) {
            setAttrs(vnode, attrs, ns);
          }
          insertDOM(parent, element, nextSibling);
          if (!maybeSetContentEditable(vnode)) {
            if (vnode.children != null) {
              var children = vnode.children;
              createNodes(element, children, 0, children.length, hooks, null, ns);
              if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs);
            }
          }
        }
        function initComponent(vnode, hooks) {
          var sentinel;
          if (typeof vnode.tag.view === "function") {
            vnode.state = Object.create(vnode.tag);
            sentinel = vnode.state.view;
            if (sentinel.$$reentrantLock$$ != null) return;
            sentinel.$$reentrantLock$$ = true;
          } else {
            vnode.state = void 0;
            sentinel = vnode.tag;
            if (sentinel.$$reentrantLock$$ != null) return;
            sentinel.$$reentrantLock$$ = true;
            vnode.state = vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function" ? new vnode.tag(vnode) : vnode.tag(vnode);
          }
          initLifecycle(vnode.state, vnode, hooks);
          if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
          vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
          if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
          sentinel.$$reentrantLock$$ = null;
        }
        function createComponent(parent, vnode, hooks, ns, nextSibling) {
          initComponent(vnode, hooks);
          if (vnode.instance != null) {
            createNode(parent, vnode.instance, hooks, ns, nextSibling);
            vnode.dom = vnode.instance.dom;
            vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
          } else {
            vnode.domSize = 0;
          }
        }
        function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
          if (old === vnodes || old == null && vnodes == null) return;
          else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns);
          else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length);
          else {
            var isOldKeyed = old[0] != null && old[0].key != null;
            var isKeyed = vnodes[0] != null && vnodes[0].key != null;
            var start = 0, oldStart = 0;
            if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++;
            if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++;
            if (isOldKeyed !== isKeyed) {
              removeNodes(parent, old, oldStart, old.length);
              createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
            } else if (!isKeyed) {
              var commonLength = old.length < vnodes.length ? old.length : vnodes.length;
              start = start < oldStart ? start : oldStart;
              for (; start < commonLength; start++) {
                o = old[start];
                v = vnodes[start];
                if (o === v || o == null && v == null) continue;
                else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling));
                else if (v == null) removeNode(parent, o);
                else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns);
              }
              if (old.length > commonLength) removeNodes(parent, old, start, old.length);
              if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
            } else {
              var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling;
              while (oldEnd >= oldStart && end >= start) {
                oe = old[oldEnd];
                ve = vnodes[end];
                if (oe.key !== ve.key) break;
                if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
                if (ve.dom != null) nextSibling = ve.dom;
                oldEnd--, end--;
              }
              while (oldEnd >= oldStart && end >= start) {
                o = old[oldStart];
                v = vnodes[start];
                if (o.key !== v.key) break;
                oldStart++, start++;
                if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns);
              }
              while (oldEnd >= oldStart && end >= start) {
                if (start === end) break;
                if (o.key !== ve.key || oe.key !== v.key) break;
                topSibling = getNextSibling(old, oldStart, nextSibling);
                moveDOM(parent, oe, topSibling);
                if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns);
                if (++start <= --end) moveDOM(parent, o, nextSibling);
                if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns);
                if (ve.dom != null) nextSibling = ve.dom;
                oldStart++;
                oldEnd--;
                oe = old[oldEnd];
                ve = vnodes[end];
                o = old[oldStart];
                v = vnodes[start];
              }
              while (oldEnd >= oldStart && end >= start) {
                if (oe.key !== ve.key) break;
                if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
                if (ve.dom != null) nextSibling = ve.dom;
                oldEnd--, end--;
                oe = old[oldEnd];
                ve = vnodes[end];
              }
              if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1);
              else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
              else {
                var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li = 0, i = 0, pos = 2147483647, matched = 0, map, lisIndices;
                for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1;
                for (i = end; i >= start; i--) {
                  if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1);
                  ve = vnodes[i];
                  var oldIndex = map[ve.key];
                  if (oldIndex != null) {
                    pos = oldIndex < pos ? oldIndex : -1;
                    oldIndices[i - start] = oldIndex;
                    oe = old[oldIndex];
                    old[oldIndex] = null;
                    if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
                    if (ve.dom != null) nextSibling = ve.dom;
                    matched++;
                  }
                }
                nextSibling = originalNextSibling;
                if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1);
                if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
                else {
                  if (pos === -1) {
                    lisIndices = makeLisIndices(oldIndices);
                    li = lisIndices.length - 1;
                    for (i = end; i >= start; i--) {
                      v = vnodes[i];
                      if (oldIndices[i - start] === -1) createNode(parent, v, hooks, ns, nextSibling);
                      else {
                        if (lisIndices[li] === i - start) li--;
                        else moveDOM(parent, v, nextSibling);
                      }
                      if (v.dom != null) nextSibling = vnodes[i].dom;
                    }
                  } else {
                    for (i = end; i >= start; i--) {
                      v = vnodes[i];
                      if (oldIndices[i - start] === -1) createNode(parent, v, hooks, ns, nextSibling);
                      if (v.dom != null) nextSibling = vnodes[i].dom;
                    }
                  }
                }
              }
            }
          }
        }
        function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
          var oldTag = old.tag, tag = vnode.tag;
          if (oldTag === tag) {
            vnode.state = old.state;
            vnode.events = old.events;
            if (shouldNotUpdate(vnode, old)) return;
            if (typeof oldTag === "string") {
              if (vnode.attrs != null) {
                updateLifecycle(vnode.attrs, vnode, hooks);
              }
              switch (oldTag) {
                case "#":
                  updateText(old, vnode);
                  break;
                case "<":
                  updateHTML(parent, old, vnode, ns, nextSibling);
                  break;
                case "[":
                  updateFragment(parent, old, vnode, hooks, nextSibling, ns);
                  break;
                default:
                  updateElement(old, vnode, hooks, ns);
              }
            } else updateComponent(parent, old, vnode, hooks, nextSibling, ns);
          } else {
            removeNode(parent, old);
            createNode(parent, vnode, hooks, ns, nextSibling);
          }
        }
        function updateText(old, vnode) {
          if (old.children.toString() !== vnode.children.toString()) {
            old.dom.nodeValue = vnode.children;
          }
          vnode.dom = old.dom;
        }
        function updateHTML(parent, old, vnode, ns, nextSibling) {
          if (old.children !== vnode.children) {
            removeDOM(parent, old, void 0);
            createHTML(parent, vnode, ns, nextSibling);
          } else {
            vnode.dom = old.dom;
            vnode.domSize = old.domSize;
          }
        }
        function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
          updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns);
          var domSize = 0, children = vnode.children;
          vnode.dom = null;
          if (children != null) {
            for (var i = 0; i < children.length; i++) {
              var child = children[i];
              if (child != null && child.dom != null) {
                if (vnode.dom == null) vnode.dom = child.dom;
                domSize += child.domSize || 1;
              }
            }
            if (domSize !== 1) vnode.domSize = domSize;
          }
        }
        function updateElement(old, vnode, hooks, ns) {
          var element = vnode.dom = old.dom;
          ns = getNameSpace(vnode) || ns;
          updateAttrs(vnode, old.attrs, vnode.attrs, ns);
          if (!maybeSetContentEditable(vnode)) {
            updateNodes(element, old.children, vnode.children, hooks, null, ns);
          }
        }
        function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
          vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
          if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
          updateLifecycle(vnode.state, vnode, hooks);
          if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks);
          if (vnode.instance != null) {
            if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling);
            else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns);
            vnode.dom = vnode.instance.dom;
            vnode.domSize = vnode.instance.domSize;
          } else if (old.instance != null) {
            removeNode(parent, old.instance);
            vnode.dom = void 0;
            vnode.domSize = 0;
          } else {
            vnode.dom = old.dom;
            vnode.domSize = old.domSize;
          }
        }
        function getKeyMap(vnodes, start, end) {
          var map = /* @__PURE__ */ Object.create(null);
          for (; start < end; start++) {
            var vnode = vnodes[start];
            if (vnode != null) {
              var key = vnode.key;
              if (key != null) map[key] = start;
            }
          }
          return map;
        }
        var lisTemp = [];
        function makeLisIndices(a) {
          var result = [0];
          var u = 0, v = 0, i = 0;
          var il = lisTemp.length = a.length;
          for (var i = 0; i < il; i++) lisTemp[i] = a[i];
          for (var i = 0; i < il; ++i) {
            if (a[i] === -1) continue;
            var j = result[result.length - 1];
            if (a[j] < a[i]) {
              lisTemp[i] = j;
              result.push(i);
              continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
              var c = (u >>> 1) + (v >>> 1) + (u & v & 1);
              if (a[result[c]] < a[i]) {
                u = c + 1;
              } else {
                v = c;
              }
            }
            if (a[i] < a[result[u]]) {
              if (u > 0) lisTemp[i] = result[u - 1];
              result[u] = i;
            }
          }
          u = result.length;
          v = result[u - 1];
          while (u-- > 0) {
            result[u] = v;
            v = lisTemp[v];
          }
          lisTemp.length = 0;
          return result;
        }
        function getNextSibling(vnodes, i, nextSibling) {
          for (; i < vnodes.length; i++) {
            if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom;
          }
          return nextSibling;
        }
        function moveDOM(parent, vnode, nextSibling) {
          if (vnode.dom != null) {
            var target;
            if (vnode.domSize == null) {
              target = vnode.dom;
            } else {
              target = getDocument(parent).createDocumentFragment();
              for (var dom of domFor(vnode)) target.appendChild(dom);
            }
            insertDOM(parent, target, nextSibling);
          }
        }
        function insertDOM(parent, dom, nextSibling) {
          if (nextSibling != null) parent.insertBefore(dom, nextSibling);
          else parent.appendChild(dom);
        }
        function maybeSetContentEditable(vnode) {
          if (vnode.attrs == null || vnode.attrs.contenteditable == null && // attribute
          vnode.attrs.contentEditable == null) return false;
          var children = vnode.children;
          if (children != null && children.length === 1 && children[0].tag === "<") {
            var content = children[0].children;
            if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content;
          } else if (children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted.");
          return true;
        }
        function removeNodes(parent, vnodes, start, end) {
          for (var i = start; i < end; i++) {
            var vnode = vnodes[i];
            if (vnode != null) removeNode(parent, vnode);
          }
        }
        function removeNode(parent, vnode) {
          var mask = 0;
          var original = vnode.state;
          var stateResult, attrsResult;
          if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
            var result = callHook.call(vnode.state.onbeforeremove, vnode);
            if (result != null && typeof result.then === "function") {
              mask = 1;
              stateResult = result;
            }
          }
          if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
            var result = callHook.call(vnode.attrs.onbeforeremove, vnode);
            if (result != null && typeof result.then === "function") {
              mask |= 2;
              attrsResult = result;
            }
          }
          checkState(vnode, original);
          var generation;
          if (!mask) {
            onremove(vnode);
            removeDOM(parent, vnode, generation);
          } else {
            generation = currentRender;
            for (var dom of domFor(vnode)) delayedRemoval.set(dom, generation);
            if (stateResult != null) {
              stateResult.finally(function() {
                if (mask & 1) {
                  mask &= 2;
                  if (!mask) {
                    checkState(vnode, original);
                    onremove(vnode);
                    removeDOM(parent, vnode, generation);
                  }
                }
              });
            }
            if (attrsResult != null) {
              attrsResult.finally(function() {
                if (mask & 2) {
                  mask &= 1;
                  if (!mask) {
                    checkState(vnode, original);
                    onremove(vnode);
                    removeDOM(parent, vnode, generation);
                  }
                }
              });
            }
          }
        }
        function removeDOM(parent, vnode, generation) {
          if (vnode.dom == null) return;
          if (vnode.domSize == null) {
            if (delayedRemoval.get(vnode.dom) === generation) parent.removeChild(vnode.dom);
          } else {
            for (var dom of domFor(vnode, { generation })) parent.removeChild(dom);
          }
        }
        function onremove(vnode) {
          if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode);
          if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode);
          if (typeof vnode.tag !== "string") {
            if (vnode.instance != null) onremove(vnode.instance);
          } else {
            var children = vnode.children;
            if (Array.isArray(children)) {
              for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child != null) onremove(child);
              }
            }
          }
        }
        function setAttrs(vnode, attrs, ns) {
          for (var key in attrs) {
            setAttr(vnode, key, null, attrs[key], ns);
          }
        }
        function setAttr(vnode, key, old, value, ns) {
          if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || old === value && !isFormAttribute(vnode, key) && typeof value !== "object") return;
          if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value);
          if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value);
          else if (key === "style") updateStyle(vnode.dom, old, value);
          else if (hasPropertyKey(vnode, key, ns)) {
            if (key === "value") {
              var isFileInput = vnode.tag === "input" && vnode.attrs.type === "file";
              if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && (isFileInput || vnode.dom === activeElement(vnode.dom))) return;
              if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return;
              if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return;
              if (isFileInput && "" + value !== "") {
                console.error("`value` is read-only on file inputs!");
                return;
              }
            }
            if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value);
            else vnode.dom[key] = value;
          } else {
            if (typeof value === "boolean") {
              if (value) vnode.dom.setAttribute(key, "");
              else vnode.dom.removeAttribute(key);
            } else vnode.dom.setAttribute(key === "className" ? "class" : key, value);
          }
        }
        function removeAttr(vnode, key, old, ns) {
          if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return;
          if (key[0] === "o" && key[1] === "n") updateEvent(vnode, key, void 0);
          else if (key === "style") updateStyle(vnode.dom, old, null);
          else if (hasPropertyKey(vnode, key, ns) && key !== "className" && key !== "title" && !(key === "value" && (vnode.tag === "option" || vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement(vnode.dom))) && !(vnode.tag === "input" && key === "type")) {
            vnode.dom[key] = null;
          } else {
            var nsLastIndex = key.indexOf(":");
            if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1);
            if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key);
          }
        }
        function setLateSelectAttrs(vnode, attrs) {
          if ("value" in attrs) {
            if (attrs.value === null) {
              if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null;
            } else {
              var normalized = "" + attrs.value;
              if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
                vnode.dom.value = normalized;
              }
            }
          }
          if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, void 0);
        }
        function updateAttrs(vnode, old, attrs, ns) {
          if (old && old === attrs) {
            console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major");
          }
          if (attrs != null) {
            for (var key in attrs) {
              setAttr(vnode, key, old && old[key], attrs[key], ns);
            }
          }
          var val;
          if (old != null) {
            for (var key in old) {
              if ((val = old[key]) != null && (attrs == null || attrs[key] == null)) {
                removeAttr(vnode, key, val, ns);
              }
            }
          }
        }
        function isFormAttribute(vnode, attr) {
          return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement(vnode.dom) || vnode.tag === "option" && vnode.dom.parentNode === activeElement(vnode.dom);
        }
        function isLifecycleMethod(attr) {
          return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate";
        }
        function hasPropertyKey(vnode, key, ns) {
          return ns === void 0 && // If it's a custom element, just keep it.
          (vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is || // If it's a normal element, let's try to avoid a few browser bugs.
          key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height") && key in vnode.dom;
        }
        function updateStyle(element, old, style) {
          if (old === style) {
          } else if (style == null) {
            element.style = "";
          } else if (typeof style !== "object") {
            element.style = style;
          } else if (old == null || typeof old !== "object") {
            element.style.cssText = "";
            for (var key in style) {
              var value = style[key];
              if (value != null) {
                if (key.includes("-")) element.style.setProperty(key, String(value));
                else element.style[key] = String(value);
              }
            }
          } else {
            for (var key in style) {
              var value = style[key];
              if (value != null && (value = String(value)) !== String(old[key])) {
                if (key.includes("-")) element.style.setProperty(key, value);
                else element.style[key] = value;
              }
            }
            for (var key in old) {
              if (old[key] != null && style[key] == null) {
                if (key.includes("-")) element.style.removeProperty(key);
                else element.style[key] = "";
              }
            }
          }
        }
        function EventDict() {
          this._ = currentRedraw;
        }
        EventDict.prototype = /* @__PURE__ */ Object.create(null);
        EventDict.prototype.handleEvent = function(ev) {
          var handler = this["on" + ev.type];
          var result;
          if (typeof handler === "function") result = handler.call(ev.currentTarget, ev);
          else if (typeof handler.handleEvent === "function") handler.handleEvent(ev);
          if (this._ && ev.redraw !== false) (0, this._)();
          if (result === false) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        };
        function updateEvent(vnode, key, value) {
          if (vnode.events != null) {
            vnode.events._ = currentRedraw;
            if (vnode.events[key] === value) return;
            if (value != null && (typeof value === "function" || typeof value === "object")) {
              if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false);
              vnode.events[key] = value;
            } else {
              if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false);
              vnode.events[key] = void 0;
            }
          } else if (value != null && (typeof value === "function" || typeof value === "object")) {
            vnode.events = new EventDict();
            vnode.dom.addEventListener(key.slice(2), vnode.events, false);
            vnode.events[key] = value;
          }
        }
        function initLifecycle(source, vnode, hooks) {
          if (typeof source.oninit === "function") callHook.call(source.oninit, vnode);
          if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode));
        }
        function updateLifecycle(source, vnode, hooks) {
          if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode));
        }
        function shouldNotUpdate(vnode, old) {
          do {
            if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
              var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old);
              if (force !== void 0 && !force) break;
            }
            if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
              var force = callHook.call(vnode.state.onbeforeupdate, vnode, old);
              if (force !== void 0 && !force) break;
            }
            return false;
          } while (false);
          vnode.dom = old.dom;
          vnode.domSize = old.domSize;
          vnode.instance = old.instance;
          vnode.attrs = old.attrs;
          vnode.children = old.children;
          vnode.text = old.text;
          return true;
        }
        var currentDOM;
        return function(dom, vnodes, redraw) {
          if (!dom) throw new TypeError("DOM element being rendered to does not exist.");
          if (currentDOM != null && dom.contains(currentDOM)) {
            throw new TypeError("Node is currently being rendered to and thus is locked.");
          }
          var prevRedraw = currentRedraw;
          var prevDOM = currentDOM;
          var hooks = [];
          var active = activeElement(dom);
          var namespace = dom.namespaceURI;
          currentDOM = dom;
          currentRedraw = typeof redraw === "function" ? redraw : void 0;
          currentRender = {};
          try {
            if (dom.vnodes == null) dom.textContent = "";
            vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes]);
            updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? void 0 : namespace);
            dom.vnodes = vnodes;
            if (active != null && activeElement(dom) !== active && typeof active.focus === "function") active.focus();
            for (var i = 0; i < hooks.length; i++) hooks[i]();
          } finally {
            currentRedraw = prevRedraw;
            currentDOM = prevDOM;
          }
        };
      };
    }
  });

  // node_modules/mithril/render.js
  var require_render2 = __commonJS({
    "node_modules/mithril/render.js"(exports, module) {
      "use strict";
      module.exports = require_render()(typeof window !== "undefined" ? window : null);
    }
  });

  // node_modules/mithril/api/mount-redraw.js
  var require_mount_redraw = __commonJS({
    "node_modules/mithril/api/mount-redraw.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      module.exports = function(render, schedule, console2) {
        var subscriptions = [];
        var pending = false;
        var offset = -1;
        function sync() {
          for (offset = 0; offset < subscriptions.length; offset += 2) {
            try {
              render(subscriptions[offset], Vnode(subscriptions[offset + 1]), redraw);
            } catch (e) {
              console2.error(e);
            }
          }
          offset = -1;
        }
        function redraw() {
          if (!pending) {
            pending = true;
            schedule(function() {
              pending = false;
              sync();
            });
          }
        }
        redraw.sync = sync;
        function mount(root, component) {
          if (component != null && component.view == null && typeof component !== "function") {
            throw new TypeError("m.mount expects a component, not a vnode.");
          }
          var index = subscriptions.indexOf(root);
          if (index >= 0) {
            subscriptions.splice(index, 2);
            if (index <= offset) offset -= 2;
            render(root, []);
          }
          if (component != null) {
            subscriptions.push(root, component);
            render(root, Vnode(component), redraw);
          }
        }
        return { mount, redraw };
      };
    }
  });

  // node_modules/mithril/mount-redraw.js
  var require_mount_redraw2 = __commonJS({
    "node_modules/mithril/mount-redraw.js"(exports, module) {
      "use strict";
      var render = require_render2();
      module.exports = require_mount_redraw()(render, typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null, typeof console !== "undefined" ? console : null);
    }
  });

  // node_modules/mithril/querystring/build.js
  var require_build = __commonJS({
    "node_modules/mithril/querystring/build.js"(exports, module) {
      "use strict";
      module.exports = function(object) {
        if (Object.prototype.toString.call(object) !== "[object Object]") return "";
        var args = [];
        for (var key in object) {
          destructure(key, object[key]);
        }
        return args.join("&");
        function destructure(key2, value) {
          if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              destructure(key2 + "[" + i + "]", value[i]);
            }
          } else if (Object.prototype.toString.call(value) === "[object Object]") {
            for (var i in value) {
              destructure(key2 + "[" + i + "]", value[i]);
            }
          } else args.push(encodeURIComponent(key2) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
        }
      };
    }
  });

  // node_modules/mithril/pathname/build.js
  var require_build2 = __commonJS({
    "node_modules/mithril/pathname/build.js"(exports, module) {
      "use strict";
      var buildQueryString = require_build();
      module.exports = function(template, params) {
        if (/:([^\/\.-]+)(\.{3})?:/.test(template)) {
          throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
        }
        if (params == null) return template;
        var queryIndex = template.indexOf("?");
        var hashIndex = template.indexOf("#");
        var queryEnd = hashIndex < 0 ? template.length : hashIndex;
        var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
        var path = template.slice(0, pathEnd);
        var query = {};
        Object.assign(query, params);
        var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m2, key, variadic) {
          delete query[key];
          if (params[key] == null) return m2;
          return variadic ? params[key] : encodeURIComponent(String(params[key]));
        });
        var newQueryIndex = resolved.indexOf("?");
        var newHashIndex = resolved.indexOf("#");
        var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex;
        var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex;
        var result = resolved.slice(0, newPathEnd);
        if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd);
        if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd);
        var querystring = buildQueryString(query);
        if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring;
        if (hashIndex >= 0) result += template.slice(hashIndex);
        if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex);
        return result;
      };
    }
  });

  // node_modules/mithril/request/request.js
  var require_request = __commonJS({
    "node_modules/mithril/request/request.js"(exports, module) {
      "use strict";
      var buildPathname = require_build2();
      var hasOwn = require_hasOwn();
      module.exports = function($window, oncompletion) {
        function PromiseProxy(executor) {
          return new Promise(executor);
        }
        function makeRequest(url, args) {
          return new Promise(function(resolve, reject) {
            url = buildPathname(url, args.params);
            var method = args.method != null ? args.method.toUpperCase() : "GET";
            var body = args.body;
            var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData || body instanceof $window.URLSearchParams);
            var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json");
            var xhr = new $window.XMLHttpRequest(), aborted = false, isTimeout = false;
            var original = xhr, replacedAbort;
            var abort = xhr.abort;
            xhr.abort = function() {
              aborted = true;
              abort.call(this);
            };
            xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : void 0, typeof args.password === "string" ? args.password : void 0);
            if (assumeJSON && body != null && !hasHeader(args, "content-type")) {
              xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            }
            if (typeof args.deserialize !== "function" && !hasHeader(args, "accept")) {
              xhr.setRequestHeader("Accept", "application/json, text/*");
            }
            if (args.withCredentials) xhr.withCredentials = args.withCredentials;
            if (args.timeout) xhr.timeout = args.timeout;
            xhr.responseType = responseType;
            for (var key in args.headers) {
              if (hasOwn.call(args.headers, key)) {
                xhr.setRequestHeader(key, args.headers[key]);
              }
            }
            xhr.onreadystatechange = function(ev) {
              if (aborted) return;
              if (ev.target.readyState === 4) {
                try {
                  var success = ev.target.status >= 200 && ev.target.status < 300 || ev.target.status === 304 || /^file:\/\//i.test(url);
                  var response = ev.target.response, message;
                  if (responseType === "json") {
                    if (!ev.target.responseType && typeof args.extract !== "function") {
                      try {
                        response = JSON.parse(ev.target.responseText);
                      } catch (e) {
                        response = null;
                      }
                    }
                  } else if (!responseType || responseType === "text") {
                    if (response == null) response = ev.target.responseText;
                  }
                  if (typeof args.extract === "function") {
                    response = args.extract(ev.target, args);
                    success = true;
                  } else if (typeof args.deserialize === "function") {
                    response = args.deserialize(response);
                  }
                  if (success) {
                    if (typeof args.type === "function") {
                      if (Array.isArray(response)) {
                        for (var i = 0; i < response.length; i++) {
                          response[i] = new args.type(response[i]);
                        }
                      } else response = new args.type(response);
                    }
                    resolve(response);
                  } else {
                    var completeErrorResponse = function() {
                      try {
                        message = ev.target.responseText;
                      } catch (e) {
                        message = response;
                      }
                      var error = new Error(message);
                      error.code = ev.target.status;
                      error.response = response;
                      reject(error);
                    };
                    if (xhr.status === 0) {
                      setTimeout(function() {
                        if (isTimeout) return;
                        completeErrorResponse();
                      });
                    } else completeErrorResponse();
                  }
                } catch (e) {
                  reject(e);
                }
              }
            };
            xhr.ontimeout = function(ev) {
              isTimeout = true;
              var error = new Error("Request timed out");
              error.code = ev.target.status;
              reject(error);
            };
            if (typeof args.config === "function") {
              xhr = args.config(xhr, args, url) || xhr;
              if (xhr !== original) {
                replacedAbort = xhr.abort;
                xhr.abort = function() {
                  aborted = true;
                  replacedAbort.call(this);
                };
              }
            }
            if (body == null) xhr.send();
            else if (typeof args.serialize === "function") xhr.send(args.serialize(body));
            else if (body instanceof $window.FormData || body instanceof $window.URLSearchParams) xhr.send(body);
            else xhr.send(JSON.stringify(body));
          });
        }
        PromiseProxy.prototype = Promise.prototype;
        PromiseProxy.__proto__ = Promise;
        function hasHeader(args, name) {
          for (var key in args.headers) {
            if (hasOwn.call(args.headers, key) && key.toLowerCase() === name) return true;
          }
          return false;
        }
        return {
          request: function(url, args) {
            if (typeof url !== "string") {
              args = url;
              url = url.url;
            } else if (args == null) args = {};
            var promise = makeRequest(url, args);
            if (args.background === true) return promise;
            var count = 0;
            function complete() {
              if (--count === 0 && typeof oncompletion === "function") oncompletion();
            }
            return wrap(promise);
            function wrap(promise2) {
              var then = promise2.then;
              promise2.constructor = PromiseProxy;
              promise2.then = function() {
                count++;
                var next = then.apply(promise2, arguments);
                next.then(complete, function(e) {
                  complete();
                  if (count === 0) throw e;
                });
                return wrap(next);
              };
              return promise2;
            }
          }
        };
      };
    }
  });

  // node_modules/mithril/request.js
  var require_request2 = __commonJS({
    "node_modules/mithril/request.js"(exports, module) {
      "use strict";
      var mountRedraw = require_mount_redraw2();
      module.exports = require_request()(typeof window !== "undefined" ? window : null, mountRedraw.redraw);
    }
  });

  // node_modules/mithril/querystring/parse.js
  var require_parse = __commonJS({
    "node_modules/mithril/querystring/parse.js"(exports, module) {
      "use strict";
      function decodeURIComponentSave(str) {
        try {
          return decodeURIComponent(str);
        } catch (err) {
          return str;
        }
      }
      module.exports = function(string) {
        if (string === "" || string == null) return {};
        if (string.charAt(0) === "?") string = string.slice(1);
        var entries = string.split("&"), counters = {}, data = {};
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i].split("=");
          var key = decodeURIComponentSave(entry[0]);
          var value = entry.length === 2 ? decodeURIComponentSave(entry[1]) : "";
          if (value === "true") value = true;
          else if (value === "false") value = false;
          var levels = key.split(/\]\[?|\[/);
          var cursor = data;
          if (key.indexOf("[") > -1) levels.pop();
          for (var j = 0; j < levels.length; j++) {
            var level = levels[j], nextLevel = levels[j + 1];
            var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
            if (level === "") {
              var key = levels.slice(0, j).join();
              if (counters[key] == null) {
                counters[key] = Array.isArray(cursor) ? cursor.length : 0;
              }
              level = counters[key]++;
            } else if (level === "__proto__") break;
            if (j === levels.length - 1) cursor[level] = value;
            else {
              var desc = Object.getOwnPropertyDescriptor(cursor, level);
              if (desc != null) desc = desc.value;
              if (desc == null) cursor[level] = desc = isNumber ? [] : {};
              cursor = desc;
            }
          }
        }
        return data;
      };
    }
  });

  // node_modules/mithril/pathname/parse.js
  var require_parse2 = __commonJS({
    "node_modules/mithril/pathname/parse.js"(exports, module) {
      "use strict";
      var parseQueryString = require_parse();
      module.exports = function(url) {
        var queryIndex = url.indexOf("?");
        var hashIndex = url.indexOf("#");
        var queryEnd = hashIndex < 0 ? url.length : hashIndex;
        var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
        var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/");
        if (!path) path = "/";
        else {
          if (path[0] !== "/") path = "/" + path;
        }
        return {
          path,
          params: queryIndex < 0 ? {} : parseQueryString(url.slice(queryIndex + 1, queryEnd))
        };
      };
    }
  });

  // node_modules/mithril/pathname/compileTemplate.js
  var require_compileTemplate = __commonJS({
    "node_modules/mithril/pathname/compileTemplate.js"(exports, module) {
      "use strict";
      var parsePathname = require_parse2();
      module.exports = function(template) {
        var templateData = parsePathname(template);
        var templateKeys = Object.keys(templateData.params);
        var keys = [];
        var regexp = new RegExp("^" + templateData.path.replace(
          // I escape literal text so people can use things like `:file.:ext` or
          // `:lang-:locale` in routes. This is all merged into one pass so I
          // don't also accidentally escape `-` and make it harder to detect it to
          // ban it from template parameters.
          /:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
          function(m2, key, extra) {
            if (key == null) return "\\" + m2;
            keys.push({ k: key, r: extra === "..." });
            if (extra === "...") return "(.*)";
            if (extra === ".") return "([^/]+)\\.";
            return "([^/]+)" + (extra || "");
          }
        ) + "$");
        return function(data) {
          for (var i = 0; i < templateKeys.length; i++) {
            if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false;
          }
          if (!keys.length) return regexp.test(data.path);
          var values = regexp.exec(data.path);
          if (values == null) return false;
          for (var i = 0; i < keys.length; i++) {
            data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1]);
          }
          return true;
        };
      };
    }
  });

  // node_modules/mithril/util/censor.js
  var require_censor = __commonJS({
    "node_modules/mithril/util/censor.js"(exports, module) {
      "use strict";
      var hasOwn = require_hasOwn();
      var magic = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
      module.exports = function(attrs, extras) {
        var result = {};
        if (extras != null) {
          for (var key in attrs) {
            if (hasOwn.call(attrs, key) && !magic.test(key) && extras.indexOf(key) < 0) {
              result[key] = attrs[key];
            }
          }
        } else {
          for (var key in attrs) {
            if (hasOwn.call(attrs, key) && !magic.test(key)) {
              result[key] = attrs[key];
            }
          }
        }
        return result;
      };
    }
  });

  // node_modules/mithril/api/router.js
  var require_router = __commonJS({
    "node_modules/mithril/api/router.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var m2 = require_hyperscript();
      var buildPathname = require_build2();
      var parsePathname = require_parse2();
      var compileTemplate = require_compileTemplate();
      var censor = require_censor();
      var sentinel = {};
      function decodeURIComponentSave(component) {
        try {
          return decodeURIComponent(component);
        } catch (e) {
          return component;
        }
      }
      module.exports = function($window, mountRedraw) {
        var callAsync = $window == null ? null : typeof $window.setImmediate === "function" ? $window.setImmediate : $window.setTimeout;
        var p = Promise.resolve();
        var scheduled = false;
        var ready = false;
        var state = 0;
        var compiled, fallbackRoute;
        var currentResolver = sentinel, component, attrs, currentPath, lastUpdate;
        var RouterRoot = {
          onbeforeupdate: function() {
            state = state ? 2 : 1;
            return !(!state || sentinel === currentResolver);
          },
          onremove: function() {
            $window.removeEventListener("popstate", fireAsync, false);
            $window.removeEventListener("hashchange", resolveRoute, false);
          },
          view: function() {
            if (!state || sentinel === currentResolver) return;
            var vnode = [Vnode(component, attrs.key, attrs)];
            if (currentResolver) vnode = currentResolver.render(vnode[0]);
            return vnode;
          }
        };
        var SKIP = route.SKIP = {};
        function resolveRoute() {
          scheduled = false;
          var prefix = $window.location.hash;
          if (route.prefix[0] !== "#") {
            prefix = $window.location.search + prefix;
            if (route.prefix[0] !== "?") {
              prefix = $window.location.pathname + prefix;
              if (prefix[0] !== "/") prefix = "/" + prefix;
            }
          }
          var path = prefix.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponentSave).slice(route.prefix.length);
          var data = parsePathname(path);
          Object.assign(data.params, $window.history.state);
          function reject(e) {
            console.error(e);
            setPath(fallbackRoute, null, { replace: true });
          }
          loop(0);
          function loop(i) {
            for (; i < compiled.length; i++) {
              if (compiled[i].check(data)) {
                var payload = compiled[i].component;
                var matchedRoute = compiled[i].route;
                var localComp = payload;
                var update = lastUpdate = function(comp) {
                  if (update !== lastUpdate) return;
                  if (comp === SKIP) return loop(i + 1);
                  component = comp != null && (typeof comp.view === "function" || typeof comp === "function") ? comp : "div";
                  attrs = data.params, currentPath = path, lastUpdate = null;
                  currentResolver = payload.render ? payload : null;
                  if (state === 2) mountRedraw.redraw();
                  else {
                    state = 2;
                    mountRedraw.redraw.sync();
                  }
                };
                if (payload.view || typeof payload === "function") {
                  payload = {};
                  update(localComp);
                } else if (payload.onmatch) {
                  p.then(function() {
                    return payload.onmatch(data.params, path, matchedRoute);
                  }).then(update, path === fallbackRoute ? null : reject);
                } else update("div");
                return;
              }
            }
            if (path === fallbackRoute) {
              throw new Error("Could not resolve default route " + fallbackRoute + ".");
            }
            setPath(fallbackRoute, null, { replace: true });
          }
        }
        function fireAsync() {
          if (!scheduled) {
            scheduled = true;
            callAsync(resolveRoute);
          }
        }
        function setPath(path, data, options) {
          path = buildPathname(path, data);
          if (ready) {
            fireAsync();
            var state2 = options ? options.state : null;
            var title = options ? options.title : null;
            if (options && options.replace) $window.history.replaceState(state2, title, route.prefix + path);
            else $window.history.pushState(state2, title, route.prefix + path);
          } else {
            $window.location.href = route.prefix + path;
          }
        }
        function route(root, defaultRoute, routes) {
          if (!root) throw new TypeError("DOM element being rendered to does not exist.");
          compiled = Object.keys(routes).map(function(route2) {
            if (route2[0] !== "/") throw new SyntaxError("Routes must start with a '/'.");
            if (/:([^\/\.-]+)(\.{3})?:/.test(route2)) {
              throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
            }
            return {
              route: route2,
              component: routes[route2],
              check: compileTemplate(route2)
            };
          });
          fallbackRoute = defaultRoute;
          if (defaultRoute != null) {
            var defaultData = parsePathname(defaultRoute);
            if (!compiled.some(function(i) {
              return i.check(defaultData);
            })) {
              throw new ReferenceError("Default route doesn't match any known routes.");
            }
          }
          if (typeof $window.history.pushState === "function") {
            $window.addEventListener("popstate", fireAsync, false);
          } else if (route.prefix[0] === "#") {
            $window.addEventListener("hashchange", resolveRoute, false);
          }
          ready = true;
          mountRedraw.mount(root, RouterRoot);
          resolveRoute();
        }
        route.set = function(path, data, options) {
          if (lastUpdate != null) {
            options = options || {};
            options.replace = true;
          }
          lastUpdate = null;
          setPath(path, data, options);
        };
        route.get = function() {
          return currentPath;
        };
        route.prefix = "#!";
        route.Link = {
          view: function(vnode) {
            var child = m2(
              vnode.attrs.selector || "a",
              censor(vnode.attrs, ["options", "params", "selector", "onclick"]),
              vnode.children
            );
            var options, onclick, href;
            if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
              child.attrs.href = null;
              child.attrs["aria-disabled"] = "true";
            } else {
              options = vnode.attrs.options;
              onclick = vnode.attrs.onclick;
              href = buildPathname(child.attrs.href, vnode.attrs.params);
              child.attrs.href = route.prefix + href;
              child.attrs.onclick = function(e) {
                var result;
                if (typeof onclick === "function") {
                  result = onclick.call(e.currentTarget, e);
                } else if (onclick == null || typeof onclick !== "object") {
                } else if (typeof onclick.handleEvent === "function") {
                  onclick.handleEvent(e);
                }
                if (
                  // Skip if `onclick` prevented default
                  result !== false && !e.defaultPrevented && // Ignore everything but left clicks
                  (e.button === 0 || e.which === 0 || e.which === 1) && // Let the browser handle `target=_blank`, etc.
                  (!e.currentTarget.target || e.currentTarget.target === "_self") && // No modifier keys
                  !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
                ) {
                  e.preventDefault();
                  e.redraw = false;
                  route.set(href, null, options);
                }
              };
            }
            return child;
          }
        };
        route.param = function(key) {
          return attrs && key != null ? attrs[key] : attrs;
        };
        return route;
      };
    }
  });

  // node_modules/mithril/route.js
  var require_route = __commonJS({
    "node_modules/mithril/route.js"(exports, module) {
      "use strict";
      var mountRedraw = require_mount_redraw2();
      module.exports = require_router()(typeof window !== "undefined" ? window : null, mountRedraw);
    }
  });

  // node_modules/mithril/index.js
  var require_mithril = __commonJS({
    "node_modules/mithril/index.js"(exports, module) {
      "use strict";
      var hyperscript = require_hyperscript2();
      var request = require_request2();
      var mountRedraw = require_mount_redraw2();
      var domFor = require_domFor();
      var m2 = function m3() {
        return hyperscript.apply(this, arguments);
      };
      m2.m = hyperscript;
      m2.trust = hyperscript.trust;
      m2.fragment = hyperscript.fragment;
      m2.Fragment = "[";
      m2.mount = mountRedraw.mount;
      m2.route = require_route();
      m2.render = require_render2();
      m2.redraw = mountRedraw.redraw;
      m2.request = request.request;
      m2.parseQueryString = require_parse();
      m2.buildQueryString = require_build();
      m2.parsePathname = require_parse2();
      m2.buildPathname = require_build2();
      m2.vnode = require_vnode();
      m2.censor = require_censor();
      m2.domFor = domFor.domFor;
      module.exports = m2;
    }
  });

  // node_modules/ngraph.random/index.js
  var require_ngraph = __commonJS({
    "node_modules/ngraph.random/index.js"(exports, module) {
      module.exports = {
        random,
        randomIterator
      };
      function random(inputSeed) {
        var seed = typeof inputSeed === "number" ? inputSeed : +/* @__PURE__ */ new Date();
        var randomFunc = function() {
          seed = seed + 2127912214 + (seed << 12) & 4294967295;
          seed = (seed ^ 3345072700 ^ seed >>> 19) & 4294967295;
          seed = seed + 374761393 + (seed << 5) & 4294967295;
          seed = (seed + 3550635116 ^ seed << 9) & 4294967295;
          seed = seed + 4251993797 + (seed << 3) & 4294967295;
          seed = (seed ^ 3042594569 ^ seed >>> 16) & 4294967295;
          return (seed & 268435455) / 268435456;
        };
        return {
          /**
           * Generates random integer number in the range from 0 (inclusive) to maxValue (exclusive)
           *
           * @param maxValue Number REQUIRED. Ommitting this number will result in NaN values from PRNG.
           */
          next: function(maxValue) {
            return Math.floor(randomFunc() * maxValue);
          },
          /**
           * Generates random double number in the range from 0 (inclusive) to 1 (exclusive)
           * This function is the same as Math.random() (except that it could be seeded)
           */
          nextDouble: function() {
            return randomFunc();
          }
        };
      }
      function randomIterator(array, customRandom) {
        var localRandom = customRandom || random();
        if (typeof localRandom.next !== "function") {
          throw new Error("customRandom does not match expected API: next() function is missing");
        }
        return {
          forEach: function(callback) {
            var i, j, t;
            for (i = array.length - 1; i > 0; --i) {
              j = localRandom.next(i + 1);
              t = array[j];
              array[j] = array[i];
              array[i] = t;
              callback(t);
            }
            if (array.length) {
              callback(array[0]);
            }
          },
          /**
           * Shuffles array randomly, in place.
           */
          shuffle: function() {
            var i, j, t;
            for (i = array.length - 1; i > 0; --i) {
              j = localRandom.next(i + 1);
              t = array[j];
              array[j] = array[i];
              array[i] = t;
            }
            return array;
          }
        };
      }
    }
  });

  // node_modules/ngraph.merge/index.js
  var require_ngraph2 = __commonJS({
    "node_modules/ngraph.merge/index.js"(exports, module) {
      module.exports = merge;
      function merge(target, options) {
        var key;
        if (!target) {
          target = {};
        }
        if (options) {
          for (key in options) {
            if (options.hasOwnProperty(key)) {
              var targetHasIt = target.hasOwnProperty(key), optionsValueType = typeof options[key], shouldReplace = !targetHasIt || typeof target[key] !== optionsValueType;
              if (shouldReplace) {
                target[key] = options[key];
              } else if (optionsValueType === "object") {
                target[key] = merge(target[key], options[key]);
              }
            }
          }
        }
        return target;
      }
    }
  });

  // node_modules/ngraph.events/index.js
  var require_ngraph3 = __commonJS({
    "node_modules/ngraph.events/index.js"(exports, module) {
      module.exports = function(subject) {
        validateSubject(subject);
        var eventsStorage = createEventsStorage(subject);
        subject.on = eventsStorage.on;
        subject.off = eventsStorage.off;
        subject.fire = eventsStorage.fire;
        return subject;
      };
      function createEventsStorage(subject) {
        var registeredEvents = /* @__PURE__ */ Object.create(null);
        return {
          on: function(eventName, callback, ctx) {
            if (typeof callback !== "function") {
              throw new Error("callback is expected to be a function");
            }
            var handlers = registeredEvents[eventName];
            if (!handlers) {
              handlers = registeredEvents[eventName] = [];
            }
            handlers.push({ callback, ctx });
            return subject;
          },
          off: function(eventName, callback) {
            var wantToRemoveAll = typeof eventName === "undefined";
            if (wantToRemoveAll) {
              registeredEvents = /* @__PURE__ */ Object.create(null);
              return subject;
            }
            if (registeredEvents[eventName]) {
              var deleteAllCallbacksForEvent = typeof callback !== "function";
              if (deleteAllCallbacksForEvent) {
                delete registeredEvents[eventName];
              } else {
                var callbacks = registeredEvents[eventName];
                for (var i = 0; i < callbacks.length; ++i) {
                  if (callbacks[i].callback === callback) {
                    callbacks.splice(i, 1);
                  }
                }
              }
            }
            return subject;
          },
          fire: function(eventName) {
            var callbacks = registeredEvents[eventName];
            if (!callbacks) {
              return subject;
            }
            var fireArguments;
            if (arguments.length > 1) {
              fireArguments = Array.prototype.splice.call(arguments, 1);
            }
            for (var i = 0; i < callbacks.length; ++i) {
              var callbackInfo = callbacks[i];
              callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
            }
            return subject;
          }
        };
      }
      function validateSubject(subject) {
        if (!subject) {
          throw new Error("Eventify cannot use falsy object as events subject");
        }
        var reservedWords = ["on", "fire", "off"];
        for (var i = 0; i < reservedWords.length; ++i) {
          if (subject.hasOwnProperty(reservedWords[i])) {
            throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
          }
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/version.js
  var require_version = __commonJS({
    "node_modules/vivagraphjs/src/version.js"(exports, module) {
      module.exports = "0.10.1";
    }
  });

  // node_modules/ngraph.graph/index.js
  var require_ngraph4 = __commonJS({
    "node_modules/ngraph.graph/index.js"(exports, module) {
      module.exports = createGraph;
      var eventify = require_ngraph3();
      function createGraph(options) {
        options = options || {};
        if ("uniqueLinkId" in options) {
          console.warn(
            "ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",
            "\n",
            "Note: there is also change in default behavior: From now own each graph\nis considered to be not a multigraph by default (each edge is unique)."
          );
          options.multigraph = options.uniqueLinkId;
        }
        if (options.multigraph === void 0) options.multigraph = false;
        var nodes = typeof Object.create === "function" ? /* @__PURE__ */ Object.create(null) : {}, links = [], multiEdges = {}, nodesCount = 0, suspendEvents = 0, forEachNode = createNodeIterator(), createLink = options.multigraph ? createUniqueLink : createSingleLink, changes = [], recordLinkChange = noop, recordNodeChange = noop, enterModification = noop, exitModification = noop;
        var graphPart = {
          /**
           * Adds node to the graph. If node with given id already exists in the graph
           * its data is extended with whatever comes in 'data' argument.
           *
           * @param nodeId the node's identifier. A string or number is preferred.
           * @param [data] additional data for the node being added. If node already
           *   exists its data object is augmented with the new one.
           *
           * @return {node} The newly added node or node with given id if it already exists.
           */
          addNode,
          /**
           * Adds a link to the graph. The function always create a new
           * link between two nodes. If one of the nodes does not exists
           * a new node is created.
           *
           * @param fromId link start node id;
           * @param toId link end node id;
           * @param [data] additional data to be set on the new link;
           *
           * @return {link} The newly created link
           */
          addLink,
          /**
           * Removes link from the graph. If link does not exist does nothing.
           *
           * @param link - object returned by addLink() or getLinks() methods.
           *
           * @returns true if link was removed; false otherwise.
           */
          removeLink,
          /**
           * Removes node with given id from the graph. If node does not exist in the graph
           * does nothing.
           *
           * @param nodeId node's identifier passed to addNode() function.
           *
           * @returns true if node was removed; false otherwise.
           */
          removeNode,
          /**
           * Gets node with given identifier. If node does not exist undefined value is returned.
           *
           * @param nodeId requested node identifier;
           *
           * @return {node} in with requested identifier or undefined if no such node exists.
           */
          getNode,
          /**
           * Gets number of nodes in this graph.
           *
           * @return number of nodes in the graph.
           */
          getNodesCount: function() {
            return nodesCount;
          },
          /**
           * Gets total number of links in the graph.
           */
          getLinksCount: function() {
            return links.length;
          },
          /**
           * Gets all links (inbound and outbound) from the node with given id.
           * If node with given id is not found null is returned.
           *
           * @param nodeId requested node identifier.
           *
           * @return Array of links from and to requested node if such node exists;
           *   otherwise null is returned.
           */
          getLinks,
          /**
           * Invokes callback on each node of the graph.
           *
           * @param {Function(node)} callback Function to be invoked. The function
           *   is passed one argument: visited node.
           */
          forEachNode,
          /**
           * Invokes callback on every linked (adjacent) node to the given one.
           *
           * @param nodeId Identifier of the requested node.
           * @param {Function(node, link)} callback Function to be called on all linked nodes.
           *   The function is passed two parameters: adjacent node and link object itself.
           * @param oriented if true graph treated as oriented.
           */
          forEachLinkedNode,
          /**
           * Enumerates all links in the graph
           *
           * @param {Function(link)} callback Function to be called on all links in the graph.
           *   The function is passed one parameter: graph's link object.
           *
           * Link object contains at least the following fields:
           *  fromId - node id where link starts;
           *  toId - node id where link ends,
           *  data - additional data passed to graph.addLink() method.
           */
          forEachLink,
          /**
           * Suspend all notifications about graph changes until
           * endUpdate is called.
           */
          beginUpdate: enterModification,
          /**
           * Resumes all notifications about graph changes and fires
           * graph 'changed' event in case there are any pending changes.
           */
          endUpdate: exitModification,
          /**
           * Removes all nodes and links from the graph.
           */
          clear,
          /**
           * Detects whether there is a link between two nodes.
           * Operation complexity is O(n) where n - number of links of a node.
           * NOTE: this function is synonim for getLink()
           *
           * @returns link if there is one. null otherwise.
           */
          hasLink: getLink,
          /**
           * Detects whether there is a node with given id
           * 
           * Operation complexity is O(1)
           * NOTE: this function is synonim for getNode()
           *
           * @returns node if there is one; Falsy value otherwise.
           */
          hasNode: getNode,
          /**
           * Gets an edge between two nodes.
           * Operation complexity is O(n) where n - number of links of a node.
           *
           * @param {string} fromId link start identifier
           * @param {string} toId link end identifier
           *
           * @returns link if there is one. null otherwise.
           */
          getLink
        };
        eventify(graphPart);
        monitorSubscribers();
        return graphPart;
        function monitorSubscribers() {
          var realOn = graphPart.on;
          graphPart.on = on;
          function on() {
            graphPart.beginUpdate = enterModification = enterModificationReal;
            graphPart.endUpdate = exitModification = exitModificationReal;
            recordLinkChange = recordLinkChangeReal;
            recordNodeChange = recordNodeChangeReal;
            graphPart.on = realOn;
            return realOn.apply(graphPart, arguments);
          }
        }
        function recordLinkChangeReal(link, changeType) {
          changes.push({
            link,
            changeType
          });
        }
        function recordNodeChangeReal(node, changeType) {
          changes.push({
            node,
            changeType
          });
        }
        function addNode(nodeId, data) {
          if (nodeId === void 0) {
            throw new Error("Invalid node identifier");
          }
          enterModification();
          var node = getNode(nodeId);
          if (!node) {
            node = new Node(nodeId, data);
            nodesCount++;
            recordNodeChange(node, "add");
          } else {
            node.data = data;
            recordNodeChange(node, "update");
          }
          nodes[nodeId] = node;
          exitModification();
          return node;
        }
        function getNode(nodeId) {
          return nodes[nodeId];
        }
        function removeNode(nodeId) {
          var node = getNode(nodeId);
          if (!node) {
            return false;
          }
          enterModification();
          var prevLinks = node.links;
          if (prevLinks) {
            node.links = null;
            for (var i = 0; i < prevLinks.length; ++i) {
              removeLink(prevLinks[i]);
            }
          }
          delete nodes[nodeId];
          nodesCount--;
          recordNodeChange(node, "remove");
          exitModification();
          return true;
        }
        function addLink(fromId, toId, data) {
          enterModification();
          var fromNode = getNode(fromId) || addNode(fromId);
          var toNode = getNode(toId) || addNode(toId);
          var link = createLink(fromId, toId, data);
          links.push(link);
          addLinkToNode(fromNode, link);
          if (fromId !== toId) {
            addLinkToNode(toNode, link);
          }
          recordLinkChange(link, "add");
          exitModification();
          return link;
        }
        function createSingleLink(fromId, toId, data) {
          var linkId = makeLinkId(fromId, toId);
          return new Link(fromId, toId, data, linkId);
        }
        function createUniqueLink(fromId, toId, data) {
          var linkId = makeLinkId(fromId, toId);
          var isMultiEdge = multiEdges.hasOwnProperty(linkId);
          if (isMultiEdge || getLink(fromId, toId)) {
            if (!isMultiEdge) {
              multiEdges[linkId] = 0;
            }
            var suffix = "@" + ++multiEdges[linkId];
            linkId = makeLinkId(fromId + suffix, toId + suffix);
          }
          return new Link(fromId, toId, data, linkId);
        }
        function getLinks(nodeId) {
          var node = getNode(nodeId);
          return node ? node.links : null;
        }
        function removeLink(link) {
          if (!link) {
            return false;
          }
          var idx = indexOfElementInArray(link, links);
          if (idx < 0) {
            return false;
          }
          enterModification();
          links.splice(idx, 1);
          var fromNode = getNode(link.fromId);
          var toNode = getNode(link.toId);
          if (fromNode) {
            idx = indexOfElementInArray(link, fromNode.links);
            if (idx >= 0) {
              fromNode.links.splice(idx, 1);
            }
          }
          if (toNode) {
            idx = indexOfElementInArray(link, toNode.links);
            if (idx >= 0) {
              toNode.links.splice(idx, 1);
            }
          }
          recordLinkChange(link, "remove");
          exitModification();
          return true;
        }
        function getLink(fromNodeId, toNodeId) {
          var node = getNode(fromNodeId), i;
          if (!node || !node.links) {
            return null;
          }
          for (i = 0; i < node.links.length; ++i) {
            var link = node.links[i];
            if (link.fromId === fromNodeId && link.toId === toNodeId) {
              return link;
            }
          }
          return null;
        }
        function clear() {
          enterModification();
          forEachNode(function(node) {
            removeNode(node.id);
          });
          exitModification();
        }
        function forEachLink(callback) {
          var i, length;
          if (typeof callback === "function") {
            for (i = 0, length = links.length; i < length; ++i) {
              callback(links[i]);
            }
          }
        }
        function forEachLinkedNode(nodeId, callback, oriented) {
          var node = getNode(nodeId);
          if (node && node.links && typeof callback === "function") {
            if (oriented) {
              return forEachOrientedLink(node.links, nodeId, callback);
            } else {
              return forEachNonOrientedLink(node.links, nodeId, callback);
            }
          }
        }
        function forEachNonOrientedLink(links2, nodeId, callback) {
          var quitFast;
          for (var i = 0; i < links2.length; ++i) {
            var link = links2[i];
            var linkedNodeId = link.fromId === nodeId ? link.toId : link.fromId;
            quitFast = callback(nodes[linkedNodeId], link);
            if (quitFast) {
              return true;
            }
          }
        }
        function forEachOrientedLink(links2, nodeId, callback) {
          var quitFast;
          for (var i = 0; i < links2.length; ++i) {
            var link = links2[i];
            if (link.fromId === nodeId) {
              quitFast = callback(nodes[link.toId], link);
              if (quitFast) {
                return true;
              }
            }
          }
        }
        function noop() {
        }
        function enterModificationReal() {
          suspendEvents += 1;
        }
        function exitModificationReal() {
          suspendEvents -= 1;
          if (suspendEvents === 0 && changes.length > 0) {
            graphPart.fire("changed", changes);
            changes.length = 0;
          }
        }
        function createNodeIterator() {
          return Object.keys ? objectKeysIterator : forInIterator;
        }
        function objectKeysIterator(callback) {
          if (typeof callback !== "function") {
            return;
          }
          var keys = Object.keys(nodes);
          for (var i = 0; i < keys.length; ++i) {
            if (callback(nodes[keys[i]])) {
              return true;
            }
          }
        }
        function forInIterator(callback) {
          if (typeof callback !== "function") {
            return;
          }
          var node;
          for (node in nodes) {
            if (callback(nodes[node])) {
              return true;
            }
          }
        }
      }
      function indexOfElementInArray(element, array) {
        if (!array) return -1;
        if (array.indexOf) {
          return array.indexOf(element);
        }
        var len = array.length, i;
        for (i = 0; i < len; i += 1) {
          if (array[i] === element) {
            return i;
          }
        }
        return -1;
      }
      function Node(id, data) {
        this.id = id;
        this.links = null;
        this.data = data;
      }
      function addLinkToNode(node, link) {
        if (node.links) {
          node.links.push(link);
        } else {
          node.links = [link];
        }
      }
      function Link(fromId, toId, data, id) {
        this.fromId = fromId;
        this.toId = toId;
        this.data = data;
        this.id = id;
      }
      function makeLinkId(fromId, toId) {
        return fromId.toString() + "\u{1F449} " + toId.toString();
      }
    }
  });

  // node_modules/ngraph.fromjson/index.js
  var require_ngraph5 = __commonJS({
    "node_modules/ngraph.fromjson/index.js"(exports, module) {
      module.exports = load;
      var createGraph = require_ngraph4();
      function load(jsonGraph, nodeTransform, linkTransform) {
        var stored;
        nodeTransform = nodeTransform || id;
        linkTransform = linkTransform || id;
        if (typeof jsonGraph === "string") {
          stored = JSON.parse(jsonGraph);
        } else {
          stored = jsonGraph;
        }
        var graph = createGraph(), i;
        if (stored.links === void 0 || stored.nodes === void 0) {
          throw new Error("Cannot load graph without links and nodes");
        }
        for (i = 0; i < stored.nodes.length; ++i) {
          var parsedNode = nodeTransform(stored.nodes[i]);
          if (!parsedNode.hasOwnProperty("id")) {
            throw new Error("Graph node format is invalid: Node id is missing");
          }
          graph.addNode(parsedNode.id, parsedNode.data);
        }
        for (i = 0; i < stored.links.length; ++i) {
          var link = linkTransform(stored.links[i]);
          if (!link.hasOwnProperty("fromId") || !link.hasOwnProperty("toId")) {
            throw new Error("Graph link format is invalid. Both fromId and toId are required");
          }
          graph.addLink(link.fromId, link.toId, link.data);
        }
        return graph;
      }
      function id(x) {
        return x;
      }
    }
  });

  // node_modules/ngraph.tojson/index.js
  var require_ngraph6 = __commonJS({
    "node_modules/ngraph.tojson/index.js"(exports, module) {
      module.exports = save;
      function save(graph, customNodeTransform, customLinkTransform) {
        var result = {
          nodes: [],
          links: []
        };
        var nodeTransform = customNodeTransform || defaultTransformForNode;
        var linkTransform = customLinkTransform || defaultTransformForLink;
        graph.forEachNode(saveNode);
        graph.forEachLink(saveLink);
        return JSON.stringify(result);
        function saveNode(node) {
          result.nodes.push(nodeTransform(node));
        }
        function saveLink(link) {
          result.links.push(linkTransform(link));
        }
        function defaultTransformForNode(node) {
          var result2 = {
            id: node.id
          };
          if (node.data !== void 0) {
            result2.data = node.data;
          }
          return result2;
        }
        function defaultTransformForLink(link) {
          var result2 = {
            fromId: link.fromId,
            toId: link.toId
          };
          if (link.data !== void 0) {
            result2.data = link.data;
          }
          return result2;
        }
      }
    }
  });

  // node_modules/ngraph.centrality/src/degree.js
  var require_degree = __commonJS({
    "node_modules/ngraph.centrality/src/degree.js"(exports, module) {
      module.exports = degree;
      function degree(graph, kind) {
        var getNodeDegree;
        var result = /* @__PURE__ */ Object.create(null);
        kind = (kind || "both").toLowerCase();
        if (kind === "both" || kind === "inout") {
          getNodeDegree = inoutDegreeCalculator;
        } else if (kind === "in") {
          getNodeDegree = inDegreeCalculator;
        } else if (kind === "out") {
          getNodeDegree = outDegreeCalculator;
        } else {
          throw new Error("Expected centrality degree kind is: in, out or both");
        }
        graph.forEachNode(calculateNodeDegree);
        return result;
        function calculateNodeDegree(node) {
          var links = graph.getLinks(node.id);
          result[node.id] = getNodeDegree(links, node.id);
        }
      }
      function inDegreeCalculator(links, nodeId) {
        var total = 0;
        if (!links) return total;
        for (var i = 0; i < links.length; i += 1) {
          total += links[i].toId === nodeId ? 1 : 0;
        }
        return total;
      }
      function outDegreeCalculator(links, nodeId) {
        var total = 0;
        if (!links) return total;
        for (var i = 0; i < links.length; i += 1) {
          total += links[i].fromId === nodeId ? 1 : 0;
        }
        return total;
      }
      function inoutDegreeCalculator(links) {
        if (!links) return 0;
        return links.length;
      }
    }
  });

  // node_modules/ngraph.centrality/src/betweenness.js
  var require_betweenness = __commonJS({
    "node_modules/ngraph.centrality/src/betweenness.js"(exports, module) {
      module.exports = betweennes;
      function betweennes(graph, oriented) {
        var Q = [], S = [];
        var pred = /* @__PURE__ */ Object.create(null);
        var dist = /* @__PURE__ */ Object.create(null);
        var sigma = /* @__PURE__ */ Object.create(null);
        var delta = /* @__PURE__ */ Object.create(null);
        var currentNode;
        var centrality = /* @__PURE__ */ Object.create(null);
        graph.forEachNode(setCentralityToZero);
        graph.forEachNode(calculateCentrality);
        if (!oriented) {
          Object.keys(centrality).forEach(divideByTwo);
        }
        return centrality;
        function divideByTwo(key) {
          centrality[key] /= 2;
        }
        function setCentralityToZero(node) {
          centrality[node.id] = 0;
        }
        function calculateCentrality(node) {
          currentNode = node.id;
          singleSourceShortestPath(currentNode);
          accumulate();
        }
        function accumulate() {
          graph.forEachNode(setDeltaToZero);
          while (S.length) {
            var w = S.pop();
            var coeff = (1 + delta[w]) / sigma[w];
            var predcessors = pred[w];
            for (var idx = 0; idx < predcessors.length; ++idx) {
              var v = predcessors[idx];
              delta[v] += sigma[v] * coeff;
            }
            if (w !== currentNode) {
              centrality[w] += delta[w];
            }
          }
        }
        function setDeltaToZero(node) {
          delta[node.id] = 0;
        }
        function singleSourceShortestPath(source) {
          graph.forEachNode(initNode);
          dist[source] = 0;
          sigma[source] = 1;
          Q.push(source);
          while (Q.length) {
            var v = Q.shift();
            S.push(v);
            graph.forEachLinkedNode(v, toId, oriented);
          }
          function toId(otherNode) {
            processNode(otherNode.id);
          }
          function initNode(node) {
            var nodeId = node.id;
            pred[nodeId] = [];
            dist[nodeId] = -1;
            sigma[nodeId] = 0;
          }
          function processNode(w) {
            if (dist[w] === -1) {
              dist[w] = dist[v] + 1;
              Q.push(w);
            }
            if (dist[w] === dist[v] + 1) {
              sigma[w] += sigma[v];
              pred[w].push(v);
            }
          }
        }
      }
    }
  });

  // node_modules/ngraph.centrality/src/closeness.js
  var require_closeness = __commonJS({
    "node_modules/ngraph.centrality/src/closeness.js"(exports, module) {
      module.exports = closeness;
      function closeness(graph, oriented) {
        var Q = [];
        var dist = /* @__PURE__ */ Object.create(null);
        var currentNode;
        var centrality = /* @__PURE__ */ Object.create(null);
        graph.forEachNode(setCentralityToZero);
        graph.forEachNode(calculateCentrality);
        return centrality;
        function setCentralityToZero(node) {
          centrality[node.id] = 0;
        }
        function calculateCentrality(node) {
          currentNode = node.id;
          singleSourceShortestPath(currentNode);
          accumulate();
        }
        function accumulate() {
          var distances = Object.keys(dist).map(function(key) {
            return dist[key];
          }).filter(function(val) {
            return val !== -1;
          });
          var reachableNodesTotal = distances.length;
          var totalDistance = distances.reduce(function(a, b) {
            return a + b;
          });
          if (totalDistance > 0) {
            centrality[currentNode] = (reachableNodesTotal - 1) / totalDistance;
          } else {
            centrality[currentNode] = 0;
          }
        }
        function singleSourceShortestPath(source) {
          graph.forEachNode(initNode);
          dist[source] = 0;
          Q.push(source);
          while (Q.length) {
            var v = Q.shift();
            graph.forEachLinkedNode(v, processNode, oriented);
          }
          function initNode(node) {
            var nodeId = node.id;
            dist[nodeId] = -1;
          }
          function processNode(otherNode) {
            var w = otherNode.id;
            if (dist[w] === -1) {
              dist[w] = dist[v] + 1;
              Q.push(w);
            }
          }
        }
      }
    }
  });

  // node_modules/ngraph.centrality/src/eccentricity.js
  var require_eccentricity = __commonJS({
    "node_modules/ngraph.centrality/src/eccentricity.js"(exports, module) {
      module.exports = eccentricity;
      function eccentricity(graph, oriented) {
        var Q = [];
        var dist = /* @__PURE__ */ Object.create(null);
        var currentNode;
        var centrality = /* @__PURE__ */ Object.create(null);
        graph.forEachNode(setCentralityToZero);
        graph.forEachNode(calculateCentrality);
        return centrality;
        function setCentralityToZero(node) {
          centrality[node.id] = 0;
        }
        function calculateCentrality(node) {
          currentNode = node.id;
          singleSourceShortestPath(currentNode);
          accumulate();
        }
        function accumulate() {
          var maxDist = 0;
          Object.keys(dist).forEach(function(key) {
            var val = dist[key];
            if (maxDist < val) maxDist = val;
          });
          centrality[currentNode] = maxDist;
        }
        function singleSourceShortestPath(source) {
          graph.forEachNode(initNode);
          dist[source] = 0;
          Q.push(source);
          while (Q.length) {
            var v = Q.shift();
            graph.forEachLinkedNode(v, processNode, oriented);
          }
          function initNode(node) {
            var nodeId = node.id;
            dist[nodeId] = -1;
          }
          function processNode(otherNode) {
            var w = otherNode.id;
            if (dist[w] === -1) {
              dist[w] = dist[v] + 1;
              Q.push(w);
            }
          }
        }
      }
    }
  });

  // node_modules/ngraph.centrality/index.js
  var require_ngraph7 = __commonJS({
    "node_modules/ngraph.centrality/index.js"(exports, module) {
      module.exports.degree = require_degree();
      module.exports.betweenness = require_betweenness();
      module.exports.closeness = require_closeness();
      module.exports.eccentricity = require_eccentricity();
    }
  });

  // node_modules/vivagraphjs/src/Algorithms/centrality.js
  var require_centrality = __commonJS({
    "node_modules/vivagraphjs/src/Algorithms/centrality.js"(exports, module) {
      var centrality = require_ngraph7();
      module.exports = centralityWrapper;
      function centralityWrapper() {
        return {
          betweennessCentrality,
          degreeCentrality
        };
      }
      function betweennessCentrality(g) {
        var betweenness = centrality.betweenness(g);
        return toVivaGraphCentralityFormat(betweenness);
      }
      function degreeCentrality(g, kind) {
        var degree = centrality.degree(g, kind);
        return toVivaGraphCentralityFormat(degree);
      }
      function toVivaGraphCentralityFormat(centrality2) {
        return Object.keys(centrality2).sort(byValue).map(toKeyValue);
        function byValue(x, y) {
          return centrality2[y] - centrality2[x];
        }
        function toKeyValue(key) {
          return {
            key,
            value: centrality2[key]
          };
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/Algorithms/operations.js
  var require_operations = __commonJS({
    "node_modules/vivagraphjs/src/Algorithms/operations.js"(exports, module) {
      module.exports = operations;
      function operations() {
        return {
          /**
           * Gets graph density, which is a ratio of actual number of edges to maximum
           * number of edges. I.e. graph density 1 means all nodes are connected with each other with an edge.
           * Density 0 - graph has no edges. Runtime: O(1)
           * 
           * @param graph represents oriented graph structure.
           * @param directed (optional boolean) represents if the graph should be treated as a directed graph.
           * 
           * @returns density of the graph if graph has nodes. NaN otherwise. Returns density for undirected graph by default but returns density for directed graph if a boolean 'true' is passed along with the graph.
           */
          density: function(graph, directed) {
            var nodes = graph.getNodesCount();
            if (nodes === 0) {
              return NaN;
            }
            if (directed) {
              return graph.getLinksCount() / (nodes * (nodes - 1));
            } else {
              return 2 * graph.getLinksCount() / (nodes * (nodes - 1));
            }
          }
        };
      }
    }
  });

  // node_modules/gintersect/index.js
  var require_gintersect = __commonJS({
    "node_modules/gintersect/index.js"(exports, module) {
      module.exports = intersect;
      function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        var a1, a2, b1, b2, c1, c2, r1, r2, r3, r4, denom, offset, num, result = {
          x: 0,
          y: 0
        };
        a1 = y2 - y1;
        b1 = x1 - x2;
        c1 = x2 * y1 - x1 * y2;
        r3 = a1 * x3 + b1 * y3 + c1;
        r4 = a1 * x4 + b1 * y4 + c1;
        if (r3 !== 0 && r4 !== 0 && r3 >= 0 === r4 >= 4) {
          return null;
        }
        a2 = y4 - y3;
        b2 = x3 - x4;
        c2 = x4 * y3 - x3 * y4;
        r1 = a2 * x1 + b2 * y1 + c2;
        r2 = a2 * x2 + b2 * y2 + c2;
        if (r1 !== 0 && r2 !== 0 && r1 >= 0 === r2 >= 0) {
          return null;
        }
        denom = a1 * b2 - a2 * b1;
        if (denom === 0) {
          return null;
        }
        offset = denom < 0 ? -denom / 2 : denom / 2;
        offset = 0;
        num = b1 * c2 - b2 * c1;
        result.x = (num < 0 ? num - offset : num + offset) / denom;
        num = a2 * c1 - a1 * c2;
        result.y = (num < 0 ? num - offset : num + offset) / denom;
        return result;
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/intersectRect.js
  var require_intersectRect = __commonJS({
    "node_modules/vivagraphjs/src/Utils/intersectRect.js"(exports, module) {
      var intersect = require_gintersect();
      module.exports = intersectRect;
      function intersectRect(left, top, right, bottom, x1, y1, x2, y2) {
        return intersect(left, top, left, bottom, x1, y1, x2, y2) || intersect(left, bottom, right, bottom, x1, y1, x2, y2) || intersect(right, bottom, right, top, x1, y1, x2, y2) || intersect(right, top, left, top, x1, y1, x2, y2);
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webgl.js
  var require_webgl = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webgl.js"(exports, module) {
      module.exports = webgl;
      function webgl(gl) {
        return {
          createProgram,
          extendArray,
          copyArrayPart,
          swapArrayPart,
          getLocations,
          context: gl
        };
        function createShader(shaderText, type) {
          var shader = gl.createShader(type);
          gl.shaderSource(shader, shaderText);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var msg = gl.getShaderInfoLog(shader);
            window.alert(msg);
            throw msg;
          }
          return shader;
        }
        function createProgram(vertexShaderSrc, fragmentShaderSrc) {
          var program = gl.createProgram();
          var vs = createShader(vertexShaderSrc, gl.VERTEX_SHADER);
          var fs = createShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var msg = gl.getShaderInfoLog(program);
            window.alert(msg);
            throw msg;
          }
          return program;
        }
        function extendArray(buffer, itemsInBuffer, elementsPerItem) {
          if ((itemsInBuffer + 1) * elementsPerItem > buffer.length) {
            var extendedArray = new Float32Array(buffer.length * elementsPerItem * 2);
            extendedArray.set(buffer);
            return extendedArray;
          }
          return buffer;
        }
        function getLocations(program, uniformOrAttributeNames) {
          var foundLocations = {};
          for (var i = 0; i < uniformOrAttributeNames.length; ++i) {
            var name = uniformOrAttributeNames[i];
            var location2 = -1;
            if (name[0] === "a" && name[1] === "_") {
              location2 = gl.getAttribLocation(program, name);
              if (location2 === -1) {
                throw new Error("Program doesn't have required attribute: " + name);
              }
              foundLocations[name.slice(2)] = location2;
            } else if (name[0] === "u" && name[1] === "_") {
              location2 = gl.getUniformLocation(program, name);
              if (location2 === null) {
                throw new Error("Program doesn't have required uniform: " + name);
              }
              foundLocations[name.slice(2)] = location2;
            } else {
              throw new Error("Couldn't figure out your intent. All uniforms should start with 'u_' prefix, and attributes with 'a_'");
            }
          }
          return foundLocations;
        }
      }
      function copyArrayPart(array, to, from, elementsCount) {
        for (var i = 0; i < elementsCount; ++i) {
          array[to + i] = array[from + i];
        }
      }
      function swapArrayPart(array, from, to, elementsCount) {
        for (var i = 0; i < elementsCount; ++i) {
          var tmp = array[from + i];
          array[from + i] = array[to + i];
          array[to + i] = tmp;
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/nullEvents.js
  var require_nullEvents = __commonJS({
    "node_modules/vivagraphjs/src/Utils/nullEvents.js"(exports, module) {
      module.exports = createNullEvents();
      function createNullEvents() {
        return {
          on: noop,
          off: noop,
          stop: noop
        };
      }
      function noop() {
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/documentEvents.js
  var require_documentEvents = __commonJS({
    "node_modules/vivagraphjs/src/Utils/documentEvents.js"(exports, module) {
      var nullEvents = require_nullEvents();
      module.exports = createDocumentEvents();
      function createDocumentEvents() {
        if (typeof document === void 0) {
          return nullEvents;
        }
        return {
          on,
          off
        };
      }
      function on(eventName, handler) {
        document.addEventListener(eventName, handler);
      }
      function off(eventName, handler) {
        document.removeEventListener(eventName, handler);
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglInputEvents.js
  var require_webglInputEvents = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglInputEvents.js"(exports, module) {
      var documentEvents = require_documentEvents();
      module.exports = webglInputEvents;
      function webglInputEvents(webglGraphics) {
        if (webglGraphics.webglInputEvents) {
          return webglGraphics.webglInputEvents;
        }
        var mouseCapturedNode = null, mouseEnterCallback = [], mouseLeaveCallback = [], mouseDownCallback = [], mouseUpCallback = [], mouseMoveCallback = [], clickCallback = [], dblClickCallback = [], prevSelectStart, boundRect;
        var root = webglGraphics.getGraphicsRoot();
        startListen(root);
        var api = {
          mouseEnter,
          mouseLeave,
          mouseDown,
          mouseUp,
          mouseMove,
          click,
          dblClick,
          mouseCapture,
          releaseMouseCapture
        };
        webglGraphics.webglInputEvents = api;
        return api;
        function releaseMouseCapture() {
          mouseCapturedNode = null;
        }
        function mouseCapture(node) {
          mouseCapturedNode = node;
        }
        function dblClick(callback) {
          if (typeof callback === "function") {
            dblClickCallback.push(callback);
          }
          return api;
        }
        function click(callback) {
          if (typeof callback === "function") {
            clickCallback.push(callback);
          }
          return api;
        }
        function mouseMove(callback) {
          if (typeof callback === "function") {
            mouseMoveCallback.push(callback);
          }
          return api;
        }
        function mouseUp(callback) {
          if (typeof callback === "function") {
            mouseUpCallback.push(callback);
          }
          return api;
        }
        function mouseDown(callback) {
          if (typeof callback === "function") {
            mouseDownCallback.push(callback);
          }
          return api;
        }
        function mouseLeave(callback) {
          if (typeof callback === "function") {
            mouseLeaveCallback.push(callback);
          }
          return api;
        }
        function mouseEnter(callback) {
          if (typeof callback === "function") {
            mouseEnterCallback.push(callback);
          }
          return api;
        }
        function preciseCheck(nodeUI, x, y) {
          if (nodeUI && nodeUI.size) {
            var pos = nodeUI.position, half = nodeUI.size;
            return pos.x - half < x && x < pos.x + half && pos.y - half < y && y < pos.y + half;
          }
          return true;
        }
        function getNodeAtClientPos(pos) {
          return webglGraphics.getNodeAtClientPos(pos, preciseCheck);
        }
        function stopPropagation(e) {
          if (e.stopPropagation) {
            e.stopPropagation();
          } else {
            e.cancelBubble = true;
          }
        }
        function handleDisabledEvent(e) {
          stopPropagation(e);
          return false;
        }
        function invoke(callbacksChain, args) {
          var i, stopPropagation2;
          for (i = 0; i < callbacksChain.length; i += 1) {
            stopPropagation2 = callbacksChain[i].apply(void 0, args);
            if (stopPropagation2) {
              return true;
            }
          }
        }
        function startListen(root2) {
          var pos = {
            x: 0,
            y: 0
          }, lastFound = null, lastUpdate = 1, lastClickTime = +/* @__PURE__ */ new Date(), handleMouseMove = function(e) {
            invoke(mouseMoveCallback, [lastFound, e]);
            pos.x = e.clientX;
            pos.y = e.clientY;
          }, handleMouseUp = function() {
            documentEvents.off("mousemove", handleMouseMove);
            documentEvents.off("mouseup", handleMouseUp);
          }, updateBoundRect = function() {
            boundRect = root2.getBoundingClientRect();
          };
          window.addEventListener("resize", updateBoundRect);
          updateBoundRect();
          root2.addEventListener(
            "mousemove",
            function(e) {
              if (mouseCapturedNode) {
                return;
              }
              if (lastUpdate++ % 7 === 0) {
                updateBoundRect();
                lastUpdate = 1;
              }
              var cancelBubble = false, node;
              pos.x = e.clientX - boundRect.left;
              pos.y = e.clientY - boundRect.top;
              node = getNodeAtClientPos(pos);
              if (node && lastFound !== node) {
                if (lastFound) {
                  invoke(mouseLeaveCallback, [lastFound]);
                }
                lastFound = node;
                cancelBubble = cancelBubble || invoke(mouseEnterCallback, [lastFound]);
              } else if (node === null && lastFound !== node) {
                cancelBubble = cancelBubble || invoke(mouseLeaveCallback, [lastFound]);
                lastFound = null;
              }
              if (cancelBubble) {
                stopPropagation(e);
              }
            }
          );
          root2.addEventListener(
            "mousedown",
            function(e) {
              var cancelBubble = false, args;
              updateBoundRect();
              pos.x = e.clientX - boundRect.left;
              pos.y = e.clientY - boundRect.top;
              args = [getNodeAtClientPos(pos), e];
              if (args[0]) {
                cancelBubble = invoke(mouseDownCallback, args);
                documentEvents.on("mousemove", handleMouseMove);
                documentEvents.on("mouseup", handleMouseUp);
                prevSelectStart = window.document.onselectstart;
                window.document.onselectstart = handleDisabledEvent;
                lastFound = args[0];
              } else {
                lastFound = null;
              }
              if (cancelBubble) {
                stopPropagation(e);
              }
            }
          );
          root2.addEventListener(
            "mouseup",
            function(e) {
              var clickTime = +/* @__PURE__ */ new Date(), args;
              pos.x = e.clientX - boundRect.left;
              pos.y = e.clientY - boundRect.top;
              var nodeAtClientPos = getNodeAtClientPos(pos);
              var sameNode = nodeAtClientPos === lastFound;
              args = [nodeAtClientPos || lastFound, e];
              if (args[0]) {
                window.document.onselectstart = prevSelectStart;
                if (clickTime - lastClickTime < 400 && sameNode) {
                  invoke(dblClickCallback, args);
                } else {
                  invoke(clickCallback, args);
                }
                lastClickTime = clickTime;
                if (invoke(mouseUpCallback, args)) {
                  stopPropagation(e);
                }
              }
            }
          );
        }
      }
    }
  });

  // node_modules/ngraph.generators/node_modules/ngraph.random/index.js
  var require_ngraph8 = __commonJS({
    "node_modules/ngraph.generators/node_modules/ngraph.random/index.js"(exports, module) {
      module.exports = random;
      module.exports.random = random, module.exports.randomIterator = randomIterator;
      function random(inputSeed) {
        var seed = typeof inputSeed === "number" ? inputSeed : +/* @__PURE__ */ new Date();
        return new Generator(seed);
      }
      function Generator(seed) {
        this.seed = seed;
      }
      Generator.prototype.next = next;
      Generator.prototype.nextDouble = nextDouble;
      Generator.prototype.uniform = nextDouble;
      Generator.prototype.gaussian = gaussian;
      function gaussian() {
        var r, x, y;
        do {
          x = this.nextDouble() * 2 - 1;
          y = this.nextDouble() * 2 - 1;
          r = x * x + y * y;
        } while (r >= 1 || r === 0);
        return x * Math.sqrt(-2 * Math.log(r) / r);
      }
      function nextDouble() {
        var seed = this.seed;
        seed = seed + 2127912214 + (seed << 12) & 4294967295;
        seed = (seed ^ 3345072700 ^ seed >>> 19) & 4294967295;
        seed = seed + 374761393 + (seed << 5) & 4294967295;
        seed = (seed + 3550635116 ^ seed << 9) & 4294967295;
        seed = seed + 4251993797 + (seed << 3) & 4294967295;
        seed = (seed ^ 3042594569 ^ seed >>> 16) & 4294967295;
        this.seed = seed;
        return (seed & 268435455) / 268435456;
      }
      function next(maxValue) {
        return Math.floor(this.nextDouble() * maxValue);
      }
      function randomIterator(array, customRandom) {
        var localRandom = customRandom || random();
        if (typeof localRandom.next !== "function") {
          throw new Error("customRandom does not match expected API: next() function is missing");
        }
        return {
          forEach,
          /**
           * Shuffles array randomly, in place.
           */
          shuffle
        };
        function shuffle() {
          var i, j, t;
          for (i = array.length - 1; i > 0; --i) {
            j = localRandom.next(i + 1);
            t = array[j];
            array[j] = array[i];
            array[i] = t;
          }
          return array;
        }
        function forEach(callback) {
          var i, j, t;
          for (i = array.length - 1; i > 0; --i) {
            j = localRandom.next(i + 1);
            t = array[j];
            array[j] = array[i];
            array[i] = t;
            callback(t);
          }
          if (array.length) {
            callback(array[0]);
          }
        }
      }
    }
  });

  // node_modules/ngraph.generators/index.js
  var require_ngraph9 = __commonJS({
    "node_modules/ngraph.generators/index.js"(exports, module) {
      var createGraph = require_ngraph4();
      module.exports = factory(createGraph);
      module.exports.factory = factory;
      function factory(createGraph2) {
        return {
          ladder,
          complete,
          completeBipartite,
          balancedBinTree,
          path,
          circularLadder,
          grid,
          grid3,
          noLinks,
          wattsStrogatz,
          cliqueCircle
        };
        function ladder(n) {
          if (!n || n < 0) {
            throw new Error("Invalid number of nodes");
          }
          var g = createGraph2(), i;
          for (i = 0; i < n - 1; ++i) {
            g.addLink(i, i + 1);
            g.addLink(n + i, n + i + 1);
            g.addLink(i, n + i);
          }
          g.addLink(n - 1, 2 * n - 1);
          return g;
        }
        function circularLadder(n) {
          if (!n || n < 0) {
            throw new Error("Invalid number of nodes");
          }
          var g = ladder(n);
          g.addLink(0, n - 1);
          g.addLink(n, 2 * n - 1);
          return g;
        }
        function complete(n) {
          if (!n || n < 1) {
            throw new Error("At least two nodes are expected for complete graph");
          }
          var g = createGraph2(), i, j;
          for (i = 0; i < n; ++i) {
            for (j = i + 1; j < n; ++j) {
              if (i !== j) {
                g.addLink(i, j);
              }
            }
          }
          return g;
        }
        function completeBipartite(n, m2) {
          if (!n || !m2 || n < 0 || m2 < 0) {
            throw new Error("Graph dimensions are invalid. Number of nodes in each partition should be greater than 0");
          }
          var g = createGraph2(), i, j;
          for (i = 0; i < n; ++i) {
            for (j = n; j < n + m2; ++j) {
              g.addLink(i, j);
            }
          }
          return g;
        }
        function path(n) {
          if (!n || n < 0) {
            throw new Error("Invalid number of nodes");
          }
          var g = createGraph2(), i;
          g.addNode(0);
          for (i = 1; i < n; ++i) {
            g.addLink(i - 1, i);
          }
          return g;
        }
        function grid(n, m2) {
          if (n < 1 || m2 < 1) {
            throw new Error("Invalid number of nodes in grid graph");
          }
          var g = createGraph2(), i, j;
          if (n === 1 && m2 === 1) {
            g.addNode(0);
            return g;
          }
          for (i = 0; i < n; ++i) {
            for (j = 0; j < m2; ++j) {
              var node = i + j * n;
              if (i > 0) {
                g.addLink(node, i - 1 + j * n);
              }
              if (j > 0) {
                g.addLink(node, i + (j - 1) * n);
              }
            }
          }
          return g;
        }
        function grid3(n, m2, z) {
          if (n < 1 || m2 < 1 || z < 1) {
            throw new Error("Invalid number of nodes in grid3 graph");
          }
          var g = createGraph2(), i, j, k;
          if (n === 1 && m2 === 1 && z === 1) {
            g.addNode(0);
            return g;
          }
          for (k = 0; k < z; ++k) {
            for (i = 0; i < n; ++i) {
              for (j = 0; j < m2; ++j) {
                var level = k * n * m2;
                var node = i + j * n + level;
                if (i > 0) {
                  g.addLink(node, i - 1 + j * n + level);
                }
                if (j > 0) {
                  g.addLink(node, i + (j - 1) * n + level);
                }
                if (k > 0) {
                  g.addLink(node, i + j * n + (k - 1) * n * m2);
                }
              }
            }
          }
          return g;
        }
        function balancedBinTree(n) {
          if (n < 0) {
            throw new Error("Invalid number of nodes in balanced tree");
          }
          var g = createGraph2(), count = Math.pow(2, n), level;
          if (n === 0) {
            g.addNode(1);
          }
          for (level = 1; level < count; ++level) {
            var root = level, left = root * 2, right = root * 2 + 1;
            g.addLink(root, left);
            g.addLink(root, right);
          }
          return g;
        }
        function noLinks(n) {
          if (n < 0) {
            throw new Error("Number of nodes should be >= 0");
          }
          var g = createGraph2(), i;
          for (i = 0; i < n; ++i) {
            g.addNode(i);
          }
          return g;
        }
        function cliqueCircle(cliqueCount, cliqueSize) {
          if (cliqueCount < 1) throw new Error("Invalid number of cliqueCount in cliqueCircle");
          if (cliqueSize < 1) throw new Error("Invalid number of cliqueSize in cliqueCircle");
          var graph = createGraph2();
          for (var i = 0; i < cliqueCount; ++i) {
            appendClique(cliqueSize, i * cliqueSize);
            if (i > 0) {
              graph.addLink(i * cliqueSize, i * cliqueSize - 1);
            }
          }
          graph.addLink(0, graph.getNodesCount() - 1);
          return graph;
          function appendClique(size, from) {
            for (var i2 = 0; i2 < size; ++i2) {
              graph.addNode(i2 + from);
            }
            for (var i2 = 0; i2 < size; ++i2) {
              for (var j = i2 + 1; j < size; ++j) {
                graph.addLink(i2 + from, j + from);
              }
            }
          }
        }
        function wattsStrogatz(n, k, p, seed) {
          if (k >= n) throw new Error("Choose smaller `k`. It cannot be larger than number of nodes `n`");
          var random = require_ngraph8().random(seed || 42);
          var g = createGraph2(), i, to;
          for (i = 0; i < n; ++i) {
            g.addNode(i);
          }
          var neighborsSize = Math.floor(k / 2 + 1);
          for (var j = 1; j < neighborsSize; ++j) {
            for (i = 0; i < n; ++i) {
              to = (j + i) % n;
              g.addLink(i, to);
            }
          }
          for (j = 1; j < neighborsSize; ++j) {
            for (i = 0; i < n; ++i) {
              if (random.nextDouble() < p) {
                var from = i;
                to = (j + i) % n;
                var newTo = random.next(n);
                var needsRewire = newTo === from || g.hasLink(from, newTo);
                if (needsRewire && g.getLinks(from).length === n - 1) {
                  continue;
                }
                while (needsRewire) {
                  newTo = random.next(n);
                  needsRewire = newTo === from || g.hasLink(from, newTo);
                }
                var link = g.hasLink(from, to);
                g.removeLink(link);
                g.addLink(from, newTo);
              }
            }
          }
          return g;
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/browserInfo.js
  var require_browserInfo = __commonJS({
    "node_modules/vivagraphjs/src/Utils/browserInfo.js"(exports, module) {
      module.exports = browserInfo();
      function browserInfo() {
        if (typeof window === "undefined" || !window.hasOwnProperty("navigator")) {
          return {
            browser: "",
            version: "0"
          };
        }
        var ua = window.navigator.userAgent.toLowerCase(), rwebkit = /(webkit)[ \/]([\w.]+)/, ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/, rmsie = /(msie) ([\w.]+)/, rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/, match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
        return {
          browser: match[1] || "",
          version: match[2] || "0"
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/findElementPosition.js
  var require_findElementPosition = __commonJS({
    "node_modules/vivagraphjs/src/Utils/findElementPosition.js"(exports, module) {
      module.exports = findElementPosition;
      function findElementPosition(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
          do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
          } while ((obj = obj.offsetParent) !== null);
        }
        return [curleft, curtop];
      }
    }
  });

  // node_modules/vivagraphjs/src/Input/dragndrop.js
  var require_dragndrop = __commonJS({
    "node_modules/vivagraphjs/src/Input/dragndrop.js"(exports, module) {
      module.exports = dragndrop;
      var documentEvents = require_documentEvents();
      var browserInfo = require_browserInfo();
      var findElementPosition = require_findElementPosition();
      function dragndrop(element) {
        var start, drag, end, scroll, prevSelectStart, prevDragStart, startX = 0, startY = 0, dragObject, touchInProgress = false, pinchZoomLength = 0, getMousePos = function(e) {
          var posx = 0, posy = 0;
          e = e || window.event;
          if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
          } else if (e.clientX || e.clientY) {
            posx = e.clientX + window.document.body.scrollLeft + window.document.documentElement.scrollLeft;
            posy = e.clientY + window.document.body.scrollTop + window.document.documentElement.scrollTop;
          }
          return [posx, posy];
        }, move = function(e, clientX, clientY) {
          if (drag) {
            drag(e, { x: clientX - startX, y: clientY - startY });
          }
          startX = clientX;
          startY = clientY;
        }, stopPropagation = function(e) {
          if (e.stopPropagation) {
            e.stopPropagation();
          } else {
            e.cancelBubble = true;
          }
        }, preventDefault = function(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
        }, handleDisabledEvent = function(e) {
          stopPropagation(e);
          return false;
        }, handleMouseMove = function(e) {
          e = e || window.event;
          move(e, e.clientX, e.clientY);
        }, handleMouseDown = function(e) {
          e = e || window.event;
          if (touchInProgress) {
            stopPropagation(e);
            return false;
          }
          var isLeftButton = e.button === 1 && window.event !== null || e.button === 0;
          if (isLeftButton) {
            startX = e.clientX;
            startY = e.clientY;
            dragObject = e.target || e.srcElement;
            if (start) {
              start(e, { x: startX, y: startY });
            }
            documentEvents.on("mousemove", handleMouseMove);
            documentEvents.on("mouseup", handleMouseUp);
            stopPropagation(e);
            prevSelectStart = window.document.onselectstart;
            prevDragStart = window.document.ondragstart;
            window.document.onselectstart = handleDisabledEvent;
            dragObject.ondragstart = handleDisabledEvent;
            return false;
          }
        }, handleMouseUp = function(e) {
          e = e || window.event;
          documentEvents.off("mousemove", handleMouseMove);
          documentEvents.off("mouseup", handleMouseUp);
          window.document.onselectstart = prevSelectStart;
          dragObject.ondragstart = prevDragStart;
          dragObject = null;
          if (end) {
            end(e);
          }
        }, handleMouseWheel = function(e) {
          if (typeof scroll !== "function") {
            return;
          }
          e = e || window.event;
          if (e.preventDefault) {
            e.preventDefault();
          }
          e.returnValue = false;
          var delta, mousePos = getMousePos(e), elementOffset = findElementPosition(element), relMousePos = {
            x: mousePos[0] - elementOffset[0],
            y: mousePos[1] - elementOffset[1]
          };
          if (e.wheelDelta) {
            delta = e.wheelDelta / 360;
          } else {
            delta = e.detail / -9;
          }
          scroll(e, delta, relMousePos);
        }, updateScrollEvents = function(scrollCallback) {
          if (!scroll && scrollCallback) {
            if (browserInfo.browser === "webkit") {
              element.addEventListener("mousewheel", handleMouseWheel, false);
            } else {
              element.addEventListener("DOMMouseScroll", handleMouseWheel, false);
            }
          } else if (scroll && !scrollCallback) {
            if (browserInfo.browser === "webkit") {
              element.removeEventListener("mousewheel", handleMouseWheel, false);
            } else {
              element.removeEventListener("DOMMouseScroll", handleMouseWheel, false);
            }
          }
          scroll = scrollCallback;
        }, getPinchZoomLength = function(finger1, finger2) {
          return (finger1.clientX - finger2.clientX) * (finger1.clientX - finger2.clientX) + (finger1.clientY - finger2.clientY) * (finger1.clientY - finger2.clientY);
        }, handleTouchMove = function(e) {
          if (e.touches.length === 1) {
            stopPropagation(e);
            var touch = e.touches[0];
            move(e, touch.clientX, touch.clientY);
          } else if (e.touches.length === 2) {
            var currentPinchLength = getPinchZoomLength(e.touches[0], e.touches[1]);
            var delta = 0;
            if (currentPinchLength < pinchZoomLength) {
              delta = -1;
            } else if (currentPinchLength > pinchZoomLength) {
              delta = 1;
            }
            scroll(e, delta, { x: e.touches[0].clientX, y: e.touches[0].clientY });
            pinchZoomLength = currentPinchLength;
            stopPropagation(e);
            preventDefault(e);
          }
        }, handleTouchEnd = function(e) {
          touchInProgress = false;
          documentEvents.off("touchmove", handleTouchMove);
          documentEvents.off("touchend", handleTouchEnd);
          documentEvents.off("touchcancel", handleTouchEnd);
          dragObject = null;
          if (end) {
            end(e);
          }
        }, handleSignleFingerTouch = function(e, touch) {
          stopPropagation(e);
          preventDefault(e);
          startX = touch.clientX;
          startY = touch.clientY;
          dragObject = e.target || e.srcElement;
          if (start) {
            start(e, { x: startX, y: startY });
          }
          if (!touchInProgress) {
            touchInProgress = true;
            documentEvents.on("touchmove", handleTouchMove);
            documentEvents.on("touchend", handleTouchEnd);
            documentEvents.on("touchcancel", handleTouchEnd);
          }
        }, handleTouchStart = function(e) {
          if (e.touches.length === 1) {
            return handleSignleFingerTouch(e, e.touches[0]);
          } else if (e.touches.length === 2) {
            stopPropagation(e);
            preventDefault(e);
            pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1]);
          }
        };
        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("touchstart", handleTouchStart);
        return {
          onStart: function(callback) {
            start = callback;
            return this;
          },
          onDrag: function(callback) {
            drag = callback;
            return this;
          },
          onStop: function(callback) {
            end = callback;
            return this;
          },
          /**
           * Occurs when mouse wheel event happens. callback = function(e, scrollDelta, scrollPoint);
           */
          onScroll: function(callback) {
            updateScrollEvents(callback);
            return this;
          },
          release: function() {
            element.removeEventListener("mousedown", handleMouseDown);
            element.removeEventListener("touchstart", handleTouchStart);
            documentEvents.off("mousemove", handleMouseMove);
            documentEvents.off("mouseup", handleMouseUp);
            documentEvents.off("touchmove", handleTouchMove);
            documentEvents.off("touchend", handleTouchEnd);
            documentEvents.off("touchcancel", handleTouchEnd);
            updateScrollEvents(null);
          }
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/Input/domInputManager.js
  var require_domInputManager = __commonJS({
    "node_modules/vivagraphjs/src/Input/domInputManager.js"(exports, module) {
      module.exports = domInputManager;
      var dragndrop = require_dragndrop();
      function domInputManager(graph, graphics) {
        var nodeEvents = {};
        return {
          /**
           * Called by renderer to listen to drag-n-drop events from node. E.g. for SVG
           * graphics we may listen to DOM events, whereas for WebGL the graphics
           * should provide custom eventing mechanism.
           *
           * @param node - to be monitored.
           * @param handlers - object with set of three callbacks:
           *   onStart: function(),
           *   onDrag: function(e, offset),
           *   onStop: function()
           */
          bindDragNDrop
        };
        function bindDragNDrop(node, handlers) {
          var events;
          if (handlers) {
            var nodeUI = graphics.getNodeUI(node.id);
            events = dragndrop(nodeUI);
            if (typeof handlers.onStart === "function") {
              events.onStart(handlers.onStart);
            }
            if (typeof handlers.onDrag === "function") {
              events.onDrag(handlers.onDrag);
            }
            if (typeof handlers.onStop === "function") {
              events.onStop(handlers.onStop);
            }
            nodeEvents[node.id] = events;
          } else if (events = nodeEvents[node.id]) {
            events.release();
            delete nodeEvents[node.id];
          }
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/Input/webglInputManager.js
  var require_webglInputManager = __commonJS({
    "node_modules/vivagraphjs/src/Input/webglInputManager.js"(exports, module) {
      module.exports = webglInputManager;
      var createInputEvents = require_webglInputEvents();
      function webglInputManager(graph, graphics) {
        var inputEvents = createInputEvents(graphics), draggedNode = null, internalHandlers = {}, pos = { x: 0, y: 0 };
        inputEvents.mouseDown(function(node, e) {
          draggedNode = node;
          pos.x = e.clientX;
          pos.y = e.clientY;
          inputEvents.mouseCapture(draggedNode);
          var handlers = internalHandlers[node.id];
          if (handlers && handlers.onStart) {
            handlers.onStart(e, pos);
          }
          return true;
        }).mouseUp(function(node) {
          inputEvents.releaseMouseCapture(draggedNode);
          draggedNode = null;
          var handlers = internalHandlers[node.id];
          if (handlers && handlers.onStop) {
            handlers.onStop();
          }
          return true;
        }).mouseMove(function(node, e) {
          if (draggedNode) {
            var handlers = internalHandlers[draggedNode.id];
            if (handlers && handlers.onDrag) {
              handlers.onDrag(e, { x: e.clientX - pos.x, y: e.clientY - pos.y });
            }
            pos.x = e.clientX;
            pos.y = e.clientY;
            return true;
          }
        });
        return {
          /**
           * Called by renderer to listen to drag-n-drop events from node. E.g. for SVG
           * graphics we may listen to DOM events, whereas for WebGL we graphics
           * should provide custom eventing mechanism.
           *
           * @param node - to be monitored.
           * @param handlers - object with set of three callbacks:
           *   onStart: function(),
           *   onDrag: function(e, offset),
           *   onStop: function()
           */
          bindDragNDrop: function(node, handlers) {
            internalHandlers[node.id] = handlers;
            if (!handlers) {
              delete internalHandlers[node.id];
            }
          }
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/timer.js
  var require_timer = __commonJS({
    "node_modules/vivagraphjs/src/Utils/timer.js"(exports, module) {
      module.exports = createTimer();
      function createTimer() {
        var lastTime = 0, vendors = ["ms", "moz", "webkit", "o"], i, scope;
        if (typeof window !== "undefined") {
          scope = window;
        } else if (typeof global !== "undefined") {
          scope = global;
        } else {
          scope = {
            setTimeout: noop,
            clearTimeout: noop
          };
        }
        for (i = 0; i < vendors.length && !scope.requestAnimationFrame; ++i) {
          var vendorPrefix = vendors[i];
          scope.requestAnimationFrame = scope[vendorPrefix + "RequestAnimationFrame"];
          scope.cancelAnimationFrame = scope[vendorPrefix + "CancelAnimationFrame"] || scope[vendorPrefix + "CancelRequestAnimationFrame"];
        }
        if (!scope.requestAnimationFrame) {
          scope.requestAnimationFrame = rafPolyfill;
        }
        if (!scope.cancelAnimationFrame) {
          scope.cancelAnimationFrame = cancelRafPolyfill;
        }
        return timer;
        function timer(callback) {
          var intervalId;
          startTimer();
          return {
            /**
             * Stops execution of the callback
             */
            stop: stopTimer,
            restart
          };
          function startTimer() {
            intervalId = scope.requestAnimationFrame(startTimer);
            if (!callback()) {
              stopTimer();
            }
          }
          function stopTimer() {
            scope.cancelAnimationFrame(intervalId);
            intervalId = 0;
          }
          function restart() {
            if (!intervalId) {
              startTimer();
            }
          }
        }
        function rafPolyfill(callback) {
          var currTime = (/* @__PURE__ */ new Date()).getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = scope.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        }
        function cancelRafPolyfill(id) {
          scope.clearTimeout(id);
        }
      }
      function noop() {
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/getDimensions.js
  var require_getDimensions = __commonJS({
    "node_modules/vivagraphjs/src/Utils/getDimensions.js"(exports, module) {
      module.exports = getDimension;
      function getDimension(container) {
        if (!container) {
          throw {
            message: "Cannot get dimensions of undefined container"
          };
        }
        var width = container.clientWidth;
        var height = container.clientHeight;
        return {
          left: 0,
          top: 0,
          width,
          height
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/backwardCompatibleEvents.js
  var require_backwardCompatibleEvents = __commonJS({
    "node_modules/vivagraphjs/src/Utils/backwardCompatibleEvents.js"(exports, module) {
      var events = require_ngraph3();
      module.exports = backwardCompatibleEvents;
      function backwardCompatibleEvents(g) {
        console.log("This method is deprecated. Please use Viva.events() instead");
        if (!g) {
          return g;
        }
        var eventsDefined = g.on !== void 0 || g.off !== void 0 || g.fire !== void 0;
        if (eventsDefined) {
          return {
            extend: function() {
              return g;
            },
            on: g.on,
            stop: g.off
          };
        }
        return {
          extend,
          on: g.on,
          stop: g.off
        };
        function extend() {
          var backwardCompatible = events(g);
          backwardCompatible.addEventListener = backwardCompatible.on;
          return backwardCompatible;
        }
      }
    }
  });

  // node_modules/ngraph.physics.simulator/lib/spring.js
  var require_spring = __commonJS({
    "node_modules/ngraph.physics.simulator/lib/spring.js"(exports, module) {
      module.exports = Spring;
      function Spring(fromBody, toBody, length, coeff, weight) {
        this.from = fromBody;
        this.to = toBody;
        this.length = length;
        this.coeff = coeff;
        this.weight = typeof weight === "number" ? weight : 1;
      }
    }
  });

  // node_modules/ngraph.expose/index.js
  var require_ngraph10 = __commonJS({
    "node_modules/ngraph.expose/index.js"(exports, module) {
      module.exports = exposeProperties;
      function exposeProperties(settings, target, filter) {
        var needsFilter = Object.prototype.toString.call(filter) === "[object Array]";
        if (needsFilter) {
          for (var i = 0; i < filter.length; ++i) {
            augment(settings, target, filter[i]);
          }
        } else {
          for (var key in settings) {
            augment(settings, target, key);
          }
        }
      }
      function augment(source, target, key) {
        if (source.hasOwnProperty(key)) {
          if (typeof target[key] === "function") {
            return;
          }
          target[key] = function(value) {
            if (value !== void 0) {
              source[key] = value;
              return target;
            }
            return source[key];
          };
        }
      }
    }
  });

  // node_modules/ngraph.quadtreebh/node.js
  var require_node = __commonJS({
    "node_modules/ngraph.quadtreebh/node.js"(exports, module) {
      module.exports = function Node() {
        this.body = null;
        this.quad0 = null;
        this.quad1 = null;
        this.quad2 = null;
        this.quad3 = null;
        this.mass = 0;
        this.massX = 0;
        this.massY = 0;
        this.left = 0;
        this.top = 0;
        this.bottom = 0;
        this.right = 0;
      };
    }
  });

  // node_modules/ngraph.quadtreebh/insertStack.js
  var require_insertStack = __commonJS({
    "node_modules/ngraph.quadtreebh/insertStack.js"(exports, module) {
      module.exports = InsertStack;
      function InsertStack() {
        this.stack = [];
        this.popIdx = 0;
      }
      InsertStack.prototype = {
        isEmpty: function() {
          return this.popIdx === 0;
        },
        push: function(node, body) {
          var item = this.stack[this.popIdx];
          if (!item) {
            this.stack[this.popIdx] = new InsertStackElement(node, body);
          } else {
            item.node = node;
            item.body = body;
          }
          ++this.popIdx;
        },
        pop: function() {
          if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
          }
        },
        reset: function() {
          this.popIdx = 0;
        }
      };
      function InsertStackElement(node, body) {
        this.node = node;
        this.body = body;
      }
    }
  });

  // node_modules/ngraph.quadtreebh/isSamePosition.js
  var require_isSamePosition = __commonJS({
    "node_modules/ngraph.quadtreebh/isSamePosition.js"(exports, module) {
      module.exports = function isSamePosition(point1, point2) {
        var dx = Math.abs(point1.x - point2.x);
        var dy = Math.abs(point1.y - point2.y);
        return dx < 1e-8 && dy < 1e-8;
      };
    }
  });

  // node_modules/ngraph.quadtreebh/index.js
  var require_ngraph11 = __commonJS({
    "node_modules/ngraph.quadtreebh/index.js"(exports, module) {
      module.exports = function(options) {
        options = options || {};
        options.gravity = typeof options.gravity === "number" ? options.gravity : -1;
        options.theta = typeof options.theta === "number" ? options.theta : 0.8;
        var random = require_ngraph().random(1984), Node = require_node(), InsertStack = require_insertStack(), isSamePosition = require_isSamePosition();
        var gravity = options.gravity, updateQueue = [], insertStack = new InsertStack(), theta = options.theta, nodesCache = [], currentInCache = 0, root = newNode();
        return {
          insertBodies,
          /**
           * Gets root node if its present
           */
          getRoot: function() {
            return root;
          },
          updateBodyForce: update,
          options: function(newOptions) {
            if (newOptions) {
              if (typeof newOptions.gravity === "number") {
                gravity = newOptions.gravity;
              }
              if (typeof newOptions.theta === "number") {
                theta = newOptions.theta;
              }
              return this;
            }
            return {
              gravity,
              theta
            };
          }
        };
        function newNode() {
          var node = nodesCache[currentInCache];
          if (node) {
            node.quad0 = null;
            node.quad1 = null;
            node.quad2 = null;
            node.quad3 = null;
            node.body = null;
            node.mass = node.massX = node.massY = 0;
            node.left = node.right = node.top = node.bottom = 0;
          } else {
            node = new Node();
            nodesCache[currentInCache] = node;
          }
          ++currentInCache;
          return node;
        }
        function update(sourceBody) {
          var queue = updateQueue, v, dx, dy, r, fx = 0, fy = 0, queueLength = 1, shiftIdx = 0, pushIdx = 1;
          queue[0] = root;
          while (queueLength) {
            var node = queue[shiftIdx], body = node.body;
            queueLength -= 1;
            shiftIdx += 1;
            var differentBody = body !== sourceBody;
            if (body && differentBody) {
              dx = body.pos.x - sourceBody.pos.x;
              dy = body.pos.y - sourceBody.pos.y;
              r = Math.sqrt(dx * dx + dy * dy);
              if (r === 0) {
                dx = (random.nextDouble() - 0.5) / 50;
                dy = (random.nextDouble() - 0.5) / 50;
                r = Math.sqrt(dx * dx + dy * dy);
              }
              v = gravity * body.mass * sourceBody.mass / (r * r * r);
              fx += v * dx;
              fy += v * dy;
            } else if (differentBody) {
              dx = node.massX / node.mass - sourceBody.pos.x;
              dy = node.massY / node.mass - sourceBody.pos.y;
              r = Math.sqrt(dx * dx + dy * dy);
              if (r === 0) {
                dx = (random.nextDouble() - 0.5) / 50;
                dy = (random.nextDouble() - 0.5) / 50;
                r = Math.sqrt(dx * dx + dy * dy);
              }
              if ((node.right - node.left) / r < theta) {
                v = gravity * node.mass * sourceBody.mass / (r * r * r);
                fx += v * dx;
                fy += v * dy;
              } else {
                if (node.quad0) {
                  queue[pushIdx] = node.quad0;
                  queueLength += 1;
                  pushIdx += 1;
                }
                if (node.quad1) {
                  queue[pushIdx] = node.quad1;
                  queueLength += 1;
                  pushIdx += 1;
                }
                if (node.quad2) {
                  queue[pushIdx] = node.quad2;
                  queueLength += 1;
                  pushIdx += 1;
                }
                if (node.quad3) {
                  queue[pushIdx] = node.quad3;
                  queueLength += 1;
                  pushIdx += 1;
                }
              }
            }
          }
          sourceBody.force.x += fx;
          sourceBody.force.y += fy;
        }
        function insertBodies(bodies) {
          var x1 = Number.MAX_VALUE, y1 = Number.MAX_VALUE, x2 = Number.MIN_VALUE, y2 = Number.MIN_VALUE, i, max = bodies.length;
          i = max;
          while (i--) {
            var x = bodies[i].pos.x;
            var y = bodies[i].pos.y;
            if (x < x1) {
              x1 = x;
            }
            if (x > x2) {
              x2 = x;
            }
            if (y < y1) {
              y1 = y;
            }
            if (y > y2) {
              y2 = y;
            }
          }
          var dx = x2 - x1, dy = y2 - y1;
          if (dx > dy) {
            y2 = y1 + dx;
          } else {
            x2 = x1 + dy;
          }
          currentInCache = 0;
          root = newNode();
          root.left = x1;
          root.right = x2;
          root.top = y1;
          root.bottom = y2;
          i = max - 1;
          if (i >= 0) {
            root.body = bodies[i];
          }
          while (i--) {
            insert(bodies[i], root);
          }
        }
        function insert(newBody) {
          insertStack.reset();
          insertStack.push(root, newBody);
          while (!insertStack.isEmpty()) {
            var stackItem = insertStack.pop(), node = stackItem.node, body = stackItem.body;
            if (!node.body) {
              var x = body.pos.x;
              var y = body.pos.y;
              node.mass = node.mass + body.mass;
              node.massX = node.massX + body.mass * x;
              node.massY = node.massY + body.mass * y;
              var quadIdx = 0, left = node.left, right = (node.right + left) / 2, top = node.top, bottom = (node.bottom + top) / 2;
              if (x > right) {
                quadIdx = quadIdx + 1;
                left = right;
                right = node.right;
              }
              if (y > bottom) {
                quadIdx = quadIdx + 2;
                top = bottom;
                bottom = node.bottom;
              }
              var child = getChild(node, quadIdx);
              if (!child) {
                child = newNode();
                child.left = left;
                child.top = top;
                child.right = right;
                child.bottom = bottom;
                child.body = body;
                setChild(node, quadIdx, child);
              } else {
                insertStack.push(child, body);
              }
            } else {
              var oldBody = node.body;
              node.body = null;
              if (isSamePosition(oldBody.pos, body.pos)) {
                var retriesCount = 3;
                do {
                  var offset = random.nextDouble();
                  var dx = (node.right - node.left) * offset;
                  var dy = (node.bottom - node.top) * offset;
                  oldBody.pos.x = node.left + dx;
                  oldBody.pos.y = node.top + dy;
                  retriesCount -= 1;
                } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));
                if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
                  return;
                }
              }
              insertStack.push(node, oldBody);
              insertStack.push(node, body);
            }
          }
        }
      };
      function getChild(node, idx) {
        if (idx === 0) return node.quad0;
        if (idx === 1) return node.quad1;
        if (idx === 2) return node.quad2;
        if (idx === 3) return node.quad3;
        return null;
      }
      function setChild(node, idx, child) {
        if (idx === 0) node.quad0 = child;
        else if (idx === 1) node.quad1 = child;
        else if (idx === 2) node.quad2 = child;
        else if (idx === 3) node.quad3 = child;
      }
    }
  });

  // node_modules/ngraph.physics.simulator/lib/bounds.js
  var require_bounds = __commonJS({
    "node_modules/ngraph.physics.simulator/lib/bounds.js"(exports, module) {
      module.exports = function(bodies, settings) {
        var random = require_ngraph().random(42);
        var boundingBox = { x1: 0, y1: 0, x2: 0, y2: 0 };
        return {
          box: boundingBox,
          update: updateBoundingBox,
          reset: function() {
            boundingBox.x1 = boundingBox.y1 = 0;
            boundingBox.x2 = boundingBox.y2 = 0;
          },
          getBestNewPosition: function(neighbors) {
            var graphRect = boundingBox;
            var baseX = 0, baseY = 0;
            if (neighbors.length) {
              for (var i = 0; i < neighbors.length; ++i) {
                baseX += neighbors[i].pos.x;
                baseY += neighbors[i].pos.y;
              }
              baseX /= neighbors.length;
              baseY /= neighbors.length;
            } else {
              baseX = (graphRect.x1 + graphRect.x2) / 2;
              baseY = (graphRect.y1 + graphRect.y2) / 2;
            }
            var springLength = settings.springLength;
            return {
              x: baseX + random.next(springLength) - springLength / 2,
              y: baseY + random.next(springLength) - springLength / 2
            };
          }
        };
        function updateBoundingBox() {
          var i = bodies.length;
          if (i === 0) {
            return;
          }
          var x1 = Number.MAX_VALUE, y1 = Number.MAX_VALUE, x2 = Number.MIN_VALUE, y2 = Number.MIN_VALUE;
          while (i--) {
            var body = bodies[i];
            if (body.isPinned) {
              body.pos.x = body.prevPos.x;
              body.pos.y = body.prevPos.y;
            } else {
              body.prevPos.x = body.pos.x;
              body.prevPos.y = body.pos.y;
            }
            if (body.pos.x < x1) {
              x1 = body.pos.x;
            }
            if (body.pos.x > x2) {
              x2 = body.pos.x;
            }
            if (body.pos.y < y1) {
              y1 = body.pos.y;
            }
            if (body.pos.y > y2) {
              y2 = body.pos.y;
            }
          }
          boundingBox.x1 = x1;
          boundingBox.x2 = x2;
          boundingBox.y1 = y1;
          boundingBox.y2 = y2;
        }
      };
    }
  });

  // node_modules/ngraph.physics.simulator/lib/dragForce.js
  var require_dragForce = __commonJS({
    "node_modules/ngraph.physics.simulator/lib/dragForce.js"(exports, module) {
      module.exports = function(options) {
        var merge = require_ngraph2(), expose = require_ngraph10();
        options = merge(options, {
          dragCoeff: 0.02
        });
        var api = {
          update: function(body) {
            body.force.x -= options.dragCoeff * body.velocity.x;
            body.force.y -= options.dragCoeff * body.velocity.y;
          }
        };
        expose(options, api, ["dragCoeff"]);
        return api;
      };
    }
  });

  // node_modules/ngraph.physics.simulator/lib/springForce.js
  var require_springForce = __commonJS({
    "node_modules/ngraph.physics.simulator/lib/springForce.js"(exports, module) {
      module.exports = function(options) {
        var merge = require_ngraph2();
        var random = require_ngraph().random(42);
        var expose = require_ngraph10();
        options = merge(options, {
          springCoeff: 2e-4,
          springLength: 80
        });
        var api = {
          /**
           * Upsates forces acting on a spring
           */
          update: function(spring) {
            var body1 = spring.from, body2 = spring.to, length = spring.length < 0 ? options.springLength : spring.length, dx = body2.pos.x - body1.pos.x, dy = body2.pos.y - body1.pos.y, r = Math.sqrt(dx * dx + dy * dy);
            if (r === 0) {
              dx = (random.nextDouble() - 0.5) / 50;
              dy = (random.nextDouble() - 0.5) / 50;
              r = Math.sqrt(dx * dx + dy * dy);
            }
            var d = r - length;
            var coeff = (!spring.coeff || spring.coeff < 0 ? options.springCoeff : spring.coeff) * d / r * spring.weight;
            body1.force.x += coeff * dx;
            body1.force.y += coeff * dy;
            body2.force.x -= coeff * dx;
            body2.force.y -= coeff * dy;
          }
        };
        expose(options, api, ["springCoeff", "springLength"]);
        return api;
      };
    }
  });

  // node_modules/ngraph.physics.simulator/lib/eulerIntegrator.js
  var require_eulerIntegrator = __commonJS({
    "node_modules/ngraph.physics.simulator/lib/eulerIntegrator.js"(exports, module) {
      module.exports = integrate;
      function integrate(bodies, timeStep) {
        var dx = 0, tx = 0, dy = 0, ty = 0, i, max = bodies.length;
        if (max === 0) {
          return 0;
        }
        for (i = 0; i < max; ++i) {
          var body = bodies[i], coeff = timeStep / body.mass;
          body.velocity.x += coeff * body.force.x;
          body.velocity.y += coeff * body.force.y;
          var vx = body.velocity.x, vy = body.velocity.y, v = Math.sqrt(vx * vx + vy * vy);
          if (v > 1) {
            body.velocity.x = vx / v;
            body.velocity.y = vy / v;
          }
          dx = timeStep * body.velocity.x;
          dy = timeStep * body.velocity.y;
          body.pos.x += dx;
          body.pos.y += dy;
          tx += Math.abs(dx);
          ty += Math.abs(dy);
        }
        return (tx * tx + ty * ty) / max;
      }
    }
  });

  // node_modules/ngraph.physics.primitives/index.js
  var require_ngraph_physics = __commonJS({
    "node_modules/ngraph.physics.primitives/index.js"(exports, module) {
      module.exports = {
        Body,
        Vector2d,
        Body3d,
        Vector3d
      };
      function Body(x, y) {
        this.pos = new Vector2d(x, y);
        this.prevPos = new Vector2d(x, y);
        this.force = new Vector2d();
        this.velocity = new Vector2d();
        this.mass = 1;
      }
      Body.prototype.setPosition = function(x, y) {
        this.prevPos.x = this.pos.x = x;
        this.prevPos.y = this.pos.y = y;
      };
      function Vector2d(x, y) {
        if (x && typeof x !== "number") {
          this.x = typeof x.x === "number" ? x.x : 0;
          this.y = typeof x.y === "number" ? x.y : 0;
        } else {
          this.x = typeof x === "number" ? x : 0;
          this.y = typeof y === "number" ? y : 0;
        }
      }
      Vector2d.prototype.reset = function() {
        this.x = this.y = 0;
      };
      function Body3d(x, y, z) {
        this.pos = new Vector3d(x, y, z);
        this.prevPos = new Vector3d(x, y, z);
        this.force = new Vector3d();
        this.velocity = new Vector3d();
        this.mass = 1;
      }
      Body3d.prototype.setPosition = function(x, y, z) {
        this.prevPos.x = this.pos.x = x;
        this.prevPos.y = this.pos.y = y;
        this.prevPos.z = this.pos.z = z;
      };
      function Vector3d(x, y, z) {
        if (x && typeof x !== "number") {
          this.x = typeof x.x === "number" ? x.x : 0;
          this.y = typeof x.y === "number" ? x.y : 0;
          this.z = typeof x.z === "number" ? x.z : 0;
        } else {
          this.x = typeof x === "number" ? x : 0;
          this.y = typeof y === "number" ? y : 0;
          this.z = typeof z === "number" ? z : 0;
        }
      }
      Vector3d.prototype.reset = function() {
        this.x = this.y = this.z = 0;
      };
    }
  });

  // node_modules/ngraph.physics.simulator/lib/createBody.js
  var require_createBody = __commonJS({
    "node_modules/ngraph.physics.simulator/lib/createBody.js"(exports, module) {
      var physics = require_ngraph_physics();
      module.exports = function(pos) {
        return new physics.Body(pos);
      };
    }
  });

  // node_modules/ngraph.physics.simulator/index.js
  var require_ngraph_physics2 = __commonJS({
    "node_modules/ngraph.physics.simulator/index.js"(exports, module) {
      module.exports = physicsSimulator;
      function physicsSimulator(settings) {
        var Spring = require_spring();
        var expose = require_ngraph10();
        var merge = require_ngraph2();
        var eventify = require_ngraph3();
        settings = merge(settings, {
          /**
           * Ideal length for links (springs in physical model).
           */
          springLength: 30,
          /**
           * Hook's law coefficient. 1 - solid spring.
           */
          springCoeff: 8e-4,
          /**
           * Coulomb's law coefficient. It's used to repel nodes thus should be negative
           * if you make it positive nodes start attract each other :).
           */
          gravity: -1.2,
          /**
           * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
           * The closer it's to 1 the more nodes algorithm will have to go through.
           * Setting it to one makes Barnes Hut simulation no different from
           * brute-force forces calculation (each node is considered).
           */
          theta: 0.8,
          /**
           * Drag force coefficient. Used to slow down system, thus should be less than 1.
           * The closer it is to 0 the less tight system will be.
           */
          dragCoeff: 0.02,
          /**
           * Default time step (dt) for forces integration
           */
          timeStep: 20
        });
        var createQuadTree = settings.createQuadTree || require_ngraph11();
        var createBounds = settings.createBounds || require_bounds();
        var createDragForce = settings.createDragForce || require_dragForce();
        var createSpringForce = settings.createSpringForce || require_springForce();
        var integrate = settings.integrator || require_eulerIntegrator();
        var createBody = settings.createBody || require_createBody();
        var bodies = [], springs = [], quadTree = createQuadTree(settings), bounds = createBounds(bodies, settings), springForce = createSpringForce(settings), dragForce = createDragForce(settings);
        var bboxNeedsUpdate = true;
        var totalMovement = 0;
        var publicApi = {
          /**
           * Array of bodies, registered with current simulator
           *
           * Note: To add new body, use addBody() method. This property is only
           * exposed for testing/performance purposes.
           */
          bodies,
          quadTree,
          /**
           * Array of springs, registered with current simulator
           *
           * Note: To add new spring, use addSpring() method. This property is only
           * exposed for testing/performance purposes.
           */
          springs,
          /**
           * Returns settings with which current simulator was initialized
           */
          settings,
          /**
           * Performs one step of force simulation.
           *
           * @returns {boolean} true if system is considered stable; False otherwise.
           */
          step: function() {
            accumulateForces();
            var movement = integrate(bodies, settings.timeStep);
            bounds.update();
            return movement;
          },
          /**
           * Adds body to the system
           *
           * @param {ngraph.physics.primitives.Body} body physical body
           *
           * @returns {ngraph.physics.primitives.Body} added body
           */
          addBody: function(body) {
            if (!body) {
              throw new Error("Body is required");
            }
            bodies.push(body);
            return body;
          },
          /**
           * Adds body to the system at given position
           *
           * @param {Object} pos position of a body
           *
           * @returns {ngraph.physics.primitives.Body} added body
           */
          addBodyAt: function(pos) {
            if (!pos) {
              throw new Error("Body position is required");
            }
            var body = createBody(pos);
            bodies.push(body);
            return body;
          },
          /**
           * Removes body from the system
           *
           * @param {ngraph.physics.primitives.Body} body to remove
           *
           * @returns {Boolean} true if body found and removed. falsy otherwise;
           */
          removeBody: function(body) {
            if (!body) {
              return;
            }
            var idx = bodies.indexOf(body);
            if (idx < 0) {
              return;
            }
            bodies.splice(idx, 1);
            if (bodies.length === 0) {
              bounds.reset();
            }
            return true;
          },
          /**
           * Adds a spring to this simulation.
           *
           * @returns {Object} - a handle for a spring. If you want to later remove
           * spring pass it to removeSpring() method.
           */
          addSpring: function(body1, body2, springLength, springWeight, springCoefficient) {
            if (!body1 || !body2) {
              throw new Error("Cannot add null spring to force simulator");
            }
            if (typeof springLength !== "number") {
              springLength = -1;
            }
            var spring = new Spring(body1, body2, springLength, springCoefficient >= 0 ? springCoefficient : -1, springWeight);
            springs.push(spring);
            return spring;
          },
          /**
           * Returns amount of movement performed on last step() call
           */
          getTotalMovement: function() {
            return totalMovement;
          },
          /**
           * Removes spring from the system
           *
           * @param {Object} spring to remove. Spring is an object returned by addSpring
           *
           * @returns {Boolean} true if spring found and removed. falsy otherwise;
           */
          removeSpring: function(spring) {
            if (!spring) {
              return;
            }
            var idx = springs.indexOf(spring);
            if (idx > -1) {
              springs.splice(idx, 1);
              return true;
            }
          },
          getBestNewBodyPosition: function(neighbors) {
            return bounds.getBestNewPosition(neighbors);
          },
          /**
           * Returns bounding box which covers all bodies
           */
          getBBox: function() {
            if (bboxNeedsUpdate) {
              bounds.update();
              bboxNeedsUpdate = false;
            }
            return bounds.box;
          },
          invalidateBBox: function() {
            bboxNeedsUpdate = true;
          },
          gravity: function(value) {
            if (value !== void 0) {
              settings.gravity = value;
              quadTree.options({ gravity: value });
              return this;
            } else {
              return settings.gravity;
            }
          },
          theta: function(value) {
            if (value !== void 0) {
              settings.theta = value;
              quadTree.options({ theta: value });
              return this;
            } else {
              return settings.theta;
            }
          }
        };
        expose(settings, publicApi);
        eventify(publicApi);
        return publicApi;
        function accumulateForces() {
          var body, i = bodies.length;
          if (i) {
            quadTree.insertBodies(bodies);
            while (i--) {
              body = bodies[i];
              if (!body.isPinned) {
                body.force.reset();
                quadTree.updateBodyForce(body);
                dragForce.update(body);
              }
            }
          }
          i = springs.length;
          while (i--) {
            springForce.update(springs[i]);
          }
        }
      }
    }
  });

  // node_modules/ngraph.forcelayout/node_modules/ngraph.events/index.js
  var require_ngraph12 = __commonJS({
    "node_modules/ngraph.forcelayout/node_modules/ngraph.events/index.js"(exports, module) {
      module.exports = function(subject) {
        validateSubject(subject);
        var eventsStorage = createEventsStorage(subject);
        subject.on = eventsStorage.on;
        subject.off = eventsStorage.off;
        subject.fire = eventsStorage.fire;
        return subject;
      };
      function createEventsStorage(subject) {
        var registeredEvents = /* @__PURE__ */ Object.create(null);
        return {
          on: function(eventName, callback, ctx) {
            if (typeof callback !== "function") {
              throw new Error("callback is expected to be a function");
            }
            var handlers = registeredEvents[eventName];
            if (!handlers) {
              handlers = registeredEvents[eventName] = [];
            }
            handlers.push({ callback, ctx });
            return subject;
          },
          off: function(eventName, callback) {
            var wantToRemoveAll = typeof eventName === "undefined";
            if (wantToRemoveAll) {
              registeredEvents = /* @__PURE__ */ Object.create(null);
              return subject;
            }
            if (registeredEvents[eventName]) {
              var deleteAllCallbacksForEvent = typeof callback !== "function";
              if (deleteAllCallbacksForEvent) {
                delete registeredEvents[eventName];
              } else {
                var callbacks = registeredEvents[eventName];
                for (var i = 0; i < callbacks.length; ++i) {
                  if (callbacks[i].callback === callback) {
                    callbacks.splice(i, 1);
                  }
                }
              }
            }
            return subject;
          },
          fire: function(eventName) {
            var callbacks = registeredEvents[eventName];
            if (!callbacks) {
              return subject;
            }
            var fireArguments;
            if (arguments.length > 1) {
              fireArguments = Array.prototype.splice.call(arguments, 1);
            }
            for (var i = 0; i < callbacks.length; ++i) {
              var callbackInfo = callbacks[i];
              callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
            }
            return subject;
          }
        };
      }
      function validateSubject(subject) {
        if (!subject) {
          throw new Error("Eventify cannot use falsy object as events subject");
        }
        var reservedWords = ["on", "fire", "off"];
        for (var i = 0; i < reservedWords.length; ++i) {
          if (subject.hasOwnProperty(reservedWords[i])) {
            throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
          }
        }
      }
    }
  });

  // node_modules/ngraph.forcelayout/index.js
  var require_ngraph13 = __commonJS({
    "node_modules/ngraph.forcelayout/index.js"(exports, module) {
      module.exports = createLayout;
      module.exports.simulator = require_ngraph_physics2();
      var eventify = require_ngraph12();
      function createLayout(graph, physicsSettings) {
        if (!graph) {
          throw new Error("Graph structure cannot be undefined");
        }
        var createSimulator = require_ngraph_physics2();
        var physicsSimulator = createSimulator(physicsSettings);
        var nodeMass = defaultNodeMass;
        if (physicsSettings && typeof physicsSettings.nodeMass === "function") {
          nodeMass = physicsSettings.nodeMass;
        }
        var nodeBodies = /* @__PURE__ */ Object.create(null);
        var springs = {};
        var bodiesCount = 0;
        var springTransform = physicsSimulator.settings.springTransform || noop;
        initPhysics();
        listenToEvents();
        var wasStable = false;
        var api = {
          /**
           * Performs one step of iterative layout algorithm
           *
           * @returns {boolean} true if the system should be considered stable; Flase otherwise.
           * The system is stable if no further call to `step()` can improve the layout.
           */
          step: function() {
            if (bodiesCount === 0) return true;
            var lastMove = physicsSimulator.step();
            api.lastMove = lastMove;
            api.fire("step");
            var ratio = lastMove / bodiesCount;
            var isStableNow = ratio <= 0.01;
            if (wasStable !== isStableNow) {
              wasStable = isStableNow;
              onStableChanged(isStableNow);
            }
            return isStableNow;
          },
          /**
           * For a given `nodeId` returns position
           */
          getNodePosition: function(nodeId) {
            return getInitializedBody(nodeId).pos;
          },
          /**
           * Sets position of a node to a given coordinates
           * @param {string} nodeId node identifier
           * @param {number} x position of a node
           * @param {number} y position of a node
           * @param {number=} z position of node (only if applicable to body)
           */
          setNodePosition: function(nodeId) {
            var body = getInitializedBody(nodeId);
            body.setPosition.apply(body, Array.prototype.slice.call(arguments, 1));
            physicsSimulator.invalidateBBox();
          },
          /**
           * @returns {Object} Link position by link id
           * @returns {Object.from} {x, y} coordinates of link start
           * @returns {Object.to} {x, y} coordinates of link end
           */
          getLinkPosition: function(linkId) {
            var spring = springs[linkId];
            if (spring) {
              return {
                from: spring.from.pos,
                to: spring.to.pos
              };
            }
          },
          /**
           * @returns {Object} area required to fit in the graph. Object contains
           * `x1`, `y1` - top left coordinates
           * `x2`, `y2` - bottom right coordinates
           */
          getGraphRect: function() {
            return physicsSimulator.getBBox();
          },
          /**
           * Iterates over each body in the layout simulator and performs a callback(body, nodeId)
           */
          forEachBody,
          /*
           * Requests layout algorithm to pin/unpin node to its current position
           * Pinned nodes should not be affected by layout algorithm and always
           * remain at their position
           */
          pinNode: function(node, isPinned) {
            var body = getInitializedBody(node.id);
            body.isPinned = !!isPinned;
          },
          /**
           * Checks whether given graph's node is currently pinned
           */
          isNodePinned: function(node) {
            return getInitializedBody(node.id).isPinned;
          },
          /**
           * Request to release all resources
           */
          dispose: function() {
            graph.off("changed", onGraphChanged);
            api.fire("disposed");
          },
          /**
           * Gets physical body for a given node id. If node is not found undefined
           * value is returned.
           */
          getBody,
          /**
           * Gets spring for a given edge.
           *
           * @param {string} linkId link identifer. If two arguments are passed then
           * this argument is treated as formNodeId
           * @param {string=} toId when defined this parameter denotes head of the link
           * and first argument is trated as tail of the link (fromId)
           */
          getSpring,
          /**
           * [Read only] Gets current physics simulator
           */
          simulator: physicsSimulator,
          /**
           * Gets the graph that was used for layout
           */
          graph,
          /**
           * Gets amount of movement performed during last step opeartion
           */
          lastMove: 0
        };
        eventify(api);
        return api;
        function forEachBody(cb) {
          Object.keys(nodeBodies).forEach(function(bodyId) {
            cb(nodeBodies[bodyId], bodyId);
          });
        }
        function getSpring(fromId, toId) {
          var linkId;
          if (toId === void 0) {
            if (typeof fromId !== "object") {
              linkId = fromId;
            } else {
              linkId = fromId.id;
            }
          } else {
            var link = graph.hasLink(fromId, toId);
            if (!link) return;
            linkId = link.id;
          }
          return springs[linkId];
        }
        function getBody(nodeId) {
          return nodeBodies[nodeId];
        }
        function listenToEvents() {
          graph.on("changed", onGraphChanged);
        }
        function onStableChanged(isStable) {
          api.fire("stable", isStable);
        }
        function onGraphChanged(changes) {
          for (var i = 0; i < changes.length; ++i) {
            var change = changes[i];
            if (change.changeType === "add") {
              if (change.node) {
                initBody(change.node.id);
              }
              if (change.link) {
                initLink(change.link);
              }
            } else if (change.changeType === "remove") {
              if (change.node) {
                releaseNode(change.node);
              }
              if (change.link) {
                releaseLink(change.link);
              }
            }
          }
          bodiesCount = graph.getNodesCount();
        }
        function initPhysics() {
          bodiesCount = 0;
          graph.forEachNode(function(node) {
            initBody(node.id);
            bodiesCount += 1;
          });
          graph.forEachLink(initLink);
        }
        function initBody(nodeId) {
          var body = nodeBodies[nodeId];
          if (!body) {
            var node = graph.getNode(nodeId);
            if (!node) {
              throw new Error("initBody() was called with unknown node id");
            }
            var pos = node.position;
            if (!pos) {
              var neighbors = getNeighborBodies(node);
              pos = physicsSimulator.getBestNewBodyPosition(neighbors);
            }
            body = physicsSimulator.addBodyAt(pos);
            body.id = nodeId;
            nodeBodies[nodeId] = body;
            updateBodyMass(nodeId);
            if (isNodeOriginallyPinned(node)) {
              body.isPinned = true;
            }
          }
        }
        function releaseNode(node) {
          var nodeId = node.id;
          var body = nodeBodies[nodeId];
          if (body) {
            nodeBodies[nodeId] = null;
            delete nodeBodies[nodeId];
            physicsSimulator.removeBody(body);
          }
        }
        function initLink(link) {
          updateBodyMass(link.fromId);
          updateBodyMass(link.toId);
          var fromBody = nodeBodies[link.fromId], toBody = nodeBodies[link.toId], spring = physicsSimulator.addSpring(fromBody, toBody, link.length);
          springTransform(link, spring);
          springs[link.id] = spring;
        }
        function releaseLink(link) {
          var spring = springs[link.id];
          if (spring) {
            var from = graph.getNode(link.fromId), to = graph.getNode(link.toId);
            if (from) updateBodyMass(from.id);
            if (to) updateBodyMass(to.id);
            delete springs[link.id];
            physicsSimulator.removeSpring(spring);
          }
        }
        function getNeighborBodies(node) {
          var neighbors = [];
          if (!node.links) {
            return neighbors;
          }
          var maxNeighbors = Math.min(node.links.length, 2);
          for (var i = 0; i < maxNeighbors; ++i) {
            var link = node.links[i];
            var otherBody = link.fromId !== node.id ? nodeBodies[link.fromId] : nodeBodies[link.toId];
            if (otherBody && otherBody.pos) {
              neighbors.push(otherBody);
            }
          }
          return neighbors;
        }
        function updateBodyMass(nodeId) {
          var body = nodeBodies[nodeId];
          body.mass = nodeMass(nodeId);
          if (Number.isNaN(body.mass)) {
            throw new Error("Node mass should be a number");
          }
        }
        function isNodeOriginallyPinned(node) {
          return node && (node.isPinned || node.data && node.data.isPinned);
        }
        function getInitializedBody(nodeId) {
          var body = nodeBodies[nodeId];
          if (!body) {
            initBody(nodeId);
            body = nodeBodies[nodeId];
          }
          return body;
        }
        function defaultNodeMass(nodeId) {
          var links = graph.getLinks(nodeId);
          if (!links) return 1;
          return 1 + links.length / 3;
        }
      }
      function noop() {
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/rect.js
  var require_rect = __commonJS({
    "node_modules/vivagraphjs/src/Utils/rect.js"(exports, module) {
      module.exports = Rect;
      function Rect(x1, y1, x2, y2) {
        this.x1 = x1 || 0;
        this.y1 = y1 || 0;
        this.x2 = x2 || 0;
        this.y2 = y2 || 0;
      }
    }
  });

  // node_modules/vivagraphjs/src/Layout/constant.js
  var require_constant = __commonJS({
    "node_modules/vivagraphjs/src/Layout/constant.js"(exports, module) {
      module.exports = constant;
      var merge = require_ngraph2();
      var random = require_ngraph().random;
      var Rect = require_rect();
      function constant(graph, userSettings) {
        userSettings = merge(userSettings, {
          maxX: 1024,
          maxY: 1024,
          seed: "Deterministic randomness made me do this"
        });
        var rand = random(userSettings.seed), graphRect = new Rect(Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE), layoutLinks = {}, placeNodeCallback = function(node) {
          return {
            x: rand.next(userSettings.maxX),
            y: rand.next(userSettings.maxY)
          };
        }, updateGraphRect = function(position, graphRect2) {
          if (position.x < graphRect2.x1) {
            graphRect2.x1 = position.x;
          }
          if (position.x > graphRect2.x2) {
            graphRect2.x2 = position.x;
          }
          if (position.y < graphRect2.y1) {
            graphRect2.y1 = position.y;
          }
          if (position.y > graphRect2.y2) {
            graphRect2.y2 = position.y;
          }
        }, layoutNodes = typeof Object.create === "function" ? /* @__PURE__ */ Object.create(null) : {}, ensureNodeInitialized = function(node) {
          layoutNodes[node.id] = placeNodeCallback(node);
          updateGraphRect(layoutNodes[node.id], graphRect);
        }, updateNodePositions = function() {
          if (graph.getNodesCount() === 0) {
            return;
          }
          graphRect.x1 = Number.MAX_VALUE;
          graphRect.y1 = Number.MAX_VALUE;
          graphRect.x2 = Number.MIN_VALUE;
          graphRect.y2 = Number.MIN_VALUE;
          graph.forEachNode(ensureNodeInitialized);
        }, ensureLinkInitialized = function(link) {
          layoutLinks[link.id] = link;
        }, onGraphChanged = function(changes) {
          for (var i = 0; i < changes.length; ++i) {
            var change = changes[i];
            if (change.node) {
              if (change.changeType === "add") {
                ensureNodeInitialized(change.node);
              } else {
                delete layoutNodes[change.node.id];
              }
            }
            if (change.link) {
              if (change.changeType === "add") {
                ensureLinkInitialized(change.link);
              } else {
                delete layoutLinks[change.link.id];
              }
            }
          }
        };
        graph.forEachNode(ensureNodeInitialized);
        graph.forEachLink(ensureLinkInitialized);
        graph.on("changed", onGraphChanged);
        return {
          /**
           * Attempts to layout graph within given number of iterations.
           *
           * @param {integer} [iterationsCount] number of algorithm's iterations.
           *  The constant layout ignores this parameter.
           */
          run: function(iterationsCount) {
            this.step();
          },
          /**
           * One step of layout algorithm.
           */
          step: function() {
            updateNodePositions();
            return true;
          },
          /**
           * Returns rectangle structure {x1, y1, x2, y2}, which represents
           * current space occupied by graph.
           */
          getGraphRect: function() {
            return graphRect;
          },
          /**
           * Request to release all resources
           */
          dispose: function() {
            graph.off("change", onGraphChanged);
          },
          /*
           * Checks whether given node is pinned; all nodes in this layout are pinned.
           */
          isNodePinned: function(node) {
            return true;
          },
          /*
           * Requests layout algorithm to pin/unpin node to its current position
           * Pinned nodes should not be affected by layout algorithm and always
           * remain at their position
           */
          pinNode: function(node, isPinned) {
          },
          /*
           * Gets position of a node by its id. If node was not seen by this
           * layout algorithm undefined value is returned;
           */
          getNodePosition,
          /**
           * Returns {from, to} position of a link.
           */
          getLinkPosition: function(linkId) {
            var link = layoutLinks[linkId];
            return {
              from: getNodePosition(link.fromId),
              to: getNodePosition(link.toId)
            };
          },
          /**
           * Sets position of a node to a given coordinates
           */
          setNodePosition: function(nodeId, x, y) {
            var pos = layoutNodes[nodeId];
            if (pos) {
              pos.x = x;
              pos.y = y;
            }
          },
          // Layout specific methods:
          /**
           * Based on argument either update default node placement callback or
           * attempts to place given node using current placement callback.
           * Setting new node callback triggers position update for all nodes.
           *
           * @param {Object} newPlaceNodeCallbackOrNode - if it is a function then
           * default node placement callback is replaced with new one. Node placement
           * callback has a form of function (node) {}, and is expected to return an
           * object with x and y properties set to numbers.
           *
           * Otherwise if it's not a function the argument is treated as graph node
           * and current node placement callback will be used to place it.
           */
          placeNode: function(newPlaceNodeCallbackOrNode) {
            if (typeof newPlaceNodeCallbackOrNode === "function") {
              placeNodeCallback = newPlaceNodeCallbackOrNode;
              updateNodePositions();
              return this;
            }
            return placeNodeCallback(newPlaceNodeCallbackOrNode);
          }
        };
        function getNodePosition(nodeId) {
          return layoutNodes[nodeId];
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/texture.js
  var require_texture = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/texture.js"(exports, module) {
      module.exports = Texture;
      function Texture(size) {
        this.canvas = window.document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.isDirty = false;
        this.canvas.width = this.canvas.height = size;
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglAtlas.js
  var require_webglAtlas = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglAtlas.js"(exports, module) {
      var Texture = require_texture();
      module.exports = webglAtlas;
      function webglAtlas(tilesPerTexture) {
        var tilesPerRow = Math.sqrt(tilesPerTexture || 1024) << 0, tileSize = tilesPerRow, lastLoadedIdx = 1, loadedImages = {}, dirtyTimeoutId, skipedDirty = 0, textures = [], trackedUrls = [];
        if (!isPowerOf2(tilesPerTexture)) {
          throw "Tiles per texture should be power of two.";
        }
        var api = {
          /**
           * indicates whether atlas has changed texture in it. If true then
           * some of the textures has isDirty flag set as well.
           */
          isDirty: false,
          /**
           * Clears any signs of atlas changes.
           */
          clearDirty,
          /**
           * Removes given url from collection of tiles in the atlas.
           */
          remove,
          /**
           * Gets all textures in the atlas.
           */
          getTextures,
          /**
           * Gets coordinates of the given image in the atlas. Coordinates is an object:
           * {offset : int } - where offset is an absolute position of the image in the
           * atlas.
           *
           * Absolute means it can be larger than tilesPerTexture parameter, and in that
           * case clients should get next texture in getTextures() collection.
           */
          getCoordinates,
          /**
           * Asynchronously Loads the image to the atlas. Cross-domain security
           * limitation applies.
           */
          load
        };
        return api;
        function clearDirty() {
          var i;
          api.isDirty = false;
          for (i = 0; i < textures.length; ++i) {
            textures[i].isDirty = false;
          }
        }
        function remove(imgUrl) {
          var coordinates = loadedImages[imgUrl];
          if (!coordinates) {
            return false;
          }
          delete loadedImages[imgUrl];
          lastLoadedIdx -= 1;
          if (lastLoadedIdx === coordinates.offset) {
            return true;
          }
          var tileToRemove = getTileCoordinates(coordinates.offset), lastTileInSet = getTileCoordinates(lastLoadedIdx);
          copy(lastTileInSet, tileToRemove);
          var replacedOffset = loadedImages[trackedUrls[lastLoadedIdx]];
          replacedOffset.offset = coordinates.offset;
          trackedUrls[coordinates.offset] = trackedUrls[lastLoadedIdx];
          markDirty();
          return true;
        }
        function getTextures() {
          return textures;
        }
        function getCoordinates(imgUrl) {
          return loadedImages[imgUrl];
        }
        function load(imgUrl, callback) {
          if (loadedImages.hasOwnProperty(imgUrl)) {
            callback(loadedImages[imgUrl]);
          } else {
            var img = new window.Image(), imgId = lastLoadedIdx;
            lastLoadedIdx += 1;
            img.crossOrigin = "anonymous";
            img.onload = function() {
              markDirty();
              drawAt(imgId, img, callback);
            };
            img.src = imgUrl;
          }
        }
        function createTexture() {
          var texture = new Texture(tilesPerRow * tileSize);
          textures.push(texture);
        }
        function drawAt(tileNumber, img, callback) {
          var tilePosition = getTileCoordinates(tileNumber), coordinates = {
            offset: tileNumber
          };
          if (tilePosition.textureNumber >= textures.length) {
            createTexture();
          }
          var currentTexture = textures[tilePosition.textureNumber];
          currentTexture.ctx.drawImage(img, tilePosition.col * tileSize, tilePosition.row * tileSize, tileSize, tileSize);
          trackedUrls[tileNumber] = img.src;
          loadedImages[img.src] = coordinates;
          currentTexture.isDirty = true;
          callback(coordinates);
        }
        function getTileCoordinates(absolutePosition) {
          var textureNumber = absolutePosition / tilesPerTexture << 0, localTileNumber = absolutePosition % tilesPerTexture, row = localTileNumber / tilesPerRow << 0, col = localTileNumber % tilesPerRow;
          return {
            textureNumber,
            row,
            col
          };
        }
        function markDirtyNow() {
          api.isDirty = true;
          skipedDirty = 0;
          dirtyTimeoutId = null;
        }
        function markDirty() {
          if (dirtyTimeoutId) {
            window.clearTimeout(dirtyTimeoutId);
            skipedDirty += 1;
            dirtyTimeoutId = null;
          }
          if (skipedDirty > 10) {
            markDirtyNow();
          } else {
            dirtyTimeoutId = window.setTimeout(markDirtyNow, 400);
          }
        }
        function copy(from, to) {
          var fromCanvas = textures[from.textureNumber].canvas, toCtx = textures[to.textureNumber].ctx, x = to.col * tileSize, y = to.row * tileSize;
          toCtx.drawImage(fromCanvas, from.col * tileSize, from.row * tileSize, tileSize, tileSize, x, y, tileSize, tileSize);
          textures[from.textureNumber].isDirty = true;
          textures[to.textureNumber].isDirty = true;
        }
      }
      function isPowerOf2(n) {
        return (n & n - 1) === 0;
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglImageNodeProgram.js
  var require_webglImageNodeProgram = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglImageNodeProgram.js"(exports, module) {
      var WebglAtlas = require_webglAtlas();
      var glUtils = require_webgl();
      module.exports = webglImageNodeProgram;
      function webglImageNodeProgram(tilesPerTexture) {
        var ATTRIBUTES_PER_PRIMITIVE = 18;
        var nodesFS = createNodeFragmentShader();
        var nodesVS = createNodeVertexShader();
        var tilesPerTexture = tilesPerTexture || 1024;
        var atlas;
        var program;
        var gl;
        var buffer;
        var utils;
        var locations;
        var nodesCount = 0;
        var nodes = new Float32Array(64);
        var width;
        var height;
        var transform;
        var sizeDirty;
        return {
          load,
          /**
           * Updates position of current node in the buffer of nodes.
           *
           * @param idx - index of current node.
           * @param pos - new position of the node.
           */
          position,
          createNode,
          removeNode,
          replaceProperties,
          updateTransform,
          updateSize,
          render
        };
        function refreshTexture(texture, idx) {
          if (texture.nativeObject) {
            gl.deleteTexture(texture.nativeObject);
          }
          var nativeObject = gl.createTexture();
          gl.activeTexture(gl["TEXTURE" + idx]);
          gl.bindTexture(gl.TEXTURE_2D, nativeObject);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.canvas);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.uniform1i(locations["sampler" + idx], idx);
          texture.nativeObject = nativeObject;
        }
        function ensureAtlasTextureUpdated() {
          if (atlas.isDirty) {
            var textures = atlas.getTextures(), i;
            for (i = 0; i < textures.length; ++i) {
              if (textures[i].isDirty || !textures[i].nativeObject) {
                refreshTexture(textures[i], i);
              }
            }
            atlas.clearDirty();
          }
        }
        function load(glContext) {
          gl = glContext;
          utils = glUtils(glContext);
          atlas = new WebglAtlas(tilesPerTexture);
          program = utils.createProgram(nodesVS, nodesFS);
          gl.useProgram(program);
          locations = utils.getLocations(program, ["a_vertexPos", "a_customAttributes", "u_screenSize", "u_transform", "u_sampler0", "u_sampler1", "u_sampler2", "u_sampler3", "u_tilesPerTexture"]);
          gl.uniform1f(locations.tilesPerTexture, tilesPerTexture);
          gl.enableVertexAttribArray(locations.vertexPos);
          gl.enableVertexAttribArray(locations.customAttributes);
          buffer = gl.createBuffer();
        }
        function position(nodeUI, pos) {
          var idx = nodeUI.id * ATTRIBUTES_PER_PRIMITIVE;
          nodes[idx] = pos.x - nodeUI.size;
          nodes[idx + 1] = -pos.y - nodeUI.size;
          nodes[idx + 2] = nodeUI._offset * 4;
          nodes[idx + 3] = pos.x + nodeUI.size;
          nodes[idx + 4] = -pos.y - nodeUI.size;
          nodes[idx + 5] = nodeUI._offset * 4 + 1;
          nodes[idx + 6] = pos.x - nodeUI.size;
          nodes[idx + 7] = -pos.y + nodeUI.size;
          nodes[idx + 8] = nodeUI._offset * 4 + 2;
          nodes[idx + 9] = pos.x - nodeUI.size;
          nodes[idx + 10] = -pos.y + nodeUI.size;
          nodes[idx + 11] = nodeUI._offset * 4 + 2;
          nodes[idx + 12] = pos.x + nodeUI.size;
          nodes[idx + 13] = -pos.y - nodeUI.size;
          nodes[idx + 14] = nodeUI._offset * 4 + 1;
          nodes[idx + 15] = pos.x + nodeUI.size;
          nodes[idx + 16] = -pos.y + nodeUI.size;
          nodes[idx + 17] = nodeUI._offset * 4 + 3;
        }
        function createNode(ui) {
          nodes = utils.extendArray(nodes, nodesCount, ATTRIBUTES_PER_PRIMITIVE);
          nodesCount += 1;
          var coordinates = atlas.getCoordinates(ui.src);
          if (coordinates) {
            ui._offset = coordinates.offset;
          } else {
            ui._offset = 0;
            atlas.load(ui.src, function(coordinates2) {
              ui._offset = coordinates2.offset;
            });
          }
        }
        function removeNode(nodeUI) {
          if (nodesCount > 0) {
            nodesCount -= 1;
          }
          if (nodeUI.id < nodesCount && nodesCount > 0) {
            if (nodeUI.src) {
              atlas.remove(nodeUI.src);
            }
            utils.copyArrayPart(nodes, nodeUI.id * ATTRIBUTES_PER_PRIMITIVE, nodesCount * ATTRIBUTES_PER_PRIMITIVE, ATTRIBUTES_PER_PRIMITIVE);
          }
        }
        function replaceProperties(replacedNode, newNode) {
          newNode._offset = replacedNode._offset;
        }
        function updateTransform(newTransform) {
          sizeDirty = true;
          transform = newTransform;
        }
        function updateSize(w, h) {
          width = w;
          height = h;
          sizeDirty = true;
        }
        function render() {
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, nodes, gl.DYNAMIC_DRAW);
          if (sizeDirty) {
            sizeDirty = false;
            gl.uniformMatrix4fv(locations.transform, false, transform);
            gl.uniform2f(locations.screenSize, width, height);
          }
          gl.vertexAttribPointer(locations.vertexPos, 2, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
          gl.vertexAttribPointer(locations.customAttributes, 1, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 2 * 4);
          ensureAtlasTextureUpdated();
          gl.drawArrays(gl.TRIANGLES, 0, nodesCount * 6);
        }
      }
      function createNodeFragmentShader() {
        return [
          "precision mediump float;",
          "varying vec4 color;",
          "varying vec3 vTextureCoord;",
          "uniform sampler2D u_sampler0;",
          "uniform sampler2D u_sampler1;",
          "uniform sampler2D u_sampler2;",
          "uniform sampler2D u_sampler3;",
          "void main(void) {",
          "   if (vTextureCoord.z == 0.) {",
          "     gl_FragColor = texture2D(u_sampler0, vTextureCoord.xy);",
          "   } else if (vTextureCoord.z == 1.) {",
          "     gl_FragColor = texture2D(u_sampler1, vTextureCoord.xy);",
          "   } else if (vTextureCoord.z == 2.) {",
          "     gl_FragColor = texture2D(u_sampler2, vTextureCoord.xy);",
          "   } else if (vTextureCoord.z == 3.) {",
          "     gl_FragColor = texture2D(u_sampler3, vTextureCoord.xy);",
          "   } else { gl_FragColor = vec4(0, 1, 0, 1); }",
          "}"
        ].join("\n");
      }
      function createNodeVertexShader() {
        return [
          "attribute vec2 a_vertexPos;",
          "attribute float a_customAttributes;",
          "uniform vec2 u_screenSize;",
          "uniform mat4 u_transform;",
          "uniform float u_tilesPerTexture;",
          "varying vec3 vTextureCoord;",
          "void main(void) {",
          "   gl_Position = u_transform * vec4(a_vertexPos/u_screenSize, 0, 1);",
          "float corner = mod(a_customAttributes, 4.);",
          "float tileIndex = mod(floor(a_customAttributes / 4.), u_tilesPerTexture);",
          "float tilesPerRow = sqrt(u_tilesPerTexture);",
          "float tileSize = 1./tilesPerRow;",
          "float tileColumn = mod(tileIndex, tilesPerRow);",
          "float tileRow = floor(tileIndex/tilesPerRow);",
          "if(corner == 0.0) {",
          "  vTextureCoord.xy = vec2(0, 1);",
          "} else if(corner == 1.0) {",
          "  vTextureCoord.xy = vec2(1, 1);",
          "} else if(corner == 2.0) {",
          "  vTextureCoord.xy = vec2(0, 0);",
          "} else {",
          "  vTextureCoord.xy = vec2(1, 0);",
          "}",
          "vTextureCoord *= tileSize;",
          "vTextureCoord.x += tileColumn * tileSize;",
          "vTextureCoord.y += tileRow * tileSize;",
          "vTextureCoord.z = floor(floor(a_customAttributes / 4.)/u_tilesPerTexture);",
          "}"
        ].join("\n");
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglLinkProgram.js
  var require_webglLinkProgram = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglLinkProgram.js"(exports, module) {
      var glUtils = require_webgl();
      module.exports = webglLinkProgram;
      function webglLinkProgram() {
        var ATTRIBUTES_PER_PRIMITIVE = 6, BYTES_PER_LINK = 2 * (2 * Float32Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT), linksFS = [
          "precision mediump float;",
          "varying vec4 color;",
          "void main(void) {",
          "   gl_FragColor = color;",
          "}"
        ].join("\n"), linksVS = [
          "attribute vec2 a_vertexPos;",
          "attribute vec4 a_color;",
          "uniform vec2 u_screenSize;",
          "uniform mat4 u_transform;",
          "varying vec4 color;",
          "void main(void) {",
          "   gl_Position = u_transform * vec4(a_vertexPos/u_screenSize, 0.0, 1.0);",
          "   color = a_color.abgr;",
          "}"
        ].join("\n"), program, gl, buffer, utils, locations, linksCount = 0, frontLinkId, storage = new ArrayBuffer(16 * BYTES_PER_LINK), positions = new Float32Array(storage), colors = new Uint32Array(storage), width, height, transform, sizeDirty, ensureEnoughStorage = function() {
          if ((linksCount + 1) * BYTES_PER_LINK > storage.byteLength) {
            var extendedStorage = new ArrayBuffer(storage.byteLength * 2), extendedPositions = new Float32Array(extendedStorage), extendedColors = new Uint32Array(extendedStorage);
            extendedColors.set(colors);
            positions = extendedPositions;
            colors = extendedColors;
            storage = extendedStorage;
          }
        };
        return {
          load: function(glContext) {
            gl = glContext;
            utils = glUtils(glContext);
            program = utils.createProgram(linksVS, linksFS);
            gl.useProgram(program);
            locations = utils.getLocations(program, ["a_vertexPos", "a_color", "u_screenSize", "u_transform"]);
            gl.enableVertexAttribArray(locations.vertexPos);
            gl.enableVertexAttribArray(locations.color);
            buffer = gl.createBuffer();
          },
          position: function(linkUi, fromPos, toPos) {
            var linkIdx = linkUi.id, offset = linkIdx * ATTRIBUTES_PER_PRIMITIVE;
            positions[offset] = fromPos.x;
            positions[offset + 1] = fromPos.y;
            colors[offset + 2] = linkUi.color;
            positions[offset + 3] = toPos.x;
            positions[offset + 4] = toPos.y;
            colors[offset + 5] = linkUi.color;
          },
          createLink: function(ui) {
            ensureEnoughStorage();
            linksCount += 1;
            frontLinkId = ui.id;
          },
          removeLink: function(ui) {
            if (linksCount > 0) {
              linksCount -= 1;
            }
            if (ui.id < linksCount && linksCount > 0) {
              utils.copyArrayPart(colors, ui.id * ATTRIBUTES_PER_PRIMITIVE, linksCount * ATTRIBUTES_PER_PRIMITIVE, ATTRIBUTES_PER_PRIMITIVE);
            }
          },
          updateTransform: function(newTransform) {
            sizeDirty = true;
            transform = newTransform;
          },
          updateSize: function(w, h) {
            width = w;
            height = h;
            sizeDirty = true;
          },
          render: function() {
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, storage, gl.DYNAMIC_DRAW);
            if (sizeDirty) {
              sizeDirty = false;
              gl.uniformMatrix4fv(locations.transform, false, transform);
              gl.uniform2f(locations.screenSize, width, height);
            }
            gl.vertexAttribPointer(locations.vertexPos, 2, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.vertexAttribPointer(locations.color, 4, gl.UNSIGNED_BYTE, true, 3 * Float32Array.BYTES_PER_ELEMENT, 2 * 4);
            gl.drawArrays(gl.LINES, 0, linksCount * 2);
            frontLinkId = linksCount - 1;
          },
          bringToFront: function(link) {
            if (frontLinkId > link.id) {
              utils.swapArrayPart(positions, link.id * ATTRIBUTES_PER_PRIMITIVE, frontLinkId * ATTRIBUTES_PER_PRIMITIVE, ATTRIBUTES_PER_PRIMITIVE);
            }
            if (frontLinkId > 0) {
              frontLinkId -= 1;
            }
          },
          getFrontLinkId: function() {
            return frontLinkId;
          }
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglNodeProgram.js
  var require_webglNodeProgram = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglNodeProgram.js"(exports, module) {
      var glUtils = require_webgl();
      module.exports = webglNodeProgram;
      function webglNodeProgram() {
        var ATTRIBUTES_PER_PRIMITIVE = 4;
        var BYTES_PER_NODE = 3 * Float32Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT;
        var nodesFS = [
          "precision mediump float;",
          "varying vec4 color;",
          "void main(void) {",
          "   gl_FragColor = color;",
          "}"
        ].join("\n");
        var nodesVS = [
          "attribute vec3 a_vertexPos;",
          "attribute vec4 a_color;",
          "uniform vec2 u_screenSize;",
          "uniform mat4 u_transform;",
          "varying vec4 color;",
          "void main(void) {",
          "   gl_Position = u_transform * vec4(a_vertexPos.xy/u_screenSize, 0, 1);",
          "   gl_PointSize = a_vertexPos.z * u_transform[0][0];",
          "   color = a_color.abgr;",
          "}"
        ].join("\n");
        var program;
        var gl;
        var buffer;
        var locations;
        var utils;
        var storage = new ArrayBuffer(16 * BYTES_PER_NODE);
        var positions = new Float32Array(storage);
        var colors = new Uint32Array(storage);
        var nodesCount = 0;
        var width;
        var height;
        var transform;
        var sizeDirty;
        return {
          load,
          /**
           * Updates position of node in the buffer of nodes.
           *
           * @param idx - index of current node.
           * @param pos - new position of the node.
           */
          position,
          updateTransform,
          updateSize,
          removeNode,
          createNode,
          replaceProperties,
          render
        };
        function ensureEnoughStorage() {
          if ((nodesCount + 1) * BYTES_PER_NODE >= storage.byteLength) {
            var extendedStorage = new ArrayBuffer(storage.byteLength * 2), extendedPositions = new Float32Array(extendedStorage), extendedColors = new Uint32Array(extendedStorage);
            extendedColors.set(colors);
            positions = extendedPositions;
            colors = extendedColors;
            storage = extendedStorage;
          }
        }
        function load(glContext) {
          gl = glContext;
          utils = glUtils(glContext);
          program = utils.createProgram(nodesVS, nodesFS);
          gl.useProgram(program);
          locations = utils.getLocations(program, ["a_vertexPos", "a_color", "u_screenSize", "u_transform"]);
          gl.enableVertexAttribArray(locations.vertexPos);
          gl.enableVertexAttribArray(locations.color);
          buffer = gl.createBuffer();
        }
        function position(nodeUI, pos) {
          var idx = nodeUI.id;
          positions[idx * ATTRIBUTES_PER_PRIMITIVE] = pos.x;
          positions[idx * ATTRIBUTES_PER_PRIMITIVE + 1] = -pos.y;
          positions[idx * ATTRIBUTES_PER_PRIMITIVE + 2] = nodeUI.size;
          colors[idx * ATTRIBUTES_PER_PRIMITIVE + 3] = nodeUI.color;
        }
        function updateTransform(newTransform) {
          sizeDirty = true;
          transform = newTransform;
        }
        function updateSize(w, h) {
          width = w;
          height = h;
          sizeDirty = true;
        }
        function removeNode(node) {
          if (nodesCount > 0) {
            nodesCount -= 1;
          }
          if (node.id < nodesCount && nodesCount > 0) {
            utils.copyArrayPart(colors, node.id * ATTRIBUTES_PER_PRIMITIVE, nodesCount * ATTRIBUTES_PER_PRIMITIVE, ATTRIBUTES_PER_PRIMITIVE);
          }
        }
        function createNode() {
          ensureEnoughStorage();
          nodesCount += 1;
        }
        function replaceProperties() {
        }
        function render() {
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, storage, gl.DYNAMIC_DRAW);
          if (sizeDirty) {
            sizeDirty = false;
            gl.uniformMatrix4fv(locations.transform, false, transform);
            gl.uniform2f(locations.screenSize, width, height);
          }
          gl.vertexAttribPointer(locations.vertexPos, 3, gl.FLOAT, false, ATTRIBUTES_PER_PRIMITIVE * Float32Array.BYTES_PER_ELEMENT, 0);
          gl.vertexAttribPointer(locations.color, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES_PER_PRIMITIVE * Float32Array.BYTES_PER_ELEMENT, 3 * 4);
          gl.drawArrays(gl.POINTS, 0, nodesCount);
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/parseColor.js
  var require_parseColor = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/parseColor.js"(exports, module) {
      module.exports = parseColor;
      function parseColor(color) {
        var parsedColor = 10414335;
        if (typeof color === "string" && color) {
          if (color.length === 4) {
            color = color.replace(/([^#])/g, "$1$1");
          }
          if (color.length === 9) {
            parsedColor = parseInt(color.substr(1), 16);
          } else if (color.length === 7) {
            parsedColor = parseInt(color.substr(1), 16) << 8 | 255;
          } else {
            throw 'Color expected in hex format with preceding "#". E.g. #00ff00. Got value: ' + color;
          }
        } else if (typeof color === "number") {
          parsedColor = color;
        }
        return parsedColor;
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglLine.js
  var require_webglLine = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglLine.js"(exports, module) {
      var parseColor = require_parseColor();
      module.exports = webglLine;
      function webglLine(color) {
        return {
          /**
           * Gets or sets color of the line. If you set this property externally
           * make sure it always come as integer of 0xRRGGBBAA format
           */
          color: parseColor(color)
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglSquare.js
  var require_webglSquare = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglSquare.js"(exports, module) {
      var parseColor = require_parseColor();
      module.exports = webglSquare;
      function webglSquare(size, color) {
        return {
          /**
           * Gets or sets size of the square side.
           */
          size: typeof size === "number" ? size : 10,
          /**
           * Gets or sets color of the square.
           */
          color: parseColor(color)
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/WebGL/webglImage.js
  var require_webglImage = __commonJS({
    "node_modules/vivagraphjs/src/WebGL/webglImage.js"(exports, module) {
      module.exports = webglImage;
      function webglImage(size, src) {
        return {
          /**
           * Gets texture index where current image is placed.
           */
          _texture: 0,
          /**
           * Gets offset in the texture where current image is placed.
           */
          _offset: 0,
          /**
           * Gets size of the square with the image.
           */
          size: typeof size === "number" ? size : 32,
          /**
           * Source of the image. If image is coming not from your domain
           * certain origin restrictions applies.
           * See http://www.khronos.org/registry/webgl/specs/latest/#4.2 for more details.
           */
          src
        };
      }
    }
  });

  // node_modules/vivagraphjs/src/View/webglGraphics.js
  var require_webglGraphics = __commonJS({
    "node_modules/vivagraphjs/src/View/webglGraphics.js"(exports, module) {
      module.exports = webglGraphics;
      var webglInputManager = require_webglInputManager();
      var webglLinkProgram = require_webglLinkProgram();
      var webglNodeProgram = require_webglNodeProgram();
      var webglSquare = require_webglSquare();
      var webglLine = require_webglLine();
      var eventify = require_ngraph3();
      var merge = require_ngraph2();
      function webglGraphics(options) {
        options = merge(options, {
          enableBlending: true,
          preserveDrawingBuffer: false,
          clearColor: false,
          clearColorValue: {
            r: 1,
            g: 1,
            b: 1,
            a: 1
          }
        });
        var container, graphicsRoot, gl, width, height, nodesCount = 0, linksCount = 0, transform = [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], userPlaceNodeCallback, userPlaceLinkCallback, nodes = [], links = [], initCallback, allNodes = {}, allLinks = {}, linkProgram = webglLinkProgram(), nodeProgram = webglNodeProgram(), nodeUIBuilder = function(node) {
          return webglSquare();
        }, linkUIBuilder = function(link) {
          return webglLine(3014898687);
        }, updateTransformUniform = function() {
          linkProgram.updateTransform(transform);
          nodeProgram.updateTransform(transform);
        }, resetScaleInternal = function() {
          transform = [
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1
          ];
        }, updateSize = function() {
          if (container && graphicsRoot) {
            width = graphicsRoot.width = Math.max(container.offsetWidth, 1);
            height = graphicsRoot.height = Math.max(container.offsetHeight, 1);
            if (gl) {
              gl.viewport(0, 0, width, height);
            }
            if (linkProgram) {
              linkProgram.updateSize(width / 2, height / 2);
            }
            if (nodeProgram) {
              nodeProgram.updateSize(width / 2, height / 2);
            }
          }
        }, fireRescaled = function(graphics2) {
          graphics2.fire("rescaled");
        };
        graphicsRoot = window.document.createElement("canvas");
        var graphics = {
          getLinkUI: function(linkId) {
            return allLinks[linkId];
          },
          getNodeUI: function(nodeId) {
            return allNodes[nodeId];
          },
          /**
           * Sets the callback that creates node representation.
           *
           * @param builderCallback a callback function that accepts graph node
           * as a parameter and must return an element representing this node.
           *
           * @returns If builderCallbackOrNode is a valid callback function, instance of this is returned;
           * Otherwise undefined value is returned
           */
          node: function(builderCallback) {
            if (typeof builderCallback !== "function") {
              return;
            }
            nodeUIBuilder = builderCallback;
            return this;
          },
          /**
           * Sets the callback that creates link representation
           *
           * @param builderCallback a callback function that accepts graph link
           * as a parameter and must return an element representing this link.
           *
           * @returns If builderCallback is a valid callback function, instance of this is returned;
           * Otherwise undefined value is returned.
           */
          link: function(builderCallback) {
            if (typeof builderCallback !== "function") {
              return;
            }
            linkUIBuilder = builderCallback;
            return this;
          },
          /**
           * Allows to override default position setter for the node with a new
           * function. newPlaceCallback(nodeUI, position) is function which
           * is used by updateNodePosition().
           */
          placeNode: function(newPlaceCallback) {
            userPlaceNodeCallback = newPlaceCallback;
            return this;
          },
          placeLink: function(newPlaceLinkCallback) {
            userPlaceLinkCallback = newPlaceLinkCallback;
            return this;
          },
          /**
           * Custom input manager listens to mouse events to process nodes drag-n-drop inside WebGL canvas
           */
          inputManager: webglInputManager,
          /**
           * Called every time before renderer starts rendering.
           */
          beginRender: function() {
          },
          /**
           * Called every time when renderer finishes one step of rendering.
           */
          endRender: function() {
            if (linksCount > 0) {
              linkProgram.render();
            }
            if (nodesCount > 0) {
              nodeProgram.render();
            }
          },
          bringLinkToFront: function(linkUI) {
            var frontLinkId = linkProgram.getFrontLinkId(), srcLinkId, temp;
            linkProgram.bringToFront(linkUI);
            if (frontLinkId > linkUI.id) {
              srcLinkId = linkUI.id;
              temp = links[frontLinkId];
              links[frontLinkId] = links[srcLinkId];
              links[frontLinkId].id = frontLinkId;
              links[srcLinkId] = temp;
              links[srcLinkId].id = srcLinkId;
            }
          },
          /**
           * Sets translate operation that should be applied to all nodes and links.
           */
          graphCenterChanged: function(x, y) {
            transform[12] = 2 * x / width - 1;
            transform[13] = 1 - 2 * y / height;
            updateTransformUniform();
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider prepare to render given link of the graph
           *
           * @param link - model of a link
           */
          addLink: function(link, boundPosition) {
            var uiid = linksCount++, ui = linkUIBuilder(link);
            ui.id = uiid;
            ui.pos = boundPosition;
            linkProgram.createLink(ui);
            links[uiid] = ui;
            allLinks[link.id] = ui;
            return ui;
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider prepare to render given node of the graph.
           *
           * @param nodeUI visual representation of the node created by node() execution.
           **/
          addNode: function(node, boundPosition) {
            var uiid = nodesCount++, ui = nodeUIBuilder(node);
            ui.id = uiid;
            ui.position = boundPosition;
            ui.node = node;
            nodeProgram.createNode(ui);
            nodes[uiid] = ui;
            allNodes[node.id] = ui;
            return ui;
          },
          translateRel: function(dx, dy) {
            transform[12] += 2 * transform[0] * dx / width / transform[0];
            transform[13] -= 2 * transform[5] * dy / height / transform[5];
            updateTransformUniform();
          },
          scale: function(scaleFactor, scrollPoint) {
            var cx = 2 * scrollPoint.x / width - 1, cy = 1 - 2 * scrollPoint.y / height;
            cx -= transform[12];
            cy -= transform[13];
            transform[12] += cx * (1 - scaleFactor);
            transform[13] += cy * (1 - scaleFactor);
            transform[0] *= scaleFactor;
            transform[5] *= scaleFactor;
            updateTransformUniform();
            fireRescaled(this);
            return transform[0];
          },
          resetScale: function() {
            resetScaleInternal();
            if (gl) {
              updateSize();
              updateTransformUniform();
            }
            return this;
          },
          /**
           * Resizes the graphic without resetting the scale. 
           * Useful with viva graph in a dynamic container
           */
          updateSize,
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider prepare to render.
           */
          init: function(c) {
            var contextParameters = {};
            if (options.preserveDrawingBuffer) {
              contextParameters.preserveDrawingBuffer = true;
            }
            container = c;
            updateSize();
            resetScaleInternal();
            container.appendChild(graphicsRoot);
            gl = graphicsRoot.getContext("experimental-webgl", contextParameters);
            if (!gl) {
              var msg = "Could not initialize WebGL. Seems like the browser doesn't support it.";
              window.alert(msg);
              throw msg;
            }
            if (options.enableBlending) {
              gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
              gl.enable(gl.BLEND);
            }
            if (options.clearColor) {
              var color = options.clearColorValue;
              gl.clearColor(color.r, color.g, color.b, color.a);
              this.beginRender = function() {
                gl.clear(gl.COLOR_BUFFER_BIT);
              };
            }
            linkProgram.load(gl);
            linkProgram.updateSize(width / 2, height / 2);
            nodeProgram.load(gl);
            nodeProgram.updateSize(width / 2, height / 2);
            updateTransformUniform();
            if (typeof initCallback === "function") {
              initCallback(graphicsRoot);
            }
          },
          /**
          * Called by Viva.Graph.View.renderer to let concrete graphic output
          * provider release occupied resources.
          */
          release: function(container2) {
            if (graphicsRoot && container2) {
              container2.removeChild(graphicsRoot);
            }
          },
          /**
           * Checks whether webgl is supported by this browser.
           */
          isSupported: function() {
            var c = window.document.createElement("canvas"), gl2 = c && c.getContext && c.getContext("experimental-webgl");
            return gl2;
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider remove link from rendering surface.
           *
           * @param linkUI visual representation of the link created by link() execution.
           **/
          releaseLink: function(link) {
            if (linksCount > 0) {
              linksCount -= 1;
            }
            var linkUI = allLinks[link.id];
            delete allLinks[link.id];
            linkProgram.removeLink(linkUI);
            var linkIdToRemove = linkUI.id;
            if (linkIdToRemove < linksCount) {
              if (linksCount === 0 || linksCount === linkIdToRemove) {
                return;
              }
              var lastLinkUI = links[linksCount];
              links[linkIdToRemove] = lastLinkUI;
              lastLinkUI.id = linkIdToRemove;
            }
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider remove node from rendering surface.
           *
           * @param nodeUI visual representation of the node created by node() execution.
           **/
          releaseNode: function(node) {
            if (nodesCount > 0) {
              nodesCount -= 1;
            }
            var nodeUI = allNodes[node.id];
            delete allNodes[node.id];
            nodeProgram.removeNode(nodeUI);
            var nodeIdToRemove = nodeUI.id;
            if (nodeIdToRemove < nodesCount) {
              if (nodesCount === 0 || nodesCount === nodeIdToRemove) {
                return;
              }
              var lastNodeUI = nodes[nodesCount];
              nodes[nodeIdToRemove] = lastNodeUI;
              lastNodeUI.id = nodeIdToRemove;
              nodeProgram.replaceProperties(nodeUI, lastNodeUI);
            }
          },
          renderNodes: function() {
            var pos = { x: 0, y: 0 };
            for (var i = 0; i < nodesCount; ++i) {
              var ui = nodes[i];
              pos.x = ui.position.x;
              pos.y = ui.position.y;
              if (userPlaceNodeCallback) {
                userPlaceNodeCallback(ui, pos);
              }
              nodeProgram.position(ui, pos);
            }
          },
          renderLinks: function() {
            if (this.omitLinksRendering) {
              return;
            }
            var toPos = { x: 0, y: 0 };
            var fromPos = { x: 0, y: 0 };
            for (var i = 0; i < linksCount; ++i) {
              var ui = links[i];
              var pos = ui.pos.from;
              fromPos.x = pos.x;
              fromPos.y = -pos.y;
              pos = ui.pos.to;
              toPos.x = pos.x;
              toPos.y = -pos.y;
              if (userPlaceLinkCallback) {
                userPlaceLinkCallback(ui, fromPos, toPos);
              }
              linkProgram.position(ui, fromPos, toPos);
            }
          },
          /**
           * Returns root element which hosts graphics.
           */
          getGraphicsRoot: function(callbackWhenReady) {
            if (typeof callbackWhenReady === "function") {
              if (graphicsRoot) {
                callbackWhenReady(graphicsRoot);
              } else {
                initCallback = callbackWhenReady;
              }
            }
            return graphicsRoot;
          },
          /**
           * Updates default shader which renders nodes
           *
           * @param newProgram to use for nodes.
           */
          setNodeProgram: function(newProgram) {
            if (!gl && newProgram) {
              nodeProgram = newProgram;
            } else if (newProgram) {
              throw "Not implemented. Cannot swap shader on the fly... Yet.";
            }
          },
          /**
           * Updates default shader which renders links
           *
           * @param newProgram to use for links.
           */
          setLinkProgram: function(newProgram) {
            if (!gl && newProgram) {
              linkProgram = newProgram;
            } else if (newProgram) {
              throw "Not implemented. Cannot swap shader on the fly... Yet.";
            }
          },
          /**
           * Transforms client coordinates into layout coordinates. Client coordinates
           * are DOM coordinates relative to the rendering container. Layout
           * coordinates are those assigned by by layout algorithm to each node.
           *
           * @param {Object} p - a point object with `x` and `y` attributes.
           * This method mutates p.
           */
          transformClientToGraphCoordinates: function(p) {
            p.x = 2 * p.x / width - 1;
            p.y = 1 - 2 * p.y / height;
            p.x = (p.x - transform[12]) / transform[0];
            p.y = (p.y - transform[13]) / transform[5];
            p.x = p.x * (width / 2);
            p.y = p.y * (-height / 2);
            return p;
          },
          /**
           * Transforms WebGL coordinates into client coordinates. Reverse of 
           * `transformClientToGraphCoordinates()`
           *
           * @param {Object} p - a point object with `x` and `y` attributes, which
           * represents a layout coordinate. This method mutates p.
           */
          transformGraphToClientCoordinates: function(p) {
            p.x = p.x / (width / 2);
            p.y = p.y / (-height / 2);
            p.x = p.x * transform[0] + transform[12];
            p.y = p.y * transform[5] + transform[13];
            p.x = (p.x + 1) * width / 2;
            p.y = (1 - p.y) * height / 2;
            return p;
          },
          getNodeAtClientPos: function(clientPos, preciseCheck) {
            if (typeof preciseCheck !== "function") {
              return null;
            }
            this.transformClientToGraphCoordinates(clientPos);
            for (var i = 0; i < nodesCount; ++i) {
              if (preciseCheck(nodes[i], clientPos.x, clientPos.y)) {
                return nodes[i].node;
              }
            }
            return null;
          }
        };
        eventify(graphics);
        return graphics;
      }
    }
  });

  // node_modules/simplesvg/lib/domparser.js
  var require_domparser = __commonJS({
    "node_modules/simplesvg/lib/domparser.js"(exports, module) {
      module.exports = createDomparser();
      function createDomparser() {
        if (typeof DOMParser === "undefined") {
          return {
            parseFromString: fail
          };
        }
        return new DOMParser();
      }
      function fail() {
        throw new Error("DOMParser is not supported by this platform. Please open issue here https://github.com/anvaka/simplesvg");
      }
    }
  });

  // node_modules/simplesvg/lib/compile.js
  var require_compile = __commonJS({
    "node_modules/simplesvg/lib/compile.js"(exports, module) {
      var parser = require_domparser();
      var svg = require_simplesvg();
      module.exports = compile;
      function compile(svgText) {
        try {
          svgText = addNamespaces(svgText);
          return svg(parser.parseFromString(svgText, "text/xml").documentElement);
        } catch (e) {
          throw e;
        }
      }
      function addNamespaces(text) {
        if (!text) return;
        var namespaces = 'xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"';
        var match = text.match(/^<\w+/);
        if (match) {
          var tagLength = match[0].length;
          return text.substr(0, tagLength) + " " + namespaces + " " + text.substr(tagLength);
        } else {
          throw new Error("Cannot parse input text: invalid xml?");
        }
      }
    }
  });

  // node_modules/simplesvg/lib/compile_template.js
  var require_compile_template = __commonJS({
    "node_modules/simplesvg/lib/compile_template.js"(exports, module) {
      module.exports = template;
      var BINDING_EXPR = /{{(.+?)}}/;
      function template(domNode) {
        var allBindings = /* @__PURE__ */ Object.create(null);
        extractAllBindings(domNode, allBindings);
        return {
          link: function(model) {
            Object.keys(allBindings).forEach(function(key) {
              var setter = allBindings[key];
              setter.forEach(changeModel);
            });
            function changeModel(setter) {
              setter(model);
            }
          }
        };
      }
      function extractAllBindings(domNode, allBindings) {
        var nodeType = domNode.nodeType;
        var typeSupported = nodeType === 1 || nodeType === 3;
        if (!typeSupported) return;
        var i;
        if (domNode.hasChildNodes()) {
          var domChildren = domNode.childNodes;
          for (i = 0; i < domChildren.length; ++i) {
            extractAllBindings(domChildren[i], allBindings);
          }
        }
        if (nodeType === 3) {
          bindTextContent(domNode, allBindings);
        }
        if (!domNode.attributes) return;
        var attrs = domNode.attributes;
        for (i = 0; i < attrs.length; ++i) {
          bindDomAttribute(attrs[i], domNode, allBindings);
        }
      }
      function bindDomAttribute(domAttribute, element, allBindings) {
        var value = domAttribute.value;
        if (!value) return;
        var modelNameMatch = value.match(BINDING_EXPR);
        if (!modelNameMatch) return;
        var attrName = domAttribute.localName;
        var modelPropertyName = modelNameMatch[1];
        var isSimpleValue = modelPropertyName.indexOf(".") < 0;
        if (!isSimpleValue) throw new Error("simplesvg currently does not support nested bindings");
        var propertyBindings = allBindings[modelPropertyName];
        if (!propertyBindings) {
          propertyBindings = allBindings[modelPropertyName] = [attributeSetter];
        } else {
          propertyBindings.push(attributeSetter);
        }
        function attributeSetter(model) {
          element.setAttributeNS(null, attrName, model[modelPropertyName]);
        }
      }
      function bindTextContent(element, allBindings) {
        var value = element.nodeValue;
        if (!value) return;
        var modelNameMatch = value.match(BINDING_EXPR);
        if (!modelNameMatch) return;
        var modelPropertyName = modelNameMatch[1];
        var isSimpleValue = modelPropertyName.indexOf(".") < 0;
        var propertyBindings = allBindings[modelPropertyName];
        if (!propertyBindings) {
          propertyBindings = allBindings[modelPropertyName] = [textSetter];
        } else {
          propertyBindings.push(textSetter);
        }
        function textSetter(model) {
          element.nodeValue = model[modelPropertyName];
        }
      }
    }
  });

  // node_modules/add-event-listener/index.js
  var require_add_event_listener = __commonJS({
    "node_modules/add-event-listener/index.js"(exports, module) {
      addEventListener.removeEventListener = removeEventListener;
      addEventListener.addEventListener = addEventListener;
      module.exports = addEventListener;
      var Events = null;
      function addEventListener(el, eventName, listener, useCapture) {
        Events = Events || (document.addEventListener ? { add: stdAttach, rm: stdDetach } : { add: oldIEAttach, rm: oldIEDetach });
        return Events.add(el, eventName, listener, useCapture);
      }
      function removeEventListener(el, eventName, listener, useCapture) {
        Events = Events || (document.addEventListener ? { add: stdAttach, rm: stdDetach } : { add: oldIEAttach, rm: oldIEDetach });
        return Events.rm(el, eventName, listener, useCapture);
      }
      function stdAttach(el, eventName, listener, useCapture) {
        el.addEventListener(eventName, listener, useCapture);
      }
      function stdDetach(el, eventName, listener, useCapture) {
        el.removeEventListener(eventName, listener, useCapture);
      }
      function oldIEAttach(el, eventName, listener, useCapture) {
        if (useCapture) {
          throw new Error("cannot useCapture in oldIE");
        }
        el.attachEvent("on" + eventName, listener);
      }
      function oldIEDetach(el, eventName, listener, useCapture) {
        el.detachEvent("on" + eventName, listener);
      }
    }
  });

  // node_modules/simplesvg/index.js
  var require_simplesvg = __commonJS({
    "node_modules/simplesvg/index.js"(exports, module) {
      module.exports = svg;
      svg.compile = require_compile();
      var compileTemplate = svg.compileTemplate = require_compile_template();
      var domEvents = require_add_event_listener();
      var svgns = "http://www.w3.org/2000/svg";
      var xlinkns = "http://www.w3.org/1999/xlink";
      function svg(element, attrBag) {
        var svgElement = augment(element);
        if (attrBag === void 0) {
          return svgElement;
        }
        var attributes = Object.keys(attrBag);
        for (var i = 0; i < attributes.length; ++i) {
          var attributeName = attributes[i];
          var value = attrBag[attributeName];
          if (attributeName === "link") {
            svgElement.link(value);
          } else {
            svgElement.attr(attributeName, value);
          }
        }
        return svgElement;
      }
      function augment(element) {
        var svgElement = element;
        if (typeof element === "string") {
          svgElement = window.document.createElementNS(svgns, element);
        } else if (element.simplesvg) {
          return element;
        }
        var compiledTempalte;
        svgElement.simplesvg = true;
        svgElement.attr = attr;
        svgElement.append = append;
        svgElement.link = link;
        svgElement.text = text;
        svgElement.on = on;
        svgElement.off = off;
        svgElement.dataSource = dataSource;
        return svgElement;
        function dataSource(model) {
          if (!compiledTempalte) compiledTempalte = compileTemplate(svgElement);
          compiledTempalte.link(model);
          return svgElement;
        }
        function on(name, cb, useCapture) {
          domEvents.addEventListener(svgElement, name, cb, useCapture);
          return svgElement;
        }
        function off(name, cb, useCapture) {
          domEvents.removeEventListener(svgElement, name, cb, useCapture);
          return svgElement;
        }
        function append(content) {
          var child = svg(content);
          svgElement.appendChild(child);
          return child;
        }
        function attr(name, value) {
          if (arguments.length === 2) {
            if (value !== null) {
              svgElement.setAttributeNS(null, name, value);
            } else {
              svgElement.removeAttributeNS(null, name);
            }
            return svgElement;
          }
          return svgElement.getAttributeNS(null, name);
        }
        function link(target) {
          if (arguments.length) {
            svgElement.setAttributeNS(xlinkns, "xlink:href", target);
            return svgElement;
          }
          return svgElement.getAttributeNS(xlinkns, "xlink:href");
        }
        function text(textContent) {
          if (textContent !== void 0) {
            svgElement.textContent = textContent;
            return svgElement;
          }
          return svgElement.textContent;
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/View/svgGraphics.js
  var require_svgGraphics = __commonJS({
    "node_modules/vivagraphjs/src/View/svgGraphics.js"(exports, module) {
      module.exports = svgGraphics;
      var svg = require_simplesvg();
      var eventify = require_ngraph3();
      var domInputManager = require_domInputManager();
      function svgGraphics() {
        var svgContainer, svgRoot, offsetX = 0, offsetY = 0, initCallback, actualScale = 1, allNodes = {}, allLinks = {}, nodeBuilder = function(node) {
          return svg("rect").attr("width", 10).attr("height", 10).attr("fill", "#00a2e8");
        }, nodePositionCallback = function(nodeUI, pos) {
          nodeUI.attr("x", pos.x - 5).attr("y", pos.y - 5);
        }, linkBuilder = function(link) {
          return svg("line").attr("stroke", "#999");
        }, linkPositionCallback = function(linkUI, fromPos, toPos) {
          linkUI.attr("x1", fromPos.x).attr("y1", fromPos.y).attr("x2", toPos.x).attr("y2", toPos.y);
        }, fireRescaled = function(graphics2) {
          graphics2.fire("rescaled");
        }, cachedPos = { x: 0, y: 0 }, cachedFromPos = { x: 0, y: 0 }, cachedToPos = { x: 0, y: 0 }, updateTransform = function() {
          if (svgContainer) {
            var transform = "matrix(" + actualScale + ", 0, 0," + actualScale + "," + offsetX + "," + offsetY + ")";
            svgContainer.attr("transform", transform);
          }
        };
        svgRoot = createSvgRoot();
        var graphics = {
          getNodeUI: function(nodeId) {
            return allNodes[nodeId];
          },
          getLinkUI: function(linkId) {
            return allLinks[linkId];
          },
          /**
           * Sets the callback that creates node representation.
           *
           * @param builderCallback a callback function that accepts graph node
           * as a parameter and must return an element representing this node.
           *
           * @returns If builderCallbackOrNode is a valid callback function, instance of this is returned;
           * Otherwise undefined value is returned
           */
          node: function(builderCallback) {
            if (typeof builderCallback !== "function") {
              return;
            }
            nodeBuilder = builderCallback;
            return this;
          },
          /**
           * Sets the callback that creates link representation
           *
           * @param builderCallback a callback function that accepts graph link
           * as a parameter and must return an element representing this link.
           *
           * @returns If builderCallback is a valid callback function, instance of this is returned;
           * Otherwise undefined value is returned.
           */
          link: function(builderCallback) {
            if (typeof builderCallback !== "function") {
              return;
            }
            linkBuilder = builderCallback;
            return this;
          },
          /**
           * Allows to override default position setter for the node with a new
           * function. newPlaceCallback(nodeUI, position, node) is function which
           * is used by updateNodePosition().
           */
          placeNode: function(newPlaceCallback) {
            nodePositionCallback = newPlaceCallback;
            return this;
          },
          placeLink: function(newPlaceLinkCallback) {
            linkPositionCallback = newPlaceLinkCallback;
            return this;
          },
          /**
           * Called every before renderer starts rendering.
           */
          beginRender: function() {
          },
          /**
           * Called every time when renderer finishes one step of rendering.
           */
          endRender: function() {
          },
          /**
           * Sets translate operation that should be applied to all nodes and links.
           */
          graphCenterChanged: function(x, y) {
            offsetX = x;
            offsetY = y;
            updateTransform();
          },
          /**
           * Default input manager listens to DOM events to process nodes drag-n-drop
           */
          inputManager: domInputManager,
          translateRel: function(dx, dy) {
            var p = svgRoot.createSVGPoint(), t = svgContainer.getCTM(), origin = svgRoot.createSVGPoint().matrixTransform(t.inverse());
            p.x = dx;
            p.y = dy;
            p = p.matrixTransform(t.inverse());
            p.x = (p.x - origin.x) * t.a;
            p.y = (p.y - origin.y) * t.d;
            t.e += p.x;
            t.f += p.y;
            var transform = "matrix(" + t.a + ", 0, 0," + t.d + "," + t.e + "," + t.f + ")";
            svgContainer.attr("transform", transform);
          },
          scale: function(scaleFactor, scrollPoint) {
            var p = svgRoot.createSVGPoint();
            p.x = scrollPoint.x;
            p.y = scrollPoint.y;
            p = p.matrixTransform(svgContainer.getCTM().inverse());
            var k = svgRoot.createSVGMatrix().translate(p.x, p.y).scale(scaleFactor).translate(-p.x, -p.y), t = svgContainer.getCTM().multiply(k);
            actualScale = t.a;
            offsetX = t.e;
            offsetY = t.f;
            var transform = "matrix(" + t.a + ", 0, 0," + t.d + "," + t.e + "," + t.f + ")";
            svgContainer.attr("transform", transform);
            fireRescaled(this);
            return actualScale;
          },
          resetScale: function() {
            actualScale = 1;
            var transform = "matrix(1, 0, 0, 1, 0, 0)";
            svgContainer.attr("transform", transform);
            fireRescaled(this);
            return this;
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider prepare to render.
           */
          init: function(container) {
            container.appendChild(svgRoot);
            updateTransform();
            if (typeof initCallback === "function") {
              initCallback(svgRoot);
            }
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider release occupied resources.
           */
          release: function(container) {
            if (svgRoot && container) {
              container.removeChild(svgRoot);
            }
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider prepare to render given link of the graph
           *
           * @param link - model of a link
           */
          addLink: function(link, pos) {
            var linkUI = linkBuilder(link);
            if (!linkUI) {
              return;
            }
            linkUI.position = pos;
            linkUI.link = link;
            allLinks[link.id] = linkUI;
            if (svgContainer.childElementCount > 0) {
              svgContainer.insertBefore(linkUI, svgContainer.firstChild);
            } else {
              svgContainer.appendChild(linkUI);
            }
            return linkUI;
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider remove link from rendering surface.
           *
           * @param linkUI visual representation of the link created by link() execution.
           **/
          releaseLink: function(link) {
            var linkUI = allLinks[link.id];
            if (linkUI) {
              svgContainer.removeChild(linkUI);
              delete allLinks[link.id];
            }
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider prepare to render given node of the graph.
           *
           * @param nodeUI visual representation of the node created by node() execution.
           **/
          addNode: function(node, pos) {
            var nodeUI = nodeBuilder(node);
            if (!nodeUI) {
              return;
            }
            nodeUI.position = pos;
            nodeUI.node = node;
            allNodes[node.id] = nodeUI;
            svgContainer.appendChild(nodeUI);
            return nodeUI;
          },
          /**
           * Called by Viva.Graph.View.renderer to let concrete graphic output
           * provider remove node from rendering surface.
           *
           * @param node graph's node
           **/
          releaseNode: function(node) {
            var nodeUI = allNodes[node.id];
            if (nodeUI) {
              svgContainer.removeChild(nodeUI);
              delete allNodes[node.id];
            }
          },
          renderNodes: function() {
            for (var key in allNodes) {
              if (allNodes.hasOwnProperty(key)) {
                var nodeUI = allNodes[key];
                cachedPos.x = nodeUI.position.x;
                cachedPos.y = nodeUI.position.y;
                nodePositionCallback(nodeUI, cachedPos, nodeUI.node);
              }
            }
          },
          renderLinks: function() {
            for (var key in allLinks) {
              if (allLinks.hasOwnProperty(key)) {
                var linkUI = allLinks[key];
                cachedFromPos.x = linkUI.position.from.x;
                cachedFromPos.y = linkUI.position.from.y;
                cachedToPos.x = linkUI.position.to.x;
                cachedToPos.y = linkUI.position.to.y;
                linkPositionCallback(linkUI, cachedFromPos, cachedToPos, linkUI.link);
              }
            }
          },
          /**
           * Returns root element which hosts graphics.
           */
          getGraphicsRoot: function(callbackWhenReady) {
            if (typeof callbackWhenReady === "function") {
              if (svgRoot) {
                callbackWhenReady(svgRoot);
              } else {
                initCallback = callbackWhenReady;
              }
            }
            return svgRoot;
          },
          /**
           * Returns root SVG element.
           *
           * Note: This is internal method specific to this renderer
           */
          getSvgRoot: function() {
            return svgRoot;
          }
        };
        eventify(graphics);
        return graphics;
        function createSvgRoot() {
          var svgRoot2 = svg("svg");
          svgContainer = svg("g").attr("buffered-rendering", "dynamic");
          svgRoot2.appendChild(svgContainer);
          return svgRoot2;
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/Utils/windowEvents.js
  var require_windowEvents = __commonJS({
    "node_modules/vivagraphjs/src/Utils/windowEvents.js"(exports, module) {
      var nullEvents = require_nullEvents();
      module.exports = createDocumentEvents();
      function createDocumentEvents() {
        if (typeof window === "undefined") {
          return nullEvents;
        }
        return {
          on,
          off
        };
      }
      function on(eventName, handler) {
        window.addEventListener(eventName, handler);
      }
      function off(eventName, handler) {
        window.removeEventListener(eventName, handler);
      }
    }
  });

  // node_modules/vivagraphjs/src/View/renderer.js
  var require_renderer = __commonJS({
    "node_modules/vivagraphjs/src/View/renderer.js"(exports, module) {
      module.exports = renderer;
      var eventify = require_ngraph3();
      var forceDirected = require_ngraph13();
      var svgGraphics = require_svgGraphics();
      var windowEvents = require_windowEvents();
      var domInputManager = require_domInputManager();
      var timer = require_timer();
      var getDimension = require_getDimensions();
      var dragndrop = require_dragndrop();
      function renderer(graph, settings) {
        var FRAME_INTERVAL = 30;
        settings = settings || {};
        var layout = settings.layout, graphics = settings.graphics, container = settings.container, interactive = settings.interactive !== void 0 ? settings.interactive : true, inputManager, animationTimer, rendererInitialized = false, updateCenterRequired = true, isStable = false, userInteraction = false, isPaused = false, transform = {
          offsetX: 0,
          offsetY: 0,
          scale: 1
        }, publicEvents = eventify({}), containerDrag;
        return {
          /**
           * Performs rendering of the graph.
           *
           * @param iterationsCount if specified renderer will run only given number of iterations
           * and then stop. Otherwise graph rendering is performed indefinitely.
           *
           * Note: if rendering stopped by used started dragging nodes or new nodes were added to the
           * graph renderer will give run more iterations to reflect changes.
           */
          run: function(iterationsCount) {
            if (!rendererInitialized) {
              prepareSettings();
              prerender();
              initDom();
              updateCenter();
              listenToEvents();
              rendererInitialized = true;
            }
            renderIterations(iterationsCount);
            return this;
          },
          reset: function() {
            graphics.resetScale();
            updateCenter();
            transform.scale = 1;
          },
          pause: function() {
            isPaused = true;
            animationTimer.stop();
          },
          resume: function() {
            isPaused = false;
            animationTimer.restart();
          },
          rerender: function() {
            renderGraph();
            return this;
          },
          zoomOut: function() {
            return scale(true);
          },
          zoomIn: function() {
            return scale(false);
          },
          /**
           * Returns current transformation matrix.
           */
          getTransform: function() {
            return transform;
          },
          /**
           * Centers renderer at x,y graph's coordinates
           */
          moveTo: function(x, y) {
            graphics.graphCenterChanged(transform.offsetX - x * transform.scale, transform.offsetY - y * transform.scale);
            renderGraph();
          },
          /**
           * Gets current graphics object
           */
          getGraphics: function() {
            return graphics;
          },
          /**
           * Gets current layout.
           */
          getLayout: function() {
            return layout;
          },
          /**
           * Removes this renderer and deallocates all resources/timers
           */
          dispose: function() {
            stopListenToEvents();
          },
          on: function(eventName, callback) {
            publicEvents.on(eventName, callback);
            return this;
          },
          off: function(eventName, callback) {
            publicEvents.off(eventName, callback);
            return this;
          }
        };
        function isInteractive(interactionName) {
          if (typeof interactive === "string") {
            return interactive.indexOf(interactionName) >= 0;
          } else if (typeof interactive === "boolean") {
            return interactive;
          }
          return true;
        }
        function prepareSettings() {
          container = container || window.document.body;
          layout = layout || forceDirected(graph, {
            springLength: 80,
            springCoeff: 2e-4
          });
          graphics = graphics || svgGraphics(graph, {
            container
          });
          if (!settings.hasOwnProperty("renderLinks")) {
            settings.renderLinks = true;
          }
          settings.prerender = settings.prerender || 0;
          inputManager = (graphics.inputManager || domInputManager)(graph, graphics);
        }
        function renderGraph() {
          graphics.beginRender();
          if (settings.renderLinks) {
            graphics.renderLinks();
          }
          graphics.renderNodes();
          graphics.endRender();
        }
        function onRenderFrame() {
          isStable = layout.step() && !userInteraction;
          renderGraph();
          return !isStable;
        }
        function renderIterations(iterationsCount) {
          if (animationTimer) {
            return;
          }
          if (iterationsCount !== void 0) {
            animationTimer = timer(function() {
              iterationsCount -= 1;
              if (iterationsCount < 0) {
                var needMoreFrames = false;
                return needMoreFrames;
              }
              return onRenderFrame();
            }, FRAME_INTERVAL);
          } else {
            animationTimer = timer(onRenderFrame, FRAME_INTERVAL);
          }
        }
        function resetStable() {
          if (isPaused) {
            return;
          }
          isStable = false;
          animationTimer.restart();
        }
        function prerender() {
          if (typeof settings.prerender === "number" && settings.prerender > 0) {
            for (var i = 0; i < settings.prerender; i += 1) {
              layout.step();
            }
          }
        }
        function updateCenter() {
          var graphRect = layout.getGraphRect(), containerSize = getDimension(container);
          var cx = (graphRect.x2 + graphRect.x1) / 2;
          var cy = (graphRect.y2 + graphRect.y1) / 2;
          transform.offsetX = containerSize.width / 2 - (cx * transform.scale - cx);
          transform.offsetY = containerSize.height / 2 - (cy * transform.scale - cy);
          graphics.graphCenterChanged(transform.offsetX, transform.offsetY);
          updateCenterRequired = false;
        }
        function createNodeUi(node) {
          var nodePosition = layout.getNodePosition(node.id);
          graphics.addNode(node, nodePosition);
        }
        function removeNodeUi(node) {
          graphics.releaseNode(node);
        }
        function createLinkUi(link) {
          var linkPosition = layout.getLinkPosition(link.id);
          graphics.addLink(link, linkPosition);
        }
        function removeLinkUi(link) {
          graphics.releaseLink(link);
        }
        function listenNodeEvents(node) {
          if (!isInteractive("node")) {
            return;
          }
          var wasPinned = false;
          inputManager.bindDragNDrop(node, {
            onStart: function() {
              wasPinned = layout.isNodePinned(node);
              layout.pinNode(node, true);
              userInteraction = true;
              resetStable();
            },
            onDrag: function(e, offset) {
              var oldPos = layout.getNodePosition(node.id);
              layout.setNodePosition(
                node.id,
                oldPos.x + offset.x / transform.scale,
                oldPos.y + offset.y / transform.scale
              );
              userInteraction = true;
              renderGraph();
            },
            onStop: function() {
              layout.pinNode(node, wasPinned);
              userInteraction = false;
            }
          });
        }
        function releaseNodeEvents(node) {
          inputManager.bindDragNDrop(node, null);
        }
        function initDom() {
          graphics.init(container);
          graph.forEachNode(createNodeUi);
          if (settings.renderLinks) {
            graph.forEachLink(createLinkUi);
          }
        }
        function releaseDom() {
          graphics.release(container);
        }
        function processNodeChange(change) {
          var node = change.node;
          if (change.changeType === "add") {
            createNodeUi(node);
            listenNodeEvents(node);
            if (updateCenterRequired) {
              updateCenter();
            }
          } else if (change.changeType === "remove") {
            releaseNodeEvents(node);
            removeNodeUi(node);
            if (graph.getNodesCount() === 0) {
              updateCenterRequired = true;
            }
          } else if (change.changeType === "update") {
            releaseNodeEvents(node);
            removeNodeUi(node);
            createNodeUi(node);
            listenNodeEvents(node);
          }
        }
        function processLinkChange(change) {
          var link = change.link;
          if (change.changeType === "add") {
            if (settings.renderLinks) {
              createLinkUi(link);
            }
          } else if (change.changeType === "remove") {
            if (settings.renderLinks) {
              removeLinkUi(link);
            }
          } else if (change.changeType === "update") {
            throw "Update type is not implemented. TODO: Implement me!";
          }
        }
        function onGraphChanged(changes) {
          var i, change;
          for (i = 0; i < changes.length; i += 1) {
            change = changes[i];
            if (change.node) {
              processNodeChange(change);
            } else if (change.link) {
              processLinkChange(change);
            }
          }
          resetStable();
        }
        function onWindowResized() {
          updateCenter();
          onRenderFrame();
        }
        function releaseContainerDragManager() {
          if (containerDrag) {
            containerDrag.release();
            containerDrag = null;
          }
        }
        function releaseGraphEvents() {
          graph.off("changed", onGraphChanged);
        }
        function scale(out, scrollPoint) {
          if (!scrollPoint) {
            var containerSize = getDimension(container);
            scrollPoint = {
              x: containerSize.width / 2,
              y: containerSize.height / 2
            };
          }
          var scaleFactor = Math.pow(1 + 0.4, out ? -0.2 : 0.2);
          transform.scale = graphics.scale(scaleFactor, scrollPoint);
          renderGraph();
          publicEvents.fire("scale", transform.scale);
          return transform.scale;
        }
        function listenToEvents() {
          windowEvents.on("resize", onWindowResized);
          releaseContainerDragManager();
          if (isInteractive("drag")) {
            containerDrag = dragndrop(container);
            containerDrag.onDrag(function(e, offset) {
              graphics.translateRel(offset.x, offset.y);
              renderGraph();
              publicEvents.fire("drag", offset);
            });
          }
          if (isInteractive("scroll")) {
            if (!containerDrag) {
              containerDrag = dragndrop(container);
            }
            containerDrag.onScroll(function(e, scaleOffset, scrollPoint) {
              scale(scaleOffset < 0, scrollPoint);
            });
          }
          graph.forEachNode(listenNodeEvents);
          releaseGraphEvents();
          graph.on("changed", onGraphChanged);
        }
        function stopListenToEvents() {
          rendererInitialized = false;
          releaseGraphEvents();
          releaseContainerDragManager();
          windowEvents.off("resize", onWindowResized);
          publicEvents.off();
          animationTimer.stop();
          graph.forEachLink(function(link) {
            if (settings.renderLinks) {
              removeLinkUi(link);
            }
          });
          graph.forEachNode(function(node) {
            releaseNodeEvents(node);
            removeNodeUi(node);
          });
          layout.dispose();
          releaseDom();
        }
      }
    }
  });

  // node_modules/vivagraphjs/src/viva.js
  var require_viva = __commonJS({
    "node_modules/vivagraphjs/src/viva.js"(exports, module) {
      var random = require_ngraph();
      var Viva2 = {
        lazyExtend: function() {
          return require_ngraph2().apply(this, arguments);
        },
        randomIterator: function() {
          return random.randomIterator.apply(random, arguments);
        },
        random: function() {
          return random.random.apply(random, arguments);
        },
        events: require_ngraph3()
      };
      Viva2.Graph = {
        version: require_version(),
        graph: require_ngraph4(),
        serializer: function() {
          return {
            loadFromJSON: require_ngraph5(),
            storeToJSON: require_ngraph6()
          };
        },
        centrality: require_centrality(),
        operations: require_operations(),
        geom: function() {
          return {
            intersect: require_gintersect(),
            intersectRect: require_intersectRect()
          };
        },
        webgl: require_webgl(),
        webglInputEvents: require_webglInputEvents(),
        generator: function() {
          return require_ngraph9();
        },
        Input: {
          domInputManager: require_domInputManager(),
          webglInputManager: require_webglInputManager()
        },
        Utils: {
          // TODO: move to Input
          dragndrop: require_dragndrop(),
          findElementPosition: require_findElementPosition(),
          timer: require_timer(),
          getDimension: require_getDimensions(),
          events: require_backwardCompatibleEvents()
        },
        Layout: {
          forceDirected: require_ngraph13(),
          constant: require_constant()
        },
        View: {
          // TODO: Move `webglXXX` out to webgl namespace
          Texture: require_texture(),
          // TODO: This should not be even exported
          webglAtlas: require_webglAtlas(),
          webglImageNodeProgram: require_webglImageNodeProgram(),
          webglLinkProgram: require_webglLinkProgram(),
          webglNodeProgram: require_webglNodeProgram(),
          webglLine: require_webglLine(),
          webglSquare: require_webglSquare(),
          webglImage: require_webglImage(),
          webglGraphics: require_webglGraphics(),
          // TODO: Deprecate this:
          _webglUtil: {
            parseColor: require_parseColor()
          },
          // TODO: move to svg namespace
          svgGraphics: require_svgGraphics(),
          renderer: require_renderer(),
          // deprecated
          cssGraphics: function() {
            throw new Error("cssGraphics is deprecated. Please use older version of vivagraph (< 0.7) if you need it");
          },
          svgNodeFactory: function() {
            throw new Error("svgNodeFactory is deprecated. Please use older version of vivagraph (< 0.7) if you need it");
          },
          community: function() {
            throw new Error("community is deprecated. Please use vivagraph < 0.7 if you need it, or `https://github.com/anvaka/ngraph.slpa` module");
          }
        },
        Rect: require_rect(),
        svg: require_simplesvg(),
        // TODO: should be camelCase
        BrowserInfo: require_browserInfo()
      };
      module.exports = Viva2;
    }
  });

  // src/index.js
  var import_mithril = __toESM(require_mithril(), 1);
  var import_vivagraphjs = __toESM(require_viva(), 1);
  var appDataUrl = "appData.json";
  var appState = {
    names: [],
    table: [],
    selectedFirst: /* @__PURE__ */ new Set(),
    selectedSecond: /* @__PURE__ */ new Set(),
    disabledFirst: /* @__PURE__ */ new Set(),
    disabledSecond: /* @__PURE__ */ new Set(),
    solutions: []
  };
  import_mithril.default.request(appDataUrl).then((data) => {
    appState.names = data.names;
    appState.table = data.table;
    import_mithril.default.redraw();
  });
  function resetCheckboxList() {
    appState.selectedFirst.clear();
    appState.selectedSecond.clear();
    appState.disabledFirst.clear();
    appState.disabledSecond.clear();
    appState.solutions = [];
  }
  window.addEventListener("load", function() {
    import_mithril.default.mount(document.body, {
      view: function(vnode) {
        return [
          (0, import_mithril.default)("#zone1", [
            (0, import_mithril.default)(".lists", [
              (0, import_mithril.default)("#first.list", [
                (0, import_mithril.default)(".listHeader", [
                  (0, import_mithril.default)("span.caption", "\u0427\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C?"),
                  (0, import_mithril.default)("button.button", {
                    onclick: function(event) {
                      resetCheckboxList();
                    }
                  }, "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C")
                ]),
                (0, import_mithril.default)(".listWrapper", [
                  appState.names.map(function(value, index) {
                    return (0, import_mithril.default)(".listItem", { key: "si_" + index }, [
                      (0, import_mithril.default)("label.name", {
                        disabled: appState.disabledFirst.has(index)
                      }, [
                        (0, import_mithril.default)("input", {
                          type: "checkbox",
                          checked: appState.selectedFirst.has(index),
                          disabled: appState.disabledFirst.has(index),
                          value: index,
                          onclick: () => {
                            toggleSelection(index, true);
                          }
                        }),
                        value
                      ])
                    ]);
                  })
                ])
              ]),
              (0, import_mithril.default)("#second.list", [
                (0, import_mithril.default)(".listHeader", [
                  (0, import_mithril.default)("span.caption", "\u0427\u0442\u043E \u0443\u0445\u0443\u0434\u0448\u0430\u0435\u0442\u0441\u044F?"),
                  (0, import_mithril.default)("button.button", {
                    onclick: function(event) {
                      resetCheckboxList();
                    }
                  }, "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C")
                ]),
                (0, import_mithril.default)(".listWrapper", [
                  appState.names.map(function(value, index) {
                    return (0, import_mithril.default)(".listItem", { key: "sd_" + index }, [
                      (0, import_mithril.default)("label.name", {
                        disabled: appState.disabledSecond.has(index)
                      }, [
                        (0, import_mithril.default)("input", {
                          type: "checkbox",
                          checked: appState.selectedSecond.has(index),
                          disabled: appState.disabledSecond.has(index),
                          value: index,
                          onclick: () => {
                            toggleSelection(index, false);
                          }
                        }),
                        value
                      ])
                    ]);
                  })
                ])
              ])
            ]),
            (0, import_mithril.default)(".lists", [
              (0, import_mithril.default)("div#foundedSolutions.list.wide", [
                (0, import_mithril.default)(".listHeader", [
                  (0, import_mithril.default)("span.caption", "\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F")
                ]),
                (0, import_mithril.default)(".listWrapper", [
                  appState.solutions.map(function(value, index) {
                    return (0, import_mithril.default)(".listItem.solutions", { key: "sol_" + index }, [
                      value.solutions.length > 0 ? [
                        Object.values(value.rules).map((rule, index2) => {
                          return (0, import_mithril.default)("span.badge-solution", appState.names[rule]);
                        }),
                        Object.values(value.solutions).map((solution, index2) => {
                          return (0, import_mithril.default)("span.badge-solution", [
                            solution
                          ]);
                        })
                      ] : null
                    ]);
                  })
                ])
              ])
            ])
          ]),
          (0, import_mithril.default)("#graph", [])
        ];
      }
    });
  });
  function toggleSelection(index, isFirst) {
    let selected = isFirst ? appState.selectedFirst : appState.selectedSecond;
    if (selected.has(index)) {
      selected.delete(index);
    } else {
      selected.add(index);
    }
    appState.disabledFirst.clear();
    appState.disabledSecond.clear();
    appState.solutions = [];
    appState.selectedFirst.forEach((v, x) => {
      appState.names.forEach((v2, y) => {
        let tableItem = appState.table[x][y];
        if (typeof tableItem !== "object" && (tableItem === "-" || tableItem === "*")) {
          appState.disabledSecond.add(y);
        }
      });
    });
    appState.selectedSecond.forEach((v, x) => {
      appState.names.forEach((v2, y) => {
        let tableItem = appState.table[x][y];
        if (typeof tableItem !== "object" && (tableItem === "-" || tableItem === "*")) {
          appState.disabledFirst.add(y);
        }
      });
    });
    appState.selectedFirst.forEach((v, x) => {
      appState.selectedSecond.forEach((v2, y) => {
        let tableItem = appState.table[x][y];
        if (typeof tableItem === "object") {
          appState.solutions.push({
            rules: [x, y],
            solutions: tableItem
          });
        }
      });
    });
    let nodes = [];
    let links = [];
    var graph = import_vivagraphjs.default.Graph.graph();
    appState.solutions.map(function(value, index2) {
      if (value.solutions.length > 0) {
        let idx = index2 + 1;
        let names = [];
        Object.values(value.rules).map((rule, index22) => {
          names.push(appState.names[rule]);
        });
        nodes.push({
          name: names.join(" "),
          id: idx,
          type: "contradiction"
        });
        Object.values(value.solutions).map((solution, index22) => {
          let idx2 = index22 + 1;
          nodes.push({
            name: solution,
            id: idx2 * idx + 100,
            type: "solution"
          });
          links.push({
            source: idx,
            target: idx2 * idx + 100
          });
        });
      }
    });
    nodes.forEach((element) => {
      graph.addNode(element.id, element);
    });
    links.forEach((element) => {
      graph.addLink(element.source, element.target);
    });
    var graphics = import_vivagraphjs.default.Graph.View.svgGraphics();
    graphics.node(function(node) {
      return node.data.type === "contradiction" ? import_vivagraphjs.default.Graph.svg("rect").attr("width", 24).attr("height", 24).attr("fill", "#f5f5f5").attr("stroke", "#aaf").attr("stroke-width", "2px").attr("rx", "12") : import_vivagraphjs.default.Graph.svg("rect").attr("width", 24).attr("height", 24).attr("fill", "#fafafa").attr("stroke", "#faa").attr("stroke-width", "2px").attr("rx", "12");
    }).placeNode(function(nodeUI, pos) {
      nodeUI.attr("x", pos.x - 12).attr("y", pos.y - 12);
    });
    document.getElementById("graph").innerHTML = "";
    var renderer = import_vivagraphjs.default.Graph.View.renderer(graph, {
      container: document.getElementById("graph"),
      graphics
    });
    renderer.run();
  }
  if (true) {
    new EventSource("/esbuild").addEventListener("change", () => location.reload());
  }
})();
//# sourceMappingURL=app.js.map
