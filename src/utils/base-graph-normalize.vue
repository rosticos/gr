<script>
  import { X_MIN, X_MAX } from '@/utils/consts';
  import { parse, evaluate } from 'mathjs';

  export default {
    name: 'BaseGraphNormalize',
    methods: {
      normalizeBar(bar) {
        return {
          type: bar.type,
          x: bar.titles,
          y: bar.values.map(value => parseFloat(value)),
          name: bar.name
        };
      },
      normalizePie(pie, row, column) {
        return {
          type: pie.type,
          domain: {
            row,
            column
          },
          textinfo: pie.textinfo,
          insidetextorientation: pie.insidetextorientation,
          values: JSON.parse(JSON.stringify(pie.values)),
          labels: JSON.parse(JSON.stringify(pie.labels))
        };
      },
      normalizeLine(line, xMin = X_MIN, xMax = X_MAX) {
        if (line.declareType === 'byCoords') {
          return {
            type: line.type,
            mode: line.mode,
            x: line.value.map(item => item.x),
            y: line.value.map(item => item.y)
          };
        } else if (line.declareType === 'byFunction') {
          const { x, y } = this.createFunctionalLine(line, xMin, xMax);

          return {
            name: line.value,
            type: line.type,
            mode: line.mode,
            x,
            y
          };
        }
      },
      createFunctionalLine(line, xMin = X_MIN, xMax = X_MAX) {
        // Оптимизация (меньшее количество точек в массиве)
        let dx = 0.1;

        switch (true) {
          case (Math.abs(xMin - xMax)) >= 1000 && (Math.abs(xMin - xMax)) < 10000:
            dx = 0.5;
            break;
          case (Math.abs(xMin - xMax)) >= 10000 && (Math.abs(xMin - xMax)) < 100000:
            dx = 10;
            break;
          case (Math.abs(xMin - xMax)) >= 100000 && (Math.abs(xMin - xMax)) < 1000000:
            dx = 100;
            break;
          case (Math.abs(xMin - xMax)) >= 1000000 && (Math.abs(xMin - xMax)) < 10000000:
            dx = 1000;
            break;
          case (Math.abs(xMin - xMax)) >= 10000000 && (Math.abs(xMin - xMax)) < 100000000:
            dx = 10000;
            break;
          case (Math.abs(xMin - xMax)) >= 100000000:
            dx = 10000000;
            break;
          default:
            dx = 0.1;
        }
        const xArray = []; const yArray = [];

        const node = parse(line.value);
        const scope = new Map();

        if (line.constsArray.length) {
          line.constsArray.forEach(cons => {
            scope.set(cons.name, evaluate(cons.value));
          });
        }

        for (let x = xMin; x < xMax; x += dx) {
          const code = node.compile();

          xArray.push(x);
          yArray.push(code.evaluate({ [line.funcRelative]: x, ...Object.fromEntries(scope) }));
        }

        return {
          x: xArray,
          y: yArray
        };
      },
      recount(value, item, index, type) {
        if (type === 'scatter') {
          const lines = item.value[index].values;

          if (value?.['xaxis.range[0]'] && value?.['xaxis.range[1]']) {
            const normalizedLines = lines.map(line => {
              if (line.declareType === 'byFunction' && (value?.['xaxis.range[0]'] < X_MIN || value?.['xaxis.range[1]'] > X_MAX)) {
                const [xMin, xMax] = [value['xaxis.range[0]'], value['xaxis.range[1]']];

                return this.normalizeLine(line, xMin, xMax);
              }

              return this.normalizeLine(line);
            });

            item.normalizedValue[index].data = normalizedLines;
          }
        }
      }
    }
  };
</script>

<style>

</style>
