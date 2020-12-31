import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, e as element, j as append_dev, v as validate_slots, D as svg_element, c as claim_element, a as children, b as detach_dev, g as attr_dev, f as add_location, E as set_style, h as insert_dev, n as noop, P as ProgressLinear, t as text, k as space, o as create_component, l as claim_text, m as claim_space, p as claim_component, q as mount_component, z as set_data_dev, r as transition_in, u as transition_out, w as destroy_component } from './client.97066c0b.js';
import { C as Code } from './Code.5fe72bae.js';

/* src/components/ProgressCircular/ProgressCircular.svelte generated by Svelte v3.24.0 */
const file = "src/components/ProgressCircular/ProgressCircular.svelte";

function add_css() {
  var style = element("style");
  style.id = "svelte-1xkiyez-style";
  style.textContent = ".circular.svelte-1xkiyez{animation:svelte-1xkiyez-rotate 2s linear infinite;position:relative}.path.svelte-1xkiyez{stroke-dasharray:1, 200;stroke-dashoffset:0;stroke-linecap:round;animation:svelte-1xkiyez-dash 1.5s ease-in-out infinite}@keyframes svelte-1xkiyez-rotate{100%{transform:rotate(360deg)}}@keyframes svelte-1xkiyez-dash{0%{stroke-dasharray:1, 200;stroke-dashoffset:0}50%{stroke-dasharray:89, 200;stroke-dashoffset:-35}100%{stroke-dasharray:89, 200;stroke-dashoffset:-124}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3NDaXJjdWxhci5zdmVsdGUiLCJzb3VyY2VzIjpbIlByb2dyZXNzQ2lyY3VsYXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgcHJvZ3Jlc3MgPSBudWxsO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG4gIGV4cG9ydCBsZXQgd2lkdGggPSAzO1xuICBleHBvcnQgbGV0IHNpemUgPSA3MDtcblxuICAkOiBzdHlsZSA9IHByb2dyZXNzID4gMCA/IGBcbiAgICAgIGFuaW1hdGlvbjogbm9uZTtcbiAgICAgIHN0cm9rZS1kYXNoYXJyYXk6ICR7MTUwMDAwIC0gcHJvZ3Jlc3MgKiAxMDAwfTtcbiAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAtJHsxMjQgLSAocHJvZ3Jlc3MgKiAxMjQpIC8gMTAwfTtcbiAgICBgIDogXCJcIjtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5jaXJjdWxhciB7XG4gICAgYW5pbWF0aW9uOiByb3RhdGUgMnMgbGluZWFyIGluZmluaXRlO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuXG4gIC5wYXRoIHtcbiAgICBzdHJva2UtZGFzaGFycmF5OiAxLCAyMDA7XG4gICAgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7XG4gICAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO1xuICAgIGFuaW1hdGlvbjogZGFzaCAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICB9XG5cbiAgQGtleWZyYW1lcyByb3RhdGUge1xuICAgIDEwMCUge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgICB9XG4gIH1cblxuICBAa2V5ZnJhbWVzIGRhc2gge1xuICAgIDAlIHtcbiAgICAgIHN0cm9rZS1kYXNoYXJyYXk6IDEsIDIwMDtcbiAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAwO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgc3Ryb2tlLWRhc2hhcnJheTogODksIDIwMDtcbiAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAtMzU7XG4gICAgfVxuICAgIDEwMCUge1xuICAgICAgc3Ryb2tlLWRhc2hhcnJheTogODksIDIwMDtcbiAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAtMTI0O1xuICAgIH1cbiAgfVxuPC9zdHlsZT5cblxuPHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgc3R5bGU9XCJ3aWR0aDoge3NpemV9cHg7IGhlaWdodDoge3NpemV9cHg7XCI+XG4gIDxjaXJjbGVcbiAgICBjbGFzcz1cInBhdGggc3Ryb2tlLXtjb2xvcn1cIlxuICAgIGN4PXtzaXplIC8gMn1cbiAgICBjeT17c2l6ZSAvIDJ9XG4gICAgZmlsbD1cIm5vbmVcIlxuICAgIHI9eyhzaXplIC8gMikgLSAoc2l6ZSAvIDUpfVxuICAgIHN0cm9rZS13aWR0aD17d2lkdGh9XG4gICAgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiXG4gICAge3N0eWxlfSAvPlxuPC9zdmc+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBY0UsU0FBUyxlQUFDLENBQUMsQUFDVCxTQUFTLENBQUUscUJBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FDcEMsUUFBUSxDQUFFLFFBQVEsQUFDcEIsQ0FBQyxBQUVELEtBQUssZUFBQyxDQUFDLEFBQ0wsZ0JBQWdCLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUN4QixpQkFBaUIsQ0FBRSxDQUFDLENBQ3BCLGNBQWMsQ0FBRSxLQUFLLENBQ3JCLFNBQVMsQ0FBRSxtQkFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxBQUMzQyxDQUFDLEFBRUQsV0FBVyxxQkFBTyxDQUFDLEFBQ2pCLElBQUksQUFBQyxDQUFDLEFBQ0osU0FBUyxDQUFFLE9BQU8sTUFBTSxDQUFDLEFBQzNCLENBQUMsQUFDSCxDQUFDLEFBRUQsV0FBVyxtQkFBSyxDQUFDLEFBQ2YsRUFBRSxBQUFDLENBQUMsQUFDRixnQkFBZ0IsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ3hCLGlCQUFpQixDQUFFLENBQUMsQUFDdEIsQ0FBQyxBQUNELEdBQUcsQUFBQyxDQUFDLEFBQ0gsZ0JBQWdCLENBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUN6QixpQkFBaUIsQ0FBRSxHQUFHLEFBQ3hCLENBQUMsQUFDRCxJQUFJLEFBQUMsQ0FBQyxBQUNKLGdCQUFnQixDQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FDekIsaUJBQWlCLENBQUUsSUFBSSxBQUN6QixDQUFDLEFBQ0gsQ0FBQyJ9 */";
  append_dev(document.head, style);
}

