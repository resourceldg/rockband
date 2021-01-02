import{S as e,i as a,s,B as t,e as o,t as n,h as r,l,c as i,a as c,j as d,d as u,k as m,m as p,b as g,f,g as h,o as b,p as y,q as $,r as v}from"./client.7628e46f.js";import{C as k}from"./Code.4523955d.js";function w(e){let a;return{c(){a=n("Disabled button")},l(e){a=d(e,"Disabled button")},m(e,s){f(e,a,s)},d(e){e&&u(a)}}}function S(e){let a;return{c(){a=n("Disabled button")},l(e){a=d(e,"Disabled button")},m(e,s){f(e,a,s)},d(e){e&&u(a)}}}function x(e){let a;return{c(){a=n("Disabled button")},l(e){a=d(e,"Disabled button")},m(e,s){f(e,a,s)},d(e){e&&u(a)}}}function C(e){let a,s,C,E,B,P,z,T,j,I,A,U,V,G,N,R,q,H,F,J,K,L,M,O,Q,W,X,Y,Z,_,ee,ae,se,te,oe,ne,re,le,ie,ce,de,ue,me,pe;return A=new k({props:{code:"<Button disabled>Disabled button</Button>"}}),G=new t({props:{disabled:!0,$$slots:{default:[w]},$$scope:{ctx:e}}}),M=new k({props:{code:'<Button\n  disabledClasses="bg-gray-100 text-gray-500 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"\n  disabled>Disabled button\n</Button>'}}),W=new t({props:{disabledClasses:"bg-gray-100 text-gray-500 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default",disabled:!0,$$slots:{default:[S]},$$scope:{ctx:e}}}),ee=new k({props:{code:'<Button\n  disabledClasses={i => i.replace(/(3|4)00/g, "100")}\n  disabled>Disabled button\n</Button>'}}),te=new t({props:{disabledClasses:D,disabled:!0,$$slots:{default:[x]},$$scope:{ctx:e}}}),{c(){a=o("h4"),s=n("Smelte components"),C=r(),E=o("p"),B=n("Smelte components are built almost exclusively using Tailwind's utility classes\n  keeping CSS bundle size as minimal as possible. UI frameworks are notorious for\n  being hard to customize and we're still looking for appropriate solution given\n  utility-first nature of Tailwind. So for the most part components expose all of\n  their elements' classes as strings like, for instance, Button component has\n  \"disabledClasses\" prop defaulting to"),P=o("br"),z=r(),T=o("span"),j=n("bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"),I=r(),l(A.$$.fragment),U=r(),V=o("div"),l(G.$$.fragment),N=r(),R=o("p"),q=n('Say you need to adjust that background color, you may the "disabledClasses" prop'),H=o("br"),F=r(),J=o("span"),K=n("bg-gray-100 text-gray-700 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"),L=r(),l(M.$$.fragment),O=r(),Q=o("div"),l(W.$$.fragment),X=r(),Y=o("p"),Z=n("This feels bulky to say the least but may still be the case if you need to modify those classes heavily.\n  Same prop also allows you to pass a function which accepts the same string as argument and returns your modified classes string:"),_=r(),l(ee.$$.fragment),ae=r(),se=o("div"),l(te.$$.fragment),oe=r(),ne=o("p"),re=n("Using this approach Smelte is also able to imply which classes are actually being used\n  even dynamically which helps Purge CSS to get rid of unused classes at build time automatically.\n  Still it feels like this is a rather naive way of customizing components so please create an\n  "),le=o("a"),ie=n("issue"),ce=n(" on Github or "),de=o("a"),ue=n("contact me directly"),me=n("\n  if you have an idea how to improve on this."),this.h()},l(e){a=i(e,"H4",{class:!0});var t=c(a);s=d(t,"Smelte components"),t.forEach(u),C=m(e),E=i(e,"P",{});var o=c(E);B=d(o,"Smelte components are built almost exclusively using Tailwind's utility classes\n  keeping CSS bundle size as minimal as possible. UI frameworks are notorious for\n  being hard to customize and we're still looking for appropriate solution given\n  utility-first nature of Tailwind. So for the most part components expose all of\n  their elements' classes as strings like, for instance, Button component has\n  \"disabledClasses\" prop defaulting to"),P=i(o,"BR",{}),z=m(o),T=i(o,"SPAN",{class:!0});var n=c(T);j=d(n,"bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"),n.forEach(u),o.forEach(u),I=m(e),p(A.$$.fragment,e),U=m(e),V=i(e,"DIV",{class:!0});var r=c(V);p(G.$$.fragment,r),r.forEach(u),N=m(e),R=i(e,"P",{});var l=c(R);q=d(l,'Say you need to adjust that background color, you may the "disabledClasses" prop'),H=i(l,"BR",{}),F=m(l),J=i(l,"SPAN",{class:!0});var g=c(J);K=d(g,"bg-gray-100 text-gray-700 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"),g.forEach(u),l.forEach(u),L=m(e),p(M.$$.fragment,e),O=m(e),Q=i(e,"DIV",{class:!0});var f=c(Q);p(W.$$.fragment,f),f.forEach(u),X=m(e),Y=i(e,"P",{});var h=c(Y);Z=d(h,"This feels bulky to say the least but may still be the case if you need to modify those classes heavily.\n  Same prop also allows you to pass a function which accepts the same string as argument and returns your modified classes string:"),h.forEach(u),_=m(e),p(ee.$$.fragment,e),ae=m(e),se=i(e,"DIV",{class:!0});var b=c(se);p(te.$$.fragment,b),b.forEach(u),oe=m(e),ne=i(e,"P",{});var y=c(ne);re=d(y,"Using this approach Smelte is also able to imply which classes are actually being used\n  even dynamically which helps Purge CSS to get rid of unused classes at build time automatically.\n  Still it feels like this is a rather naive way of customizing components so please create an\n  "),le=i(y,"A",{href:!0});var $=c(le);ie=d($,"issue"),$.forEach(u),ce=d(y," on Github or "),de=i(y,"A",{href:!0});var v=c(de);ue=d(v,"contact me directly"),v.forEach(u),me=d(y,"\n  if you have an idea how to improve on this."),y.forEach(u),this.h()},h(){g(a,"class","pb-8"),g(T,"class","code-inline"),g(V,"class","pt-8 pb-16"),g(J,"class","code-inline"),g(Q,"class","pt-8 pb-16"),g(se,"class","pt-8 pb-16"),g(le,"href","https://github.com/matyunya/smelte/issues/new"),g(de,"href","mailto:matyunya@gmail.com")},m(e,t){f(e,a,t),h(a,s),f(e,C,t),f(e,E,t),h(E,B),h(E,P),h(E,z),h(E,T),h(T,j),f(e,I,t),b(A,e,t),f(e,U,t),f(e,V,t),b(G,V,null),f(e,N,t),f(e,R,t),h(R,q),h(R,H),h(R,F),h(R,J),h(J,K),f(e,L,t),b(M,e,t),f(e,O,t),f(e,Q,t),b(W,Q,null),f(e,X,t),f(e,Y,t),h(Y,Z),f(e,_,t),b(ee,e,t),f(e,ae,t),f(e,se,t),b(te,se,null),f(e,oe,t),f(e,ne,t),h(ne,re),h(ne,le),h(le,ie),h(ne,ce),h(ne,de),h(de,ue),h(ne,me),pe=!0},p(e,[a]){const s={};1&a&&(s.$$scope={dirty:a,ctx:e}),G.$set(s);const t={};1&a&&(t.$$scope={dirty:a,ctx:e}),W.$set(t);const o={};1&a&&(o.$$scope={dirty:a,ctx:e}),te.$set(o)},i(e){pe||(y(A.$$.fragment,e),y(G.$$.fragment,e),y(M.$$.fragment,e),y(W.$$.fragment,e),y(ee.$$.fragment,e),y(te.$$.fragment,e),pe=!0)},o(e){$(A.$$.fragment,e),$(G.$$.fragment,e),$(M.$$.fragment,e),$(W.$$.fragment,e),$(ee.$$.fragment,e),$(te.$$.fragment,e),pe=!1},d(e){e&&u(a),e&&u(C),e&&u(E),e&&u(I),v(A,e),e&&u(U),e&&u(V),v(G),e&&u(N),e&&u(R),e&&u(L),v(M,e),e&&u(O),e&&u(Q),v(W),e&&u(X),e&&u(Y),e&&u(_),v(ee,e),e&&u(ae),e&&u(se),v(te),e&&u(oe),e&&u(ne)}}}const D=e=>e.replace(/(3|4)00/g,"100");export default class extends e{constructor(e){super(),a(this,e,null,C,s,{})}}
