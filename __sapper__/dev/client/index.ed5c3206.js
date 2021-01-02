import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, e as element, a as append_dev, c as create_slot, b as createEventDispatcher, o as onMount, v as validate_slots, f as space, g as claim_element, h as children, j as detach_dev, k as claim_space, l as attr_dev, m as add_location, n as insert_dev, p as listen_dev, u as update_slot, t as transition_in, q as transition_out, r as run_all, w as validate_each_argument, x as destroy_each, y as null_to_empty, z as group_outros, A as check_outros, B as binding_callbacks, C as svg_element, D as noop, E as globals, F as create_component, G as text, H as claim_component, I as claim_text, J as mount_component, K as destroy_component, L as set_style } from './client.988f1ee2.js';
import { c as createCommonjsModule, u as unwrapExports, a as commonjsGlobal } from './_commonjsHelpers.fffabd3b.js';

var siema_min = createCommonjsModule(function (module, exports) {
  !function (e, t) {
     module.exports = t() ;
  }("undefined" != typeof self ? self : commonjsGlobal, function () {
    return function (e) {
      function t(r) {
        if (i[r]) return i[r].exports;
        var n = i[r] = {
          i: r,
          l: !1,
          exports: {}
        };
        return e[r].call(n.exports, n, n.exports, t), n.l = !0, n.exports;
      }

      var i = {};
      return t.m = e, t.c = i, t.d = function (e, i, r) {
        t.o(e, i) || Object.defineProperty(e, i, {
          configurable: !1,
          enumerable: !0,
          get: r
        });
      }, t.n = function (e) {
        var i = e && e.__esModule ? function () {
          return e.default;
        } : function () {
          return e;
        };
        return t.d(i, "a", i), i;
      }, t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }, t.p = "", t(t.s = 0);
    }([function (e, t, i) {

      function r(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }

      Object.defineProperty(t, "__esModule", {
        value: !0
      });

      var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      },
          s = function () {
        function e(e, t) {
          for (var i = 0; i < t.length; i++) {
            var r = t[i];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
          }
        }

        return function (t, i, r) {
          return i && e(t.prototype, i), r && e(t, r), t;
        };
      }(),
          l = function () {
        function e(t) {
          var i = this;
          if (r(this, e), this.config = e.mergeSettings(t), this.selector = "string" == typeof this.config.selector ? document.querySelector(this.config.selector) : this.config.selector, null === this.selector) throw new Error("Something wrong with your selector 😭");
          this.resolveSlidesNumber(), this.selectorWidth = this.selector.offsetWidth, this.innerElements = [].slice.call(this.selector.children), this.currentSlide = this.config.loop ? this.config.startIndex % this.innerElements.length : Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage)), this.transformProperty = e.webkitOrNot(), ["resizeHandler", "touchstartHandler", "touchendHandler", "touchmoveHandler", "mousedownHandler", "mouseupHandler", "mouseleaveHandler", "mousemoveHandler", "clickHandler"].forEach(function (e) {
            i[e] = i[e].bind(i);
          }), this.init();
        }

        return s(e, [{
          key: "attachEvents",
          value: function () {
            window.addEventListener("resize", this.resizeHandler), this.config.draggable && (this.pointerDown = !1, this.drag = {
              startX: 0,
              endX: 0,
              startY: 0,
              letItGo: null,
              preventClick: !1
            }, this.selector.addEventListener("touchstart", this.touchstartHandler), this.selector.addEventListener("touchend", this.touchendHandler), this.selector.addEventListener("touchmove", this.touchmoveHandler), this.selector.addEventListener("mousedown", this.mousedownHandler), this.selector.addEventListener("mouseup", this.mouseupHandler), this.selector.addEventListener("mouseleave", this.mouseleaveHandler), this.selector.addEventListener("mousemove", this.mousemoveHandler), this.selector.addEventListener("click", this.clickHandler));
          }
        }, {
          key: "detachEvents",
          value: function () {
            window.removeEventListener("resize", this.resizeHandler), this.selector.removeEventListener("touchstart", this.touchstartHandler), this.selector.removeEventListener("touchend", this.touchendHandler), this.selector.removeEventListener("touchmove", this.touchmoveHandler), this.selector.removeEventListener("mousedown", this.mousedownHandler), this.selector.removeEventListener("mouseup", this.mouseupHandler), this.selector.removeEventListener("mouseleave", this.mouseleaveHandler), this.selector.removeEventListener("mousemove", this.mousemoveHandler), this.selector.removeEventListener("click", this.clickHandler);
          }
        }, {
          key: "init",
          value: function () {
            this.attachEvents(), this.selector.style.overflow = "hidden", this.selector.style.direction = this.config.rtl ? "rtl" : "ltr", this.buildSliderFrame(), this.config.onInit.call(this);
          }
        }, {
          key: "buildSliderFrame",
          value: function () {
            var e = this.selectorWidth / this.perPage,
                t = this.config.loop ? this.innerElements.length + 2 * this.perPage : this.innerElements.length;
            this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = e * t + "px", this.enableTransition(), this.config.draggable && (this.selector.style.cursor = "-webkit-grab");
            var i = document.createDocumentFragment();
            if (this.config.loop) for (var r = this.innerElements.length - this.perPage; r < this.innerElements.length; r++) {
              var n = this.buildSliderFrameItem(this.innerElements[r].cloneNode(!0));
              i.appendChild(n);
            }

            for (var s = 0; s < this.innerElements.length; s++) {
              var l = this.buildSliderFrameItem(this.innerElements[s]);
              i.appendChild(l);
            }

            if (this.config.loop) for (var o = 0; o < this.perPage; o++) {
              var a = this.buildSliderFrameItem(this.innerElements[o].cloneNode(!0));
              i.appendChild(a);
            }
            this.sliderFrame.appendChild(i), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent();
          }
        }, {
          key: "buildSliderFrameItem",
          value: function (e) {
            var t = document.createElement("div");
            return t.style.cssFloat = this.config.rtl ? "right" : "left", t.style.float = this.config.rtl ? "right" : "left", t.style.width = (this.config.loop ? 100 / (this.innerElements.length + 2 * this.perPage) : 100 / this.innerElements.length) + "%", t.appendChild(e), t;
          }
        }, {
          key: "resolveSlidesNumber",
          value: function () {
            if ("number" == typeof this.config.perPage) this.perPage = this.config.perPage;else if ("object" === n(this.config.perPage)) {
              this.perPage = 1;

              for (var e in this.config.perPage) window.innerWidth >= e && (this.perPage = this.config.perPage[e]);
            }
          }
        }, {
          key: "prev",
          value: function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                t = arguments[1];

            if (!(this.innerElements.length <= this.perPage)) {
              var i = this.currentSlide;

              if (this.config.loop) {
                if (this.currentSlide - e < 0) {
                  this.disableTransition();
                  var r = this.currentSlide + this.innerElements.length,
                      n = this.perPage,
                      s = r + n,
                      l = (this.config.rtl ? 1 : -1) * s * (this.selectorWidth / this.perPage),
                      o = this.config.draggable ? this.drag.endX - this.drag.startX : 0;
                  this.sliderFrame.style[this.transformProperty] = "translate3d(" + (l + o) + "px, 0, 0)", this.currentSlide = r - e;
                } else this.currentSlide = this.currentSlide - e;
              } else this.currentSlide = Math.max(this.currentSlide - e, 0);

              i !== this.currentSlide && (this.slideToCurrent(this.config.loop), this.config.onChange.call(this), t && t.call(this));
            }
          }
        }, {
          key: "next",
          value: function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                t = arguments[1];

            if (!(this.innerElements.length <= this.perPage)) {
              var i = this.currentSlide;

              if (this.config.loop) {
                if (this.currentSlide + e > this.innerElements.length - this.perPage) {
                  this.disableTransition();
                  var r = this.currentSlide - this.innerElements.length,
                      n = this.perPage,
                      s = r + n,
                      l = (this.config.rtl ? 1 : -1) * s * (this.selectorWidth / this.perPage),
                      o = this.config.draggable ? this.drag.endX - this.drag.startX : 0;
                  this.sliderFrame.style[this.transformProperty] = "translate3d(" + (l + o) + "px, 0, 0)", this.currentSlide = r + e;
                } else this.currentSlide = this.currentSlide + e;
              } else this.currentSlide = Math.min(this.currentSlide + e, this.innerElements.length - this.perPage);

              i !== this.currentSlide && (this.slideToCurrent(this.config.loop), this.config.onChange.call(this), t && t.call(this));
            }
          }
        }, {
          key: "disableTransition",
          value: function () {
            this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
          }
        }, {
          key: "enableTransition",
          value: function () {
            this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing;
          }
        }, {
          key: "goTo",
          value: function (e, t) {
            if (!(this.innerElements.length <= this.perPage)) {
              var i = this.currentSlide;
              this.currentSlide = this.config.loop ? e % this.innerElements.length : Math.min(Math.max(e, 0), this.innerElements.length - this.perPage), i !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), t && t.call(this));
            }
          }
        }, {
          key: "slideToCurrent",
          value: function (e) {
            var t = this,
                i = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide,
                r = (this.config.rtl ? 1 : -1) * i * (this.selectorWidth / this.perPage);
            e ? requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                t.enableTransition(), t.sliderFrame.style[t.transformProperty] = "translate3d(" + r + "px, 0, 0)";
              });
            }) : this.sliderFrame.style[this.transformProperty] = "translate3d(" + r + "px, 0, 0)";
          }
        }, {
          key: "updateAfterDrag",
          value: function () {
            var e = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX),
                t = Math.abs(e),
                i = this.config.multipleDrag ? Math.ceil(t / (this.selectorWidth / this.perPage)) : 1,
                r = e > 0 && this.currentSlide - i < 0,
                n = e < 0 && this.currentSlide + i > this.innerElements.length - this.perPage;
            e > 0 && t > this.config.threshold && this.innerElements.length > this.perPage ? this.prev(i) : e < 0 && t > this.config.threshold && this.innerElements.length > this.perPage && this.next(i), this.slideToCurrent(r || n);
          }
        }, {
          key: "resizeHandler",
          value: function () {
            this.resolveSlidesNumber(), this.currentSlide + this.perPage > this.innerElements.length && (this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage), this.selectorWidth = this.selector.offsetWidth, this.buildSliderFrame();
          }
        }, {
          key: "clearDrag",
          value: function () {
            this.drag = {
              startX: 0,
              endX: 0,
              startY: 0,
              letItGo: null,
              preventClick: this.drag.preventClick
            };
          }
        }, {
          key: "touchstartHandler",
          value: function (e) {
            -1 !== ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e.target.nodeName) || (e.stopPropagation(), this.pointerDown = !0, this.drag.startX = e.touches[0].pageX, this.drag.startY = e.touches[0].pageY);
          }
        }, {
          key: "touchendHandler",
          value: function (e) {
            e.stopPropagation(), this.pointerDown = !1, this.enableTransition(), this.drag.endX && this.updateAfterDrag(), this.clearDrag();
          }
        }, {
          key: "touchmoveHandler",
          value: function (e) {
            if (e.stopPropagation(), null === this.drag.letItGo && (this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX)), this.pointerDown && this.drag.letItGo) {
              e.preventDefault(), this.drag.endX = e.touches[0].pageX, this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
              var t = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide,
                  i = t * (this.selectorWidth / this.perPage),
                  r = this.drag.endX - this.drag.startX,
                  n = this.config.rtl ? i + r : i - r;
              this.sliderFrame.style[this.transformProperty] = "translate3d(" + (this.config.rtl ? 1 : -1) * n + "px, 0, 0)";
            }
          }
        }, {
          key: "mousedownHandler",
          value: function (e) {
            -1 !== ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e.target.nodeName) || (e.preventDefault(), e.stopPropagation(), this.pointerDown = !0, this.drag.startX = e.pageX);
          }
        }, {
          key: "mouseupHandler",
          value: function (e) {
            e.stopPropagation(), this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.enableTransition(), this.drag.endX && this.updateAfterDrag(), this.clearDrag();
          }
        }, {
          key: "mousemoveHandler",
          value: function (e) {
            if (e.preventDefault(), this.pointerDown) {
              "A" === e.target.nodeName && (this.drag.preventClick = !0), this.drag.endX = e.pageX, this.selector.style.cursor = "-webkit-grabbing", this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
              var t = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide,
                  i = t * (this.selectorWidth / this.perPage),
                  r = this.drag.endX - this.drag.startX,
                  n = this.config.rtl ? i + r : i - r;
              this.sliderFrame.style[this.transformProperty] = "translate3d(" + (this.config.rtl ? 1 : -1) * n + "px, 0, 0)";
            }
          }
        }, {
          key: "mouseleaveHandler",
          value: function (e) {
            this.pointerDown && (this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.drag.endX = e.pageX, this.drag.preventClick = !1, this.enableTransition(), this.updateAfterDrag(), this.clearDrag());
          }
        }, {
          key: "clickHandler",
          value: function (e) {
            this.drag.preventClick && e.preventDefault(), this.drag.preventClick = !1;
          }
        }, {
          key: "remove",
          value: function (e, t) {
            if (e < 0 || e >= this.innerElements.length) throw new Error("Item to remove doesn't exist 😭");
            var i = e < this.currentSlide,
                r = this.currentSlide + this.perPage - 1 === e;
            (i || r) && this.currentSlide--, this.innerElements.splice(e, 1), this.buildSliderFrame(), t && t.call(this);
          }
        }, {
          key: "insert",
          value: function (e, t, i) {
            if (t < 0 || t > this.innerElements.length + 1) throw new Error("Unable to inset it at this index 😭");
            if (-1 !== this.innerElements.indexOf(e)) throw new Error("The same item in a carousel? Really? Nope 😭");
            var r = t <= this.currentSlide > 0 && this.innerElements.length;
            this.currentSlide = r ? this.currentSlide + 1 : this.currentSlide, this.innerElements.splice(t, 0, e), this.buildSliderFrame(), i && i.call(this);
          }
        }, {
          key: "prepend",
          value: function (e, t) {
            this.insert(e, 0), t && t.call(this);
          }
        }, {
          key: "append",
          value: function (e, t) {
            this.insert(e, this.innerElements.length + 1), t && t.call(this);
          }
        }, {
          key: "destroy",
          value: function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                t = arguments[1];

            if (this.detachEvents(), this.selector.style.cursor = "auto", e) {
              for (var i = document.createDocumentFragment(), r = 0; r < this.innerElements.length; r++) i.appendChild(this.innerElements[r]);

              this.selector.innerHTML = "", this.selector.appendChild(i), this.selector.removeAttribute("style");
            }

            t && t.call(this);
          }
        }], [{
          key: "mergeSettings",
          value: function (e) {
            var t = {
              selector: ".siema",
              duration: 200,
              easing: "ease-out",
              perPage: 1,
              startIndex: 0,
              draggable: !0,
              multipleDrag: !0,
              threshold: 20,
              loop: !1,
              rtl: !1,
              onInit: function () {},
              onChange: function () {}
            },
                i = e;

            for (var r in i) t[r] = i[r];

            return t;
          }
        }, {
          key: "webkitOrNot",
          value: function () {
            return "string" == typeof document.documentElement.style.transform ? "transform" : "WebkitTransform";
          }
        }]), e;
      }();

      t.default = l, e.exports = t.default;
    }]);
  });
});
var Siema = unwrapExports(siema_min);
var siema_min_1 = siema_min.Siema;

/* node_modules/@beyonk/svelte-carousel/src/Carousel.svelte generated by Svelte v3.24.0 */
const file = "node_modules/@beyonk/svelte-carousel/src/Carousel.svelte";

