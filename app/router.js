import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('admin', function() {
    this.route('inv-produccion');
    this.route('compras');
    this.route('proveedores');
    this.route('nvo-proveedor');
    this.route('nvo-mprima');
    this.route('historial-compras');
    this.route('nva-compra');
    this.route('calendario');
    this.route('lista-mprima');
    this.route('nvo-reparto');
    this.route('historial-reparto');
    this.route('productos');
    this.route('distribuidos');
    this.route('recetas');
    this.route('nvo-distribuido');
    this.route('nvo-receta');
    this.route('inventario');
    this.route('produccion');
    this.route('nvo-produccion');
    this.route('lista-minimos');
    this.route('nvo-minimo');
    this.route('especiales');
    this.route('cortes');
    this.route('sucursales');
    this.route('nvo-sucursal');
    this.route('reparto', {path: "/reparto/:id"});
    this.route('historial-produccion');
    this.route('edit-receta', {path: "/receta/:id"});
    this.route('edit-distribuido', {path: "/distribuido/:id"});
    this.route('edit-proveedor', {path: "/proveedor/:id"});
    this.route('edit-mprima', {path: "/m-prima/:id"});
    this.route('finanzas');
    this.route('retiros');
    this.route('personal');
    this.route('nvo-paselista');
    this.route('edit-paselista', {path: "/pase-lista/:id"});
  });

  this.route('cliente', function() {
    this.route('perfil');
    this.route('historial-compras');
    this.route('especiales');
  });

  this.route('dueno', function() {
    this.route('finanzas');
    this.route('reportes');
    this.route('retiros');
    this.route('nvo-retiro');
    this.route('grafica');
    this.route('cancelaciones');
    this.route('personal');
    this.route('cajeros');
    this.route('vendedores');
    this.route('administradores');
    this.route('nvo-vendedor');
    this.route('nvo-cajero');
    this.route('nvo-administrador');
    this.route('edit-administrador',{path: "/administrador/:id"});
    this.route('edit-cajero', {path: "/cajero/:id"});
    this.route('edit-vendedor', {path: "/vendedor/:id"});
  });

  this.route('vendedor', function(){
    this.route('/')
    this.route('procesando-venta', {path: "/:idventa"});
    this.route('venta', {path: "/venta/:idventa"});
    this.route('historial-venta');
  });
  this.route('nva-venta');
  this.route('nvo-especial');
  this.route('register');
  this.route('en');
  this.route('login');
  this.route('dir');
  this.route('cajero', function() {
    this.route('historial');
    this.route('corte');
    this.route('retiros');
  });

  this.route('controller', function() {});
});

export default Router;
