module.exports = function() {
  let Promise = require('promise')
  let _ = require('underscore')

  function ticketDetails(venta) {
    console.log("venta details", venta)
    return {
      table: {
        widths: ['*', 100],
        margin: [0, 0, 0, 0],
        body: [
          [{
            table: {
              widths: ['*'],
              border: [false, false, false, false],
              body: [

                [{
                  text: [{
                    text: `Hola esto es el ticket\t`,
                    fontSize: 8,
                  }, `Texto debajo`],
                  margin: [0, 0, 0, 0]
                }],
                [{
                  text: [{
                    text: 'Fecha:\n',
                    bold: true
                  }, {
                    text: `Insertar fecha`,
                    fontSize: 8,
                  }, `Texto debajo de fecha `],
                  margin: [0, 0, 0, 0]
                }]
              ],
            },
            layout: 'noBorders'
          }, ]
        ],
      },
      layout: 'noBorders',
    }
  }

  function render(venta, defaultDd) {
    console.log("renderizando")

    let dd = _.extend(defaultDd, {
      styles: {},
      pageMargins: [30, 40, 30, 40],
      pageSize: 'LETTER',
      defaultStyle: {
        font: 'HelveticaNeue',
        fontSize: 7,
        color: '#222'
      },
      content: []
    })



    dd.content.push({
      text: '\n\n'
    })
    dd.content.push({
      text: 'Roberto'
    })


    dd.content.push(ticketDetails(venta))

    dd.content.push({
      text: '\n\n'
    })

    dd.content.push({
      text: '\n'
    })

    return new Promise((res, rej)=>{
      return res(dd);
    })

  }



  return {
    render: render
  }
}();
