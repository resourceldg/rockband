import{_ as n,a as t,b as a,i as e,c as o,S as r,s as c,D as i,e as s,t as u,m as f,q as l,d as $,f as m,o as p,g as d,p as h,r as v,h as g,j as b,k as y,u as k,l as w,v as S,w as x,x as B,Z as E,$ as q,a0 as A,n as D}from"./client.01ca4560.js";import{C as T}from"./Code.538820bc.js";import{T as H}from"./index.5f5d7018.js";import{S as I,N as V,n as C}from"./index.ef79972c.js";function N(n){var t;return{c:function(){t=u("Do something")},l:function(n){t=p(n,"Do something")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function j(n){var t,a,e;return(a=new i({props:{text:!0,$$slots:{default:[N]},$$scope:{ctx:n}}})).$on("click",n[7]),{c:function(){t=s("div"),l(a.$$.fragment),this.h()},l:function(n){t=$(n,"DIV",{slot:!0});var e=m(t);v(a.$$.fragment,e),e.forEach(d),this.h()},h:function(){g(t,"slot","action")},m:function(n,o){b(n,t,o),k(a,t,null),e=!0},p:function(n,t){var e={};32768&t&&(e.$$scope={dirty:t,ctx:n}),a.$set(e)},i:function(n){e||(S(a.$$.fragment,n),e=!0)},o:function(n){x(a.$$.fragment,n),e=!1},d:function(n){n&&d(t),B(a)}}}function F(n){var t,a,e;return{c:function(){t=s("div"),a=u("Have a nice day."),e=f()},l:function(n){t=$(n,"DIV",{});var o=m(t);a=p(o,"Have a nice day."),o.forEach(d),e=h(n)},m:function(n,o){b(n,t,o),y(t,a),b(n,e,o)},p:D,i:D,o:D,d:function(n){n&&d(t),n&&d(e)}}}function O(n){var t,a;return{c:function(){t=s("div"),a=u("Have a nice day.")},l:function(n){t=$(n,"DIV",{});var e=m(t);a=p(e,"Have a nice day."),e.forEach(d)},m:function(n,e){b(n,t,e),y(t,a)},d:function(n){n&&d(t)}}}function L(n){var t;return{c:function(){t=s("div"),this.h()},l:function(n){t=$(n,"DIV",{slot:!0}),m(t).forEach(d),this.h()},h:function(){g(t,"slot","action")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function P(n){var t,a,e;return{c:function(){t=s("div"),a=u("Something happened!"),e=f()},l:function(n){t=$(n,"DIV",{});var o=m(t);a=p(o,"Something happened!"),o.forEach(d),e=h(n)},m:function(n,o){b(n,t,o),y(t,a),b(n,e,o)},p:D,d:function(n){n&&d(t),n&&d(e)}}}function K(n){var t;return{c:function(){t=u("Show snackbar")},l:function(n){t=p(n,"Show snackbar")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function M(n){var t;return{c:function(){t=u("Show snackbar on top")},l:function(n){t=p(n,"Show snackbar on top")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function Q(n){var t;return{c:function(){t=u("Show snackbar on the bottom left")},l:function(n){t=p(n,"Show snackbar on the bottom left")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function U(n){var t;return{c:function(){t=u("Add Notification to queue")},l:function(n){t=p(n,"Add Notification to queue")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function Z(n){var t;return{c:function(){t=u("Alert message")},l:function(n){t=p(n,"Alert message")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function _(n){var t;return{c:function(){t=u("Error message")},l:function(n){t=p(n,"Error message")},m:function(n,a){b(n,t,a)},d:function(n){n&&d(t)}}}function z(n){var t,a,e,o,r,c,D,C,N,z,G,J,R,W,X,Y,nn,tn,an,en,on,rn,cn,sn,un,fn,ln,$n,mn,pn,dn,hn,vn,gn,bn,yn,kn,wn,Sn,xn,Bn,En,qn,An,Dn,Tn,Hn,In,Vn,Cn;function Nn(t){n[8].call(null,t)}var jn={$$slots:{default:[F],action:[j]},$$scope:{ctx:n}};function Fn(t){n[9].call(null,t)}void 0!==n[0]&&(jn.value=n[0]),nn=new I({props:jn}),E.push((function(){return q(nn,"value",Nn)}));var On={color:"alert",top:!0,$$slots:{default:[O]},$$scope:{ctx:n}};function Ln(t){n[10].call(null,t)}void 0!==n[1]&&(On.value=n[1]),en=new I({props:On}),E.push((function(){return q(en,"value",Fn)}));var Pn={noAction:!0,color:"error",timeout:2e3,left:!0,$$slots:{default:[P],action:[L]},$$scope:{ctx:n}};function Kn(t){n[14].call(null,t)}void 0!==n[2]&&(Pn.value=n[2]),cn=new I({props:Pn}),E.push((function(){return q(cn,"value",Ln)})),(ln=new i({props:{$$slots:{default:[K]},$$scope:{ctx:n}}})).$on("click",n[11]),(pn=new i({props:{color:"secondary",$$slots:{default:[M]},$$scope:{ctx:n}}})).$on("click",n[12]),(vn=new i({props:{color:"alert",$$slots:{default:[Q]},$$scope:{ctx:n}}})).$on("click",n[13]);var Mn={label:"Message text"};return void 0!==n[3]&&(Mn.value=n[3]),wn=new H({props:Mn}),E.push((function(){return q(wn,"value",Kn)})),(Bn=new i({props:{disabled:!n[3],$$slots:{default:[U]},$$scope:{ctx:n}}})).$on("click",n[4]),(qn=new i({props:{disabled:!n[3],color:"alert",$$slots:{default:[Z]},$$scope:{ctx:n}}})).$on("click",n[5]),(Dn=new i({props:{disabled:!n[3],color:"error",$$slots:{default:[_]},$$scope:{ctx:n}}})).$on("click",n[6]),Hn=new V({}),Vn=new T({props:{code:'<script>\n  import {\n    Snackbar,\n    notifier,\n    Button,\n    Notifications,\n    TextField\n  } from "smelte";\n\n  let showSnackbar = false;\n  let showSnackbarTop = false;\n  let showSnackbarBottomLeft = false;\n\n  function notify() {\n    notifier.notify(message);\n  }\n\n  let message = "";\n<\/script>\n\n<blockquote\n  class="pl-8 mt-2 mb-10 border-l-8 border-primary-300 text-lg"\n  cite="https://material.io/components/snackbars/#usage">\n  <p>Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn’t interrupt the user experience, and they don’t require user input to disappear.</p>\n\n  <h6 class="mt-8">Frequency</h6>\n  <p>Only one snackbar may be displayed at a time.</p>\n\n  <h6 class="mt-8">Actions</h6>\n  <p>A snackbar can contain a single action. Because they disappear automatically, the action shouldn’t be “Dismiss” or “Cancel.”</p>\n</blockquote>\n\n\n<Snackbar bind:value={showSnackbar}>\n  <div>Have a nice day.</div>\n  <div slot="action">\n    <Button text on:click={() => (showSnackbar = false)}>Do something</Button>\n  </div>\n</Snackbar>\n\n<Snackbar color="alert" top bind:value={showSnackbarTop}>\n  <div>Have a nice day.</div>\n</Snackbar>\n<Snackbar\n  noAction\n  color="error"\n  timeout={2000}\n  left\n  bind:value={showSnackbarBottomLeft}>\n  <div>Something happened!</div>\n  <div slot="action" />\n</Snackbar>\n\n<div class="py-2">\n  <Button\n    on:click={() => (showSnackbar = true)}\n  >Show snackbar</Button>\n</div>\n<div class="py-2">\n  <Button\n    color="secondary"\n    on:click={() => (showSnackbarTop = true)}\n  >Show snackbar on top</Button>\n</div>\n<div class="py-2">\n  <Button\n    color="alert"\n    on:click={() => (showSnackbarBottomLeft = true)}>Show snackbar on the bottom left</Button>\n</div>\n\n<p>Also Smelte comes with a simple notification queue implementation.</p>\n\n<TextField bind:value={message} label="New message" />\n<Button\n  disabled={!message}\n  on:click={notify}>Add message to queue</Button>\n\n<Notifications />\n'}}),{c:function(){t=s("blockquote"),a=s("p"),e=u("Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn’t interrupt the user experience, and they don’t require user input to disappear."),o=f(),r=s("h6"),c=u("Frequency"),D=f(),C=s("p"),N=u("Only one snackbar may be displayed at a time."),z=f(),G=s("h6"),J=u("Actions"),R=f(),W=s("p"),X=u("A snackbar can contain a single action. Because they disappear automatically, the action shouldn’t be “Dismiss” or “Cancel.”"),Y=f(),l(nn.$$.fragment),an=f(),l(en.$$.fragment),rn=f(),l(cn.$$.fragment),un=f(),fn=s("div"),l(ln.$$.fragment),$n=f(),mn=s("div"),l(pn.$$.fragment),dn=f(),hn=s("div"),l(vn.$$.fragment),gn=f(),bn=s("p"),yn=u("Also Smelte comes with a simple notification queue implementation."),kn=f(),l(wn.$$.fragment),xn=f(),l(Bn.$$.fragment),En=f(),l(qn.$$.fragment),An=f(),l(Dn.$$.fragment),Tn=f(),l(Hn.$$.fragment),In=f(),l(Vn.$$.fragment),this.h()},l:function(n){t=$(n,"BLOCKQUOTE",{class:!0,cite:!0});var i=m(t);a=$(i,"P",{});var s=m(a);e=p(s,"Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn’t interrupt the user experience, and they don’t require user input to disappear."),s.forEach(d),o=h(i),r=$(i,"H6",{class:!0});var u=m(r);c=p(u,"Frequency"),u.forEach(d),D=h(i),C=$(i,"P",{});var f=m(C);N=p(f,"Only one snackbar may be displayed at a time."),f.forEach(d),z=h(i),G=$(i,"H6",{class:!0});var l=m(G);J=p(l,"Actions"),l.forEach(d),R=h(i),W=$(i,"P",{});var g=m(W);X=p(g,"A snackbar can contain a single action. Because they disappear automatically, the action shouldn’t be “Dismiss” or “Cancel.”"),g.forEach(d),i.forEach(d),Y=h(n),v(nn.$$.fragment,n),an=h(n),v(en.$$.fragment,n),rn=h(n),v(cn.$$.fragment,n),un=h(n),fn=$(n,"DIV",{class:!0});var b=m(fn);v(ln.$$.fragment,b),b.forEach(d),$n=h(n),mn=$(n,"DIV",{class:!0});var y=m(mn);v(pn.$$.fragment,y),y.forEach(d),dn=h(n),hn=$(n,"DIV",{class:!0});var k=m(hn);v(vn.$$.fragment,k),k.forEach(d),gn=h(n),bn=$(n,"P",{class:!0});var w=m(bn);yn=p(w,"Also Smelte comes with a simple notification queue implementation."),w.forEach(d),kn=h(n),v(wn.$$.fragment,n),xn=h(n),v(Bn.$$.fragment,n),En=h(n),v(qn.$$.fragment,n),An=h(n),v(Dn.$$.fragment,n),Tn=h(n),v(Hn.$$.fragment,n),In=h(n),v(Vn.$$.fragment,n),this.h()},h:function(){g(r,"class","mt-8"),g(G,"class","mt-8"),g(t,"class","pl-8 mt-2 mb-10 border-l-8 border-primary-300 text-lg"),g(t,"cite","https://material.io/components/snackbars/#usage"),g(fn,"class","py-2"),g(mn,"class","py-2"),g(hn,"class","py-2"),g(bn,"class","mt-10")},m:function(n,i){b(n,t,i),y(t,a),y(a,e),y(t,o),y(t,r),y(r,c),y(t,D),y(t,C),y(C,N),y(t,z),y(t,G),y(G,J),y(t,R),y(t,W),y(W,X),b(n,Y,i),k(nn,n,i),b(n,an,i),k(en,n,i),b(n,rn,i),k(cn,n,i),b(n,un,i),b(n,fn,i),k(ln,fn,null),b(n,$n,i),b(n,mn,i),k(pn,mn,null),b(n,dn,i),b(n,hn,i),k(vn,hn,null),b(n,gn,i),b(n,bn,i),y(bn,yn),b(n,kn,i),k(wn,n,i),b(n,xn,i),k(Bn,n,i),b(n,En,i),k(qn,n,i),b(n,An,i),k(Dn,n,i),b(n,Tn,i),k(Hn,n,i),b(n,In,i),k(Vn,n,i),Cn=!0},p:function(n,t){var a=w(t,1)[0],e={};32769&a&&(e.$$scope={dirty:a,ctx:n}),!tn&&1&a&&(tn=!0,e.value=n[0],A((function(){return tn=!1}))),nn.$set(e);var o={};32768&a&&(o.$$scope={dirty:a,ctx:n}),!on&&2&a&&(on=!0,o.value=n[1],A((function(){return on=!1}))),en.$set(o);var r={};32768&a&&(r.$$scope={dirty:a,ctx:n}),!sn&&4&a&&(sn=!0,r.value=n[2],A((function(){return sn=!1}))),cn.$set(r);var c={};32768&a&&(c.$$scope={dirty:a,ctx:n}),ln.$set(c);var i={};32768&a&&(i.$$scope={dirty:a,ctx:n}),pn.$set(i);var s={};32768&a&&(s.$$scope={dirty:a,ctx:n}),vn.$set(s);var u={};!Sn&&8&a&&(Sn=!0,u.value=n[3],A((function(){return Sn=!1}))),wn.$set(u);var f={};8&a&&(f.disabled=!n[3]),32768&a&&(f.$$scope={dirty:a,ctx:n}),Bn.$set(f);var l={};8&a&&(l.disabled=!n[3]),32768&a&&(l.$$scope={dirty:a,ctx:n}),qn.$set(l);var $={};8&a&&($.disabled=!n[3]),32768&a&&($.$$scope={dirty:a,ctx:n}),Dn.$set($)},i:function(n){Cn||(S(nn.$$.fragment,n),S(en.$$.fragment,n),S(cn.$$.fragment,n),S(ln.$$.fragment,n),S(pn.$$.fragment,n),S(vn.$$.fragment,n),S(wn.$$.fragment,n),S(Bn.$$.fragment,n),S(qn.$$.fragment,n),S(Dn.$$.fragment,n),S(Hn.$$.fragment,n),S(Vn.$$.fragment,n),Cn=!0)},o:function(n){x(nn.$$.fragment,n),x(en.$$.fragment,n),x(cn.$$.fragment,n),x(ln.$$.fragment,n),x(pn.$$.fragment,n),x(vn.$$.fragment,n),x(wn.$$.fragment,n),x(Bn.$$.fragment,n),x(qn.$$.fragment,n),x(Dn.$$.fragment,n),x(Hn.$$.fragment,n),x(Vn.$$.fragment,n),Cn=!1},d:function(n){n&&d(t),n&&d(Y),B(nn,n),n&&d(an),B(en,n),n&&d(rn),B(cn,n),n&&d(un),n&&d(fn),B(ln),n&&d($n),n&&d(mn),B(pn),n&&d(dn),n&&d(hn),B(vn),n&&d(gn),n&&d(bn),n&&d(kn),B(wn,n),n&&d(xn),B(Bn,n),n&&d(En),B(qn,n),n&&d(An),B(Dn,n),n&&d(Tn),B(Hn,n),n&&d(In),B(Vn,n)}}}function G(n,t,a){var e=!1,o=!1,r=!1;var c="";return[e,o,r,c,function(){C.notify(c),a(3,c="")},function(){C.alert(c),a(3,c="")},function(){C.error(c),a(3,c="")},function(){return a(0,e=!1)},function(n){a(0,e=n)},function(n){a(1,o=n)},function(n){a(2,r=n)},function(){return a(0,e=!0)},function(){return a(1,o=!0)},function(){return a(2,r=!0)},function(n){a(3,c=n)}]}var J=function(i){n(u,r);var s=t(u);function u(n){var t;return a(this,u),t=s.call(this),e(o(t),n,G,z,c,{}),t}return u}();export default J;
