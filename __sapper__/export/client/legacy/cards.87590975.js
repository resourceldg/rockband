import{_ as t,a as n,b as e,i as a,c as o,S as r,s as i,q as s,m as c,r as f,p as l,u,j as d,l as m,v as $,w as p,x as h,g as v,e as g,d as y,f as b,h as x,n as w,t as k,o as C,k as T,D as j}from"./client.01ca4560.js";import{C as B}from"./Code.538820bc.js";import"./index.5f5d7018.js";import"./index.6c071eb2.js";import"./index.2d192613.js";import{P as I}from"./PropsTable.cb3ff32a.js";import"./Card.ff6e4e13.js";import{C as D}from"./index.96f327ec.js";import{I as E}from"./index.8aff71a2.js";function O(t){var n,e,a;return e=new D.Title({props:{class:"dark:text-black",title:"The three little kittens",subheader:"A kitten poem",avatar:"https://placekitten.com/64/64"}}),{c:function(){n=g("div"),s(e.$$.fragment),this.h()},l:function(t){n=y(t,"DIV",{slot:!0});var a=b(n);f(e.$$.fragment,a),a.forEach(v),this.h()},h:function(){x(n,"slot","title")},m:function(t,o){d(t,n,o),u(e,n,null),a=!0},p:w,i:function(t){a||($(e.$$.fragment,t),a=!0)},o:function(t){p(e.$$.fragment,t),a=!1},d:function(t){t&&v(n),h(e)}}}function A(t){var n,e,a;return e=new E({props:{class:"w-full",src:"https://placekitten.com/300/200",alt:"kitty"}}),{c:function(){n=g("div"),s(e.$$.fragment),this.h()},l:function(t){n=y(t,"DIV",{slot:!0});var a=b(n);f(e.$$.fragment,a),a.forEach(v),this.h()},h:function(){x(n,"slot","media")},m:function(t,o){d(t,n,o),u(e,n,null),a=!0},p:w,i:function(t){a||($(e.$$.fragment,t),a=!0)},o:function(t){p(e.$$.fragment,t),a=!1},d:function(t){t&&v(n),h(e)}}}function V(t){var n,e,a,o,r,i,s,c;return{c:function(){n=g("div"),e=k("The three little kittens, they lost their mittens,\n    "),a=g("br"),o=k("\n    And they began to cry,\n    "),r=g("br"),i=k('\n    "Oh, mother dear, we sadly fear,\n    '),s=g("br"),c=k('\n    That we have lost our mittens."'),this.h()},l:function(t){n=y(t,"DIV",{slot:!0,class:!0});var f=b(n);e=C(f,"The three little kittens, they lost their mittens,\n    "),a=y(f,"BR",{}),o=C(f,"\n    And they began to cry,\n    "),r=y(f,"BR",{}),i=C(f,'\n    "Oh, mother dear, we sadly fear,\n    '),s=y(f,"BR",{}),c=C(f,'\n    That we have lost our mittens."'),f.forEach(v),this.h()},h:function(){x(n,"slot","text"),x(n,"class","p-5 pb-0 pt-3 text-gray-700 body-2")},m:function(t,f){d(t,n,f),T(n,e),T(n,a),T(n,o),T(n,r),T(n,i),T(n,s),T(n,c)},d:function(t){t&&v(n)}}}function K(t){var n;return{c:function(){n=k("OK")},l:function(t){n=C(t,"OK")},m:function(t,e){d(t,n,e)},d:function(t){t&&v(n)}}}function M(t){var n;return{c:function(){n=k("Meow")},l:function(t){n=C(t,"Meow")},m:function(t,e){d(t,n,e)},d:function(t){t&&v(n)}}}function R(t){var n,e,a,o,r,i;return a=new j({props:{text:!0,$$slots:{default:[K]},$$scope:{ctx:t}}}),r=new j({props:{text:!0,$$slots:{default:[M]},$$scope:{ctx:t}}}),{c:function(){n=g("div"),e=g("div"),s(a.$$.fragment),o=c(),s(r.$$.fragment),this.h()},l:function(t){n=y(t,"DIV",{slot:!0});var i=b(n);e=y(i,"DIV",{class:!0});var s=b(e);f(a.$$.fragment,s),o=l(s),f(r.$$.fragment,s),s.forEach(v),i.forEach(v),this.h()},h:function(){x(e,"class","p-2"),x(n,"slot","actions")},m:function(t,s){d(t,n,s),T(n,e),u(a,e,null),T(e,o),u(r,e,null),i=!0},p:function(t,n){var e={};1&n&&(e.$$scope={dirty:n,ctx:t}),a.$set(e);var o={};1&n&&(o.$$scope={dirty:n,ctx:t}),r.$set(o)},i:function(t){i||($(a.$$.fragment,t),$(r.$$.fragment,t),i=!0)},o:function(t){p(a.$$.fragment,t),p(r.$$.fragment,t),i=!1},d:function(t){t&&v(n),h(a),h(r)}}}function S(t){var n,e,a;return{c:function(){n=c(),e=c(),a=c()},l:function(t){n=l(t),e=l(t),a=l(t)},m:function(t,o){d(t,n,o),d(t,e,o),d(t,a,o)},p:w,i:w,o:w,d:function(t){t&&v(n),t&&v(e),t&&v(a)}}}function N(t){var n,e,a,o,r,i;return n=new D.Card({props:{class:"dark:bg-gray-200",$$slots:{default:[S],actions:[R],text:[V],media:[A],title:[O]},$$scope:{ctx:t}}}),a=new I({props:{data:[{prop:"hover",default:"true",description:"Enable hover elevation",type:"Boolean"},{prop:"elevation",default:"1",description:"Default elevation value",type:"Number"},{prop:"hoverElevation",default:"8",description:"Hover elevation value",type:"Number"},{prop:"classes",default:"rounded inline-flex flex-col overflow-hidden duration-200 ease-in",description:"String of root element classes",type:"String"}]}}),r=new B({props:{code:'<script>\n\timport {\n\t\tCard,\n\t\tButton,\n\t\tImage\n\t} from "smelte";\n<\/script>\n\n<Card.Card>\n\t<div slot="title">\n\t\t<Card.Title\n\t\t\ttitle="The three little kittens"\n\t\t\tsubheader="A kitten poem"\n\t\t\tavatar="https://placekitten.com/64/64"\n\t\t/>\n\t</div>\n\t<div slot="media">\n\t\t<Image\n\t\t\tclass="w-full"\n\t\t\tsrc="https://placekitten.com/300/200"\n\t\t\talt="kitty"\n\t\t/>\n\t</div>\n\t<div slot="text" class="p-5 pb-0 pt-3 text-gray-700 body-2">\n\t\tThe three little kittens, they lost their mittens,<br>\n\t\tAnd they began to cry,<br>\n\t\t"Oh, mother dear, we sadly fear,<br>\n\t\tThat we have lost our mittens."\n\t</div>\n\t<div slot="actions">\n\t\t<div class="p-2">\n\t\t\t<Button text>OK</Button>\n\t\t\t<Button text>Meow</Button>\n\t\t</div>\n\t</div>\n</Card.Card>'}}),{c:function(){s(n.$$.fragment),e=c(),s(a.$$.fragment),o=c(),s(r.$$.fragment)},l:function(t){f(n.$$.fragment,t),e=l(t),f(a.$$.fragment,t),o=l(t),f(r.$$.fragment,t)},m:function(t,s){u(n,t,s),d(t,e,s),u(a,t,s),d(t,o,s),u(r,t,s),i=!0},p:function(t,e){var a=m(e,1)[0],o={};1&a&&(o.$$scope={dirty:a,ctx:t}),n.$set(o)},i:function(t){i||($(n.$$.fragment,t),$(a.$$.fragment,t),$(r.$$.fragment,t),i=!0)},o:function(t){p(n.$$.fragment,t),p(a.$$.fragment,t),p(r.$$.fragment,t),i=!1},d:function(t){h(n,t),t&&v(e),h(a,t),t&&v(o),h(r,t)}}}var P=function(s){t(f,r);var c=n(f);function f(t){var n;return e(this,f),n=c.call(this),a(o(n),t,null,N,i,{}),n}return f}();export default P;