import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Table from 'ember-light-table';
import { task } from 'ember-concurrency';

export default Component.extend({
  dir: 'asc',
  sortBy: computed('dir', 'sort', function() {
    return [`${this.get('sort')}:${this.get('dir')}`];
  }).readOnly(),

  isLoading: computed.oneWay('fetchRecords.isRunning'),
  canLoadMore: true,
  enableSync: true,

  sortedModel: computed.sort('model', 'sortBy'),

  modelTable: computed('model', function() {
    let table = new Table(this.get('columns'), this.get('sortedModel'));
    let sortColumn = table.get('allColumns').findBy('valuePath', this.get('sort'));
    // Setup initial sort column
     if (sortColumn) {
       sortColumn.set('sorted', true);
     }
     return table;
  }),

  fetchRecords(){
    this.set('isLoading', true);
    this.get('modelTable').addRows(this.get('sortedModel'))
    this.set('isLoading', false);
  },

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
        this.get('modelTable').setRows([]);
        this.fetchRecords();
      }
    },
  }

});
