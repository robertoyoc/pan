import Route from '@ember/routing/route';

export default Route.extend({
	countries: [
    { name: 'United States',  flagUrl: '/flags/us.svg' },
    { name: 'Spain',          flagUrl: '/flags/es.svg' },
    { name: 'Portugal',       flagUrl: '/flags/pt.svg' },
    { name: 'Russia',         flagUrl: '/flags/ru.svg' },
    { name: 'Latvia',         flagUrl: '/flags/lv.svg' },
    { name: 'Brazil',         flagUrl: '/flags/br.svg' },
    { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
  ]
});
