import{S as t,i as e,s,C as n,ag as l,j as c,m as a,o as i,E as r,$ as o,p as $,q as u,r as m,J as x,G as f,N as d,am as p,e as b,c as g,a as h,d as v,b as w,f as I,a4 as E,ad as C,ab as A,h as k,l as y,g as S,L as j,M as L,v as N,t as D,k as M,u as P,x as T,O as V}from"./client.e3021870.js";import{C as q}from"./Code.c843ff04.js";function G(t){let e,s;return e=new V({props:{tip:t[7].includes(t[22]),$$slots:{default:[J]},$$scope:{ctx:t}}}),{c(){c(e.$$.fragment)},l(t){a(e.$$.fragment,t)},m(t,n){i(e,t,n),s=!0},p(t,s){const n={};4194432&s&&(n.tip=t[7].includes(t[22])),1048592&s&&(n.$$scope={dirty:s,ctx:t}),e.$set(n)},i(t){s||($(e.$$.fragment,t),s=!0)},o(t){u(e.$$.fragment,t),s=!1},d(t){m(e,t)}}}function J(t){let e;return{c(){e=D(t[4])},l(s){e=M(s,t[4])},m(t,s){I(t,e,s)},p(t,s){16&s&&P(e,t[4])},d(t){t&&v(e)}}}function O(t){let e,s,n,l=t[3]&&!t[22].hideArrow&&t[22].items&&G(t);const c=t[15].default,a=N(c,t,t[20],null),i=a||function(t){let e,s,n=t[22].text+"";return{c(){e=b("span"),s=D(n)},l(t){e=g(t,"SPAN",{});var l=h(e);s=M(l,n),l.forEach(v)},m(t,n){I(t,e,n),S(e,s)},p(t,e){4194304&e&&n!==(n=t[22].text+"")&&P(s,n)},d(t){t&&v(e)}}}(t);return{c(){e=b("div"),l&&l.c(),s=k(),i&&i.c(),this.h()},l(t){e=g(t,"DIV",{class:!0});var n=h(e);l&&l.l(n),s=y(n),i&&i.l(n),n.forEach(v),this.h()},h(){w(e,"class","flex items-center")},m(t,c){I(t,e,c),l&&l.m(e,null),S(e,s),i&&i.m(e,null),n=!0},p(t,n){t[3]&&!t[22].hideArrow&&t[22].items?l?(l.p(t,n),4194312&n&&$(l,1)):(l=G(t),l.c(),$(l,1),l.m(e,s)):l&&(j(),u(l,1,1,()=>{l=null}),L()),a?a.p&&1048576&n&&T(a,c,t,t[20],n,null,null):i&&i.p&&4194304&n&&i.p(t,n)},i(t){n||($(l),$(i,t),n=!0)},o(t){u(l),u(i,t),n=!1},d(t){t&&v(e),l&&l.d(),i&&i.d(t)}}}function _(t){let e,s,l,x;const f=[t[9],{items:t[22].items},{level:t[2]+1}];let d={};for(let t=0;t<f.length;t+=1)d=n(d,f[t]);return s=new H({props:d}),s.$on("click",t[18]),s.$on("select",t[19]),{c(){e=b("div"),c(s.$$.fragment),this.h()},l(t){e=g(t,"DIV",{class:!0});var n=h(e);a(s.$$.fragment,n),n.forEach(v),this.h()},h(){w(e,"class","ml-6")},m(t,n){I(t,e,n),i(s,e,null),x=!0},p(t,e){const n=4194820&e?r(f,[512&e&&o(t[9]),4194304&e&&{items:t[22].items},4&e&&{level:t[2]+1}]):{};s.$set(n)},i(t){x||($(s.$$.fragment,t),l||E(()=>{l=C(e,A,{}),l.start()}),x=!0)},o(t){u(s.$$.fragment,t),x=!1},d(t){t&&v(e),m(s)}}}function z(t){let e,s,l,x,f=t[22].items&&t[7].includes(t[22]);const d=[{item:t[22]},t[9],t[22],{selected:t[5]&&t[0]===t[22]},{selectedClasses:t[6]}];let E={$$slots:{default:[O]},$$scope:{ctx:t}};for(let t=0;t<d.length;t+=1)E=n(E,d[t]);s=new p({props:E}),s.$on("click",(function(...e){return t[16](t[22],...e)})),s.$on("click",t[17]);let C=f&&_(t);return{c(){e=b("span"),c(s.$$.fragment),l=k(),C&&C.c(),this.h()},l(t){e=g(t,"SPAN",{slot:!0});var n=h(e);a(s.$$.fragment,n),l=y(n),C&&C.l(n),n.forEach(v),this.h()},h(){w(e,"slot","item")},m(t,n){I(t,e,n),i(s,e,null),S(e,l),C&&C.m(e,null),x=!0},p(n,l){t=n;const c=4194913&l?r(d,[4194304&l&&{item:t[22]},512&l&&o(t[9]),4194304&l&&o(t[22]),4194337&l&&{selected:t[5]&&t[0]===t[22]},64&l&&{selectedClasses:t[6]}]):{};5243032&l&&(c.$$scope={dirty:l,ctx:t}),s.$set(c),4194432&l&&(f=t[22].items&&t[7].includes(t[22])),f?C?(C.p(t,l),4194432&l&&$(C,1)):(C=_(t),C.c(),$(C,1),C.m(e,null)):C&&(j(),u(C,1,1,()=>{C=null}),L())},i(t){x||($(s.$$.fragment,t),$(C),x=!0)},o(t){u(s.$$.fragment,t),u(C),x=!1},d(t){t&&v(e),m(s),C&&C.d()}}}function B(t){let e,s;const x=[{items:t[1]},t[9]];let f={$$slots:{item:[z,({item:t})=>({22:t}),({item:t})=>t?4194304:0]},$$scope:{ctx:t}};for(let t=0;t<x.length;t+=1)f=n(f,x[t]);return e=new l({props:f}),{c(){c(e.$$.fragment)},l(t){a(e.$$.fragment,t)},m(t,n){i(e,t,n),s=!0},p(t,[s]){const n=514&s?r(x,[2&s&&{items:t[1]},512&s&&o(t[9])]):{};5243133&s&&(n.$$scope={dirty:s,ctx:t}),e.$set(n)},i(t){s||($(e.$$.fragment,t),s=!0)},o(t){u(e.$$.fragment,t),s=!1},d(t){m(e,t)}}}function F(t,e,s){let{items:l=[]}=e;let{level:c=0}=e,{showExpandIcon:a=!0}=e,{expandIcon:i="arrow_right"}=e,{selectable:r=!0}=e,{selected:o=null}=e,{selectedClasses:$="bg-primary-trans"}=e,u=[];const m=x();function p(t){m("select",t),r&&!t.items&&s(0,o=t),s(7,u=t&&!u.includes(t)?[...u,t]:u.filter(e=>e!==t))}let{$$slots:b={},$$scope:g}=e;return t.$set=t=>{s(9,e=n(n({},e),f(t))),"items"in t&&s(1,l=t.items),"level"in t&&s(2,c=t.level),"showExpandIcon"in t&&s(3,a=t.showExpandIcon),"expandIcon"in t&&s(4,i=t.expandIcon),"selectable"in t&&s(5,r=t.selectable),"selected"in t&&s(0,o=t.selected),"selectedClasses"in t&&s(6,$=t.selectedClasses),"$$scope"in t&&s(20,g=t.$$scope)},e=f(e),[o,l,c,a,i,r,$,u,p,e,"","",!1,!1,!1,b,t=>p(t),function(e){d(t,e)},function(e){d(t,e)},function(e){d(t,e)},g]}class H extends t{constructor(t){super(),e(this,t,F,B,s,{items:1,value:10,text:11,dense:12,navigation:13,select:14,level:2,showExpandIcon:3,expandIcon:4,selectable:5,selected:0,selectedClasses:6})}get value(){return this.$$.ctx[10]}get text(){return this.$$.ctx[11]}get dense(){return this.$$.ctx[12]}get navigation(){return this.$$.ctx[13]}get select(){return this.$$.ctx[14]}}function K(t){let e,s,n,l,r,o,x,f;return r=new H({props:{items:[{text:"test",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4"}]}]},{text:"test2",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4"}]},{text:"test3",items:[{text:"subtest"},{text:"subtest2"},{text:"subtest3"},{text:"subtest4"}]}]}}),r.$on("select",t[1]),x=new q({props:{code:'<script>\n  import { Treeview } from "smelte";\n<\/script>\n\n<Treeview items={[\n  {\n    text: "test",\n    items: [\n      { text: "subtest" },\n      { text: "subtest2" },\n      { text: "subtest3" },\n      { text: "subtest4", \n        items: [\n          { text: "subtest" },\n          { text: "subtest2" },\n          { text: "subtest3" },\n          { text: "subtest4" },\n        ]\n      },\n    ]\n  },\n  {\n    text: "test2",\n    items: [\n      { text: "subtest" },\n      { text: "subtest2" },\n      { text: "subtest3" },\n      { text: "subtest4" },\n    ]\n  },\n  {\n    text: "test3",\n    items: [\n      { text: "subtest" },\n      { text: "subtest2" },\n      { text: "subtest3" },\n      { text: "subtest4" },\n    ]\n  }\n]} />'}}),{c(){e=b("small"),s=D("I selected "),n=D(t[0]),l=k(),c(r.$$.fragment),o=k(),c(x.$$.fragment)},l(c){e=g(c,"SMALL",{});var i=h(e);s=M(i,"I selected "),n=M(i,t[0]),i.forEach(v),l=y(c),a(r.$$.fragment,c),o=y(c),a(x.$$.fragment,c)},m(t,c){I(t,e,c),S(e,s),S(e,n),I(t,l,c),i(r,t,c),I(t,o,c),i(x,t,c),f=!0},p(t,[e]){(!f||1&e)&&P(n,t[0])},i(t){f||($(r.$$.fragment,t),$(x.$$.fragment,t),f=!0)},o(t){u(r.$$.fragment,t),u(x.$$.fragment,t),f=!1},d(t){t&&v(e),t&&v(l),m(r,t),t&&v(o),m(x,t)}}}function Q(t,e,s){let n="nothing";return[n,t=>s(0,n=t.detail.text)]}export default class extends t{constructor(t){super(),e(this,t,Q,K,s,{})}}