function add_css() {
  var style = element("style");
  style.id = "svelte-1ppqxio-style";
  style.textContent = ".carousel.svelte-1ppqxio.svelte-1ppqxio{position:relative;width:100%;justify-content:center;align-items:center}button.svelte-1ppqxio.svelte-1ppqxio{position:absolute;width:40px;height:40px;top:50%;z-index:50;margin-top:-20px;border:none;background-color:transparent}button.svelte-1ppqxio.svelte-1ppqxio:focus{outline:none}.left.svelte-1ppqxio.svelte-1ppqxio{left:2vw}.right.svelte-1ppqxio.svelte-1ppqxio{right:2vw}ul.svelte-1ppqxio.svelte-1ppqxio{list-style-type:none;position:absolute;display:flex;justify-content:center;width:100%;margin-top:-30px;padding:0}ul.svelte-1ppqxio li.svelte-1ppqxio{margin:6px;border-radius:100%;background-color:rgba(255,255,255,0.5);height:8px;width:8px}ul.svelte-1ppqxio li.svelte-1ppqxio:hover{background-color:rgba(255,255,255,0.85)}ul.svelte-1ppqxio li.active.svelte-1ppqxio{background-color:rgba(255,255,255,1)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2Fyb3VzZWwuc3ZlbHRlIiwic291cmNlcyI6WyJDYXJvdXNlbC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiXG48ZGl2IGNsYXNzPVwiY2Fyb3VzZWxcIj5cblx0PGRpdiBjbGFzcz1cInNsaWRlc1wiIGJpbmQ6dGhpcz17c2llbWF9PlxuXHRcdDxzbG90Pjwvc2xvdD5cblx0PC9kaXY+XG5cdHsjaWYgY29udHJvbHN9XG5cdDxidXR0b24gY2xhc3M9XCJsZWZ0XCIgb246Y2xpY2s9e2xlZnR9IGFyaWEtbGFiZWw9XCJsZWZ0XCI+XG5cdFx0PHNsb3QgbmFtZT1cImxlZnQtY29udHJvbFwiPjwvc2xvdD5cblx0PC9idXR0b24+XG5cdDxidXR0b24gY2xhc3M9XCJyaWdodFwiIG9uOmNsaWNrPXtyaWdodH0gYXJpYS1sYWJlbD1cInJpZ2h0XCI+XG5cdFx0PHNsb3QgbmFtZT1cInJpZ2h0LWNvbnRyb2xcIj48L3Nsb3Q+XG5cdDwvYnV0dG9uPlxuXHR7L2lmfVxuICAgIHsjaWYgZG90c31cblx0PHVsPlxuXHRcdHsjZWFjaCB7bGVuZ3RoOiB0b3RhbERvdHN9IGFzIF8sIGl9XG5cdFx0PGxpIG9uOmNsaWNrPXsoKSA9PiBnbyhpKmN1cnJlbnRQZXJQYWdlKX0gY2xhc3M9e2lzRG90QWN0aXZlKGN1cnJlbnRJbmRleCwgaSkgPyBcImFjdGl2ZVwiIDogXCJcIn0+PC9saT5cblx0XHR7L2VhY2h9XG5cdDwvdWw+XG4gICAgey9pZn1cbjwvZGl2PlxuXG48c3R5bGU+XG5cdC5jYXJvdXNlbCB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdHdpZHRoOiAxMDAlO1xuXHRcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdH1cblx0XG5cdGJ1dHRvbiB7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdHdpZHRoOiA0MHB4O1xuXHRcdGhlaWdodDogNDBweDtcblx0XHR0b3A6IDUwJTtcblx0XHR6LWluZGV4OiA1MDtcblx0XHRtYXJnaW4tdG9wOiAtMjBweDtcblx0XHRib3JkZXI6IG5vbmU7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cdH1cblxuICBidXR0b246Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cblx0XG5cdC5sZWZ0IHtcblx0XHRsZWZ0OiAydnc7XG5cdH1cblx0XG5cdC5yaWdodCB7XG5cdFx0cmlnaHQ6IDJ2dztcblx0fVxuXG5cdHVsIHtcblx0XHRsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0bWFyZ2luLXRvcDogLTMwcHg7XG5cdFx0cGFkZGluZzogMDtcblx0fVxuXG5cdHVsIGxpIHtcblx0XHRtYXJnaW46IDZweDtcblx0XHRib3JkZXItcmFkaXVzOiAxMDAlO1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC41KTtcblx0XHRoZWlnaHQ6IDhweDtcblx0XHR3aWR0aDogOHB4O1xuXHR9XG5cblx0dWwgbGk6aG92ZXIge1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC44NSk7XG5cdH1cblxuXHR1bCBsaS5hY3RpdmUge1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMSk7XG5cdH1cbjwvc3R5bGU+XG5cbjxzY3JpcHQ+XG5cdGltcG9ydCBTaWVtYSBmcm9tICdzaWVtYSdcblx0aW1wb3J0IHsgb25Nb3VudCwgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJ1xuXHRcblx0ZXhwb3J0IGxldCBwZXJQYWdlID0gM1xuXHRleHBvcnQgbGV0IGxvb3AgPSB0cnVlXG5cdGV4cG9ydCBsZXQgYXV0b3BsYXkgPSAwXG5cdGV4cG9ydCBsZXQgZHVyYXRpb24gPSAyMDBcblx0ZXhwb3J0IGxldCBlYXNpbmcgPSAnZWFzZS1vdXQnXG5cdGV4cG9ydCBsZXQgc3RhcnRJbmRleCA9IDBcblx0ZXhwb3J0IGxldCBkcmFnZ2FibGUgPSB0cnVlXG5cdGV4cG9ydCBsZXQgbXVsdGlwbGVEcmFnID0gdHJ1ZVx0XG5cdGV4cG9ydCBsZXQgZG90cyA9IHRydWVcdFxuXHRleHBvcnQgbGV0IGNvbnRyb2xzID0gdHJ1ZVxuXHRleHBvcnQgbGV0IHRocmVzaG9sZCA9IDIwXG5cdGV4cG9ydCBsZXQgcnRsID0gZmFsc2Vcblx0bGV0IGN1cnJlbnRJbmRleCA9IHN0YXJ0SW5kZXg7XG5cdFxuXHRsZXQgc2llbWFcblx0bGV0IGNvbnRyb2xsZXJcblx0bGV0IHRpbWVyXG5cblx0Y29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxuXG5cdCQ6IHBpcHMgPSBjb250cm9sbGVyID8gY29udHJvbGxlci5pbm5lckVsZW1lbnRzIDogW11cblx0JDogY3VycmVudFBlclBhZ2UgPSBjb250cm9sbGVyID8gY29udHJvbGxlci5wZXJQYWdlIDogcGVyUGFnZVxuXHQkOiB0b3RhbERvdHMgPSBjb250cm9sbGVyID8gTWF0aC5jZWlsKGNvbnRyb2xsZXIuaW5uZXJFbGVtZW50cy5sZW5ndGggLyBjdXJyZW50UGVyUGFnZSkgOiBbXVxuXHRcblx0b25Nb3VudCgoKSA9PiB7XG5cdFx0Y29udHJvbGxlciA9IG5ldyBTaWVtYSh7XG5cdFx0XHRzZWxlY3Rvcjogc2llbWEsXG5cdFx0XHRwZXJQYWdlOiB0eXBlb2YgcGVyUGFnZSA9PT0gJ29iamVjdCcgPyBwZXJQYWdlIDogTnVtYmVyKHBlclBhZ2UpLFxuXHRcdFx0bG9vcCxcbiAgXHRcdFx0ZHVyYXRpb24sXG4gIFx0XHRcdGVhc2luZyxcbiAgXHRcdFx0c3RhcnRJbmRleCxcbiAgXHRcdFx0ZHJhZ2dhYmxlLFxuIFx0XHRcdG11bHRpcGxlRHJhZyxcbiAgXHRcdFx0dGhyZXNob2xkLFxuICBcdFx0XHRydGwsXG5cdFx0XHRvbkNoYW5nZTogaGFuZGxlQ2hhbmdlXG5cdFx0fSlcblx0XHRcblx0XHRpZihhdXRvcGxheSkge1xuXHRcdFx0dGltZXIgPSBzZXRJbnRlcnZhbChyaWdodCwgYXV0b3BsYXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRhdXRvcGxheSAmJiBjbGVhckludGVydmFsKHRpbWVyKVxuXHRcdFx0Y29udHJvbGxlci5kZXN0cm95KClcblx0XHR9XG5cdH0pXG5cblx0ZXhwb3J0IGZ1bmN0aW9uIGlzRG90QWN0aXZlIChjdXJyZW50SW5kZXgsIGRvdEluZGV4KSB7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPCAwKSBjdXJyZW50SW5kZXggPSBwaXBzLmxlbmd0aCArIGN1cnJlbnRJbmRleDtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRJbmRleCA+PSBkb3RJbmRleCpjdXJyZW50UGVyUGFnZSAmJiBjdXJyZW50SW5kZXggPCAoZG90SW5kZXgqY3VycmVudFBlclBhZ2UpK2N1cnJlbnRQZXJQYWdlXG4gICAgfVxuXHRcblx0ZXhwb3J0IGZ1bmN0aW9uIGxlZnQgKCkge1xuXHRcdGNvbnRyb2xsZXIucHJldigpXG5cdH1cblx0XG5cdGV4cG9ydCBmdW5jdGlvbiByaWdodCAoKSB7XG5cdFx0Y29udHJvbGxlci5uZXh0KClcblx0fVxuXG5cdGV4cG9ydCBmdW5jdGlvbiBnbyAoaW5kZXgpIHtcblx0XHRjb250cm9sbGVyLmdvVG8oaW5kZXgpXG5cdH1cblx0XG5cdGV4cG9ydCBmdW5jdGlvbiBwYXVzZSgpIHtcblx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcblx0fVxuXG5cdGV4cG9ydCBmdW5jdGlvbiByZXN1bWUoKSB7XG5cdFx0aWYgKGF1dG9wbGF5KSB7XG5cdFx0XHR0aW1lciA9IHNldEludGVydmFsKHJpZ2h0LCBhdXRvcGxheSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlQ2hhbmdlIChldmVudCkge1xuXHRcdGN1cnJlbnRJbmRleCA9IGNvbnRyb2xsZXIuY3VycmVudFNsaWRlXG5cblx0XHRkaXNwYXRjaCgnY2hhbmdlJywge1xuXHRcdFx0Y3VycmVudFNsaWRlOiBjb250cm9sbGVyLmN1cnJlbnRTbGlkZSxcblx0XHRcdHNsaWRlQ291bnQ6IGNvbnRyb2xsZXIuaW5uZXJFbGVtZW50cy5sZW5ndGhcblx0XHR9IClcblx0fVxuPC9zY3JpcHQ+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUJDLFNBQVMsOEJBQUMsQ0FBQyxBQUNWLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEtBQUssQ0FBRSxJQUFJLENBQ1gsZUFBZSxDQUFFLE1BQU0sQ0FDdkIsV0FBVyxDQUFFLE1BQU0sQUFDcEIsQ0FBQyxBQUVELE1BQU0sOEJBQUMsQ0FBQyxBQUNQLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixHQUFHLENBQUUsR0FBRyxDQUNSLE9BQU8sQ0FBRSxFQUFFLENBQ1gsVUFBVSxDQUFFLEtBQUssQ0FDakIsTUFBTSxDQUFFLElBQUksQ0FDWixnQkFBZ0IsQ0FBRSxXQUFXLEFBQzlCLENBQUMsQUFFQSxvQ0FBTSxNQUFNLEFBQUMsQ0FBQyxBQUNaLE9BQU8sQ0FBRSxJQUFJLEFBQ2YsQ0FBQyxBQUVGLEtBQUssOEJBQUMsQ0FBQyxBQUNOLElBQUksQ0FBRSxHQUFHLEFBQ1YsQ0FBQyxBQUVELE1BQU0sOEJBQUMsQ0FBQyxBQUNQLEtBQUssQ0FBRSxHQUFHLEFBQ1gsQ0FBQyxBQUVELEVBQUUsOEJBQUMsQ0FBQyxBQUNILGVBQWUsQ0FBRSxJQUFJLENBQ3JCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsZUFBZSxDQUFFLE1BQU0sQ0FDdkIsS0FBSyxDQUFFLElBQUksQ0FDWCxVQUFVLENBQUUsS0FBSyxDQUNqQixPQUFPLENBQUUsQ0FBQyxBQUNYLENBQUMsQUFFRCxpQkFBRSxDQUFDLEVBQUUsZUFBQyxDQUFDLEFBQ04sTUFBTSxDQUFFLEdBQUcsQ0FDWCxhQUFhLENBQUUsSUFBSSxDQUNuQixnQkFBZ0IsQ0FBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUN2QyxNQUFNLENBQUUsR0FBRyxDQUNYLEtBQUssQ0FBRSxHQUFHLEFBQ1gsQ0FBQyxBQUVELGlCQUFFLENBQUMsaUJBQUUsTUFBTSxBQUFDLENBQUMsQUFDWixnQkFBZ0IsQ0FBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxBQUN6QyxDQUFDLEFBRUQsaUJBQUUsQ0FBQyxFQUFFLE9BQU8sZUFBQyxDQUFDLEFBQ2IsZ0JBQWdCLENBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQUFDdEMsQ0FBQyJ9 */";
  append_dev(document.head, style);
}

function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[31] = list[i];
  child_ctx[33] = i;
  return child_ctx;
}

const get_right_control_slot_changes = dirty => ({});

const get_right_control_slot_context = ctx => ({});

const get_left_control_slot_changes = dirty => ({});

const get_left_control_slot_context = ctx => ({}); // (6:1) {#if controls}


