import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, X as validate_store, Y as component_subscribe, v as validate_slots, aB as darkMode, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, g as attr_dev, f as add_location, h as insert_dev, j as append_dev, q as mount_component, z as set_data_dev, r as transition_in, u as transition_out, w as destroy_component } from './client.4c142522.js';
import { C as Code } from './Code.497e1b62.js';

/* src/routes/dark-mode.svelte generated by Svelte v3.24.0 */
const file = "src/routes/dark-mode.svelte";

function create_fragment(ctx) {
  let h4;
  let t0;
  let t1;
  let p0;
  let t2;
  let a;
  let t3;
  let t4;
  let t5;
  let code0;
  let t6;
  let p1;
  let t7;
  let span0;
  let t8;
  let t9;
  let t10;
  let code1;
  let t11;
  let p2;
  let t12;
  let span1;
  let t13;
  let t14;
  let t15;
  let div;
  let t16;
  let t17_value = (
  /*$darkMode*/
  ctx[0] ? "dark" : "light") + "";
  let t17;
  let t18;
  let t19;
  let code2;
  let t20;
  let p3;
  let t21;
  let span2;
  let t22;
  let t23;
  let current;
  code0 = new Code({
    props: {
      code: `<button bind:value={$darkMode}>Toggle dark mode</button>`
    },
    $$inline: true
  });
  code1 = new Code({
    props: {
      code: `
backgroundColor: ["dark", "dark-hover", "hover"],
borderColor: ["dark", "dark-focus"],
textColor: ["dark", "dark-hover", "dark-active"]
`
    },
    $$inline: true
  });
  code2 = new Code({
    props: {
      code: `
<div class="duration-200 ease-in p-10 my-10 bg-black dark:bg-white text-white dark:text-black">
  I am a {$darkMode ? "dark" : "light"} div.
</div>
`
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      h4 = element("h4");
      t0 = text("Dark mode");
      t1 = space();
      p0 = element("p");
      t2 = text("Smelte uses css pseudo-class variant\n  ");
      a = element("a");
      t3 = text("feature");
      t4 = text("\n  of Tailwind to enable dark mode. Basic dark mode switch looks like this:");
      t5 = space();
      create_component(code0.$$.fragment);
      t6 = space();
      p1 = element("p");
      t7 = text("This will append\n  ");
      span0 = element("span");
      t8 = text("mode-dark");
      t9 = text("\n  class to the document body which will enable all generated classes preceded by\n  pseudo-class \"dark:\". By default smelte generates following variants:");
      t10 = space();
      create_component(code1.$$.fragment);
      t11 = space();
      p2 = element("p");
      t12 = text("Now you can use dark theme classes like\n  ");
      span1 = element("span");
      t13 = text("dark:bg-white");
      t14 = text("\n  (try using the theme toggle on the top right).");
      t15 = space();
      div = element("div");
      t16 = text("I am a ");
      t17 = text(t17_value);
      t18 = text(" div.");
      t19 = space();
      create_component(code2.$$.fragment);
      t20 = space();
      p3 = element("p");
      t21 = text("If you don't need dark mode at all, you can pass\n  ");
      span2 = element("span");
      t22 = text("darkMode: false");
      t23 = text("\n  to the smelte-rollup-plugin and it will generate no extra CSS.");
      this.h();
    },
    l: function claim(nodes) {
      h4 = claim_element(nodes, "H4", {
        class: true
      });
      var h4_nodes = children(h4);
      t0 = claim_text(h4_nodes, "Dark mode");
      h4_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      p0 = claim_element(nodes, "P", {});
      var p0_nodes = children(p0);
      t2 = claim_text(p0_nodes, "Smelte uses css pseudo-class variant\n  ");
      a = claim_element(p0_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      t3 = claim_text(a_nodes, "feature");
      a_nodes.forEach(detach_dev);
      t4 = claim_text(p0_nodes, "\n  of Tailwind to enable dark mode. Basic dark mode switch looks like this:");
      p0_nodes.forEach(detach_dev);
      t5 = claim_space(nodes);
      claim_component(code0.$$.fragment, nodes);
      t6 = claim_space(nodes);
      p1 = claim_element(nodes, "P", {});
      var p1_nodes = children(p1);
      t7 = claim_text(p1_nodes, "This will append\n  ");
      span0 = claim_element(p1_nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      t8 = claim_text(span0_nodes, "mode-dark");
      span0_nodes.forEach(detach_dev);
      t9 = claim_text(p1_nodes, "\n  class to the document body which will enable all generated classes preceded by\n  pseudo-class \"dark:\". By default smelte generates following variants:");
      p1_nodes.forEach(detach_dev);
      t10 = claim_space(nodes);
      claim_component(code1.$$.fragment, nodes);
      t11 = claim_space(nodes);
      p2 = claim_element(nodes, "P", {});
      var p2_nodes = children(p2);
      t12 = claim_text(p2_nodes, "Now you can use dark theme classes like\n  ");
      span1 = claim_element(p2_nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t13 = claim_text(span1_nodes, "dark:bg-white");
      span1_nodes.forEach(detach_dev);
      t14 = claim_text(p2_nodes, "\n  (try using the theme toggle on the top right).");
      p2_nodes.forEach(detach_dev);
      t15 = claim_space(nodes);
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      t16 = claim_text(div_nodes, "I am a ");
      t17 = claim_text(div_nodes, t17_value);
      t18 = claim_text(div_nodes, " div.");
      div_nodes.forEach(detach_dev);
      t19 = claim_space(nodes);
      claim_component(code2.$$.fragment, nodes);
      t20 = claim_space(nodes);
      p3 = claim_element(nodes, "P", {});
      var p3_nodes = children(p3);
      t21 = claim_text(p3_nodes, "If you don't need dark mode at all, you can pass\n  ");
      span2 = claim_element(p3_nodes, "SPAN", {
        class: true
      });
      var span2_nodes = children(span2);
      t22 = claim_text(span2_nodes, "darkMode: false");
      span2_nodes.forEach(detach_dev);
      t23 = claim_text(p3_nodes, "\n  to the smelte-rollup-plugin and it will generate no extra CSS.");
      p3_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h4, "class", "pb-8");
      add_location(h4, file, 5, 0, 94);
      attr_dev(a, "class", "a");
      attr_dev(a, "href", "https://tailwindcss.com/docs/configuring-variants/");
      add_location(a, file, 8, 2, 171);
      add_location(p0, file, 6, 0, 126);
      attr_dev(span0, "class", "code-inline");
      add_location(span0, file, 18, 2, 444);
      add_location(p1, file, 16, 0, 419);
      attr_dev(span1, "class", "code-inline");
      add_location(span1, file, 32, 2, 853);
      add_location(p2, file, 30, 0, 805);
      attr_dev(div, "class", "duration-200 ease-in p-10 my-10 bg-black dark:bg-white text-white\n  dark:text-black");
      add_location(div, file, 36, 0, 955);
      attr_dev(span2, "class", "code-inline");
      add_location(span2, file, 51, 2, 1336);
      add_location(p3, file, 49, 0, 1279);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h4, anchor);
      append_dev(h4, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, p0, anchor);
      append_dev(p0, t2);
      append_dev(p0, a);
      append_dev(a, t3);
      append_dev(p0, t4);
      insert_dev(target, t5, anchor);
      mount_component(code0, target, anchor);
      insert_dev(target, t6, anchor);
      insert_dev(target, p1, anchor);
      append_dev(p1, t7);
      append_dev(p1, span0);
      append_dev(span0, t8);
      append_dev(p1, t9);
      insert_dev(target, t10, anchor);
      mount_component(code1, target, anchor);
      insert_dev(target, t11, anchor);
      insert_dev(target, p2, anchor);
      append_dev(p2, t12);
      append_dev(p2, span1);
      append_dev(span1, t13);
      append_dev(p2, t14);
      insert_dev(target, t15, anchor);
      insert_dev(target, div, anchor);
      append_dev(div, t16);
      append_dev(div, t17);
      append_dev(div, t18);
      insert_dev(target, t19, anchor);
      mount_component(code2, target, anchor);
      insert_dev(target, t20, anchor);
      insert_dev(target, p3, anchor);
      append_dev(p3, t21);
      append_dev(p3, span2);
      append_dev(span2, t22);
      append_dev(p3, t23);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      if ((!current || dirty &
      /*$darkMode*/
      1) && t17_value !== (t17_value = (
      /*$darkMode*/
      ctx[0] ? "dark" : "light") + "")) set_data_dev(t17, t17_value);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(code0.$$.fragment, local);
      transition_in(code1.$$.fragment, local);
      transition_in(code2.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(code0.$$.fragment, local);
      transition_out(code1.$$.fragment, local);
      transition_out(code2.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(h4);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(p0);
      if (detaching) detach_dev(t5);
      destroy_component(code0, detaching);
      if (detaching) detach_dev(t6);
      if (detaching) detach_dev(p1);
      if (detaching) detach_dev(t10);
      destroy_component(code1, detaching);
      if (detaching) detach_dev(t11);
      if (detaching) detach_dev(p2);
      if (detaching) detach_dev(t15);
      if (detaching) detach_dev(div);
      if (detaching) detach_dev(t19);
      destroy_component(code2, detaching);
      if (detaching) detach_dev(t20);
      if (detaching) detach_dev(p3);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance($$self, $$props, $$invalidate) {
  let $darkMode;
  validate_store(darkMode, "darkMode");
  component_subscribe($$self, darkMode, $$value => $$invalidate(0, $darkMode = $$value));
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dark_mode> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Dark_mode", $$slots, []);

  $$self.$capture_state = () => ({
    Code,
    darkMode,
    $darkMode
  });

  return [$darkMode];
}

class Dark_mode extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Dark_mode",
      options,
      id: create_fragment.name
    });
  }

}

export default Dark_mode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFyay1tb2RlLjA3ZTM0MzlkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL2RhcmstbW9kZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IENvZGUgZnJvbSBcImRvY3MvQ29kZS5zdmVsdGVcIjtcbiAgaW1wb3J0IHsgZGFya01vZGUgfSBmcm9tIFwiZGFya1wiO1xuPC9zY3JpcHQ+XG5cbjxoNCBjbGFzcz1cInBiLThcIj5EYXJrIG1vZGU8L2g0PlxuPHA+XG4gIFNtZWx0ZSB1c2VzIGNzcyBwc2V1ZG8tY2xhc3MgdmFyaWFudFxuICA8YSBjbGFzcz1cImFcIiBocmVmPVwiaHR0cHM6Ly90YWlsd2luZGNzcy5jb20vZG9jcy9jb25maWd1cmluZy12YXJpYW50cy9cIj5cbiAgICBmZWF0dXJlXG4gIDwvYT5cbiAgb2YgVGFpbHdpbmQgdG8gZW5hYmxlIGRhcmsgbW9kZS4gQmFzaWMgZGFyayBtb2RlIHN3aXRjaCBsb29rcyBsaWtlIHRoaXM6XG48L3A+XG5cbjxDb2RlIGNvZGU9e2A8YnV0dG9uIGJpbmQ6dmFsdWU9eyRkYXJrTW9kZX0+VG9nZ2xlIGRhcmsgbW9kZTwvYnV0dG9uPmB9IC8+XG5cbjxwPlxuICBUaGlzIHdpbGwgYXBwZW5kXG4gIDxzcGFuIGNsYXNzPVwiY29kZS1pbmxpbmVcIj5tb2RlLWRhcms8L3NwYW4+XG4gIGNsYXNzIHRvIHRoZSBkb2N1bWVudCBib2R5IHdoaWNoIHdpbGwgZW5hYmxlIGFsbCBnZW5lcmF0ZWQgY2xhc3NlcyBwcmVjZWRlZCBieVxuICBwc2V1ZG8tY2xhc3MgXCJkYXJrOlwiLiBCeSBkZWZhdWx0IHNtZWx0ZSBnZW5lcmF0ZXMgZm9sbG93aW5nIHZhcmlhbnRzOlxuPC9wPlxuXG48Q29kZVxuICBjb2RlPXtgXG5iYWNrZ3JvdW5kQ29sb3I6IFtcImRhcmtcIiwgXCJkYXJrLWhvdmVyXCIsIFwiaG92ZXJcIl0sXG5ib3JkZXJDb2xvcjogW1wiZGFya1wiLCBcImRhcmstZm9jdXNcIl0sXG50ZXh0Q29sb3I6IFtcImRhcmtcIiwgXCJkYXJrLWhvdmVyXCIsIFwiZGFyay1hY3RpdmVcIl1cbmB9IC8+XG5cbjxwPlxuICBOb3cgeW91IGNhbiB1c2UgZGFyayB0aGVtZSBjbGFzc2VzIGxpa2VcbiAgPHNwYW4gY2xhc3M9XCJjb2RlLWlubGluZVwiPmRhcms6Ymctd2hpdGU8L3NwYW4+XG4gICh0cnkgdXNpbmcgdGhlIHRoZW1lIHRvZ2dsZSBvbiB0aGUgdG9wIHJpZ2h0KS5cbjwvcD5cblxuPGRpdlxuICBjbGFzcz1cImR1cmF0aW9uLTIwMCBlYXNlLWluIHAtMTAgbXktMTAgYmctYmxhY2sgZGFyazpiZy13aGl0ZSB0ZXh0LXdoaXRlXG4gIGRhcms6dGV4dC1ibGFja1wiPlxuICBJIGFtIGEgeyRkYXJrTW9kZSA/ICdkYXJrJyA6ICdsaWdodCd9IGRpdi5cbjwvZGl2PlxuXG48Q29kZVxuICBjb2RlPXtgXG48ZGl2IGNsYXNzPVwiZHVyYXRpb24tMjAwIGVhc2UtaW4gcC0xMCBteS0xMCBiZy1ibGFjayBkYXJrOmJnLXdoaXRlIHRleHQtd2hpdGUgZGFyazp0ZXh0LWJsYWNrXCI+XG4gIEkgYW0gYSB7JGRhcmtNb2RlID8gXCJkYXJrXCIgOiBcImxpZ2h0XCJ9IGRpdi5cbjwvZGl2PlxuYH0gLz5cblxuPHA+XG4gIElmIHlvdSBkb24ndCBuZWVkIGRhcmsgbW9kZSBhdCBhbGwsIHlvdSBjYW4gcGFzc1xuICA8c3BhbiBjbGFzcz1cImNvZGUtaW5saW5lXCI+ZGFya01vZGU6IGZhbHNlPC9zcGFuPlxuICB0byB0aGUgc21lbHRlLXJvbGx1cC1wbHVnaW4gYW5kIGl0IHdpbGwgZ2VuZXJhdGUgbm8gZXh0cmEgQ1NTLlxuPC9wPlxuIl0sIm5hbWVzIjpbImN0eCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNVQSxFQUFBQSxHQUFTLEVBQUEsQ0FBVCxHQUFZLE1BQVosR0FBcUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFyQkEsTUFBQUEsR0FBUyxFQUFBLENBQVQsR0FBWSxNQUFaLEdBQXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
