import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, a3 as validate_each_argument, v as validate_slots, e as element, o as create_component, k as space, c as claim_element, a as children, p as claim_component, m as claim_space, b as detach_dev, g as attr_dev, f as add_location, h as insert_dev, q as mount_component, j as append_dev, n as noop, r as transition_in, u as transition_out, w as destroy_component, t as text, R as empty, l as claim_text, a4 as destroy_each } from './client.4c142522.js';
import { C as Code } from './Code.497e1b62.js';
import { I as Image } from './index.e0ce9642.js';

var images = "<script>\n  import { Image } from \"smelte\";\n\n  const range = [...new Array(50)];\n</script>\n\n\n{#each range as _, i}\n  <div class=\"my-8\">\n    <Image\n      src=\"https://placeimg.com/{400 + i}/{300 + i}/animals\"\n      alt=\"Kitty {i}\"\n      height={400 + 1}\n      width={300 +1}\n    />\n  </div>\n{/each}";

/* src/routes/components/images.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/images.svelte";

function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[1] = list[i];
  child_ctx[3] = i;
  return child_ctx;
} // (17:0) {#each range as _, i}


function create_each_block(ctx) {
  let div;
  let image;
  let t;
  let current;
  image = new Image({
    props: {
      src: "https://placeimg.com/" + (400 +
      /*i*/
      ctx[3]) + "/" + (300 +
      /*i*/
      ctx[3]) + "/animals",
      alt: "Kitty " +
      /*i*/
      ctx[3],
      height: 400 + 1,
      width: 300 + 1
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      create_component(image.$$.fragment);
      t = space();
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      claim_component(image.$$.fragment, div_nodes);
      t = claim_space(div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "my-8");
      add_location(div, file, 17, 2, 432);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(image, div, null);
      append_dev(div, t);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(image.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(image.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_component(image);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block.name,
    type: "each",
    source: "(17:0) {#each range as _, i}",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let p;
  let t0;
  let a;
  let t1;
  let t2;
  let t3;
  let code;
  let t4;
  let each_1_anchor;
  let current;
  code = new Code({
    props: {
      code: images
    },
    $$inline: true
  });
  let each_value =
  /*range*/
  ctx[0];
  validate_each_argument(each_value);
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  const block = {
    c: function create() {
      p = element("p");
      t0 = text("Smelte includes convenience image component which is useful for lazyloading, but generally we recommend\n  using ");
      a = element("a");
      t1 = text("Svelte Image");
      t2 = text(".");
      t3 = space();
      create_component(code.$$.fragment);
      t4 = space();

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      each_1_anchor = empty();
      this.h();
    },
    l: function claim(nodes) {
      p = claim_element(nodes, "P", {});
      var p_nodes = children(p);
      t0 = claim_text(p_nodes, "Smelte includes convenience image component which is useful for lazyloading, but generally we recommend\n  using ");
      a = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      t1 = claim_text(a_nodes, "Svelte Image");
      a_nodes.forEach(detach_dev);
      t2 = claim_text(p_nodes, ".");
      p_nodes.forEach(detach_dev);
      t3 = claim_space(nodes);
      claim_component(code.$$.fragment, nodes);
      t4 = claim_space(nodes);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(nodes);
      }

      each_1_anchor = empty();
      this.h();
    },
    h: function hydrate() {
      attr_dev(a, "class", "a");
      attr_dev(a, "href", "https://github.com/matyunya/svelte-image");
      add_location(a, file, 11, 8, 299);
      add_location(p, file, 9, 0, 181);
    },
    m: function mount(target, anchor) {
      insert_dev(target, p, anchor);
      append_dev(p, t0);
      append_dev(p, a);
      append_dev(a, t1);
      append_dev(p, t2);
      insert_dev(target, t3, anchor);
      mount_component(code, target, anchor);
      insert_dev(target, t4, anchor);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(code.$$.fragment, local);

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      current = true;
    },
    o: function outro(local) {
      transition_out(code.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(p);
      if (detaching) detach_dev(t3);
      destroy_component(code, detaching);
      if (detaching) detach_dev(t4);
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
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
  const range = [...new Array(50)];
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Images> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Images", $$slots, []);

  $$self.$capture_state = () => ({
    Image,
    Code,
    images,
    range
  });

  return [range];
}

class Images extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Images",
      options,
      id: create_fragment.name
    });
  }

}

export default Images;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VzLjBjZmMxNDkzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL2NvbXBvbmVudHMvaW1hZ2VzLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgSW1hZ2UgZnJvbSBcImNvbXBvbmVudHMvSW1hZ2VcIjtcbiAgaW1wb3J0IENvZGUgZnJvbSBcImRvY3MvQ29kZS5zdmVsdGVcIjtcblxuICBpbXBvcnQgaW1hZ2VzIGZyb20gXCJleGFtcGxlcy9pbWFnZXMudHh0XCI7XG5cbiAgY29uc3QgcmFuZ2UgPSBbLi4ubmV3IEFycmF5KDUwKV07XG48L3NjcmlwdD5cblxuPHA+XG4gIFNtZWx0ZSBpbmNsdWRlcyBjb252ZW5pZW5jZSBpbWFnZSBjb21wb25lbnQgd2hpY2ggaXMgdXNlZnVsIGZvciBsYXp5bG9hZGluZywgYnV0IGdlbmVyYWxseSB3ZSByZWNvbW1lbmRcbiAgdXNpbmcgPGEgY2xhc3M9XCJhXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYXR5dW55YS9zdmVsdGUtaW1hZ2VcIj5TdmVsdGUgSW1hZ2U8L2E+LlxuPC9wPlxuXG48Q29kZSBjb2RlPXtpbWFnZXN9IC8+XG5cbnsjZWFjaCByYW5nZSBhcyBfLCBpfVxuICA8ZGl2IGNsYXNzPVwibXktOFwiPlxuICAgIDxJbWFnZVxuICAgICAgc3JjPVwiaHR0cHM6Ly9wbGFjZWltZy5jb20vezQwMCArIGl9L3szMDAgKyBpfS9hbmltYWxzXCJcbiAgICAgIGFsdD1cIktpdHR5IHtpfVwiXG4gICAgICBoZWlnaHQ9ezQwMCArIDF9XG4gICAgICB3aWR0aD17MzAwICsgMX0gLz5cbiAgPC9kaXY+XG57L2VhY2h9XG4iXSwibmFtZXMiOlsiY3R4IiwiaW1hZ2VzIiwibGVuZ3RoIiwicmFuZ2UiLCJBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NDQW1CaUM7O0FBQU1BLE1BQUFBLEdBQUMsRUFBQSxZQUFHOztBQUFNQSxNQUFBQSxHQUFDLEVBQUE7OztBQUNoQ0EsTUFBQUEsR0FBQyxFQUFBO2NBQ0wsTUFBTTthQUNQLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVJQQzs7Ozs7O0FBRUxELEVBQUFBLEdBQUssRUFBQTs7OztpQ0FBVkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FDQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBVk1DLEtBQUssV0FBV0MsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
