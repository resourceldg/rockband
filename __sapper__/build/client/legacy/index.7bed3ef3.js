import{_ as a,a as n,b as s,i as t,s as i,c,S as o,e,t as l,m as r,d as u,f as d,p as f,g as v,q as p,h as b,j as m,k as h,a6 as y,W as g,L as x,l as $,y as w,n as j,M as L,J as P,G as k,K as E,U as S,az as U}from"./client.2b5e555d.js";import"./index.74347c9e.js";function q(a){var n,s,t,i,c,o;return{c:function(){n=e("label"),s=l(a[1]),t=r(),i=e("input"),this.h()},l:function(c){n=u(c,"LABEL",{});var o=d(n);s=f(o,a[1]),o.forEach(v),t=p(c),i=u(c,"INPUT",{type:!0,class:!0,min:!0,max:!0,step:!0,disabled:!0,style:!0}),this.h()},h:function(){b(i,"type","range"),b(i,"class",a[7]),b(i,"min",a[3]),b(i,"max",a[4]),b(i,"step",a[5]),i.disabled=a[2],b(i,"style",a[6])},m:function(e,l){m(e,n,l),h(n,s),m(e,t,l),m(e,i,l),y(i,a[0]),c||(o=[g(a[8].call(null,i)),x(i,"change",a[12]),x(i,"input",a[12]),x(i,"change",a[11])],c=!0)},p:function(a,n){var t=$(n,1)[0];2&t&&w(s,a[1]),128&t&&b(i,"class",a[7]),8&t&&b(i,"min",a[3]),16&t&&b(i,"max",a[4]),32&t&&b(i,"step",a[5]),4&t&&(i.disabled=a[2]),64&t&&b(i,"style",a[6]),1&t&&y(i,a[0])},i:j,o:j,d:function(a){a&&v(n),a&&v(t),a&&v(i),c=!1,L(o)}}}function z(a,n,s){var t,i,c,o=n.value,e=void 0===o?0:o,l=n.label,r=void 0===l?"":l,u=n.color,d=void 0===u?"primary":u,f=n.disabled,v=void 0!==f&&f,p=n.min,b=void 0===p?0:p,m=n.max,h=void 0===m?100:m,y=n.step,g=void 0===y?null:y,x="bg-".concat(d,"-50 w-full rounded cursor-pointer"),$=n.classes,w=void 0===$?x:$,j=new P(w,x),L=function(a){return"var(".concat(a,")")};return a.$set=function(a){s(17,n=k(k({},n),E(a))),"value"in a&&s(0,e=a.value),"label"in a&&s(1,r=a.label),"color"in a&&s(9,d=a.color),"disabled"in a&&s(2,v=a.disabled),"min"in a&&s(3,b=a.min),"max"in a&&s(4,h=a.max),"step"in a&&s(5,g=a.step),"classes"in a&&s(10,w=a.classes)},a.$$.update=function(){if(24&a.$$.dirty){var o=100/(h-b);s(13,t=function(a){return(a-b)*o})}if(s(7,c=j.flush().add(w,!0,x).add(n.class).get()),8709&a.$$.dirty){var l=L("--color-".concat(d,"-500")),r=L("--color-".concat(d,"-200")),u=t(e);s(6,i=v?"":"background: linear-gradient(to right, ".concat(l," 0%, ").concat(l," ").concat(u,"%, ").concat(r," ").concat(u,"%, ").concat(r," 100%); --bg: ").concat(l,"; --bg-focus: ").concat(l))}},n=E(n),[e,r,v,b,h,g,i,c,function(a){if("undefined"==typeof window)return!1;var n=L("--color-".concat(d,"-500"));a.style.setProperty("--bg",n),a.style.setProperty("--bg-focus",n)},d,w,function(n){S(a,n)},function(){e=U(this.value),s(0,e)}]}var A=function(e){a(r,o);var l=n(r);function r(a){var n;return s(this,r),n=l.call(this),t(c(n),a,z,q,i,{value:0,label:1,color:9,disabled:2,min:3,max:4,step:5,classes:10}),n}return r}();export{A as S};
