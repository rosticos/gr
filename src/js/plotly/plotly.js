import { events } from "./events.js";
import { methods } from "./methods.js";
import { camelize } from "./helper.js";

const directives = {};

Vue.component("plotly", {
    template: `<div :id="id" />`,
    name: "plotly",
    inheritAttrs: false,
    directives,
    props: {
        data: {
            type: Array
        },
        layout: {
            type: Object
        },
        id: {
            type: String,
            required: false,
            default: null
        }
    },
    data() {
        return {
            scheduled: null,
            innerLayout: {
                ...this.layout
            }
        };
    },
    mounted() {
        Plotly.newPlot(this.$el, this.data, this.innerLayout, this.options);
        events.forEach(evt => {
            this.$el.on(evt.completeName, evt.handler(this));
        });
    },
    watch: {
        data: {
          handler() {
            this.schedule({
              replot: true
            });
          },
          deep: true
        },
        options: {
          handler(value, old) {
            if (JSON.stringify(value) === JSON.stringify(old)) {
              return;
            }
            this.schedule({
              replot: true
            });
          },
          deep: true
        },
        layout(layout) {
          this.innerLayout = {
              ...layout
          };
          this.schedule({
              replot: false
          });
        }
    },
    computed: {
      options() {
        const optionsFromAttrs = Object.keys(this.$attrs).reduce((acc, key) => {
          acc[camelize(key)] = this.$attrs[key];
          return acc;
        }, {});

        return {
          responsive: false,
          ...optionsFromAttrs
        };
      }
    },
    beforeDestroy() {
      events.forEach(event => this.$el.removeAllListeners(event.completeName));
      Plotly.purge(this.$el);
    },
    methods: {
      ...methods,
      schedule(context) {
        const {
          scheduled
        } = this;

        if (scheduled) {
          scheduled.replot = scheduled.replot || context.replot;
          return;
        }

        this.scheduled = context;

        this.$nextTick(() => {
          const {
            scheduled: {
              replot
            }
          } = this;
          this.scheduled = null;
          if (replot) {
              this.react();
              return;
          }

          this.relayout(this.innerLayout);
          });
        },
        toImage(options) {
          const allOptions = Object.assign(this.getPrintOptions(), options);
          return Plotly.toImage(this.$el, allOptions);
        },
        downloadImage(options) {
          const filename = `plot--${new Date().toISOString()}`;
          const allOptions = Object.assign(this.getPrintOptions(), {
            filename
          }, options);
          return Plotly.downloadImage(this.$el, allOptions);
        },
        getPrintOptions() {
          const {
            $el
          } = this;
          return {
            format: "png",
            width: $el.clientWidth,
            height: $el.clientHeight
          };
        },
        react() {
          Plotly.react(this.$el, this.data, this.innerLayout, this.options);
        }
    }

});