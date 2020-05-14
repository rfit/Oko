export default [
    {
		name: 'overview',
		path: '/'
	},
	{ name: 'login', path: '/login' },
	{
		name: 'add-invoice',
		path: '/add-invoice'
	},
	{
		name: 'edit-invoice',
		path: '/edit-invoice/:invoiceId'
	},
	{
		name: 'add-creditnote',
		path: '/add-creditnote'
	},
    {
		name: 'help',
		path: '/help'
	},
	{
		name: 'help-general',
		path: '/help/general'
	},
	{
		name: 'help-support',
		path: '/help/support'
	},
    {
		name: 'teamadminunits',
		path: '/team-admin/units'
	},
	{
		name: 'team-admin',
		path: '/team-admin'
	},
	{
		name: 'festival-overview',
		path: '/festival-overview'
	},
	{
		name: 'festival-iteration',
		path: '/festival-iteration'
	},
	{
		name: 'festival-teams',
		path: '/festival-teams'
		// path: '/festival-teams/:iteration' could be used to add new teams depending on iterations
	},
	{
		name: 'festival-overview-team',
		path: '/festival-overview/:teamId'
	},
	{
		name: 'styleguide',
		path: '/styleguide'
	}
];
