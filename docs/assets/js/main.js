!(function (e, t) {
    'use strict';

    typeof module === 'object' && typeof module.exports === 'object' ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document)
            throw new Error('jQuery requires a window with a document'); return t(e);
    } : t(e);
})(typeof window !== 'undefined' ? window : this, (C, e) => {
    'use strict';

    function x(e) { return e != null && e === e.window; } const t = []; const E = C.document; const r = Object.getPrototypeOf; const s = t.slice; const g = t.concat; const u = t.push; const i = t.indexOf; const n = {}; const o = n.toString; const v = n.hasOwnProperty; const a = v.toString; const l = a.call(Object); const y = {}; const m = function (e) { return typeof e === 'function' && typeof e.nodeType !== 'number'; }; const c = { type: !0, src: !0, nonce: !0, noModule: !0 }; function b(e, t, n) {
        let r; let i; const o = (n = n || E).createElement('script'); if (o.text = e, t)
            for (r in c)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i); n.head.appendChild(o).parentNode.removeChild(o);
    } function w(e) { return e == null ? e + '' : typeof e === 'object' || typeof e === 'function' ? n[o.call(e)] || 'object' : typeof e; } const f = '3.4.1'; var k = function (e, t) { return new k.fn.init(e, t); }; const p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g; function d(e) { const t = !!e && 'length' in e && e.length; const n = w(e); return !m(e) && !x(e) && (n === 'array' || t === 0 || typeof t === 'number' && t > 0 && t - 1 in e); }k.fn = k.prototype = { jquery: f, constructor: k, length: 0, toArray() { return s.call(this); }, get(e) { return e == null ? s.call(this) : e < 0 ? this[e + this.length] : this[e]; }, pushStack(e) { const t = k.merge(this.constructor(), e); return t.prevObject = this, t; }, each(e) { return k.each(this, e); }, map(n) { return this.pushStack(k.map(this, (e, t) => n.call(e, t, e))); }, slice() { return this.pushStack(s.apply(this, arguments)); }, first() { return this.eq(0); }, last() { return this.eq(-1); }, eq(e) { const t = this.length; const n = +e + (e < 0 ? t : 0); return this.pushStack(n >= 0 && n < t ? [this[n]] : []); }, end() { return this.prevObject || this.constructor(); }, push: u, sort: t.sort, splice: t.splice }, k.extend = k.fn.extend = function () {
        let e; let t; let n; let r; let i; let o; let a = arguments[0] || {}; let s = 1; const u = arguments.length; let l = !1; for (typeof a === 'boolean' && (l = a, a = arguments[s] || {}, s++), typeof a === 'object' || m(a) || (a = {}), s === u && (a = this, s--); s < u; s++)
            if ((e = arguments[s]) != null)
                for (t in e)
                    r = e[t], t !== '__proto__' && a !== r && (l && r && (k.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || k.isPlainObject(n) ? n : {}, i = !1, a[t] = k.extend(l, o, r)) : void 0 !== r && (a[t] = r)); return a;
    }, k.extend({ expando: 'jQuery' + (f + Math.random()).replace(/\D/g, ''), isReady: !0, error(e) { throw new Error(e); }, noop() {}, isPlainObject(e) { let t; let n; return !(!e || o.call(e) !== '[object Object]' || (t = r(e)) && (typeof (n = v.call(t, 'constructor') && t.constructor) !== 'function' || a.call(n) !== l)); }, isEmptyObject(e) {
        let t; for (t in e)
            return !1; return !0;
    }, globalEval(e, t) { b(e, { nonce: t && t.nonce }); }, each(e, t) {
        let n; let r = 0; if (d(e))
            for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++)
                ;else
            for (r in e)
                if (!1 === t.call(e[r], r, e[r]))
                    break; return e;
    }, trim(e) { return e == null ? '' : (e + '').replace(p, ''); }, makeArray(e, t) { const n = t || []; return e != null && (d(Object(e)) ? k.merge(n, typeof e === 'string' ? [e] : e) : u.call(n, e)), n; }, inArray(e, t, n) { return t == null ? -1 : i.call(t, e, n); }, merge(e, t) {
        for (var n = +t.length, r = 0, i = e.length; r < n; r++)
            e[i++] = t[r]; return e.length = i, e;
    }, grep(e, t, n) {
        for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
            !t(e[i], i) != a && r.push(e[i]); return r;
    }, map(e, t, n) {
        let r; let i; let o = 0; const a = []; if (d(e))
            for (r = e.length; o < r; o++)
                (i = t(e[o], o, n)) != null && a.push(i); else
            for (o in e)
                (i = t(e[o], o, n)) != null && a.push(i); return g.apply([], a);
    }, guid: 1, support: y }), typeof Symbol === 'function' && (k.fn[Symbol.iterator] = t[Symbol.iterator]), k.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '), (e, t) => { n['[object ' + t + ']'] = t.toLowerCase(); }); const h = (function (n) {
        function ne(e, t, n) { const r = '0x' + t - 65536; return r != r || n ? t : r < 0 ? String.fromCharCode(65536 + r) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320); } function oe() { T(); } let e; let d; let b; let o; let i; let h; let f; let g; let w; let u; let l; let T; let C; let a; let E; let v; let s; let c; let y; const k = 'sizzle' + 1 * new Date(); const m = n.document; let S = 0; let r = 0; const p = ue(); const x = ue(); const N = ue(); const A = ue(); let D = function (e, t) { return e === t && (l = !0), 0; }; const j = {}.hasOwnProperty; let t = []; const q = t.pop; const L = t.push; let H = t.push; const O = t.slice; const P = function (e, t) {
            for (let n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n; return -1;
        }; const R = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped'; const M = '[\\x20\\t\\r\\n\\f]'; const I = '(?:\\\\.|[\\w-]|[^\0-\\xa0])+'; const W = '\\[' + M + '*(' + I + ')(?:' + M + '*([*^$|!~]?=)' + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + I + '))|)' + M + '*\\]'; const $ = ':(' + I + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + W + ')*)|.*)\\)|)'; const F = new RegExp(M + '+', 'g'); const B = new RegExp('^' + M + '+|((?:^|[^\\\\])(?:\\\\.)*)' + M + '+$', 'g'); const _ = new RegExp('^' + M + '*,' + M + '*'); const z = new RegExp('^' + M + '*([>+~]|' + M + ')' + M + '*'); const U = new RegExp(M + '|>'); const X = new RegExp($); const V = new RegExp('^' + I + '$'); const G = { ID: new RegExp('^#(' + I + ')'), CLASS: new RegExp('^\\.(' + I + ')'), TAG: new RegExp('^(' + I + '|[*])'), ATTR: new RegExp('^' + W), PSEUDO: new RegExp('^' + $), CHILD: new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + M + '*(even|odd|(([+-]|)(\\d*)n|)' + M + '*(?:([+-]|)' + M + '*(\\d+)|))' + M + '*\\)|)', 'i'), bool: new RegExp('^(?:' + R + ')$', 'i'), needsContext: new RegExp('^' + M + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + M + '*((?:-\\d)?\\d*)' + M + '*\\)|)(?=[^-]|$)', 'i') }; const Y = /HTML$/i; const Q = /^(?:input|select|textarea|button)$/i; const J = /^h\d$/i; const K = /^[^{]+\{\s*\[native \w/; const Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/; const ee = /[+~]/; const te = new RegExp('\\\\([\\da-f]{1,6}' + M + '?|(' + M + ')|.)', 'ig'); const re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g; const ie = function (e, t) { return t ? e === '\0' ? '�' : e.slice(0, -1) + '\\' + e.charCodeAt(e.length - 1).toString(16) + ' ' : '\\' + e; }; const ae = be((e) => !0 === e.disabled && e.nodeName.toLowerCase() === 'fieldset', { dir: 'parentNode', next: 'legend' }); try { H.apply(t = O.call(m.childNodes), m.childNodes), t[m.childNodes.length].nodeType; } catch (e) {
            H = { apply: t.length ? function (e, t) { L.apply(e, O.call(t)); } : function (e, t) {
                for (var n = e.length, r = 0; e[n++] = t[r++];)
                    ;e.length = n - 1;
            } };
        } function se(t, e, n, r) {
            let i; let o; let a; let s; let u; let l; let c; let f = e && e.ownerDocument; const p = e ? e.nodeType : 9; if (n = n || [], typeof t !== 'string' || !t || p !== 1 && p !== 9 && p !== 11)
                return n; if (!r && ((e ? e.ownerDocument || e : m) !== C && T(e), e = e || C, E)) {
                if (p !== 11 && (u = Z.exec(t)))
                    if (i = u[1]) {
                        if (p === 9) {
                            if (!(a = e.getElementById(i)))
                                return n; if (a.id === i)
                                return n.push(a), n;
                        } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i)
                            return n.push(a), n;
                    } else {
                        if (u[2])
                            return H.apply(n, e.getElementsByTagName(t)), n; if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName)
                            return H.apply(n, e.getElementsByClassName(i)), n;
                    } if (d.qsa && !A[t + ' '] && (!v || !v.test(t)) && (p !== 1 || e.nodeName.toLowerCase() !== 'object')) {
                    if (c = t, f = e, p === 1 && U.test(t)) {
                        for ((s = e.getAttribute('id')) ? s = s.replace(re, ie) : e.setAttribute('id', s = k), o = (l = h(t)).length; o--;)
                            l[o] = '#' + s + ' ' + xe(l[o]); c = l.join(','), f = ee.test(t) && ye(e.parentNode) || e;
                    } try { return H.apply(n, f.querySelectorAll(c)), n; } catch (e) { A(t, !0); } finally { s === k && e.removeAttribute('id'); }
                }
            } return g(t.replace(B, '$1'), e, n, r);
        } function ue() { const r = []; return function e(t, n) { return r.push(t + ' ') > b.cacheLength && delete e[r.shift()], e[t + ' '] = n; }; } function le(e) { return e[k] = !0, e; } function ce(e) { let t = C.createElement('fieldset'); try { return !!e(t); } catch (e) { return !1; } finally { t.parentNode && t.parentNode.removeChild(t), t = null; } } function fe(e, t) {
            for (let n = e.split('|'), r = n.length; r--;)
                b.attrHandle[n[r]] = t;
        } function pe(e, t) {
            let n = t && e; const r = n && e.nodeType === 1 && t.nodeType === 1 && e.sourceIndex - t.sourceIndex; if (r)
                return r; if (n)
                for (;n = n.nextSibling;)
                    if (n === t)
                        return -1; return e ? 1 : -1;
        } function de(t) { return function (e) { return e.nodeName.toLowerCase() === 'input' && e.type === t; }; } function he(n) { return function (e) { const t = e.nodeName.toLowerCase(); return (t === 'input' || t === 'button') && e.type === n; }; } function ge(t) { return function (e) { return 'form' in e ? e.parentNode && !1 === e.disabled ? 'label' in e ? 'label' in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ae(e) === t : e.disabled === t : 'label' in e && e.disabled === t; }; } function ve(a) {
            return le((o) => o = +o, le((e, t) => {
                for (var n, r = a([], e.length, o), i = r.length; i--;)
                    e[n = r[i]] && (e[n] = !(t[n] = e[n]));
            }));
        } function ye(e) { return e && void 0 !== e.getElementsByTagName && e; } for (e in d = se.support = {}, i = se.isXML = function (e) { const t = e.namespaceURI; const n = (e.ownerDocument || e).documentElement; return !Y.test(t || n && n.nodeName || 'HTML'); }, T = se.setDocument = function (e) {
            let t; let n; const r = e ? e.ownerDocument || e : m; return r !== C && r.nodeType === 9 && r.documentElement && (a = (C = r).documentElement, E = !i(C), m !== C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener('unload', oe, !1) : n.attachEvent && n.attachEvent('onunload', oe)), d.attributes = ce((e) => e.className = 'i', !e.getAttribute('className')), d.getElementsByTagName = ce((e) => e.appendChild(C.createComment('')), !e.getElementsByTagName('*').length), d.getElementsByClassName = K.test(C.getElementsByClassName), d.getById = ce((e) => a.appendChild(e).id = k, !C.getElementsByName || !C.getElementsByName(k).length), d.getById ? (b.filter.ID = function (e) { const t = e.replace(te, ne); return function (e) { return e.getAttribute('id') === t; }; }, b.find.ID = function (e, t) { if (void 0 !== t.getElementById && E) { const n = t.getElementById(e); return n ? [n] : []; } }) : (b.filter.ID = function (e) { const n = e.replace(te, ne); return function (e) { const t = void 0 !== e.getAttributeNode && e.getAttributeNode('id'); return t && t.value === n; }; }, b.find.ID = function (e, t) {
                if (void 0 !== t.getElementById && E) {
                    let n; let r; let i; let o = t.getElementById(e); if (o) {
                        if ((n = o.getAttributeNode('id')) && n.value === e)
                            return [o]; for (i = t.getElementsByName(e), r = 0; o = i[r++];)
                            if ((n = o.getAttributeNode('id')) && n.value === e)
                                return [o];
                    } return [];
                }
            }), b.find.TAG = d.getElementsByTagName ? function (e, t) { return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0; } : function (e, t) {
                let n; const r = []; let i = 0; const o = t.getElementsByTagName(e); if (e !== '*')
                    return o; for (;n = o[i++];)
                    n.nodeType === 1 && r.push(n); return r;
            }, b.find.CLASS = d.getElementsByClassName && function (e, t) {
                if (void 0 !== t.getElementsByClassName && E)
                    return t.getElementsByClassName(e);
            }, s = [], v = [], (d.qsa = K.test(C.querySelectorAll)) && (ce((e) => { a.appendChild(e).innerHTML = "<a id='" + k + "'></a><select id='" + k + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push('[*^$]=' + M + "*(?:''|\"\")"), e.querySelectorAll('[selected]').length || v.push('\\[' + M + '*(?:value|' + R + ')'), e.querySelectorAll('[id~=' + k + '-]').length || v.push('~='), e.querySelectorAll(':checked').length || v.push(':checked'), e.querySelectorAll('a#' + k + '+*').length || v.push('.#.+[+~]'); }), ce((e) => { e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>"; const t = C.createElement('input'); t.setAttribute('type', 'hidden'), e.appendChild(t).setAttribute('name', 'D'), e.querySelectorAll('[name=d]').length && v.push('name' + M + '*[*^$|!~]?='), e.querySelectorAll(':enabled').length !== 2 && v.push(':enabled', ':disabled'), a.appendChild(e).disabled = !0, e.querySelectorAll(':disabled').length !== 2 && v.push(':enabled', ':disabled'), e.querySelectorAll('*,:x'), v.push(',.*:'); })), (d.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ce((e) => { d.disconnectedMatch = c.call(e, '*'), c.call(e, "[s!='']:x"), s.push('!=', $); }), v = v.length && new RegExp(v.join('|')), s = s.length && new RegExp(s.join('|')), t = K.test(a.compareDocumentPosition), y = t || K.test(a.contains) ? function (e, t) { const n = e.nodeType === 9 ? e.documentElement : e; const r = t && t.parentNode; return e === r || !(!r || r.nodeType !== 1 || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r))); } : function (e, t) {
                if (t)
                    for (;t = t.parentNode;)
                        if (t === e)
                            return !0; return !1;
            }, D = t ? function (e, t) {
                if (e === t)
                    return l = !0, 0; let n = !e.compareDocumentPosition - !t.compareDocumentPosition; return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === m && y(m, e) ? -1 : t === C || t.ownerDocument === m && y(m, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1);
            } : function (e, t) {
                if (e === t)
                    return l = !0, 0; let n; let r = 0; const i = e.parentNode; const o = t.parentNode; const a = [e]; const s = [t]; if (!i || !o)
                    return e === C ? -1 : t === C ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0; if (i === o)
                    return pe(e, t); for (n = e; n = n.parentNode;)
                    a.unshift(n); for (n = t; n = n.parentNode;)
                    s.unshift(n); for (;a[r] === s[r];)
                    r++; return r ? pe(a[r], s[r]) : a[r] === m ? -1 : s[r] === m ? 1 : 0;
            }), C;
        }, se.matches = function (e, t) { return se(e, null, null, t); }, se.matchesSelector = function (e, t) {
            if ((e.ownerDocument || e) !== C && T(e), d.matchesSelector && E && !A[t + ' '] && (!s || !s.test(t)) && (!v || !v.test(t)))
                try {
                    const n = c.call(e, t); if (n || d.disconnectedMatch || e.document && e.document.nodeType !== 11)
                        return n;
                } catch (e) { A(t, !0); } return se(t, C, null, [e]).length > 0;
        }, se.contains = function (e, t) { return (e.ownerDocument || e) !== C && T(e), y(e, t); }, se.attr = function (e, t) { (e.ownerDocument || e) !== C && T(e); const n = b.attrHandle[t.toLowerCase()]; let r = n && j.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0; return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null; }, se.escape = function (e) { return (e + '').replace(re, ie); }, se.error = function (e) { throw new Error('Syntax error, unrecognized expression: ' + e); }, se.uniqueSort = function (e) {
            let t; const n = []; let r = 0; let i = 0; if (l = !d.detectDuplicates, u = !d.sortStable && e.slice(0), e.sort(D), l) {
                for (;t = e[i++];)
                    t === e[i] && (r = n.push(i)); for (;r--;)
                    e.splice(n[r], 1);
            } return u = null, e;
        }, o = se.getText = function (e) {
            let t; let n = ''; let r = 0; const i = e.nodeType; if (i) {
                if (i === 1 || i === 9 || i === 11) {
                    if (typeof e.textContent === 'string')
                        return e.textContent; for (e = e.firstChild; e; e = e.nextSibling)
                        n += o(e);
                } else if (i === 3 || i === 4)
                    return e.nodeValue;
            } else
                for (;t = e[r++];)
                    n += o(t); return n;
        }, (b = se.selectors = { cacheLength: 50, createPseudo: le, match: G, attrHandle: {}, find: {}, relative: { '>': { dir: 'parentNode', first: !0 }, ' ': { dir: 'parentNode' }, '+': { dir: 'previousSibling', first: !0 }, '~': { dir: 'previousSibling' } }, preFilter: { ATTR(e) { return e[1] = e[1].replace(te, ne), e[3] = (e[3] || e[4] || e[5] || '').replace(te, ne), e[2] === '~=' && (e[3] = ' ' + e[3] + ' '), e.slice(0, 4); }, CHILD(e) { return e[1] = e[1].toLowerCase(), e[1].slice(0, 3) === 'nth' ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === 'even' || e[3] === 'odd')), e[5] = +(e[7] + e[8] || e[3] === 'odd')) : e[3] && se.error(e[0]), e; }, PSEUDO(e) { let t; const n = !e[6] && e[2]; return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || '' : n && X.test(n) && (t = h(n, !0)) && (t = n.indexOf(')', n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3)); } }, filter: { TAG(e) { const t = e.replace(te, ne).toLowerCase(); return e === '*' ? function () { return !0; } : function (e) { return e.nodeName && e.nodeName.toLowerCase() === t; }; }, CLASS(e) { let t = p[e + ' ']; return t || (t = new RegExp('(^|' + M + ')' + e + '(' + M + '|$)')) && p(e, (e) => t.test(typeof e.className === 'string' && e.className || void 0 !== e.getAttribute && e.getAttribute('class') || '')); }, ATTR(n, r, i) { return function (e) { let t = se.attr(e, n); return t == null ? r === '!=' : !r || (t += '', r === '=' ? t === i : r === '!=' ? t !== i : r === '^=' ? i && t.indexOf(i) === 0 : r === '*=' ? i && t.indexOf(i) > -1 : r === '$=' ? i && t.slice(-i.length) === i : r === '~=' ? (' ' + t.replace(F, ' ') + ' ').indexOf(i) > -1 : r === '|=' && (t === i || t.slice(0, i.length + 1) === i + '-')); }; }, CHILD(h, e, t, g, v) {
            const y = h.slice(0, 3) !== 'nth'; const m = h.slice(-4) !== 'last'; const x = e === 'of-type'; return g === 1 && v === 0 ? function (e) { return !!e.parentNode; } : function (e, t, n) {
                let r; let i; let o; let a; let s; let u; let l = y != m ? 'nextSibling' : 'previousSibling'; const c = e.parentNode; const f = x && e.nodeName.toLowerCase(); const p = !n && !x; let d = !1; if (c) {
                    if (y) {
                        for (;l;) {
                            for (a = e; a = a[l];)
                                if (x ? a.nodeName.toLowerCase() === f : a.nodeType === 1)
                                    return !1; u = l = h === 'only' && !u && 'nextSibling';
                        } return !0;
                    } if (u = [m ? c.firstChild : c.lastChild], m && p) {
                        for (d = (s = (r = (i = (o = (a = c)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]) && r[2], a = s && c.childNodes[s]; a = ++s && a && a[l] || (d = s = 0) || u.pop();)
                            if (a.nodeType === 1 && ++d && a === e) { i[h] = [S, s, d]; break; }
                    } else if (p && (d = s = (r = (i = (o = (a = e)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]), !1 === d)
                        for (;(a = ++s && a && a[l] || (d = s = 0) || u.pop()) && ((x ? a.nodeName.toLowerCase() !== f : a.nodeType !== 1) || !++d || (p && ((i = (o = a[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [S, d]), a !== e));)
                            ;return (d -= v) === g || d % g == 0 && d / g >= 0;
                }
            };
        }, PSEUDO(e, o) {
            let t; const a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error('unsupported pseudo: ' + e); return a[k] ? a(o) : a.length > 1 ? (t = [e, e, '', o], b.setFilters.hasOwnProperty(e.toLowerCase()) ? le((e, t) => {
                for (var n, r = a(e, o), i = r.length; i--;)
                    e[n = P(e, r[i])] = !(t[n] = r[i]);
            }) : function (e) { return a(e, 0, t); }) : a;
        } }, pseudos: { not: le((e) => {
            const r = []; const i = []; const s = f(e.replace(B, '$1')); return s[k] ? le((e, t, n, r) => {
                for (var i, o = s(e, null, r, []), a = e.length; a--;)
                    (i = o[a]) && (e[a] = !(t[a] = i));
            }) : function (e, t, n) { return r[0] = e, s(r, null, n, i), r[0] = null, !i.pop(); };
        }), has: le((t) => function (e) { return se(t, e).length > 0; }), contains: le((t) => t = t.replace(te, ne), (e) => (e.textContent || o(e)).indexOf(t) > -1), lang: le((n) => V.test(n || '') || se.error('unsupported lang: ' + n), n = n.replace(te, ne).toLowerCase(), (e) => {
            let t; do {
                if (t = E ? e.lang : e.getAttribute('xml:lang') || e.getAttribute('lang'))
                    return (t = t.toLowerCase()) === n || t.indexOf(n + '-') === 0;
            } while ((e = e.parentNode) && e.nodeType === 1);return !1;
        }), target(e) { const t = n.location && n.location.hash; return t && t.slice(1) === e.id; }, root(e) { return e === a; }, focus(e) { return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex); }, enabled: ge(!1), disabled: ge(!0), checked(e) { const t = e.nodeName.toLowerCase(); return t === 'input' && !!e.checked || t === 'option' && !!e.selected; }, selected(e) { return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected; }, empty(e) {
            for (e = e.firstChild; e; e = e.nextSibling)
                if (e.nodeType < 6)
                    return !1; return !0;
        }, parent(e) { return !b.pseudos.empty(e); }, header(e) { return J.test(e.nodeName); }, input(e) { return Q.test(e.nodeName); }, button(e) { const t = e.nodeName.toLowerCase(); return t === 'input' && e.type === 'button' || t === 'button'; }, text(e) { let t; return e.nodeName.toLowerCase() === 'input' && e.type === 'text' && ((t = e.getAttribute('type')) == null || t.toLowerCase() === 'text'); }, first: ve(() => [0]), last: ve((e, t) => [t - 1]), eq: ve((e, t, n) => [n < 0 ? n + t : n]), even: ve((e, t) => {
            for (let n = 0; n < t; n += 2)
                e.push(n); return e;
        }), odd: ve((e, t) => {
            for (let n = 1; n < t; n += 2)
                e.push(n); return e;
        }), lt: ve((e, t, n) => {
            for (let r = n < 0 ? n + t : t < n ? t : n; --r >= 0;)
                e.push(r); return e;
        }), gt: ve((e, t, n) => {
            for (let r = n < 0 ? n + t : n; ++r < t;)
                e.push(r); return e;
        }) } }).pseudos.nth = b.pseudos.eq, { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
            b.pseudos[e] = de(e); for (e in { submit: !0, reset: !0 })
            b.pseudos[e] = he(e); function me() {} function xe(e) {
            for (var t = 0, n = e.length, r = ''; t < n; t++)
                r += e[t].value; return r;
        } function be(s, e, t) {
            const u = e.dir; const l = e.next; const c = l || u; const f = t && c === 'parentNode'; const p = r++; return e.first ? function (e, t, n) {
                for (;e = e[u];)
                    if (e.nodeType === 1 || f)
                        return s(e, t, n); return !1;
            } : function (e, t, n) {
                let r; let i; let o; const a = [S, p]; if (n) {
                    for (;e = e[u];)
                        if ((e.nodeType === 1 || f) && s(e, t, n))
                            return !0;
                } else
                    for (;e = e[u];)
                        if (e.nodeType === 1 || f)
                            if (i = (o = e[k] || (e[k] = {}))[e.uniqueID] || (o[e.uniqueID] = {}), l && l === e.nodeName.toLowerCase())
                                e = e[u] || e; else {
                                if ((r = i[c]) && r[0] === S && r[1] === p)
                                    return a[2] = r[2]; if ((i[c] = a)[2] = s(e, t, n))
                                    return !0;
                            } return !1;
            };
        } function we(i) {
            return i.length > 1 ? function (e, t, n) {
                for (let r = i.length; r--;)
                    if (!i[r](e, t, n))
                        return !1; return !0;
            } : i[0];
        } function Te(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = t != null; s < u; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o), l && t.push(s))); return a;
        } function Ce(d, h, g, v, y, e) {
            return v && !v[k] && (v = Ce(v)), y && !y[k] && (y = Ce(y, e)), le((e, t, n, r) => {
                let i; let o; let a; const s = []; const u = []; const l = t.length; const c = e || (function (e, t, n) {
                    for (let r = 0, i = t.length; r < i; r++)
                        se(e, t[r], n); return n;
                })(h || '*', n.nodeType ? [n] : n, []); const f = !d || !e && h ? c : Te(c, s, d, n, r); let p = g ? y || (e ? d : l || v) ? [] : t : f; if (g && g(f, p, n, r), v)
                    for (i = Te(p, u), v(i, [], n, r), o = i.length; o--;)
                        (a = i[o]) && (p[u[o]] = !(f[u[o]] = a)); if (e) {
                    if (y || d) {
                        if (y) {
                            for (i = [], o = p.length; o--;)
                                (a = p[o]) && i.push(f[o] = a); y(null, p = [], i, r);
                        } for (o = p.length; o--;)
                            (a = p[o]) && (i = y ? P(e, a) : s[o]) > -1 && (e[i] = !(t[i] = a));
                    }
                } else
                    p = Te(p === t ? p.splice(l, p.length) : p), y ? y(null, t, p, r) : H.apply(t, p);
            });
        } function Ee(e) {
            for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[' '], s = o ? 1 : 0, u = be((e) => e === i, a, !0), l = be((e) => P(i, e) > -1, a, !0), c = [function (e, t, n) { const r = !o && (n || t !== w) || ((i = t).nodeType ? u(e, t, n) : l(e, t, n)); return i = null, r; }]; s < r; s++)
                if (t = b.relative[e[s].type])
                    c = [be(we(c), t)]; else {
                    if ((t = b.filter[e[s].type].apply(null, e[s].matches))[k]) {
                        for (n = ++s; n < r && !b.relative[e[n].type]; n++)
                            ;return Ce(s > 1 && we(c), s > 1 && xe(e.slice(0, s - 1).concat({ value: e[s - 2].type === ' ' ? '*' : '' })).replace(B, '$1'), t, s < n && Ee(e.slice(s, n)), n < r && Ee(e = e.slice(n)), n < r && xe(e));
                    }c.push(t);
                } return we(c);
        } return me.prototype = b.filters = b.pseudos, b.setFilters = new me(), h = se.tokenize = function (e, t) {
            let n; let r; let i; let o; let a; let s; let u; const l = x[e + ' ']; if (l)
                return t ? 0 : l.slice(0); for (a = e, s = [], u = b.preFilter; a;) {
                for (o in n && !(r = _.exec(a)) || (r && (a = a.slice(r[0].length) || a), s.push(i = [])), n = !1, (r = z.exec(a)) && (n = r.shift(), i.push({ value: n, type: r[0].replace(B, ' ') }), a = a.slice(n.length)), b.filter)
                    !(r = G[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(), i.push({ value: n, type: o, matches: r }), a = a.slice(n.length)); if (!n)
                    break;
            } return t ? a.length : a ? se.error(e) : x(e, s).slice(0);
        }, f = se.compile = function (e, t) {
            let n; let v; let y; let m; let x; let r; const i = []; const o = []; let a = N[e + ' ']; if (!a) {
                for (t || (t = h(e)), n = t.length; n--;)
                    (a = Ee(t[n]))[k] ? i.push(a) : o.push(a); (a = N(e, (v = o, m = (y = i).length > 0, x = v.length > 0, r = function (e, t, n, r, i) {
                    let o; let a; let s; let u = 0; let l = '0'; const c = e && []; let f = []; const p = w; const d = e || x && b.find.TAG('*', i); const h = S += p == null ? 1 : Math.random() || 0.1; const g = d.length; for (i && (w = t === C || t || i); l !== g && (o = d[l]) != null; l++) {
                        if (x && o) {
                            for (a = 0, t || o.ownerDocument === C || (T(o), n = !E); s = v[a++];)
                                if (s(o, t || C, n)) { r.push(o); break; }i && (S = h);
                        }m && ((o = !s && o) && u--, e && c.push(o));
                    } if (u += l, m && l !== u) {
                        for (a = 0; s = y[a++];)
                            s(c, f, t, n); if (e) {
                            if (u > 0)
                                for (;l--;)
                                    c[l] || f[l] || (f[l] = q.call(r)); f = Te(f);
                        }H.apply(r, f), i && !e && f.length > 0 && u + y.length > 1 && se.uniqueSort(r);
                    } return i && (S = h, w = p), c;
                }, m ? le(r) : r))).selector = e;
            } return a;
        }, g = se.select = function (e, t, n, r) {
            let i; let o; let a; let s; let u; const l = typeof e === 'function' && e; const c = !r && h(e = l.selector || e); if (n = n || [], c.length === 1) {
                if ((o = c[0] = c[0].slice(0)).length > 2 && (a = o[0]).type === 'ID' && t.nodeType === 9 && E && b.relative[o[1].type]) {
                    if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0]))
                        return n; l && (t = t.parentNode), e = e.slice(o.shift().value.length);
                } for (i = G.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !b.relative[s = a.type]);)
                    if ((u = b.find[s]) && (r = u(a.matches[0].replace(te, ne), ee.test(o[0].type) && ye(t.parentNode) || t))) {
                        if (o.splice(i, 1), !(e = r.length && xe(o)))
                            return H.apply(n, r), n; break;
                    }
            } return (l || f(e, c))(r, t, !E, n, !t || ee.test(e) && ye(t.parentNode) || t), n;
        }, d.sortStable = k.split('').sort(D).join('') === k, d.detectDuplicates = !!l, T(), d.sortDetached = ce((e) => 1 & e.compareDocumentPosition(C.createElement('fieldset'))), ce((e) => e.innerHTML = "<a href='#'></a>", e.firstChild.getAttribute('href') === '#') || fe('type|href|height|width', (e, t, n) => {
            if (!n)
                return e.getAttribute(t, t.toLowerCase() === 'type' ? 1 : 2);
        }), d.attributes && ce((e) => e.innerHTML = '<input/>', e.firstChild.setAttribute('value', ''), e.firstChild.getAttribute('value') === '') || fe('value', (e, t, n) => {
            if (!n && e.nodeName.toLowerCase() === 'input')
                return e.defaultValue;
        }), ce((e) => e.getAttribute('disabled') == null) || fe(R, (e, t, n) => {
            let r; if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
        }), se;
    })(C); k.find = h, k.expr = h.selectors, k.expr[':'] = k.expr.pseudos, k.uniqueSort = k.unique = h.uniqueSort, k.text = h.getText, k.isXMLDoc = h.isXML, k.contains = h.contains, k.escapeSelector = h.escape; function T(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && e.nodeType !== 9;)
            if (e.nodeType === 1) {
                if (i && k(e).is(n))
                    break; r.push(e);
            } return r;
    } function S(e, t) {
        for (var n = []; e; e = e.nextSibling)
            e.nodeType === 1 && e !== t && n.push(e); return n;
    } const N = k.expr.match.needsContext; function A(e, t) { return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase(); } const D = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; function j(e, n, r) { return m(n) ? k.grep(e, (e, t) => !!n.call(e, t, e) !== r) : n.nodeType ? k.grep(e, (e) => e === n !== r) : typeof n !== 'string' ? k.grep(e, (e) => i.call(n, e) > -1 !== r) : k.filter(n, e, r); }k.filter = function (e, t, n) { const r = t[0]; return n && (e = ':not(' + e + ')'), t.length === 1 && r.nodeType === 1 ? k.find.matchesSelector(r, e) ? [r] : [] : k.find.matches(e, k.grep(t, (e) => e.nodeType === 1)); }, k.fn.extend({ find(e) {
        let t; let n; const r = this.length; const i = this; if (typeof e !== 'string')
            return this.pushStack(k(e).filter(function () {
                for (t = 0; t < r; t++)
                    if (k.contains(i[t], this))
                        return !0;
            })); for (n = this.pushStack([]), t = 0; t < r; t++)
            k.find(e, i[t], n); return r > 1 ? k.uniqueSort(n) : n;
    }, filter(e) { return this.pushStack(j(this, e || [], !1)); }, not(e) { return this.pushStack(j(this, e || [], !0)); }, is(e) { return !!j(this, typeof e === 'string' && N.test(e) ? k(e) : e || [], !1).length; } }); let q; const L = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/; (k.fn.init = function (e, t, n) {
        let r; let i; if (!e)
            return this; if (n = n || q, typeof e !== 'string')
            return e.nodeType ? (this[0] = e, this.length = 1, this) : m(e) ? void 0 !== n.ready ? n.ready(e) : e(k) : k.makeArray(e, this); if (!(r = e[0] === '<' && e[e.length - 1] === '>' && e.length >= 3 ? [null, e, null] : L.exec(e)) || !r[1] && t)
            return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e); if (r[1]) {
            if (t = t instanceof k ? t[0] : t, k.merge(this, k.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)), D.test(r[1]) && k.isPlainObject(t))
                for (r in t)
                    m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]); return this;
        } return (i = E.getElementById(r[2])) && (this[0] = i, this.length = 1), this;
    }).prototype = k.fn, q = k(E); const H = /^(?:parents|prev(?:Until|All))/; const O = { children: !0, contents: !0, next: !0, prev: !0 }; function P(e, t) {
        for (;(e = e[t]) && e.nodeType !== 1;)
            ;return e;
    }k.fn.extend({ has(e) {
        const t = k(e, this); const n = t.length; return this.filter(function () {
            for (let e = 0; e < n; e++)
                if (k.contains(this, t[e]))
                    return !0;
        });
    }, closest(e, t) {
        let n; let r = 0; const i = this.length; const o = []; const a = typeof e !== 'string' && k(e); if (!N.test(e))
            for (;r < i; r++)
                for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : n.nodeType === 1 && k.find.matchesSelector(n, e))) { o.push(n); break; } return this.pushStack(o.length > 1 ? k.uniqueSort(o) : o);
    }, index(e) { return e ? typeof e === 'string' ? i.call(k(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1; }, add(e, t) { return this.pushStack(k.uniqueSort(k.merge(this.get(), k(e, t)))); }, addBack(e) { return this.add(e == null ? this.prevObject : this.prevObject.filter(e)); } }), k.each({ parent(e) { const t = e.parentNode; return t && t.nodeType !== 11 ? t : null; }, parents(e) { return T(e, 'parentNode'); }, parentsUntil(e, t, n) { return T(e, 'parentNode', n); }, next(e) { return P(e, 'nextSibling'); }, prev(e) { return P(e, 'previousSibling'); }, nextAll(e) { return T(e, 'nextSibling'); }, prevAll(e) { return T(e, 'previousSibling'); }, nextUntil(e, t, n) { return T(e, 'nextSibling', n); }, prevUntil(e, t, n) { return T(e, 'previousSibling', n); }, siblings(e) { return S((e.parentNode || {}).firstChild, e); }, children(e) { return S(e.firstChild); }, contents(e) { return void 0 !== e.contentDocument ? e.contentDocument : (A(e, 'template') && (e = e.content || e), k.merge([], e.childNodes)); } }, (r, i) => { k.fn[r] = function (e, t) { let n = k.map(this, i, e); return r.slice(-5) !== 'Until' && (t = e), t && typeof t === 'string' && (n = k.filter(t, n)), this.length > 1 && (O[r] || k.uniqueSort(n), H.test(r) && n.reverse()), this.pushStack(n); }; }); const R = /[^\x20\t\r\n\f]+/g; function M(e) { return e; } function I(e) { throw e; } function W(e, t, n, r) { let i; try { e && m(i = e.promise) ? i.call(e).done(t).fail(n) : e && m(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r)); } catch (e) { n.apply(void 0, [e]); } }k.Callbacks = function (r) {
        let e; let n; r = typeof r === 'string' ? (e = r, n = {}, k.each(e.match(R) || [], (e, t) => { n[t] = !0; }), n) : k.extend({}, r); function c() {
            for (a = a || r.once, o = i = !0; u.length; l = -1)
                for (t = u.shift(); ++l < s.length;)
                    !1 === s[l].apply(t[0], t[1]) && r.stopOnFalse && (l = s.length, t = !1); r.memory || (t = !1), i = !1, a && (s = t ? [] : '');
        } let i; let t; let o; let a; var s = []; var u = []; var l = -1; var f = { add() { return s && (t && !i && (l = s.length - 1, u.push(t)), (function n(e) { k.each(e, (e, t) => { m(t) ? r.unique && f.has(t) || s.push(t) : t && t.length && w(t) !== 'string' && n(t); }); })(arguments), t && !i && c()), this; }, remove() {
            return k.each(arguments, (e, t) => {
                for (var n; (n = k.inArray(t, s, n)) > -1;)
                    s.splice(n, 1), n <= l && l--;
            }), this;
        }, has(e) { return e ? k.inArray(e, s) > -1 : s.length > 0; }, empty() { return s && (s = []), this; }, disable() { return a = u = [], s = t = '', this; }, disabled() { return !s; }, lock() { return a = u = [], t || i || (s = t = ''), this; }, locked() { return !!a; }, fireWith(e, t) { return a || (t = [e, (t = t || []).slice ? t.slice() : t], u.push(t), i || c()), this; }, fire() { return f.fireWith(this, arguments), this; }, fired() { return !!o; } }; return f;
    }, k.extend({ Deferred(e) {
        const o = [['notify', 'progress', k.Callbacks('memory'), k.Callbacks('memory'), 2], ['resolve', 'done', k.Callbacks('once memory'), k.Callbacks('once memory'), 0, 'resolved'], ['reject', 'fail', k.Callbacks('once memory'), k.Callbacks('once memory'), 1, 'rejected']]; let i = 'pending'; var a = { state() { return i; }, always() { return s.done(arguments).fail(arguments), this; }, catch(e) { return a.then(null, e); }, pipe() { let i = arguments; return k.Deferred((r) => { k.each(o, (e, t) => { const n = m(i[t[4]]) && i[t[4]]; s[t[1]](function () { const e = n && n.apply(this, arguments); e && m(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + 'With'](this, n ? [e] : arguments); }); }), i = null; }).promise(); }, then(t, n, r) {
            let u = 0; function l(i, o, a, s) {
                return function () {
                    let n = this; let r = arguments; const e = function () {
                        let e; let t; if (!(i < u)) {
                            if ((e = a.apply(n, r)) === o.promise())
                                throw new TypeError('Thenable self-resolution'); t = e && (typeof e === 'object' || typeof e === 'function') && e.then, m(t) ? s ? t.call(e, l(u, o, M, s), l(u, o, I, s)) : (u++, t.call(e, l(u, o, M, s), l(u, o, I, s), l(u, o, M, o.notifyWith))) : (a !== M && (n = void 0, r = [e]), (s || o.resolveWith)(n, r));
                        }
                    }; var t = s ? e : function () { try { e(); } catch (e) { k.Deferred.exceptionHook && k.Deferred.exceptionHook(e, t.stackTrace), u <= i + 1 && (a !== I && (n = void 0, r = [e]), o.rejectWith(n, r)); } }; i ? t() : (k.Deferred.getStackHook && (t.stackTrace = k.Deferred.getStackHook()), C.setTimeout(t));
                };
            } return k.Deferred((e) => { o[0][3].add(l(0, e, m(r) ? r : M, e.notifyWith)), o[1][3].add(l(0, e, m(t) ? t : M)), o[2][3].add(l(0, e, m(n) ? n : I)); }).promise();
        }, promise(e) { return e != null ? k.extend(e, a) : a; } }; var s = {}; return k.each(o, (e, t) => { const n = t[2]; const r = t[5]; a[t[1]] = n.add, r && n.add(() => { i = r; }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock), n.add(t[3].fire), s[t[0]] = function () { return s[t[0] + 'With'](this === s ? void 0 : this, arguments), this; }, s[t[0] + 'With'] = n.fireWith; }), a.promise(s), e && e.call(s, s), s;
    }, when(e) {
        function a(t) { return function (e) { r[t] = this, i[t] = arguments.length > 1 ? s.call(arguments) : e, --n || o.resolveWith(r, i); }; } var n = arguments.length; let t = n; var r = Array(t); var i = s.call(arguments); var o = k.Deferred(); if (n <= 1 && (W(e, o.done(a(t)).resolve, o.reject, !n), o.state() === 'pending' || m(i[t] && i[t].then)))
            return o.then(); for (;t--;)
            W(i[t], a(t), o.reject); return o.promise();
    } }); const $ = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/; k.Deferred.exceptionHook = function (e, t) { C.console && C.console.warn && e && $.test(e.name) && C.console.warn('jQuery.Deferred exception: ' + e.message, e.stack, t); }, k.readyException = function (e) { C.setTimeout(() => { throw e; }); }; const F = k.Deferred(); function B() { E.removeEventListener('DOMContentLoaded', B), C.removeEventListener('load', B), k.ready(); }k.fn.ready = function (e) { return F.then(e).catch((e) => { k.readyException(e); }), this; }, k.extend({ isReady: !1, readyWait: 1, ready(e) { (!0 === e ? --k.readyWait : k.isReady) || (k.isReady = !0) !== e && --k.readyWait > 0 || F.resolveWith(E, [k]); } }), k.ready.then = F.then, E.readyState === 'complete' || E.readyState !== 'loading' && !E.documentElement.doScroll ? C.setTimeout(k.ready) : (E.addEventListener('DOMContentLoaded', B), C.addEventListener('load', B)); var _ = function (e, t, n, r, i, o, a) {
        let s = 0; const u = e.length; let l = n == null; if (w(n) === 'object')
            for (s in i = !0, n)
                _(e, t, s, n[s], !0, o, a); else if (void 0 !== r && (i = !0, m(r) || (a = !0), l && (t = a ? (t.call(e, r), null) : (l = t, function (e, t, n) { return l.call(k(e), n); })), t))
            for (;s < u; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n))); return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
    }; const z = /^-ms-/; const U = /-([a-z])/g; function X(e, t) { return t.toUpperCase(); } function V(e) { return e.replace(z, 'ms-').replace(U, X); } function G(e) { return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType; } function Y() { this.expando = k.expando + Y.uid++; }Y.uid = 1, Y.prototype = { cache(e) { let t = e[this.expando]; return t || (t = {}, G(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, { value: t, configurable: !0 }))), t; }, set(e, t, n) {
        let r; const i = this.cache(e); if (typeof t === 'string')
            i[V(t)] = n; else
            for (r in t)
                i[V(r)] = t[r]; return i;
    }, get(e, t) { return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][V(t)]; }, access(e, t, n) { return void 0 === t || t && typeof t === 'string' && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t); }, remove(e, t) {
        let n; const r = e[this.expando]; if (void 0 !== r) {
            if (void 0 !== t) {
                n = (t = Array.isArray(t) ? t.map(V) : (t = V(t)) in r ? [t] : t.match(R) || []).length; for (;n--;)
                    delete r[t[n]];
            } void 0 !== t && !k.isEmptyObject(r) || (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
        }
    }, hasData(e) { const t = e[this.expando]; return void 0 !== t && !k.isEmptyObject(t); } }; const Q = new Y();
    const J = new Y();
    const K = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/; const
        Z = /[A-Z]/g; function ee(e, t, n) {
        let r; let i; if (void 0 === n && e.nodeType === 1)
            if (r = 'data-' + t.replace(Z, '-$&').toLowerCase(), typeof (n = e.getAttribute(r)) === 'string') { try { n = (i = n) === 'true' || i !== 'false' && (i === 'null' ? null : i === +i + '' ? +i : K.test(i) ? JSON.parse(i) : i); } catch (e) {}J.set(e, t, n); } else
                n = void 0; return n;
    }k.extend({ hasData(e) { return J.hasData(e) || Q.hasData(e); }, data(e, t, n) { return J.access(e, t, n); }, removeData(e, t) { J.remove(e, t); }, _data(e, t, n) { return Q.access(e, t, n); }, _removeData(e, t) { Q.remove(e, t); } }), k.fn.extend({ data(n, e) {
        let t; let r; let i; const o = this[0]; const a = o && o.attributes; if (void 0 !== n)
            return typeof n === 'object' ? this.each(function () { J.set(this, n); }) : _(this, function (e) {
                let t; if (o && void 0 === e)
                    return void 0 !== (t = J.get(o, n)) ? t : void 0 !== (t = ee(o, n)) ? t : void 0; this.each(function () { J.set(this, n, e); });
            }, null, e, arguments.length > 1, null, !0); if (this.length && (i = J.get(o), o.nodeType === 1 && !Q.get(o, 'hasDataAttrs'))) {
            for (t = a.length; t--;)
                a[t] && (r = a[t].name).indexOf('data-') === 0 && (r = V(r.slice(5)), ee(o, r, i[r])); Q.set(o, 'hasDataAttrs', !0);
        } return i;
    }, removeData(e) { return this.each(function () { J.remove(this, e); }); } }), k.extend({ queue(e, t, n) {
        let r; if (e)
            return t = (t || 'fx') + 'queue', r = Q.get(e, t), n && (!r || Array.isArray(n) ? r = Q.access(e, t, k.makeArray(n)) : r.push(n)), r || [];
    }, dequeue(e, t) { t = t || 'fx'; const n = k.queue(e, t); let r = n.length; let i = n.shift(); const o = k._queueHooks(e, t); i === 'inprogress' && (i = n.shift(), r--), i && (t === 'fx' && n.unshift('inprogress'), delete o.stop, i.call(e, () => { k.dequeue(e, t); }, o)), !r && o && o.empty.fire(); }, _queueHooks(e, t) { const n = t + 'queueHooks'; return Q.get(e, n) || Q.access(e, n, { empty: k.Callbacks('once memory').add(() => { Q.remove(e, [t + 'queue', n]); }) }); } }), k.fn.extend({ queue(t, n) { let e = 2; return typeof t !== 'string' && (n = t, t = 'fx', e--), arguments.length < e ? k.queue(this[0], t) : void 0 === n ? this : this.each(function () { const e = k.queue(this, t, n); k._queueHooks(this, t), t === 'fx' && e[0] !== 'inprogress' && k.dequeue(this, t); }); }, dequeue(e) { return this.each(function () { k.dequeue(this, e); }); }, clearQueue(e) { return this.queue(e || 'fx', []); }, promise(e, t) {
        function s() { --r || i.resolveWith(o, [o]); } let n; var r = 1; var i = k.Deferred(); var o = this; let a = this.length; for (typeof e !== 'string' && (t = e, e = void 0), e = e || 'fx'; a--;)
            (n = Q.get(o[a], e + 'queueHooks')) && n.empty && (r++, n.empty.add(s)); return s(), i.promise(t);
    } }); const te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source; const ne = new RegExp('^(?:([+-])=|)(' + te + ')([a-z%]*)$', 'i'); const re = ['Top', 'Right', 'Bottom', 'Left']; const ie = E.documentElement; let oe = function (e) { return k.contains(e.ownerDocument, e); }; const ae = { composed: !0 }; ie.getRootNode && (oe = function (e) { return k.contains(e.ownerDocument, e) || e.getRootNode(ae) === e.ownerDocument; }); function se(e, t) { return (e = t || e).style.display === 'none' || e.style.display === '' && oe(e) && k.css(e, 'display') === 'none'; } function ue(e, t, n, r) {
        let i; let o; const a = {}; for (o in t)
            a[o] = e.style[o], e.style[o] = t[o]; for (o in i = n.apply(e, r || []), t)
            e.style[o] = a[o]; return i;
    } function le(e, t, n, r) {
        let i; let o; let a = 20; const s = r ? function () { return r.cur(); } : function () { return k.css(e, t, ''); }; let u = s(); let l = n && n[3] || (k.cssNumber[t] ? '' : 'px'); let c = e.nodeType && (k.cssNumber[t] || l !== 'px' && +u) && ne.exec(k.css(e, t)); if (c && c[3] !== l) {
            for (u /= 2, l = l || c[3], c = +u || 1; a--;)
                k.style(e, t, c + l), (1 - o) * (1 - (o = s() / u || 0.5)) <= 0 && (a = 0), c /= o; c *= 2, k.style(e, t, c + l), n = n || [];
        } return n && (c = +c || +u || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = l, r.start = c, r.end = i)), i;
    } const ce = {}; function fe(e, t) {
        for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
            (r = e[c]).style && (n = r.style.display, t ? (n === 'none' && (l[c] = Q.get(r, 'display') || null, l[c] || (r.style.display = '')), r.style.display === '' && se(r) && (l[c] = (u = a = o = void 0, a = (i = r).ownerDocument, s = i.nodeName, (u = ce[s]) || (o = a.body.appendChild(a.createElement(s)), u = k.css(o, 'display'), o.parentNode.removeChild(o), u === 'none' && (u = 'block'), ce[s] = u)))) : n !== 'none' && (l[c] = 'none', Q.set(r, 'display', n))); for (c = 0; c < f; c++)
            l[c] != null && (e[c].style.display = l[c]); return e;
    }k.fn.extend({ show() { return fe(this, !0); }, hide() { return fe(this); }, toggle(e) { return typeof e === 'boolean' ? e ? this.show() : this.hide() : this.each(function () { se(this) ? k(this).show() : k(this).hide(); }); } }); const pe = /^(?:checkbox|radio)$/i; const de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i; const he = /^$|^module$|\/(?:java|ecma)script/i; const ge = { option: [1, "<select multiple='multiple'>", '</select>'], thead: [1, '<table>', '</table>'], col: [2, '<table><colgroup>', '</colgroup></table>'], tr: [2, '<table><tbody>', '</tbody></table>'], td: [3, '<table><tbody><tr>', '</tr></tbody></table>'], _default: [0, '', ''] }; function ve(e, t) { let n; return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || '*') : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || '*') : [], void 0 === t || t && A(e, t) ? k.merge([e], n) : n; } function ye(e, t) {
        for (let n = 0, r = e.length; n < r; n++)
            Q.set(e[n], 'globalEval', !t || Q.get(t[n], 'globalEval'));
    }ge.optgroup = ge.option, ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead, ge.th = ge.td; let me; let xe; const be = /<|&#?\w+;/; function we(e, t, n, r, i) {
        for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++)
            if ((o = e[d]) || o === 0)
                if (w(o) === 'object')
                    k.merge(p, o.nodeType ? [o] : o); else if (be.test(o)) {
                    for (a = a || f.appendChild(t.createElement('div')), s = (de.exec(o) || ['', ''])[1].toLowerCase(), u = ge[s] || ge._default, a.innerHTML = u[1] + k.htmlPrefilter(o) + u[2], c = u[0]; c--;)
                        a = a.lastChild; k.merge(p, a.childNodes), (a = f.firstChild).textContent = '';
                } else
                    p.push(t.createTextNode(o)); for (f.textContent = '', d = 0; o = p[d++];)
            if (r && k.inArray(o, r) > -1)
                i && i.push(o); else if (l = oe(o), a = ve(f.appendChild(o), 'script'), l && ye(a), n)
                for (c = 0; o = a[c++];)
                    he.test(o.type || '') && n.push(o); return f;
    }me = E.createDocumentFragment().appendChild(E.createElement('div')), (xe = E.createElement('input')).setAttribute('type', 'radio'), xe.setAttribute('checked', 'checked'), xe.setAttribute('name', 't'), me.appendChild(xe), y.checkClone = me.cloneNode(!0).cloneNode(!0).lastChild.checked, me.innerHTML = '<textarea>x</textarea>', y.noCloneChecked = !!me.cloneNode(!0).lastChild.defaultValue; const Te = /^key/; const Ce = /^(?:mouse|pointer|contextmenu|drag|drop)|click/; const Ee = /^([^.]*)(?:\.(.+)|)/; function ke() { return !0; } function Se() { return !1; } function Ne(e, t) { return e === (function () { try { return E.activeElement; } catch (e) {} })() == (t === 'focus'); } function Ae(e, t, n, r, i, o) {
        let a; let s; if (typeof t === 'object') {
            for (s in typeof n !== 'string' && (r = r || n, n = void 0), t)
                Ae(e, s, n, r, t[s], o); return e;
        } if (r == null && i == null ? (i = n, r = n = void 0) : i == null && (typeof n === 'string' ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i)
            i = Se; else if (!i)
            return e; return o === 1 && (a = i, (i = function (e) { return k().off(e), a.apply(this, arguments); }).guid = a.guid || (a.guid = k.guid++)), e.each(function () { k.event.add(this, t, i, r, n); });
    } function De(e, i, o) {
        o ? (Q.set(e, i, !1), k.event.add(e, i, { namespace: !1, handler(e) {
            let t; let n; let r = Q.get(this, i); if (1 & e.isTrigger && this[i]) {
                if (r.length)
                    (k.event.special[i] || {}).delegateType && e.stopPropagation(); else if (r = s.call(arguments), Q.set(this, i, r), t = o(this, i), this[i](), r !== (n = Q.get(this, i)) || t ? Q.set(this, i, !1) : n = {}, r !== n)
                    return e.stopImmediatePropagation(), e.preventDefault(), n.value;
            } else
                r.length && (Q.set(this, i, { value: k.event.trigger(k.extend(r[0], k.Event.prototype), r.slice(1), this) }), e.stopImmediatePropagation());
        } })) : void 0 === Q.get(e, i) && k.event.add(e, i, ke);
    }k.event = { global: {}, add(t, e, n, r, i) {
        let o; let a; let s; let u; let l; let c; let f; let p; let d; let h; let g; const v = Q.get(t); if (v)
            for (n.handler && (n = (o = n).handler, i = o.selector), i && k.find.matchesSelector(ie, i), n.guid || (n.guid = k.guid++), (u = v.events) || (u = v.events = {}), (a = v.handle) || (a = v.handle = function (e) { return void 0 !== k && k.event.triggered !== e.type ? k.event.dispatch.apply(t, arguments) : void 0; }), l = (e = (e || '').match(R) || ['']).length; l--;)
                d = g = (s = Ee.exec(e[l]) || [])[1], h = (s[2] || '').split('.').sort(), d && (f = k.event.special[d] || {}, d = (i ? f.delegateType : f.bindType) || d, f = k.event.special[d] || {}, c = k.extend({ type: d, origType: g, data: r, handler: n, guid: n.guid, selector: i, needsContext: i && k.expr.match.needsContext.test(i), namespace: h.join('.') }, o), (p = u[d]) || ((p = u[d] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)), f.add && (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)), i ? p.splice(p.delegateCount++, 0, c) : p.push(c), k.event.global[d] = !0);
    }, remove(e, t, n, r, i) {
        let o; let a; let s; let u; let l; let c; let f; let p; let d; let h; let g; const v = Q.hasData(e) && Q.get(e); if (v && (u = v.events)) {
            for (l = (t = (t || '').match(R) || ['']).length; l--;)
                if (d = g = (s = Ee.exec(t[l]) || [])[1], h = (s[2] || '').split('.').sort(), d) {
                    for (f = k.event.special[d] || {}, p = u[d = (r ? f.delegateType : f.bindType) || d] || [], s = s[2] && new RegExp('(^|\\.)' + h.join('\\.(?:.*\\.|)') + '(\\.|$)'), a = o = p.length; o--;)
                        c = p[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && (r !== '**' || !c.selector) || (p.splice(o, 1), c.selector && p.delegateCount--, f.remove && f.remove.call(e, c)); a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || k.removeEvent(e, d, v.handle), delete u[d]);
                } else
                    for (d in u)
                        k.event.remove(e, d + t[l], n, r, !0); k.isEmptyObject(u) && Q.remove(e, 'handle events');
        }
    }, dispatch(e) {
        let t; let n; let r; let i; let o; let a; const s = k.event.fix(e); const u = new Array(arguments.length); const l = (Q.get(this, 'events') || {})[s.type] || []; const c = k.event.special[s.type] || {}; for (u[0] = s, t = 1; t < arguments.length; t++)
            u[t] = arguments[t]; if (s.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, s)) {
            for (a = k.event.handlers.call(this, s, l), t = 0; (i = a[t++]) && !s.isPropagationStopped();)
                for (s.currentTarget = i.elem, n = 0; (o = i.handlers[n++]) && !s.isImmediatePropagationStopped();)
                    s.rnamespace && !1 !== o.namespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (r = ((k.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u)) && !1 === (s.result = r) && (s.preventDefault(), s.stopPropagation())); return c.postDispatch && c.postDispatch.call(this, s), s.result;
        }
    }, handlers(e, t) {
        let n; let r; let i; let o; let a; const s = []; const u = t.delegateCount; let l = e.target; if (u && l.nodeType && !(e.type === 'click' && e.button >= 1))
            for (;l !== this; l = l.parentNode || this)
                if (l.nodeType === 1 && (e.type !== 'click' || !0 !== l.disabled)) {
                    for (o = [], a = {}, n = 0; n < u; n++)
                        void 0 === a[i = (r = t[n]).selector + ' '] && (a[i] = r.needsContext ? k(i, this).index(l) > -1 : k.find(i, this, null, [l]).length), a[i] && o.push(r); o.length && s.push({ elem: l, handlers: o });
                } return l = this, u < t.length && s.push({ elem: l, handlers: t.slice(u) }), s;
    }, addProp(t, e) {
        Object.defineProperty(k.Event.prototype, t, { enumerable: !0, configurable: !0, get: m(e) ? function () {
            if (this.originalEvent)
                return e(this.originalEvent);
        } : function () {
            if (this.originalEvent)
                return this.originalEvent[t];
        }, set(e) { Object.defineProperty(this, t, { enumerable: !0, configurable: !0, writable: !0, value: e }); } });
    }, fix(e) { return e[k.expando] ? e : new k.Event(e); }, special: { load: { noBubble: !0 }, click: { setup(e) { const t = this || e; return pe.test(t.type) && t.click && A(t, 'input') && De(t, 'click', ke), !1; }, trigger(e) { const t = this || e; return pe.test(t.type) && t.click && A(t, 'input') && De(t, 'click'), !0; }, _default(e) { const t = e.target; return pe.test(t.type) && t.click && A(t, 'input') && Q.get(t, 'click') || A(t, 'a'); } }, beforeunload: { postDispatch(e) { void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result); } } } }, k.removeEvent = function (e, t, n) { e.removeEventListener && e.removeEventListener(t, n); }, k.Event = function (e, t) {
        if (!(this instanceof k.Event))
            return new k.Event(e, t); e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? ke : Se, this.target = e.target && e.target.nodeType === 3 ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && k.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[k.expando] = !0;
    }, k.Event.prototype = { constructor: k.Event, isDefaultPrevented: Se, isPropagationStopped: Se, isImmediatePropagationStopped: Se, isSimulated: !1, preventDefault() { const e = this.originalEvent; this.isDefaultPrevented = ke, e && !this.isSimulated && e.preventDefault(); }, stopPropagation() { const e = this.originalEvent; this.isPropagationStopped = ke, e && !this.isSimulated && e.stopPropagation(); }, stopImmediatePropagation() { const e = this.originalEvent; this.isImmediatePropagationStopped = ke, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation(); } }, k.each({ altKey: !0, bubbles: !0, cancelable: !0, changedTouches: !0, ctrlKey: !0, detail: !0, eventPhase: !0, metaKey: !0, pageX: !0, pageY: !0, shiftKey: !0, view: !0, char: !0, code: !0, charCode: !0, key: !0, keyCode: !0, button: !0, buttons: !0, clientX: !0, clientY: !0, offsetX: !0, offsetY: !0, pointerId: !0, pointerType: !0, screenX: !0, screenY: !0, targetTouches: !0, toElement: !0, touches: !0, which(e) { const t = e.button; return e.which == null && Te.test(e.type) ? e.charCode != null ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ce.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which; } }, k.event.addProp), k.each({ focus: 'focusin', blur: 'focusout' }, (e, t) => { k.event.special[e] = { setup() { return De(this, e, Ne), !1; }, trigger() { return De(this, e), !0; }, delegateType: t }; }), k.each({ mouseenter: 'mouseover', mouseleave: 'mouseout', pointerenter: 'pointerover', pointerleave: 'pointerout' }, (e, i) => { k.event.special[e] = { delegateType: i, bindType: i, handle(e) { let t; const n = e.relatedTarget; const r = e.handleObj; return n && (n === this || k.contains(this, n)) || (e.type = r.origType, t = r.handler.apply(this, arguments), e.type = i), t; } }; }), k.fn.extend({ on(e, t, n, r) { return Ae(this, e, t, n, r); }, one(e, t, n, r) { return Ae(this, e, t, n, r, 1); }, off(e, t, n) {
        let r; let i; if (e && e.preventDefault && e.handleObj)
            return r = e.handleObj, k(e.delegateTarget).off(r.namespace ? r.origType + '.' + r.namespace : r.origType, r.selector, r.handler), this; if (typeof e !== 'object')
            return !1 !== t && typeof t !== 'function' || (n = t, t = void 0), !1 === n && (n = Se), this.each(function () { k.event.remove(this, e, n, t); }); for (i in e)
            this.off(i, t, e[i]); return this;
    } }); const je = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi; const qe = /<script|<style|<link/i; const Le = /checked\s*(?:[^=]|=\s*.checked.)/i; const He = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g; function Oe(e, t) { return A(e, 'table') && A(t.nodeType !== 11 ? t : t.firstChild, 'tr') && k(e).children('tbody')[0] || e; } function Pe(e) { return e.type = (e.getAttribute('type') !== null) + '/' + e.type, e; } function Re(e) { return (e.type || '').slice(0, 5) === 'true/' ? e.type = e.type.slice(5) : e.removeAttribute('type'), e; } function Me(e, t) {
        let n; let r; let i; let o; let a; let s; let u; let l; if (t.nodeType === 1) {
            if (Q.hasData(e) && (o = Q.access(e), a = Q.set(t, o), l = o.events))
                for (i in delete a.handle, a.events = {}, l)
                    for (n = 0, r = l[i].length; n < r; n++)
                        k.event.add(t, i, l[i][n]); J.hasData(e) && (s = J.access(e), u = k.extend({}, s), J.set(t, u));
        }
    } function Ie(n, r, i, o) {
        r = g.apply([], r); let e; let t; let a; let s; let u; let l; let c = 0; const f = n.length; const p = f - 1; const d = r[0]; const h = m(d); if (h || f > 1 && typeof d === 'string' && !y.checkClone && Le.test(d))
            return n.each(function (e) { const t = n.eq(e); h && (r[0] = d.call(this, e, t.html())), Ie(t, r, i, o); }); if (f && (t = (e = we(r, n[0].ownerDocument, !1, n, o)).firstChild, e.childNodes.length === 1 && (e = t), t || o)) {
            for (s = (a = k.map(ve(e, 'script'), Pe)).length; c < f; c++)
                u = e, c !== p && (u = k.clone(u, !0, !0), s && k.merge(a, ve(u, 'script'))), i.call(n[c], u, c); if (s)
                for (l = a[a.length - 1].ownerDocument, k.map(a, Re), c = 0; c < s; c++)
                    u = a[c], he.test(u.type || '') && !Q.access(u, 'globalEval') && k.contains(l, u) && (u.src && (u.type || '').toLowerCase() !== 'module' ? k._evalUrl && !u.noModule && k._evalUrl(u.src, { nonce: u.nonce || u.getAttribute('nonce') }) : b(u.textContent.replace(He, ''), u, l));
        } return n;
    } function We(e, t, n) {
        for (var r, i = t ? k.filter(t, e) : e, o = 0; (r = i[o]) != null; o++)
            n || r.nodeType !== 1 || k.cleanData(ve(r)), r.parentNode && (n && oe(r) && ye(ve(r, 'script')), r.parentNode.removeChild(r)); return e;
    }k.extend({ htmlPrefilter(e) { return e.replace(je, '<$1></$2>'); }, clone(e, t, n) {
        let r; let i; let o; let a; let s; let u; let l; const c = e.cloneNode(!0); const f = oe(e); if (!(y.noCloneChecked || e.nodeType !== 1 && e.nodeType !== 11 || k.isXMLDoc(e)))
            for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++)
                s = o[r], (l = (u = a[r]).nodeName.toLowerCase()) === 'input' && pe.test(s.type) ? u.checked = s.checked : l !== 'input' && l !== 'textarea' || (u.defaultValue = s.defaultValue); if (t)
            if (n)
                for (o = o || ve(e), a = a || ve(c), r = 0, i = o.length; r < i; r++)
                    Me(o[r], a[r]); else
                Me(e, c); return (a = ve(c, 'script')).length > 0 && ye(a, !f && ve(e, 'script')), c;
    }, cleanData(e) {
        for (var t, n, r, i = k.event.special, o = 0; void 0 !== (n = e[o]); o++)
            if (G(n)) {
                if (t = n[Q.expando]) {
                    if (t.events)
                        for (r in t.events)
                            i[r] ? k.event.remove(n, r) : k.removeEvent(n, r, t.handle); n[Q.expando] = void 0;
                }n[J.expando] && (n[J.expando] = void 0);
            }
    } }), k.fn.extend({ detach(e) { return We(this, e, !0); }, remove(e) { return We(this, e); }, text(e) { return _(this, function (e) { return void 0 === e ? k.text(this) : this.empty().each(function () { this.nodeType !== 1 && this.nodeType !== 11 && this.nodeType !== 9 || (this.textContent = e); }); }, null, e, arguments.length); }, append() { return Ie(this, arguments, function (e) { this.nodeType !== 1 && this.nodeType !== 11 && this.nodeType !== 9 || Oe(this, e).appendChild(e); }); }, prepend() { return Ie(this, arguments, function (e) { if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) { const t = Oe(this, e); t.insertBefore(e, t.firstChild); } }); }, before() { return Ie(this, arguments, function (e) { this.parentNode && this.parentNode.insertBefore(e, this); }); }, after() { return Ie(this, arguments, function (e) { this.parentNode && this.parentNode.insertBefore(e, this.nextSibling); }); }, empty() {
        for (var e, t = 0; (e = this[t]) != null; t++)
            e.nodeType === 1 && (k.cleanData(ve(e, !1)), e.textContent = ''); return this;
    }, clone(e, t) { return e = e != null && e, t = t == null ? e : t, this.map(function () { return k.clone(this, e, t); }); }, html(e) {
        return _(this, function (e) {
            let t = this[0] || {}; let n = 0; const r = this.length; if (void 0 === e && t.nodeType === 1)
                return t.innerHTML; if (typeof e === 'string' && !qe.test(e) && !ge[(de.exec(e) || ['', ''])[1].toLowerCase()]) {
                e = k.htmlPrefilter(e); try {
                    for (;n < r; n++)
                        (t = this[n] || {}).nodeType === 1 && (k.cleanData(ve(t, !1)), t.innerHTML = e); t = 0;
                } catch (e) {}
            }t && this.empty().append(e);
        }, null, e, arguments.length);
    }, replaceWith() { const n = []; return Ie(this, arguments, function (e) { const t = this.parentNode; k.inArray(this, n) < 0 && (k.cleanData(ve(this)), t && t.replaceChild(e, this)); }, n); } }), k.each({ appendTo: 'append', prependTo: 'prepend', insertBefore: 'before', insertAfter: 'after', replaceAll: 'replaceWith' }, (e, a) => {
        k.fn[e] = function (e) {
            for (var t, n = [], r = k(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0), k(r[o])[a](t), u.apply(n, t.get()); return this.pushStack(n);
        };
    }); const $e = new RegExp('^(' + te + ')(?!px)[a-z%]+$', 'i'); const Fe = function (e) { let t = e.ownerDocument.defaultView; return t && t.opener || (t = C), t.getComputedStyle(e); }; const Be = new RegExp(re.join('|'), 'i'); function _e(e, t, n) { let r; let i; let o; let a; const s = e.style; return (n = n || Fe(e)) && ((a = n.getPropertyValue(t) || n[t]) !== '' || oe(e) || (a = k.style(e, t)), !y.pixelBoxStyles() && $e.test(a) && Be.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + '' : a; } function ze(e, t) {
        return { get() {
            if (!e())
                return (this.get = t).apply(this, arguments); delete this.get;
        } };
    }!(function () { function e() { if (u) { s.style.cssText = 'position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0', u.style.cssText = 'position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%', ie.appendChild(s).appendChild(u); const e = C.getComputedStyle(u); n = e.top !== '1%', a = t(e.marginLeft) === 12, u.style.right = '60%', o = t(e.right) === 36, r = t(e.width) === 36, u.style.position = 'absolute', i = t(u.offsetWidth / 3) === 12, ie.removeChild(s), u = null; } } function t(e) { return Math.round(parseFloat(e)); } let n; let r; let i; let o; let a; var s = E.createElement('div'); var u = E.createElement('div'); u.style && (u.style.backgroundClip = 'content-box', u.cloneNode(!0).style.backgroundClip = '', y.clearCloneStyle = u.style.backgroundClip === 'content-box', k.extend(y, { boxSizingReliable() { return e(), r; }, pixelBoxStyles() { return e(), o; }, pixelPosition() { return e(), n; }, reliableMarginLeft() { return e(), a; }, scrollboxSize() { return e(), i; } })); })(); const Ue = ['Webkit', 'Moz', 'ms']; const Xe = E.createElement('div').style; const Ve = {}; function Ge(e) {
        return k.cssProps[e] || Ve[e] || (e in Xe ? e : Ve[e] = (function (e) {
            for (let t = e[0].toUpperCase() + e.slice(1), n = Ue.length; n--;)
                if ((e = Ue[n] + t) in Xe)
                    return e;
        })(e) || e);
    } const Ye = /^(none|table(?!-c[ea]).+)/; const Qe = /^--/; const Je = { position: 'absolute', visibility: 'hidden', display: 'block' }; const Ke = { letterSpacing: '0', fontWeight: '400' }; function Ze(e, t, n) { const r = ne.exec(t); return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || 'px') : t; } function et(e, t, n, r, i, o) {
        let a = t === 'width' ? 1 : 0; let s = 0; let u = 0; if (n === (r ? 'border' : 'content'))
            return 0; for (;a < 4; a += 2)
            n === 'margin' && (u += k.css(e, n + re[a], !0, i)), r ? (n === 'content' && (u -= k.css(e, 'padding' + re[a], !0, i)), n !== 'margin' && (u -= k.css(e, 'border' + re[a] + 'Width', !0, i))) : (u += k.css(e, 'padding' + re[a], !0, i), n !== 'padding' ? u += k.css(e, 'border' + re[a] + 'Width', !0, i) : s += k.css(e, 'border' + re[a] + 'Width', !0, i)); return !r && o >= 0 && (u += Math.max(0, Math.ceil(e['offset' + t[0].toUpperCase() + t.slice(1)] - o - u - s - 0.5)) || 0), u;
    } function tt(e, t, n) {
        const r = Fe(e); let i = (!y.boxSizingReliable() || n) && k.css(e, 'boxSizing', !1, r) === 'border-box'; let o = i; let a = _e(e, t, r); const s = 'offset' + t[0].toUpperCase() + t.slice(1); if ($e.test(a)) {
            if (!n)
                return a; a = 'auto';
        } return (!y.boxSizingReliable() && i || a === 'auto' || !parseFloat(a) && k.css(e, 'display', !1, r) === 'inline') && e.getClientRects().length && (i = k.css(e, 'boxSizing', !1, r) === 'border-box', (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + et(e, t, n || (i ? 'border' : 'content'), o, r, a) + 'px';
    } function nt(e, t, n, r, i) { return new nt.prototype.init(e, t, n, r, i); }k.extend({ cssHooks: { opacity: { get(e, t) { if (t) { const n = _e(e, 'opacity'); return n === '' ? '1' : n; } } } }, cssNumber: { animationIterationCount: !0, columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, gridArea: !0, gridColumn: !0, gridColumnEnd: !0, gridColumnStart: !0, gridRow: !0, gridRowEnd: !0, gridRowStart: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: {}, style(e, t, n, r) {
        if (e && e.nodeType !== 3 && e.nodeType !== 8 && e.style) {
            let i; let o; let a; const s = V(t); const u = Qe.test(t); const l = e.style; if (u || (t = Ge(s)), a = k.cssHooks[t] || k.cssHooks[s], void 0 === n)
                return a && 'get' in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t]; (o = typeof n) == 'string' && (i = ne.exec(n)) && i[1] && (n = le(e, t, i), o = 'number'), n != null && n == n && (o !== 'number' || u || (n += i && i[3] || (k.cssNumber[s] ? '' : 'px')), y.clearCloneStyle || n !== '' || t.indexOf('background') !== 0 || (l[t] = 'inherit'), a && 'set' in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n));
        }
    }, css(e, t, n, r) { let i; let o; let a; const s = V(t); return Qe.test(t) || (t = Ge(s)), (a = k.cssHooks[t] || k.cssHooks[s]) && 'get' in a && (i = a.get(e, !0, n)), void 0 === i && (i = _e(e, t, r)), i === 'normal' && t in Ke && (i = Ke[t]), n === '' || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i; } }), k.each(['height', 'width'], (e, u) => {
        k.cssHooks[u] = { get(e, t, n) {
            if (t)
                return !Ye.test(k.css(e, 'display')) || e.getClientRects().length && e.getBoundingClientRect().width ? tt(e, u, n) : ue(e, Je, () => tt(e, u, n));
        }, set(e, t, n) { let r; const i = Fe(e); const o = !y.scrollboxSize() && i.position === 'absolute'; const a = (o || n) && k.css(e, 'boxSizing', !1, i) === 'border-box'; let s = n ? et(e, u, n, a, i) : 0; return a && o && (s -= Math.ceil(e['offset' + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - et(e, u, 'border', !1, i) - 0.5)), s && (r = ne.exec(t)) && (r[3] || 'px') !== 'px' && (e.style[u] = t, t = k.css(e, u)), Ze(0, t, s); } };
    }), k.cssHooks.marginLeft = ze(y.reliableMarginLeft, (e, t) => {
        if (t)
            return (parseFloat(_e(e, 'marginLeft')) || e.getBoundingClientRect().left - ue(e, { marginLeft: 0 }, () => e.getBoundingClientRect().left)) + 'px';
    }), k.each({ margin: '', padding: '', border: 'Width' }, (i, o) => {
        k.cssHooks[i + o] = { expand(e) {
            for (var t = 0, n = {}, r = typeof e === 'string' ? e.split(' ') : [e]; t < 4; t++)
                n[i + re[t] + o] = r[t] || r[t - 2] || r[0]; return n;
        } }, i !== 'margin' && (k.cssHooks[i + o].set = Ze);
    }), k.fn.extend({ css(e, t) {
        return _(this, (e, t, n) => {
            let r; let i; const o = {}; let a = 0; if (Array.isArray(t)) {
                for (r = Fe(e), i = t.length; a < i; a++)
                    o[t[a]] = k.css(e, t[a], !1, r); return o;
            } return void 0 !== n ? k.style(e, t, n) : k.css(e, t);
        }, e, t, arguments.length > 1);
    } }), ((k.Tween = nt).prototype = { constructor: nt, init(e, t, n, r, i, o) { this.elem = e, this.prop = n, this.easing = i || k.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (k.cssNumber[n] ? '' : 'px'); }, cur() { const e = nt.propHooks[this.prop]; return e && e.get ? e.get(this) : nt.propHooks._default.get(this); }, run(e) { let t; const n = nt.propHooks[this.prop]; return this.options.duration ? this.pos = t = k.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : nt.propHooks._default.set(this), this; } }).init.prototype = nt.prototype, (nt.propHooks = { _default: { get(e) { let t; return e.elem.nodeType !== 1 || e.elem[e.prop] != null && e.elem.style[e.prop] == null ? e.elem[e.prop] : (t = k.css(e.elem, e.prop, '')) && t !== 'auto' ? t : 0; }, set(e) { k.fx.step[e.prop] ? k.fx.step[e.prop](e) : e.elem.nodeType !== 1 || !k.cssHooks[e.prop] && e.elem.style[Ge(e.prop)] == null ? e.elem[e.prop] = e.now : k.style(e.elem, e.prop, e.now + e.unit); } } }).scrollTop = nt.propHooks.scrollLeft = { set(e) { e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now); } }, k.easing = { linear(e) { return e; }, swing(e) { return 0.5 - Math.cos(e * Math.PI) / 2; }, _default: 'swing' }, k.fx = nt.prototype.init, k.fx.step = {}; let rt; let it; let ot; let at; const st = /^(?:toggle|show|hide)$/; const ut = /queueHooks$/; function lt() { it && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(lt) : C.setTimeout(lt, k.fx.interval), k.fx.tick()); } function ct() { return C.setTimeout(() => { rt = void 0; }), rt = Date.now(); } function ft(e, t) {
        let n; let r = 0; const i = { height: e }; for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i['margin' + (n = re[r])] = i['padding' + n] = e; return t && (i.opacity = i.width = e), i;
    } function pt(e, t, n) {
        for (var r, i = (dt.tweeners[t] || []).concat(dt.tweeners['*']), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r;
    } function dt(o, e, t) {
        let n; let a; let r = 0; const i = dt.prefilters.length; const s = k.Deferred().always(() => { delete u.elem; }); var u = function () {
            if (a)
                return !1; for (var e = rt || ct(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++)
                l.tweens[r].run(n); return s.notifyWith(o, [l, n, t]), n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1);
        }; var l = s.promise({ elem: o, props: k.extend({}, e), opts: k.extend(!0, { specialEasing: {}, easing: k.easing._default }, t), originalProperties: e, originalOptions: t, startTime: rt || ct(), duration: t.duration, tweens: [], createTween(e, t) { const n = k.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing); return l.tweens.push(n), n; }, stop(e) {
            let t = 0; const n = e ? l.tweens.length : 0; if (a)
                return this; for (a = !0; t < n; t++)
                l.tweens[t].run(1); return e ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]), this;
        } }); const c = l.props; for ((function (e, t) {
            let n; let r; let i; let o; let a; for (n in e)
                if (i = t[r = V(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = k.cssHooks[r]) && 'expand' in a)
                    for (n in o = a.expand(o), delete e[r], o)
                        n in e || (e[n] = o[n], t[n] = i); else
                    t[r] = i;
        })(c, l.opts.specialEasing); r < i; r++)
            if (n = dt.prefilters[r].call(l, o, c, l.opts))
                return m(n.stop) && (k._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)), n; return k.map(c, pt, l), m(l.opts.start) && l.opts.start.call(o, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), k.fx.timer(k.extend(u, { elem: o, anim: l, queue: l.opts.queue })), l;
    }k.Animation = k.extend(dt, { tweeners: { '*': [function (e, t) { const n = this.createTween(e, t); return le(n.elem, e, ne.exec(t), n), n; }] }, tweener(e, t) {
        for (var n, r = 0, i = (e = m(e) ? (t = e, ['*']) : e.match(R)).length; r < i; r++)
            n = e[r], dt.tweeners[n] = dt.tweeners[n] || [], dt.tweeners[n].unshift(t);
    }, prefilters: [function (e, t, n) {
        let r; let i; let o; let a; let s; let u; let l; let c; const f = 'width' in t || 'height' in t; const p = this; const d = {}; const h = e.style; let g = e.nodeType && se(e); let v = Q.get(e, 'fxshow'); for (r in n.queue || ((a = k._queueHooks(e, 'fx')).unqueued == null && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () { a.unqueued || s(); }), a.unqueued++, p.always(() => { p.always(() => { a.unqueued--, k.queue(e, 'fx').length || a.empty.fire(); }); })), t)
            if (i = t[r], st.test(i)) {
                if (delete t[r], o = o || i === 'toggle', i === (g ? 'hide' : 'show')) {
                    if (i !== 'show' || !v || void 0 === v[r])
                        continue; g = !0;
                }d[r] = v && v[r] || k.style(e, r);
            } if ((u = !k.isEmptyObject(t)) || !k.isEmptyObject(d))
            for (r in f && e.nodeType === 1 && (n.overflow = [h.overflow, h.overflowX, h.overflowY], (l = v && v.display) == null && (l = Q.get(e, 'display')), (c = k.css(e, 'display')) === 'none' && (l ? c = l : (fe([e], !0), l = e.style.display || l, c = k.css(e, 'display'), fe([e]))), (c === 'inline' || c === 'inline-block' && l != null) && k.css(e, 'float') === 'none' && (u || (p.done(() => { h.display = l; }), l == null && (c = h.display, l = c === 'none' ? '' : c)), h.display = 'inline-block')), n.overflow && (h.overflow = 'hidden', p.always(() => { h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]; })), u = !1, d)
                u || (v ? 'hidden' in v && (g = v.hidden) : v = Q.access(e, 'fxshow', { display: l }), o && (v.hidden = !g), g && fe([e], !0), p.done(() => {
                    for (r in g || fe([e]), Q.remove(e, 'fxshow'), d)
                        k.style(e, r, d[r]);
                })), u = pt(g ? v[r] : 0, r, p), r in v || (v[r] = u.start, g && (u.end = u.start, u.start = 0));
    }], prefilter(e, t) { t ? dt.prefilters.unshift(e) : dt.prefilters.push(e); } }), k.speed = function (e, t, n) { const r = e && typeof e === 'object' ? k.extend({}, e) : { complete: n || !n && t || m(e) && e, duration: e, easing: n && t || t && !m(t) && t }; return k.fx.off ? r.duration = 0 : typeof r.duration !== 'number' && (r.duration in k.fx.speeds ? r.duration = k.fx.speeds[r.duration] : r.duration = k.fx.speeds._default), r.queue != null && !0 !== r.queue || (r.queue = 'fx'), r.old = r.complete, r.complete = function () { m(r.old) && r.old.call(this), r.queue && k.dequeue(this, r.queue); }, r; }, k.fn.extend({ fadeTo(e, t, n, r) { return this.filter(se).css('opacity', 0).show().end().animate({ opacity: t }, e, n, r); }, animate(t, e, n, r) { function a() { const e = dt(this, k.extend({}, t), o); (i || Q.get(this, 'finish')) && e.stop(!0); } var i = k.isEmptyObject(t); var o = k.speed(e, n, r); return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a); }, stop(i, e, o) {
        function a(e) { const t = e.stop; delete e.stop, t(o); } return typeof i !== 'string' && (o = e, e = i, i = void 0), e && !1 !== i && this.queue(i || 'fx', []), this.each(function () {
            let e = !0; let t = i != null && i + 'queueHooks'; const n = k.timers; const r = Q.get(this); if (t)
                r[t] && r[t].stop && a(r[t]); else
                for (t in r)
                    r[t] && r[t].stop && ut.test(t) && a(r[t]); for (t = n.length; t--;)
                n[t].elem !== this || i != null && n[t].queue !== i || (n[t].anim.stop(o), e = !1, n.splice(t, 1)); !e && o || k.dequeue(this, i);
        });
    }, finish(a) {
        return !1 !== a && (a = a || 'fx'), this.each(function () {
            let e; const t = Q.get(this); const n = t[a + 'queue']; const r = t[a + 'queueHooks']; const i = k.timers; const o = n ? n.length : 0; for (t.finish = !0, k.queue(this, a, []), r && r.stop && r.stop.call(this, !0), e = i.length; e--;)
                i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0), i.splice(e, 1)); for (e = 0; e < o; e++)
                n[e] && n[e].finish && n[e].finish.call(this); delete t.finish;
        });
    } }), k.each(['toggle', 'show', 'hide'], (e, r) => { const i = k.fn[r]; k.fn[r] = function (e, t, n) { return e == null || typeof e === 'boolean' ? i.apply(this, arguments) : this.animate(ft(r, !0), e, t, n); }; }), k.each({ slideDown: ft('show'), slideUp: ft('hide'), slideToggle: ft('toggle'), fadeIn: { opacity: 'show' }, fadeOut: { opacity: 'hide' }, fadeToggle: { opacity: 'toggle' } }, (e, r) => { k.fn[e] = function (e, t, n) { return this.animate(r, e, t, n); }; }), k.timers = [], k.fx.tick = function () {
        let e; let t = 0; const n = k.timers; for (rt = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1); n.length || k.fx.stop(), rt = void 0;
    }, k.fx.timer = function (e) { k.timers.push(e), k.fx.start(); }, k.fx.interval = 13, k.fx.start = function () { it || (it = !0, lt()); }, k.fx.stop = function () { it = null; }, k.fx.speeds = { slow: 600, fast: 200, _default: 400 }, k.fn.delay = function (r, e) { return r = k.fx && k.fx.speeds[r] || r, e = e || 'fx', this.queue(e, (e, t) => { const n = C.setTimeout(e, r); t.stop = function () { C.clearTimeout(n); }; }); }, ot = E.createElement('input'), at = E.createElement('select').appendChild(E.createElement('option')), ot.type = 'checkbox', y.checkOn = ot.value !== '', y.optSelected = at.selected, (ot = E.createElement('input')).value = 't', ot.type = 'radio', y.radioValue = ot.value === 't'; let ht; const gt = k.expr.attrHandle; k.fn.extend({ attr(e, t) { return _(this, k.attr, e, t, arguments.length > 1); }, removeAttr(e) { return this.each(function () { k.removeAttr(this, e); }); } }), k.extend({ attr(e, t, n) {
        let r; let i; const o = e.nodeType; if (o !== 3 && o !== 8 && o !== 2)
            return void 0 === e.getAttribute ? k.prop(e, t, n) : (o === 1 && k.isXMLDoc(e) || (i = k.attrHooks[t.toLowerCase()] || (k.expr.match.bool.test(t) ? ht : void 0)), void 0 !== n ? n === null ? void k.removeAttr(e, t) : i && 'set' in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ''), n) : i && 'get' in i && (r = i.get(e, t)) !== null ? r : (r = k.find.attr(e, t)) == null ? void 0 : r);
    }, attrHooks: { type: { set(e, t) { if (!y.radioValue && t === 'radio' && A(e, 'input')) { const n = e.value; return e.setAttribute('type', t), n && (e.value = n), t; } } } }, removeAttr(e, t) {
        let n; let r = 0; const i = t && t.match(R); if (i && e.nodeType === 1)
            for (;n = i[r++];)
                e.removeAttribute(n);
    } }), ht = { set(e, t, n) { return !1 === t ? k.removeAttr(e, n) : e.setAttribute(n, n), n; } }, k.each(k.expr.match.bool.source.match(/\w+/g), (e, t) => { const a = gt[t] || k.find.attr; gt[t] = function (e, t, n) { let r; let i; const o = t.toLowerCase(); return n || (i = gt[o], gt[o] = r, r = a(e, t, n) != null ? o : null, gt[o] = i), r; }; }); const vt = /^(?:input|select|textarea|button)$/i; const yt = /^(?:a|area)$/i; function mt(e) { return (e.match(R) || []).join(' '); } function xt(e) { return e.getAttribute && e.getAttribute('class') || ''; } function bt(e) { return Array.isArray(e) ? e : typeof e === 'string' && e.match(R) || []; }k.fn.extend({ prop(e, t) { return _(this, k.prop, e, t, arguments.length > 1); }, removeProp(e) { return this.each(function () { delete this[k.propFix[e] || e]; }); } }), k.extend({ prop(e, t, n) {
        let r; let i; const o = e.nodeType; if (o !== 3 && o !== 8 && o !== 2)
            return o === 1 && k.isXMLDoc(e) || (t = k.propFix[t] || t, i = k.propHooks[t]), void 0 !== n ? i && 'set' in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && 'get' in i && (r = i.get(e, t)) !== null ? r : e[t];
    }, propHooks: { tabIndex: { get(e) { const t = k.find.attr(e, 'tabindex'); return t ? parseInt(t, 10) : vt.test(e.nodeName) || yt.test(e.nodeName) && e.href ? 0 : -1; } } }, propFix: { for: 'htmlFor', class: 'className' } }), y.optSelected || (k.propHooks.selected = { get(e) { const t = e.parentNode; return t && t.parentNode && t.parentNode.selectedIndex, null; }, set(e) { const t = e.parentNode; t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex); } }), k.each(['tabIndex', 'readOnly', 'maxLength', 'cellSpacing', 'cellPadding', 'rowSpan', 'colSpan', 'useMap', 'frameBorder', 'contentEditable'], function () { k.propFix[this.toLowerCase()] = this; }), k.fn.extend({ addClass(t) {
        let e; let n; let r; let i; let o; let a; let s; let u = 0; if (m(t))
            return this.each(function (e) { k(this).addClass(t.call(this, e, xt(this))); }); if ((e = bt(t)).length)
            for (;n = this[u++];)
                if (i = xt(n), r = n.nodeType === 1 && ' ' + mt(i) + ' ') {
                    for (a = 0; o = e[a++];)
                        r.indexOf(' ' + o + ' ') < 0 && (r += o + ' '); i !== (s = mt(r)) && n.setAttribute('class', s);
                } return this;
    }, removeClass(t) {
        let e; let n; let r; let i; let o; let a; let s; let u = 0; if (m(t))
            return this.each(function (e) { k(this).removeClass(t.call(this, e, xt(this))); }); if (!arguments.length)
            return this.attr('class', ''); if ((e = bt(t)).length)
            for (;n = this[u++];)
                if (i = xt(n), r = n.nodeType === 1 && ' ' + mt(i) + ' ') {
                    for (a = 0; o = e[a++];)
                        for (;r.indexOf(' ' + o + ' ') > -1;)
                            r = r.replace(' ' + o + ' ', ' '); i !== (s = mt(r)) && n.setAttribute('class', s);
                } return this;
    }, toggleClass(i, t) {
        const o = typeof i; const a = o == 'string' || Array.isArray(i); return typeof t === 'boolean' && a ? t ? this.addClass(i) : this.removeClass(i) : m(i) ? this.each(function (e) { k(this).toggleClass(i.call(this, e, xt(this), t), t); }) : this.each(function () {
            let e; let t; let n; let r; if (a)
                for (t = 0, n = k(this), r = bt(i); e = r[t++];)
                    n.hasClass(e) ? n.removeClass(e) : n.addClass(e); else
                void 0 !== i && o != 'boolean' || ((e = xt(this)) && Q.set(this, '__className__', e), this.setAttribute && this.setAttribute('class', e || !1 === i ? '' : Q.get(this, '__className__') || ''));
        });
    }, hasClass(e) {
        let t; let n; let r = 0; for (t = ' ' + e + ' '; n = this[r++];)
            if (n.nodeType === 1 && (' ' + mt(xt(n)) + ' ').indexOf(t) > -1)
                return !0; return !1;
    } }); const wt = /\r/g; k.fn.extend({ val(n) { let r; let e; let i; const t = this[0]; return arguments.length ? (i = m(n), this.each(function (e) { let t; this.nodeType === 1 && ((t = i ? n.call(this, e, k(this).val()) : n) == null ? t = '' : typeof t === 'number' ? t += '' : Array.isArray(t) && (t = k.map(t, (e) => e == null ? '' : e + '')), (r = k.valHooks[this.type] || k.valHooks[this.nodeName.toLowerCase()]) && 'set' in r && void 0 !== r.set(this, t, 'value') || (this.value = t)); })) : t ? (r = k.valHooks[t.type] || k.valHooks[t.nodeName.toLowerCase()]) && 'get' in r && void 0 !== (e = r.get(t, 'value')) ? e : typeof (e = t.value) === 'string' ? e.replace(wt, '') : e == null ? '' : e : void 0; } }), k.extend({ valHooks: { option: { get(e) { const t = k.find.attr(e, 'value'); return t != null ? t : mt(k.text(e)); } }, select: { get(e) {
        let t; let n; let r; const i = e.options; const o = e.selectedIndex; const a = e.type === 'select-one'; const s = a ? null : []; const u = a ? o + 1 : i.length; for (r = o < 0 ? u : a ? o : 0; r < u; r++)
            if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, 'optgroup'))) {
                if (t = k(n).val(), a)
                    return t; s.push(t);
            } return s;
    }, set(e, t) {
        for (var n, r, i = e.options, o = k.makeArray(t), a = i.length; a--;)
            ((r = i[a]).selected = k.inArray(k.valHooks.option.get(r), o) > -1) && (n = !0); return n || (e.selectedIndex = -1), o;
    } } } }), k.each(['radio', 'checkbox'], function () {
        k.valHooks[this] = { set(e, t) {
            if (Array.isArray(t))
                return e.checked = k.inArray(k(e).val(), t) > -1;
        } }, y.checkOn || (k.valHooks[this].get = function (e) { return e.getAttribute('value') === null ? 'on' : e.value; });
    }), y.focusin = 'onfocusin' in C; function Ct(e) { e.stopPropagation(); } const Tt = /^(?:focusinfocus|focusoutblur)$/; k.extend(k.event, { trigger(e, t, n, r) {
        let i; let o; let a; let s; let u; let l; let c; let f; const p = [n || E]; let d = v.call(e, 'type') ? e.type : e; let h = v.call(e, 'namespace') ? e.namespace.split('.') : []; if (o = f = a = n = n || E, n.nodeType !== 3 && n.nodeType !== 8 && !Tt.test(d + k.event.triggered) && (d.indexOf('.') > -1 && (d = (h = d.split('.')).shift(), h.sort()), u = d.indexOf(':') < 0 && 'on' + d, (e = e[k.expando] ? e : new k.Event(d, typeof e === 'object' && e)).isTrigger = r ? 2 : 3, e.namespace = h.join('.'), e.rnamespace = e.namespace ? new RegExp('(^|\\.)' + h.join('\\.(?:.*\\.|)') + '(\\.|$)') : null, e.result = void 0, e.target || (e.target = n), t = t == null ? [e] : k.makeArray(t, [e]), c = k.event.special[d] || {}, r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
            if (!r && !c.noBubble && !x(n)) {
                for (s = c.delegateType || d, Tt.test(s + d) || (o = o.parentNode); o; o = o.parentNode)
                    p.push(o), a = o; a === (n.ownerDocument || E) && p.push(a.defaultView || a.parentWindow || C);
            } for (i = 0; (o = p[i++]) && !e.isPropagationStopped();)
                f = o, e.type = i > 1 ? s : c.bindType || d, (l = (Q.get(o, 'events') || {})[e.type] && Q.get(o, 'handle')) && l.apply(o, t), (l = u && o[u]) && l.apply && G(o) && (e.result = l.apply(o, t), !1 === e.result && e.preventDefault()); return e.type = d, r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(p.pop(), t) || !G(n) || u && m(n[d]) && !x(n) && ((a = n[u]) && (n[u] = null), k.event.triggered = d, e.isPropagationStopped() && f.addEventListener(d, Ct), n[d](), e.isPropagationStopped() && f.removeEventListener(d, Ct), k.event.triggered = void 0, a && (n[u] = a)), e.result;
        }
    }, simulate(e, t, n) { const r = k.extend(new k.Event(), n, { type: e, isSimulated: !0 }); k.event.trigger(r, null, t); } }), k.fn.extend({ trigger(e, t) { return this.each(function () { k.event.trigger(e, t, this); }); }, triggerHandler(e, t) {
        const n = this[0]; if (n)
            return k.event.trigger(e, t, n, !0);
    } }), y.focusin || k.each({ focus: 'focusin', blur: 'focusout' }, (n, r) => { function i(e) { k.event.simulate(r, e.target, k.event.fix(e)); }k.event.special[r] = { setup() { const e = this.ownerDocument || this; const t = Q.access(e, r); t || e.addEventListener(n, i, !0), Q.access(e, r, (t || 0) + 1); }, teardown() { const e = this.ownerDocument || this; const t = Q.access(e, r) - 1; t ? Q.access(e, r, t) : (e.removeEventListener(n, i, !0), Q.remove(e, r)); } }; }); const Et = C.location; let kt = Date.now(); const St = /\?/; k.parseXML = function (e) {
        let t; if (!e || typeof e !== 'string')
            return null; try { t = (new C.DOMParser()).parseFromString(e, 'text/xml'); } catch (e) { t = void 0; } return t && !t.getElementsByTagName('parsererror').length || k.error('Invalid XML: ' + e), t;
    }; const Nt = /\[\]$/; const At = /\r?\n/g; const Dt = /^(?:submit|button|image|reset|file)$/i; const jt = /^(?:input|select|textarea|keygen)/i; function qt(n, e, r, i) {
        let t; if (Array.isArray(e))
            k.each(e, (e, t) => { r || Nt.test(n) ? i(n, t) : qt(n + '[' + (typeof t === 'object' && t != null ? e : '') + ']', t, r, i); }); else if (r || w(e) !== 'object')
            i(n, e); else
            for (t in e)
                qt(n + '[' + t + ']', e[t], r, i);
    }k.param = function (e, t) {
        function i(e, t) { const n = m(t) ? t() : t; r[r.length] = encodeURIComponent(e) + '=' + encodeURIComponent(n == null ? '' : n); } let n; var r = []; if (e == null)
            return ''; if (Array.isArray(e) || e.jquery && !k.isPlainObject(e))
            k.each(e, function () { i(this.name, this.value); }); else
            for (n in e)
                qt(n, e[n], t, i); return r.join('&');
    }, k.fn.extend({ serialize() { return k.param(this.serializeArray()); }, serializeArray() { return this.map(function () { const e = k.prop(this, 'elements'); return e ? k.makeArray(e) : this; }).filter(function () { const e = this.type; return this.name && !k(this).is(':disabled') && jt.test(this.nodeName) && !Dt.test(e) && (this.checked || !pe.test(e)); }).map(function (e, t) { const n = k(this).val(); return n == null ? null : Array.isArray(n) ? k.map(n, (e) => ({ name: t.name, value: e.replace(At, '\r\n') })) : { name: t.name, value: n.replace(At, '\r\n') }; }).get(); } }); const Lt = /%20/g; const Ht = /#.*$/; const Ot = /([?&])_=[^&]*/; const Pt = /^(.*?):[ \t]*([^\r\n]*)$/gm; const Rt = /^(?:GET|HEAD)$/; const Mt = /^\/\//; const It = {}; const Wt = {}; const $t = '*/'.concat('*'); const Ft = E.createElement('a'); function Bt(o) {
        return function (e, t) {
            typeof e !== 'string' && (t = e, e = '*'); let n; let r = 0; const i = e.toLowerCase().match(R) || []; if (m(t))
                for (;n = i[r++];)
                    n[0] === '+' ? (n = n.slice(1) || '*', (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t);
        };
    } function _t(t, i, o, a) { const s = {}; const u = t === Wt; function l(e) { let r; return s[e] = !0, k.each(t[e] || [], (e, t) => { const n = t(i, o, a); return typeof n !== 'string' || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n), l(n), !1); }), r; } return l(i.dataTypes[0]) || !s['*'] && l('*'); } function zt(e, t) {
        let n; let r; const i = k.ajaxSettings.flatOptions || {}; for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]); return r && k.extend(!0, e, r), e;
    }Ft.href = Et.href, k.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: Et.href, type: 'GET', isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol), global: !0, processData: !0, async: !0, contentType: 'application/x-www-form-urlencoded; charset=UTF-8', accepts: { '*': $t, text: 'text/plain', html: 'text/html', xml: 'application/xml, text/xml', json: 'application/json, text/javascript' }, contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ }, responseFields: { xml: 'responseXML', text: 'responseText', json: 'responseJSON' }, converters: { '* text': String, 'text html': !0, 'text json': JSON.parse, 'text xml': k.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup(e, t) { return t ? zt(zt(e, k.ajaxSettings), t) : zt(k.ajaxSettings, e); }, ajaxPrefilter: Bt(It), ajaxTransport: Bt(Wt), ajax(e, t) {
        typeof e === 'object' && (t = e, e = void 0), t = t || {}; let c; let f; let p; let n; let d; let r; let h; let g; let i; let o; const v = k.ajaxSetup({}, t); const y = v.context || v; const m = v.context && (y.nodeType || y.jquery) ? k(y) : k.event; const x = k.Deferred(); const b = k.Callbacks('once memory'); let w = v.statusCode || {}; const a = {}; const s = {}; let u = 'canceled'; var T = { readyState: 0, getResponseHeader(e) {
            let t; if (h) {
                if (!n)
                    for (n = {}; t = Pt.exec(p);)
                        n[t[1].toLowerCase() + ' '] = (n[t[1].toLowerCase() + ' '] || []).concat(t[2]); t = n[e.toLowerCase() + ' '];
            } return t == null ? null : t.join(', ');
        }, getAllResponseHeaders() { return h ? p : null; }, setRequestHeader(e, t) { return h == null && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e, a[e] = t), this; }, overrideMimeType(e) { return h == null && (v.mimeType = e), this; }, statusCode(e) {
            let t; if (e)
                if (h)
                    T.always(e[T.status]); else
                    for (t in e)
                        w[t] = [w[t], e[t]]; return this;
        }, abort(e) { const t = e || u; return c && c.abort(t), l(0, t), this; } }; if (x.promise(T), v.url = ((e || v.url || Et.href) + '').replace(Mt, Et.protocol + '//'), v.type = t.method || t.type || v.method || v.type, v.dataTypes = (v.dataType || '*').toLowerCase().match(R) || [''], v.crossDomain == null) { r = E.createElement('a'); try { r.href = v.url, r.href = r.href, v.crossDomain = Ft.protocol + '//' + Ft.host != r.protocol + '//' + r.host; } catch (e) { v.crossDomain = !0; } } if (v.data && v.processData && typeof v.data !== 'string' && (v.data = k.param(v.data, v.traditional)), _t(It, v, t, T), h)
            return T; for (i in (g = k.event && v.global) && k.active++ == 0 && k.event.trigger('ajaxStart'), v.type = v.type.toUpperCase(), v.hasContent = !Rt.test(v.type), f = v.url.replace(Ht, ''), v.hasContent ? v.data && v.processData && (v.contentType || '').indexOf('application/x-www-form-urlencoded') === 0 && (v.data = v.data.replace(Lt, '+')) : (o = v.url.slice(f.length), v.data && (v.processData || typeof v.data === 'string') && (f += (St.test(f) ? '&' : '?') + v.data, delete v.data), !1 === v.cache && (f = f.replace(Ot, '$1'), o = (St.test(f) ? '&' : '?') + '_=' + kt++ + o), v.url = f + o), v.ifModified && (k.lastModified[f] && T.setRequestHeader('If-Modified-Since', k.lastModified[f]), k.etag[f] && T.setRequestHeader('If-None-Match', k.etag[f])), (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && T.setRequestHeader('Content-Type', v.contentType), T.setRequestHeader('Accept', v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + (v.dataTypes[0] !== '*' ? ', ' + $t + '; q=0.01' : '') : v.accepts['*']), v.headers)
            T.setRequestHeader(i, v.headers[i]); if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h))
            return T.abort(); if (u = 'abort', b.add(v.complete), T.done(v.success), T.fail(v.error), c = _t(Wt, v, t, T)) {
            if (T.readyState = 1, g && m.trigger('ajaxSend', [T, v]), h)
                return T; v.async && v.timeout > 0 && (d = C.setTimeout(() => { T.abort('timeout'); }, v.timeout)); try { h = !1, c.send(a, l); } catch (e) {
                if (h)
                    throw e; l(-1, e);
            }
        } else
            l(-1, 'No Transport'); function l(e, t, n, r) {
            let i; let o; let a; let s; let u; let l = t; h || (h = !0, d && C.clearTimeout(d), c = void 0, p = r || '', T.readyState = e > 0 ? 4 : 0, i = e >= 200 && e < 300 || e === 304, n && (s = (function (e, t, n) {
                for (var r, i, o, a, s = e.contents, u = e.dataTypes; u[0] === '*';)
                    u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader('Content-Type')); if (r)
                    for (i in s)
                        if (s[i] && s[i].test(r)) { u.unshift(i); break; } if (u[0] in n)
                    o = u[0]; else { for (i in n) { if (!u[0] || e.converters[i + ' ' + u[0]]) { o = i; break; }a || (a = i); }o = o || a; } if (o)
                    return o !== u[0] && u.unshift(o), n[o];
            })(v, T, n)), s = (function (e, t, n, r) {
                let i; let o; let a; let s; let u; const l = {}; const c = e.dataTypes.slice(); if (c[1])
                    for (a in e.converters)
                        l[a.toLowerCase()] = e.converters[a]; for (o = c.shift(); o;)
                    if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift())
                        if (o === '*')
                            o = u; else if (u !== '*' && u !== o) {
                            if (!(a = l[u + ' ' + o] || l['* ' + o]))
                                for (i in l)
                                    if ((s = i.split(' '))[1] === o && (a = l[u + ' ' + s[0]] || l['* ' + s[0]])) { !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0], c.unshift(s[1])); break; } if (!0 !== a)
                                if (a && e.throws)
                                    t = a(t); else
                                    try { t = a(t); } catch (e) { return { state: 'parsererror', error: a ? e : 'No conversion from ' + u + ' to ' + o }; }
                        } return { state: 'success', data: t };
            })(v, s, T, i), i ? (v.ifModified && ((u = T.getResponseHeader('Last-Modified')) && (k.lastModified[f] = u), (u = T.getResponseHeader('etag')) && (k.etag[f] = u)), e === 204 || v.type === 'HEAD' ? l = 'nocontent' : e === 304 ? l = 'notmodified' : (l = s.state, o = s.data, i = !(a = s.error))) : (a = l, !e && l || (l = 'error', e < 0 && (e = 0))), T.status = e, T.statusText = (t || l) + '', i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]), T.statusCode(w), w = void 0, g && m.trigger(i ? 'ajaxSuccess' : 'ajaxError', [T, v, i ? o : a]), b.fireWith(y, [T, l]), g && (m.trigger('ajaxComplete', [T, v]), --k.active || k.event.trigger('ajaxStop')));
        } return T;
    }, getJSON(e, t, n) { return k.get(e, t, n, 'json'); }, getScript(e, t) { return k.get(e, void 0, t, 'script'); } }), k.each(['get', 'post'], (e, i) => { k[i] = function (e, t, n, r) { return m(t) && (r = r || n, n = t, t = void 0), k.ajax(k.extend({ url: e, type: i, dataType: r, data: t, success: n }, k.isPlainObject(e) && e)); }; }), k._evalUrl = function (e, t) { return k.ajax({ url: e, type: 'GET', dataType: 'script', cache: !0, async: !1, global: !1, converters: { 'text script'() {} }, dataFilter(e) { k.globalEval(e, t); } }); }, k.fn.extend({ wrapAll(e) {
        let t; return this[0] && (m(e) && (e = e.call(this[0])), t = k(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
            for (var e = this; e.firstElementChild;)
                e = e.firstElementChild; return e;
        }).append(this)), this;
    }, wrapInner(n) { return m(n) ? this.each(function (e) { k(this).wrapInner(n.call(this, e)); }) : this.each(function () { const e = k(this); const t = e.contents(); t.length ? t.wrapAll(n) : e.append(n); }); }, wrap(t) { const n = m(t); return this.each(function (e) { k(this).wrapAll(n ? t.call(this, e) : t); }); }, unwrap(e) { return this.parent(e).not('body').each(function () { k(this).replaceWith(this.childNodes); }), this; } }), k.expr.pseudos.hidden = function (e) { return !k.expr.pseudos.visible(e); }, k.expr.pseudos.visible = function (e) { return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length); }, k.ajaxSettings.xhr = function () { try { return new C.XMLHttpRequest(); } catch (e) {} }; const Ut = { 0: 200, 1223: 204 }; let Xt = k.ajaxSettings.xhr(); y.cors = !!Xt && 'withCredentials' in Xt, y.ajax = Xt = !!Xt, k.ajaxTransport((i) => {
        let o; let a; if (y.cors || Xt && !i.crossDomain)
            return { send(e, t) {
                let n; const r = i.xhr(); if (r.open(i.type, i.url, i.async, i.username, i.password), i.xhrFields)
                    for (n in i.xhrFields)
                        r[n] = i.xhrFields[n]; for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType), i.crossDomain || e['X-Requested-With'] || (e['X-Requested-With'] = 'XMLHttpRequest'), e)
                    r.setRequestHeader(n, e[n]); o = function (e) { return function () { o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null, e === 'abort' ? r.abort() : e === 'error' ? typeof r.status !== 'number' ? t(0, 'error') : t(r.status, r.statusText) : t(Ut[r.status] || r.status, r.statusText, (r.responseType || 'text') !== 'text' || typeof r.responseText !== 'string' ? { binary: r.response } : { text: r.responseText }, r.getAllResponseHeaders())); }; }, r.onload = o(), a = r.onerror = r.ontimeout = o('error'), void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function () { r.readyState === 4 && C.setTimeout(() => { o && a(); }); }, o = o('abort'); try { r.send(i.hasContent && i.data || null); } catch (e) {
                    if (o)
                        throw e;
                }
            }, abort() { o && o(); } };
    }), k.ajaxPrefilter((e) => { e.crossDomain && (e.contents.script = !1); }), k.ajaxSetup({ accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' }, contents: { script: /\b(?:java|ecma)script\b/ }, converters: { 'text script'(e) { return k.globalEval(e), e; } } }), k.ajaxPrefilter('script', (e) => { void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = 'GET'); }), k.ajaxTransport('script', (n) => {
        let r; let i; if (n.crossDomain || n.scriptAttrs)
            return { send(e, t) { r = k('<script>').attr(n.scriptAttrs || {}).prop({ charset: n.scriptCharset, src: n.url }).on('load error', i = function (e) { r.remove(), i = null, e && t(e.type === 'error' ? 404 : 200, e.type); }), E.head.appendChild(r[0]); }, abort() { i && i(); } };
    }); let Vt; const Gt = []; const Yt = /(=)\?(?=&|$)|\?\?/; k.ajaxSetup({ jsonp: 'callback', jsonpCallback() { const e = Gt.pop() || k.expando + '_' + kt++; return this[e] = !0, e; } }), k.ajaxPrefilter('json jsonp', (e, t, n) => {
        let r; let i; let o; const a = !1 !== e.jsonp && (Yt.test(e.url) ? 'url' : typeof e.data === 'string' && (e.contentType || '').indexOf('application/x-www-form-urlencoded') === 0 && Yt.test(e.data) && 'data'); if (a || e.dataTypes[0] === 'jsonp')
            return r = e.jsonpCallback = m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Yt, '$1' + r) : !1 !== e.jsonp && (e.url += (St.test(e.url) ? '&' : '?') + e.jsonp + '=' + r), e.converters['script json'] = function () { return o || k.error(r + ' was not called'), o[0]; }, e.dataTypes[0] = 'json', i = C[r], C[r] = function () { o = arguments; }, n.always(() => { void 0 === i ? k(C).removeProp(r) : C[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, Gt.push(r)), o && m(i) && i(o[0]), o = i = void 0; }), 'script';
    }), y.createHTMLDocument = ((Vt = E.implementation.createHTMLDocument('').body).innerHTML = '<form></form><form></form>', Vt.childNodes.length === 2), k.parseHTML = function (e, t, n) { return typeof e !== 'string' ? [] : (typeof t === 'boolean' && (n = t, t = !1), t || (y.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument('')).createElement('base')).href = E.location.href, t.head.appendChild(r)) : t = E), o = !n && [], (i = D.exec(e)) ? [t.createElement(i[1])] : (i = we([e], t, o), o && o.length && k(o).remove(), k.merge([], i.childNodes))); let r; let i; let o; }, k.fn.load = function (e, t, n) { let r; let i; let o; const a = this; const s = e.indexOf(' '); return s > -1 && (r = mt(e.slice(s)), e = e.slice(0, s)), m(t) ? (n = t, t = void 0) : t && typeof t === 'object' && (i = 'POST'), a.length > 0 && k.ajax({ url: e, type: i || 'GET', dataType: 'html', data: t }).done(function (e) { o = arguments, a.html(r ? k('<div>').append(k.parseHTML(e)).find(r) : e); }).always(n && ((e, t) => { a.each(function () { n.apply(this, o || [e.responseText, t, e]); }); })), this; }, k.each(['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'], (e, t) => { k.fn[t] = function (e) { return this.on(t, e); }; }), k.expr.pseudos.animated = function (t) { return k.grep(k.timers, (e) => t === e.elem).length; }, k.offset = { setOffset(e, t, n) { let r; let i; let o; let a; let s; let u; const l = k.css(e, 'position'); const c = k(e); const f = {}; l === 'static' && (e.style.position = 'relative'), s = c.offset(), o = k.css(e, 'top'), u = k.css(e, 'left'), i = (l === 'absolute' || l === 'fixed') && (o + u).indexOf('auto') > -1 ? (a = (r = c.position()).top, r.left) : (a = parseFloat(o) || 0, parseFloat(u) || 0), m(t) && (t = t.call(e, n, k.extend({}, s))), t.top != null && (f.top = t.top - s.top + a), t.left != null && (f.left = t.left - s.left + i), 'using' in t ? t.using.call(e, f) : c.css(f); } }, k.fn.extend({ offset(t) {
        if (arguments.length)
            return void 0 === t ? this : this.each(function (e) { k.offset.setOffset(this, t, e); }); let e; let n; const r = this[0]; return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, { top: e.top + n.pageYOffset, left: e.left + n.pageXOffset }) : { top: 0, left: 0 } : void 0;
    }, position() {
        if (this[0]) {
            let e; let t; let n; const r = this[0]; let i = { top: 0, left: 0 }; if (k.css(r, 'position') === 'fixed')
                t = r.getBoundingClientRect(); else {
                for (t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && k.css(e, 'position') === 'static';)
                    e = e.parentNode; e && e !== r && e.nodeType === 1 && ((i = k(e).offset()).top += k.css(e, 'borderTopWidth', !0), i.left += k.css(e, 'borderLeftWidth', !0));
            } return { top: t.top - i.top - k.css(r, 'marginTop', !0), left: t.left - i.left - k.css(r, 'marginLeft', !0) };
        }
    }, offsetParent() {
        return this.map(function () {
            for (var e = this.offsetParent; e && k.css(e, 'position') === 'static';)
                e = e.offsetParent; return e || ie;
        });
    } }), k.each({ scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' }, (t, i) => {
        const o = i === 'pageYOffset'; k.fn[t] = function (e) {
            return _(this, (e, t, n) => {
                let r; if (x(e) ? r = e : e.nodeType === 9 && (r = e.defaultView), void 0 === n)
                    return r ? r[i] : e[t]; r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n;
            }, t, e, arguments.length);
        };
    }), k.each(['top', 'left'], (e, n) => {
        k.cssHooks[n] = ze(y.pixelPosition, (e, t) => {
            if (t)
                return t = _e(e, n), $e.test(t) ? k(e).position()[n] + 'px' : t;
        });
    }), k.each({ Height: 'height', Width: 'width' }, (a, s) => { k.each({ padding: 'inner' + a, content: s, '': 'outer' + a }, (r, o) => { k.fn[o] = function (e, t) { const n = arguments.length && (r || typeof e !== 'boolean'); const i = r || (!0 === e || !0 === t ? 'margin' : 'border'); return _(this, (e, t, n) => { let r; return x(e) ? o.indexOf('outer') === 0 ? e['inner' + a] : e.document.documentElement['client' + a] : e.nodeType === 9 ? (r = e.documentElement, Math.max(e.body['scroll' + a], r['scroll' + a], e.body['offset' + a], r['offset' + a], r['client' + a])) : void 0 === n ? k.css(e, t, i) : k.style(e, t, n, i); }, s, n ? e : void 0, n); }; }); }), k.each('blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(' '), (e, n) => { k.fn[n] = function (e, t) { return arguments.length > 0 ? this.on(n, null, e, t) : this.trigger(n); }; }), k.fn.extend({ hover(e, t) { return this.mouseenter(e).mouseleave(t || e); } }), k.fn.extend({ bind(e, t, n) { return this.on(e, null, t, n); }, unbind(e, t) { return this.off(e, null, t); }, delegate(e, t, n, r) { return this.on(t, e, n, r); }, undelegate(e, t, n) { return arguments.length === 1 ? this.off(e, '**') : this.off(t, e || '**', n); } }), k.proxy = function (e, t) {
        let n; let r; let i; if (typeof t === 'string' && (n = e[t], t = e, e = n), m(e))
            return r = s.call(arguments, 2), (i = function () { return e.apply(t || this, r.concat(s.call(arguments))); }).guid = e.guid = e.guid || k.guid++, i;
    }, k.holdReady = function (e) { e ? k.readyWait++ : k.ready(!0); }, k.isArray = Array.isArray, k.parseJSON = JSON.parse, k.nodeName = A, k.isFunction = m, k.isWindow = x, k.camelCase = V, k.type = w, k.now = Date.now, k.isNumeric = function (e) { const t = k.type(e); return (t === 'number' || t === 'string') && !isNaN(e - parseFloat(e)); }, typeof define === 'function' && define.amd && define('jquery', [], () => k); const Qt = C.jQuery; const Jt = C.$; return k.noConflict = function (e) { return C.$ === k && (C.$ = Jt), e && C.jQuery === k && (C.jQuery = Qt), k; }, e || (C.jQuery = C.$ = k), k;
}), (function () {
    function f() {} const n = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this || {}; const r = n._; const e = Array.prototype; const o = Object.prototype; const s = typeof Symbol !== 'undefined' ? Symbol.prototype : null; const u = e.push; const c = e.slice; const p = o.toString; const i = o.hasOwnProperty; const t = Array.isArray; const a = Object.keys; const l = Object.create; var h = function (n) { return n instanceof h ? n : this instanceof h ? void (this._wrapped = n) : new h(n); }; typeof exports === 'undefined' || exports.nodeType ? n._ = h : (typeof module !== 'undefined' && !module.nodeType && module.exports && (exports = module.exports = h), exports._ = h), h.VERSION = '1.9.1'; function y(u, i, n) {
        if (void 0 === i)
            return u; switch (n == null ? 3 : n) { case 1: return function (n) { return u.call(i, n); }; case 3: return function (n, r, t) { return u.call(i, n, r, t); }; case 4: return function (n, r, t, e) { return u.call(i, n, r, t, e); }; } return function () { return u.apply(i, arguments); };
    } function d(n, r, t) { return h.iteratee !== v ? h.iteratee(n, r) : n == null ? h.identity : h.isFunction(n) ? y(n, r, t) : h.isObject(n) && !h.isArray(n) ? h.matcher(n) : h.property(n); } let v; h.iteratee = v = function (n, r) { return d(n, r, 1 / 0); }; function g(u, i) {
        return i = i == null ? u.length - 1 : +i, function () {
            for (var n = Math.max(arguments.length - i, 0), r = Array(n), t = 0; t < n; t++)
                r[t] = arguments[t + i]; switch (i) { case 0: return u.call(this, r); case 1: return u.call(this, arguments[0], r); case 2: return u.call(this, arguments[0], arguments[1], r); } const e = Array(i + 1); for (t = 0; t < i; t++)
                e[t] = arguments[t]; return e[i] = r, u.apply(this, e);
        };
    } function m(n) {
        if (!h.isObject(n))
            return {}; if (l)
            return l(n); f.prototype = n; const r = new f(); return f.prototype = null, r;
    } function b(r) { return function (n) { return n == null ? void 0 : n[r]; }; } function j(n, r) { return n != null && i.call(n, r); } function x(n, r) {
        for (var t = r.length, e = 0; e < t; e++) {
            if (n == null)
                return; n = n[r[e]];
        } return t ? n : void 0;
    } function w(n) { const r = A(n); return typeof r === 'number' && r >= 0 && r <= _; } var _ = Math.pow(2, 53) - 1; var A = b('length'); h.each = h.forEach = function (n, r, t) {
        let e; let u; if (r = y(r, t), w(n))
            for (e = 0, u = n.length; e < u; e++)
                r(n[e], e, n); else {
            const i = h.keys(n); for (e = 0, u = i.length; e < u; e++)
                r(n[i[e]], i[e], n);
        } return n;
    }, h.map = h.collect = function (n, r, t) { r = d(r, t); for (var e = !w(n) && h.keys(n), u = (e || n).length, i = Array(u), o = 0; o < u; o++) { const a = e ? e[o] : o; i[o] = r(n[a], a, n); } return i; }; function O(c) { return function (n, r, t, e) { const u = arguments.length >= 3; return (function (n, r, t, e) { const u = !w(n) && h.keys(n); const i = (u || n).length; let o = c > 0 ? 0 : i - 1; for (e || (t = n[u ? u[o] : o], o += c); o >= 0 && o < i; o += c) { const a = u ? u[o] : o; t = r(t, n[a], a, n); } return t; })(n, y(r, e, 4), t, u); }; }h.reduce = h.foldl = h.inject = O(1), h.reduceRight = h.foldr = O(-1), h.find = h.detect = function (n, r, t) {
        const e = (w(n) ? h.findIndex : h.findKey)(n, r, t); if (void 0 !== e && e !== -1)
            return n[e];
    }, h.filter = h.select = function (n, e, r) { const u = []; return e = d(e, r), h.each(n, (n, r, t) => { e(n, r, t) && u.push(n); }), u; }, h.reject = function (n, r, t) { return h.filter(n, h.negate(d(r)), t); }, h.every = h.all = function (n, r, t) {
        r = d(r, t); for (let e = !w(n) && h.keys(n), u = (e || n).length, i = 0; i < u; i++) {
            const o = e ? e[i] : i; if (!r(n[o], o, n))
                return !1;
        } return !0;
    }, h.some = h.any = function (n, r, t) {
        r = d(r, t); for (let e = !w(n) && h.keys(n), u = (e || n).length, i = 0; i < u; i++) {
            const o = e ? e[i] : i; if (r(n[o], o, n))
                return !0;
        } return !1;
    }, h.contains = h.includes = h.include = function (n, r, t, e) { return w(n) || (n = h.values(n)), typeof t === 'number' && !e || (t = 0), h.indexOf(n, r, t) >= 0; }, h.invoke = g((n, t, e) => {
        let u; let i; return h.isFunction(t) ? i = t : h.isArray(t) && (u = t.slice(0, -1), t = t[t.length - 1]), h.map(n, (n) => {
            let r = i; if (!r) {
                if (u && u.length && (n = x(n, u)), n == null)
                    return; r = n[t];
            } return r == null ? r : r.apply(n, e);
        });
    }), h.pluck = function (n, r) { return h.map(n, h.property(r)); }, h.where = function (n, r) { return h.filter(n, h.matcher(r)); }, h.findWhere = function (n, r) { return h.find(n, h.matcher(r)); }, h.max = function (n, e, r) {
        let t; let u; let i = -1 / 0; let o = -1 / 0; if (e == null || typeof e === 'number' && typeof n[0] !== 'object' && n != null)
            for (let a = 0, c = (n = w(n) ? n : h.values(n)).length; a < c; a++)
                (t = n[a]) != null && i < t && (i = t); else
            e = d(e, r), h.each(n, (n, r, t) => { u = e(n, r, t), (o < u || u === -1 / 0 && i === -1 / 0) && (i = n, o = u); }); return i;
    }, h.min = function (n, e, r) {
        let t; let u; let i = 1 / 0; let o = 1 / 0; if (e == null || typeof e === 'number' && typeof n[0] !== 'object' && n != null)
            for (let a = 0, c = (n = w(n) ? n : h.values(n)).length; a < c; a++)
                (t = n[a]) != null && t < i && (i = t); else
            e = d(e, r), h.each(n, (n, r, t) => { ((u = e(n, r, t)) < o || u === 1 / 0 && i === 1 / 0) && (i = n, o = u); }); return i;
    }, h.shuffle = function (n) { return h.sample(n, 1 / 0); }, h.sample = function (n, r, t) {
        if (r == null || t)
            return w(n) || (n = h.values(n)), n[h.random(n.length - 1)]; const e = w(n) ? h.clone(n) : h.values(n); const u = A(e); r = Math.max(Math.min(r, u), 0); for (let i = u - 1, o = 0; o < r; o++) { const a = h.random(o, i); const c = e[o]; e[o] = e[a], e[a] = c; } return e.slice(0, r);
    }, h.sortBy = function (n, e, r) {
        let u = 0; return e = d(e, r), h.pluck(h.map(n, (n, r, t) => ({ value: n, index: u++, criteria: e(n, r, t) })).sort((n, r) => {
            const t = n.criteria; const e = r.criteria; if (t !== e) {
                if (e < t || void 0 === t)
                    return 1; if (t < e || void 0 === e)
                    return -1;
            } return n.index - r.index;
        }), 'value');
    }; function k(o, r) { return function (e, u, n) { const i = r ? [[], []] : {}; return u = d(u, n), h.each(e, (n, r) => { const t = u(n, r, e); o(i, n, t); }), i; }; }h.groupBy = k((n, r, t) => { j(n, t) ? n[t].push(r) : n[t] = [r]; }), h.indexBy = k((n, r, t) => { n[t] = r; }), h.countBy = k((n, r, t) => { j(n, t) ? n[t]++ : n[t] = 1; }); const S = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g; h.toArray = function (n) { return n ? h.isArray(n) ? c.call(n) : h.isString(n) ? n.match(S) : w(n) ? h.map(n, h.identity) : h.values(n) : []; }, h.size = function (n) { return n == null ? 0 : w(n) ? n.length : h.keys(n).length; }, h.partition = k((n, r, t) => { n[t ? 0 : 1].push(r); }, !0), h.first = h.head = h.take = function (n, r, t) { return n == null || n.length < 1 ? r == null ? void 0 : [] : r == null || t ? n[0] : h.initial(n, n.length - r); }, h.initial = function (n, r, t) { return c.call(n, 0, Math.max(0, n.length - (r == null || t ? 1 : r))); }, h.last = function (n, r, t) { return n == null || n.length < 1 ? r == null ? void 0 : [] : r == null || t ? n[n.length - 1] : h.rest(n, Math.max(0, n.length - r)); }, h.rest = h.tail = h.drop = function (n, r, t) { return c.call(n, r == null || t ? 1 : r); }, h.compact = function (n) { return h.filter(n, Boolean); }; var M = function (n, r, t, e) {
        for (let u = (e = e || []).length, i = 0, o = A(n); i < o; i++) {
            const a = n[i]; if (w(a) && (h.isArray(a) || h.isArguments(a)))
                if (r)
                    for (let c = 0, l = a.length; c < l;)
                        e[u++] = a[c++]; else
                    M(a, r, t, e), u = e.length; else
                t || (e[u++] = a);
        } return e;
    }; h.flatten = function (n, r) { return M(n, r, !1); }, h.without = g((n, r) => h.difference(n, r)), h.uniq = h.unique = function (n, r, t, e) { h.isBoolean(r) || (e = t, t = r, r = !1), t != null && (t = d(t, e)); for (var u = [], i = [], o = 0, a = A(n); o < a; o++) { const c = n[o]; const l = t ? t(c, o, n) : c; r && !t ? (o && i === l || u.push(c), i = l) : t ? h.contains(i, l) || (i.push(l), u.push(c)) : h.contains(u, c) || u.push(c); } return u; }, h.union = g((n) => h.uniq(M(n, !0, !0))), h.intersection = function (n) {
        for (var r = [], t = arguments.length, e = 0, u = A(n); e < u; e++) {
            const i = n[e]; if (!h.contains(r, i)) {
                var o; for (o = 1; o < t && h.contains(arguments[o], i); o++)
                    ;o === t && r.push(i);
            }
        } return r;
    }, h.difference = g((n, r) => r = M(r, !0, !0), h.filter(n, (n) => !h.contains(r, n))), h.unzip = function (n) {
        for (var r = n && h.max(n, A).length || 0, t = Array(r), e = 0; e < r; e++)
            t[e] = h.pluck(n, e); return t;
    }, h.zip = g(h.unzip), h.object = function (n, r) {
        for (var t = {}, e = 0, u = A(n); e < u; e++)
            r ? t[n[e]] = r[e] : t[n[e][0]] = n[e][1]; return t;
    }; function F(i) {
        return function (n, r, t) {
            r = d(r, t); for (let e = A(n), u = i > 0 ? 0 : e - 1; u >= 0 && u < e; u += i)
                if (r(n[u], u, n))
                    return u; return -1;
        };
    }h.findIndex = F(1), h.findLastIndex = F(-1), h.sortedIndex = function (n, r, t, e) { for (var u = (t = d(t, e, 1))(r), i = 0, o = A(n); i < o;) { const a = Math.floor((i + o) / 2); t(n[a]) < u ? i = a + 1 : o = a; } return i; }; function E(i, o, a) {
        return function (n, r, t) {
            let e = 0; let u = A(n); if (typeof t === 'number')
                i > 0 ? e = t >= 0 ? t : Math.max(t + u, e) : u = t >= 0 ? Math.min(t + 1, u) : t + u + 1; else if (a && t && u)
                return n[t = a(n, r)] === r ? t : -1; if (r != r)
                return (t = o(c.call(n, e, u), h.isNaN)) >= 0 ? t + e : -1; for (t = i > 0 ? e : u - 1; t >= 0 && t < u; t += i)
                if (n[t] === r)
                    return t; return -1;
        };
    }h.indexOf = E(1, h.findIndex, h.sortedIndex), h.lastIndexOf = E(-1, h.findLastIndex), h.range = function (n, r, t) {
        r == null && (r = n || 0, n = 0), t || (t = r < n ? -1 : 1); for (var e = Math.max(Math.ceil((r - n) / t), 0), u = Array(e), i = 0; i < e; i++, n += t)
            u[i] = n; return u;
    }, h.chunk = function (n, r) {
        if (r == null || r < 1)
            return []; for (var t = [], e = 0, u = n.length; e < u;)
            t.push(c.call(n, e, e += r)); return t;
    }; function N(n, r, t, e, u) {
        if (!(e instanceof r))
            return n.apply(t, u); const i = m(n.prototype); const o = n.apply(i, u); return h.isObject(o) ? o : i;
    }h.bind = g((r, t, e) => {
        if (!h.isFunction(r))
            throw new TypeError('Bind must be called on a function'); var u = g(function (n) { return N(r, u, t, this, e.concat(n)); }); return u;
    }), h.partial = g((u, i) => {
        const o = h.partial.placeholder; var a = function () {
            for (var n = 0, r = i.length, t = Array(r), e = 0; e < r; e++)
                t[e] = i[e] === o ? arguments[n++] : i[e]; for (;n < arguments.length;)
                t.push(arguments[n++]); return N(u, a, this, this, t);
        }; return a;
    }), (h.partial.placeholder = h).bindAll = g((n, r) => {
        let t = (r = M(r, !1, !1)).length; if (t < 1)
            throw new Error('bindAll must be passed function names'); for (;t--;) { const e = r[t]; n[e] = h.bind(n[e], n); }
    }), h.memoize = function (e, u) { var i = function (n) { const r = i.cache; const t = '' + (u ? u.apply(this, arguments) : n); return j(r, t) || (r[t] = e.apply(this, arguments)), r[t]; }; return i.cache = {}, i; }, h.delay = g((n, r, t) => setTimeout(() => n.apply(null, t), r)), h.defer = h.partial(h.delay, h, 1), h.throttle = function (t, e, u) { let i; let o; let a; let c; let l = 0; u || (u = {}); function f() { l = !1 === u.leading ? 0 : h.now(), i = null, c = t.apply(o, a), i || (o = a = null); } const n = function () { const n = h.now(); l || !1 !== u.leading || (l = n); const r = e - (n - l); return o = this, a = arguments, r <= 0 || e < r ? (i && (clearTimeout(i), i = null), l = n, c = t.apply(o, a), i || (o = a = null)) : i || !1 === u.trailing || (i = setTimeout(f, r)), c; }; return n.cancel = function () { clearTimeout(i), l = 0, i = o = a = null; }, n; }, h.debounce = function (t, e, u) {
        function a(n, r) { i = null, r && (o = t.apply(n, r)); } let i; let o; const n = g(function (n) {
            if (i && clearTimeout(i), u) { const r = !i; i = setTimeout(a, e), r && (o = t.apply(this, n)); } else
                i = h.delay(a, e, this, n); return o;
        }); return n.cancel = function () { clearTimeout(i), i = null; }, n;
    }, h.wrap = function (n, r) { return h.partial(r, n); }, h.negate = function (n) { return function () { return !n.apply(this, arguments); }; }, h.compose = function () {
        const t = arguments; const e = t.length - 1; return function () {
            for (var n = e, r = t[e].apply(this, arguments); n--;)
                r = t[n].call(this, r); return r;
        };
    }, h.after = function (n, r) {
        return function () {
            if (--n < 1)
                return r.apply(this, arguments);
        };
    }, h.before = function (n, r) { let t; return function () { return --n > 0 && (t = r.apply(this, arguments)), n <= 1 && (r = null), t; }; }, h.once = h.partial(h.before, 2), h.restArguments = g; function B(n, r) {
        let t = T.length; const e = n.constructor; const u = h.isFunction(e) && e.prototype || o; let i = 'constructor'; for (j(n, i) && !h.contains(r, i) && r.push(i); t--;)
            (i = T[t]) in n && n[i] !== u[i] && !h.contains(r, i) && r.push(i);
    } const I = !{ toString: null }.propertyIsEnumerable('toString'); var T = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; h.keys = function (n) {
        if (!h.isObject(n))
            return []; if (a)
            return a(n); const r = []; for (const t in n)
            j(n, t) && r.push(t); return I && B(n, r), r;
    }, h.allKeys = function (n) {
        if (!h.isObject(n))
            return []; const r = []; for (const t in n)
            r.push(t); return I && B(n, r), r;
    }, h.values = function (n) {
        for (var r = h.keys(n), t = r.length, e = Array(t), u = 0; u < t; u++)
            e[u] = n[r[u]]; return e;
    }, h.mapObject = function (n, r, t) { r = d(r, t); for (var e = h.keys(n), u = e.length, i = {}, o = 0; o < u; o++) { const a = e[o]; i[a] = r(n[a], a, n); } return i; }, h.pairs = function (n) {
        for (var r = h.keys(n), t = r.length, e = Array(t), u = 0; u < t; u++)
            e[u] = [r[u], n[r[u]]]; return e;
    }, h.invert = function (n) {
        for (var r = {}, t = h.keys(n), e = 0, u = t.length; e < u; e++)
            r[n[t[e]]] = t[e]; return r;
    }, h.functions = h.methods = function (n) {
        const r = []; for (const t in n)
            h.isFunction(n[t]) && r.push(t); return r.sort();
    }; function R(c, l) {
        return function (n) {
            const r = arguments.length; if (l && (n = Object(n)), r < 2 || n == null)
                return n; for (let t = 1; t < r; t++)
                for (let e = arguments[t], u = c(e), i = u.length, o = 0; o < i; o++) { const a = u[o]; l && void 0 !== n[a] || (n[a] = e[a]); } return n;
        };
    }h.extend = R(h.allKeys), h.extendOwn = h.assign = R(h.keys), h.findKey = function (n, r, t) {
        r = d(r, t); for (var e, u = h.keys(n), i = 0, o = u.length; i < o; i++)
            if (r(n[e = u[i]], e, n))
                return e;
    }; function z(n, r, t) { return r in t; } let q; let K; h.pick = g((n, r) => {
        const t = {}; let e = r[0]; if (n == null)
            return t; h.isFunction(e) ? (r.length > 1 && (e = y(e, r[1])), r = h.allKeys(n)) : (e = z, r = M(r, !1, !1), n = Object(n)); for (let u = 0, i = r.length; u < i; u++) { const o = r[u]; const a = n[o]; e(a, o, n) && (t[o] = a); } return t;
    }), h.omit = g((n, t) => { let r; let e = t[0]; return h.isFunction(e) ? (e = h.negate(e), t.length > 1 && (r = t[1])) : (t = h.map(M(t, !1, !1), String), e = function (n, r) { return !h.contains(t, r); }), h.pick(n, e, r); }), h.defaults = R(h.allKeys, !0), h.create = function (n, r) { const t = m(n); return r && h.extendOwn(t, r), t; }, h.clone = function (n) { return h.isObject(n) ? h.isArray(n) ? n.slice() : h.extend({}, n) : n; }, h.tap = function (n, r) { return r(n), n; }, h.isMatch = function (n, r) {
        const t = h.keys(r); const e = t.length; if (n == null)
            return !e; for (let u = Object(n), i = 0; i < e; i++) {
            const o = t[i]; if (r[o] !== u[o] || !(o in u))
                return !1;
        } return !0;
    }, q = function (n, r, t, e) {
        if (n === r)
            return n !== 0 || 1 / n == 1 / r; if (n == null || r == null)
            return !1; if (n != n)
            return r != r; const u = typeof n; return (u == 'function' || u == 'object' || typeof r === 'object') && K(n, r, t, e);
    }, K = function (n, r, t, e) {
        n instanceof h && (n = n._wrapped), r instanceof h && (r = r._wrapped); const u = p.call(n); if (u !== p.call(r))
            return !1; switch (u) { case '[object RegExp]': case '[object String]': return '' + n == '' + r; case '[object Number]': return +n != +n ? +r != +r : +n == 0 ? 1 / +n == 1 / r : +n == +r; case '[object Date]': case '[object Boolean]': return +n == +r; case '[object Symbol]': return s.valueOf.call(n) === s.valueOf.call(r); } const i = u === '[object Array]'; if (!i) {
            if (typeof n !== 'object' || typeof r !== 'object')
                return !1; const o = n.constructor; const a = r.constructor; if (o !== a && !(h.isFunction(o) && o instanceof o && h.isFunction(a) && a instanceof a) && 'constructor' in n && 'constructor' in r)
                return !1;
        }e = e || []; for (var c = (t = t || []).length; c--;)
            if (t[c] === n)
                return e[c] === r; if (t.push(n), e.push(r), i) {
            if ((c = n.length) !== r.length)
                return !1; for (;c--;)
                if (!q(n[c], r[c], t, e))
                    return !1;
        } else {
            let l; const f = h.keys(n); if (c = f.length, h.keys(r).length !== c)
                return !1; for (;c--;)
                if (l = f[c], !j(r, l) || !q(n[l], r[l], t, e))
                    return !1;
        } return t.pop(), e.pop(), !0;
    }, h.isEqual = function (n, r) { return q(n, r); }, h.isEmpty = function (n) { return n == null || (w(n) && (h.isArray(n) || h.isString(n) || h.isArguments(n)) ? n.length === 0 : h.keys(n).length === 0); }, h.isElement = function (n) { return !(!n || n.nodeType !== 1); }, h.isArray = t || function (n) { return p.call(n) === '[object Array]'; }, h.isObject = function (n) { const r = typeof n; return r == 'function' || r == 'object' && !!n; }, h.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], (r) => { h['is' + r] = function (n) { return p.call(n) === '[object ' + r + ']'; }; }), h.isArguments(arguments) || (h.isArguments = function (n) { return j(n, 'callee'); }); const D = n.document && n.document.childNodes; typeof /./ !== 'function' && typeof Int8Array !== 'object' && typeof D !== 'function' && (h.isFunction = function (n) { return typeof n === 'function' || !1; }), h.isFinite = function (n) { return !h.isSymbol(n) && isFinite(n) && !isNaN(parseFloat(n)); }, h.isNaN = function (n) { return h.isNumber(n) && isNaN(n); }, h.isBoolean = function (n) { return !0 === n || !1 === n || p.call(n) === '[object Boolean]'; }, h.isNull = function (n) { return n === null; }, h.isUndefined = function (n) { return void 0 === n; }, h.has = function (n, r) {
        if (!h.isArray(r))
            return j(n, r); for (var t = r.length, e = 0; e < t; e++) {
            const u = r[e]; if (n == null || !i.call(n, u))
                return !1; n = n[u];
        } return !!t;
    }, h.noConflict = function () { return n._ = r, this; }, h.identity = function (n) { return n; }, h.constant = function (n) { return function () { return n; }; }, h.noop = function () {}, h.property = function (r) { return h.isArray(r) ? function (n) { return x(n, r); } : b(r); }, h.propertyOf = function (r) { return r == null ? function () {} : function (n) { return h.isArray(n) ? x(r, n) : r[n]; }; }, h.matcher = h.matches = function (r) { return r = h.extendOwn({}, r), function (n) { return h.isMatch(n, r); }; }, h.times = function (n, r, t) {
        const e = Array(Math.max(0, n)); r = y(r, t, 1); for (let u = 0; u < n; u++)
            e[u] = r(u); return e;
    }, h.random = function (n, r) { return r == null && (r = n, n = 0), n + Math.floor(Math.random() * (r - n + 1)); }, h.now = Date.now || function () { return (new Date()).getTime(); }; function W(r) { function t(n) { return r[n]; } const n = '(?:' + h.keys(r).join('|') + ')'; const e = RegExp(n); const u = RegExp(n, 'g'); return function (n) { return n = n == null ? '' : '' + n, e.test(n) ? n.replace(u, t) : n; }; } const L = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' }; const P = h.invert(L); h.escape = W(L), h.unescape = W(P), h.result = function (n, r, t) {
        h.isArray(r) || (r = [r]); const e = r.length; if (!e)
            return h.isFunction(t) ? t.call(n) : t; for (let u = 0; u < e; u++) { let i = n == null ? void 0 : n[r[u]]; void 0 === i && (i = t, u = e), n = h.isFunction(i) ? i.call(n) : i; } return n;
    }; let C = 0; h.uniqueId = function (n) { const r = ++C + ''; return n ? n + r : r; }, h.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; function $(n) { return '\\' + U[n]; } const J = /(.)^/; var U = { "'": "'", '\\': '\\', '\r': 'r', '\n': 'n', '\u2028': 'u2028', '\u2029': 'u2029' }; const V = /\\|'|\r|\n|\u2028|\u2029/g; h.template = function (i, n, r) { !n && r && (n = r), n = h.defaults({}, n, h.templateSettings); let t; const e = RegExp([(n.escape || J).source, (n.interpolate || J).source, (n.evaluate || J).source].join('|') + '|$', 'g'); let o = 0; let a = "__p+='"; i.replace(e, (n, r, t, e, u) => a += i.slice(o, u).replace(V, $), o = u + n.length, r ? a += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : t ? a += "'+\n((__t=(" + t + "))==null?'':__t)+\n'" : e && (a += "';\n" + e + "\n__p+='"), n), a += "';\n", n.variable || (a = 'with(obj||{}){\n' + a + '}\n'), a = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + a + 'return __p;\n'; try { t = new Function(n.variable || 'obj', '_', a); } catch (n) { throw n.source = a, n; } function u(n) { return t.call(this, n, h); } const c = n.variable || 'obj'; return u.source = 'function(' + c + '){\n' + a + '}', u; }, h.chain = function (n) { const r = h(n); return r._chain = !0, r; }; function G(n, r) { return n._chain ? h(r).chain() : r; }h.mixin = function (t) { return h.each(h.functions(t), (n) => { const r = h[n] = t[n]; h.prototype[n] = function () { const n = [this._wrapped]; return u.apply(n, arguments), G(this, r.apply(h, n)); }; }), h; }, h.mixin(h), h.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], (r) => { const t = e[r]; h.prototype[r] = function () { const n = this._wrapped; return t.apply(n, arguments), r !== 'shift' && r !== 'splice' || n.length !== 0 || delete n[0], G(this, n); }; }), h.each(['concat', 'join', 'slice'], (n) => { const r = e[n]; h.prototype[n] = function () { return G(this, r.apply(this._wrapped, arguments)); }; }), h.prototype.value = function () { return this._wrapped; }, h.prototype.valueOf = h.prototype.toJSON = h.prototype.value, h.prototype.toString = function () { return String(this._wrapped); }, typeof define === 'function' && define.amd && define('underscore', [], () => h);
})(), (function (t) {
    const e = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global; if (typeof define === 'function' && define.amd)
        define(['underscore', 'jquery', 'exports'], (i, n, r) => { e.Backbone = t(e, r, i, n); }); else if (typeof exports !== 'undefined') { let n; const i = require('underscore'); try { n = require('jquery'); } catch (r) {}t(e, exports, i, n); } else
        e.Backbone = t(e, {}, e._, e.jQuery || e.Zepto || e.ender || e.$);
})((t, e, i, n) => {
    const r = t.Backbone; const s = Array.prototype.slice; e.VERSION = '1.4.0', e.$ = n, e.noConflict = function () { return t.Backbone = r, this; }, e.emulateHTTP = !1, e.emulateJSON = !1; let h; const a = e.Events = {}; const o = /\s+/; var u = function (t, e, n, r, s) {
        let h; let a = 0; if (n && typeof n === 'object') {
            void 0 !== r && 'context' in s && void 0 === s.context && (s.context = r); for (h = i.keys(n); a < h.length; a++)
                e = u(t, e, h[a], n[h[a]], s);
        } else if (n && o.test(n))
            for (h = n.split(o); a < h.length; a++)
                e = t(e, h[a], r, s); else
            e = t(e, n, r, s); return e;
    }; a.on = function (t, e, i) { this._events = u(l, this._events || {}, t, e, { context: i, ctx: this, listening: h }), h && (((this._listeners || (this._listeners = {}))[h.id] = h).interop = !1); return this; }, a.listenTo = function (t, e, n) {
        if (!t)
            return this; const r = t._listenId || (t._listenId = i.uniqueId('l')); const s = this._listeningTo || (this._listeningTo = {}); let a = h = s[r]; a || (this._listenId || (this._listenId = i.uniqueId('l')), a = h = s[r] = new g(this, t)); const o = c(t, e, n, this); if (h = void 0, o)
            throw o; return a.interop && a.on(e, n), this;
    }; var l = function (t, e, i, n) { if (i) { const r = t[e] || (t[e] = []); const s = n.context; const a = n.ctx; const o = n.listening; o && o.count++, r.push({ callback: i, context: s, ctx: s || a, listening: o }); } return t; }; var c = function (t, e, i, n) { try { t.on(e, i, n); } catch (r) { return r; } }; a.off = function (t, e, i) { return this._events && (this._events = u(f, this._events, t, e, { context: i, listeners: this._listeners })), this; }, a.stopListening = function (t, e, n) {
        const r = this._listeningTo; if (!r)
            return this; for (let s = t ? [t._listenId] : i.keys(r), a = 0; a < s.length; a++) {
            const o = r[s[a]]; if (!o)
                break; o.obj.off(e, n, this), o.interop && o.off(e, n);
        } return i.isEmpty(r) && (this._listeningTo = void 0), this;
    }; var f = function (t, e, n, r) {
        if (t) {
            let h; const s = r.context; const a = r.listeners; let o = 0; if (e || s || n) {
                for (h = e ? [e] : i.keys(t); o < h.length; o++) {
                    const u = t[e = h[o]]; if (!u)
                        break; for (var l = [], c = 0; c < u.length; c++) {
                        const f = u[c]; if (n && n !== f.callback && n !== f.callback._callback || s && s !== f.context)
                            l.push(f); else { const d = f.listening; d && d.off(e, n); }
                    }l.length ? t[e] = l : delete t[e];
                } return t;
            } for (h = i.keys(a); o < h.length; o++)
                a[h[o]].cleanup();
        }
    }; a.once = function (t, e, i) { const n = u(d, {}, t, e, this.off.bind(this)); return typeof t === 'string' && i == null && (e = void 0), this.on(n, e, i); }, a.listenToOnce = function (t, e, i) { const n = u(d, {}, e, i, this.stopListening.bind(this, t)); return this.listenTo(t, n); }; var d = function (t, e, n, r) { if (n) { var s = t[e] = i.once(function () { r(e, s), n.apply(this, arguments); }); s._callback = n; } return t; }; a.trigger = function (t) {
        if (!this._events)
            return this; for (var e = Math.max(0, arguments.length - 1), i = Array(e), n = 0; n < e; n++)
            i[n] = arguments[n + 1]; return u(v, this._events, t, void 0, i), this;
    }; var v = function (t, e, i, n) { if (t) { const r = t[e]; let s = t.all; r && s && (s = s.slice()), r && p(r, n), s && p(s, [e].concat(n)); } return t; }; var p = function (t, e) {
        let i; let n = -1; const r = t.length; const s = e[0]; const a = e[1]; const o = e[2]; switch (e.length) {
            case 0: for (;++n < r;)
                (i = t[n]).callback.call(i.ctx); return; case 1: for (;++n < r;)
                (i = t[n]).callback.call(i.ctx, s); return; case 2: for (;++n < r;)
                (i = t[n]).callback.call(i.ctx, s, a); return; case 3: for (;++n < r;)
                (i = t[n]).callback.call(i.ctx, s, a, o); return; default: for (;++n < r;)
                (i = t[n]).callback.apply(i.ctx, e);
        }
    }; var g = function (t, e) { this.id = t._listenId, this.listener = t, this.obj = e, this.interop = !0, this.count = 0, this._events = void 0; }; g.prototype.on = a.on, g.prototype.off = function (t, e) { (this.interop ? (this._events = u(f, this._events, t, e, { context: void 0, listeners: void 0 }), this._events) : (this.count--, this.count !== 0)) || this.cleanup(); }, g.prototype.cleanup = function () { delete this.listener._listeningTo[this.obj._listenId], this.interop || delete this.obj._listeners[this.id]; }, a.bind = a.on, a.unbind = a.off, i.extend(e, a); const m = e.Model = function (t, e) { let n = t || {}; e || (e = {}), this.preinitialize.apply(this, arguments), this.cid = i.uniqueId(this.cidPrefix), this.attributes = {}, e.collection && (this.collection = e.collection), e.parse && (n = this.parse(n, e) || {}); const r = i.result(this, 'defaults'); n = i.defaults(i.extend({}, r, n), r), this.set(n, e), this.changed = {}, this.initialize.apply(this, arguments); }; i.extend(m.prototype, a, { changed: null, validationError: null, idAttribute: 'id', cidPrefix: 'c', preinitialize() {}, initialize() {}, toJSON(t) { return i.clone(this.attributes); }, sync() { return e.sync.apply(this, arguments); }, get(t) { return this.attributes[t]; }, escape(t) { return i.escape(this.get(t)); }, has(t) { return this.get(t) != null; }, matches(t) { return !!i.iteratee(t, this)(this.attributes); }, set(t, e, n) {
        if (t == null)
            return this; let r; if (typeof t === 'object' ? (r = t, n = e) : (r = {})[t] = e, n || (n = {}), !this._validate(r, n))
            return !1; const s = n.unset; const a = n.silent; const o = []; const h = this._changing; this._changing = !0, h || (this._previousAttributes = i.clone(this.attributes), this.changed = {}); const u = this.attributes; const l = this.changed; const c = this._previousAttributes; for (const f in r)
            e = r[f], i.isEqual(u[f], e) || o.push(f), i.isEqual(c[f], e) ? delete l[f] : l[f] = e, s ? delete u[f] : u[f] = e; if (this.idAttribute in r && (this.id = this.get(this.idAttribute)), !a) {
            o.length && (this._pending = n); for (let d = 0; d < o.length; d++)
                this.trigger('change:' + o[d], this, u[o[d]], n);
        } if (h)
            return this; if (!a)
            for (;this._pending;)
                n = this._pending, this._pending = !1, this.trigger('change', this, n); return this._pending = !1, this._changing = !1, this;
    }, unset(t, e) { return this.set(t, void 0, i.extend({}, e, { unset: !0 })); }, clear(t) {
        const e = {}; for (const n in this.attributes)
            e[n] = void 0; return this.set(e, i.extend({}, t, { unset: !0 }));
    }, hasChanged(t) { return t == null ? !i.isEmpty(this.changed) : i.has(this.changed, t); }, changedAttributes(t) {
        if (!t)
            return !!this.hasChanged() && i.clone(this.changed); let r; const e = this._changing ? this._previousAttributes : this.attributes; const n = {}; for (const s in t) { const a = t[s]; i.isEqual(e[s], a) || (n[s] = a, r = !0); } return !!r && n;
    }, previous(t) { return t != null && this._previousAttributes ? this._previousAttributes[t] : null; }, previousAttributes() { return i.clone(this._previousAttributes); }, fetch(t) {
        t = i.extend({ parse: !0 }, t); const e = this; const n = t.success; return t.success = function (i) {
            const r = t.parse ? e.parse(i, t) : i; if (!e.set(r, t))
                return !1; n && n.call(t.context, e, i, t), e.trigger('sync', e, i, t);
        }, G(this, t), this.sync('read', this, t);
    }, save(t, e, n) {
        let r; t == null || typeof t === 'object' ? (r = t, n = e) : (r = {})[t] = e; const s = (n = i.extend({ validate: !0, parse: !0 }, n)).wait; if (r && !s) {
            if (!this.set(r, n))
                return !1;
        } else if (!this._validate(r, n))
            return !1; const a = this; const o = n.success; const h = this.attributes; n.success = function (t) {
            a.attributes = h; let e = n.parse ? a.parse(t, n) : t; if (s && (e = i.extend({}, r, e)), e && !a.set(e, n))
                return !1; o && o.call(n.context, a, t, n), a.trigger('sync', a, t, n);
        }, G(this, n), r && s && (this.attributes = i.extend({}, h, r)); const u = this.isNew() ? 'create' : n.patch ? 'patch' : 'update'; u != 'patch' || n.attrs || (n.attrs = r); const l = this.sync(u, this, n); return this.attributes = h, l;
    }, destroy(t) { t = t ? i.clone(t) : {}; function s() { e.stopListening(), e.trigger('destroy', e, e.collection, t); } var e = this; const n = t.success; const r = t.wait; let a = !(t.success = function (i) { r && s(), n && n.call(t.context, e, i, t), e.isNew() || e.trigger('sync', e, i, t); }); return this.isNew() ? i.defer(t.success) : (G(this, t), a = this.sync('delete', this, t)), r || s(), a; }, url() {
        const t = i.result(this, 'urlRoot') || i.result(this.collection, 'url') || V(); if (this.isNew())
            return t; const e = this.get(this.idAttribute); return t.replace(/[^\/]$/, '$&/') + encodeURIComponent(e);
    }, parse(t, e) { return t; }, clone() { return new this.constructor(this.attributes); }, isNew() { return !this.has(this.idAttribute); }, isValid(t) { return this._validate({}, i.extend({}, t, { validate: !0 })); }, _validate(t, e) {
        if (!e.validate || !this.validate)
            return !0; t = i.extend({}, this.attributes, t); const n = this.validationError = this.validate(t, e) || null; return !n || (this.trigger('invalid', this, n, i.extend(e, { validationError: n })), !1);
    } }); function x(t, e, i) {
        i = Math.min(Math.max(i, 0), t.length); let s; const n = Array(t.length - i); const r = e.length; for (s = 0; s < n.length; s++)
            n[s] = t[s + i]; for (s = 0; s < r; s++)
            t[s + i] = e[s]; for (s = 0; s < n.length; s++)
            t[s + r + i] = n[s];
    } const _ = e.Collection = function (t, e) { e || (e = {}), this.preinitialize.apply(this, arguments), e.model && (this.model = e.model), void 0 !== e.comparator && (this.comparator = e.comparator), this._reset(), this.initialize.apply(this, arguments), t && this.reset(t, i.extend({ silent: !0 }, e)); }; const y = { add: !0, remove: !0, merge: !0 }; const b = { add: !0, remove: !1 }; i.extend(_.prototype, a, { model: m, preinitialize() {}, initialize() {}, toJSON(t) { return this.map((e) => e.toJSON(t)); }, sync() { return e.sync.apply(this, arguments); }, add(t, e) { return this.set(t, i.extend({ merge: !1 }, e, b)); }, remove(t, e) { e = i.extend({}, e); const n = !i.isArray(t); t = n ? [t] : t.slice(); const r = this._removeModels(t, e); return !e.silent && r.length && (e.changes = { added: [], merged: [], removed: r }, this.trigger('update', this, e)), n ? r[0] : r; }, set(t, e) {
        if (t != null) {
            (e = i.extend({}, y, e)).parse && !this._isModel(t) && (t = this.parse(t, e) || []); const n = !i.isArray(t); t = n ? [t] : t.slice(); let r = e.at; r != null && (r = +r), r > this.length && (r = this.length), r < 0 && (r += this.length + 1); let g; let m; const s = []; const a = []; const o = []; const h = []; const u = {}; const l = e.add; const c = e.merge; const f = e.remove; let d = !1; const v = this.comparator && r == null && !1 !== e.sort; const p = i.isString(this.comparator) ? this.comparator : null; for (m = 0; m < t.length; m++) {
                g = t[m]; const _ = this.get(g); if (_) { if (c && g !== _) { let b = this._isModel(g) ? g.attributes : g; e.parse && (b = _.parse(b, e)), _.set(b, e), o.push(_), v && !d && (d = _.hasChanged(p)); }u[_.cid] || (u[_.cid] = !0, s.push(_)), t[m] = _; } else
                    l && (g = t[m] = this._prepareModel(g, e)) && (a.push(g), this._addReference(g, e), u[g.cid] = !0, s.push(g));
            } if (f) {
                for (m = 0; m < this.length; m++)
                    u[(g = this.models[m]).cid] || h.push(g); h.length && this._removeModels(h, e);
            } let w = !1; const E = !v && l && f; if (s.length && E ? (w = this.length !== s.length || i.some(this.models, (t, e) => t !== s[e]), this.models.length = 0, x(this.models, s, 0), this.length = this.models.length) : a.length && (v && (d = !0), x(this.models, a, r == null ? this.length : r), this.length = this.models.length), d && this.sort({ silent: !0 }), !e.silent) {
                for (m = 0; m < a.length; m++)
                    r != null && (e.index = r + m), (g = a[m]).trigger('add', g, this, e); (d || w) && this.trigger('sort', this, e), (a.length || h.length || o.length) && (e.changes = { added: a, removed: h, merged: o }, this.trigger('update', this, e));
            } return n ? t[0] : t;
        }
    }, reset(t, e) {
        e = e ? i.clone(e) : {}; for (let n = 0; n < this.models.length; n++)
            this._removeReference(this.models[n], e); return e.previousModels = this.models, this._reset(), t = this.add(t, i.extend({ silent: !0 }, e)), e.silent || this.trigger('reset', this, e), t;
    }, push(t, e) { return this.add(t, i.extend({ at: this.length }, e)); }, pop(t) { const e = this.at(this.length - 1); return this.remove(e, t); }, unshift(t, e) { return this.add(t, i.extend({ at: 0 }, e)); }, shift(t) { const e = this.at(0); return this.remove(e, t); }, slice() { return s.apply(this.models, arguments); }, get(t) {
        if (t != null)
            return this._byId[t] || this._byId[this.modelId(this._isModel(t) ? t.attributes : t)] || t.cid && this._byId[t.cid];
    }, has(t) { return this.get(t) != null; }, at(t) { return t < 0 && (t += this.length), this.models[t]; }, where(t, e) { return this[e ? 'find' : 'filter'](t); }, findWhere(t) { return this.where(t, !0); }, sort(t) {
        let e = this.comparator; if (!e)
            throw new Error('Cannot sort a set without a comparator'); t || (t = {}); const n = e.length; return i.isFunction(e) && (e = e.bind(this)), n === 1 || i.isString(e) ? this.models = this.sortBy(e) : this.models.sort(e), t.silent || this.trigger('sort', this, t), this;
    }, pluck(t) { return this.map(t + ''); }, fetch(t) { const e = (t = i.extend({ parse: !0 }, t)).success; const n = this; return t.success = function (i) { const r = t.reset ? 'reset' : 'set'; n[r](i, t), e && e.call(t.context, n, i, t), n.trigger('sync', n, i, t); }, G(this, t), this.sync('read', this, t); }, create(t, e) {
        const n = (e = e ? i.clone(e) : {}).wait; if (!(t = this._prepareModel(t, e)))
            return !1; n || this.add(t, e); const r = this; const s = e.success; return e.success = function (t, e, i) { n && r.add(t, i), s && s.call(i.context, t, e, i); }, t.save(null, e), t;
    }, parse(t, e) { return t; }, clone() { return new this.constructor(this.models, { model: this.model, comparator: this.comparator }); }, modelId(t) { return t[this.model.prototype.idAttribute || 'id']; }, values() { return new E(this, k); }, keys() { return new E(this, I); }, entries() { return new E(this, S); }, _reset() { this.length = 0, this.models = [], this._byId = {}; }, _prepareModel(t, e) {
        if (this._isModel(t))
            return t.collection || (t.collection = this), t; const n = new (((e = e ? i.clone(e) : {}).collection = this).model)(t, e); return n.validationError ? (this.trigger('invalid', this, n.validationError, e), !1) : n;
    }, _removeModels(t, e) { for (var i = [], n = 0; n < t.length; n++) { const r = this.get(t[n]); if (r) { const s = this.indexOf(r); this.models.splice(s, 1), this.length--, delete this._byId[r.cid]; const a = this.modelId(r.attributes); a != null && delete this._byId[a], e.silent || (e.index = s, r.trigger('remove', r, this, e)), i.push(r), this._removeReference(r, e); } } return i; }, _isModel(t) { return t instanceof m; }, _addReference(t, e) { this._byId[t.cid] = t; const i = this.modelId(t.attributes); i != null && (this._byId[i] = t), t.on('all', this._onModelEvent, this); }, _removeReference(t, e) { delete this._byId[t.cid]; const i = this.modelId(t.attributes); i != null && delete this._byId[i], this === t.collection && delete t.collection, t.off('all', this._onModelEvent, this); }, _onModelEvent(t, e, i, n) {
        if (e) {
            if ((t === 'add' || t === 'remove') && i !== this)
                return; if (t === 'destroy' && this.remove(e, n), t === 'change') { const r = this.modelId(e.previousAttributes()); const s = this.modelId(e.attributes); r !== s && (r != null && delete this._byId[r], s != null && (this._byId[s] = e)); }
        } this.trigger.apply(this, arguments);
    } }); const w = typeof Symbol === 'function' && Symbol.iterator; w && (_.prototype[w] = _.prototype.values); var E = function (t, e) { this._collection = t, this._kind = e, this._index = 0; }; var k = 1; var I = 2; var S = 3; w && (E.prototype[w] = function () { return this; }), E.prototype.next = function () {
        if (this._collection) {
            if (this._index < this._collection.length) {
                let e; const t = this._collection.at(this._index); if (this._index++, this._kind === k)
                    e = t; else { const i = this._collection.modelId(t.attributes); e = this._kind === I ? i : [i, t]; } return { value: e, done: !1 };
            } this._collection = void 0;
        } return { value: void 0, done: !0 };
    }; const T = e.View = function (t) { this.cid = i.uniqueId('view'), this.preinitialize.apply(this, arguments), i.extend(this, i.pick(t, H)), this._ensureElement(), this.initialize.apply(this, arguments); }; const P = /^(\S+)\s*(.*)$/; var H = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events']; i.extend(T.prototype, a, { tagName: 'div', $(t) { return this.$el.find(t); }, preinitialize() {}, initialize() {}, render() { return this; }, remove() { return this._removeElement(), this.stopListening(), this; }, _removeElement() { this.$el.remove(); }, setElement(t) { return this.undelegateEvents(), this._setElement(t), this.delegateEvents(), this; }, _setElement(t) { this.$el = t instanceof e.$ ? t : e.$(t), this.el = this.$el[0]; }, delegateEvents(t) {
        if (t || (t = i.result(this, 'events')), !t)
            return this; for (const e in this.undelegateEvents(), t) { let n = t[e]; if (i.isFunction(n) || (n = this[n]), n) { const r = e.match(P); this.delegate(r[1], r[2], n.bind(this)); } } return this;
    }, delegate(t, e, i) { return this.$el.on(t + '.delegateEvents' + this.cid, e, i), this; }, undelegateEvents() { return this.$el && this.$el.off('.delegateEvents' + this.cid), this; }, undelegate(t, e, i) { return this.$el.off(t + '.delegateEvents' + this.cid, e, i), this; }, _createElement(t) { return document.createElement(t); }, _ensureElement() {
        if (this.el)
            this.setElement(i.result(this, 'el')); else { const t = i.extend({}, i.result(this, 'attributes')); this.id && (t.id = i.result(this, 'id')), this.className && (t.class = i.result(this, 'className')), this.setElement(this._createElement(i.result(this, 'tagName'))), this._setAttributes(t); }
    }, _setAttributes(t) { this.$el.attr(t); } }); function A(t, e, n, r) { i.each(n, (i, n) => { e[n] && (t.prototype[n] = (function (t, e, i, n) { switch (e) { case 1: return function () { return t[i](this[n]); }; case 2: return function (e) { return t[i](this[n], e); }; case 3: return function (e, r) { return t[i](this[n], C(e, this), r); }; case 4: return function (e, r, s) { return t[i](this[n], C(e, this), r, s); }; default: return function () { const e = s.call(arguments); return e.unshift(this[n]), t[i].apply(t, e); }; } })(e, i, n, r)); }); } var C = function (t, e) { return i.isFunction(t) ? t : i.isObject(t) && !e._isModel(t) ? R(t) : i.isString(t) ? function (e) { return e.get(t); } : t; }; var R = function (t) { const e = i.matches(t); return function (t) { return e(t.attributes); }; }; i.each([[_, { forEach: 3, each: 3, map: 3, collect: 3, reduce: 0, foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3, select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3, contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3, head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3, without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3, isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3, sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3 }, 'models'], [m, { keys: 1, values: 1, pairs: 1, invert: 1, pick: 0, omit: 0, chain: 1, isEmpty: 1 }, 'attributes']], (t) => { const e = t[0]; const n = t[1]; const r = t[2]; e.mixin = function (t) { const n = i.reduce(i.functions(t), (t, e) => t[e] = 0, t, {}); A(e, t, n, r); }, A(e, i, n, r); }), e.sync = function (t, n, r) {
        const s = j[t]; i.defaults(r || (r = {}), { emulateHTTP: e.emulateHTTP, emulateJSON: e.emulateJSON }); const a = { type: s, dataType: 'json' }; if (r.url || (a.url = i.result(n, 'url') || V()), r.data != null || !n || t !== 'create' && t !== 'update' && t !== 'patch' || (a.contentType = 'application/json', a.data = JSON.stringify(r.attrs || n.toJSON(r))), r.emulateJSON && (a.contentType = 'application/x-www-form-urlencoded', a.data = a.data ? { model: a.data } : {}), r.emulateHTTP && (s === 'PUT' || s === 'DELETE' || s === 'PATCH')) {
            a.type = 'POST', r.emulateJSON && (a.data._method = s); const o = r.beforeSend; r.beforeSend = function (t) {
                if (t.setRequestHeader('X-HTTP-Method-Override', s), o)
                    return o.apply(this, arguments);
            };
        }a.type === 'GET' || r.emulateJSON || (a.processData = !1); const h = r.error; r.error = function (t, e, i) { r.textStatus = e, r.errorThrown = i, h && h.call(r.context, t, e, i); }; const u = r.xhr = e.ajax(i.extend(a, r)); return n.trigger('request', n, u, r), u;
    }; var j = { create: 'POST', update: 'PUT', patch: 'PATCH', delete: 'DELETE', read: 'GET' }; e.ajax = function () { return e.$.ajax.apply(e.$, arguments); }; const O = e.Router = function (t) { t || (t = {}), this.preinitialize.apply(this, arguments), t.routes && (this.routes = t.routes), this._bindRoutes(), this.initialize.apply(this, arguments); }; const U = /\((.*?)\)/g; const z = /(\(\?)?:\w+/g; const q = /\*\w+/g; const F = /[\-{}\[\]+?.,\\\^$|#\s]/g; i.extend(O.prototype, a, { preinitialize() {}, initialize() {}, route(t, n, r) { i.isRegExp(t) || (t = this._routeToRegExp(t)), i.isFunction(n) && (r = n, n = ''), r || (r = this[n]); const s = this; return e.history.route(t, (i) => { const a = s._extractParameters(t, i); !1 !== s.execute(r, a, n) && (s.trigger.apply(s, ['route:' + n].concat(a)), s.trigger('route', n, a), e.history.trigger('route', s, n, a)); }), this; }, execute(t, e, i) { t && t.apply(this, e); }, navigate(t, i) { return e.history.navigate(t, i), this; }, _bindRoutes() {
        if (this.routes) {
            this.routes = i.result(this, 'routes'); for (var t, e = i.keys(this.routes); (t = e.pop()) != null;)
                this.route(t, this.routes[t]);
        }
    }, _routeToRegExp(t) { return t = t.replace(F, '\\$&').replace(U, '(?:$1)?').replace(z, (t, e) => e ? t : '([^/?]+)').replace(q, '([^?]*?)'), new RegExp('^' + t + '(?:\\?([\\s\\S]*))?$'); }, _extractParameters(t, e) { const n = t.exec(e).slice(1); return i.map(n, (t, e) => e === n.length - 1 ? t || null : t ? decodeURIComponent(t) : null); } }); const B = e.History = function () { this.handlers = [], this.checkUrl = this.checkUrl.bind(this), typeof window !== 'undefined' && (this.location = window.location, this.history = window.history); }; const J = /^[#\/]|\s+$/g; const L = /^\/+|\/+$/g; const W = /#.*$/; B.started = !1, i.extend(B.prototype, a, { interval: 50, atRoot() { return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root && !this.getSearch(); }, matchRoot() { return this.decodeFragment(this.location.pathname).slice(0, this.root.length - 1) + '/' === this.root; }, decodeFragment(t) { return decodeURI(t.replace(/%25/g, '%2525')); }, getSearch() { const t = this.location.href.replace(/#.*/, '').match(/\?.+/); return t ? t[0] : ''; }, getHash(t) { const e = (t || this).location.href.match(/#(.*)$/); return e ? e[1] : ''; }, getPath() { const t = this.decodeFragment(this.location.pathname + this.getSearch()).slice(this.root.length - 1); return t.charAt(0) === '/' ? t.slice(1) : t; }, getFragment(t) { return t == null && (t = this._usePushState || !this._wantsHashChange ? this.getPath() : this.getHash()), t.replace(J, ''); }, start(t) {
        if (B.started)
            throw new Error('Backbone.history has already been started'); if (B.started = !0, this.options = i.extend({ root: '/' }, this.options, t), this.root = this.options.root, this._wantsHashChange = !1 !== this.options.hashChange, this._hasHashChange = 'onhashchange' in window && (void 0 === document.documentMode || document.documentMode > 7), this._useHashChange = this._wantsHashChange && this._hasHashChange, this._wantsPushState = !!this.options.pushState, this._hasPushState = !(!this.history || !this.history.pushState), this._usePushState = this._wantsPushState && this._hasPushState, this.fragment = this.getFragment(), this.root = ('/' + this.root + '/').replace(L, '/'), this._wantsHashChange && this._wantsPushState) { if (!this._hasPushState && !this.atRoot()) { const e = this.root.slice(0, -1) || '/'; return this.location.replace(e + '#' + this.getPath()), !0; } this._hasPushState && this.atRoot() && this.navigate(this.getHash(), { replace: !0 }); } if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) { this.iframe = document.createElement('iframe'), this.iframe.src = 'javascript:0', this.iframe.style.display = 'none', this.iframe.tabIndex = -1; const n = document.body; const r = n.insertBefore(this.iframe, n.firstChild).contentWindow; r.document.open(), r.document.close(), r.location.hash = '#' + this.fragment; } const s = window.addEventListener || function (t, e) { return attachEvent('on' + t, e); }; if (this._usePushState ? s('popstate', this.checkUrl, !1) : this._useHashChange && !this.iframe ? s('hashchange', this.checkUrl, !1) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), !this.options.silent)
            return this.loadUrl();
    }, stop() { const t = window.removeEventListener || function (t, e) { return detachEvent('on' + t, e); }; this._usePushState ? t('popstate', this.checkUrl, !1) : this._useHashChange && !this.iframe && t('hashchange', this.checkUrl, !1), this.iframe && (document.body.removeChild(this.iframe), this.iframe = null), this._checkUrlInterval && clearInterval(this._checkUrlInterval), B.started = !1; }, route(t, e) { this.handlers.unshift({ route: t, callback: e }); }, checkUrl(t) {
        let e = this.getFragment(); if (e === this.fragment && this.iframe && (e = this.getHash(this.iframe.contentWindow)), e === this.fragment)
            return !1; this.iframe && this.navigate(e), this.loadUrl();
    }, loadUrl(t) {
        return !!this.matchRoot() && (t = this.fragment = this.getFragment(t), i.some(this.handlers, (e) => {
            if (e.route.test(t))
                return e.callback(t), !0;
        }));
    }, navigate(t, e) {
        if (!B.started)
            return !1; e && !0 !== e || (e = { trigger: !!e }), t = this.getFragment(t || ''); let i = this.root; t !== '' && t.charAt(0) !== '?' || (i = i.slice(0, -1) || '/'); const n = i + t; t = t.replace(W, ''); const r = this.decodeFragment(t); if (this.fragment !== r) {
            if (this.fragment = r, this._usePushState)
                this.history[e.replace ? 'replaceState' : 'pushState']({}, document.title, n); else {
                if (!this._wantsHashChange)
                    return this.location.assign(n); if (this._updateHash(this.location, t, e.replace), this.iframe && t !== this.getHash(this.iframe.contentWindow)) { const s = this.iframe.contentWindow; e.replace || (s.document.open(), s.document.close()), this._updateHash(s.location, t, e.replace); }
            } return e.trigger ? this.loadUrl(t) : void 0;
        }
    }, _updateHash(t, e, i) {
        if (i) { const n = t.href.replace(/(javascript:|#).*$/, ''); t.replace(n + '#' + e); } else
            t.hash = '#' + e;
    } }), e.history = new B(); m.extend = _.extend = O.extend = T.extend = B.extend = function (t, e) { let r; const n = this; return r = t && i.has(t, 'constructor') ? t.constructor : function () { return n.apply(this, arguments); }, i.extend(r, n, e), r.prototype = i.create(n.prototype, t), (r.prototype.constructor = r).__super__ = n.prototype, r; }; var V = function () { throw new Error('A "url" property or function must be specified'); }; var G = function (t, e) { const i = e.error; e.error = function (n) { i && i.call(e.context, t, n, e), t.trigger('error', t, n, e); }; }; return e;
}), (function () {
    var e = function (t) { const r = new e.Builder(); return r.pipeline.add(e.trimmer, e.stopWordFilter, e.stemmer), r.searchPipeline.add(e.stemmer), t.call(r, r), r.build(); }; e.version = '2.3.7', e.utils = {}, e.utils.warn = (function (e) { return function (t) { e.console && console.warn && console.warn(t); }; })(this), e.utils.asString = function (e) { return e == null ? '' : e.toString(); }, e.utils.clone = function (e) {
        if (e == null)
            return e; for (var t = Object.create(null), r = Object.keys(e), i = 0; i < r.length; i++) {
            const n = r[i]; const s = e[n]; if (Array.isArray(s))
                t[n] = s.slice(); else {
                if (typeof s !== 'string' && typeof s !== 'number' && typeof s !== 'boolean')
                    throw new TypeError('clone is not deep and does not support nested objects'); t[n] = s;
            }
        } return t;
    }, e.FieldRef = function (e, t, r) { this.docRef = e, this.fieldName = t, this._stringValue = r; }, e.FieldRef.joiner = '/', e.FieldRef.fromString = function (t) {
        const r = t.indexOf(e.FieldRef.joiner); if (r === -1)
            throw 'malformed field ref string'; const i = t.slice(0, r); const n = t.slice(r + 1); return new e.FieldRef(n, i, t);
    }, e.FieldRef.prototype.toString = function () { return this._stringValue == null && (this._stringValue = this.fieldName + e.FieldRef.joiner + this.docRef), this._stringValue; }, e.Set = function (e) {
        if (this.elements = Object.create(null), e) {
            this.length = e.length; for (let t = 0; t < this.length; t++)
                this.elements[e[t]] = !0;
        } else
            this.length = 0;
    }, e.Set.complete = { intersect(e) { return e; }, union(e) { return e; }, contains() { return !0; } }, e.Set.empty = { intersect() { return this; }, union(e) { return e; }, contains() { return !1; } }, e.Set.prototype.contains = function (e) { return !!this.elements[e]; }, e.Set.prototype.intersect = function (t) {
        let r; let i; let n; const s = []; if (t === e.Set.complete)
            return this; if (t === e.Set.empty)
            return t; i = this.length < t.length ? (r = this, t) : (r = t, this), n = Object.keys(r.elements); for (let o = 0; o < n.length; o++) { const a = n[o]; a in i.elements && s.push(a); } return new e.Set(s);
    }, e.Set.prototype.union = function (t) { return t === e.Set.complete ? e.Set.complete : t === e.Set.empty ? this : new e.Set(Object.keys(this.elements).concat(Object.keys(t.elements))); }, e.idf = function (e, t) {
        let r = 0; for (const i in e)
            i != '_index' && (r += Object.keys(e[i]).length); const n = (t - r + 0.5) / (r + 0.5); return Math.log(1 + Math.abs(n));
    }, e.Token = function (e, t) { this.str = e || '', this.metadata = t || {}; }, e.Token.prototype.toString = function () { return this.str; }, e.Token.prototype.update = function (e) { return this.str = e(this.str, this.metadata), this; }, e.Token.prototype.clone = function (t) { return t = t || function (e) { return e; }, new e.Token(t(this.str, this.metadata), this.metadata); }, e.tokenizer = function (t, r) {
        if (t == null || t == null)
            return []; if (Array.isArray(t))
            return t.map((t) => new e.Token(e.utils.asString(t).toLowerCase(), e.utils.clone(r))); for (var i = t.toString().toLowerCase(), n = i.length, s = [], o = 0, a = 0; o <= n; o++) { const l = o - a; if (i.charAt(o).match(e.tokenizer.separator) || o == n) { if (l > 0) { const c = e.utils.clone(r) || {}; c.position = [a, l], c.index = s.length, s.push(new e.Token(i.slice(a, o), c)); }a = o + 1; } } return s;
    }, e.tokenizer.separator = /[\s\-]+/, e.Pipeline = function () { this._stack = []; }, e.Pipeline.registeredFunctions = Object.create(null), e.Pipeline.registerFunction = function (t, r) { r in this.registeredFunctions && e.utils.warn('Overwriting existing registered function: ' + r), t.label = r, e.Pipeline.registeredFunctions[t.label] = t; }, e.Pipeline.warnIfFunctionNotRegistered = function (t) { t.label && t.label in this.registeredFunctions || e.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', t); }, e.Pipeline.load = function (t) {
        const r = new e.Pipeline(); return t.forEach((t) => {
            const i = e.Pipeline.registeredFunctions[t]; if (!i)
                throw new Error('Cannot load unregistered function: ' + t); r.add(i);
        }), r;
    }, e.Pipeline.prototype.add = function () { Array.prototype.slice.call(arguments).forEach(function (t) { e.Pipeline.warnIfFunctionNotRegistered(t), this._stack.push(t); }, this); }, e.Pipeline.prototype.after = function (t, r) {
        e.Pipeline.warnIfFunctionNotRegistered(r); let i = this._stack.indexOf(t); if (i == -1)
            throw new Error('Cannot find existingFn'); i += 1, this._stack.splice(i, 0, r);
    }, e.Pipeline.prototype.before = function (t, r) {
        e.Pipeline.warnIfFunctionNotRegistered(r); const i = this._stack.indexOf(t); if (i == -1)
            throw new Error('Cannot find existingFn'); this._stack.splice(i, 0, r);
    }, e.Pipeline.prototype.remove = function (e) { const t = this._stack.indexOf(e); t != -1 && this._stack.splice(t, 1); }, e.Pipeline.prototype.run = function (e) {
        for (let t = this._stack.length, r = 0; r < t; r++) {
            for (var i = this._stack[r], n = [], s = 0; s < e.length; s++) {
                const o = i(e[s], s, e); if (o != null && o !== '')
                    if (Array.isArray(o))
                        for (let a = 0; a < o.length; a++)
                            n.push(o[a]); else
                        n.push(o);
            }e = n;
        } return e;
    }, e.Pipeline.prototype.runString = function (t, r) { const i = new e.Token(t, r); return this.run([i]).map((e) => e.toString()); }, e.Pipeline.prototype.reset = function () { this._stack = []; }, e.Pipeline.prototype.toJSON = function () { return this._stack.map((t) => e.Pipeline.warnIfFunctionNotRegistered(t), t.label); }, e.Vector = function (e) { this._magnitude = 0, this.elements = e || []; }, e.Vector.prototype.positionForIndex = function (e) {
        if (this.elements.length == 0)
            return 0; for (var t = 0, r = this.elements.length / 2, i = r - t, n = Math.floor(i / 2), s = this.elements[2 * n]; i > 1 && (s < e && (t = n), e < s && (r = n), s != e);)
            i = r - t, n = t + Math.floor(i / 2), s = this.elements[2 * n]; return s == e ? 2 * n : e < s ? 2 * n : s < e ? 2 * (n + 1) : void 0;
    }, e.Vector.prototype.insert = function (e, t) { this.upsert(e, t, () => { throw 'duplicate index'; }); }, e.Vector.prototype.upsert = function (e, t, r) { this._magnitude = 0; const i = this.positionForIndex(e); this.elements[i] == e ? this.elements[i + 1] = r(this.elements[i + 1], t) : this.elements.splice(i, 0, e, t); }, e.Vector.prototype.magnitude = function () {
        if (this._magnitude)
            return this._magnitude; for (var e = 0, t = this.elements.length, r = 1; r < t; r += 2) { const i = this.elements[r]; e += i * i; } return this._magnitude = Math.sqrt(e);
    }, e.Vector.prototype.dot = function (e) {
        for (var t = 0, r = this.elements, i = e.elements, n = r.length, s = i.length, o = 0, a = 0, u = 0, l = 0; u < n && l < s;)
            (o = r[u]) < (a = i[l]) ? u += 2 : a < o ? l += 2 : o == a && (t += r[u + 1] * i[l + 1], u += 2, l += 2); return t;
    }, e.Vector.prototype.similarity = function (e) { return this.dot(e) / this.magnitude() || 0; }, e.Vector.prototype.toArray = function () {
        for (var e = new Array(this.elements.length / 2), t = 1, r = 0; t < this.elements.length; t += 2, r++)
            e[r] = this.elements[t]; return e;
    }, e.Vector.prototype.toJSON = function () { return this.elements; }, e.stemmer = (function () {
        const e = { ational: 'ate', tional: 'tion', enci: 'ence', anci: 'ance', izer: 'ize', bli: 'ble', alli: 'al', entli: 'ent', eli: 'e', ousli: 'ous', ization: 'ize', ation: 'ate', ator: 'ate', alism: 'al', iveness: 'ive', fulness: 'ful', ousness: 'ous', aliti: 'al', iviti: 'ive', biliti: 'ble', logi: 'log' }; const t = { icate: 'ic', ative: '', alize: 'al', iciti: 'ic', ical: 'ic', ful: '', ness: '' }; const i = '[aeiouy]'; const n = '[^aeiou][^aeiouy]*'; const c = new RegExp('^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*'); const h = new RegExp('^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*[aeiouy][aeiou]*[^aeiou][^aeiouy]*'); const d = new RegExp('^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*([aeiouy][aeiou]*)?$'); const f = new RegExp('^([^aeiou][^aeiouy]*)?[aeiouy]'); const p = /^(.+?)(ss|i)es$/; const y = /^(.+?)([^s])s$/; const m = /^(.+?)eed$/; const v = /^(.+?)(ed|ing)$/; const g = /.$/; const x = /(at|bl|iz)$/; const w = new RegExp('([^aeiouylsz])\\1$'); const Q = new RegExp('^' + n + i + '[^aeiouwxy]$'); const k = /^(.+?[^aeiou])y$/; const S = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/; const E = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/; const L = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/; const b = /^(.+?)(s|t)(ion)$/; const P = /^(.+?)e$/; const T = /ll$/; const O = new RegExp('^' + n + i + '[^aeiouwxy]$'); const I = function (r) {
            let i; let n; let s; let o; let a; let u; let l; if (r.length < 3)
                return r; if ((s = r.substr(0, 1)) == 'y' && (r = s.toUpperCase() + r.substr(1)), a = y, (o = p).test(r) ? r = r.replace(o, '$1$2') : a.test(r) && (r = r.replace(a, '$1$2')), a = v, (o = m).test(r)) { var I = o.exec(r); (o = c).test(I[1]) && (o = g, r = r.replace(o, '')); } else if (a.test(r)) { i = (I = a.exec(r))[1], (a = f).test(i) && (u = w, l = Q, (a = x).test(r = i) ? r += 'e' : u.test(r) ? (o = g, r = r.replace(o, '')) : l.test(r) && (r += 'e')); }(o = k).test(r) && (r = (i = (I = o.exec(r))[1]) + 'i'); (o = S).test(r) && (i = (I = o.exec(r))[1], n = I[2], (o = c).test(i) && (r = i + e[n])); (o = E).test(r) && (i = (I = o.exec(r))[1], n = I[2], (o = c).test(i) && (r = i + t[n])); if (a = b, (o = L).test(r))
                i = (I = o.exec(r))[1], (o = h).test(i) && (r = i); else if (a.test(r)) { i = (I = a.exec(r))[1] + I[2], (a = h).test(i) && (r = i); }(o = P).test(r) && (i = (I = o.exec(r))[1], a = d, u = O, ((o = h).test(i) || a.test(i) && !u.test(i)) && (r = i)); return a = h, (o = T).test(r) && a.test(r) && (o = g, r = r.replace(o, '')), s == 'y' && (r = s.toLowerCase() + r.substr(1)), r;
        }; return function (e) { return e.update(I); };
    })(), e.Pipeline.registerFunction(e.stemmer, 'stemmer'), e.generateStopWordFilter = function (e) {
        const t = e.reduce((e, t) => e[t] = t, e, {}); return function (e) {
            if (e && t[e.toString()] !== e.toString())
                return e;
        };
    }, e.stopWordFilter = e.generateStopWordFilter(['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your']), e.Pipeline.registerFunction(e.stopWordFilter, 'stopWordFilter'), e.trimmer = function (e) { return e.update((e) => e.replace(/^\W+/, '').replace(/\W+$/, '')); }, e.Pipeline.registerFunction(e.trimmer, 'trimmer'), e.TokenSet = function () { this.final = !1, this.edges = {}, this.id = e.TokenSet._nextId, e.TokenSet._nextId += 1; }, e.TokenSet._nextId = 1, e.TokenSet.fromArray = function (t) {
        for (var r = new e.TokenSet.Builder(), i = 0, n = t.length; i < n; i++)
            r.insert(t[i]); return r.finish(), r.root;
    }, e.TokenSet.fromClause = function (t) { return 'editDistance' in t ? e.TokenSet.fromFuzzyString(t.term, t.editDistance) : e.TokenSet.fromString(t.term); }, e.TokenSet.fromFuzzyString = function (t, r) {
        for (var i = new e.TokenSet(), n = [{ node: i, editsRemaining: r, str: t }]; n.length;) {
            const s = n.pop(); if (s.str.length > 0) { var o; const a = s.str.charAt(0); a in s.node.edges ? o = s.node.edges[a] : (o = new e.TokenSet(), s.node.edges[a] = o), s.str.length == 1 && (o.final = !0), n.push({ node: o, editsRemaining: s.editsRemaining, str: s.str.slice(1) }); } if (s.editsRemaining != 0) {
                if ('*' in s.node.edges)
                    var u = s.node.edges['*']; else { u = new e.TokenSet(); s.node.edges['*'] = u; } if (s.str.length == 0 && (u.final = !0), n.push({ node: u, editsRemaining: s.editsRemaining - 1, str: s.str }), s.str.length > 1 && n.push({ node: s.node, editsRemaining: s.editsRemaining - 1, str: s.str.slice(1) }), s.str.length == 1 && (s.node.final = !0), s.str.length >= 1) {
                    if ('*' in s.node.edges)
                        var l = s.node.edges['*']; else { l = new e.TokenSet(); s.node.edges['*'] = l; }s.str.length == 1 && (l.final = !0), n.push({ node: l, editsRemaining: s.editsRemaining - 1, str: s.str.slice(1) });
                } if (s.str.length > 1) { var c; const h = s.str.charAt(0); const d = s.str.charAt(1); d in s.node.edges ? c = s.node.edges[d] : (c = new e.TokenSet(), s.node.edges[d] = c), s.str.length == 1 && (c.final = !0), n.push({ node: c, editsRemaining: s.editsRemaining - 1, str: h + s.str.slice(2) }); }
            }
        } return i;
    }, e.TokenSet.fromString = function (t) {
        for (var r = new e.TokenSet(), i = r, n = 0, s = t.length; n < s; n++) {
            const o = t[n]; const a = n == s - 1; if (o == '*')
                (r.edges[o] = r).final = a; else { const u = new e.TokenSet(); u.final = a, r.edges[o] = u, r = u; }
        } return i;
    }, e.TokenSet.prototype.toArray = function () { for (var e = [], t = [{ prefix: '', node: this }]; t.length;) { const r = t.pop(); const i = Object.keys(r.node.edges); const n = i.length; r.node.final && (r.prefix.charAt(0), e.push(r.prefix)); for (let s = 0; s < n; s++) { const o = i[s]; t.push({ prefix: r.prefix.concat(o), node: r.node.edges[o] }); } } return e; }, e.TokenSet.prototype.toString = function () {
        if (this._str)
            return this._str; for (var e = this.final ? '1' : '0', t = Object.keys(this.edges).sort(), r = t.length, i = 0; i < r; i++) { const n = t[i]; e = e + n + this.edges[n].id; } return e;
    }, e.TokenSet.prototype.intersect = function (t) {
        for (var r = new e.TokenSet(), i = void 0, n = [{ qNode: t, output: r, node: this }]; n.length;) {
            i = n.pop(); for (let s = Object.keys(i.qNode.edges), o = s.length, a = Object.keys(i.node.edges), u = a.length, l = 0; l < o; l++)
                for (let c = s[l], h = 0; h < u; h++) { const d = a[h]; if (d == c || c == '*') { const f = i.node.edges[d]; const p = i.qNode.edges[c]; const y = f.final && p.final; let m = void 0; d in i.output.edges ? (m = i.output.edges[d]).final = m.final || y : ((m = new e.TokenSet()).final = y, i.output.edges[d] = m), n.push({ qNode: p, output: m, node: f }); } }
        } return r;
    }, e.TokenSet.Builder = function () { this.previousWord = '', this.root = new e.TokenSet(), this.uncheckedNodes = [], this.minimizedNodes = {}; }, e.TokenSet.Builder.prototype.insert = function (t) {
        let r; let i = 0; if (t < this.previousWord)
            throw new Error('Out of order word insertion'); for (var n = 0; n < t.length && n < this.previousWord.length && t[n] == this.previousWord[n]; n++)
            i++; this.minimize(i), r = this.uncheckedNodes.length == 0 ? this.root : this.uncheckedNodes[this.uncheckedNodes.length - 1].child; for (n = i; n < t.length; n++) {
            const s = new e.TokenSet(); const
                o = t[n]; r.edges[o] = s, this.uncheckedNodes.push({ parent: r, char: o, child: s }), r = s;
        }r.final = !0, this.previousWord = t;
    }, e.TokenSet.Builder.prototype.finish = function () { this.minimize(0); }, e.TokenSet.Builder.prototype.minimize = function (e) { for (let t = this.uncheckedNodes.length - 1; e <= t; t--) { const r = this.uncheckedNodes[t]; const i = r.child.toString(); i in this.minimizedNodes ? r.parent.edges[r.char] = this.minimizedNodes[i] : (r.child._str = i, this.minimizedNodes[i] = r.child), this.uncheckedNodes.pop(); } }, e.Index = function (e) { this.invertedIndex = e.invertedIndex, this.fieldVectors = e.fieldVectors, this.tokenSet = e.tokenSet, this.fields = e.fields, this.pipeline = e.pipeline; }, e.Index.prototype.search = function (t) { return this.query((r) => { new e.QueryParser(t, r).parse(); }); }, e.Index.prototype.query = function (t) {
        for (var r = new e.Query(this.fields), i = Object.create(null), n = Object.create(null), s = Object.create(null), o = Object.create(null), a = Object.create(null), u = 0; u < this.fields.length; u++)
            n[this.fields[u]] = new e.Vector(); t.call(r, r); for (u = 0; u < r.clauses.length; u++) {
            var c; const l = r.clauses[u]; let h = e.Set.complete; c = l.usePipeline ? this.pipeline.runString(l.term, { fields: l.fields }) : [l.term]; for (let d = 0; d < c.length; d++) {
                const f = c[d]; l.term = f; const p = e.TokenSet.fromClause(l); const y = this.tokenSet.intersect(p).toArray(); if (y.length === 0 && l.presence === e.Query.presence.REQUIRED) { for (var m = 0; m < l.fields.length; m++) { o[v = l.fields[m]] = e.Set.empty; } break; } for (let g = 0; g < y.length; g++) {
                    const x = y[g]; const w = this.invertedIndex[x]; const Q = w._index; for (m = 0; m < l.fields.length; m++) {
                        const k = w[v = l.fields[m]]; const S = Object.keys(k); const E = x + '/' + v; const L = new e.Set(S); if (l.presence == e.Query.presence.REQUIRED && (h = h.union(L), void 0 === o[v] && (o[v] = e.Set.complete)), l.presence != e.Query.presence.PROHIBITED) { if (n[v].upsert(Q, l.boost, (e, t) => e + t), !s[E]) { for (let b = 0; b < S.length; b++) { var P; const T = S[b]; var O = new e.FieldRef(T, v); const I = k[T]; void 0 === (P = i[O]) ? i[O] = new e.MatchData(x, v, I) : P.add(x, v, I); }s[E] = !0; } } else
                            void 0 === a[v] && (a[v] = e.Set.empty), a[v] = a[v].union(L);
                    }
                }
            } if (l.presence === e.Query.presence.REQUIRED)
                for (m = 0; m < l.fields.length; m++) { o[v = l.fields[m]] = o[v].intersect(h); }
        } let R = e.Set.complete; let F = e.Set.empty; for (u = 0; u < this.fields.length; u++) { var v; o[v = this.fields[u]] && (R = R.intersect(o[v])), a[v] && (F = F.union(a[v])); } let C = Object.keys(i); const N = []; const _ = Object.create(null); if (r.isNegated()) { C = Object.keys(this.fieldVectors); for (u = 0; u < C.length; u++) { O = C[u]; var j = e.FieldRef.fromString(O); i[O] = new e.MatchData(); } } for (u = 0; u < C.length; u++) {
            const D = (j = e.FieldRef.fromString(C[u])).docRef; if (R.contains(D) && !F.contains(D)) {
                var A; const B = this.fieldVectors[j]; const V = n[j.fieldName].similarity(B); if (void 0 !== (A = _[D]))
                    A.score += V, A.matchData.combine(i[j]); else { const z = { ref: D, score: V, matchData: i[j] }; _[D] = z, N.push(z); }
            }
        } return N.sort((e, t) => t.score - e.score);
    }, e.Index.prototype.toJSON = function () { const t = Object.keys(this.invertedIndex).sort().map(function (e) { return [e, this.invertedIndex[e]]; }, this); const r = Object.keys(this.fieldVectors).map(function (e) { return [e, this.fieldVectors[e].toJSON()]; }, this); return { version: e.version, fields: this.fields, fieldVectors: r, invertedIndex: t, pipeline: this.pipeline.toJSON() }; }, e.Index.load = function (t) { const r = {}; const i = {}; const n = t.fieldVectors; const s = Object.create(null); const o = t.invertedIndex; const a = new e.TokenSet.Builder(); const u = e.Pipeline.load(t.pipeline); t.version != e.version && e.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + e.version + "' does not match serialized index '" + t.version + "'"); for (var l = 0; l < n.length; l++) { const h = (c = n[l])[0]; const d = c[1]; i[h] = new e.Vector(d); } for (l = 0; l < o.length; l++) { var c; const f = (c = o[l])[0]; const p = c[1]; a.insert(f), s[f] = p; } return a.finish(), r.fields = t.fields, r.fieldVectors = i, r.invertedIndex = s, r.tokenSet = a.root, r.pipeline = u, new e.Index(r); }, e.Builder = function () { this._ref = 'id', this._fields = Object.create(null), this._documents = Object.create(null), this.invertedIndex = Object.create(null), this.fieldTermFrequencies = {}, this.fieldLengths = {}, this.tokenizer = e.tokenizer, this.pipeline = new e.Pipeline(), this.searchPipeline = new e.Pipeline(), this.documentCount = 0, this._b = 0.75, this._k1 = 1.2, this.termIndex = 0, this.metadataWhitelist = []; }, e.Builder.prototype.ref = function (e) { this._ref = e; }, e.Builder.prototype.field = function (e, t) {
        if (/\//.test(e))
            throw new RangeError("Field '" + e + "' contains illegal character '/'"); this._fields[e] = t || {};
    }, e.Builder.prototype.b = function (e) { this._b = e < 0 ? 0 : e > 1 ? 1 : e; }, e.Builder.prototype.k1 = function (e) { this._k1 = e; }, e.Builder.prototype.add = function (t, r) {
        const i = t[this._ref]; const n = Object.keys(this._fields); this._documents[i] = r || {}, this.documentCount += 1; for (let s = 0; s < n.length; s++) {
            const o = n[s]; const a = this._fields[o].extractor; const u = a ? a(t) : t[o]; const l = this.tokenizer(u, { fields: [o] }); const c = this.pipeline.run(l); const h = new e.FieldRef(i, o); const d = Object.create(null); this.fieldTermFrequencies[h] = d, this.fieldLengths[h] = 0, this.fieldLengths[h] += c.length; for (let f = 0; f < c.length; f++) {
                const p = c[f]; if (d[p] == null && (d[p] = 0), d[p] += 1, this.invertedIndex[p] == null) {
                    const y = Object.create(null); y._index = this.termIndex, this.termIndex += 1; for (let m = 0; m < n.length; m++)
                        y[n[m]] = Object.create(null); this.invertedIndex[p] = y;
                } this.invertedIndex[p][o][i] == null && (this.invertedIndex[p][o][i] = Object.create(null)); for (let v = 0; v < this.metadataWhitelist.length; v++) { const g = this.metadataWhitelist[v]; const x = p.metadata[g]; this.invertedIndex[p][o][i][g] == null && (this.invertedIndex[p][o][i][g] = []), this.invertedIndex[p][o][i][g].push(x); }
            }
        }
    }, e.Builder.prototype.calculateAverageFieldLengths = function () { for (var t = Object.keys(this.fieldLengths), r = t.length, i = {}, n = {}, s = 0; s < r; s++) { const o = e.FieldRef.fromString(t[s]); const a = o.fieldName; n[a] || (n[a] = 0), n[a] += 1, i[a] || (i[a] = 0), i[a] += this.fieldLengths[o]; } const u = Object.keys(this._fields); for (s = 0; s < u.length; s++) { const l = u[s]; i[l] = i[l] / n[l]; } this.averageFieldLength = i; }, e.Builder.prototype.createFieldVectors = function () { for (var t = {}, r = Object.keys(this.fieldTermFrequencies), i = r.length, n = Object.create(null), s = 0; s < i; s++) { for (var o = e.FieldRef.fromString(r[s]), a = o.fieldName, u = this.fieldLengths[o], l = new e.Vector(), c = this.fieldTermFrequencies[o], h = Object.keys(c), d = h.length, f = this._fields[a].boost || 1, p = this._documents[o.docRef].boost || 1, y = 0; y < d; y++) { var m; var v; var g; const x = h[y]; const w = c[x]; const Q = this.invertedIndex[x]._index; void 0 === n[x] ? (m = e.idf(this.invertedIndex[x], this.documentCount), n[x] = m) : m = n[x], v = m * ((this._k1 + 1) * w) / (this._k1 * (1 - this._b + this._b * (u / this.averageFieldLength[a])) + w), v *= f, v *= p, g = Math.round(1e3 * v) / 1e3, l.insert(Q, g); }t[o] = l; } this.fieldVectors = t; }, e.Builder.prototype.createTokenSet = function () { this.tokenSet = e.TokenSet.fromArray(Object.keys(this.invertedIndex).sort()); }, e.Builder.prototype.build = function () { return this.calculateAverageFieldLengths(), this.createFieldVectors(), this.createTokenSet(), new e.Index({ invertedIndex: this.invertedIndex, fieldVectors: this.fieldVectors, tokenSet: this.tokenSet, fields: Object.keys(this._fields), pipeline: this.searchPipeline }); }, e.Builder.prototype.use = function (e) { const t = Array.prototype.slice.call(arguments, 1); t.unshift(this), e.apply(this, t); }, e.MatchData = function (e, t, r) { for (var i = Object.create(null), n = Object.keys(r || {}), s = 0; s < n.length; s++) { const o = n[s]; i[o] = r[o].slice(); } this.metadata = Object.create(null), void 0 !== e && (this.metadata[e] = Object.create(null), this.metadata[e][t] = i); }, e.MatchData.prototype.combine = function (e) { for (let t = Object.keys(e.metadata), r = 0; r < t.length; r++) { const i = t[r]; const n = Object.keys(e.metadata[i]); this.metadata[i] == null && (this.metadata[i] = Object.create(null)); for (let s = 0; s < n.length; s++) { const o = n[s]; const a = Object.keys(e.metadata[i][o]); this.metadata[i][o] == null && (this.metadata[i][o] = Object.create(null)); for (let u = 0; u < a.length; u++) { const l = a[u]; this.metadata[i][o][l] == null ? this.metadata[i][o][l] = e.metadata[i][o][l] : this.metadata[i][o][l] = this.metadata[i][o][l].concat(e.metadata[i][o][l]); } } } }, e.MatchData.prototype.add = function (e, t, r) {
        if (!(e in this.metadata))
            return this.metadata[e] = Object.create(null), void (this.metadata[e][t] = r); if (t in this.metadata[e])
            for (let i = Object.keys(r), n = 0; n < i.length; n++) { const s = i[n]; s in this.metadata[e][t] ? this.metadata[e][t][s] = this.metadata[e][t][s].concat(r[s]) : this.metadata[e][t][s] = r[s]; } else
            this.metadata[e][t] = r;
    }, e.Query = function (e) { this.clauses = [], this.allFields = e; }, e.Query.wildcard = new String('*'), e.Query.wildcard.NONE = 0, e.Query.wildcard.LEADING = 1, e.Query.wildcard.TRAILING = 2, e.Query.presence = { OPTIONAL: 1, REQUIRED: 2, PROHIBITED: 3 }, e.Query.prototype.clause = function (t) { return 'fields' in t || (t.fields = this.allFields), 'boost' in t || (t.boost = 1), 'usePipeline' in t || (t.usePipeline = !0), 'wildcard' in t || (t.wildcard = e.Query.wildcard.NONE), t.wildcard & e.Query.wildcard.LEADING && t.term.charAt(0) != e.Query.wildcard && (t.term = '*' + t.term), t.wildcard & e.Query.wildcard.TRAILING && t.term.slice(-1) != e.Query.wildcard && (t.term = t.term + '*'), 'presence' in t || (t.presence = e.Query.presence.OPTIONAL), this.clauses.push(t), this; }, e.Query.prototype.isNegated = function () {
        for (let t = 0; t < this.clauses.length; t++)
            if (this.clauses[t].presence != e.Query.presence.PROHIBITED)
                return !1; return !0;
    }, e.Query.prototype.term = function (t, r) {
        if (Array.isArray(t))
            return t.forEach(function (t) { this.term(t, e.utils.clone(r)); }, this), this; const i = r || {}; return i.term = t.toString(), this.clause(i), this;
    }, e.QueryParseError = function (e, t, r) { this.name = 'QueryParseError', this.message = e, this.start = t, this.end = r; }, e.QueryParseError.prototype = new Error(), e.QueryLexer = function (e) { this.lexemes = [], this.str = e, this.length = e.length, this.pos = 0, this.start = 0, this.escapeCharPositions = []; }, e.QueryLexer.prototype.run = function () {
        for (let t = e.QueryLexer.lexText; t;)
            t = t(this);
    }, e.QueryLexer.prototype.sliceString = function () {
        for (var e = [], t = this.start, r = this.pos, i = 0; i < this.escapeCharPositions.length; i++)
            r = this.escapeCharPositions[i], e.push(this.str.slice(t, r)), t = r + 1; return e.push(this.str.slice(t, this.pos)), this.escapeCharPositions.length = 0, e.join('');
    }, e.QueryLexer.prototype.emit = function (e) { this.lexemes.push({ type: e, str: this.sliceString(), start: this.start, end: this.pos }), this.start = this.pos; }, e.QueryLexer.prototype.escapeCharacter = function () { this.escapeCharPositions.push(this.pos - 1), this.pos += 1; }, e.QueryLexer.prototype.next = function () {
        if (this.pos >= this.length)
            return e.QueryLexer.EOS; const t = this.str.charAt(this.pos); return this.pos += 1, t;
    }, e.QueryLexer.prototype.width = function () { return this.pos - this.start; }, e.QueryLexer.prototype.ignore = function () { this.start == this.pos && (this.pos += 1), this.start = this.pos; }, e.QueryLexer.prototype.backup = function () { this.pos -= 1; }, e.QueryLexer.prototype.acceptDigitRun = function () {
        for (var t, r; (r = (t = this.next()).charCodeAt(0)) > 47 && r < 58;)
            ;t != e.QueryLexer.EOS && this.backup();
    }, e.QueryLexer.prototype.more = function () { return this.pos < this.length; }, e.QueryLexer.EOS = 'EOS', e.QueryLexer.FIELD = 'FIELD', e.QueryLexer.TERM = 'TERM', e.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE', e.QueryLexer.BOOST = 'BOOST', e.QueryLexer.PRESENCE = 'PRESENCE', e.QueryLexer.lexField = function (t) { return t.backup(), t.emit(e.QueryLexer.FIELD), t.ignore(), e.QueryLexer.lexText; }, e.QueryLexer.lexTerm = function (t) {
        if (t.width() > 1 && (t.backup(), t.emit(e.QueryLexer.TERM)), t.ignore(), t.more())
            return e.QueryLexer.lexText;
    }, e.QueryLexer.lexEditDistance = function (t) { return t.ignore(), t.acceptDigitRun(), t.emit(e.QueryLexer.EDIT_DISTANCE), e.QueryLexer.lexText; }, e.QueryLexer.lexBoost = function (t) { return t.ignore(), t.acceptDigitRun(), t.emit(e.QueryLexer.BOOST), e.QueryLexer.lexText; }, e.QueryLexer.lexEOS = function (t) { t.width() > 0 && t.emit(e.QueryLexer.TERM); }, e.QueryLexer.termSeparator = e.tokenizer.separator, e.QueryLexer.lexText = function (t) {
        for (;;) {
            const r = t.next(); if (r == e.QueryLexer.EOS)
                return e.QueryLexer.lexEOS; if (r.charCodeAt(0) != 92) {
                if (r == ':')
                    return e.QueryLexer.lexField; if (r == '~')
                    return t.backup(), t.width() > 0 && t.emit(e.QueryLexer.TERM), e.QueryLexer.lexEditDistance; if (r == '^')
                    return t.backup(), t.width() > 0 && t.emit(e.QueryLexer.TERM), e.QueryLexer.lexBoost; if (r == '+' && t.width() === 1)
                    return t.emit(e.QueryLexer.PRESENCE), e.QueryLexer.lexText; if (r == '-' && t.width() === 1)
                    return t.emit(e.QueryLexer.PRESENCE), e.QueryLexer.lexText; if (r.match(e.QueryLexer.termSeparator))
                    return e.QueryLexer.lexTerm;
            } else
                t.escapeCharacter();
        }
    }, e.QueryParser = function (t, r) { this.lexer = new e.QueryLexer(t), this.query = r, this.currentClause = {}, this.lexemeIdx = 0; }, e.QueryParser.prototype.parse = function () {
        this.lexer.run(), this.lexemes = this.lexer.lexemes; for (let t = e.QueryParser.parseClause; t;)
            t = t(this); return this.query;
    }, e.QueryParser.prototype.peekLexeme = function () { return this.lexemes[this.lexemeIdx]; }, e.QueryParser.prototype.consumeLexeme = function () { const e = this.peekLexeme(); return this.lexemeIdx += 1, e; }, e.QueryParser.prototype.nextClause = function () { const e = this.currentClause; this.query.clause(e), this.currentClause = {}; }, e.QueryParser.parseClause = function (t) {
        const r = t.peekLexeme(); if (r != null)
            switch (r.type) { case e.QueryLexer.PRESENCE: return e.QueryParser.parsePresence; case e.QueryLexer.FIELD: return e.QueryParser.parseField; case e.QueryLexer.TERM: return e.QueryParser.parseTerm; default: var i = 'expected either a field or a term, found ' + r.type; throw r.str.length >= 1 && (i += " with value '" + r.str + "'"), new e.QueryParseError(i, r.start, r.end); }
    }, e.QueryParser.parsePresence = function (t) { const r = t.consumeLexeme(); if (r != null) { switch (r.str) { case '-': t.currentClause.presence = e.Query.presence.PROHIBITED; break; case '+': t.currentClause.presence = e.Query.presence.REQUIRED; break; default: var i = "unrecognised presence operator'" + r.str + "'"; throw new e.QueryParseError(i, r.start, r.end); } const n = t.peekLexeme(); if (n == null) { i = 'expecting term or field, found nothing'; throw new e.QueryParseError(i, r.start, r.end); } switch (n.type) { case e.QueryLexer.FIELD: return e.QueryParser.parseField; case e.QueryLexer.TERM: return e.QueryParser.parseTerm; default: i = "expecting term or field, found '" + n.type + "'"; throw new e.QueryParseError(i, n.start, n.end); } } }, e.QueryParser.parseField = function (t) { const r = t.consumeLexeme(); if (r != null) { if (t.query.allFields.indexOf(r.str) == -1) { const i = t.query.allFields.map((e) => "'" + e + "'").join(', '); var n = "unrecognised field '" + r.str + "', possible fields: " + i; throw new e.QueryParseError(n, r.start, r.end); }t.currentClause.fields = [r.str]; const s = t.peekLexeme(); if (s == null) { n = 'expecting term, found nothing'; throw new e.QueryParseError(n, r.start, r.end); } switch (s.type) { case e.QueryLexer.TERM: return e.QueryParser.parseTerm; default: n = "expecting term, found '" + s.type + "'"; throw new e.QueryParseError(n, s.start, s.end); } } }, e.QueryParser.parseTerm = function (t) {
        const r = t.consumeLexeme(); if (r != null) {
            t.currentClause.term = r.str.toLowerCase(), r.str.indexOf('*') != -1 && (t.currentClause.usePipeline = !1); const i = t.peekLexeme(); if (i == null)
                return void t.nextClause(); switch (i.type) { case e.QueryLexer.TERM: return t.nextClause(), e.QueryParser.parseTerm; case e.QueryLexer.FIELD: return t.nextClause(), e.QueryParser.parseField; case e.QueryLexer.EDIT_DISTANCE: return e.QueryParser.parseEditDistance; case e.QueryLexer.BOOST: return e.QueryParser.parseBoost; case e.QueryLexer.PRESENCE: return t.nextClause(), e.QueryParser.parsePresence; default: var n = "Unexpected lexeme type '" + i.type + "'"; throw new e.QueryParseError(n, i.start, i.end); }
        }
    }, e.QueryParser.parseEditDistance = function (t) {
        const r = t.consumeLexeme(); if (r != null) {
            const i = parseInt(r.str, 10); if (isNaN(i)) { var n = 'edit distance must be numeric'; throw new e.QueryParseError(n, r.start, r.end); }t.currentClause.editDistance = i; const s = t.peekLexeme(); if (s == null)
                return void t.nextClause(); switch (s.type) { case e.QueryLexer.TERM: return t.nextClause(), e.QueryParser.parseTerm; case e.QueryLexer.FIELD: return t.nextClause(), e.QueryParser.parseField; case e.QueryLexer.EDIT_DISTANCE: return e.QueryParser.parseEditDistance; case e.QueryLexer.BOOST: return e.QueryParser.parseBoost; case e.QueryLexer.PRESENCE: return t.nextClause(), e.QueryParser.parsePresence; default: n = "Unexpected lexeme type '" + s.type + "'"; throw new e.QueryParseError(n, s.start, s.end); }
        }
    }, e.QueryParser.parseBoost = function (t) {
        const r = t.consumeLexeme(); if (r != null) {
            const i = parseInt(r.str, 10); if (isNaN(i)) { var n = 'boost must be numeric'; throw new e.QueryParseError(n, r.start, r.end); }t.currentClause.boost = i; const s = t.peekLexeme(); if (s == null)
                return void t.nextClause(); switch (s.type) { case e.QueryLexer.TERM: return t.nextClause(), e.QueryParser.parseTerm; case e.QueryLexer.FIELD: return t.nextClause(), e.QueryParser.parseField; case e.QueryLexer.EDIT_DISTANCE: return e.QueryParser.parseEditDistance; case e.QueryLexer.BOOST: return e.QueryParser.parseBoost; case e.QueryLexer.PRESENCE: return t.nextClause(), e.QueryParser.parsePresence; default: n = "Unexpected lexeme type '" + s.type + "'"; throw new e.QueryParseError(n, s.start, s.end); }
        }
    }, (function (e, t) { typeof define === 'function' && define.amd ? define(t) : typeof exports === 'object' ? module.exports = t() : e.lunr = t(); })(this, () => e);
})(); const __extends = this && this.__extends || (function () {
    var extendStatics = function (d, b) {
        return (extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; } || function (d, b) {
            for (const p in b)
                b.hasOwnProperty(p) && (d[p] = b[p]);
        })(d, b);
    }; return function (d, b) { function __() { this.constructor = d; }extendStatics(d, b), d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __()); };
})(); var typedoc; var typedoc; var typedoc; var typedoc; var typedoc; var typedoc; var typedoc; var typedoc; var typedoc; var typedoc; !(function (typedoc) { typedoc.$html = $('html'); const services = []; const components = []; typedoc.$document = $(document), typedoc.$window = $(window), typedoc.$body = $('body'), typedoc.registerService = function (constructor, name, priority) { void 0 === priority && (priority = 0), services.push({ constructor, name, priority, instance: null }), services.sort((a, b) => a.priority - b.priority); }, typedoc.registerComponent = function (constructor, selector, priority, namespace) { void 0 === priority && (priority = 0), void 0 === namespace && (namespace = '*'), components.push({ selector, constructor, priority, namespace }), components.sort((a, b) => a.priority - b.priority); }, typeof Backbone !== 'undefined' && (typedoc.Events = function () {}, _.extend(typedoc.Events.prototype, Backbone.Events)); const Application = (function (_super) { function Application() { const _this = _super.call(this) || this; return _this.createServices(), _this.createComponents(typedoc.$body), _this; } return __extends(Application, _super), Application.prototype.createServices = function () { _(services).forEach((c) => { c.instance = new c.constructor(), typedoc[c.name] = c.instance; }); }, Application.prototype.createComponents = function ($context, namespace) { void 0 === namespace && (namespace = 'default'); const result = []; return _(components).forEach((c) => { c.namespace != namespace && c.namespace != '*' || $context.find(c.selector).each((m, el) => { let instance; const $el = $(el); (instance = $el.data('component')) ? _(result).indexOf(instance) == -1 && result.push(instance) : (instance = new c.constructor({ el }), $el.data('component', instance), result.push(instance)); }); }), result; }, Application; })(typedoc.Events); typedoc.Application = Application; })(typedoc || (typedoc = {})), (function (typedoc) { const Viewport = (function (_super) { function Viewport() { const _this = _super.call(this) || this; return _this.scrollTop = 0, _this.lastY = 0, _this.width = 0, _this.height = 0, _this.showToolbar = !0, _this.toolbar = document.querySelector('.tsd-page-toolbar'), _this.secondaryNav = document.querySelector('.tsd-navigation.secondary'), typedoc.$window.on('scroll', _.throttle(() => _this.onScroll(), 10)), typedoc.$window.on('resize', _.throttle(() => _this.onResize(), 10)), _this.onResize(), _this.onScroll(), _this; } return __extends(Viewport, _super), Viewport.prototype.triggerResize = function () { this.trigger('resize', this.width, this.height); }, Viewport.prototype.onResize = function () { this.width = typedoc.$window.width() || 0, this.height = typedoc.$window.height() || 0, this.trigger('resize', this.width, this.height); }, Viewport.prototype.onScroll = function () { this.scrollTop = typedoc.$window.scrollTop() || 0, this.trigger('scroll', this.scrollTop), this.hideShowToolbar(); }, Viewport.prototype.hideShowToolbar = function () { const isShown = this.showToolbar; this.showToolbar = this.lastY >= this.scrollTop || this.scrollTop === 0, isShown !== this.showToolbar && (this.toolbar.classList.toggle('tsd-page-toolbar--hide'), this.secondaryNav.classList.toggle('tsd-navigation--toolbar-hide')), this.lastY = this.scrollTop; }, Viewport; })(typedoc.Events); typedoc.Viewport = Viewport, typedoc.registerService(Viewport, 'viewport'); })(typedoc || (typedoc = {})), (function (typedoc) { typedoc.pointerDown = 'mousedown', typedoc.pointerMove = 'mousemove', typedoc.pointerUp = 'mouseup', typedoc.pointerDownPosition = { x: 0, y: 0 }, typedoc.preventNextClick = !1, typedoc.isPointerDown = !1, typedoc.isPointerTouch = !1, typedoc.hasPointerMoved = !1, typedoc.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), typedoc.$html.addClass(typedoc.isMobile ? 'is-mobile' : 'not-mobile'), typedoc.isMobile && 'ontouchstart' in document.documentElement && (typedoc.isPointerTouch = !0, typedoc.pointerDown = 'touchstart', typedoc.pointerMove = 'touchmove', typedoc.pointerUp = 'touchend'), typedoc.$document.on(typedoc.pointerDown, (e) => { typedoc.isPointerDown = !0, typedoc.hasPointerMoved = !1; const t = typedoc.pointerDown == 'touchstart' ? e.originalEvent.targetTouches[0] : e; typedoc.pointerDownPosition.y = t.pageY || 0, typedoc.pointerDownPosition.x = t.pageX || 0; }).on(typedoc.pointerMove, (e) => { if (typedoc.isPointerDown && !typedoc.hasPointerMoved) { const t = typedoc.pointerDown == 'touchstart' ? e.originalEvent.targetTouches[0] : e; const x = typedoc.pointerDownPosition.x - (t.pageX || 0); const y = typedoc.pointerDownPosition.y - (t.pageY || 0); typedoc.hasPointerMoved = Math.sqrt(x * x + y * y) > 10; } }).on(typedoc.pointerUp, (e) => { typedoc.isPointerDown = !1; }).on('click', (e) => { typedoc.preventNextClick && (e.preventDefault(), e.stopImmediatePropagation(), typedoc.preventNextClick = !1); }); })(typedoc || (typedoc = {})), (function (typedoc) { const FilterItem = (function () { function FilterItem(key, value) { this.key = key, this.value = value, this.defaultValue = value, this.initialize(), window.localStorage[this.key] && this.setValue(this.fromLocalStorage(window.localStorage[this.key])); } return FilterItem.prototype.initialize = function () {}, FilterItem.prototype.setValue = function (value) { if (this.value != value) { const oldValue = this.value; this.value = value, window.localStorage[this.key] = this.toLocalStorage(value), this.handleValueChange(oldValue, value); } }, FilterItem; })(); const FilterItemCheckbox = (function (_super) { function FilterItemCheckbox() { return _super !== null && _super.apply(this, arguments) || this; } return __extends(FilterItemCheckbox, _super), FilterItemCheckbox.prototype.initialize = function () { const _this = this; this.$checkbox = $('#tsd-filter-' + this.key), this.$checkbox.on('change', () => { _this.setValue(_this.$checkbox.prop('checked')); }); }, FilterItemCheckbox.prototype.handleValueChange = function (oldValue, newValue) { this.$checkbox.prop('checked', this.value), typedoc.$html.toggleClass('toggle-' + this.key, this.value != this.defaultValue); }, FilterItemCheckbox.prototype.fromLocalStorage = function (value) { return value == 'true'; }, FilterItemCheckbox.prototype.toLocalStorage = function (value) { return value ? 'true' : 'false'; }, FilterItemCheckbox; })(FilterItem); const FilterItemSelect = (function (_super) { function FilterItemSelect() { return _super !== null && _super.apply(this, arguments) || this; } return __extends(FilterItemSelect, _super), FilterItemSelect.prototype.initialize = function () { const _this = this; typedoc.$html.addClass('toggle-' + this.key + this.value), this.$select = $('#tsd-filter-' + this.key), this.$select.on(typedoc.pointerDown + ' mouseover', () => { _this.$select.addClass('active'); }).on('mouseleave', () => { _this.$select.removeClass('active'); }).on(typedoc.pointerUp, 'li', (e) => { _this.$select.removeClass('active'), _this.setValue(($(e.target).attr('data-value') || '').toString()); }), typedoc.$document.on(typedoc.pointerDown, (e) => { $(e.target).parents().addBack().is(_this.$select) || _this.$select.removeClass('active'); }); }, FilterItemSelect.prototype.handleValueChange = function (oldValue, newValue) { this.$select.find('li.selected').removeClass('selected'), this.$select.find('.tsd-select-label').text(this.$select.find('li[data-value="' + newValue + '"]').addClass('selected').text()), typedoc.$html.removeClass('toggle-' + oldValue), typedoc.$html.addClass('toggle-' + newValue); }, FilterItemSelect.prototype.fromLocalStorage = function (value) { return value; }, FilterItemSelect.prototype.toLocalStorage = function (value) { return value; }, FilterItemSelect; })(FilterItem); const Filter = (function (_super) { function Filter(options) { const _this = _super.call(this, options) || this; return _this.optionVisibility = new FilterItemSelect('visibility', 'private'), _this.optionInherited = new FilterItemCheckbox('inherited', !0), _this.optionExternals = new FilterItemCheckbox('externals', !0), _this.optionOnlyExported = new FilterItemCheckbox('only-exported', !1), _this; } return __extends(Filter, _super), Filter.isSupported = function () { try { return void 0 !== window.localStorage; } catch (e) { return !1; } }, Filter; })(Backbone.View); Filter.isSupported() ? typedoc.registerComponent(Filter, '#tsd-filter') : typedoc.$html.addClass('no-filter'); })(typedoc || (typedoc = {})), (function (typedoc) {
    const MenuHighlight = (function (_super) {
        function MenuHighlight(options) { const _this = _super.call(this, options) || this; return _this.anchors = [], _this.index = 0, _this.listenTo(typedoc.viewport, 'resize', _this.onResize), _this.listenTo(typedoc.viewport, 'scroll', _this.onScroll), _this.createAnchors(), _this; } return __extends(MenuHighlight, _super), MenuHighlight.prototype.createAnchors = function () { const _this = this; this.index = 0, this.anchors = [{ position: 0 }]; let base = window.location.href; base.indexOf('#') != -1 && (base = base.substr(0, base.indexOf('#'))), this.$el.find('a').each((_index, el) => { const href = el.href; if (href.indexOf('#') != -1 && href.substr(0, base.length) == base) { const hash = href.substr(href.indexOf('#') + 1); const $anchor = $('a.tsd-anchor[name=' + hash + ']'); $anchor.length != 0 && _this.anchors.push({ $link: $(el.parentNode), $anchor, position: 0 }); } }), this.onResize(); }, MenuHighlight.prototype.onResize = function () {
            for (var anchor, index = 1, count = this.anchors.length; index < count; index++)
                (anchor = this.anchors[index]).position = anchor.$anchor.offset().top; this.anchors.sort((a, b) => a.position - b.position), this.onScroll(typedoc.viewport.scrollTop);
        }, MenuHighlight.prototype.onScroll = function (scrollTop) {
            const anchors = this.anchors; let index = this.index; const count = anchors.length - 1; for (scrollTop += 5; index > 0 && anchors[index].position > scrollTop;)
                index -= 1; for (;index < count && anchors[index + 1].position < scrollTop;)
                index += 1; this.index != index && (this.index > 0 && this.anchors[this.index].$link.removeClass('focus'), this.index = index, this.index > 0 && this.anchors[this.index].$link.addClass('focus'));
        }, MenuHighlight;
    })(Backbone.View); typedoc.MenuHighlight = MenuHighlight, typedoc.registerComponent(MenuHighlight, '.menu-highlight');
})(typedoc || (typedoc = {})), (function (typedoc) {
    let search; !(function (search) {
        let SearchLoadingState; !(function (SearchLoadingState) { SearchLoadingState[SearchLoadingState.Idle = 0] = 'Idle', SearchLoadingState[SearchLoadingState.Loading = 1] = 'Loading', SearchLoadingState[SearchLoadingState.Ready = 2] = 'Ready', SearchLoadingState[SearchLoadingState.Failure = 3] = 'Failure'; })(SearchLoadingState || (SearchLoadingState = {})); const $el = $('#tsd-search'); const $field = $('#tsd-search-field'); const $results = $('.results'); const base = $el.attr('data-base') + '/'; let query = ''; let loadingState = SearchLoadingState.Idle; let hasFocus = !1; let preventPress = !1; let index; let resultClicked = !1; function createIndex() {
            const builder = new lunr.Builder(); builder.pipeline.add(lunr.trimmer), builder.field('name', { boost: 10 }), builder.field('parent'), builder.ref('id'); const rows = search.data.rows; let pos = 0; const length = rows.length; !(function batch() {
                for (let cycles = 0; cycles++ < 100;)
                    if (builder.add(rows[pos]), ++pos == length)
                        return index = builder.build(), setLoadingState(SearchLoadingState.Ready); setTimeout(batch, 10);
            })();
        } function loadIndex() { loadingState == SearchLoadingState.Idle && (setTimeout(() => { loadingState == SearchLoadingState.Idle && setLoadingState(SearchLoadingState.Loading); }, 500), void 0 !== search.data ? createIndex() : $.get($el.attr('data-index')).done((source) => { eval(source), createIndex(); }).fail(() => { setLoadingState(SearchLoadingState.Failure); })); } function updateResults() { if ($results.empty(), loadingState == SearchLoadingState.Ready && query) { let res = index.search('*' + query + '*'); res.length === 0 && (res = index.search('*' + query + '~1*')); for (let i = 0, c = Math.min(10, res.length); i < c; i++) { const row = search.data.rows[Number(res[i].ref)]; let name = row.name.replace(new RegExp(query, 'i'), (match) => '<b>' + match + '</b>'); let parent = row.parent || ''; (parent = parent.replace(new RegExp(query, 'i'), (match) => '<b>' + match + '</b>')) && (name = '<span class="parent">' + parent + '.</span>' + name), $results.append('<li class="' + row.classes + '"><a href="' + base + row.url + '" class="tsd-kind-icon">' + name + '</li>'); } } } function setLoadingState(value) { loadingState != value && ($el.removeClass(SearchLoadingState[loadingState].toLowerCase()), loadingState = value, $el.addClass(SearchLoadingState[loadingState].toLowerCase()), value == SearchLoadingState.Ready && updateResults()); } function setHasFocus(value) { hasFocus != value && (hasFocus = value, $el.toggleClass('has-focus'), value ? (setQuery(''), $field.val('')) : $field.val(query)); } function setQuery(value) { query = $.trim(value), updateResults(); } function setCurrentResult(dir) {
            const $current = $results.find('.current'); if ($current.length == 0)
                $results.find(dir == 1 ? 'li:first-child' : 'li:last-child').addClass('current'); else { const $rel = dir == 1 ? $current.next('li') : $current.prev('li'); $rel.length > 0 && ($current.removeClass('current'), $rel.addClass('current')); }
        } function gotoCurrentResult() { let $current = $results.find('.current'); $current.length == 0 && ($current = $results.find('li:first-child')), $current.length > 0 && (window.location.href = $current.find('a').prop('href'), $field.blur()); }$results.on('mousedown', () => { resultClicked = !0; }).on('mouseup', () => { setHasFocus(resultClicked = !1); }), $field.on('focusin', () => { setHasFocus(!0), loadIndex(); }).on('focusout', () => { resultClicked ? resultClicked = !1 : setTimeout(() => setHasFocus(!1), 100); }).on('input', () => { setQuery($.trim(($field.val() || '').toString())); }).on('keydown', (e) => { e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 38 || e.keyCode == 40 ? (preventPress = !0, e.preventDefault(), e.keyCode == 13 ? gotoCurrentResult() : e.keyCode == 27 ? $field.blur() : e.keyCode == 38 ? setCurrentResult(-1) : e.keyCode == 40 && setCurrentResult(1)) : preventPress = !1; }).on('keypress', (e) => { preventPress && e.preventDefault(); }), $('body').on('keydown', (e) => { e.altKey || e.ctrlKey || e.metaKey || !hasFocus && e.keyCode > 47 && e.keyCode < 112 && $field.focus(); });
    })(search = typedoc.search || (typedoc.search = {}));
})(typedoc || (typedoc = {})), (function (typedoc) {
    function noTransition($el, callback) { $el.addClass('no-transition'), callback(), $el.offset(), $el.removeClass('no-transition'); }typedoc.transition = (function (tuples) {
        for (const name in tuples)
            if (tuples.hasOwnProperty(name) && void 0 !== document.body.style[name])
                return { name, endEvent: tuples[name] }; return null;
    })({ transition: 'transitionend', OTransition: 'oTransitionEnd', msTransition: 'msTransitionEnd', MozTransition: 'transitionend', WebkitTransition: 'webkitTransitionEnd' }), typedoc.noTransition = noTransition, typedoc.animateHeight = function ($el, callback, success) { const from = $el.height() || 0; let to = from; noTransition($el, () => { callback(), $el.css('height', ''), to = $el.height() || 0, from != to && typedoc.transition && $el.css('height', from); }), from != to && typedoc.transition ? ($el.css('height', to), $el.on(typedoc.transition.endEvent, () => { noTransition($el, () => { $el.off(typedoc.transition.endEvent).css('height', ''), success && success(); }); })) : success && success(); };
})(typedoc || (typedoc = {})), (function (typedoc) {
    const SignatureGroup = (function () { function SignatureGroup($signature, $description) { this.$signature = $signature, this.$description = $description; } return SignatureGroup.prototype.addClass = function (className) { return this.$signature.addClass(className), this.$description.addClass(className), this; }, SignatureGroup.prototype.removeClass = function (className) { return this.$signature.removeClass(className), this.$description.removeClass(className), this; }, SignatureGroup; })(); const Signature = (function (_super) {
        function Signature(options) { const _this = _super.call(this, options) || this; return _this.groups = [], _this.index = -1, _this.createGroups(), _this.$container && (_this.$el.addClass('active').on('touchstart', '.tsd-signature', (event) => _this.onClick(event)).on('click', '.tsd-signature', (event) => _this.onClick(event)), _this.$container.addClass('active'), _this.setIndex(0)), _this; } return __extends(Signature, _super), Signature.prototype.setIndex = function (index) {
            if (index < 0 && (index = 0), index > this.groups.length - 1 && (index = this.groups.length - 1), this.index != index) {
                const to = this.groups[index]; if (this.index > -1) { const from = this.groups[this.index]; typedoc.animateHeight(this.$container, () => { from.removeClass('current').addClass('fade-out'), to.addClass('current fade-in'), typedoc.viewport.triggerResize(); }), setTimeout(() => { from.removeClass('fade-out'), to.removeClass('fade-in'); }, 300); } else
                    to.addClass('current'), typedoc.viewport.triggerResize(); this.index = index;
            }
        }, Signature.prototype.createGroups = function () { const _this = this; const $signatures = this.$el.find('> .tsd-signature'); if (!($signatures.length < 2)) { this.$container = this.$el.siblings('.tsd-descriptions'); const $descriptions = this.$container.find('> .tsd-description'); this.groups = [], $signatures.each((index, el) => { _this.groups.push(new SignatureGroup($(el), $descriptions.eq(index))); }); } }, Signature.prototype.onClick = function (e) { const _this = this; _(this.groups).forEach((group, index) => { group.$signature.is(e.currentTarget) && _this.setIndex(index); }); }, Signature;
    })(Backbone.View); typedoc.registerComponent(Signature, '.tsd-signatures');
})(typedoc || (typedoc = {})), (function (typedoc) {
    const Toggle = (function (_super) {
        function Toggle(options) { const _this = _super.call(this, options) || this; return _this.className = _this.$el.attr('data-toggle') || '', _this.$el.on(typedoc.pointerUp, (e) => _this.onPointerUp(e)), _this.$el.on('click', (e) => e.preventDefault()), typedoc.$document.on(typedoc.pointerDown, (e) => _this.onDocumentPointerDown(e)), typedoc.$document.on(typedoc.pointerUp, (e) => _this.onDocumentPointerUp(e)), _this; } return __extends(Toggle, _super), Toggle.prototype.setActive = function (value) { if (this.active != value) { this.active = value, typedoc.$html.toggleClass('has-' + this.className, value), this.$el.toggleClass('active', value); const transition = (this.active ? 'to-has-' : 'from-has-') + this.className; typedoc.$html.addClass(transition), setTimeout(() => typedoc.$html.removeClass(transition), 500); } }, Toggle.prototype.onPointerUp = function (event) { typedoc.hasPointerMoved || (this.setActive(!0), event.preventDefault()); }, Toggle.prototype.onDocumentPointerDown = function (e) {
            if (this.active) {
                const $path = $(e.target).parents().addBack(); if ($path.hasClass('col-menu'))
                    return; if ($path.hasClass('tsd-filter-group'))
                    return; this.setActive(!1);
            }
        }, Toggle.prototype.onDocumentPointerUp = function (e) { const _this = this; if (!typedoc.hasPointerMoved && this.active) { const $path = $(e.target).parents().addBack(); if ($path.hasClass('col-menu')) { const $link = $path.filter('a'); if ($link.length) { let href = window.location.href; href.indexOf('#') != -1 && (href = href.substr(0, href.indexOf('#'))), $link.prop('href').substr(0, href.length) == href && setTimeout(() => _this.setActive(!1), 250); } } } }, Toggle;
    })(Backbone.View); typedoc.registerComponent(Toggle, 'a[data-toggle]');
})(typedoc || (typedoc = {})), (function (typedoc) { typedoc.app = new typedoc.Application(); })(typedoc || (typedoc = {}));
