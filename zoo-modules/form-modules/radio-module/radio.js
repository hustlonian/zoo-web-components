import AbstractControl from '../abstractControl';

class Radio extends AbstractControl {
	constructor() {
		super();
		let shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `${this.getStyle()}${this.getHTML()}`;
	}
	static get observedAttributes() {
		return ['labeltext', 'inputerrormsg', 'infotext', 'invalid'];
	}
	
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (Radio.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(oldVal, newVal);
			} else {
				console.warn('no handler for ' + attrName)
			}
		}
	}

	getStyle() {
		return `
		<style>
		:host {
			display: flex;
			flex-direction: column;
		}
	
		slot {
			display: flex;
			padding: 11px 0;
			font-size: 14px;
			line-height: 20px;
		}
	
		::slotted(input[type="radio"]) {
			position: relative;
			border: 1px solid #767676;
			border-color: var(--primary-mid, #3C9700);
			min-width: 24px;
			height: 24px;
			border-radius: 50%;
			margin: 0 2px 0 0;
			padding: 3px;
			background-clip: content-box;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			outline: none;
			cursor: pointer;
		}
	
		::slotted(input[type="radio"]:focus) {
			border-width: 2px;
		}
	
		::slotted(input[type="radio"]:checked) {
			background-color: var(--primary-mid, #3C9700);
		}
	
		::slotted(input[type="radio"]:disabled) {
			cursor: not-allowed;
			border-color: #767676;
			background-color: #E6E6E6;
		}
	
		:host([invalid]) ::slotted(input[type="radio"]:checked) {
			background-color: var(--warning-mid, #ED1C24);
		}
	
		:host([invalid]) ::slotted(input[type="radio"]) {
			border-color: var(--warning-mid, #ED1C24);
		}
	
		::slotted(label) {
			cursor: pointer;
			margin: 0 5px;
			align-self: center;
		}
	
		:host([invalid]) ::slotted(label) {
			color: var(--warning-mid, #ED1C24);
		}
		</style>`;
	}

	getHTML() {
		return `
		<zoo-input-label {labeltext}></zoo-input-label>
		<slot></slot>
		<zoo-input-info></zoo-input-info>`;
	}
}
window.customElements.define('zoo-radio', Radio);