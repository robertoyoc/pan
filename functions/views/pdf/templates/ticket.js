module.exports = function () {
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
            },
          ]
        ],
      },
      layout: 'noBorders',
    }
  }




  // async function conceptoSection(concepto, opts) {
  //   concepto = objectPath(concepto || {})
  //   opts = opts || {}


  //   let conceptoSection = {
  //     table: {
  //       widths: [50, '*', 60, 60],
  //       body: [
  //         [{
  //             table: {
  //               headerRows: 1,
  //               widths: ['*'],
  //               body: [
  //                 [{
  //                   text: 'Cantidad',
  //                   bold: true,
  //                   alignment: 'center',
  //                   style: 'tableHeader',
  //                   border: [false, false, false, false],
  //                   margin: [0, 0, 0, 0]
  //                 }],
  //                 [{
  //                   text: `${concepto.get('cantidad')}`,
  //                   alignment: 'center',
  //                   border: [false, false, false, false],
  //                   margin: [0, 0, 0, 0]
  //                 }]
  //               ]
  //             },
  //             border: [false, false, false, true],
  //             margin: [0, 0, 0, 0],
  //           },
  //           {
  //             border: [false, false, false, true],
  //             table: {
  //               margin: [0, 0, 0, 0],
  //               widths: ['auto', '*'],
  //               body: [
  //                 [{
  //                   text: 'Unidad',
  //                   bold: true,
  //                   border: [false, false, false, false],
  //                   style: 'tableHeader',
  //                   alignment: ''
  //                 }, {
  //                   text: 'Concepto',
  //                   bold: true,
  //                   border: [false, false, false, false],
  //                   style: 'tableHeader'
  //                 }],
  //                 [{
  //                   text: `${concepto.get('claveUnidad')} ${await name('c_ClaveUnidad', concepto.get('claveUnidad'))}`,
  //                   border: [false, false, false, false],
  //                   alignment: ''
  //                 }, {
  //                   border: [false, false, false, false],
  //                   text: `${concepto.get('clave')} ${await name('c_ClaveProdServ', concepto.get('clave'))}`
  //                 }],
  //                 [{
  //                   text: 'Descripción',
  //                   bold: true,
  //                   border: [false, false, false, false],
  //                   style: 'tableHeader',
  //                   colSpan: 2
  //                 }, {}],
  //                 [{
  //                   colSpan: 2,
  //                   border: [false, false, false, false],
  //                   text: `${concepto.get('descripcion')} ${(concepto.get('numeroPredial')) ? ('Numero Predial ' + concepto.get('numeroPredial')) : ''}`
  //                 }, {}],
  //                 [{
  //                   text: `${concepto.get('iedu')?"Datos del alumno": ''}`,
  //                   bold: true,
  //                   border: [false, false, false, false],
  //                   style: 'tableHeader',
  //                   colSpan: 2
  //                 }, {}],
  //                 [{
  //                   colSpan: 2,
  //                   border: [false, false, false, false],
  //                   text: `${(concepto.get('iedu'))?(`Nombre: ${concepto.get('iedu.nombreAlumno')}. CURP: ${concepto.get('iedu.curp')}. Nivel educativo: ${concepto.get('iedu.nivelEducativo')}. RVOE: ${concepto.get('iedu.autRVOE')}.`): ""}`
  //                 }, {}],
  //               ]
  //             },
  //             layout: {
  //               paddingLeft: function () {
  //                 return 2;
  //               },
  //               paddingBottom: function () {
  //                 return 2;
  //               },
  //               paddingTop: function () {
  //                 return 0;
  //               },
  //               paddingRight: function () {
  //                 return 2;
  //               }
  //             }
  //           },
  //           {
  //             table: {
  //               headerRows: 1,
  //               widths: ['*'],
  //               body: [
  //                 [{
  //                   text: 'P. Unitario',
  //                   bold: true,
  //                   alignment: 'center',
  //                   border: [false, false, false, false],
  //                 }],
  //                 [{
  //                   text: `${moneyFormat(concepto.get('valorUnitario'))}`,
  //                   alignment: 'center',
  //                   border: [false, false, false, false],
  //                 }]
  //               ]
  //             },
  //             border: [false, false, false, false],
  //           },
  //           {
  //             table: {
  //               headerRows: 1,
  //               widths: ['*'],
  //               body: [
  //                 [{
  //                   text: 'Importe',
  //                   bold: true,
  //                   alignment: 'center',
  //                   border: [false, false, false, false],
  //                 }],
  //                 [{
  //                   text: `${moneyFormat(concepto.get('importe'))}`,
  //                   alignment: 'right',
  //                   border: [false, false, false, false],
  //                   margin: [0, 0, 0, 0]
  //                 }]
  //               ]
  //             },
  //             border: [false, false, false, false],
  //             margin: [0, 0, 0, 0]
  //           }
  //         ],
  //       ]
  //     },
  //     layout: {
  //       defaultBorder: [false, false, false, false],
  //       paddingLeft: function () {
  //         return 1;
  //       },
  //       paddingBottom: function () {
  //         return 1;
  //       },
  //       paddingTop: function () {
  //         return 1;
  //       },
  //       paddingRight: function () {
  //         return 1;
  //       }
  //     }
  //   }


  //   if (opts.desgloseImpuestos) {
  //     let hasDescuento = objectPath(concepto, 'descuento', 0) > 0
  //     if (hasDescuento) {
  //       objectPath.push(
  //         conceptoSection,
  //         'table.body', [{
  //             border: [false, false, false, false],
  //             text: ''
  //           },
  //           {
  //             colSpan: 2,
  //             text: 'Descuento',
  //             alignment: 'right',
  //             border: [false, true, false, false]
  //           },
  //           {},
  //           {
  //             text: `${moneyFormat(concepto.get('descuento'))}`,
  //             alignment: 'right',
  //             border: [false, true, false, false]
  //           }
  //         ]
  //       )
  //     }

  //     concepto.get('impuestos', []).forEach(function (impuesto, index) {
  //       //console.log(impuesto)

  //       let textImpuesto = (impuesto.tipoFactor=='Exento')?`${impuesto.impuestoLabel} Exento`: `${impuesto.impuestoLabel} ${impuesto.tasaCuota}%`;

  //       objectPath.push(
  //         conceptoSection,
  //         'table.body', [{
  //             border: [false, false, false, false],
  //             text: ''
  //           },
  //           {
  //             colSpan: 2,
  //             text: textImpuesto,
  //             alignment: 'right',
  //             border: [false, !hasDescuento && index == 0, false, false]
  //           },
  //           {},
  //           {
  //             text: `${moneyFormat(impuesto.importe)}`,
  //             alignment: 'right',
  //             border: [false, !hasDescuento && index == 0, false, false]
  //           }
  //         ]
  //       )
  //     })
  //   }

  //   return conceptoSection
  // }





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


    // if (factura.get('fechaCancelado') || factura.get('xmlCancelado')) {
    //   dd.watermark = {
    //     text: 'CANCELADO',
    //     color: 'red',
    //     opacity: 0.3,
    //     bold: true,
    //     italics: false
    //   }
    // } else if (factura.get('prueba')) {
    //   dd.watermark = {
    //     text: 'PRUEBA',
    //     color: 'black',
    //     opacity: 0.3,
    //     bold: true,
    //     italics: false
    //   }
    // }


    // if(dd.images && dd.images.logo){
    //   dd.content.push({image: 'logo', fit: [150, 63], alignment: 'center'})
    }



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

    // await Promise.all(
    //   factura.get('conceptos').map(async function (concepto) {
    //     return dd.content.push(await conceptoSection(concepto, {
    //       desgloseImpuestos: factura.get('conceptos').length > 1
    //     }))
    //   })
    // )

    dd.content.push({
      text: '\n'
    })



    return dd;
  }



  return {
    render: render
  }
}();