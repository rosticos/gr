import { createVue } from '../../js/mount-index.js'

const book = [{
  type: 'text',
  data: '<h1>Привет</h1>'
},
{
  type: 'graph',
  data: [{
    values: [{
      name: 'y=cos(x)',
      declareType: 'byFunction',
      type: 'scatter',
      mode: 'lines',
      value: 'y=cos(x)'
    }],
    layout: {
      title: 'График',
      xaxis: {
        title: 'X'
      },
      yaxis: {
        title: 'Y'
      }
    },
    type: 'scatter'
  }, {
    values: [{
      name: 'y=cos(x)',
      declareType: 'byFunction',
      type: 'scatter',
      mode: 'lines',
      value: 'y=cos(x)'
    }],
    layout: {
      title: 'График',
      xaxis: {
        title: 'X'
      },
      yaxis: {
        title: 'Y'
      }
    },
    type: 'scatter'
  }]
},
{
  type: 'text',
  data: '<h1>Привет</h1>'
}
]

document.addEventListener('DOMContentLoaded', () => {
  const html = document.getElementById('result')

  book.map((page, index) => {
    if (page.type === 'text') {
      html.innerHTML += page.data
    } else if (page.type === 'graph') {
      const id = `graph-${index}`
      const node = document.createElement('div')
      node.setAttribute('id', id)

      html.appendChild(node)
      createVue(page.data, `#${id}`)
    }
  })
})
