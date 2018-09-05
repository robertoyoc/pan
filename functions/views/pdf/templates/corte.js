let Promise = require('promise');
let _ = require('underscore');
const formatCurrency = require('format-currency');
const moment = require('moment');

function buildTableBody(corte) {
  let opts = { format: '%s%v', symbol: '$' }
  var columns = ['Producto', 'Cantidad', 'Unidad', 'Importe'];
  var columnNames = ['Descripción', '  ', 'Cantidad'];
  var body = [];
  body.push(columnNames);
  let caja = formatCurrency(corte.caja, opts)
  let cantidadInicial = formatCurrency(corte.cantidadInicial, opts)
  let cobrosTotal = formatCurrency(corte.cobrosTotal, opts)
  let retirosTotal = formatCurrency(corte.retirosTotal, opts)

  body.push(['Cantidad Inicial', '+', cantidadInicial])
  body.push(['Ventas', '+', cobrosTotal])
  body.push(['Retiros', '-', retirosTotal])
  body.push(['Cantidad Final', '=>', caja])

 
  return body;
}


function table(data) {
  return {
    style: 'tableExample2',
    layout: 'noBorders',
    table: {
      widths: ['50%','10%', '40%'],
      headerRows: 1,
      body: buildTableBody(data)
    }
  }
}


function ticketDetails(corte) {


  // Estilizando las cantidades
  


  let dateString = moment.unix(corte.fecha).format("DD/MM/YYYY");
  let hourString = moment.unix(corte.fecha).utcOffset("-05:00").format("HH:mm:ss");



  return [{
      image: './media/logo.png',
      width: 70,
      margin: [0, 0, 0, 3]
    },
    { text: 'Av Benito Juárez 804, Centro, 42000 Pachuca de Soto, Hgo.', fontSize: 3 },
    { text: 'Pan La Villita S.A. de C.V.', fontSize: 3, margin: [16, 3, 0, 0] },
    { text: `Corte: ${corte.key}`, fontSize: 3, margin: [0, 2, 0, 0] },
    { text: `Fecha: ${dateString}`, fontSize: 3, margin: [0, 2, 0, 0] },
    { text: `Hora: ${hourString}`, fontSize: 3, margin: [0, 2, 0, 0] },
    { text: `Sucursal: ${corte.sucursal.nombre}`, fontSize: 3, margin: [0, 2, 0, 0] },
    { text: `Turno ${corte.turno}`, fontSize: 3, margin: [0, 2, 0, 0] },
    { text: `Datos del corte:`, fontSize: 3, margin: [0, 2, 0, 0] },

    table(corte),
    { text: 'Próximamente pedidos online en:', fontSize: 3, margin: [9, 5, 0, 0] },
    { text: 'panlavillita.mx', fontSize: 3, margin: [23, 2, 0, 0] }
  ]
}


module.exports = {
  render: function(corte, defaultDd) {
    let heightt = 'auto';
    console.log("renderizando")

    let dd = _.extend(defaultDd, {
      pageSize: { width: 80, height: heightt },
      pageMargins: [8, 10, 8, 10],
      content: [],
      styles: {
        header: {
          fontSize: 2,
          bold: true,
          margin: [0, 0, 0, 0],
          color: 'black'
        },
        tableExample: {
          margin: [0, 0, 0, 0],
          fontSize: 2.5,
          width: 50,
          alignment: 'right'
        },
        tableExample2: {
          margin: [0, 0, 0, 0],
          fontSize: 2.5,
          width: 50,
          alignment: 'right'
        },
        tableHeader: {
          bold: true,
          fontSize: 2,
          color: 'black',
          margin: [0, 0, 0, 0]
        }
      },
      defaultStyle: {
        alignment: 'justify'
      }
    });

    dd.content = ticketDetails(corte)

    return new Promise((res, rej) => {
      return res(dd);
    })
  }
};
