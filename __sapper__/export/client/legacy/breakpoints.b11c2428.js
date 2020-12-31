import{_ as n,a as t,b as a,i as e,c as r,S as s,s as o,e as i,t as c,m as u,o as f,d as h,f as m,p,g as l,q as d,r as w,h as g,j as b,k,u as $,n as v,v as j,w as y,x as z}from"./client.2b5e555d.js";import{C as E}from"./Code.44790881.js";function S(n){var t,a,e,r,s,o,S,P,x,C,B,F,q,A,D,H,I,N;return B=new E({props:{code:'\n    import breakpoints from "smelte/breakpoints";\n\n    const bp = breakpoints();\n    $: show = $bp !== "sm";\n\n    {#if show}\n      ...\n    {/if}\n  '}}),I=new E({props:{code:'\n  function defaultCalc(width) {\n    if (width > 1279) {\n      return "xl";\n    }\n    if (width > 1023) {\n      return "lg";\n    }\n    if (width > 767) {\n      return "md";\n    }\n    return "sm";\n  }'}}),{c:function(){t=i("div"),a=i("h4"),e=c("Breakpoints helper store"),r=u(),s=i("p"),o=c("Sometimes it's useful to know about your current window breakpoint size to\n    order to make any adjustments when browser window gets resized. Smelte comes\n    with a helper store just for that."),S=u(),P=i("p"),x=c("For instance, navigation drawer on this page should hide programmatically\n    after hitting small window size breakpoint."),C=u(),f(B.$$.fragment),F=u(),q=i("p"),A=i("span"),D=c("breakpoints"),H=c("\n    accepts one function argument which returns breakpoint name.\n    "),f(I.$$.fragment),this.h()},l:function(n){t=h(n,"DIV",{});var i=m(t);a=h(i,"H4",{class:!0});var c=m(a);e=p(c,"Breakpoints helper store"),c.forEach(l),r=d(i),s=h(i,"P",{});var u=m(s);o=p(u,"Sometimes it's useful to know about your current window breakpoint size to\n    order to make any adjustments when browser window gets resized. Smelte comes\n    with a helper store just for that."),u.forEach(l),S=d(i),P=h(i,"P",{});var f=m(P);x=p(f,"For instance, navigation drawer on this page should hide programmatically\n    after hitting small window size breakpoint."),f.forEach(l),C=d(i),w(B.$$.fragment,i),F=d(i),q=h(i,"P",{});var g=m(q);A=h(g,"SPAN",{class:!0});var b=m(A);D=p(b,"breakpoints"),b.forEach(l),H=p(g,"\n    accepts one function argument which returns breakpoint name.\n    "),w(I.$$.fragment,g),g.forEach(l),i.forEach(l),this.h()},h:function(){g(a,"class","pb-8"),g(A,"class","code-inline")},m:function(n,i){b(n,t,i),k(t,a),k(a,e),k(t,r),k(t,s),k(s,o),k(t,S),k(t,P),k(P,x),k(t,C),$(B,t,null),k(t,F),k(t,q),k(q,A),k(A,D),k(q,H),$(I,q,null),N=!0},p:v,i:function(n){N||(j(B.$$.fragment,n),j(I.$$.fragment,n),N=!0)},o:function(n){y(B.$$.fragment,n),y(I.$$.fragment,n),N=!1},d:function(n){n&&l(t),z(B),z(I)}}}var P=function(i){n(u,s);var c=t(u);function u(n){var t;return a(this,u),t=c.call(this),e(r(t),n,null,S,o,{}),t}return u}();export default P;