function create_if_block_1(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  let mounted;
  let dispose;
  const left_control_slot_template =
  /*$$slots*/
  ctx[23]["left-control"];
  const left_control_slot = create_slot(left_control_slot_template, ctx,
  /*$$scope*/
  ctx[22], get_left_control_slot_context);
  const right_control_slot_template =
  /*$$slots*/
  ctx[23]["right-control"];
  const right_control_slot = create_slot(right_control_slot_template, ctx,
  /*$$scope*/
  ctx[22], get_right_control_slot_context);
  const block = {
    c: function create() {
      button0 = element("button");
      if (left_control_slot) left_control_slot.c();
      t = space();
      button1 = element("button");
      if (right_control_slot) right_control_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      button0 = claim_element(nodes, "BUTTON", {
        class: true,
        "aria-label": true
      });
      var button0_nodes = children(button0);
      if (left_control_slot) left_control_slot.l(button0_nodes);
      button0_nodes.forEach(detach_dev);
      t = claim_space(nodes);
      button1 = claim_element(nodes, "BUTTON", {
        class: true,
        "aria-label": true
      });
      var button1_nodes = children(button1);
      if (right_control_slot) right_control_slot.l(button1_nodes);
      button1_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(button0, "class", "left svelte-1ppqxio");
      attr_dev(button0, "aria-label", "left");
      add_location(button0, file, 6, 1, 105);
      attr_dev(button1, "class", "right svelte-1ppqxio");
      attr_dev(button1, "aria-label", "right");
      add_location(button1, file, 9, 1, 209);
    },
    m: function mount(target, anchor) {
      insert_dev(target, button0, anchor);

      if (left_control_slot) {
        left_control_slot.m(button0, null);
      }

      insert_dev(target, t, anchor);
      insert_dev(target, button1, anchor);

      if (right_control_slot) {
        right_control_slot.m(button1, null);
      }

      current = true;

      if (!mounted) {
        dispose = [listen_dev(button0, "click",
        /*left*/
        ctx[3], false, false, false), listen_dev(button1, "click",
        /*right*/
        ctx[4], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, dirty) {
      if (left_control_slot) {
        if (left_control_slot.p && dirty[0] &
        /*$$scope*/
        4194304) {
          update_slot(left_control_slot, left_control_slot_template, ctx,
          /*$$scope*/
          ctx[22], dirty, get_left_control_slot_changes, get_left_control_slot_context);
        }
      }

      if (right_control_slot) {
        if (right_control_slot.p && dirty[0] &
        /*$$scope*/
        4194304) {
          update_slot(right_control_slot, right_control_slot_template, ctx,
          /*$$scope*/
          ctx[22], dirty, get_right_control_slot_changes, get_right_control_slot_context);
        }
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(left_control_slot, local);
      transition_in(right_control_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(left_control_slot, local);
      transition_out(right_control_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(button0);
      if (left_control_slot) left_control_slot.d(detaching);
      if (detaching) detach_dev(t);
      if (detaching) detach_dev(button1);
      if (right_control_slot) right_control_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1.name,
    type: "if",
    source: "(6:1) {#if controls}",
    ctx
  });
  return block;
} // (14:4) {#if dots}


function create_if_block(ctx) {
  let ul;
  let each_value = {
    length:
    /*totalDots*/
    ctx[9]
  };
  validate_each_argument(each_value);
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  const block = {
    c: function create() {
      ul = element("ul");

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      this.h();
    },
    l: function claim(nodes) {
      ul = claim_element(nodes, "UL", {
        class: true
      });
      var ul_nodes = children(ul);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(ul_nodes);
      }

      ul_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(ul, "class", "svelte-1ppqxio");
      add_location(ul, file, 14, 1, 339);
    },
    m: function mount(target, anchor) {
      insert_dev(target, ul, anchor);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }
    },
    p: function update(ctx, dirty) {
      if (dirty[0] &
      /*isDotActive, currentIndex, go, currentPerPage, totalDots*/
      868) {
        each_value = {
          length:
          /*totalDots*/
          ctx[9]
        };
        validate_each_argument(each_value);
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }

        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }

        each_blocks.length = each_value.length;
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(ul);
      destroy_each(each_blocks, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block.name,
    type: "if",
    source: "(14:4) {#if dots}",
    ctx
  });
  return block;
} // (16:2) {#each {length: totalDots} as _, i}


function create_each_block(ctx) {
  let li;
  let li_class_value;
  let mounted;
  let dispose;

  function click_handler(...args) {
    return (
      /*click_handler*/
      ctx[25](
      /*i*/
      ctx[33], ...args)
    );
  }

  const block = {
    c: function create() {
      li = element("li");
      this.h();
    },
    l: function claim(nodes) {
      li = claim_element(nodes, "LI", {
        class: true
      });
      children(li).forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(li, "class", li_class_value = "" + (null_to_empty(
      /*isDotActive*/
      ctx[2](
      /*currentIndex*/
      ctx[6],
      /*i*/
      ctx[33]) ? "active" : "") + " svelte-1ppqxio"));
      add_location(li, file, 16, 2, 384);
    },
    m: function mount(target, anchor) {
      insert_dev(target, li, anchor);

      if (!mounted) {
        dispose = listen_dev(li, "click", click_handler, false, false, false);
        mounted = true;
      }
    },
    p: function update(new_ctx, dirty) {
      ctx = new_ctx;

      if (dirty[0] &
      /*currentIndex*/
      64 && li_class_value !== (li_class_value = "" + (null_to_empty(
      /*isDotActive*/
      ctx[2](
      /*currentIndex*/
      ctx[6],
      /*i*/
      ctx[33]) ? "active" : "") + " svelte-1ppqxio"))) {
        attr_dev(li, "class", li_class_value);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(li);
      mounted = false;
      dispose();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block.name,
    type: "each",
    source: "(16:2) {#each {length: totalDots} as _, i}",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let div1;
  let div0;
  let t0;
  let t1;
  let current;
  const default_slot_template =
  /*$$slots*/
  ctx[23].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[22], null);
  let if_block0 =
  /*controls*/
  ctx[1] && create_if_block_1(ctx);
  let if_block1 =
  /*dots*/
  ctx[0] && create_if_block(ctx);
  const block = {
    c: function create() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot) default_slot.c();
      t0 = space();
      if (if_block0) if_block0.c();
      t1 = space();
      if (if_block1) if_block1.c();
      this.h();
    },
    l: function claim(nodes) {
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      if (default_slot) default_slot.l(div0_nodes);
      div0_nodes.forEach(detach_dev);
      t0 = claim_space(div1_nodes);
      if (if_block0) if_block0.l(div1_nodes);
      t1 = claim_space(div1_nodes);
      if (if_block1) if_block1.l(div1_nodes);
      div1_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "slides");
      add_location(div0, file, 2, 1, 25);
      attr_dev(div1, "class", "carousel svelte-1ppqxio");
      add_location(div1, file, 1, 0, 1);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div1, anchor);
      append_dev(div1, div0);

      if (default_slot) {
        default_slot.m(div0, null);
      }
      /*div0_binding*/


      ctx[24](div0);
      append_dev(div1, t0);
      if (if_block0) if_block0.m(div1, null);
      append_dev(div1, t1);
      if (if_block1) if_block1.m(div1, null);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && dirty[0] &
        /*$$scope*/
        4194304) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[22], dirty, null, null);
        }
      }

      if (
      /*controls*/
      ctx[1]) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty[0] &
          /*controls*/
          2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div1, t1);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }

      if (
      /*dots*/
      ctx[0]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block(ctx);
          if_block1.c();
          if_block1.m(div1, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      transition_in(if_block0);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      transition_out(if_block0);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div1);
      if (default_slot) default_slot.d(detaching);
      /*div0_binding*/

      ctx[24](null);
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
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
    perPage = 3
  } = $$props;
  let {
    loop = true
  } = $$props;
  let {
    autoplay = 0
  } = $$props;
  let {
    duration = 200
  } = $$props;
  let {
    easing = "ease-out"
  } = $$props;
  let {
    startIndex = 0
  } = $$props;
  let {
    draggable = true
  } = $$props;
  let {
    multipleDrag = true
  } = $$props;
  let {
    dots = true
  } = $$props;
  let {
    controls = true
  } = $$props;
  let {
    threshold = 20
  } = $$props;
  let {
    rtl = false
  } = $$props;
  let currentIndex = startIndex;
  let siema;
  let controller;
  let timer;
  const dispatch = createEventDispatcher();
  onMount(() => {
    $$invalidate(26, controller = new Siema({
      selector: siema,
      perPage: typeof perPage === "object" ? perPage : Number(perPage),
      loop,
      duration,
      easing,
      startIndex,
      draggable,
      multipleDrag,
      threshold,
      rtl,
      onChange: handleChange
    }));

    if (autoplay) {
      timer = setInterval(right, autoplay);
    }

    return () => {
      autoplay && clearInterval(timer);
      controller.destroy();
    };
  });

  function isDotActive(currentIndex, dotIndex) {
    if (currentIndex < 0) currentIndex = pips.length + currentIndex;
    return currentIndex >= dotIndex * currentPerPage && currentIndex < dotIndex * currentPerPage + currentPerPage;
  }

  function left() {
    controller.prev();
  }

  function right() {
    controller.next();
  }

  function go(index) {
    controller.goTo(index);
  }

  function pause() {
    clearInterval(timer);
  }

  function resume() {
    if (autoplay) {
      timer = setInterval(right, autoplay);
    }
  }

  function handleChange(event) {
    $$invalidate(6, currentIndex = controller.currentSlide);
    dispatch("change", {
      currentSlide: controller.currentSlide,
      slideCount: controller.innerElements.length
    });
  }

  const writable_props = ["perPage", "loop", "autoplay", "duration", "easing", "startIndex", "draggable", "multipleDrag", "dots", "controls", "threshold", "rtl"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Carousel> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Carousel", $$slots, ['default', 'left-control', 'right-control']);

  function div0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      siema = $$value;
      $$invalidate(7, siema);
    });
  }

  const click_handler = i => go(i * currentPerPage);

  $$self.$set = $$props => {
    if ("perPage" in $$props) $$invalidate(10, perPage = $$props.perPage);
    if ("loop" in $$props) $$invalidate(11, loop = $$props.loop);
    if ("autoplay" in $$props) $$invalidate(12, autoplay = $$props.autoplay);
    if ("duration" in $$props) $$invalidate(13, duration = $$props.duration);
    if ("easing" in $$props) $$invalidate(14, easing = $$props.easing);
    if ("startIndex" in $$props) $$invalidate(15, startIndex = $$props.startIndex);
    if ("draggable" in $$props) $$invalidate(16, draggable = $$props.draggable);
    if ("multipleDrag" in $$props) $$invalidate(17, multipleDrag = $$props.multipleDrag);
    if ("dots" in $$props) $$invalidate(0, dots = $$props.dots);
    if ("controls" in $$props) $$invalidate(1, controls = $$props.controls);
    if ("threshold" in $$props) $$invalidate(18, threshold = $$props.threshold);
    if ("rtl" in $$props) $$invalidate(19, rtl = $$props.rtl);
    if ("$$scope" in $$props) $$invalidate(22, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = () => ({
    Siema,
    onMount,
    createEventDispatcher,
    perPage,
    loop,
    autoplay,
    duration,
    easing,
    startIndex,
    draggable,
    multipleDrag,
    dots,
    controls,
    threshold,
    rtl,
    currentIndex,
    siema,
    controller,
    timer,
    dispatch,
    isDotActive,
    left,
    right,
    go,
    pause,
    resume,
    handleChange,
    pips,
    currentPerPage,
    totalDots
  });

  $$self.$inject_state = $$props => {
    if ("perPage" in $$props) $$invalidate(10, perPage = $$props.perPage);
    if ("loop" in $$props) $$invalidate(11, loop = $$props.loop);
    if ("autoplay" in $$props) $$invalidate(12, autoplay = $$props.autoplay);
    if ("duration" in $$props) $$invalidate(13, duration = $$props.duration);
    if ("easing" in $$props) $$invalidate(14, easing = $$props.easing);
    if ("startIndex" in $$props) $$invalidate(15, startIndex = $$props.startIndex);
    if ("draggable" in $$props) $$invalidate(16, draggable = $$props.draggable);
    if ("multipleDrag" in $$props) $$invalidate(17, multipleDrag = $$props.multipleDrag);
    if ("dots" in $$props) $$invalidate(0, dots = $$props.dots);
    if ("controls" in $$props) $$invalidate(1, controls = $$props.controls);
    if ("threshold" in $$props) $$invalidate(18, threshold = $$props.threshold);
    if ("rtl" in $$props) $$invalidate(19, rtl = $$props.rtl);
    if ("currentIndex" in $$props) $$invalidate(6, currentIndex = $$props.currentIndex);
    if ("siema" in $$props) $$invalidate(7, siema = $$props.siema);
    if ("controller" in $$props) $$invalidate(26, controller = $$props.controller);
    if ("timer" in $$props) timer = $$props.timer;
    if ("pips" in $$props) pips = $$props.pips;
    if ("currentPerPage" in $$props) $$invalidate(8, currentPerPage = $$props.currentPerPage);
    if ("totalDots" in $$props) $$invalidate(9, totalDots = $$props.totalDots);
  };

  let pips;
  let currentPerPage;
  let totalDots;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] &
    /*controller*/
    67108864) {
       pips = controller ? controller.innerElements : [];
    }

    if ($$self.$$.dirty[0] &
    /*controller, perPage*/
    67109888) {
       $$invalidate(8, currentPerPage = controller ? controller.perPage : perPage);
    }

    if ($$self.$$.dirty[0] &
    /*controller, currentPerPage*/
    67109120) {
       $$invalidate(9, totalDots = controller ? Math.ceil(controller.innerElements.length / currentPerPage) : []);
    }
  };

  return [dots, controls, isDotActive, left, right, go, currentIndex, siema, currentPerPage, totalDots, perPage, loop, autoplay, duration, easing, startIndex, draggable, multipleDrag, threshold, rtl, pause, resume, $$scope, $$slots, div0_binding, click_handler];
}

