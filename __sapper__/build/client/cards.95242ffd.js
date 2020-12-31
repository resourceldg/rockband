import{S as t,i as e,s as n,j as a,h as r,m as s,l as o,o as i,f as l,p as d,q as c,r as m,d as $,e as p,c as f,a as h,b as u,n as g,t as v,k as b,g as y,B as x}from"./client.e3021870.js";import{C as w}from"./Code.c843ff04.js";import"./index.ab3e2d7d.js";import"./index.cda34478.js";import"./index.e5eee94b.js";import{P as k}from"./PropsTable.f4733062.js";import"./Card.712bf997.js";import{C}from"./index.9a8a628d.js";import{I as T}from"./index.5c5e592b.js";function j(t){let e,n,r;return n=new C.Title({props:{class:"dark:text-black",title:"The three little kittens",subheader:"A kitten poem",avatar:"https://placekitten.com/64/64"}}),{c(){e=p("div"),a(n.$$.fragment),this.h()},l(t){e=f(t,"DIV",{slot:!0});var a=h(e);s(n.$$.fragment,a),a.forEach($),this.h()},h(){u(e,"slot","title")},m(t,a){l(t,e,a),i(n,e,null),r=!0},p:g,i(t){r||(d(n.$$.fragment,t),r=!0)},o(t){c(n.$$.fragment,t),r=!1},d(t){t&&$(e),m(n)}}}function B(t){let e,n,r;return n=new T({props:{class:"w-full",src:"https://placekitten.com/300/200",alt:"kitty"}}),{c(){e=p("div"),a(n.$$.fragment),this.h()},l(t){e=f(t,"DIV",{slot:!0});var a=h(e);s(n.$$.fragment,a),a.forEach($),this.h()},h(){u(e,"slot","media")},m(t,a){l(t,e,a),i(n,e,null),r=!0},p:g,i(t){r||(d(n.$$.fragment,t),r=!0)},o(t){c(n.$$.fragment,t),r=!1},d(t){t&&$(e),m(n)}}}function I(t){let e,n,a,r,s,o,i,d;return{c(){e=p("div"),n=v("The three little kittens, they lost their mittens,\n    "),a=p("br"),r=v("\n    And they began to cry,\n    "),s=p("br"),o=v('\n    "Oh, mother dear, we sadly fear,\n    '),i=p("br"),d=v('\n    That we have lost our mittens."'),this.h()},l(t){e=f(t,"DIV",{slot:!0,class:!0});var l=h(e);n=b(l,"The three little kittens, they lost their mittens,\n    "),a=f(l,"BR",{}),r=b(l,"\n    And they began to cry,\n    "),s=f(l,"BR",{}),o=b(l,'\n    "Oh, mother dear, we sadly fear,\n    '),i=f(l,"BR",{}),d=b(l,'\n    That we have lost our mittens."'),l.forEach($),this.h()},h(){u(e,"slot","text"),u(e,"class","p-5 pb-0 pt-3 text-gray-700 body-2")},m(t,c){l(t,e,c),y(e,n),y(e,a),y(e,r),y(e,s),y(e,o),y(e,i),y(e,d)},d(t){t&&$(e)}}}function E(t){let e;return{c(){e=v("OK")},l(t){e=b(t,"OK")},m(t,n){l(t,e,n)},d(t){t&&$(e)}}}function D(t){let e;return{c(){e=v("Meow")},l(t){e=b(t,"Meow")},m(t,n){l(t,e,n)},d(t){t&&$(e)}}}function O(t){let e,n,g,v,b,w;return g=new x({props:{text:!0,$$slots:{default:[E]},$$scope:{ctx:t}}}),b=new x({props:{text:!0,$$slots:{default:[D]},$$scope:{ctx:t}}}),{c(){e=p("div"),n=p("div"),a(g.$$.fragment),v=r(),a(b.$$.fragment),this.h()},l(t){e=f(t,"DIV",{slot:!0});var a=h(e);n=f(a,"DIV",{class:!0});var r=h(n);s(g.$$.fragment,r),v=o(r),s(b.$$.fragment,r),r.forEach($),a.forEach($),this.h()},h(){u(n,"class","p-2"),u(e,"slot","actions")},m(t,a){l(t,e,a),y(e,n),i(g,n,null),y(n,v),i(b,n,null),w=!0},p(t,e){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),g.$set(n);const a={};1&e&&(a.$$scope={dirty:e,ctx:t}),b.$set(a)},i(t){w||(d(g.$$.fragment,t),d(b.$$.fragment,t),w=!0)},o(t){c(g.$$.fragment,t),c(b.$$.fragment,t),w=!1},d(t){t&&$(e),m(g),m(b)}}}function A(t){let e,n,a;return{c(){e=r(),n=r(),a=r()},l(t){e=o(t),n=o(t),a=o(t)},m(t,r){l(t,e,r),l(t,n,r),l(t,a,r)},p:g,i:g,o:g,d(t){t&&$(e),t&&$(n),t&&$(a)}}}function V(t){let e,n,p,f,h,u;return e=new C.Card({props:{class:"dark:bg-gray-200",$$slots:{default:[A],actions:[O],text:[I],media:[B],title:[j]},$$scope:{ctx:t}}}),p=new k({props:{data:[{prop:"hover",default:"true",description:"Enable hover elevation",type:"Boolean"},{prop:"elevation",default:"1",description:"Default elevation value",type:"Number"},{prop:"hoverElevation",default:"8",description:"Hover elevation value",type:"Number"},{prop:"classes",default:"rounded inline-flex flex-col overflow-hidden duration-200 ease-in",description:"String of root element classes",type:"String"}]}}),h=new w({props:{code:'<script>\n\timport {\n\t\tCard,\n\t\tButton,\n\t\tImage\n\t} from "smelte";\n<\/script>\n\n<Card.Card>\n\t<div slot="title">\n\t\t<Card.Title\n\t\t\ttitle="The three little kittens"\n\t\t\tsubheader="A kitten poem"\n\t\t\tavatar="https://placekitten.com/64/64"\n\t\t/>\n\t</div>\n\t<div slot="media">\n\t\t<Image\n\t\t\tclass="w-full"\n\t\t\tsrc="https://placekitten.com/300/200"\n\t\t\talt="kitty"\n\t\t/>\n\t</div>\n\t<div slot="text" class="p-5 pb-0 pt-3 text-gray-700 body-2">\n\t\tThe three little kittens, they lost their mittens,<br>\n\t\tAnd they began to cry,<br>\n\t\t"Oh, mother dear, we sadly fear,<br>\n\t\tThat we have lost our mittens."\n\t</div>\n\t<div slot="actions">\n\t\t<div class="p-2">\n\t\t\t<Button text>OK</Button>\n\t\t\t<Button text>Meow</Button>\n\t\t</div>\n\t</div>\n</Card.Card>'}}),{c(){a(e.$$.fragment),n=r(),a(p.$$.fragment),f=r(),a(h.$$.fragment)},l(t){s(e.$$.fragment,t),n=o(t),s(p.$$.fragment,t),f=o(t),s(h.$$.fragment,t)},m(t,a){i(e,t,a),l(t,n,a),i(p,t,a),l(t,f,a),i(h,t,a),u=!0},p(t,[n]){const a={};1&n&&(a.$$scope={dirty:n,ctx:t}),e.$set(a)},i(t){u||(d(e.$$.fragment,t),d(p.$$.fragment,t),d(h.$$.fragment,t),u=!0)},o(t){c(e.$$.fragment,t),c(p.$$.fragment,t),c(h.$$.fragment,t),u=!1},d(t){m(e,t),t&&$(n),m(p,t),t&&$(f),m(h,t)}}}export default class extends t{constructor(t){super(),e(this,t,null,V,n,{})}}
