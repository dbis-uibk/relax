import {Calculator} from './Calculator'

global.calc_start = function () {
	// src: http://stackoverflow.com/a/2880929
	var urlParams;
	(window.onpopstate = function () {
		var match,
			pl = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) {
				return decodeURIComponent(s.replace(pl, " "));
			},
			query = window.location.search.substring(1);

		urlParams = {};
		while ((match = search.exec(query))) {
			urlParams[decode(match[1])] = decode(match[2]);
		}
	}).call();

	i18n.init({
		//resStore: resources,
		fallbackLng: 'en',
		//lng: 'de',
		debug: true,
		setJqueryExt: true,
		detectLngQS: 'lang', // ?lang=de
	}, function (t, err) {
		let calc = null;
		$(function () {
			calc = new Calculator({
				staticGroups: [
					{
						maintainerGroup: i18n.t('calc.maintainer-groups.misc'),
						maintainer: '',

						source: 'http',
						url: './resources/data/local_groups.txt'
					},
					{
						maintainerGroup: i18n.t('calc.maintainer-groups.uibk'),
						maintainer: '<a href="https://github.com/mtschu">mtschu</a>',

						source: 'gist',
						url: '2923a30a474fdcb46bee'
					},
					{
						maintainerGroup: i18n.t('calc.maintainer-groups.uibk'),
						maintainer: '<a href="https://gist.github.com/woolfg">Wolfgang Gassler</a>',

						source: 'gist',
						url: '7d1871f79a8bcb4788de'
					}
				]
			});

			$('body').i18n();

			if (!urlParams.data) {
				calc.loadStaticGroups(true);
			}
			else {
				try {
					// extract source and id
					var data = urlParams.data;
					var source, id, pos;

					if ((pos = data.indexOf(':')) == -1)
						throw new Error('data syntax is: ?data=source:id');

					source = data.substring(0, pos).toLowerCase();
					id = data.substring(pos + 1);

					if (source.length === 0)
						throw new Error('no source given; data syntax is: ?data=source:id');
					else if (id.length === 0)
						throw new Error('no id given; data syntax is: ?data=source:id');

					if (source === 'gist') {
						calc.loadGroupFromGist(id, true);
					}
					else {
						throw new Error('data source not supported');
					}


					calc.loadStaticGroups(false);
				}
				catch (e) {
					calc.displayAlertMsg(e.message);

					calc.loadStaticGroups(true);
				}
			}

			// start tour after 1 sec delay for all new visitors
			calc.startTourWhenNew(1000);
		});
	});
};