function create_fragment(ctx) {
  let svg;
  let circle;
  let circle_class_value;
  let circle_cx_value;
  let circle_cy_value;
  let circle_r_value;
  const block = {
    c: function create() {
      svg = svg_element("svg");
      circle = svg_element("circle");
      this.h();
    },
    l: function claim(nodes) {
      svg = claim_element(nodes, "svg", {
        class: true,
        style: true
      }, 1);
      var svg_nodes = children(svg);
      circle = claim_element(svg_nodes, "circle", {
        class: true,
        cx: true,
        cy: true,
        fill: true,
        r: true,
        "stroke-width": true,
        "stroke-miterlimit": true,
        style: true
      }, 1);
      children(circle).forEach(detach_dev);
      svg_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(circle, "class", circle_class_value = "path stroke-" +
      /*color*/
      ctx[0] + " svelte-1xkiyez");
      attr_dev(circle, "cx", circle_cx_value =
      /*size*/
      ctx[2] / 2);
      attr_dev(circle, "cy", circle_cy_value =
      /*size*/
      ctx[2] / 2);
      attr_dev(circle, "fill", "none");
      attr_dev(circle, "r", circle_r_value =
      /*size*/
      ctx[2] / 2 -
      /*size*/
      ctx[2] / 5);
      attr_dev(circle, "stroke-width",
      /*width*/
      ctx[1]);
      attr_dev(circle, "stroke-miterlimit", "10");
      attr_dev(circle, "style",
      /*style*/
      ctx[3]);
      add_location(circle, file, 49, 2, 960);
      attr_dev(svg, "class", "circular svelte-1xkiyez");
      set_style(svg, "width",
      /*size*/
      ctx[2] + "px");
      set_style(svg, "height",
      /*size*/
      ctx[2] + "px");
      add_location(svg, file, 48, 0, 892);
    },
    m: function mount(target, anchor) {
      insert_dev(target, svg, anchor);
      append_dev(svg, circle);
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*color*/
      1 && circle_class_value !== (circle_class_value = "path stroke-" +
      /*color*/
      ctx[0] + " svelte-1xkiyez")) {
        attr_dev(circle, "class", circle_class_value);
      }

      if (dirty &
      /*size*/
      4 && circle_cx_value !== (circle_cx_value =
      /*size*/
      ctx[2] / 2)) {
        attr_dev(circle, "cx", circle_cx_value);
      }

      if (dirty &
      /*size*/
      4 && circle_cy_value !== (circle_cy_value =
      /*size*/
      ctx[2] / 2)) {
        attr_dev(circle, "cy", circle_cy_value);
      }

      if (dirty &
      /*size*/
      4 && circle_r_value !== (circle_r_value =
      /*size*/
      ctx[2] / 2 -
      /*size*/
      ctx[2] / 5)) {
        attr_dev(circle, "r", circle_r_value);
      }

      if (dirty &
      /*width*/
      2) {
        attr_dev(circle, "stroke-width",
        /*width*/
        ctx[1]);
      }

      if (dirty &
      /*style*/
      8) {
        attr_dev(circle, "style",
        /*style*/
        ctx[3]);
      }

      if (dirty &
      /*size*/
      4) {
        set_style(svg, "width",
        /*size*/
        ctx[2] + "px");
      }

      if (dirty &
      /*size*/
      4) {
        set_style(svg, "height",
        /*size*/
        ctx[2] + "px");
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(svg);
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
  let {
    progress = null
  } = $$props;
  let {
    color = "primary"
  } = $$props;
  let {
    width = 3
  } = $$props;
  let {
    size = 70
  } = $$props;
  const writable_props = ["progress", "color", "width", "size"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProgressCircular> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("ProgressCircular", $$slots, []);

  $$self.$set = $$props => {
    if ("progress" in $$props) $$invalidate(4, progress = $$props.progress);
    if ("color" in $$props) $$invalidate(0, color = $$props.color);
    if ("width" in $$props) $$invalidate(1, width = $$props.width);
    if ("size" in $$props) $$invalidate(2, size = $$props.size);
  };

  $$self.$capture_state = () => ({
    progress,
    color,
    width,
    size,
    style
  });

  $$self.$inject_state = $$props => {
    if ("progress" in $$props) $$invalidate(4, progress = $$props.progress);
    if ("color" in $$props) $$invalidate(0, color = $$props.color);
    if ("width" in $$props) $$invalidate(1, width = $$props.width);
    if ("size" in $$props) $$invalidate(2, size = $$props.size);
    if ("style" in $$props) $$invalidate(3, style = $$props.style);
  };

  let style;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*progress*/
    16) {
       $$invalidate(3, style = progress > 0 ? `
      animation: none;
      stroke-dasharray: ${150000 - progress * 1000};
      stroke-dashoffset: -${124 - progress * 124 / 100};
    ` : "");
    }
  };

  return [color, width, size, style, progress];
}

class ProgressCircular extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-1xkiyez-style")) add_css();
    init(this, options, instance, create_fragment, safe_not_equal, {
      progress: 4,
      color: 0,
      width: 1,
      size: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "ProgressCircular",
      options,
      id: create_fragment.name
    });
  }

  get progress() {
    throw new Error("<ProgressCircular>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set progress(value) {
    throw new Error("<ProgressCircular>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<ProgressCircular>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<ProgressCircular>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get width() {
    throw new Error("<ProgressCircular>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set width(value) {
    throw new Error("<ProgressCircular>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get size() {
    throw new Error("<ProgressCircular>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set size(value) {
    throw new Error("<ProgressCircular>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

var indicators = "<script>\n  import {\n    ProgressLinear,\n    ProgressCircular\n  } from \"smelte\";\n\n  let progress = 0;\n\n  function next() {\n    setTimeout(() => {\n      if (progress === 100) {\n        progress = 0;\n      }\n\n      progress += 1;\n      next();\n    }, 100);\n  }\n\n  next();\n</script>\n<h5 class=\"pb-4\">Indefinite linear progress indicator</h5>\n<ProgressLinear />\n\n<h5 class=\"pt-6 pb-4\">Definite linear progress indicator</h5>\n\n<small class=\"mb-3\">{progress}%</small>\n<ProgressLinear {progress} />\n\n<h5 class=\"pt-6 pb-4\">Indefinite circular progress indicator</h5>\n<ProgressCircular />\n\n<h5 class=\"pt-6 pb-4\">Definite circular progress indicator</h5>\n\n<small class=\"mb-3\">{progress}%</small>\n<ProgressCircular {progress} />";

/* src/routes/components/progress-indicators.svelte generated by Svelte v3.24.0 */
const file$1 = "src/routes/components/progress-indicators.svelte";

function create_fragment$1(ctx) {
  let h50;
  let t0;
  let t1;
  let progresslinear0;
  let t2;
  let h51;
  let t3;
  let t4;
  let small0;
  let t5;
  let t6;
  let t7;
  let progresslinear1;
  let t8;
  let h52;
  let t9;
  let t10;
  let progresscircular0;
  let t11;
  let h53;
  let t12;
  let t13;
  let small1;
  let t14;
  let t15;
  let t16;
  let progresscircular1;
  let t17;
  let code;
  let current;
  progresslinear0 = new ProgressLinear({
    $$inline: true
  });
  progresslinear1 = new ProgressLinear({
    props: {
      progress:
      /*progress*/
      ctx[0]
    },
    $$inline: true
  });
  progresscircular0 = new ProgressCircular({
    $$inline: true
  });
  progresscircular1 = new ProgressCircular({
    props: {
      progress:
      /*progress*/
      ctx[0]
    },
    $$inline: true
  });
  code = new Code({
    props: {
      code: indicators
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      h50 = element("h5");
      t0 = text("Indefinite linear progress indicator");
      t1 = space();
      create_component(progresslinear0.$$.fragment);
      t2 = space();
      h51 = element("h5");
      t3 = text("Definite linear progress indicator");
      t4 = space();
      small0 = element("small");
      t5 = text(
      /*progress*/
      ctx[0]);
      t6 = text("%");
      t7 = space();
      create_component(progresslinear1.$$.fragment);
      t8 = space();
      h52 = element("h5");
      t9 = text("Indefinite circular progress indicator");
      t10 = space();
      create_component(progresscircular0.$$.fragment);
      t11 = space();
      h53 = element("h5");
      t12 = text("Definite circular progress indicator");
      t13 = space();
      small1 = element("small");
      t14 = text(
      /*progress*/
      ctx[0]);
      t15 = text("%");
      t16 = space();
      create_component(progresscircular1.$$.fragment);
      t17 = space();
      create_component(code.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      h50 = claim_element(nodes, "H5", {
        class: true
      });
      var h50_nodes = children(h50);
      t0 = claim_text(h50_nodes, "Indefinite linear progress indicator");
      h50_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      claim_component(progresslinear0.$$.fragment, nodes);
      t2 = claim_space(nodes);
      h51 = claim_element(nodes, "H5", {
        class: true
      });
      var h51_nodes = children(h51);
      t3 = claim_text(h51_nodes, "Definite linear progress indicator");
      h51_nodes.forEach(detach_dev);
      t4 = claim_space(nodes);
      small0 = claim_element(nodes, "SMALL", {
        class: true
      });
      var small0_nodes = children(small0);
      t5 = claim_text(small0_nodes,
      /*progress*/
      ctx[0]);
      t6 = claim_text(small0_nodes, "%");
      small0_nodes.forEach(detach_dev);
      t7 = claim_space(nodes);
      claim_component(progresslinear1.$$.fragment, nodes);
      t8 = claim_space(nodes);
      h52 = claim_element(nodes, "H5", {
        class: true
      });
      var h52_nodes = children(h52);
      t9 = claim_text(h52_nodes, "Indefinite circular progress indicator");
      h52_nodes.forEach(detach_dev);
      t10 = claim_space(nodes);
      claim_component(progresscircular0.$$.fragment, nodes);
      t11 = claim_space(nodes);
      h53 = claim_element(nodes, "H5", {
        class: true
      });
      var h53_nodes = children(h53);
      t12 = claim_text(h53_nodes, "Definite circular progress indicator");
      h53_nodes.forEach(detach_dev);
      t13 = claim_space(nodes);
      small1 = claim_element(nodes, "SMALL", {
        class: true
      });
      var small1_nodes = children(small1);
      t14 = claim_text(small1_nodes,
      /*progress*/
      ctx[0]);
      t15 = claim_text(small1_nodes, "%");
      small1_nodes.forEach(detach_dev);
      t16 = claim_space(nodes);
      claim_component(progresscircular1.$$.fragment, nodes);
      t17 = claim_space(nodes);
      claim_component(code.$$.fragment, nodes);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h50, "class", "pb-4");
      add_location(h50, file$1, 23, 0, 430);
      attr_dev(h51, "class", "pt-6 pb-4");
      add_location(h51, file$1, 26, 0, 509);
      attr_dev(small0, "class", "mb-3");
      add_location(small0, file$1, 28, 0, 572);
      attr_dev(h52, "class", "pt-6 pb-4");
      add_location(h52, file$1, 31, 0, 643);
      attr_dev(h53, "class", "pt-6 pb-4");
      add_location(h53, file$1, 34, 0, 731);
      attr_dev(small1, "class", "mb-3");
      add_location(small1, file$1, 36, 0, 796);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h50, anchor);
      append_dev(h50, t0);
      insert_dev(target, t1, anchor);
      mount_component(progresslinear0, target, anchor);
      insert_dev(target, t2, anchor);
      insert_dev(target, h51, anchor);
      append_dev(h51, t3);
      insert_dev(target, t4, anchor);
      insert_dev(target, small0, anchor);
      append_dev(small0, t5);
      append_dev(small0, t6);
      insert_dev(target, t7, anchor);
      mount_component(progresslinear1, target, anchor);
      insert_dev(target, t8, anchor);
      insert_dev(target, h52, anchor);
      append_dev(h52, t9);
      insert_dev(target, t10, anchor);
      mount_component(progresscircular0, target, anchor);
      insert_dev(target, t11, anchor);
      insert_dev(target, h53, anchor);
      append_dev(h53, t12);
      insert_dev(target, t13, anchor);
      insert_dev(target, small1, anchor);
      append_dev(small1, t14);
      append_dev(small1, t15);
      insert_dev(target, t16, anchor);
      mount_component(progresscircular1, target, anchor);
      insert_dev(target, t17, anchor);
      mount_component(code, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (!current || dirty &
      /*progress*/
      1) set_data_dev(t5,
      /*progress*/
      ctx[0]);
      const progresslinear1_changes = {};
      if (dirty &
      /*progress*/
      1) progresslinear1_changes.progress =
      /*progress*/
      ctx[0];
      progresslinear1.$set(progresslinear1_changes);
      if (!current || dirty &
      /*progress*/
      1) set_data_dev(t14,
      /*progress*/
      ctx[0]);
      const progresscircular1_changes = {};
      if (dirty &
      /*progress*/
      1) progresscircular1_changes.progress =
      /*progress*/
      ctx[0];
      progresscircular1.$set(progresscircular1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(progresslinear0.$$.fragment, local);
      transition_in(progresslinear1.$$.fragment, local);
      transition_in(progresscircular0.$$.fragment, local);
      transition_in(progresscircular1.$$.fragment, local);
      transition_in(code.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(progresslinear0.$$.fragment, local);
      transition_out(progresslinear1.$$.fragment, local);
      transition_out(progresscircular0.$$.fragment, local);
      transition_out(progresscircular1.$$.fragment, local);
      transition_out(code.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(h50);
      if (detaching) detach_dev(t1);
      destroy_component(progresslinear0, detaching);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(h51);
      if (detaching) detach_dev(t4);
      if (detaching) detach_dev(small0);
      if (detaching) detach_dev(t7);
      destroy_component(progresslinear1, detaching);
      if (detaching) detach_dev(t8);
      if (detaching) detach_dev(h52);
      if (detaching) detach_dev(t10);
      destroy_component(progresscircular0, detaching);
      if (detaching) detach_dev(t11);
      if (detaching) detach_dev(h53);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(small1);
      if (detaching) detach_dev(t16);
      destroy_component(progresscircular1, detaching);
      if (detaching) detach_dev(t17);
      destroy_component(code, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$1($$self, $$props, $$invalidate) {
  let progress = 0;

  function next() {
    setTimeout(() => {
      if (progress === 100) {
        $$invalidate(0, progress = 0);
      }

      $$invalidate(0, progress += 1);
      next();
    }, 100);
  }

  next();
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Progress_indicators> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Progress_indicators", $$slots, []);

  $$self.$capture_state = () => ({
    ProgressLinear,
    ProgressCircular,
    Code,
    indicators,
    progress,
    next
  });

  $$self.$inject_state = $$props => {
    if ("progress" in $$props) $$invalidate(0, progress = $$props.progress);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [progress];
}

class Progress_indicators extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Progress_indicators",
      options,
      id: create_fragment$1.name
    });
  }

}

export default Progress_indicators;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtaW5kaWNhdG9ycy5lODc2MGYzNy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NDaXJjdWxhci9Qcm9ncmVzc0NpcmN1bGFyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29tcG9uZW50cy9wcm9ncmVzcy1pbmRpY2F0b3JzLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IHByb2dyZXNzID0gbnVsbDtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwicHJpbWFyeVwiO1xuICBleHBvcnQgbGV0IHdpZHRoID0gMztcbiAgZXhwb3J0IGxldCBzaXplID0gNzA7XG5cbiAgJDogc3R5bGUgPSBwcm9ncmVzcyA+IDAgPyBgXG4gICAgICBhbmltYXRpb246IG5vbmU7XG4gICAgICBzdHJva2UtZGFzaGFycmF5OiAkezE1MDAwMCAtIHByb2dyZXNzICogMTAwMH07XG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogLSR7MTI0IC0gKHByb2dyZXNzICogMTI0KSAvIDEwMH07XG4gICAgYCA6IFwiXCI7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuY2lyY3VsYXIge1xuICAgIGFuaW1hdGlvbjogcm90YXRlIDJzIGxpbmVhciBpbmZpbml0ZTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cblxuICAucGF0aCB7XG4gICAgc3Ryb2tlLWRhc2hhcnJheTogMSwgMjAwO1xuICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAwO1xuICAgIHN0cm9rZS1saW5lY2FwOiByb3VuZDtcbiAgICBhbmltYXRpb246IGRhc2ggMS41cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgcm90YXRlIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gICAgfVxuICB9XG5cbiAgQGtleWZyYW1lcyBkYXNoIHtcbiAgICAwJSB7XG4gICAgICBzdHJva2UtZGFzaGFycmF5OiAxLCAyMDA7XG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogMDtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgIHN0cm9rZS1kYXNoYXJyYXk6IDg5LCAyMDA7XG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogLTM1O1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgIHN0cm9rZS1kYXNoYXJyYXk6IDg5LCAyMDA7XG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogLTEyNDtcbiAgICB9XG4gIH1cbjwvc3R5bGU+XG5cbjxzdmcgY2xhc3M9XCJjaXJjdWxhclwiIHN0eWxlPVwid2lkdGg6IHtzaXplfXB4OyBoZWlnaHQ6IHtzaXplfXB4O1wiPlxuICA8Y2lyY2xlXG4gICAgY2xhc3M9XCJwYXRoIHN0cm9rZS17Y29sb3J9XCJcbiAgICBjeD17c2l6ZSAvIDJ9XG4gICAgY3k9e3NpemUgLyAyfVxuICAgIGZpbGw9XCJub25lXCJcbiAgICByPXsoc2l6ZSAvIDIpIC0gKHNpemUgLyA1KX1cbiAgICBzdHJva2Utd2lkdGg9e3dpZHRofVxuICAgIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIlxuICAgIHtzdHlsZX0gLz5cbjwvc3ZnPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IFByb2dyZXNzTGluZWFyIGZyb20gXCJjb21wb25lbnRzL1Byb2dyZXNzTGluZWFyXCI7XG4gIGltcG9ydCBQcm9ncmVzc0NpcmN1bGFyIGZyb20gXCJjb21wb25lbnRzL1Byb2dyZXNzQ2lyY3VsYXJcIjtcblxuICBpbXBvcnQgQ29kZSBmcm9tIFwiZG9jcy9Db2RlLnN2ZWx0ZVwiO1xuICBpbXBvcnQgaW5kaWNhdG9ycyBmcm9tIFwiZXhhbXBsZXMvcHJvZ3Jlc3MtaW5kaWNhdG9ycy50eHRcIjtcblxuICBsZXQgcHJvZ3Jlc3MgPSAwO1xuXG4gIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAocHJvZ3Jlc3MgPT09IDEwMCkge1xuICAgICAgICBwcm9ncmVzcyA9IDA7XG4gICAgICB9XG5cbiAgICAgIHByb2dyZXNzICs9IDE7XG4gICAgICBuZXh0KCk7XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIG5leHQoKTtcbjwvc2NyaXB0PlxuXG48aDUgY2xhc3M9XCJwYi00XCI+SW5kZWZpbml0ZSBsaW5lYXIgcHJvZ3Jlc3MgaW5kaWNhdG9yPC9oNT5cbjxQcm9ncmVzc0xpbmVhciAvPlxuXG48aDUgY2xhc3M9XCJwdC02IHBiLTRcIj5EZWZpbml0ZSBsaW5lYXIgcHJvZ3Jlc3MgaW5kaWNhdG9yPC9oNT5cblxuPHNtYWxsIGNsYXNzPVwibWItM1wiPntwcm9ncmVzc30lPC9zbWFsbD5cbjxQcm9ncmVzc0xpbmVhciB7cHJvZ3Jlc3N9IC8+XG5cbjxoNSBjbGFzcz1cInB0LTYgcGItNFwiPkluZGVmaW5pdGUgY2lyY3VsYXIgcHJvZ3Jlc3MgaW5kaWNhdG9yPC9oNT5cbjxQcm9ncmVzc0NpcmN1bGFyIC8+XG5cbjxoNSBjbGFzcz1cInB0LTYgcGItNFwiPkRlZmluaXRlIGNpcmN1bGFyIHByb2dyZXNzIGluZGljYXRvcjwvaDU+XG5cbjxzbWFsbCBjbGFzcz1cIm1iLTNcIj57cHJvZ3Jlc3N9JTwvc21hbGw+XG48UHJvZ3Jlc3NDaXJjdWxhciB7cHJvZ3Jlc3N9IC8+XG5cbjxDb2RlIGNvZGU9e2luZGljYXRvcnN9IC8+XG4iXSwibmFtZXMiOlsiY3R4IiwicHJvZ3Jlc3MiLCJjb2xvciIsIndpZHRoIiwic2l6ZSIsIiQiLCJzdHlsZSIsImluZGljYXRvcnMiLCJuZXh0Iiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtEd0JBLE1BQUFBLEdBQUssRUFBQTs7O0FBQ3JCQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSixHQUFPOzs7QUFDUEEsTUFBQUEsR0FBSSxFQUFBLENBQUosR0FBTzs7OztBQUVQQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSixHQUFPLENBQVA7O0FBQWFBLE1BQUFBLEdBQUksRUFBQSxDQUFKLEdBQU87OztBQUNWQSxNQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7OztBQVBjQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSjs7O0FBQWtCQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSjs7Ozs7Ozs7Ozs7O0FBRS9CQSxNQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7O0FBQ3JCQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSixHQUFPOzs7Ozs7OztBQUNQQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSixHQUFPOzs7Ozs7OztBQUVQQSxNQUFBQSxHQUFJLEVBQUEsQ0FBSixHQUFPLENBQVA7O0FBQWFBLE1BQUFBLEdBQUksRUFBQSxDQUFKLEdBQU87Ozs7Ozs7OztBQUNWQSxRQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFQY0EsUUFBQUEsR0FBSSxFQUFBLENBQUo7Ozs7Ozs7O0FBQWtCQSxRQUFBQSxHQUFJLEVBQUEsQ0FBSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBL0MxQ0MsSUFBQUEsUUFBUSxHQUFHOzs7QUFDWEMsSUFBQUEsS0FBSyxHQUFHOzs7QUFDUkMsSUFBQUEsS0FBSyxHQUFHOzs7QUFDUkMsSUFBQUEsSUFBSSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFbEJDLHVCQUFHQyxLQUFLLEdBQUdMLFFBQVEsR0FBRyxDQUFYOzswQkFFYSxTQUFTQSxRQUFRLEdBQUc7NEJBQ2xCLE1BQU9BLFFBQVEsR0FBRyxHQUFYLEdBQWtCO0tBSHhDLEdBSUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lDNkJJTTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFYU1AsTUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBUVJBLE1BQUFBLEdBQVEsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVJSQSxNQUFBQSxHQUFRLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRUkEsTUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFSUkEsTUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7QUFRUkEsTUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BN0J2QkMsUUFBUSxHQUFHOztXQUVOTztBQUNQQyxJQUFBQSxVQUFVO1VBQ0pSLFFBQVEsS0FBSzt3QkFDZkEsUUFBUSxHQUFHOzs7c0JBR2JBLFFBQVEsSUFBSTtBQUNaTyxNQUFBQSxJQUFJO0tBTkksRUFPUCxHQVBPLENBQVY7OztBQVVGQSxFQUFBQSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
