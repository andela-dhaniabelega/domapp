global.$ = () => ({
	tabs: () => null,
	attr: () => null,
	sideNav: () => null,
	modal: () => null
});

global.tinymce = {
	remove: () => null,
	init: () => null,
	activeEditor: {
		getContent: () => null
	}
};

global.e = {
	target: {
		name: 'input',
		value: 'input'
	}
};

global._ = {
	forEach: () => null
};

global.swal = () => Promise.resolve(true);
