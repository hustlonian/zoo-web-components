document.getElementById('toast-summoner').onclick = () => {
	document.querySelector('#toast').show();
};
document.getElementById('modal-summoner').onclick = () => {
	document.querySelector('#modal').openModal();
};
document.getElementById('modal-closer').onclick = () => {
	document.body.querySelector('#modal').closeModal();
	document.body.querySelector('#modalToast').show();
};
let prevActiveBtn = document.getElementById('zoo-theme');

document.getElementById('zoo-theme').onclick = () => changeTheme('zoo');
document.getElementById('grey-theme').onclick = () => changeTheme('grey');
document.getElementById('random-theme').onclick = () => changeTheme('random');

const changeTheme = pallete => {
	prevActiveBtn.setAttribute('type', 'primary');
	let activeBtn = document.getElementById(`${pallete}-theme`);
	activeBtn.setAttribute('type', 'secondary');
	prevActiveBtn = activeBtn;
	switch (pallete) {
	case 'zoo':
		setColorVar('--primary-mid', '#3C9700');
		setColorVar('--primary-light', '#66B100');
		setColorVar('--primary-dark', '#286400');
		setColorVar('--primary-ultralight', '#EBF4E5');
		setColorVar('--secondary-mid', '#FF6200');
		setColorVar('--secondary-light', '#FF8800');
		setColorVar('--secondary-dark', '#CC4E00');
		setColorVar('--info-ultralight', '#ECF5FA');
		setColorVar('--info-mid', '#459FD0');
		break;
	case 'grey':
		setColorVar('--primary-mid', '#676778');
		setColorVar('--primary-light', '#838399');
		setColorVar('--primary-dark', '#565664');
		setColorVar('--primary-ultralight', '#d3d3e1');
		setColorVar('--secondary-mid', '#ff3e00');
		setColorVar('--secondary-light', '#fb7044');
		setColorVar('--secondary-dark', '#c53100');
		setColorVar('--info-ultralight', '#d8eefd');
		setColorVar('--info-mid', '#40b3ff');
		break;
	default:
		generateRandomTheme();
		break;
	}
};

const setColorVar = (name, value) => {
	document.documentElement.style.setProperty(name, value);
};

const generateRandomTheme = () => {
	const main = randomRgbaString();
	const mainHex = rgbToHex(main.r, main.g, main.b);
	setColorVar('--primary-mid', mainHex);
	setColorVar('--primary-light', lightenDarkenColor(mainHex, 30));
	setColorVar('--primary-dark', lightenDarkenColor(mainHex, -30));
	setColorVar('--primary-ultralight', lightenDarkenColor(mainHex, 60));
	const second = randomRgbaString();
	const secondHex = rgbToHex(second.r, second.g, second.b);
	setColorVar('--secondary-mid', rgbToHex(second.r, second.g, second.b));
	setColorVar('--secondary-light', lightenDarkenColor(secondHex, 30));
	setColorVar('--secondary-dark', lightenDarkenColor(secondHex, -30));
};

const randomRgbaString = () => {
	let r = Math.floor(Math.random() * 255);
	let g = Math.floor(Math.random() * 255);
	let b = Math.floor(Math.random() * 255);
	return {r: r, g: g, b: b};
};

const rgbToHex = (r, g, b) => {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const componentToHex = c => {
	let hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
};

const lightenDarkenColor = (col, amt) => {

	var usePound = false;

	if (col[0] == '#') {
		col = col.slice(1);
		usePound = true;
	}

	var num = parseInt(col,16);

	var r = (num >> 16) + amt;

	if (r > 255) r = 255;
	else if  (r < 0) r = 0;

	var b = ((num >> 8) & 0x00FF) + amt;

	if (b > 255) b = 255;
	else if  (b < 0) b = 0;

	var g = (num & 0x0000FF) + amt;

	if (g > 255) g = 255;
	else if (g < 0) g = 0;

	return (usePound?'#':'') + (g | (b << 8) | (r << 16)).toString(16);
};

const handleSortChange = sortState => {
	let toast = document.createElement('zoo-toast');
	toast.text = sortState 
		? 'Sort state was changed. Property: ' + sortState.property + ', direction: ' + sortState.direction
		: 'Sort state was changed. Sort object is undefined.';
	document.body.appendChild(toast);
	toast.show();
};

const handlePageChange = page => {
	let toast = document.createElement('zoo-toast');
	toast.text = 'Page was changed to: ' + page.pageNumber;
	document.body.appendChild(toast);
	toast.show();
};

document.querySelectorAll('zoo-grid').forEach(grid => {
	grid.addEventListener('sortChange', e => handleSortChange(e.detail));
	grid.addEventListener('pageChange', e => handlePageChange(e.detail));
});

let today = new Date().toISOString().substr(0, 10);
let data = [
	{createdDate: today, status: 'READY', maxWeight: '10 kg', deliveryDate: today, noOfPieces: 5, price: '12 EUR'},
	{createdDate: today, status: 'DELIVERED', maxWeight: '10 kg', deliveryDate: today, noOfPieces: 5, price: '12 EUR'},
	{createdDate: today, status: 'READY', maxWeight: '10 kg', deliveryDate: today, noOfPieces: 5, price: '12 EUR'},
	{createdDate: today, status: 'DELIVERED', maxWeight: '10 kg', deliveryDate: today, noOfPieces: 5, price: '12 EUR'},
	{createdDate: today, status: 'READY', maxWeight: '10 kg', deliveryDate: today, noOfPieces: 5, price: '12 EUR'}
];

const getRow = (d, i, template) => {
	const clone = template.cloneNode(true);
	const row = clone.children[0];
	// valid
	const chkbx = document.querySelector('#valid-checkbox').content.cloneNode(true);
	const input = chkbx.querySelector('input');
	if (d.status !== 'DELIVERED') {
		input.setAttribute('disabled', true);
	}
	input.setAttribute('id', `${i}-checkbox`);
	chkbx.querySelector('label').setAttribute('for', `${i}-checkbox`);
	row.appendChild(chkbx);

	// created date
	const createdDate = document.createElement('div');
	createdDate.innerHTML = d.createdDate;
	row.appendChild(createdDate);

	// status
	const selectTmpl = document.querySelector('#status-select').content.cloneNode(true);
	const select = selectTmpl.querySelector('select');
	if (d.status !== 'DELIVERED') {
		select.setAttribute('disabled', true);
	}
	row.appendChild(selectTmpl);

	// max weight
	const maxWeight = document.createElement('div');
	maxWeight.innerHTML = d.maxWeight;
	row.appendChild(maxWeight);

	// deliveryDate
	const deliveryDate = document.createElement('div');
	deliveryDate.innerHTML = d.deliveryDate;
	row.appendChild(deliveryDate);

	// noOfPieces
	const noOfPieces = document.createElement('div');
	noOfPieces.innerHTML = d.noOfPieces;
	row.appendChild(noOfPieces);

	// price
	const price = document.createElement('div');
	price.innerHTML = d.price;
	row.appendChild(price);

	return clone;
};

const grids = document.querySelectorAll('zoo-grid');
data.forEach((d, i) => {
	const simpleRow = document.querySelector('#simple-row').content;
	let idx = 0;
	for (const grid of grids) {
		const clone = getRow(d, i, simpleRow);
		grid.appendChild(clone);
		if (idx == 0) grid.setAttribute('resizable', true);
		idx++;
	}
});
