import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, o as create_component, k as space, c as claim_element, a as children, p as claim_component, m as claim_space, b as detach_dev, g as attr_dev, f as add_location, h as insert_dev, q as mount_component, j as append_dev, r as transition_in, u as transition_out, w as destroy_component } from './client.819ca0c7.js';
import { C as Code } from './Code.5193b852.js';
import './index.3e56671e.js';
import { D as DataTable } from './index.24cf38ff.js';
import './index.4c392ccf.js';

var table = "<script>\n  import { DataTable } from \"smelte\";\n\n  let data = [];\n  let loading = true;\n\n  async function getData() {\n    if (typeof window === \"undefined\") return;\n\n    loading = true;\n    const res = await fetch(\"data.json\");\n    const body = await res.json();\n\n    data = body._embedded.episodes;\n\n    setTimeout(() => loading = false, 500);\n  }\n\n  getData();\n</script>\n\n<div class=\"overflow-auto p-1\">\n  <DataTable\n    {data}\n    {loading}\n    on:update={({ detail }) => {\n      const { column, item, value } = detail;\n\n      const index = data.findIndex(i => i.id === item.id);\n\n      data[index][column.field] = value;\n    }}\n    columns={[\n      { label: \"ID\", field: \"id\", class: \"md:w-10\", },\n      {\n        label: \"Ep.\",\n        value: (v) => `S${v.season}E${v.number}`,\n        class: \"md:w-10\",\n        editable: false,\n      },\n      { field: \"name\", class: \"md:w-10\" },\n      {\n        field: \"summary\",\n        textarea: true,\n        value: v => v && v.summary ? v.summary : \"\",\n        add: \"text-sm text-gray-700 caption md:w-full sm:w-64\",\n        remove: \"text-right\",\n        headerRemove: \"justify-end\",\n        iconAfter: true,\n      },\n      {\n        field: \"thumbnail\",\n        value: (v) => v && v.image\n          ? `<img src=\"${v.image.medium.replace(\"http\", \"https\")}\" height=\"70\" alt=\"${v.name}\">`\n          : \"\",\n        class: \"w-48\",\n        sortable: false,\n        editable: false,\n        headerRemove: \"justify-end\",\n      }\n    ]}\n  />\n</div>";

