<template>
  <div ref="root" class="form-navigation" v-bind:class="{ 'form-navigation_expand': syncValue }">
    <div class="form-navigation__header">
      <span class="form-navigation__header_text">Оглавление</span>

      <div class="btn btn_outline ml-auto" v-on:click="syncValue = false">
        <div class="p-icon p-icon-close" />
      </div>
    </div>

    <div class="form-navigation__body">
      <div ref="formNavigation" class="form-navigation__structure">
        <div v-if="headings.length" class="form-navigation__structure-slider" v-bind:style="sliderStyles" />

        <div v-if="headings.length" ref="structureHeadingsElement" class="form-navigation__structure-headings">
          <div 
            v-for="heading in headings" 
            v-bind:id="heading.id"
            v-bind:key="heading.id"
            class="form-navigation__structure-heading-item"
            v-on:click="scrollToHeading(heading)">
            <div v-if="heading.type === 'header'">
              <span>{{ toText(heading.title) }}</span>
            </div>

            <div v-if="heading.type === 'text'">
              <span>{{ toText(heading.title).substring(0, 40) }}...</span>
            </div>

            <div v-if="heading.type === 'graph'">
              {{ toText(heading.title) }}
            </div>
          </div>
        </div>

        <div v-else>
          <span>
            Для наличия оглавления - добавьте заголовки
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const CONSTRUCTOR_HEADER_HEIGHT = 38;
  const HEADING_SCROLL_TO_INDENT = 60; // взято из google docs

  export function throttle(func, wait) {
    let isThrottled = false;
    let savedArgs = null;
    let savedThis = null;
    let resolvePrev = null;

    const startThrottle = () => {
      isThrottled = true;

      setTimeout(function() {
        isThrottled = false;
        if (savedArgs && resolvePrev) {
          resolvePrev(func.apply(savedThis, savedArgs));

          resolvePrev = null;
          savedArgs = null;
          savedThis = null;

          startThrottle();
        }
      }, wait);
    };

    return function wrapper(...args) {
      return new Promise(resolve => {
        if (isThrottled) {
          if (resolvePrev) resolvePrev(undefined);

          resolvePrev = resolve;
          savedArgs = args;
          savedThis = this;
          return;
        }

        resolve(func.apply(this, args));

        startThrottle();
      });
    };
  }

  export default {
    props: {
      value: { default: false, type: Boolean },
      tree: { default: () => ([]), type: Array }
    },
    data() {
      return {
        headings: [],
        activeHeadingIndex: 0,
        formNavigationRect: null,
        throttledUpdateActiveHeading: throttle(this.updateActiveHeading, 200),
        activeHeadingElementRect: null,
        sliderStyles: null
      };
    },
    computed: {
      syncValue: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('update:value', value);
        }
      }
    },
    watch: {
      tree: { 
        immediate: true,
        deep: true,
        async handler(value) {
          if (value) {
            this.createTree();

            setTimeout(this.throttledUpdateActiveHeading, 150);
          }
        }
      }
    },
    mounted() {
      document.addEventListener('scroll', this.scrollEvenentListener);
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.scrollEvenentListener);
    },
    methods: {
      toText(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        return tmp.textContent || tmp.innerText || '';
      },
      createTree() {
        this.headings = this.tree.map(n => {
          if (n.type === 'header') {
            return {
              id: n.id,
              type: n.type,
              title: n.value
            };
          }
        }).filter(i => i);
      },
      updateSliderStyles() {
        if (!this.activeHeadingElementRect) {
          return;
        }

        const sliderTop =
          this.activeHeadingElementRect.top // Отступ сверху элемента заголовка
          + this.$refs.root.firstElementChild.scrollTop
          - 115; // Прокрутка внутри контента drawer'a


        this.sliderStyles = {
          top: `${sliderTop}px`,
          height: `${this.activeHeadingElementRect.height}px`
        };
      },
      async updateActiveHeading(heading) {
        if (this.scrolledToHeading && !heading) {
          return;
        }

        this.createTree();

        if (this.headings.length) {
          const targetHeading = heading || this.getNearestHeading();

          this.activeHeadingIndex = this.headings.findIndex(h => h.id === targetHeading.id);

          await this.$nextTick(); // Необходимо время на рендеринг элемента заголовка в структуре

          this.activeHeadingElementRect = this.$refs.structureHeadingsElement.children[this.activeHeadingIndex]?.getBoundingClientRect() ?? null;

          this.updateSliderStyles();
        }
      },
      async scrollToHeading(headingItem) {
        let headingElement= null;

        if (headingItem.type === 'text') {
          headingElement = document.querySelector(`#editor-textarea-${headingItem.id}`);
        } else if (headingItem.type === 'header') {
          headingElement = document.querySelector(`#editor-textarea-${headingItem.id}`);
        } else if (headingItem.type === 'graph') {
          headingElement = document.querySelector(`#document-part_graph-${headingItem.id}`);
        }

        if (headingElement) {
          this.scrolledToHeading = headingItem;

          this.updateActiveHeading(headingItem);

          window.scrollTo({
            top: window.scrollY + headingElement.getBoundingClientRect().top - CONSTRUCTOR_HEADER_HEIGHT - HEADING_SCROLL_TO_INDENT,
            behavior: 'smooth'
          });

          setTimeout(() => {
            if (JSON.stringify(this.scrolledToHeading) === JSON.stringify(headingItem)) {
              this.scrolledToHeading = null;
            }
          }, 1000);
        }
      },
      getNearestHeading() {
        const items = [...document.getElementsByClassName('document-part')];

        const currentY = window.scrollY;

        if (items.length) {
          const nearestHeadingItems = items.map(headingItem => {
            const headingItemPosition = headingItem.getBoundingClientRect();
          
            if (headingItemPosition.y <= currentY) {
              return headingItem;
            }
            return false;
          }).filter(i => i !== false);

        
          return nearestHeadingItems.length ? { id: nearestHeadingItems.pop().id } : 0;
        }
        return [];
      },
      scrollEvenentListener() {
        this.throttledUpdateActiveHeading();
      }
    }
  };
</script>

<style>
  .form-navigation {
    display: block;
    position: fixed;
    width: 350px;
    max-width: 350px;
    top: 39px;
    background: var(--color-white);
    border-right: 1px solid var(--color-light-grey);
    padding: var(--base-padding);
    z-index: 101;
    transition: transform .3s ease;
    transform: translateX(-100%);
    height: calc(100vh - 38px);
  }

  .form-navigation_expand {
    transform: translateX(0%);
    transition: transform .3s ease;
  }

  .form-navigation__header {
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 20px;
  }

  .form-navigation__header_text {
    font-size: 17px;
    line-height: 24px;
    font-weight: 700;
  }

  .form-navigation__body {
    margin-top: 4px;
    padding: 0 24px 6px 24px;
  }
  .form-navigation__structure {
    padding-left: 12px;
    position: relative;
    word-break: break-word;
  }
  .form-navigation__structure-slider {
    background-color: var(--color-red);
    height: 24px;
    left: 0;
    position: absolute;
    top: 0;
    transition: height .2s ease-in-out, top .2s ease-in-out;
    width: 2px;
  }
  .form-navigation__structure-heading-item {
    cursor: pointer;
    line-height: 24px;
    margin-bottom: 8px;
    min-height: 24px;
    transition: color .2s ease-in-out;
  }
  .form-navigation__structure-heading-item:hover,
  .form-navigation__structure-heading-item.active {
    color: var(--color-red);
  }
</style>
