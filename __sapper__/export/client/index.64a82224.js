import{S as s,i as a,s as e,e as l,t,h as i,c as n,a as o,k as r,d as c,l as d,b as u,f as p,g as $,a0 as b,Q as m,H as f,u as g,n as h,I as y,F as x,C as v,G as w,N as P,ap as j}from"./client.e3021870.js";import"./index.0266ede0.js";function k(s){let a,e,x,v,w,P,j;return{c(){a=l("label"),e=t(s[1]),x=i(),v=l("input"),this.h()},l(l){a=n(l,"LABEL",{});var t=o(a);e=r(t,s[1]),t.forEach(c),x=d(l),v=n(l,"INPUT",{type:!0,class:!0,min:!0,max:!0,step:!0,disabled:!0,style:!0}),this.h()},h(){u(v,"type","range"),u(v,"class",s[7]),u(v,"min",s[3]),u(v,"max",s[4]),u(v,"step",s[5]),v.disabled=s[2],u(v,"style",s[6])},m(l,t){p(l,a,t),$(a,e),p(l,x,t),p(l,v,t),b(v,s[0]),P||(j=[m(w=s[8].call(null,v)),f(v,"change",s[12]),f(v,"input",s[12]),f(v,"change",s[11])],P=!0)},p(s,[a]){2&a&&g(e,s[1]),128&a&&u(v,"class",s[7]),8&a&&u(v,"min",s[3]),16&a&&u(v,"max",s[4]),32&a&&u(v,"step",s[5]),4&a&&(v.disabled=s[2]),64&a&&u(v,"style",s[6]),1&a&&b(v,s[0])},i:h,o:h,d(s){s&&c(a),s&&c(x),s&&c(v),P=!1,y(j)}}}function E(s,a,e){let{value:l=0}=a,{label:t=""}=a,{color:i="primary"}=a,{disabled:n=!1}=a,{min:o=0}=a,{max:r=100}=a,{step:c=null}=a;const d=`bg-${i}-50 w-full rounded cursor-pointer`;let u,{classes:p=d}=a;const $=new x(p,d),b=s=>`var(${s})`;let m,f;return s.$set=s=>{e(17,a=v(v({},a),w(s))),"value"in s&&e(0,l=s.value),"label"in s&&e(1,t=s.label),"color"in s&&e(9,i=s.color),"disabled"in s&&e(2,n=s.disabled),"min"in s&&e(3,o=s.min),"max"in s&&e(4,r=s.max),"step"in s&&e(5,c=s.step),"classes"in s&&e(10,p=s.classes)},s.$$.update=()=>{if(24&s.$$.dirty){let s=100/(r-o);e(13,u=a=>(a-o)*s)}if(e(7,f=$.flush().add(p,!0,d).add(a.class).get()),8709&s.$$.dirty){let s=b(`--color-${i}-500`),a=b(`--color-${i}-200`),t=u(l);e(6,m=n?"":`background: linear-gradient(to right, ${s} 0%, ${s} ${t}%, ${a} ${t}%, ${a} 100%); --bg: ${s}; --bg-focus: ${s}`)}},a=w(a),[l,t,n,o,r,c,m,f,function(s){if("undefined"==typeof window)return!1;let a=b(`--color-${i}-500`);s.style.setProperty("--bg",a),s.style.setProperty("--bg-focus",a)},i,p,function(a){P(s,a)},function(){l=j(this.value),e(0,l)}]}class I extends s{constructor(s){super(),a(this,s,E,k,e,{value:0,label:1,color:9,disabled:2,min:3,max:4,step:5,classes:10})}}export{I as S};
