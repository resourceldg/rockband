import{_ as t,a as n,b as e,i as s,s as i,c,aj as u,S as o,G as a,ap as r,o as f,r as l,u as $,l as m,I as x,a5 as d,v as p,w as v,x as h,N as b,K as g,O as w,U as I,aw as y,e as k,d as E,f as C,g as A,h as j,j as S,aa as N,am as T,ai as V,m as D,q as L,k as P,R as _,T as q,z,t as B,p as G,y as K,B as M,V as O}from"./client.2b5e555d.js";import{C as R}from"./Code.44790881.js";function U(t){var n,e;return n=new O({props:{tip:t[7].includes(t[22]),$$slots:{default:[F]},$$scope:{ctx:t}}}),{c:function(){f(n.$$.fragment)},l:function(t){l(n.$$.fragment,t)},m:function(t,s){$(n,t,s),e=!0},p:function(t,e){var s={};4194432&e&&(s.tip=t[7].includes(t[22])),1048592&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i:function(t){e||(p(n.$$.fragment,t),e=!0)},o:function(t){v(n.$$.fragment,t),e=!1},d:function(t){h(n,t)}}}function F(t){var n;return{c:function(){n=B(t[4])},l:function(e){n=G(e,t[4])},m:function(t,e){S(t,n,e)},p:function(t,e){16&e&&K(n,t[4])},d:function(t){t&&A(n)}}}function H(t){var n,e,s,i=t[3]&&!t[22].hideArrow&&t[22].items&&U(t),c=t[15].default,u=z(c,t,t[20],null),o=u||function(t){var n,e,s=t[22].text+"";return{c:function(){n=k("span"),e=B(s)},l:function(t){n=E(t,"SPAN",{});var i=C(n);e=G(i,s),i.forEach(A)},m:function(t,s){S(t,n,s),P(n,e)},p:function(t,n){4194304&n&&s!==(s=t[22].text+"")&&K(e,s)},d:function(t){t&&A(n)}}}(t);return{c:function(){n=k("div"),i&&i.c(),e=D(),o&&o.c(),this.h()},l:function(t){n=E(t,"DIV",{class:!0});var s=C(n);i&&i.l(s),e=L(s),o&&o.l(s),s.forEach(A),this.h()},h:function(){j(n,"class","flex items-center")},m:function(t,c){S(t,n,c),i&&i.m(n,null),P(n,e),o&&o.m(n,null),s=!0},p:function(t,s){t[3]&&!t[22].hideArrow&&t[22].items?i?(i.p(t,s),4194312&s&&p(i,1)):((i=U(t)).c(),p(i,1),i.m(n,e)):i&&(_(),v(i,1,1,(function(){i=null})),q()),u?u.p&&1048576&s&&M(u,c,t,t[20],s,null,null):o&&o.p&&4194304&s&&o.p(t,s)},i:function(t){s||(p(i),p(o,t),s=!0)},o:function(t){v(i),v(o,t),s=!1},d:function(t){t&&A(n),i&&i.d(),o&&o.d(t)}}}function J(t){for(var n,e,s,i,c=[t[9],{items:t[22].items},{level:t[2]+1}],u={},o=0;o<c.length;o+=1)u=a(u,c[o]);return(e=new Y({props:u})).$on("click",t[18]),e.$on("select",t[19]),{c:function(){n=k("div"),f(e.$$.fragment),this.h()},l:function(t){n=E(t,"DIV",{class:!0});var s=C(n);l(e.$$.fragment,s),s.forEach(A),this.h()},h:function(){j(n,"class","ml-6")},m:function(t,s){S(t,n,s),$(e,n,null),i=!0},p:function(t,n){var s=4194820&n?x(c,[512&n&&d(t[9]),4194304&n&&{items:t[22].items},4&n&&{level:t[2]+1}]):{};e.$set(s)},i:function(t){i||(p(e.$$.fragment,t),s||N((function(){(s=T(n,V,{})).start()})),i=!0)},o:function(t){v(e.$$.fragment,t),i=!1},d:function(t){t&&A(n),h(e)}}}function Q(t){var n,e,s,i,c=t[22].items&&t[7].includes(t[22]),u=[{item:t[22]},t[9],t[22],{selected:t[5]&&t[0]===t[22]},{selectedClasses:t[6]}];for(var o={$$slots:{default:[H]},$$scope:{ctx:t}},r=0;r<u.length;r+=1)o=a(o,u[r]);(e=new y({props:o})).$on("click",(function(){for(var n,e=arguments.length,s=new Array(e),i=0;i<e;i++)s[i]=arguments[i];return(n=t)[16].apply(n,[t[22]].concat(s))})),e.$on("click",t[17]);var m=c&&J(t);return{c:function(){n=k("span"),f(e.$$.fragment),s=D(),m&&m.c(),this.h()},l:function(t){n=E(t,"SPAN",{slot:!0});var i=C(n);l(e.$$.fragment,i),s=L(i),m&&m.l(i),i.forEach(A),this.h()},h:function(){j(n,"slot","item")},m:function(t,c){S(t,n,c),$(e,n,null),P(n,s),m&&m.m(n,null),i=!0},p:function(s,i){t=s;var o=4194913&i?x(u,[4194304&i&&{item:t[22]},512&i&&d(t[9]),4194304&i&&d(t[22]),4194337&i&&{selected:t[5]&&t[0]===t[22]},64&i&&{selectedClasses:t[6]}]):{};5243032&i&&(o.$$scope={dirty:i,ctx:t}),e.$set(o),4194432&i&&(c=t[22].items&&t[7].includes(t[22])),c?m?(m.p(t,i),4194432&i&&p(m,1)):((m=J(t)).c(),p(m,1),m.m(n,null)):m&&(_(),v(m,1,1,(function(){m=null})),q())},i:function(t){i||(p(e.$$.fragment,t),p(m),i=!0)},o:function(t){v(e.$$.fragment,t),v(m),i=!1},d:function(t){t&&A(n),h(e),m&&m.d()}}}function W(t){for(var n,e,s=[{items:t[1]},t[9]],i={$$slots:{item:[Q,function(t){return{22:t.item}},function(t){return t.item?4194304:0}]},$$scope:{ctx:t}},c=0;c<s.length;c+=1)i=a(i,s[c]);return n=new r({props:i}),{c:function(){f(n.$$.fragment)},l:function(t){l(n.$$.fragment,t)},m:function(t,s){$(n,t,s),e=!0},p:function(t,e){var i=m(e,1)[0],c=514&i?x(s,[2&i&&{items:t[1]},512&i&&d(t[9])]):{};5243133&i&&(c.$$scope={dirty:i,ctx:t}),n.$set(c)},i:function(t){e||(p(n.$$.fragment,t),e=!0)},o:function(t){v(n.$$.fragment,t),e=!1},d:function(t){h(n,t)}}}function X(t,n,e){var s=n.items,i=void 0===s?[]:s,c=n.level,u=void 0===c?0:c,o=n.showExpandIcon,r=void 0===o||o,f=n.expandIcon,l=void 0===f?"arrow_right":f,$=n.selectable,m=void 0===$||$,x=n.selected,d=void 0===x?null:x,p=n.selectedClasses,v=void 0===p?"bg-primary-trans":p,h=[],y=b();function k(t){y("select",t),m&&!t.items&&e(0,d=t),e(7,h=t&&!h.includes(t)?[].concat(w(h),[t]):h.filter((function(n){return n!==t})))}var E=n,C=E.$$slots,A=void 0===C?{}:C,j=E.$$scope;return t.$set=function(t){e(9,n=a(a({},n),g(t))),"items"in t&&e(1,i=t.items),"level"in t&&e(2,u=t.level),"showExpandIcon"in t&&e(3,r=t.showExpandIcon),"expandIcon"in t&&e(4,l=t.expandIcon),"selectable"in t&&e(5,m=t.selectable),"selected"in t&&e(0,d=t.selected),"selectedClasses"in t&&e(6,v=t.selectedClasses),"$$scope"in t&&e(20,j=t.$$scope)},n=g(n),[d,i,u,r,l,m,v,h,k,n,"","",!1,!1,!1,A,function(t){return k(t)},function(n){I(t,n)},function(n){I(t,n)},function(n){I(t,n)},j]}var Y=function(a){t(f,o);var r=n(f);function f(t){var n;return e(this,f),n=r.call(this),s(c(n),t,X,W,i,{items:1,value:10,text:11,dense:12,navigation:13,select:14,level:2,showExpandIcon:3,expandIcon:4,selectable:5,selected:0,selectedClasses:6}),n}return u(f,[{key:"value",get:function(){return this.$$.ctx[10]}},{key:"text",get:function(){return this.$$.ctx[11]}},{key:"dense",get:function(){return this.$$.ctx[12]}},{key:"navigation",get:function(){return this.$$.ctx[13]}},{key:"select",get:function(){return this.$$.ctx[14]}}]),f}();function Z(t){var n,e,s,i,c,u,o,a;return(c=new Y({props:{items:[{text:"test",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4"}]}]},{text:"test2",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4"}]},{text:"test3",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4"}]}]}})).$on("select",t[1]),o=new R({props:{code:'<script>\n  import { Treeview } from "smelte";\n<\/script>\n\n<Treeview items={[\n  {\n    text: "test",\n    items: [\n      { text: "subtest" },\n      { text: "subtest2" },\n      { text: "subtest3" },\n      { text: "subtest4", \n        items: [\n          { text: "subtest" },\n          { text: "subtest2" },\n          { text: "subtest3" },\n          { text: "subtest4" },\n        ]\n      },\n    ]\n  },\n  {\n    text: "test2",\n    items: [\n      { text: "subtest" },\n      { text: "subtest2" },\n      { text: "subtest3" },\n      { text: "subtest4" },\n    ]\n  },\n  {\n    text: "test3",\n    items: [\n      { text: "subtest" },\n      { text: "subtest2" },\n      { text: "subtest3" },\n      { text: "subtest4" },\n    ]\n  }\n]} />'}}),{c:function(){n=k("small"),e=B("I selected "),s=B(t[0]),i=D(),f(c.$$.fragment),u=D(),f(o.$$.fragment)},l:function(a){n=E(a,"SMALL",{});var r=C(n);e=G(r,"I selected "),s=G(r,t[0]),r.forEach(A),i=L(a),l(c.$$.fragment,a),u=L(a),l(o.$$.fragment,a)},m:function(t,r){S(t,n,r),P(n,e),P(n,s),S(t,i,r),$(c,t,r),S(t,u,r),$(o,t,r),a=!0},p:function(t,n){var e=m(n,1)[0];(!a||1&e)&&K(s,t[0])},i:function(t){a||(p(c.$$.fragment,t),p(o.$$.fragment,t),a=!0)},o:function(t){v(c.$$.fragment,t),v(o.$$.fragment,t),a=!1},d:function(t){t&&A(n),t&&A(i),h(c,t),t&&A(u),h(o,t)}}}function tt(t,n,e){var s="nothing";return[s,function(t){return e(0,s=t.detail.text)}]}var nt=function(u){t(r,o);var a=n(r);function r(t){var n;return e(this,r),n=a.call(this),s(c(n),t,tt,Z,i,{}),n}return r}();export default nt;
