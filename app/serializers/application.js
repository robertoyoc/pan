import DS from 'ember-data';
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import FirebaseSerializer from 'emberfire/serializers/firebase';
// import FirebaseFlexSerializer from 'emberfire-utils/serializers/firebase-flex';

export default FirebaseSerializer.extend({
	session: service(),

	serialize(snapshot /*, options*/ ) {
        let json = this._super(...arguments);

		// const path = this._getPath(snapshot);
        debugger
		snapshot.record.constructor.eachComputedProperty((key, meta) => {
			if (get(meta, 'serialize')) {
                let prop = snapshot.record.get(key);
                debugger
				if (prop && prop.then) {
                    debugger
					prop = get(prop, 'content');
				}
				json[`${key}`] = prop;
				// json[`${path}/${key}`] = prop;
			}
		});
        debugger
		// json['user'] = this.get('session.currentUser.uid');

		return json;
	}
});
