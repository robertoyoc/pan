module.exports = function() {
  let Promise = require('promise');
  let _ = require('underscore');
  const formatCurrency = require('format-currency');

  function buildTableBody(data) {
      var columns = ['Producto', 'Cantidad', 'Unidad', 'Importe'];
      var body = [];
      body.push(columns);

      data.forEach(function(row) {
          var dataRow = [];
          columns.forEach(function(column) {
              dataRow.push(row[column].toString());
          })
          body.push(dataRow);
      });
      return body;
  }

  function table(data) {
      return {
        style: 'tableExample2',
        layout: 'noBorders',
          table: {
            widths: ['35%', '25%', '20%', '20%'],
              headerRows: 1,
              body: buildTableBody(data)
          }
      }
  }

  function hasCourtesy(){
    if (ventaObj.importeC > 0) {
      return {
        style: 'tableExample2',
        table: {
          widths: ['50%', '25%', '25%'],
          headerRows: 1,
          body: [
            ['', 'Cortesía', impCourtesy],
            ['', 'Subtotal', impTotal]
          ]
        },
        layout: 'noBorders'
      }
    } else {
      return {
        style: 'tableExample2',
        table: {
          widths: ['50%', '25%', '25%'],
          headerRows: 1,
          body: [
            ['', 'Subtotal', impTotal]
          ]
        },
        layout: 'noBorders'
      }
    }
  }

  function ticketDetails(venta) {
    console.log("venta details", venta)

    // Código QR
    var greeting = venta.idVenta;
    var url = 'http://pdfmake.org';
    var longText = 'The amount of data that can be stored in the QR code symbol depends on the datatype (mode, or input character set), version (1, …, 40, indicating the overall dimensions of the symbol), and error correction level. The maximum storage capacities occur for 40-L symbols (version 40, error correction level L):'

    // Estilizando las cantidades
    let opts = { format: '%s%v', symbol: '$' }

    // Construyendo dinamicamente la tabla de pedidos de la venta
    var pedidosData = [];
    let cPedidos = 0;
    for(var pedidoIndex in venta.pedidos) {
      let producto = venta.pedidos[pedidoIndex].producto
      let cant = venta.pedidos[pedidoIndex].cantidad
      // let numberIndex = Number(pedidoIndex)+1
      let importeProduct = Number(producto.precio)*Number(cant)

      pedidosData.push({
        Producto: producto.nombre.toString(),
        Cantidad: cant,
        Unidad: formatCurrency(producto.precio, opts),
        Importe: formatCurrency(importeProduct, opts)
      })
      cPedidos++;
    }

    let impTotal = formatCurrency(venta.importeT, opts)
    let impCourtesy = formatCurrency(venta.importeC, opts)
    let dateString = moment.unix(venta.fecha).format("DD/MM/YYYY");
    let hourString = moment.unix(venta.fecha).utcOffset("-05:00").format("HH:mm:ss");
    // console.log("hora correcta", moment.unix(ventaObj.fecha).utcOffset("-05:00"))
    let heightt = Number(cPedidos) * 20 + 180;

    return {
      {
        image: './media/logo.png',
        width: 70,
        margin: [0, 0, 0, 3]
      },
      { text: 'Av Benito Juárez 804, Centro, 42000 Pachuca de Soto, Hgo.', fontSize: 3},
      { text: 'Pan La Villita S.A. de C.V.', fontSize: 3, margin: [16, 3, 0, 0] },
      { text: `Ticket: ${venta.idVenta}`, fontSize: 3, margin: [0, 2, 0, 0] },
      { text: `Fecha: ${dateString}`, fontSize: 3, margin: [0, 2, 0, 0] },
      { text: `Hora: ${hourString}`, fontSize: 3, margin: [0, 2, 0, 0] },
      { text: `Sucursal: ${venta.nombreSucursal}`, fontSize: 3, margin: [0, 2, 0, 0] },
      { text: `Atendió: ${venta.nombreVendedor}`, fontSize: 3, margin: [0, 2, 0, 2] },
        table(pedidosData)
      ,
        hasCourtesy()
      ,
      { text: `TOTAL ${impTotal}`, fontSize: 4, margin: [40, 3, 0, 0] },
      { qr: greeting, fit: 50, margin: [10, 3, 0, 0] },
      { text: 'Próximamente pedidos online en:', fontSize: 3, margin: [9, 5, 0, 0] },
      { text: 'panlavillita.mx', fontSize: 3, margin: [23, 2, 0, 0] }
    }
  }

  function render(venta, defaultDd) {
    console.log("renderizando")

    let dd = _.extend(defaultDd, {
      pageSize: { width: 80, height: heightt},
      pageMargins: [ 8, 10, 8, 10 ],
      content: [],
      tyles: {
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

    dd.content.push(ticketDetails(venta))

    return new Promise((res, rej)=>{
      return res(dd);
    })

  }



  return {
    render: render
  }
}();
