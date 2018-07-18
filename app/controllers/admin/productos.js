import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Table from 'ember-light-table';
import { task } from 'ember-concurrency';

export default Controller.extend({
	currentUser: service(),
	store: service(),

	// DATA-TABLE
	columns: computed(function() {
    return [{
      label: 'Nombre',
      valuePath: 'producto.nombre',
    }, {
      label: 'Cantidad',
      valuePath: 'cantidad',
    }, {
      label: 'Precio',
      valuePath: 'producto.precio',
    }, {
      label: 'Acciones',
      valuePath: 'producto.precio',
			sortable: false,
    }];
  }),
	dir: 'asc',
	sort: 'producto.nombre',
	sortBy: computed('dir', 'sort', function() {
    return [`${this.get('sort')}:${this.get('dir')}`];
  }).readOnly(),

	isLoading: computed.oneWay('fetchRecords.isRunning'),
  canLoadMore: true,
  enableSync: true,

	sortedDistribuidos: computed.sort('model.distribuidos', 'sortBy'),
	sortedRecetas: computed.sort('model.recetas', 'sortBy'),

	tableDistribuidos: computed('model.distribuidos', function() {
		let table = new Table(this.get('columns'), this.get('sortedDistribuidos'));
    let sortColumn = table.get('allColumns').findBy('valuePath', this.get('sort'));
		// Setup initial sort column
		 if (sortColumn) {
			 sortColumn.set('sorted', true);
		 }
		 return table;
 	}),

	tableRecetas: computed('model.recetas', function() {
		let table = new Table(this.get('columns'), this.get('sortedRecetas'));
    let sortColumn = table.get('allColumns').findBy('valuePath', this.get('sort'));
		// Setup initial sort column
		 if (sortColumn) {
			 sortColumn.set('sorted', true);
		 }
		 return table;
 	}),

	fetchRecords(){
		this.set('isLoading', true);
		/*
		let context = this;
		let promiseRecords = new Promise(function (resolve, reject){
			context.filterEqual(context.store, 'existence', { 'tipo': 'distribuido', 'sucursalId': context.get('sucursal')}, function(distribuidos){
				return resolve(distribuidos)
			})
		})
		promiseRecords.then((records)=>{
			// ORDENAR LOS RECORDS
 			this.set('distribuidos', records);
			this.get(this.get('sortedDistribuidos'))
			debugger
			this.get('tableDistribuidos').addRows(this.get('sortedDistribuidos'));
			this.set('isLoading', false);
			this.set('canLoadMore', !isEmpty(records));
		})
		*/
		this.get('tableRecetas').addRows(this.get('sortedRecetas'))
		this.get('tableDistribuidos').addRows(this.get('sortedDistribuidos'))
		this.set('isLoading', false);
	},

	actions: {
		editReceta(producto) {
			this.transitionToRoute('admin.edit-receta', producto.get('id'))
		},

		editDistribuido(producto) {
			this.transitionToRoute('admin.edit-distribuido', producto.get('id'))
		},

		delete(existencia) {
			window.swal({
				title: 'Estás seguro?',
				text: 'Las existencias serán eliminadas',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminar',
				cancelButtonText: 'No',
				confirmButtonClass: 'confirm-class',
				cancelButtonClass: 'cancel-class',
				closeOnConfirm: false,
				closeOnCancel: false
			}).then(()=>{
				existencia.set('cantidad', 0);
				existencia.save();
				window.swal("Guardado", "Se han eliminado las existencias", "success")
			}).catch((error)=>{
				console.log(error)
			});
		},

		// DATA-TABLE
		onScrolledToBottom() {
      if (this.get('canLoadMore')) {
        this.incrementProperty('page');
        this.fetchRecords();
      }
    },

    onColumnClick(column) {
      if (column.sorted) {
        this.setProperties({
          dir: column.ascending ? 'asc' : 'desc',
          sort: column.get('valuePath'),
          page: 1
        });
        this.get('tableDistribuidos').setRows([]);
				this.fetchRecords();
      }
    },
		onColumnR(column) {
			debugger
			if (column.sorted) {
				this.setProperties({
					dir: column.ascending ? 'asc' : 'desc',
					sort: column.get('valuePath'),
					page: 1
				});
				this.get('tableRecetas').setRows([]);
				this.fetchRecords();
			}
		},



	}
});