/* src/routes/components/data-tables.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/data-tables.svelte";

function create_fragment(ctx) {
  let div;
  let datatable;
  let t;
  let code;
  let current;
  datatable = new DataTable({
    props: {
      data:
      /*data*/
      ctx[0],
      loading:
      /*loading*/
      ctx[1],
      columns: [{
        label: "ID",
        field: "id",
        class: "md:w-10"
      }, {
        label: "Ep.",
        value: func,
        class: "md:w-10",
        editable: false
      }, {
        field: "name",
        class: "md:w-10"
      }, {
        field: "summary",
        textarea: true,
        value: func_1,
        add: "text-sm text-gray-700 caption md:w-full sm:w-64",
        remove: "text-right",
        headerRemove: "justify-end",
        iconAfter: true
      }, {
        field: "thumbnail",
        value: func_2,
        class: "w-48",
        sortable: false,
        editable: false,
        headerRemove: "justify-end"
      }]
    },
    $$inline: true
  });
  datatable.$on("update",
  /*update_handler*/
  ctx[2]);
  code = new Code({
    props: {
      code: table
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      create_component(datatable.$$.fragment);
      t = space();
      create_component(code.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      claim_component(datatable.$$.fragment, div_nodes);
      t = claim_space(div_nodes);
      claim_component(code.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "overflow-auto p-1");
      add_location(div, file, 23, 0, 464);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(datatable, div, null);
      append_dev(div, t);
      mount_component(code, div, null);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const datatable_changes = {};
      if (dirty &
      /*data*/
      1) datatable_changes.data =
      /*data*/
      ctx[0];
      if (dirty &
      /*loading*/
      2) datatable_changes.loading =
      /*loading*/
      ctx[1];
      datatable.$set(datatable_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(datatable.$$.fragment, local);
      transition_in(code.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(datatable.$$.fragment, local);
      transition_out(code.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_component(datatable);
      destroy_component(code);
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

const func = v => `S${v.season}E${v.number}`;

const func_1 = v => v && v.summary ? v.summary : "";

const func_2 = v => v && v.image ? `<img src="${v.image.medium.replace("http", "https")}" height="70" alt="${v.name}">` : "";

function instance($$self, $$props, $$invalidate) {
  let data = [];
  let loading = true;

  async function getData() {
    if (typeof window === "undefined") return;
    $$invalidate(1, loading = true);
    const res = await fetch("data.json");
    const body = await res.json();
    $$invalidate(0, data = body._embedded.episodes);
    setTimeout(() => $$invalidate(1, loading = false), 500);
  }

  getData();
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Data_tables> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Data_tables", $$slots, []);

  const update_handler = ({
    detail
  }) => {
    const {
      column,
      item,
      value
    } = detail;
    const index = data.findIndex(i => i.id === item.id);
    $$invalidate(0, data[index][column.field] = value, data);
  };

  $$self.$capture_state = () => ({
    DataTable,
    Code,
    table,
    data,
    loading,
    getData
  });

  $$self.$inject_state = $$props => {
    if ("data" in $$props) $$invalidate(0, data = $$props.data);
    if ("loading" in $$props) $$invalidate(1, loading = $$props.loading);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [data, loading, update_handler];
}

class Data_tables extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Data_tables",
      options,
      id: create_fragment.name
    });
  }

}

export default Data_tables;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10YWJsZXMuYWJhYTkzNzMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29tcG9uZW50cy9kYXRhLXRhYmxlcy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IERhdGFUYWJsZSBmcm9tIFwiY29tcG9uZW50cy9EYXRhVGFibGVcIjtcbiAgaW1wb3J0IENvZGUgZnJvbSBcImRvY3MvQ29kZS5zdmVsdGVcIjtcbiAgaW1wb3J0IHRhYmxlIGZyb20gXCJleGFtcGxlcy90YWJsZS50eHRcIjtcblxuICBsZXQgZGF0YSA9IFtdO1xuICBsZXQgbG9hZGluZyA9IHRydWU7XG5cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xuXG4gICAgbG9hZGluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCJkYXRhLmpzb25cIik7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCk7XG5cbiAgICBkYXRhID0gYm9keS5fZW1iZWRkZWQuZXBpc29kZXM7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IGxvYWRpbmcgPSBmYWxzZSwgNTAwKTtcbiAgfVxuXG4gIGdldERhdGEoKTtcbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwib3ZlcmZsb3ctYXV0byBwLTFcIj5cbiAgPERhdGFUYWJsZVxuICAgIHtkYXRhfVxuICAgIHtsb2FkaW5nfVxuICAgIG9uOnVwZGF0ZT17KHsgZGV0YWlsIH0pID0+IHtcbiAgICAgIGNvbnN0IHsgY29sdW1uLCBpdGVtLCB2YWx1ZSB9ID0gZGV0YWlsO1xuXG4gICAgICBjb25zdCBpbmRleCA9IGRhdGEuZmluZEluZGV4KGkgPT4gaS5pZCA9PT0gaXRlbS5pZCk7XG5cbiAgICAgIGRhdGFbaW5kZXhdW2NvbHVtbi5maWVsZF0gPSB2YWx1ZTtcbiAgICB9fVxuICAgIGNvbHVtbnM9e1tcbiAgICAgIHsgbGFiZWw6IFwiSURcIiwgZmllbGQ6IFwiaWRcIiwgY2xhc3M6IFwibWQ6dy0xMFwiLCB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogXCJFcC5cIixcbiAgICAgICAgdmFsdWU6ICh2KSA9PiBgUyR7di5zZWFzb259RSR7di5udW1iZXJ9YCxcbiAgICAgICAgY2xhc3M6IFwibWQ6dy0xMFwiLFxuICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICB9LFxuICAgICAgeyBmaWVsZDogXCJuYW1lXCIsIGNsYXNzOiBcIm1kOnctMTBcIiB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogXCJzdW1tYXJ5XCIsXG4gICAgICAgIHRleHRhcmVhOiB0cnVlLFxuICAgICAgICB2YWx1ZTogdiA9PiB2ICYmIHYuc3VtbWFyeSA/IHYuc3VtbWFyeSA6IFwiXCIsXG4gICAgICAgIGFkZDogXCJ0ZXh0LXNtIHRleHQtZ3JheS03MDAgY2FwdGlvbiBtZDp3LWZ1bGwgc206dy02NFwiLFxuICAgICAgICByZW1vdmU6IFwidGV4dC1yaWdodFwiLFxuICAgICAgICBoZWFkZXJSZW1vdmU6IFwianVzdGlmeS1lbmRcIixcbiAgICAgICAgaWNvbkFmdGVyOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwidGh1bWJuYWlsXCIsXG4gICAgICAgIHZhbHVlOiAodikgPT4gdiAmJiB2LmltYWdlXG4gICAgICAgICAgPyBgPGltZyBzcmM9XCIke3YuaW1hZ2UubWVkaXVtLnJlcGxhY2UoXCJodHRwXCIsIFwiaHR0cHNcIil9XCIgaGVpZ2h0PVwiNzBcIiBhbHQ9XCIke3YubmFtZX1cIj5gXG4gICAgICAgICAgOiBcIlwiLFxuICAgICAgICBjbGFzczogXCJ3LTQ4XCIsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICBoZWFkZXJSZW1vdmU6IFwianVzdGlmeS1lbmRcIixcbiAgICAgIH1cbiAgICBdfVxuICAvPlxuXG4gIDxDb2RlIGNvZGU9e3RhYmxlfSAvPlxuPC9kaXY+Il0sIm5hbWVzIjpbImxhYmVsIiwiZmllbGQiLCJjbGFzcyIsInZhbHVlIiwiZWRpdGFibGUiLCJ0ZXh0YXJlYSIsImFkZCIsInJlbW92ZSIsImhlYWRlclJlbW92ZSIsImljb25BZnRlciIsInNvcnRhYmxlIiwidGFibGUiLCJ2Iiwic2Vhc29uIiwibnVtYmVyIiwic3VtbWFyeSIsImltYWdlIiwibWVkaXVtIiwicmVwbGFjZSIsIm5hbWUiLCJkYXRhIiwibG9hZGluZyIsImdldERhdGEiLCJ3aW5kb3ciLCJyZXMiLCJmZXRjaCIsImJvZHkiLCJqc29uIiwiX2VtYmVkZGVkIiwiZXBpc29kZXMiLCJzZXRUaW1lb3V0IiwiZGV0YWlsIiwiY29sdW1uIiwiaXRlbSIsImluZGV4IiwiZmluZEluZGV4IiwiaSIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DUUEsUUFBQUEsS0FBSyxFQUFFO0FBQU1DLFFBQUFBLEtBQUssRUFBRTtBQUFNQyxRQUFBQSxLQUFLLEVBQUU7O0FBRWpDRixRQUFBQSxLQUFLLEVBQUU7QUFDUEcsUUFBQUEsS0FBSztBQUNMRCxRQUFBQSxLQUFLLEVBQUU7QUFDUEUsUUFBQUEsUUFBUSxFQUFFOztBQUVWSCxRQUFBQSxLQUFLLEVBQUU7QUFBUUMsUUFBQUEsS0FBSyxFQUFFOztBQUV0QkQsUUFBQUEsS0FBSyxFQUFFO0FBQ1BJLFFBQUFBLFFBQVEsRUFBRTtBQUNWRixRQUFBQSxLQUFLO0FBQ0xHLFFBQUFBLEdBQUcsRUFBRTtBQUNMQyxRQUFBQSxNQUFNLEVBQUU7QUFDUkMsUUFBQUEsWUFBWSxFQUFFO0FBQ2RDLFFBQUFBLFNBQVMsRUFBRTs7QUFHWFIsUUFBQUEsS0FBSyxFQUFFO0FBQ1BFLFFBQUFBLEtBQUs7QUFHTEQsUUFBQUEsS0FBSyxFQUFFO0FBQ1BRLFFBQUFBLFFBQVEsRUFBRTtBQUNWTixRQUFBQSxRQUFRLEVBQUU7QUFDVkksUUFBQUEsWUFBWSxFQUFFOzs7Ozs7Ozs7O1lBS1JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7YUEzQkVDLENBQUMsUUFBU0EsQ0FBQyxDQUFDQyxVQUFVRCxDQUFDLENBQUNFOztlQVF6QkYsQ0FBQyxJQUFJQSxDQUFDLElBQUlBLENBQUMsQ0FBQ0csT0FBUCxHQUFpQkgsQ0FBQyxDQUFDRyxPQUFuQixHQUE2Qjs7ZUFRakNILENBQUMsSUFBS0EsQ0FBQyxJQUFJQSxDQUFDLENBQUNJLEtBQVAsZ0JBQ0dKLENBQUMsQ0FBQ0ksS0FBRixDQUFRQyxNQUFSLENBQWVDLE9BQWYsQ0FBdUIsTUFBdkIsRUFBK0IsT0FBL0IsdUJBQTZETixDQUFDLENBQUNPLFFBRGxFLEdBRVY7OztNQW5ETkMsSUFBSTtNQUNKQyxPQUFPLEdBQUc7O2lCQUVDQztlQUNGQyxXQUFXO29CQUV0QkYsT0FBTyxHQUFHO1VBQ0pHLEdBQUcsU0FBU0MsS0FBSyxDQUFDLFdBQUQ7VUFDakJDLElBQUksU0FBU0YsR0FBRyxDQUFDRyxJQUFKO29CQUVuQlAsSUFBSSxHQUFHTSxJQUFJLENBQUNFLFNBQUwsQ0FBZUM7QUFFdEJDLElBQUFBLFVBQVUsdUJBQU9ULE9BQU8sR0FBRyxNQUFqQixFQUF3QixHQUF4QixDQUFWOzs7QUFHRkMsRUFBQUEsT0FBTzs7Ozs7Ozs7Ozs7O0FBT1NTLElBQUFBOzs7QUFDSkMsTUFBQUE7QUFBUUMsTUFBQUE7QUFBTTlCLE1BQUFBO1FBQVU0QjtVQUUxQkcsS0FBSyxHQUFHZCxJQUFJLENBQUNlLFNBQUwsQ0FBZUMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEVBQUYsS0FBU0osSUFBSSxDQUFDSSxFQUFsQztvQkFFZGpCLElBQUksQ0FBQ2MsS0FBRCxDQUFKLENBQVlGLE1BQU0sQ0FBQy9CLEtBQW5CLElBQTRCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
