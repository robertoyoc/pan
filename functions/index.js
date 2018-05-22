
const keys = require('object-keys');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = functions.config();
const formatCurrency = require('format-currency');
const moment = require('moment');

const db = require('./config/admin').db;

exports.api = functions.https.onRequest(require('./config/router'));

let exportablesController = require('./controllers/exportables')


//	Router para API
// if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'api') {
//
// }


//	Workers
// addToExports(require('./workers/summarize-factura'))


//	General triggers

exports.processReparto = functions.database.ref('/repartos/{repartoId}').onCreate(function (event) {
	return db.ref(`/repartos/${event.params.repartoId}`).once('value').then((repartoSnap)=>{
		let promises = []
		let reparto = repartoSnap.val()

		let sucursal = reparto.sucursal;
		let origin = reparto.origin;

		for(var distribucion_id in reparto.distribuciones){
			promises.push(
				db.ref(`/distribucions/${distribucion_id}`).once('value').then((snap)=>{
					let distribucion = snap.val()
					let tipo = distribucion.tipo
					let cantidad = distribucion.cantidad
					let producto_id = distribucion.producto
					let path = null;
					switch(tipo){
						case "receta":
							path = "receta"
							break;
						case "distribuido":
							path = "distribuidos"
							break;
					}
					return db.ref(`/existences`).orderByChild('productoId').equalTo(producto_id).once('value').then((existencesSnap)=>{

						let existencias = existencesSnap.val()

						let originRef = null;
						let sucursalRef = null;

						for(var existencia_id in existencias){

							switch(existencias[existencia_id].sucursalId){
								case sucursal:
									sucursalRef = existencia_id
									break;
								case origin:
									originRef = existencia_id
									break
							}

						}
						let existencesPromises = []

						existencesPromises.push(
							db.ref(`/existences/${originRef}`).transaction(function(existencia){
								if(existencia){
									existencia.cantidad = existencia.cantidad -cantidad
								}

								return existencia
							})
						)
						existencesPromises.push(
							db.ref(`/existences/${sucursalRef}`).transaction(function(existencia){

								if(existencia){
									existencia.cantidad = existencia.cantidad +cantidad
								}

								return existencia
							})
						)


						return Promise.all(existencesPromises)


					})
					return distribucion
				})
			)
		}

		return Promise.all(promises).then((result)=>{

			console.log("Reparto procesado")
			return true
		})
	})
});

// if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'processReparto') {

// }

// function addToExports(obj) {
//   keys(obj).forEach((k) => {
//     if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === k) {
//       module.exports[k] = obj[k]
//     }
//   })
// }

// FUNCION ORIGINAL TICKET

