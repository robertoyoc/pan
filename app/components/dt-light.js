import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty, isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import Table from 'ember-light-table';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  query: '',
  dir: 'asc',
  modelTable: 'null',

  isLoading: computed.or('fetchRecords.isRunning', 'setRows.isRunning').readOnly(),
  canLoadMore: true,
  enableSync: false,

  sortBy: computed('dir', 'sort', function() {
    return [`${this.get('sort')}:${this.get('dir')}`];
  }).readOnly(),
  sortedModel: computed.sort('model', 'sortBy'),

  init() {
    this._super(...arguments);

    let table = new Table(this.get('columns'), this.get('model'), { enableSync: this.get('enableSync') });
    let sortColumn = table.get('allColumns').findBy('valuePath', this.get('sort'));
    // Setup initial sort column
    if (sortColumn) {
      sortColumn.set('sorted', true);
    }
    this.set('modelTable', table);
  },

  // Filter Input Setup
  selectedFilter: computed.oneWay('possibleFilters.firstObject'),
  possibleFilters: computed('modelTable.columns', function() {
    return this.get('modelTable.columns').filterBy('sortable', true);
  }).readOnly(),

  fetchRecords : task(function*() {
    //this.set('isLoading', true);
    //this.get('modelTable').addRows(this.get('sortedModel'))
    yield this.get('filterAndSortModel').perform();
    //this.set('isLoading', false);
  }).on('init'),

  filterAndSortModel : task(function*(debounceMs = 200) {
    yield timeout(debounceMs); // debounce

    let query = this.get('query');
    let model = this.get('sortedModel');
    let valuePath = this.get('selectedFilter.valuePath');
    let result = model;

    if (!isBlank(query)) {
      result = model.filter((m) => {
        return m.get(valuePath).toString().toLowerCase().includes(query.toLowerCase());
      });
    }
    yield this.get('setRows').perform(result);
  }).restartable(),

  setRows: task(function*(rows) {
      this.get('modelTable').setRows([]);
      yield timeout(100); // Allows isLoading state to be shown
      this.get('modelTable').setRows(rows);
    }).restartable(),

  actions: {
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
        this.get('filterAndSortModel').perform(0);
      }
    },

    onSearchChange() {
      this.get('filterAndSortModel').perform();
    },

    edit(row){
      this.sendAction('performEdit', row.get('content'));
    },

    delete(row) {
			window.swal({
				title: 'Estás seguro?',
				text: this.get('deleteMessage'),
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
				this.sendAction('performDelete', row.get('content'));
			}).catch((error)=>{
				console.log(error)
			});
		},

    cancel(row){
      this.sendAction('performCancel', row.get('content'));
    }
  }

});