class Carousel extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-1ppqxio-style")) add_css();
    init(this, options, instance, create_fragment, safe_not_equal, {
      perPage: 10,
      loop: 11,
      autoplay: 12,
      duration: 13,
      easing: 14,
      startIndex: 15,
      draggable: 16,
      multipleDrag: 17,
      dots: 0,
      controls: 1,
      threshold: 18,
      rtl: 19,
      isDotActive: 2,
      left: 3,
      right: 4,
      go: 5,
      pause: 20,
      resume: 21
    }, [-1, -1]);
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Carousel",
      options,
      id: create_fragment.name
    });
  }

  get perPage() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set perPage(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get loop() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set loop(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get autoplay() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set autoplay(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get duration() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set duration(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get easing() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set easing(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get startIndex() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set startIndex(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get draggable() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set draggable(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get multipleDrag() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set multipleDrag(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get dots() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set dots(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get controls() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set controls(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get threshold() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set threshold(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get rtl() {
    throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set rtl(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get isDotActive() {
    return this.$$.ctx[2];
  }

  set isDotActive(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get left() {
    return this.$$.ctx[3];
  }

  set left(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get right() {
    return this.$$.ctx[4];
  }

  set right(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get go() {
    return this.$$.ctx[5];
  }

  set go(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get pause() {
    return this.$$.ctx[20];
  }

  set pause(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get resume() {
    return this.$$.ctx[21];
  }

  set resume(value) {
    throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* node_modules/svelte-feather-icons/src/icons/ChevronLeftIcon.svelte generated by Svelte v3.24.0 */
const file$1 = "node_modules/svelte-feather-icons/src/icons/ChevronLeftIcon.svelte";

function create_fragment$1(ctx) {
  let svg;
  let polyline;
  let svg_class_value;
  const block = {
    c: function create() {
      svg = svg_element("svg");
      polyline = svg_element("polyline");
      this.h();
    },
    l: function claim(nodes) {
      svg = claim_element(nodes, "svg", {
        xmlns: true,
        width: true,
        height: true,
        fill: true,
        viewBox: true,
        stroke: true,
        "stroke-width": true,
        "stroke-linecap": true,
        "stroke-linejoin": true,
        class: true
      }, 1);
      var svg_nodes = children(svg);
      polyline = claim_element(svg_nodes, "polyline", {
        points: true
      }, 1);
      children(polyline).forEach(detach_dev);
      svg_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(polyline, "points", "15 18 9 12 15 6");
      add_location(polyline, file$1, 13, 249, 535);
      attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr_dev(svg, "width",
      /*size*/
      ctx[0]);
      attr_dev(svg, "height",
      /*size*/
      ctx[0]);
      attr_dev(svg, "fill", "none");
      attr_dev(svg, "viewBox", "0 0 24 24");
      attr_dev(svg, "stroke", "currentColor");
      attr_dev(svg, "stroke-width",
      /*strokeWidth*/
      ctx[1]);
      attr_dev(svg, "stroke-linecap", "round");
      attr_dev(svg, "stroke-linejoin", "round");
      attr_dev(svg, "class", svg_class_value = "feather feather-chevron-left " +
      /*customClass*/
      ctx[2]);
      add_location(svg, file$1, 13, 0, 286);
    },
    m: function mount(target, anchor) {
      insert_dev(target, svg, anchor);
      append_dev(svg, polyline);
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*size*/
      1) {
        attr_dev(svg, "width",
        /*size*/
        ctx[0]);
      }

      if (dirty &
      /*size*/
      1) {
        attr_dev(svg, "height",
        /*size*/
        ctx[0]);
      }

      if (dirty &
      /*strokeWidth*/
      2) {
        attr_dev(svg, "stroke-width",
        /*strokeWidth*/
        ctx[1]);
      }

      if (dirty &
      /*customClass*/
      4 && svg_class_value !== (svg_class_value = "feather feather-chevron-left " +
      /*customClass*/
      ctx[2])) {
        attr_dev(svg, "class", svg_class_value);
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
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$1($$self, $$props, $$invalidate) {
  let {
    size = "100%"
  } = $$props;
  let {
    strokeWidth = 2
  } = $$props;
  let {
    class: customClass = ""
  } = $$props;

  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }

  const writable_props = ["size", "strokeWidth", "class"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChevronLeftIcon> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("ChevronLeftIcon", $$slots, []);

  $$self.$set = $$props => {
    if ("size" in $$props) $$invalidate(0, size = $$props.size);
    if ("strokeWidth" in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    if ("class" in $$props) $$invalidate(2, customClass = $$props.class);
  };

  $$self.$capture_state = () => ({
    size,
    strokeWidth,
    customClass
  });

  $$self.$inject_state = $$props => {
    if ("size" in $$props) $$invalidate(0, size = $$props.size);
    if ("strokeWidth" in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    if ("customClass" in $$props) $$invalidate(2, customClass = $$props.customClass);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [size, strokeWidth, customClass];
}

class ChevronLeftIcon extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      size: 0,
      strokeWidth: 1,
      class: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "ChevronLeftIcon",
      options,
      id: create_fragment$1.name
    });
  }

  get size() {
    throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set size(value) {
    throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get strokeWidth() {
    throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set strokeWidth(value) {
    throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get class() {
    throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set class(value) {
    throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* node_modules/svelte-feather-icons/src/icons/ChevronRightIcon.svelte generated by Svelte v3.24.0 */
const file$2 = "node_modules/svelte-feather-icons/src/icons/ChevronRightIcon.svelte";

function create_fragment$2(ctx) {
  let svg;
  let polyline;
  let svg_class_value;
  const block = {
    c: function create() {
      svg = svg_element("svg");
      polyline = svg_element("polyline");
      this.h();
    },
    l: function claim(nodes) {
      svg = claim_element(nodes, "svg", {
        xmlns: true,
        width: true,
        height: true,
        fill: true,
        viewBox: true,
        stroke: true,
        "stroke-width": true,
        "stroke-linecap": true,
        "stroke-linejoin": true,
        class: true
      }, 1);
      var svg_nodes = children(svg);
      polyline = claim_element(svg_nodes, "polyline", {
        points: true
      }, 1);
      children(polyline).forEach(detach_dev);
      svg_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(polyline, "points", "9 18 15 12 9 6");
      add_location(polyline, file$2, 13, 250, 536);
      attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr_dev(svg, "width",
      /*size*/
      ctx[0]);
      attr_dev(svg, "height",
      /*size*/
      ctx[0]);
      attr_dev(svg, "fill", "none");
      attr_dev(svg, "viewBox", "0 0 24 24");
      attr_dev(svg, "stroke", "currentColor");
      attr_dev(svg, "stroke-width",
      /*strokeWidth*/
      ctx[1]);
      attr_dev(svg, "stroke-linecap", "round");
      attr_dev(svg, "stroke-linejoin", "round");
      attr_dev(svg, "class", svg_class_value = "feather feather-chevron-right " +
      /*customClass*/
      ctx[2]);
      add_location(svg, file$2, 13, 0, 286);
    },
    m: function mount(target, anchor) {
      insert_dev(target, svg, anchor);
      append_dev(svg, polyline);
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*size*/
      1) {
        attr_dev(svg, "width",
        /*size*/
        ctx[0]);
      }

      if (dirty &
      /*size*/
      1) {
        attr_dev(svg, "height",
        /*size*/
        ctx[0]);
      }

      if (dirty &
      /*strokeWidth*/
      2) {
        attr_dev(svg, "stroke-width",
        /*strokeWidth*/
        ctx[1]);
      }

      if (dirty &
      /*customClass*/
      4 && svg_class_value !== (svg_class_value = "feather feather-chevron-right " +
      /*customClass*/
      ctx[2])) {
        attr_dev(svg, "class", svg_class_value);
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
    id: create_fragment$2.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$2($$self, $$props, $$invalidate) {
  let {
    size = "100%"
  } = $$props;
  let {
    strokeWidth = 2
  } = $$props;
  let {
    class: customClass = ""
  } = $$props;

  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }

  const writable_props = ["size", "strokeWidth", "class"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChevronRightIcon> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("ChevronRightIcon", $$slots, []);

  $$self.$set = $$props => {
    if ("size" in $$props) $$invalidate(0, size = $$props.size);
    if ("strokeWidth" in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    if ("class" in $$props) $$invalidate(2, customClass = $$props.class);
  };

  $$self.$capture_state = () => ({
    size,
    strokeWidth,
    customClass
  });

  $$self.$inject_state = $$props => {
    if ("size" in $$props) $$invalidate(0, size = $$props.size);
    if ("strokeWidth" in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    if ("customClass" in $$props) $$invalidate(2, customClass = $$props.customClass);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [size, strokeWidth, customClass];
}

class ChevronRightIcon extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {
      size: 0,
      strokeWidth: 1,
      class: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "ChevronRightIcon",
      options,
      id: create_fragment$2.name
    });
  }

  get size() {
    throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set size(value) {
    throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get strokeWidth() {
    throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set strokeWidth(value) {
    throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get class() {
    throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set class(value) {
    throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/routes/index.svelte generated by Svelte v3.24.0 */
const {
  console: console_1
} = globals;
const file$3 = "src/routes/index.svelte";

function add_css$1() {
  var style = element("style");
  style.id = "svelte-1jmdc71-style";
  style.textContent = ".demo.svelte-1jmdc71.svelte-1jmdc71{margin:0 auto;height:230px;width:auto}.slide-content.svelte-1jmdc71.svelte-1jmdc71{border:1px solid #eee;display:flex;flex-direction:column;height:230px;background-color:beige}.slide-content.svelte-1jmdc71 header.svelte-1jmdc71{flex:1;background-size:cover}.slide-content.svelte-1jmdc71 section.svelte-1jmdc71{height:40px;padding:12px;color:aqua}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3ZlbHRlIiwic291cmNlcyI6WyJpbmRleC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IENhcm91c2VsIGZyb20gXCJAYmV5b25rL3N2ZWx0ZS1jYXJvdXNlbFwiO1xuICBpbXBvcnQgeyBDaGV2cm9uTGVmdEljb24sIENoZXZyb25SaWdodEljb24gfSBmcm9tIFwic3ZlbHRlLWZlYXRoZXItaWNvbnNcIjtcblxuICBsZXQgY2Fyb3VzZWxzID0gW1xuICAgIHtcbiAgICAgIHBlclBhZ2U6IDMsXG4gICAgfSxcbiAgICB7XG4gICAgICBwZXJQYWdlOiAzLFxuICAgICAgY29udHJvbHM6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgcGVyUGFnZTogeyAzMjA6IDIsIDc2ODogNCB9LFxuICAgIH0sXG4gICAge1xuICAgICAgcGVyUGFnZTogeyAzMjA6IDEsIDc2ODogMyB9LFxuICAgIH0sXG4gIF07XG5cbiAgZnVuY3Rpb24gY2hhbmdlZChldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LmRldGFpbC5jdXJyZW50U2xpZGUpO1xuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZGVtbyB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgaGVpZ2h0OiAyMzBweDtcbiAgICB3aWR0aDogYXV0bztcbiAgfVxuXG5cbiAgLnNsaWRlLWNvbnRlbnQge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDogMjMwcHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmVpZ2U7XG4gIH1cblxuICAuc2xpZGUtY29udGVudCBoZWFkZXIge1xuICAgIGZsZXg6IDE7XG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgfSBcblxuICAuc2xpZGUtY29udGVudCBzZWN0aW9uIHtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAgcGFkZGluZzogMTJweDtcbiAgICBjb2xvcjphcXVhO1xuICB9XG48L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwiZGVtb1wiPlxuIFxuICAgIDxDYXJvdXNlbCBwZXJQYWdlPVwiMVwiICBlYXNpbmc9XCJlYXNlLW91dFwiIGF1dG9wbGF5PVwiNTAwMFwiIGR1cmF0aW9uPVwiNTAwMFwiPlxuICAgICBcbiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZS1jb250ZW50XCI+XG4gICAgICAgIDxoZWFkZXIgY2xhc3M9XCJiZy1mYWNlXCIgLz5cbiAgICAgICAgPHNlY3Rpb24+SGVsbG8gSSBhbSBraXR0ZW48L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZS1jb250ZW50XCI+XG4gICAgICAgIDxoZWFkZXIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLy9wbGFjZWtpdHRlbi5jb20vMjMwKVwiIC8+XG4gICAgICAgIDxzZWN0aW9uPkkgYW0gZmx1ZmZ5PC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2xpZGUtY29udGVudFwiPlxuICAgICAgICA8aGVhZGVyIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKC8vcGxhY2VraXR0ZW4uY29tLzE4MClcIiAvPlxuICAgICAgICA8c2VjdGlvbj5JIGVuam95IHdvb2w8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZS1jb250ZW50XCI+XG4gICAgICAgIDxoZWFkZXIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLy9wbGFjZWtpdHRlbi5jb20vMzIwKVwiIC8+XG4gICAgICAgIDxzZWN0aW9uPkkgZWF0IGJlYW5zPC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICA8L0Nhcm91c2VsPlxuPC9kaXY+XG48ZGl2PlxuICA8cCBjbGFzcz1cInBiLTRcIj5cbiAgICBXYWxhZG9jcyBpcyBhIGRvY3VtZW50YXRpb24gYnkgV2FsYXRpYyBXZSBob3BlIHRoaXMgdG9vbCBoZWxwcyB5b3UgYW5kXG4gICAgYWNjb21wYW5pZXMgeW91IGluIHlvdXIgd29yay4gSWYgeW91IGZpbmQgYW55IGVycm9yIHBsZWFzZSByZXBvcnQgaXRcbiAgICA8YSBjbGFzcz1cImFcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Jlc291cmNlbGRnL3dhbGFkb2NzL2lzc3VlXCI+aGVyZTwvYT5cbiAgICBZb3UgY2FuIGRvIGJldHRlciBpZiB5b3UgZm9yayB0aGlzIHByb2plY3QgYW5kIGNvbnRyaWJ1dGUuXG4gIDwvcD5cbiAgPGgzPlJlbWVtYmVyPC9oMz5cbiAgPGg0PlwiIFlvdSBoYXZlIHRoZSBwb3RlbmNpYWwgdG8gbWFrZSBhbWF6aW5nIHRoaW5ncy4gXCI8L2g0PlxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMEJFLEtBQUssOEJBQUMsQ0FBQyxBQUNMLE1BQU0sQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUNkLE1BQU0sQ0FBRSxLQUFLLENBQ2IsS0FBSyxDQUFFLElBQUksQUFDYixDQUFDLEFBR0QsY0FBYyw4QkFBQyxDQUFDLEFBQ2QsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUN0QixPQUFPLENBQUUsSUFBSSxDQUNiLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLE1BQU0sQ0FBRSxLQUFLLENBQ2IsZ0JBQWdCLENBQUUsS0FBSyxBQUN6QixDQUFDLEFBRUQsNkJBQWMsQ0FBQyxNQUFNLGVBQUMsQ0FBQyxBQUNyQixJQUFJLENBQUUsQ0FBQyxDQUNQLGVBQWUsQ0FBRSxLQUFLLEFBQ3hCLENBQUMsQUFFRCw2QkFBYyxDQUFDLE9BQU8sZUFBQyxDQUFDLEFBQ3RCLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLElBQUksQ0FDYixNQUFNLElBQUksQUFDWixDQUFDIn0= */";
  append_dev(document.head, style);
} // (56:4) <Carousel perPage="1"  easing="ease-out" autoplay="5000" duration="5000">


function create_default_slot(ctx) {
  let div0;
  let header0;
  let t0;
  let section0;
  let t1;
  let t2;
  let div1;
  let header1;
  let t3;
  let section1;
  let t4;
  let t5;
  let div2;
  let header2;
  let t6;
  let section2;
  let t7;
  let t8;
  let div3;
  let header3;
  let t9;
  let section3;
  let t10;
  const block = {
    c: function create() {
      div0 = element("div");
      header0 = element("header");
      t0 = space();
      section0 = element("section");
      t1 = text("Hello I am kitten");
      t2 = space();
      div1 = element("div");
      header1 = element("header");
      t3 = space();
      section1 = element("section");
      t4 = text("I am fluffy");
      t5 = space();
      div2 = element("div");
      header2 = element("header");
      t6 = space();
      section2 = element("section");
      t7 = text("I enjoy wool");
      t8 = space();
      div3 = element("div");
      header3 = element("header");
      t9 = space();
      section3 = element("section");
      t10 = text("I eat beans");
      this.h();
    },
    l: function claim(nodes) {
      div0 = claim_element(nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      header0 = claim_element(div0_nodes, "HEADER", {
        class: true
      });
      children(header0).forEach(detach_dev);
      t0 = claim_space(div0_nodes);
      section0 = claim_element(div0_nodes, "SECTION", {
        class: true
      });
      var section0_nodes = children(section0);
      t1 = claim_text(section0_nodes, "Hello I am kitten");
      section0_nodes.forEach(detach_dev);
      div0_nodes.forEach(detach_dev);
      t2 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      header1 = claim_element(div1_nodes, "HEADER", {
        style: true,
        class: true
      });
      children(header1).forEach(detach_dev);
      t3 = claim_space(div1_nodes);
      section1 = claim_element(div1_nodes, "SECTION", {
        class: true
      });
      var section1_nodes = children(section1);
      t4 = claim_text(section1_nodes, "I am fluffy");
      section1_nodes.forEach(detach_dev);
      div1_nodes.forEach(detach_dev);
      t5 = claim_space(nodes);
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      header2 = claim_element(div2_nodes, "HEADER", {
        style: true,
        class: true
      });
      children(header2).forEach(detach_dev);
      t6 = claim_space(div2_nodes);
      section2 = claim_element(div2_nodes, "SECTION", {
        class: true
      });
      var section2_nodes = children(section2);
      t7 = claim_text(section2_nodes, "I enjoy wool");
      section2_nodes.forEach(detach_dev);
      div2_nodes.forEach(detach_dev);
      t8 = claim_space(nodes);
      div3 = claim_element(nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      header3 = claim_element(div3_nodes, "HEADER", {
        style: true,
        class: true
      });
      children(header3).forEach(detach_dev);
      t9 = claim_space(div3_nodes);
      section3 = claim_element(div3_nodes, "SECTION", {
        class: true
      });
      var section3_nodes = children(section3);
      t10 = claim_text(section3_nodes, "I eat beans");
      section3_nodes.forEach(detach_dev);
      div3_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(header0, "class", "bg-face svelte-1jmdc71");
      add_location(header0, file$3, 58, 8, 971);
      attr_dev(section0, "class", "svelte-1jmdc71");
      add_location(section0, file$3, 59, 8, 1006);
      attr_dev(div0, "class", "slide-content svelte-1jmdc71");
      add_location(div0, file$3, 57, 6, 935);
      set_style(header1, "background-image", "url(//placekitten.com/230)");
      attr_dev(header1, "class", "svelte-1jmdc71");
      add_location(header1, file$3, 62, 8, 1098);
      attr_dev(section1, "class", "svelte-1jmdc71");
      add_location(section1, file$3, 63, 8, 1170);
      attr_dev(div1, "class", "slide-content svelte-1jmdc71");
      add_location(div1, file$3, 61, 6, 1062);
      set_style(header2, "background-image", "url(//placekitten.com/180)");
      attr_dev(header2, "class", "svelte-1jmdc71");
      add_location(header2, file$3, 66, 8, 1256);
      attr_dev(section2, "class", "svelte-1jmdc71");
      add_location(section2, file$3, 67, 8, 1328);
      attr_dev(div2, "class", "slide-content svelte-1jmdc71");
      add_location(div2, file$3, 65, 6, 1220);
      set_style(header3, "background-image", "url(//placekitten.com/320)");
      attr_dev(header3, "class", "svelte-1jmdc71");
      add_location(header3, file$3, 70, 8, 1415);
      attr_dev(section3, "class", "svelte-1jmdc71");
      add_location(section3, file$3, 71, 8, 1487);
      attr_dev(div3, "class", "slide-content svelte-1jmdc71");
      add_location(div3, file$3, 69, 6, 1379);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div0, anchor);
      append_dev(div0, header0);
      append_dev(div0, t0);
      append_dev(div0, section0);
      append_dev(section0, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, div1, anchor);
      append_dev(div1, header1);
      append_dev(div1, t3);
      append_dev(div1, section1);
      append_dev(section1, t4);
      insert_dev(target, t5, anchor);
      insert_dev(target, div2, anchor);
      append_dev(div2, header2);
      append_dev(div2, t6);
      append_dev(div2, section2);
      append_dev(section2, t7);
      insert_dev(target, t8, anchor);
      insert_dev(target, div3, anchor);
      append_dev(div3, header3);
      append_dev(div3, t9);
      append_dev(div3, section3);
      append_dev(section3, t10);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div0);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(div1);
      if (detaching) detach_dev(t5);
      if (detaching) detach_dev(div2);
      if (detaching) detach_dev(t8);
      if (detaching) detach_dev(div3);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: "(56:4) <Carousel perPage=\\\"1\\\"  easing=\\\"ease-out\\\" autoplay=\\\"5000\\\" duration=\\\"5000\\\">",
    ctx
  });
  return block;
}

function create_fragment$3(ctx) {
  let div0;
  let carousel;
  let t0;
  let div1;
  let p;
  let t1;
  let a;
  let t2;
  let t3;
  let t4;
  let h3;
  let t5;
  let t6;
  let h4;
  let t7;
  let current;
  carousel = new Carousel({
    props: {
      perPage: "1",
      easing: "ease-out",
      autoplay: "5000",
      duration: "5000",
      $$slots: {
        default: [create_default_slot]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div0 = element("div");
      create_component(carousel.$$.fragment);
      t0 = space();
      div1 = element("div");
      p = element("p");
      t1 = text("Waladocs is a documentation by Walatic We hope this tool helps you and\n    accompanies you in your work. If you find any error please report it\n    ");
      a = element("a");
      t2 = text("here");
      t3 = text("\n    You can do better if you fork this project and contribute.");
      t4 = space();
      h3 = element("h3");
      t5 = text("Remember");
      t6 = space();
      h4 = element("h4");
      t7 = text("\" You have the potencial to make amazing things. \"");
      this.h();
    },
    l: function claim(nodes) {
      div0 = claim_element(nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      claim_component(carousel.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach_dev);
      t0 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {});
      var div1_nodes = children(div1);
      p = claim_element(div1_nodes, "P", {
        class: true
      });
      var p_nodes = children(p);
      t1 = claim_text(p_nodes, "Waladocs is a documentation by Walatic We hope this tool helps you and\n    accompanies you in your work. If you find any error please report it\n    ");
      a = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      t2 = claim_text(a_nodes, "here");
      a_nodes.forEach(detach_dev);
      t3 = claim_text(p_nodes, "\n    You can do better if you fork this project and contribute.");
      p_nodes.forEach(detach_dev);
      t4 = claim_space(div1_nodes);
      h3 = claim_element(div1_nodes, "H3", {});
      var h3_nodes = children(h3);
      t5 = claim_text(h3_nodes, "Remember");
      h3_nodes.forEach(detach_dev);
      t6 = claim_space(div1_nodes);
      h4 = claim_element(div1_nodes, "H4", {});
      var h4_nodes = children(h4);
      t7 = claim_text(h4_nodes, "\" You have the potencial to make amazing things. \"");
      h4_nodes.forEach(detach_dev);
      div1_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "demo svelte-1jmdc71");
      add_location(div0, file$3, 53, 0, 824);
      attr_dev(a, "class", "a");
      attr_dev(a, "href", "https://github.com/resourceldg/waladocs/issue");
      add_location(a, file$3, 80, 4, 1738);
      attr_dev(p, "class", "pb-4");
      add_location(p, file$3, 77, 2, 1569);
      add_location(h3, file$3, 83, 2, 1885);
      add_location(h4, file$3, 84, 2, 1905);
      add_location(div1, file$3, 76, 0, 1561);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div0, anchor);
      mount_component(carousel, div0, null);
      insert_dev(target, t0, anchor);
      insert_dev(target, div1, anchor);
      append_dev(div1, p);
      append_dev(p, t1);
      append_dev(p, a);
      append_dev(a, t2);
      append_dev(p, t3);
      append_dev(div1, t4);
      append_dev(div1, h3);
      append_dev(h3, t5);
      append_dev(div1, t6);
      append_dev(div1, h4);
      append_dev(h4, t7);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const carousel_changes = {};

      if (dirty &
      /*$$scope*/
      2) {
        carousel_changes.$$scope = {
          dirty,
          ctx
        };
      }

      carousel.$set(carousel_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(carousel.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(carousel.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div0);
      destroy_component(carousel);
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(div1);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$3.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function changed(event) {
  console.log(event.detail.currentSlide);
}

function instance$3($$self, $$props, $$invalidate) {
  let carousels = [{
    perPage: 3
  }, {
    perPage: 3,
    controls: false
  }, {
    perPage: {
      320: 2,
      768: 4
    }
  }, {
    perPage: {
      320: 1,
      768: 3
    }
  }];
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Routes> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Routes", $$slots, []);

  $$self.$capture_state = () => ({
    Carousel,
    ChevronLeftIcon,
    ChevronRightIcon,
    carousels,
    changed
  });

  $$self.$inject_state = $$props => {
    if ("carousels" in $$props) carousels = $$props.carousels;
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [];
}

class Routes extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-1jmdc71-style")) add_css$1();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Routes",
      options,
      id: create_fragment$3.name
    });
  }

}

export default Routes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZWQ1YzMyMDYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zaWVtYS9kaXN0L3NpZW1hLm1pbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmV5b25rL3N2ZWx0ZS1jYXJvdXNlbC9zcmMvQ2Fyb3VzZWwuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZS1mZWF0aGVyLWljb25zL3NyYy9pY29ucy9DaGV2cm9uTGVmdEljb24uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZS1mZWF0aGVyLWljb25zL3NyYy9pY29ucy9DaGV2cm9uUmlnaHRJY29uLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvaW5kZXguc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiU2llbWFcIixbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLlNpZW1hPXQoKTplLlNpZW1hPXQoKX0oXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQocil7aWYoaVtyXSlyZXR1cm4gaVtyXS5leHBvcnRzO3ZhciBuPWlbcl09e2k6cixsOiExLGV4cG9ydHM6e319O3JldHVybiBlW3JdLmNhbGwobi5leHBvcnRzLG4sbi5leHBvcnRzLHQpLG4ubD0hMCxuLmV4cG9ydHN9dmFyIGk9e307cmV0dXJuIHQubT1lLHQuYz1pLHQuZD1mdW5jdGlvbihlLGkscil7dC5vKGUsaSl8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLGkse2NvbmZpZ3VyYWJsZTohMSxlbnVtZXJhYmxlOiEwLGdldDpyfSl9LHQubj1mdW5jdGlvbihlKXt2YXIgaT1lJiZlLl9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gZS5kZWZhdWx0fTpmdW5jdGlvbigpe3JldHVybiBlfTtyZXR1cm4gdC5kKGksXCJhXCIsaSksaX0sdC5vPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLHQpfSx0LnA9XCJcIix0KHQucz0wKX0oW2Z1bmN0aW9uKGUsdCxpKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUsdCl7aWYoIShlIGluc3RhbmNlb2YgdCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfSxzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe2Zvcih2YXIgaT0wO2k8dC5sZW5ndGg7aSsrKXt2YXIgcj10W2ldO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKHQsaSxyKXtyZXR1cm4gaSYmZSh0LnByb3RvdHlwZSxpKSxyJiZlKHQsciksdH19KCksbD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7dmFyIGk9dGhpcztpZihyKHRoaXMsZSksdGhpcy5jb25maWc9ZS5tZXJnZVNldHRpbmdzKHQpLHRoaXMuc2VsZWN0b3I9XCJzdHJpbmdcIj09dHlwZW9mIHRoaXMuY29uZmlnLnNlbGVjdG9yP2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb25maWcuc2VsZWN0b3IpOnRoaXMuY29uZmlnLnNlbGVjdG9yLG51bGw9PT10aGlzLnNlbGVjdG9yKXRocm93IG5ldyBFcnJvcihcIlNvbWV0aGluZyB3cm9uZyB3aXRoIHlvdXIgc2VsZWN0b3Ig8J+YrVwiKTt0aGlzLnJlc29sdmVTbGlkZXNOdW1iZXIoKSx0aGlzLnNlbGVjdG9yV2lkdGg9dGhpcy5zZWxlY3Rvci5vZmZzZXRXaWR0aCx0aGlzLmlubmVyRWxlbWVudHM9W10uc2xpY2UuY2FsbCh0aGlzLnNlbGVjdG9yLmNoaWxkcmVuKSx0aGlzLmN1cnJlbnRTbGlkZT10aGlzLmNvbmZpZy5sb29wP3RoaXMuY29uZmlnLnN0YXJ0SW5kZXgldGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDpNYXRoLm1heCgwLE1hdGgubWluKHRoaXMuY29uZmlnLnN0YXJ0SW5kZXgsdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aC10aGlzLnBlclBhZ2UpKSx0aGlzLnRyYW5zZm9ybVByb3BlcnR5PWUud2Via2l0T3JOb3QoKSxbXCJyZXNpemVIYW5kbGVyXCIsXCJ0b3VjaHN0YXJ0SGFuZGxlclwiLFwidG91Y2hlbmRIYW5kbGVyXCIsXCJ0b3VjaG1vdmVIYW5kbGVyXCIsXCJtb3VzZWRvd25IYW5kbGVyXCIsXCJtb3VzZXVwSGFuZGxlclwiLFwibW91c2VsZWF2ZUhhbmRsZXJcIixcIm1vdXNlbW92ZUhhbmRsZXJcIixcImNsaWNrSGFuZGxlclwiXS5mb3JFYWNoKGZ1bmN0aW9uKGUpe2lbZV09aVtlXS5iaW5kKGkpfSksdGhpcy5pbml0KCl9cmV0dXJuIHMoZSxbe2tleTpcImF0dGFjaEV2ZW50c1wiLHZhbHVlOmZ1bmN0aW9uKCl7d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLnJlc2l6ZUhhbmRsZXIpLHRoaXMuY29uZmlnLmRyYWdnYWJsZSYmKHRoaXMucG9pbnRlckRvd249ITEsdGhpcy5kcmFnPXtzdGFydFg6MCxlbmRYOjAsc3RhcnRZOjAsbGV0SXRHbzpudWxsLHByZXZlbnRDbGljazohMX0sdGhpcy5zZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHRoaXMudG91Y2hzdGFydEhhbmRsZXIpLHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdGhpcy50b3VjaGVuZEhhbmRsZXIpLHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLHRoaXMudG91Y2htb3ZlSGFuZGxlciksdGhpcy5zZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdGhpcy5tb3VzZWRvd25IYW5kbGVyKSx0aGlzLnNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsdGhpcy5tb3VzZXVwSGFuZGxlciksdGhpcy5zZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLHRoaXMubW91c2VsZWF2ZUhhbmRsZXIpLHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHRoaXMubW91c2Vtb3ZlSGFuZGxlciksdGhpcy5zZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIix0aGlzLmNsaWNrSGFuZGxlcikpfX0se2tleTpcImRldGFjaEV2ZW50c1wiLHZhbHVlOmZ1bmN0aW9uKCl7d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLnJlc2l6ZUhhbmRsZXIpLHRoaXMuc2VsZWN0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLnRvdWNoc3RhcnRIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMudG91Y2hlbmRIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIix0aGlzLnRvdWNobW92ZUhhbmRsZXIpLHRoaXMuc2VsZWN0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMubW91c2Vkb3duSGFuZGxlciksdGhpcy5zZWxlY3Rvci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLHRoaXMubW91c2V1cEhhbmRsZXIpLHRoaXMuc2VsZWN0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIix0aGlzLm1vdXNlbGVhdmVIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIix0aGlzLm1vdXNlbW92ZUhhbmRsZXIpLHRoaXMuc2VsZWN0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5jbGlja0hhbmRsZXIpfX0se2tleTpcImluaXRcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuYXR0YWNoRXZlbnRzKCksdGhpcy5zZWxlY3Rvci5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLHRoaXMuc2VsZWN0b3Iuc3R5bGUuZGlyZWN0aW9uPXRoaXMuY29uZmlnLnJ0bD9cInJ0bFwiOlwibHRyXCIsdGhpcy5idWlsZFNsaWRlckZyYW1lKCksdGhpcy5jb25maWcub25Jbml0LmNhbGwodGhpcyl9fSx7a2V5OlwiYnVpbGRTbGlkZXJGcmFtZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5zZWxlY3RvcldpZHRoL3RoaXMucGVyUGFnZSx0PXRoaXMuY29uZmlnLmxvb3A/dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aCsyKnRoaXMucGVyUGFnZTp0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoO3RoaXMuc2xpZGVyRnJhbWU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLnNsaWRlckZyYW1lLnN0eWxlLndpZHRoPWUqdCtcInB4XCIsdGhpcy5lbmFibGVUcmFuc2l0aW9uKCksdGhpcy5jb25maWcuZHJhZ2dhYmxlJiYodGhpcy5zZWxlY3Rvci5zdHlsZS5jdXJzb3I9XCItd2Via2l0LWdyYWJcIik7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO2lmKHRoaXMuY29uZmlnLmxvb3ApZm9yKHZhciByPXRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgtdGhpcy5wZXJQYWdlO3I8dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDtyKyspe3ZhciBuPXRoaXMuYnVpbGRTbGlkZXJGcmFtZUl0ZW0odGhpcy5pbm5lckVsZW1lbnRzW3JdLmNsb25lTm9kZSghMCkpO2kuYXBwZW5kQ2hpbGQobil9Zm9yKHZhciBzPTA7czx0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoO3MrKyl7dmFyIGw9dGhpcy5idWlsZFNsaWRlckZyYW1lSXRlbSh0aGlzLmlubmVyRWxlbWVudHNbc10pO2kuYXBwZW5kQ2hpbGQobCl9aWYodGhpcy5jb25maWcubG9vcClmb3IodmFyIG89MDtvPHRoaXMucGVyUGFnZTtvKyspe3ZhciBhPXRoaXMuYnVpbGRTbGlkZXJGcmFtZUl0ZW0odGhpcy5pbm5lckVsZW1lbnRzW29dLmNsb25lTm9kZSghMCkpO2kuYXBwZW5kQ2hpbGQoYSl9dGhpcy5zbGlkZXJGcmFtZS5hcHBlbmRDaGlsZChpKSx0aGlzLnNlbGVjdG9yLmlubmVySFRNTD1cIlwiLHRoaXMuc2VsZWN0b3IuYXBwZW5kQ2hpbGQodGhpcy5zbGlkZXJGcmFtZSksdGhpcy5zbGlkZVRvQ3VycmVudCgpfX0se2tleTpcImJ1aWxkU2xpZGVyRnJhbWVJdGVtXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gdC5zdHlsZS5jc3NGbG9hdD10aGlzLmNvbmZpZy5ydGw/XCJyaWdodFwiOlwibGVmdFwiLHQuc3R5bGUuZmxvYXQ9dGhpcy5jb25maWcucnRsP1wicmlnaHRcIjpcImxlZnRcIix0LnN0eWxlLndpZHRoPSh0aGlzLmNvbmZpZy5sb29wPzEwMC8odGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aCsyKnRoaXMucGVyUGFnZSk6MTAwL3RoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgpK1wiJVwiLHQuYXBwZW5kQ2hpbGQoZSksdH19LHtrZXk6XCJyZXNvbHZlU2xpZGVzTnVtYmVyXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZihcIm51bWJlclwiPT10eXBlb2YgdGhpcy5jb25maWcucGVyUGFnZSl0aGlzLnBlclBhZ2U9dGhpcy5jb25maWcucGVyUGFnZTtlbHNlIGlmKFwib2JqZWN0XCI9PT1uKHRoaXMuY29uZmlnLnBlclBhZ2UpKXt0aGlzLnBlclBhZ2U9MTtmb3IodmFyIGUgaW4gdGhpcy5jb25maWcucGVyUGFnZSl3aW5kb3cuaW5uZXJXaWR0aD49ZSYmKHRoaXMucGVyUGFnZT10aGlzLmNvbmZpZy5wZXJQYWdlW2VdKX19fSx7a2V5OlwicHJldlwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOjEsdD1hcmd1bWVudHNbMV07aWYoISh0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoPD10aGlzLnBlclBhZ2UpKXt2YXIgaT10aGlzLmN1cnJlbnRTbGlkZTtpZih0aGlzLmNvbmZpZy5sb29wKXtpZih0aGlzLmN1cnJlbnRTbGlkZS1lPDApe3RoaXMuZGlzYWJsZVRyYW5zaXRpb24oKTt2YXIgcj10aGlzLmN1cnJlbnRTbGlkZSt0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLG49dGhpcy5wZXJQYWdlLHM9cituLGw9KHRoaXMuY29uZmlnLnJ0bD8xOi0xKSpzKih0aGlzLnNlbGVjdG9yV2lkdGgvdGhpcy5wZXJQYWdlKSxvPXRoaXMuY29uZmlnLmRyYWdnYWJsZT90aGlzLmRyYWcuZW5kWC10aGlzLmRyYWcuc3RhcnRYOjA7dGhpcy5zbGlkZXJGcmFtZS5zdHlsZVt0aGlzLnRyYW5zZm9ybVByb3BlcnR5XT1cInRyYW5zbGF0ZTNkKFwiKyhsK28pK1wicHgsIDAsIDApXCIsdGhpcy5jdXJyZW50U2xpZGU9ci1lfWVsc2UgdGhpcy5jdXJyZW50U2xpZGU9dGhpcy5jdXJyZW50U2xpZGUtZX1lbHNlIHRoaXMuY3VycmVudFNsaWRlPU1hdGgubWF4KHRoaXMuY3VycmVudFNsaWRlLWUsMCk7aSE9PXRoaXMuY3VycmVudFNsaWRlJiYodGhpcy5zbGlkZVRvQ3VycmVudCh0aGlzLmNvbmZpZy5sb29wKSx0aGlzLmNvbmZpZy5vbkNoYW5nZS5jYWxsKHRoaXMpLHQmJnQuY2FsbCh0aGlzKSl9fX0se2tleTpcIm5leHRcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXToxLHQ9YXJndW1lbnRzWzFdO2lmKCEodGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDw9dGhpcy5wZXJQYWdlKSl7dmFyIGk9dGhpcy5jdXJyZW50U2xpZGU7aWYodGhpcy5jb25maWcubG9vcCl7aWYodGhpcy5jdXJyZW50U2xpZGUrZT50aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLXRoaXMucGVyUGFnZSl7dGhpcy5kaXNhYmxlVHJhbnNpdGlvbigpO3ZhciByPXRoaXMuY3VycmVudFNsaWRlLXRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgsbj10aGlzLnBlclBhZ2Uscz1yK24sbD0odGhpcy5jb25maWcucnRsPzE6LTEpKnMqKHRoaXMuc2VsZWN0b3JXaWR0aC90aGlzLnBlclBhZ2UpLG89dGhpcy5jb25maWcuZHJhZ2dhYmxlP3RoaXMuZHJhZy5lbmRYLXRoaXMuZHJhZy5zdGFydFg6MDt0aGlzLnNsaWRlckZyYW1lLnN0eWxlW3RoaXMudHJhbnNmb3JtUHJvcGVydHldPVwidHJhbnNsYXRlM2QoXCIrKGwrbykrXCJweCwgMCwgMClcIix0aGlzLmN1cnJlbnRTbGlkZT1yK2V9ZWxzZSB0aGlzLmN1cnJlbnRTbGlkZT10aGlzLmN1cnJlbnRTbGlkZStlfWVsc2UgdGhpcy5jdXJyZW50U2xpZGU9TWF0aC5taW4odGhpcy5jdXJyZW50U2xpZGUrZSx0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLXRoaXMucGVyUGFnZSk7aSE9PXRoaXMuY3VycmVudFNsaWRlJiYodGhpcy5zbGlkZVRvQ3VycmVudCh0aGlzLmNvbmZpZy5sb29wKSx0aGlzLmNvbmZpZy5vbkNoYW5nZS5jYWxsKHRoaXMpLHQmJnQuY2FsbCh0aGlzKSl9fX0se2tleTpcImRpc2FibGVUcmFuc2l0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnNsaWRlckZyYW1lLnN0eWxlLndlYmtpdFRyYW5zaXRpb249XCJhbGwgMG1zIFwiK3RoaXMuY29uZmlnLmVhc2luZyx0aGlzLnNsaWRlckZyYW1lLnN0eWxlLnRyYW5zaXRpb249XCJhbGwgMG1zIFwiK3RoaXMuY29uZmlnLmVhc2luZ319LHtrZXk6XCJlbmFibGVUcmFuc2l0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnNsaWRlckZyYW1lLnN0eWxlLndlYmtpdFRyYW5zaXRpb249XCJhbGwgXCIrdGhpcy5jb25maWcuZHVyYXRpb24rXCJtcyBcIit0aGlzLmNvbmZpZy5lYXNpbmcsdGhpcy5zbGlkZXJGcmFtZS5zdHlsZS50cmFuc2l0aW9uPVwiYWxsIFwiK3RoaXMuY29uZmlnLmR1cmF0aW9uK1wibXMgXCIrdGhpcy5jb25maWcuZWFzaW5nfX0se2tleTpcImdvVG9cIix2YWx1ZTpmdW5jdGlvbihlLHQpe2lmKCEodGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDw9dGhpcy5wZXJQYWdlKSl7dmFyIGk9dGhpcy5jdXJyZW50U2xpZGU7dGhpcy5jdXJyZW50U2xpZGU9dGhpcy5jb25maWcubG9vcD9lJXRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg6TWF0aC5taW4oTWF0aC5tYXgoZSwwKSx0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLXRoaXMucGVyUGFnZSksaSE9PXRoaXMuY3VycmVudFNsaWRlJiYodGhpcy5zbGlkZVRvQ3VycmVudCgpLHRoaXMuY29uZmlnLm9uQ2hhbmdlLmNhbGwodGhpcyksdCYmdC5jYWxsKHRoaXMpKX19fSx7a2V5Olwic2xpZGVUb0N1cnJlbnRcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLGk9dGhpcy5jb25maWcubG9vcD90aGlzLmN1cnJlbnRTbGlkZSt0aGlzLnBlclBhZ2U6dGhpcy5jdXJyZW50U2xpZGUscj0odGhpcy5jb25maWcucnRsPzE6LTEpKmkqKHRoaXMuc2VsZWN0b3JXaWR0aC90aGlzLnBlclBhZ2UpO2U/cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7dC5lbmFibGVUcmFuc2l0aW9uKCksdC5zbGlkZXJGcmFtZS5zdHlsZVt0LnRyYW5zZm9ybVByb3BlcnR5XT1cInRyYW5zbGF0ZTNkKFwiK3IrXCJweCwgMCwgMClcIn0pfSk6dGhpcy5zbGlkZXJGcmFtZS5zdHlsZVt0aGlzLnRyYW5zZm9ybVByb3BlcnR5XT1cInRyYW5zbGF0ZTNkKFwiK3IrXCJweCwgMCwgMClcIn19LHtrZXk6XCJ1cGRhdGVBZnRlckRyYWdcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPSh0aGlzLmNvbmZpZy5ydGw/LTE6MSkqKHRoaXMuZHJhZy5lbmRYLXRoaXMuZHJhZy5zdGFydFgpLHQ9TWF0aC5hYnMoZSksaT10aGlzLmNvbmZpZy5tdWx0aXBsZURyYWc/TWF0aC5jZWlsKHQvKHRoaXMuc2VsZWN0b3JXaWR0aC90aGlzLnBlclBhZ2UpKToxLHI9ZT4wJiZ0aGlzLmN1cnJlbnRTbGlkZS1pPDAsbj1lPDAmJnRoaXMuY3VycmVudFNsaWRlK2k+dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aC10aGlzLnBlclBhZ2U7ZT4wJiZ0PnRoaXMuY29uZmlnLnRocmVzaG9sZCYmdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aD50aGlzLnBlclBhZ2U/dGhpcy5wcmV2KGkpOmU8MCYmdD50aGlzLmNvbmZpZy50aHJlc2hvbGQmJnRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg+dGhpcy5wZXJQYWdlJiZ0aGlzLm5leHQoaSksdGhpcy5zbGlkZVRvQ3VycmVudChyfHxuKX19LHtrZXk6XCJyZXNpemVIYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnJlc29sdmVTbGlkZXNOdW1iZXIoKSx0aGlzLmN1cnJlbnRTbGlkZSt0aGlzLnBlclBhZ2U+dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aCYmKHRoaXMuY3VycmVudFNsaWRlPXRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg8PXRoaXMucGVyUGFnZT8wOnRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgtdGhpcy5wZXJQYWdlKSx0aGlzLnNlbGVjdG9yV2lkdGg9dGhpcy5zZWxlY3Rvci5vZmZzZXRXaWR0aCx0aGlzLmJ1aWxkU2xpZGVyRnJhbWUoKX19LHtrZXk6XCJjbGVhckRyYWdcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuZHJhZz17c3RhcnRYOjAsZW5kWDowLHN0YXJ0WTowLGxldEl0R286bnVsbCxwcmV2ZW50Q2xpY2s6dGhpcy5kcmFnLnByZXZlbnRDbGlja319fSx7a2V5OlwidG91Y2hzdGFydEhhbmRsZXJcIix2YWx1ZTpmdW5jdGlvbihlKXstMSE9PVtcIlRFWFRBUkVBXCIsXCJPUFRJT05cIixcIklOUFVUXCIsXCJTRUxFQ1RcIl0uaW5kZXhPZihlLnRhcmdldC5ub2RlTmFtZSl8fChlLnN0b3BQcm9wYWdhdGlvbigpLHRoaXMucG9pbnRlckRvd249ITAsdGhpcy5kcmFnLnN0YXJ0WD1lLnRvdWNoZXNbMF0ucGFnZVgsdGhpcy5kcmFnLnN0YXJ0WT1lLnRvdWNoZXNbMF0ucGFnZVkpfX0se2tleTpcInRvdWNoZW5kSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKGUpe2Uuc3RvcFByb3BhZ2F0aW9uKCksdGhpcy5wb2ludGVyRG93bj0hMSx0aGlzLmVuYWJsZVRyYW5zaXRpb24oKSx0aGlzLmRyYWcuZW5kWCYmdGhpcy51cGRhdGVBZnRlckRyYWcoKSx0aGlzLmNsZWFyRHJhZygpfX0se2tleTpcInRvdWNobW92ZUhhbmRsZXJcIix2YWx1ZTpmdW5jdGlvbihlKXtpZihlLnN0b3BQcm9wYWdhdGlvbigpLG51bGw9PT10aGlzLmRyYWcubGV0SXRHbyYmKHRoaXMuZHJhZy5sZXRJdEdvPU1hdGguYWJzKHRoaXMuZHJhZy5zdGFydFktZS50b3VjaGVzWzBdLnBhZ2VZKTxNYXRoLmFicyh0aGlzLmRyYWcuc3RhcnRYLWUudG91Y2hlc1swXS5wYWdlWCkpLHRoaXMucG9pbnRlckRvd24mJnRoaXMuZHJhZy5sZXRJdEdvKXtlLnByZXZlbnREZWZhdWx0KCksdGhpcy5kcmFnLmVuZFg9ZS50b3VjaGVzWzBdLnBhZ2VYLHRoaXMuc2xpZGVyRnJhbWUuc3R5bGUud2Via2l0VHJhbnNpdGlvbj1cImFsbCAwbXMgXCIrdGhpcy5jb25maWcuZWFzaW5nLHRoaXMuc2xpZGVyRnJhbWUuc3R5bGUudHJhbnNpdGlvbj1cImFsbCAwbXMgXCIrdGhpcy5jb25maWcuZWFzaW5nO3ZhciB0PXRoaXMuY29uZmlnLmxvb3A/dGhpcy5jdXJyZW50U2xpZGUrdGhpcy5wZXJQYWdlOnRoaXMuY3VycmVudFNsaWRlLGk9dCoodGhpcy5zZWxlY3RvcldpZHRoL3RoaXMucGVyUGFnZSkscj10aGlzLmRyYWcuZW5kWC10aGlzLmRyYWcuc3RhcnRYLG49dGhpcy5jb25maWcucnRsP2krcjppLXI7dGhpcy5zbGlkZXJGcmFtZS5zdHlsZVt0aGlzLnRyYW5zZm9ybVByb3BlcnR5XT1cInRyYW5zbGF0ZTNkKFwiKyh0aGlzLmNvbmZpZy5ydGw/MTotMSkqbitcInB4LCAwLCAwKVwifX19LHtrZXk6XCJtb3VzZWRvd25IYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oZSl7LTEhPT1bXCJURVhUQVJFQVwiLFwiT1BUSU9OXCIsXCJJTlBVVFwiLFwiU0VMRUNUXCJdLmluZGV4T2YoZS50YXJnZXQubm9kZU5hbWUpfHwoZS5wcmV2ZW50RGVmYXVsdCgpLGUuc3RvcFByb3BhZ2F0aW9uKCksdGhpcy5wb2ludGVyRG93bj0hMCx0aGlzLmRyYWcuc3RhcnRYPWUucGFnZVgpfX0se2tleTpcIm1vdXNldXBIYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oZSl7ZS5zdG9wUHJvcGFnYXRpb24oKSx0aGlzLnBvaW50ZXJEb3duPSExLHRoaXMuc2VsZWN0b3Iuc3R5bGUuY3Vyc29yPVwiLXdlYmtpdC1ncmFiXCIsdGhpcy5lbmFibGVUcmFuc2l0aW9uKCksdGhpcy5kcmFnLmVuZFgmJnRoaXMudXBkYXRlQWZ0ZXJEcmFnKCksdGhpcy5jbGVhckRyYWcoKX19LHtrZXk6XCJtb3VzZW1vdmVIYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oZSl7aWYoZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMucG9pbnRlckRvd24pe1wiQVwiPT09ZS50YXJnZXQubm9kZU5hbWUmJih0aGlzLmRyYWcucHJldmVudENsaWNrPSEwKSx0aGlzLmRyYWcuZW5kWD1lLnBhZ2VYLHRoaXMuc2VsZWN0b3Iuc3R5bGUuY3Vyc29yPVwiLXdlYmtpdC1ncmFiYmluZ1wiLHRoaXMuc2xpZGVyRnJhbWUuc3R5bGUud2Via2l0VHJhbnNpdGlvbj1cImFsbCAwbXMgXCIrdGhpcy5jb25maWcuZWFzaW5nLHRoaXMuc2xpZGVyRnJhbWUuc3R5bGUudHJhbnNpdGlvbj1cImFsbCAwbXMgXCIrdGhpcy5jb25maWcuZWFzaW5nO3ZhciB0PXRoaXMuY29uZmlnLmxvb3A/dGhpcy5jdXJyZW50U2xpZGUrdGhpcy5wZXJQYWdlOnRoaXMuY3VycmVudFNsaWRlLGk9dCoodGhpcy5zZWxlY3RvcldpZHRoL3RoaXMucGVyUGFnZSkscj10aGlzLmRyYWcuZW5kWC10aGlzLmRyYWcuc3RhcnRYLG49dGhpcy5jb25maWcucnRsP2krcjppLXI7dGhpcy5zbGlkZXJGcmFtZS5zdHlsZVt0aGlzLnRyYW5zZm9ybVByb3BlcnR5XT1cInRyYW5zbGF0ZTNkKFwiKyh0aGlzLmNvbmZpZy5ydGw/MTotMSkqbitcInB4LCAwLCAwKVwifX19LHtrZXk6XCJtb3VzZWxlYXZlSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMucG9pbnRlckRvd24mJih0aGlzLnBvaW50ZXJEb3duPSExLHRoaXMuc2VsZWN0b3Iuc3R5bGUuY3Vyc29yPVwiLXdlYmtpdC1ncmFiXCIsdGhpcy5kcmFnLmVuZFg9ZS5wYWdlWCx0aGlzLmRyYWcucHJldmVudENsaWNrPSExLHRoaXMuZW5hYmxlVHJhbnNpdGlvbigpLHRoaXMudXBkYXRlQWZ0ZXJEcmFnKCksdGhpcy5jbGVhckRyYWcoKSl9fSx7a2V5OlwiY2xpY2tIYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5kcmFnLnByZXZlbnRDbGljayYmZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuZHJhZy5wcmV2ZW50Q2xpY2s9ITF9fSx7a2V5OlwicmVtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXtpZihlPDB8fGU+PXRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiSXRlbSB0byByZW1vdmUgZG9lc24ndCBleGlzdCDwn5itXCIpO3ZhciBpPWU8dGhpcy5jdXJyZW50U2xpZGUscj10aGlzLmN1cnJlbnRTbGlkZSt0aGlzLnBlclBhZ2UtMT09PWU7KGl8fHIpJiZ0aGlzLmN1cnJlbnRTbGlkZS0tLHRoaXMuaW5uZXJFbGVtZW50cy5zcGxpY2UoZSwxKSx0aGlzLmJ1aWxkU2xpZGVyRnJhbWUoKSx0JiZ0LmNhbGwodGhpcyl9fSx7a2V5OlwiaW5zZXJ0XCIsdmFsdWU6ZnVuY3Rpb24oZSx0LGkpe2lmKHQ8MHx8dD50aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoKzEpdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGluc2V0IGl0IGF0IHRoaXMgaW5kZXgg8J+YrVwiKTtpZigtMSE9PXRoaXMuaW5uZXJFbGVtZW50cy5pbmRleE9mKGUpKXRocm93IG5ldyBFcnJvcihcIlRoZSBzYW1lIGl0ZW0gaW4gYSBjYXJvdXNlbD8gUmVhbGx5PyBOb3BlIPCfmK1cIik7dmFyIHI9dDw9dGhpcy5jdXJyZW50U2xpZGU+MCYmdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDt0aGlzLmN1cnJlbnRTbGlkZT1yP3RoaXMuY3VycmVudFNsaWRlKzE6dGhpcy5jdXJyZW50U2xpZGUsdGhpcy5pbm5lckVsZW1lbnRzLnNwbGljZSh0LDAsZSksdGhpcy5idWlsZFNsaWRlckZyYW1lKCksaSYmaS5jYWxsKHRoaXMpfX0se2tleTpcInByZXBlbmRcIix2YWx1ZTpmdW5jdGlvbihlLHQpe3RoaXMuaW5zZXJ0KGUsMCksdCYmdC5jYWxsKHRoaXMpfX0se2tleTpcImFwcGVuZFwiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dGhpcy5pbnNlcnQoZSx0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoKzEpLHQmJnQuY2FsbCh0aGlzKX19LHtrZXk6XCJkZXN0cm95XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXSYmYXJndW1lbnRzWzBdLHQ9YXJndW1lbnRzWzFdO2lmKHRoaXMuZGV0YWNoRXZlbnRzKCksdGhpcy5zZWxlY3Rvci5zdHlsZS5jdXJzb3I9XCJhdXRvXCIsZSl7Zm9yKHZhciBpPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxyPTA7cjx0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoO3IrKylpLmFwcGVuZENoaWxkKHRoaXMuaW5uZXJFbGVtZW50c1tyXSk7dGhpcy5zZWxlY3Rvci5pbm5lckhUTUw9XCJcIix0aGlzLnNlbGVjdG9yLmFwcGVuZENoaWxkKGkpLHRoaXMuc2VsZWN0b3IucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIil9dCYmdC5jYWxsKHRoaXMpfX1dLFt7a2V5OlwibWVyZ2VTZXR0aW5nc1wiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXtzZWxlY3RvcjpcIi5zaWVtYVwiLGR1cmF0aW9uOjIwMCxlYXNpbmc6XCJlYXNlLW91dFwiLHBlclBhZ2U6MSxzdGFydEluZGV4OjAsZHJhZ2dhYmxlOiEwLG11bHRpcGxlRHJhZzohMCx0aHJlc2hvbGQ6MjAsbG9vcDohMSxydGw6ITEsb25Jbml0OmZ1bmN0aW9uKCl7fSxvbkNoYW5nZTpmdW5jdGlvbigpe319LGk9ZTtmb3IodmFyIHIgaW4gaSl0W3JdPWlbcl07cmV0dXJuIHR9fSx7a2V5Olwid2Via2l0T3JOb3RcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUudHJhbnNmb3JtP1widHJhbnNmb3JtXCI6XCJXZWJraXRUcmFuc2Zvcm1cIn19XSksZX0oKTt0LmRlZmF1bHQ9bCxlLmV4cG9ydHM9dC5kZWZhdWx0fV0pfSk7IiwiXG48ZGl2IGNsYXNzPVwiY2Fyb3VzZWxcIj5cblx0PGRpdiBjbGFzcz1cInNsaWRlc1wiIGJpbmQ6dGhpcz17c2llbWF9PlxuXHRcdDxzbG90Pjwvc2xvdD5cblx0PC9kaXY+XG5cdHsjaWYgY29udHJvbHN9XG5cdDxidXR0b24gY2xhc3M9XCJsZWZ0XCIgb246Y2xpY2s9e2xlZnR9IGFyaWEtbGFiZWw9XCJsZWZ0XCI+XG5cdFx0PHNsb3QgbmFtZT1cImxlZnQtY29udHJvbFwiPjwvc2xvdD5cblx0PC9idXR0b24+XG5cdDxidXR0b24gY2xhc3M9XCJyaWdodFwiIG9uOmNsaWNrPXtyaWdodH0gYXJpYS1sYWJlbD1cInJpZ2h0XCI+XG5cdFx0PHNsb3QgbmFtZT1cInJpZ2h0LWNvbnRyb2xcIj48L3Nsb3Q+XG5cdDwvYnV0dG9uPlxuXHR7L2lmfVxuICAgIHsjaWYgZG90c31cblx0PHVsPlxuXHRcdHsjZWFjaCB7bGVuZ3RoOiB0b3RhbERvdHN9IGFzIF8sIGl9XG5cdFx0PGxpIG9uOmNsaWNrPXsoKSA9PiBnbyhpKmN1cnJlbnRQZXJQYWdlKX0gY2xhc3M9e2lzRG90QWN0aXZlKGN1cnJlbnRJbmRleCwgaSkgPyBcImFjdGl2ZVwiIDogXCJcIn0+PC9saT5cblx0XHR7L2VhY2h9XG5cdDwvdWw+XG4gICAgey9pZn1cbjwvZGl2PlxuXG48c3R5bGU+XG5cdC5jYXJvdXNlbCB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdHdpZHRoOiAxMDAlO1xuXHRcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdH1cblx0XG5cdGJ1dHRvbiB7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdHdpZHRoOiA0MHB4O1xuXHRcdGhlaWdodDogNDBweDtcblx0XHR0b3A6IDUwJTtcblx0XHR6LWluZGV4OiA1MDtcblx0XHRtYXJnaW4tdG9wOiAtMjBweDtcblx0XHRib3JkZXI6IG5vbmU7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cdH1cblxuICBidXR0b246Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cblx0XG5cdC5sZWZ0IHtcblx0XHRsZWZ0OiAydnc7XG5cdH1cblx0XG5cdC5yaWdodCB7XG5cdFx0cmlnaHQ6IDJ2dztcblx0fVxuXG5cdHVsIHtcblx0XHRsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0bWFyZ2luLXRvcDogLTMwcHg7XG5cdFx0cGFkZGluZzogMDtcblx0fVxuXG5cdHVsIGxpIHtcblx0XHRtYXJnaW46IDZweDtcblx0XHRib3JkZXItcmFkaXVzOiAxMDAlO1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC41KTtcblx0XHRoZWlnaHQ6IDhweDtcblx0XHR3aWR0aDogOHB4O1xuXHR9XG5cblx0dWwgbGk6aG92ZXIge1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC44NSk7XG5cdH1cblxuXHR1bCBsaS5hY3RpdmUge1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMSk7XG5cdH1cbjwvc3R5bGU+XG5cbjxzY3JpcHQ+XG5cdGltcG9ydCBTaWVtYSBmcm9tICdzaWVtYSdcblx0aW1wb3J0IHsgb25Nb3VudCwgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJ1xuXHRcblx0ZXhwb3J0IGxldCBwZXJQYWdlID0gM1xuXHRleHBvcnQgbGV0IGxvb3AgPSB0cnVlXG5cdGV4cG9ydCBsZXQgYXV0b3BsYXkgPSAwXG5cdGV4cG9ydCBsZXQgZHVyYXRpb24gPSAyMDBcblx0ZXhwb3J0IGxldCBlYXNpbmcgPSAnZWFzZS1vdXQnXG5cdGV4cG9ydCBsZXQgc3RhcnRJbmRleCA9IDBcblx0ZXhwb3J0IGxldCBkcmFnZ2FibGUgPSB0cnVlXG5cdGV4cG9ydCBsZXQgbXVsdGlwbGVEcmFnID0gdHJ1ZVx0XG5cdGV4cG9ydCBsZXQgZG90cyA9IHRydWVcdFxuXHRleHBvcnQgbGV0IGNvbnRyb2xzID0gdHJ1ZVxuXHRleHBvcnQgbGV0IHRocmVzaG9sZCA9IDIwXG5cdGV4cG9ydCBsZXQgcnRsID0gZmFsc2Vcblx0bGV0IGN1cnJlbnRJbmRleCA9IHN0YXJ0SW5kZXg7XG5cdFxuXHRsZXQgc2llbWFcblx0bGV0IGNvbnRyb2xsZXJcblx0bGV0IHRpbWVyXG5cblx0Y29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxuXG5cdCQ6IHBpcHMgPSBjb250cm9sbGVyID8gY29udHJvbGxlci5pbm5lckVsZW1lbnRzIDogW11cblx0JDogY3VycmVudFBlclBhZ2UgPSBjb250cm9sbGVyID8gY29udHJvbGxlci5wZXJQYWdlIDogcGVyUGFnZVxuXHQkOiB0b3RhbERvdHMgPSBjb250cm9sbGVyID8gTWF0aC5jZWlsKGNvbnRyb2xsZXIuaW5uZXJFbGVtZW50cy5sZW5ndGggLyBjdXJyZW50UGVyUGFnZSkgOiBbXVxuXHRcblx0b25Nb3VudCgoKSA9PiB7XG5cdFx0Y29udHJvbGxlciA9IG5ldyBTaWVtYSh7XG5cdFx0XHRzZWxlY3Rvcjogc2llbWEsXG5cdFx0XHRwZXJQYWdlOiB0eXBlb2YgcGVyUGFnZSA9PT0gJ29iamVjdCcgPyBwZXJQYWdlIDogTnVtYmVyKHBlclBhZ2UpLFxuXHRcdFx0bG9vcCxcbiAgXHRcdFx0ZHVyYXRpb24sXG4gIFx0XHRcdGVhc2luZyxcbiAgXHRcdFx0c3RhcnRJbmRleCxcbiAgXHRcdFx0ZHJhZ2dhYmxlLFxuIFx0XHRcdG11bHRpcGxlRHJhZyxcbiAgXHRcdFx0dGhyZXNob2xkLFxuICBcdFx0XHRydGwsXG5cdFx0XHRvbkNoYW5nZTogaGFuZGxlQ2hhbmdlXG5cdFx0fSlcblx0XHRcblx0XHRpZihhdXRvcGxheSkge1xuXHRcdFx0dGltZXIgPSBzZXRJbnRlcnZhbChyaWdodCwgYXV0b3BsYXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRhdXRvcGxheSAmJiBjbGVhckludGVydmFsKHRpbWVyKVxuXHRcdFx0Y29udHJvbGxlci5kZXN0cm95KClcblx0XHR9XG5cdH0pXG5cblx0ZXhwb3J0IGZ1bmN0aW9uIGlzRG90QWN0aXZlIChjdXJyZW50SW5kZXgsIGRvdEluZGV4KSB7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPCAwKSBjdXJyZW50SW5kZXggPSBwaXBzLmxlbmd0aCArIGN1cnJlbnRJbmRleDtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRJbmRleCA+PSBkb3RJbmRleCpjdXJyZW50UGVyUGFnZSAmJiBjdXJyZW50SW5kZXggPCAoZG90SW5kZXgqY3VycmVudFBlclBhZ2UpK2N1cnJlbnRQZXJQYWdlXG4gICAgfVxuXHRcblx0ZXhwb3J0IGZ1bmN0aW9uIGxlZnQgKCkge1xuXHRcdGNvbnRyb2xsZXIucHJldigpXG5cdH1cblx0XG5cdGV4cG9ydCBmdW5jdGlvbiByaWdodCAoKSB7XG5cdFx0Y29udHJvbGxlci5uZXh0KClcblx0fVxuXG5cdGV4cG9ydCBmdW5jdGlvbiBnbyAoaW5kZXgpIHtcblx0XHRjb250cm9sbGVyLmdvVG8oaW5kZXgpXG5cdH1cblx0XG5cdGV4cG9ydCBmdW5jdGlvbiBwYXVzZSgpIHtcblx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcblx0fVxuXG5cdGV4cG9ydCBmdW5jdGlvbiByZXN1bWUoKSB7XG5cdFx0aWYgKGF1dG9wbGF5KSB7XG5cdFx0XHR0aW1lciA9IHNldEludGVydmFsKHJpZ2h0LCBhdXRvcGxheSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlQ2hhbmdlIChldmVudCkge1xuXHRcdGN1cnJlbnRJbmRleCA9IGNvbnRyb2xsZXIuY3VycmVudFNsaWRlXG5cblx0XHRkaXNwYXRjaCgnY2hhbmdlJywge1xuXHRcdFx0Y3VycmVudFNsaWRlOiBjb250cm9sbGVyLmN1cnJlbnRTbGlkZSxcblx0XHRcdHNsaWRlQ291bnQ6IGNvbnRyb2xsZXIuaW5uZXJFbGVtZW50cy5sZW5ndGhcblx0XHR9IClcblx0fVxuPC9zY3JpcHQ+XG4iLCI8c2NyaXB0PlxuICBleHBvcnQgbGV0IHNpemUgPSBcIjEwMCVcIjtcbiAgZXhwb3J0IGxldCBzdHJva2VXaWR0aCA9IDI7XG4gIGxldCBjdXN0b21DbGFzcyA9IFwiXCI7XG4gIGV4cG9ydCB7IGN1c3RvbUNsYXNzIGFzIGNsYXNzIH07XG5cbiAgaWYgKHNpemUgIT09IFwiMTAwJVwiKSB7XG4gICAgc2l6ZSA9IHNpemUuc2xpY2UoLTEpID09PSAneCcgXG4gICAgICAgICAgPyBzaXplLnNsaWNlKDAsIHNpemUubGVuZ3RoIC0xKSArICdlbSdcbiAgICAgICAgICA6IHBhcnNlSW50KHNpemUpICsgJ3B4JztcbiAgfVxuPC9zY3JpcHQ+XG5cbjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IGZpbGw9XCJub25lXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCJ7c3Ryb2tlV2lkdGh9XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJmZWF0aGVyIGZlYXRoZXItY2hldnJvbi1sZWZ0IHtjdXN0b21DbGFzc31cIj48cG9seWxpbmUgcG9pbnRzPVwiMTUgMTggOSAxMiAxNSA2XCI+PC9wb2x5bGluZT48L3N2Zz5cbiIsIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc2l6ZSA9IFwiMTAwJVwiO1xuICBleHBvcnQgbGV0IHN0cm9rZVdpZHRoID0gMjtcbiAgbGV0IGN1c3RvbUNsYXNzID0gXCJcIjtcbiAgZXhwb3J0IHsgY3VzdG9tQ2xhc3MgYXMgY2xhc3MgfTtcblxuICBpZiAoc2l6ZSAhPT0gXCIxMDAlXCIpIHtcbiAgICBzaXplID0gc2l6ZS5zbGljZSgtMSkgPT09ICd4JyBcbiAgICAgICAgICA/IHNpemUuc2xpY2UoMCwgc2l6ZS5sZW5ndGggLTEpICsgJ2VtJ1xuICAgICAgICAgIDogcGFyc2VJbnQoc2l6ZSkgKyAncHgnO1xuICB9XG48L3NjcmlwdD5cblxuPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gZmlsbD1cIm5vbmVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIntzdHJva2VXaWR0aH1cIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1jaGV2cm9uLXJpZ2h0IHtjdXN0b21DbGFzc31cIj48cG9seWxpbmUgcG9pbnRzPVwiOSAxOCAxNSAxMiA5IDZcIj48L3BvbHlsaW5lPjwvc3ZnPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IENhcm91c2VsIGZyb20gXCJAYmV5b25rL3N2ZWx0ZS1jYXJvdXNlbFwiO1xuICBpbXBvcnQgeyBDaGV2cm9uTGVmdEljb24sIENoZXZyb25SaWdodEljb24gfSBmcm9tIFwic3ZlbHRlLWZlYXRoZXItaWNvbnNcIjtcblxuICBsZXQgY2Fyb3VzZWxzID0gW1xuICAgIHtcbiAgICAgIHBlclBhZ2U6IDMsXG4gICAgfSxcbiAgICB7XG4gICAgICBwZXJQYWdlOiAzLFxuICAgICAgY29udHJvbHM6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgcGVyUGFnZTogeyAzMjA6IDIsIDc2ODogNCB9LFxuICAgIH0sXG4gICAge1xuICAgICAgcGVyUGFnZTogeyAzMjA6IDEsIDc2ODogMyB9LFxuICAgIH0sXG4gIF07XG5cbiAgZnVuY3Rpb24gY2hhbmdlZChldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LmRldGFpbC5jdXJyZW50U2xpZGUpO1xuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZGVtbyB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgaGVpZ2h0OiAyMzBweDtcbiAgICB3aWR0aDogYXV0bztcbiAgfVxuXG5cbiAgLnNsaWRlLWNvbnRlbnQge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDogMjMwcHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmVpZ2U7XG4gIH1cblxuICAuc2xpZGUtY29udGVudCBoZWFkZXIge1xuICAgIGZsZXg6IDE7XG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgfSBcblxuICAuc2xpZGUtY29udGVudCBzZWN0aW9uIHtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAgcGFkZGluZzogMTJweDtcbiAgICBjb2xvcjphcXVhO1xuICB9XG48L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwiZGVtb1wiPlxuIFxuICAgIDxDYXJvdXNlbCBwZXJQYWdlPVwiMVwiICBlYXNpbmc9XCJlYXNlLW91dFwiIGF1dG9wbGF5PVwiNTAwMFwiIGR1cmF0aW9uPVwiNTAwMFwiPlxuICAgICBcbiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZS1jb250ZW50XCI+XG4gICAgICAgIDxoZWFkZXIgY2xhc3M9XCJiZy1mYWNlXCIgLz5cbiAgICAgICAgPHNlY3Rpb24+SGVsbG8gSSBhbSBraXR0ZW48L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZS1jb250ZW50XCI+XG4gICAgICAgIDxoZWFkZXIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLy9wbGFjZWtpdHRlbi5jb20vMjMwKVwiIC8+XG4gICAgICAgIDxzZWN0aW9uPkkgYW0gZmx1ZmZ5PC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2xpZGUtY29udGVudFwiPlxuICAgICAgICA8aGVhZGVyIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKC8vcGxhY2VraXR0ZW4uY29tLzE4MClcIiAvPlxuICAgICAgICA8c2VjdGlvbj5JIGVuam95IHdvb2w8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZS1jb250ZW50XCI+XG4gICAgICAgIDxoZWFkZXIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLy9wbGFjZWtpdHRlbi5jb20vMzIwKVwiIC8+XG4gICAgICAgIDxzZWN0aW9uPkkgZWF0IGJlYW5zPC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICA8L0Nhcm91c2VsPlxuPC9kaXY+XG48ZGl2PlxuICA8cCBjbGFzcz1cInBiLTRcIj5cbiAgICBXYWxhZG9jcyBpcyBhIGRvY3VtZW50YXRpb24gYnkgV2FsYXRpYyBXZSBob3BlIHRoaXMgdG9vbCBoZWxwcyB5b3UgYW5kXG4gICAgYWNjb21wYW5pZXMgeW91IGluIHlvdXIgd29yay4gSWYgeW91IGZpbmQgYW55IGVycm9yIHBsZWFzZSByZXBvcnQgaXRcbiAgICA8YSBjbGFzcz1cImFcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Jlc291cmNlbGRnL3dhbGFkb2NzL2lzc3VlXCI+aGVyZTwvYT5cbiAgICBZb3UgY2FuIGRvIGJldHRlciBpZiB5b3UgZm9yayB0aGlzIHByb2plY3QgYW5kIGNvbnRyaWJ1dGUuXG4gIDwvcD5cbiAgPGgzPlJlbWVtYmVyPC9oMz5cbiAgPGg0PlwiIFlvdSBoYXZlIHRoZSBwb3RlbmNpYWwgdG8gbWFrZSBhbWF6aW5nIHRoaW5ncy4gXCI8L2g0PlxuPC9kaXY+XG4iXSwibmFtZXMiOlsiZSIsInQiLCJtb2R1bGUiLCJzZWxmIiwidGhpcyIsInIiLCJpIiwiZXhwb3J0cyIsIm4iLCJsIiwiY2FsbCIsIm0iLCJjIiwiZCIsIm8iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwicCIsInMiLCJUeXBlRXJyb3IiLCJ2YWx1ZSIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJsZW5ndGgiLCJ3cml0YWJsZSIsImtleSIsImNvbmZpZyIsIm1lcmdlU2V0dGluZ3MiLCJzZWxlY3RvciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIkVycm9yIiwicmVzb2x2ZVNsaWRlc051bWJlciIsInNlbGVjdG9yV2lkdGgiLCJvZmZzZXRXaWR0aCIsImlubmVyRWxlbWVudHMiLCJzbGljZSIsImNoaWxkcmVuIiwiY3VycmVudFNsaWRlIiwibG9vcCIsInN0YXJ0SW5kZXgiLCJNYXRoIiwibWF4IiwibWluIiwicGVyUGFnZSIsInRyYW5zZm9ybVByb3BlcnR5Iiwid2Via2l0T3JOb3QiLCJmb3JFYWNoIiwiYmluZCIsImluaXQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplSGFuZGxlciIsImRyYWdnYWJsZSIsInBvaW50ZXJEb3duIiwiZHJhZyIsInN0YXJ0WCIsImVuZFgiLCJzdGFydFkiLCJsZXRJdEdvIiwicHJldmVudENsaWNrIiwidG91Y2hzdGFydEhhbmRsZXIiLCJ0b3VjaGVuZEhhbmRsZXIiLCJ0b3VjaG1vdmVIYW5kbGVyIiwibW91c2Vkb3duSGFuZGxlciIsIm1vdXNldXBIYW5kbGVyIiwibW91c2VsZWF2ZUhhbmRsZXIiLCJtb3VzZW1vdmVIYW5kbGVyIiwiY2xpY2tIYW5kbGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50cyIsInN0eWxlIiwib3ZlcmZsb3ciLCJkaXJlY3Rpb24iLCJydGwiLCJidWlsZFNsaWRlckZyYW1lIiwib25Jbml0Iiwic2xpZGVyRnJhbWUiLCJjcmVhdGVFbGVtZW50Iiwid2lkdGgiLCJlbmFibGVUcmFuc2l0aW9uIiwiY3Vyc29yIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImJ1aWxkU2xpZGVyRnJhbWVJdGVtIiwiY2xvbmVOb2RlIiwiYXBwZW5kQ2hpbGQiLCJhIiwiaW5uZXJIVE1MIiwic2xpZGVUb0N1cnJlbnQiLCJjc3NGbG9hdCIsImZsb2F0IiwiaW5uZXJXaWR0aCIsImFyZ3VtZW50cyIsImRpc2FibGVUcmFuc2l0aW9uIiwib25DaGFuZ2UiLCJ3ZWJraXRUcmFuc2l0aW9uIiwiZWFzaW5nIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiYWJzIiwibXVsdGlwbGVEcmFnIiwiY2VpbCIsInRocmVzaG9sZCIsInByZXYiLCJuZXh0IiwiaW5kZXhPZiIsInRhcmdldCIsIm5vZGVOYW1lIiwic3RvcFByb3BhZ2F0aW9uIiwidG91Y2hlcyIsInBhZ2VYIiwicGFnZVkiLCJ1cGRhdGVBZnRlckRyYWciLCJjbGVhckRyYWciLCJwcmV2ZW50RGVmYXVsdCIsInNwbGljZSIsImluc2VydCIsImRldGFjaEV2ZW50cyIsInJlbW92ZUF0dHJpYnV0ZSIsImRvY3VtZW50RWxlbWVudCIsInRyYW5zZm9ybSIsImN0eCIsImF1dG9wbGF5IiwiZG90cyIsImNvbnRyb2xzIiwiY3VycmVudEluZGV4Iiwic2llbWEiLCJjb250cm9sbGVyIiwidGltZXIiLCJkaXNwYXRjaCIsImNyZWF0ZUV2ZW50RGlzcGF0Y2hlciIsIm9uTW91bnQiLCJTaWVtYSIsIk51bWJlciIsImhhbmRsZUNoYW5nZSIsInNldEludGVydmFsIiwicmlnaHQiLCJjbGVhckludGVydmFsIiwiZGVzdHJveSIsImlzRG90QWN0aXZlIiwiZG90SW5kZXgiLCJwaXBzIiwiY3VycmVudFBlclBhZ2UiLCJsZWZ0IiwiZ28iLCJpbmRleCIsImdvVG8iLCJwYXVzZSIsInJlc3VtZSIsImV2ZW50Iiwic2xpZGVDb3VudCIsIiQiLCJ0b3RhbERvdHMiLCJzaXplIiwic3Ryb2tlV2lkdGgiLCJjdXN0b21DbGFzcyIsInBhcnNlSW50IiwiY2hhbmdlZCIsImNvbnNvbGUiLCJsb2ciLCJkZXRhaWwiLCJjYXJvdXNlbHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxHQUFDLFVBQVNBLENBQVQsRUFBV0MsQ0FBWCxFQUFhO0FBQUMsS0FBa0RDLGNBQUEsR0FBZUQsQ0FBQyxFQUFsRSxDQUFBO0FBQXVMLEdBQXJNLENBQXNNLGVBQWEsT0FBT0UsSUFBcEIsR0FBeUJBLElBQXpCLEdBQThCQyxjQUFwTyxFQUF5TyxZQUFVO0FBQUMsV0FBTyxVQUFTSixDQUFULEVBQVc7QUFBQyxlQUFTQyxDQUFULENBQVdJLENBQVgsRUFBYTtBQUFDLFlBQUdDLENBQUMsQ0FBQ0QsQ0FBRCxDQUFKLEVBQVEsT0FBT0MsQ0FBQyxDQUFDRCxDQUFELENBQUQsQ0FBS0UsT0FBWjtBQUFvQixZQUFJQyxDQUFDLEdBQUNGLENBQUMsQ0FBQ0QsQ0FBRCxDQUFELEdBQUs7QUFBQ0MsVUFBQUEsQ0FBQyxFQUFDRCxDQUFIO0FBQUtJLFVBQUFBLENBQUMsRUFBQyxDQUFDLENBQVI7QUFBVUYsVUFBQUEsT0FBTyxFQUFDO0FBQWxCLFNBQVg7QUFBaUMsZUFBT1AsQ0FBQyxDQUFDSyxDQUFELENBQUQsQ0FBS0ssSUFBTCxDQUFVRixDQUFDLENBQUNELE9BQVosRUFBb0JDLENBQXBCLEVBQXNCQSxDQUFDLENBQUNELE9BQXhCLEVBQWdDTixDQUFoQyxHQUFtQ08sQ0FBQyxDQUFDQyxDQUFGLEdBQUksQ0FBQyxDQUF4QyxFQUEwQ0QsQ0FBQyxDQUFDRCxPQUFuRDtBQUEyRDs7QUFBQSxVQUFJRCxDQUFDLEdBQUMsRUFBTjtBQUFTLGFBQU9MLENBQUMsQ0FBQ1UsQ0FBRixHQUFJ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