exports.processVenta = functions.database.ref('/venta/{ventaId}').onCreate(function (event) {
	let ventaSnapGeneral = null

	return db.ref(`/venta/${event.params.ventaId}`).once('value').then((ventaSnap)=>{
		let venta = ventaSnap.val()
		ventaSnapGeneral =ventaSnap
		let promises = []
		let sucursal = venta.sucursal;
		for(var pedido_id in venta.pedidos){
			promises.push(
				db.ref(`pedidos/${pedido_id}`).once('value').then((pedidoSnap)=>{
					let pedido = pedidoSnap.val()
					let producto = pedido.productoId
					let cantidad = pedido.cantidad
					return db.ref(`existences`).orderByChild(producto).once('value').then((existencesSnap)=>{
						let existencias = existencesSnap.val()
						let existenciaRef = null
						for(var existencia_id in existencias){
							if(existencias[existencia_id].sucursalId==sucursal){
								existenciaRef = existencia_id
							}
						}
						return db.ref(`existences/${existenciaRef}`).transaction((existencia)=>{
							if(existencia){
								existencia.cantidad = existencia.cantidad - cantidad
							}
							return existencia
						})
					})
				})
			)
		}
		return Promise.all(promises).then(()=>{
			let ventaObj= {}
			ventaObj.idVenta = ventaSnap.key
			console.log('Venta: ', ventaObj.idVenta)
			ventaObj.importeT =  ventaSnap.val().importeTotal
			ventaObj.importeC =  ventaSnap.val().importeCortesia
			ventaObj.fecha = ventaSnap.val().fechaUnix
			let promisesVenta = []
			for(var id_pedido in venta.pedidos){
				promisesVenta.push(
					db.ref(`pedidos/${id_pedido}`).once('value').then((pedidoSnap)=>{
						let pedido = pedidoSnap.val()
						//console.log('Pedido: ', pedido)
						let path = null;
						switch(pedido.tipo){
							case "receta":
								path = "receta"
								break;
							case "distribuido":
								path = "distribuidos"
								break;
						}
						return db.ref(`${path}/${pedido.productoId}`).once('value').then((productoSnap)=>{
							//console.log('Producto: ', productoSnap.val())
							return {
								cantidad: pedido.cantidad,
								producto: productoSnap.val()
							}
						})
					})
				)
			}

			let sucursal_id = ventaSnap.val().sucursal
			console.log('Sucursal: ', sucursal_id)
			let vendedor_id = ventaSnap.val().propietario

			return db.ref(`sucursals/${sucursal_id}`).once('value').then((sucursalSnap)=>{
				return db.ref(`accounts/${vendedor_id}`).once('value').then((propietarioSnap)=>{
					ventaObj.nombreVendedor = propietarioSnap.val().nombre
					ventaObj.nombreSucursal = sucursalSnap.val().nombre
					return Promise.all(promisesVenta).then((nVenta)=>{
						ventaObj.pedidos = nVenta;
						console.log('Trabajando en PDF')

						var fonts = {
						  Roboto: {
						    normal: 'fonts/Roboto-Regular.ttf',
						    bold: 'fonts/Roboto-Medium.ttf',
						    italics: 'fonts/Roboto-Italic.ttf',
						    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
						  }
						};

						var PdfPrinter = require('pdfmake');
						var printer = new PdfPrinter(fonts);
						// Código QR
						var greeting = ventaObj.idVenta;
						var url = 'http://pdfmake.org';
						var longText = 'The amount of data that can be stored in the QR code symbol depends on the datatype (mode, or input character set), version (1, …, 40, indicating the overall dimensions of the symbol), and error correction level. The maximum storage capacities occur for 40-L symbols (version 40, error correction level L):'

						// Estilizando las cantidades
						let opts = { format: '%s%v', symbol: '$' }

						// Construyendo dinamicamente la tabla de pedidos de la venta
						var pedidosData = [];
						let cPedidos = 0;
						for(var pedidoIndex in ventaObj.pedidos) {
							let producto = ventaObj.pedidos[pedidoIndex].producto
							let cant = ventaObj.pedidos[pedidoIndex].cantidad
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

						let impTotal = formatCurrency(ventaObj.importeT, opts)
						let impCourtesy = formatCurrency(ventaObj.importeC, opts)
						let dateString = moment.unix(ventaObj.fecha).format("DD/MM/YYYY");
						let hourString = moment.unix(ventaObj.fecha).utcOffset("-05:00").format("HH:mm:ss");
						// console.log("hora correcta", moment.unix(ventaObj.fecha).utcOffset("-05:00"))
						let heightt = Number(cPedidos) * 20 + 180;

						var docDefinition = {
						  pageSize: { width: 80, height: heightt},
						  pageMargins: [ 8, 10, 8, 10 ],
						  content: [
						    {
						      image: './media/logo.png',
						      width: 70,
						      margin: [0, 0, 0, 3]
						    },
						    { text: 'Av Benito Juárez 804, Centro, 42000 Pachuca de Soto, Hgo.', fontSize: 3},
						    { text: 'Pan La Villita S.A. de C.V.', fontSize: 3, margin: [16, 3, 0, 0] },
						    { text: `Ticket: ${ventaObj.idVenta}`, fontSize: 3, margin: [0, 2, 0, 0] },
						    { text: `Fecha: ${dateString}`, fontSize: 3, margin: [0, 2, 0, 0] },
						    { text: `Hora: ${hourString}`, fontSize: 3, margin: [0, 2, 0, 0] },
						    { text: `Sucursal: ${ventaObj.nombreSucursal}`, fontSize: 3, margin: [0, 2, 0, 0] },
						    { text: `Atendió: ${ventaObj.nombreVendedor}`, fontSize: 3, margin: [0, 2, 0, 2] },
						      table(pedidosData)
						    ,
									hasCourtesy()
								,
						    { text: `TOTAL ${impTotal}`, fontSize: 4, margin: [40, 3, 0, 0] },
						    {qr: greeting, fit: 50, margin: [10, 3, 0, 0]},
						    { text: 'Prueba nuestros pedidos online en:', fontSize: 3, margin: [9, 5, 0, 0] },
						    { text: 'panlavillita.mx', fontSize: 3, margin: [23, 2, 0, 0] }
						  ],
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
						};

						var pdfDoc = printer.createPdfKitDocument(docDefinition);
						pdfDoc.end();
						// Checa estas lineas brow
						const myPdfFile = admin.storage().bucket().file(`/ticket-ventas/${ventaObj.idVenta}/venta-${ventaObj.idVenta}.pdf`);
						const stream = pdfDoc.pipe(myPdfFile.createWriteStream());

						const gcs = require('@google-cloud/storage')({keyFilename: './config/service_accounts/admin.json'});
						const bucket = gcs.bucket('panlavillita-dev.appspot.com');
						const file = bucket.file(`/ticket-ventas/${ventaObj.idVenta}/venta-${ventaObj.idVenta}.pdf`);
						return file.getSignedUrl({
						  action: 'read',
						  expires: '03-09-2491'
						}).then((signedUrls) => {
						  // signedUrls[0] contains the file's public URL
						  //console.log(signedUrls[0]);
						  db.ref(`venta/${ventaObj.idVenta}`).update({
						  	ticketUrl: signedUrls[0]
						  });
						  console.log("Venta procesada")
						  return true;
						});
					})
				})
			})
		})
	})
});
