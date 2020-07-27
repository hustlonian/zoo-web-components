/**
 * @injectHTML
 */
class InputInfo extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;flex-direction:column}.error,.info{padding:0 2px 2px 0;font-size:12px;line-height:16px;color:#555;display:none;align-items:center}:host([infotext]) .info,:host([invalid]) .error{display:flex}svg{padding-right:5px}.info svg path{fill:var(--info-mid,#459fd0)}.error svg path{fill:var(--warning-mid,#ed1c24)}</style><div class="info"><span></span></div><div class="error"><span></span></div><template id="icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 15.75a1.125 1.125 0 11.001 2.25A1.125 1.125 0 0112 15.75zm.75-2.25a.75.75 0 11-1.5 0V5.25a.75.75 0 111.5 0v8.25zm7.205-9.455l.53-.53c4.687 4.686 4.687 12.284 0 16.97-4.686 4.687-12.284 4.687-16.97 0-4.687-4.686-4.687-12.284 0-16.97 4.686-4.687 12.284-4.687 16.97 0l-.53.53zm0 0l-.53.53c-4.1-4.1-10.75-4.1-14.85 0s-4.1 10.75 0 14.85 10.75 4.1 14.85 0 4.1-10.75 0-14.85l.53-.53z"/></svg></template>`;
	}

	static get observedAttributes() {
		return ['infotext', 'inputerrormsg'];
	}

	handleInfo(newVal) {
		if (newVal) this.shadowRoot.querySelector('.info span').innerHTML = newVal;
	}

	get infotext() {
		return this.getAttribute('infotext');
	}

	set infotext(text) {
		this.setAttribute('infotext', text);
		this.handleInfo(this.infotext, text);
	}

	get invalid() {
		return this.hasAttribute('invalid');
	}

	set invalid(invalid) {
		if (invalid) {
			this.setAttribute('invalid', '');
		} else {
			this.removeAttribute('invalid');
		}
	}

	handleErrorMsg(newVal) {
		const span = this.shadowRoot.querySelector('.error span');
		if (newVal) {
			span.innerHTML = newVal;
		} else {
			span.innerHTML = '';
		}
	}

	get inputerrormsg() {
		return this.getAttribute('inputerrormsg');
	}

	set inputerrormsg(msg) {
		this.setAttribute('inputerrormsg', msg);
		this.handleErrorMsg(this.inputerrormsg, msg);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		switch(attrName) {
			case 'infotext':
				this.handleInfo(newVal);
				break;
			case 'inputerrormsg':
				this.handleErrorMsg(newVal);
				break;
		}
	}

	connectedCallback() {
		const sr = this.shadowRoot;
		const icon = sr.querySelector('#icon').content;
		sr.querySelector('.info').prepend(icon.cloneNode(true));
		sr.querySelector('.error').prepend(icon.cloneNode(true));
	}
}
window.customElements.define('zoo-input-info', InputInfo);

/**
 * @injectHTML
 */
class InputLabel extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>label{font-size:14px;line-height:20px;font-weight:800;color:#555;text-align:left}</style><label></label>`;
	}

	static get observedAttributes() {
		return ['labeltext'];
	}

	handleLabel(newVal) {
		const label = this.shadowRoot.querySelector('label');
		if (newVal) {
			label.innerHTML = newVal;
		} else {
			label.innerHTML = '';
		}
	}

	get labeltext() {
		return this.getAttribute('labeltext');
	}

	set labeltext(text) {
		this.setAttribute('labeltext', text);
		this.handleLabel(this.labeltext, text);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if(attrName == 'labeltext') this.handleLabel(newVal);
	}
}
window.customElements.define('zoo-input-label', InputLabel);

class AbstractControl extends HTMLElement {
	
	constructor() {
		super();
		this.handlersMap = new Map();
		this.handlersMap.set('labeltext', this.handleLabel.bind(this));
		this.handlersMap.set('linktext', this.handleLinkText.bind(this));
		this.handlersMap.set('linkhref', this.handleLinkHref.bind(this));
		this.handlersMap.set('linktarget', this.handleLinkTarget.bind(this));
		this.handlersMap.set('infotext', this.handleInfo.bind(this));
		this.handlersMap.set('invalid', this.handleInvalid.bind(this));
		this.handlersMap.set('inputerrormsg', this.handleErrorMsg.bind(this));
	}

	handleLabel(newVal, target) {
		target = target || 'zoo-input-label';
		const label = this.shadowRoot.querySelector(target);
		if (newVal) {
			label.setAttribute('labeltext', newVal);
		} else {
			label.removeAttribute('labeltext');
		}
	}

	get labeltext() {
		return this.getAttribute('labeltext');
	}

	set labeltext(text) {
		this.setAttribute('labeltext', text);
		this.handleLabel(text);
	}

	handleInfo(newVal, target) {
		target = target || 'zoo-input-info';
		const info = this.shadowRoot.querySelector(target);
		if (newVal) {
			info.setAttribute('infotext', newVal);
		} else {
			info.removeAttribute('infotext');
		}
	}

	get infotext() {
		return this.getAttribute('infotext');
	}

	set infotext(text) {
		this.setAttribute('infotext', text);
		this.handleInfo(text);
	}

	handleInvalid(newVal, target) {
		target = target || 'zoo-input-info';
		const el = this.shadowRoot.querySelector(target);
		if (this.hasAttribute('invalid')) {
			el.setAttribute('invalid', '');
		} else {
			el.removeAttribute('invalid');
		}
	}
	get invalid() {
		return this.hasAttribute('invalid');
	}
	set invalid(invalid) {
		if (invalid) {
			this.setAttribute('invalid', '');
		} else {
			this.removeAttribute('invalid');
		}
		this.handleInvalid(invalid);
	}
	handleErrorMsg(newVal, target) {
		target = target || 'zoo-input-info';
		const el = this.shadowRoot.querySelector(target);
		if (newVal) {
			el.setAttribute('inputerrormsg', newVal);
		} else {
			el.removeAttribute('inputerrormsg');
		}
	}

	get inputerrormsg() {
		return this.getAttribute('inputerrormsg');
	}

	set inputerrormsg(msg) {
		this.setAttribute('inputerrormsg', msg);
		this.handleErrorMsg(msg);
	}

	handleLinkText(newVal, target) {
		const prop = target ? 'linktext' : 'innerHTML';
		target = target || 'a';
		const el = this.shadowRoot.querySelector(target);
		if (newVal) {
			el[prop] = newVal;
		} else {
			el[prop] = '';
		}
	}
	get linktext() {
		return this.getAttribute('linktext');
	}
	set linktext(msg) {
		this.setAttribute('linktext', msg);
		this.handleLinkText(msg);
	}

	handleLinkHref(newVal, target) {
		target = target || 'a';
		const el = this.shadowRoot.querySelector(target);
		if (newVal) {
			el.setAttribute('href', newVal);
		} else {
			el.removeAttribute('href');
		}
	}
	get linkhref() {
		return this.getAttribute('linkhref');
	}
	set linkhref(href) {
		this.setAttribute('linkhref', href);
		this.handleLinkHref(href);
	}

	handleLinkTarget(newVal, target) {
		target = target || 'a';
		const el = this.shadowRoot.querySelector(target);
		if (newVal) {
			el.setAttribute('target', newVal);
		} else {
			el.target = 'about:blank';
		}
	}
	get linktarget() {
		return this.getAttribute('linktarget');
	}
	set linktarget(target) {
		this.setAttribute('linktarget', target);
		this.handleLinkTarget(target);
	}
}

/**
 * @injectHTML
 */
class Input extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>a,zoo-input-info{display:var(--additional-elements-display, 'initial')}a,a:active,a:focus,a:hover{color:var(--primary-dark,#286400)}:host{display:grid;grid-gap:3px 0;width:100%;height:max-content}svg{position:absolute;right:15px;top:15px;color:var(--warning-mid,#ed1c24);pointer-events:none;opacity:0}svg path{fill:var(--warning-mid,#ed1c24)}:host([invalid]) .input-wrap svg{opacity:1}::slotted(input),::slotted(textarea){width:100%;font-size:14px;line-height:20px;padding:13px 15px;margin:0;border:1px solid #767676;border-radius:var(--zoo-input-border-radius,5px);color:#555;outline:0;box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;background:#fff}:host([invalid]) .input-wrap ::slotted(input),:host([invalid]) .input-wrap ::slotted(textarea){border:2px solid var(--warning-mid,#ed1c24);padding:12px 14px}::slotted(input[type=date]),::slotted(input[type=time]){-webkit-min-logical-height:48px}::slotted(input::placeholder),::slotted(textarea::placeholder){color:#767676;opacity:1}::slotted(input:disabled),::slotted(textarea:disabled){border:1px solid #e6e6e6;background-color:#f2f3f4;color:#767676;cursor:not-allowed}::slotted(input:focus),::slotted(textarea:focus){border:2px solid #555;padding:12px 14px}::slotted(label){grid-area:label;align-self:self-start;font-size:14px;line-height:20px;font-weight:800;color:#555;text-align:left}slot[name=inputlabel]{display:var(--additional-elements-display, 'flex');grid-row:1;align-self:flex-start}.input-wrap{flex:1;position:relative}.content{display:flex;justify-content:stretch;position:relative;grid-row:2;grid-column:span 2;flex:1}::slotted(zoo-button){margin-left:-5px;--zoo-btn-border-radius:0 5px 5px 0}zoo-input-info{grid-row:3;grid-column:span 2}a{text-align:right;text-decoration:none;font-size:12px;line-height:16px;justify-self:flex-end;align-self:center;grid-row:1}a:visited{color:var(--primary-mid,#3c9700)}</style><slot name="inputlabel"><zoo-input-label></zoo-input-label></slot><a></a><div class="content"><div class="input-wrap"><slot name="inputelement"></slot><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 15.75a1.125 1.125 0 11.001 2.25A1.125 1.125 0 0112 15.75zm.75-2.25a.75.75 0 11-1.5 0V5.25a.75.75 0 111.5 0v8.25zm7.205-9.455l.53-.53c4.687 4.686 4.687 12.284 0 16.97-4.686 4.687-12.284 4.687-16.97 0-4.687-4.686-4.687-12.284 0-16.97 4.686-4.687 12.284-4.687 16.97 0l-.53.53zm0 0l-.53.53c-4.1-4.1-10.75-4.1-14.85 0s-4.1 10.75 0 14.85 10.75 4.1 14.85 0 4.1-10.75 0-14.85l.53-.53z"/></svg></div><slot name="button"></slot></div><zoo-input-info></zoo-input-info>`;
	}
	static get observedAttributes() {
		return ['labeltext', 'linktext', 'linkhref', 'linktarget', 'inputerrormsg', 'infotext', 'invalid'];
	}
	
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (Input.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(newVal);
			}
		}
	}
}
window.customElements.define('zoo-input', Input);

/**
 * @injectHTML
 */
class Checkbox extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;flex-direction:column;width:100%;font-size:14px;line-height:20px}.checkbox{display:flex;width:100%;box-sizing:border-box;cursor:pointer}::slotted(label){display:flex;align-items:center;cursor:pointer}:host([highlighted]) .checkbox{border:1px solid #e6e6e6;border-radius:5px;padding:11px 15px}:host([disabled]) .checkbox,:host([disabled]) ::slotted(label){cursor:not-allowed}:host([highlighted]) .checkbox.clicked{border:2px solid var(--primary-mid,#3c9700)}:host([highlighted][invalid]) .checkbox{border:2px solid var(--warning-mid,#ed1c24)}label{display:flex;align-items:center}zoo-input-info{display:flex;align-self:flex-start;margin-top:2px}::slotted(input[type=checkbox]){position:relative;display:flex;min-width:24px;height:24px;border-radius:3px;border:1px solid #767676;margin:0 10px 0 0;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:0;cursor:pointer}::slotted(input[type=checkbox]:focus){border-width:2px}::slotted(input[type=checkbox]:disabled){border-color:#e6e6e6;background-color:#f2f3f4;cursor:not-allowed}.check{display:none;position:absolute;margin:1px}.clicked .check{display:flex;fill:var(--primary-mid,#3c9700)}.clicked ::slotted(input[type=checkbox]){border:1px solid var(--primary-mid,#3c9700)}:host([disabled]) .check{fill:#767676}:host([invalid]) .check{fill:var(--warning-mid,#ed1c24)}:host([invalid]) ::slotted(input[type=checkbox]),:host([invalid]) ::slotted(input[type=checkbox]:checked){border-color:var(--warning-mid,#ed1c24)}</style><div class="checkbox"><slot name="checkboxelement"></slot><svg class="check" viewBox="0 0 24 24" width="22" height="22"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg><slot name="checkboxlabel"><label></label></slot></div><zoo-input-info></zoo-input-info>`;
	}

	static get observedAttributes() {
		return ['labeltext', 'infotext', 'invalid', 'inputerrormsg'];
	}

	get highlighted() {
		return this.hasAttribute('highlighted');
	}

	set highlighted(highlighted) {
		if (highlighted) {
			this.setAttribute('highlighted', '');
		} else {
			this.removeAttribute('highlighted');
		}
	}

	handleLabel(newVal) {
		const label = this.shadowRoot.querySelector('label');
		if (label) label.innerHTML = newVal;
	}

	get labeltext() {
		return this.getAttribute('labeltext');
	}

	set labeltext(text) {
		this.setAttribute('labeltext', text);
		this.handleLabel(this.labeltext, text);
	}

	handleCheckboxClick(checkbox, box) {
		if (checkbox.checked) {
			checkbox.setAttribute('checked', '');
			box.classList.add('clicked');
		} else {
			checkbox.removeAttribute('checked');
			box.classList.remove('clicked');
		}
	}

	mutationCallback(mutationsList, observer) {
		for(let mutation of mutationsList) {
			if (mutation.type === 'attributes') {
				if (mutation.attributeName == 'disabled') {
					if (mutation.target.disabled) {
						this.shadowRoot.host.setAttribute('disabled', '');
					} else {
						this.shadowRoot.host.removeAttribute('disabled');
					}
				}
				if (mutation.attributeName == 'checked') {
					const box = this.shadowRoot.querySelector('.checkbox');
					if (mutation.target.hasAttribute('checked')) {
						box.classList.add('clicked');
					} else {
						box.classList.remove('clicked');
					}
				}
			}
		}
	}

	connectedCallback() {
		const config = { attributes: true, childList: false, subtree: false };
		Checkbox.observedAttributes.forEach(a => this.attributeChangedCallback(a, this[a], this[a]));
		const checkboxSlot = this.shadowRoot.querySelector('slot[name="checkboxelement"]');
		const box = this.shadowRoot.querySelector('.checkbox');
		const label = this.shadowRoot.querySelector('slot[name="checkboxlabel"]').assignedNodes()[0];
		let checkbox;
		checkboxSlot.addEventListener('slotchange', () => {
			this.observer = new MutationObserver(this.mutationCallback.bind(this));
			checkbox = checkboxSlot.assignedNodes()[0];
			if (checkbox.disabled) this.shadowRoot.host.setAttribute('disabled', '');
			this.observer.disconnect();
			this.observer.observe(checkbox, config);
			this.handleCheckboxClick(checkbox, box);
		});
		box.addEventListener('click', e => {
			// browser should handle it
			if (e.target == label) {
				this.handleCheckboxClick(checkbox, box);
				return;
			}
			// replicate browser behaviour
			if (checkbox.disabled) {
				e.preventDefault();
				return;
			}
			if (e.target != checkbox) {
				checkbox.checked = !!!checkbox.checked;
				checkbox.dispatchEvent(new Event('change'));
			}
			this.handleCheckboxClick(checkbox, box);
		});
	}

	// Fires when an instance was removed from the document
	disconnectedCallback() {
		this.observer.disconnect();
		this.observer = null;
	}

	// Fires when an attribute was added, removed, or updated
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'labeltext') {
			this.handleLabel(newVal);
		} else if (Checkbox.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(newVal);
			}
		}
	}
}
window.customElements.define('zoo-checkbox', Checkbox);

/**
 * @injectHTML
 */
class Radio extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;flex-direction:column}slot{display:flex;padding:11px 0;font-size:14px;line-height:20px}::slotted(input[type=radio]){position:relative;border:1px solid #767676;border-color:var(--primary-mid,#3c9700);min-width:24px;height:24px;border-radius:50%;margin:0 2px 0 0;padding:3px;background-clip:content-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:0;cursor:pointer}::slotted(input[type=radio]:focus){border-width:2px}::slotted(input[type=radio]:checked){background-color:var(--primary-mid,#3c9700)}::slotted(input[type=radio]:disabled){cursor:not-allowed;border-color:#767676;background-color:#e6e6e6}:host([invalid]) ::slotted(input[type=radio]:checked){background-color:var(--warning-mid,#ed1c24)}:host([invalid]) ::slotted(input[type=radio]){border-color:var(--warning-mid,#ed1c24)}::slotted(label){cursor:pointer;margin:0 5px;align-self:center}:host([invalid]) ::slotted(label){color:var(--warning-mid,#ed1c24)}</style><zoo-input-label></zoo-input-label><slot></slot><zoo-input-info></zoo-input-info>`;
	}
	static get observedAttributes() {
		return ['labeltext', 'inputerrormsg', 'infotext', 'invalid'];
	}
	
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (Radio.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(newVal);
			}
		}
	}
}
window.customElements.define('zoo-radio', Radio);

/**
 * @injectHTML
 */
class Select extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>a,a:active,a:focus,a:hover{color:var(--primary-dark,#286400)}:host{display:grid;grid-gap:3px 0;width:100%;height:max-content;box-sizing:border-box}.arrows,.close{position:absolute;right:10px;top:12px}.close{cursor:pointer;right:11px;top:14px;display:none}.arrows{pointer-events:none}.arrows path{fill:var(--primary-mid,#3c9700)}:host([invalid]) .arrows path{fill:var(--warning-mid,#ed1c24)}:host([disabled]) .arrows path{fill:#e6e6e6}:host([valueselected]) .close{display:flex}:host([valueselected]) .arrows{display:none}::slotted(select){-webkit-appearance:none;-moz-appearance:none;width:100%;background:#fff;font-size:14px;line-height:20px;padding:13px 25px 13px 15px;border:1px solid #767676;border-radius:5px;color:#555;outline:0;box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}::slotted(select:disabled){border:1px solid #e6e6e6;background-color:#f2f3f4;color:#767676}::slotted(select:disabled:hover){cursor:not-allowed}::slotted(select:focus){border:2px solid #555;padding:12px 24px 12px 14px}:host([invalid]) ::slotted(select){border:2px solid var(--warning-mid,#ed1c24);padding:12px 24px 12px 14px}::slotted(label){font-size:14px;line-height:20px;font-weight:800;color:#555;text-align:left}slot[name=selectlabel]{grid-row:1;align-self:flex-start;display:flex}.content{display:flex;justify-content:stretch;align-items:center;position:relative;grid-row:2;grid-column:span 2}::slotted(zoo-input){display:flex;margin-left:-5px;flex:1;--zoo-input-border-radius:0 5px 5px 0;--additional-elements-display:none}.select-wrap{position:relative;flex:1}zoo-input-info{grid-row:3;grid-column:span 2}:host([multiple]) svg{display:none}:host([multiple]) ::slotted(zoo-input){display:none}:host([labelposition=left]){grid-gap:0 3px}:host([labelposition=left]) slot[name=selectlabel]{grid-row:2;grid-column:1;height:100%;display:flex;align-items:center}:host([labelposition=left]) .content{grid-column:2;grid-row:2}a{text-align:right;text-decoration:none;font-size:12px;line-height:16px;justify-self:flex-end;align-self:center;grid-row:1}a:visited{color:var(--primary-mid,#3c9700)}:host([labelposition=left]) a{grid-column:span 2}</style><slot name="selectlabel"><zoo-input-label></zoo-input-label></slot><a></a><div class="content"><div class="select-wrap"><slot name="selectelement"></slot><svg class="close" width="21" height="21" viewBox="0 0 24 24"><path d="M19 6l-1-1-6 6-6-6-1 1 6 6-6 6 1 1 6-6 6 6 1-1-6-6z"/></svg> <svg class="arrows" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg></div><slot name="input"></slot></div><zoo-input-info></zoo-input-info>`;
	}
	static get observedAttributes() {
		return ['labelposition', 'labeltext', 'linktext', 'linkhref', 'linktarget', 'inputerrormsg', 'infotext', 'invalid', 'loading'];
	}
	get labelposition() {
		return this.getAttribute('labelposition');
	}
	set labelposition(position) {
		this.setAttribute('labelposition', position);
	}

	get loading() {
		return this.getAttribute('loading');
	}
	set loading(loading) {
		if (loading) {
			this.setAttribute('loading', loading);
		} else {
			this.removeAttribute('loading');
		}
		this.handleLoading(this.loading, loading);
	}
	handleLoading(newVal) {
		if (this.hasAttribute('loading')) {
			this.loader = this.loader || document.createElement('zoo-preloader');
			this.shadowRoot.querySelector('.select-wrap').appendChild(this.loader);
		} else {
			if (this.loader)
			this.loader.remove();
		}
	}

	handleInvalid(newVal, target) {
		target = target || 'zoo-input-info';
		const el = this.shadowRoot.querySelector(target);
		if (this.hasAttribute('invalid')) {
			el.setAttribute('invalid', '');
			if (this.input) this.input.setAttribute('invalid', '');
		} else {
			el.removeAttribute('invalid');
			if (this.input) this.input.removeAttribute('invalid');
		}
	}
	
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (Select.observedAttributes.includes(attrName)) {
			if (attrName == 'loading') {
				this.handleLoading(newVal);
			} else if (attrName == 'invalid') {
				this.handleInvalid(newVal);
			} else {
				const fn = this.handlersMap.get(attrName);
				if (fn) {
					fn(newVal);
				}
			}
		}
	}

	mutationCallback(mutationsList, observer) {
		for(let mutation of mutationsList) {
			if (mutation.type === 'attributes') {
				if (mutation.attributeName == 'disabled') {
					if (mutation.target.disabled) {
						this.shadowRoot.host.setAttribute('disabled', '');
					} else {
						this.shadowRoot.host.removeAttribute('disabled');
					}
				}
				if (mutation.attributeName == 'multiple') {
					if (mutation.target.multiple) {
						this.shadowRoot.host.setAttribute('multiple', '');
					} else {
						this.shadowRoot.host.removeAttribute('multiple');
					}
				}
			}
		}
	}

	connectedCallback() {
		const config = { attributes: true, childList: false, subtree: false };
		const selectSlot = this.shadowRoot.querySelector('slot[name="selectelement"]');
		let select;
		selectSlot.addEventListener('slotchange', () => {
			this.observer = new MutationObserver(this.mutationCallback.bind(this));
			select = selectSlot.assignedNodes()[0];
			if (select.multiple) this.shadowRoot.host.setAttribute('multiple', '');
			if (select.disabled) this.shadowRoot.host.setAttribute('disabled', '');
			select.addEventListener('change', () => {
				const valueSelected = select.value && !select.disabled;
				if (valueSelected) {
					this.shadowRoot.host.setAttribute('valueselected', '');
				} else {
					this.shadowRoot.host.removeAttribute('valueselected');
				}
			});
			this.observer.disconnect();
			this.observer.observe(select, config);
			this.shadowRoot.querySelector('.close').addEventListener('click', () => {
				select.value = null;
				select.dispatchEvent(new Event("change"));
			});
		});
		const inputSlot = this.shadowRoot.querySelector('slot[name="input"]');
		inputSlot.addEventListener('slotchange', () => {
			this.input = inputSlot.assignedNodes()[0];
		});
	}

	disconnectedCallback() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}
}
window.customElements.define('zoo-select', Select);

/**
 * @injectHTML
 */
class SearchableSelect extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>.close,zoo-tooltip{display:none}.box,:host{position:relative}.close{position:absolute;top:15px;right:14px;cursor:pointer;background:#fff;z-index:1}.box:focus zoo-tooltip,.box:hover zoo-tooltip,zoo-tooltip:focus,zoo-tooltip:hover{display:block}::slotted(select){-webkit-appearance:none;-moz-appearance:none;width:100%;background:#fff;padding:13px 15px;border:1px solid #767676;border-bottom-left-radius:3px;border-bottom-right-radius:3px;border-top:none;position:absolute;z-index:2;top:60px;font-size:14px;display:none}.box ::slotted(select){display:grid}.box.hidden ::slotted(select){display:none}.box input{padding:13px 25px 13px 15px}:host([invalid]) input{padding:12px 24px 12px 14px;border:2px solid var(--warning-mid,#ed1c24)}.box:focus-within ::slotted(select){border:2px solid #555;border-top:none;padding:12px 14px}:host([invalid]) ::slotted(select){border:2px solid var(--warning-mid,#ed1c24);border-top:none;padding:12px 14px}.box:focus-within input{border:2px solid #555;padding:12px 24px 12px 14px}::slotted(select:disabled){border:1px solid #e6e6e6;background-color:#f2f3f4;color:#767676}::slotted(select:disabled:hover){cursor:not-allowed}:host([valueselected]) .close{display:flex}zoo-input{display:grid}</style><div class="box"><zoo-input><input slot="inputelement" type="text"> <svg slot="inputelement" class="close" width="20" height="20" viewBox="0 0 24 24"><path d="M19 6l-1-1-6 6-6-6-1 1 6 6-6 6 1 1 6-6 6 6 1-1-6-6z"/></svg></zoo-input><slot name="selectelement"></slot></div>`;
		this.target = 'zoo-input';
	}
	static get observedAttributes() {
		return ['labeltext', 'linktext', 'linkhref', 'linktarget', 'inputerrormsg', 'infotext', 'invalid', 'loading', 'placeholder'];
	}
	set labeltext(text) {
		this.setAttribute('labeltext', text);
		this.handleLabel(text, this.target);
	}
	set linktext(text) {
		this.setAttribute('linktext', text);
		this.handleLinkText(text, this.target);
	}
	set linkhref(text) {
		this.setAttribute('linkhref', text);
		this.handleLinkHref(text, this.target);
	}
	set linktarget(text) {
		this.setAttribute('linktarget', text);
		this.handleLinkTarget(text, this.target);
	}
	set inputerrormsg(text) {
		this.setAttribute('inputerrormsg', text);
		this.handleErrorMsg(text, this.target);
	}
	set infotext(text) {
		this.setAttribute('infotext', text);
		this.handleInfo(text, this.target);
	}
	set invalid(invalid) {
		if (invalid) {
			this.setAttribute('invalid', '');
		} else {
			this.removeAttribute('invalid');
		}
		this.handleInvalid(invalid, this.target);
	}
	get placeholder() {
		return this.getAttribute('placeholder');
	}
	set placeholder(placeholder) {
		this.setAttribute('placeholder', placeholder);
		this.handlePlaceholder(placeholder);
	}

	handlePlaceholder(newVal) {
		const input = this.shadowRoot.querySelector('input');
		if (input) input.placeholder = newVal;
	}

	get loading() {
		return this.getAttribute('loading');
	}
	set loading(loading) {
		if (loading) {
			this.setAttribute('loading', loading);
		} else {
			this.removeAttribute('loading');
		}
		this.handleLoading(loading);
	}
	handleLoading(newVal) {
		if (this.hasAttribute('loading')) {
			this.loader = this.loader || document.createElement('zoo-preloader');
			this.loader.slot = 'inputelement';
			const input = this.shadowRoot.querySelector('zoo-input');
			if (input){
				input.appendChild(this.loader);
			}
		} else {
			if (this.loader) this.loader.remove();
		}
	}

	mutationCallback(mutationsList, observer) {
		for(let mutation of mutationsList) {
			if (mutation.type === 'attributes') {
				if (mutation.attributeName == 'disabled') {
					const input = this.shadowRoot.querySelector('input');
					input.disabled = mutation.target.disabled;
				}
			}
		}
	}

	connectedCallback() {
		this.input = this.shadowRoot.querySelector('input');
		const box = this.shadowRoot.querySelector('.box');
		box.classList.add('hidden');
		this.input.addEventListener('focus', () => box.classList.remove('hidden'));
		this.input.addEventListener('blur', event => {
			if (event.relatedTarget !== this.select) {
				this.hideSelectOptions();
			}
		});
		this.input.addEventListener('input', () => this.handleSearchChange());
		this.shadowRoot.querySelector('.close').addEventListener('click', () => this.handleCrossClick());
		this.observer = new MutationObserver(this.mutationCallback.bind(this));
		const selectSlot = this.shadowRoot.querySelector('slot[name="selectelement"]');
		selectSlot.addEventListener('slotchange', () => {
			this.select = selectSlot.assignedNodes()[0];
			this.select.addEventListener('blur', () => this.hideSelectOptions());
			this.select.addEventListener('change', () => this.handleOptionChange());
			this.select.addEventListener('change', e => e.target.value ? this.setAttribute('valueSelected', '') : this.removeAttribute('valueSelected'));
			this.select.addEventListener('keydown', e => {
				if (e.keyCode && e.keyCode === 13) handleOptionChange();
			});
			if (this.select.disabled && this.input) {
				this.input.disabled = true;
			}
			this.select.size = 4;
			this.observer.disconnect();
			this.observer.observe(this.select, { attributes: true, childList: false, subtree: false });
		});
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'loading') {
			this.handleLoading(newVal);
		} else if (attrName == 'placeholder') {
			this.handlePlaceholder(newVal);
		} else if (SearchableSelect.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(newVal, this.target);
			}
		}
	}

	handleSearchChange() {
		const inputVal = this.input.value.toLowerCase();
		const options = this.select.querySelectorAll('option');
		for (const option of options) {
			if (option.text.toLowerCase().indexOf(inputVal) > -1) option.style.display = 'block';
			else option.style.display = 'none';
		}
	};

	handleOptionChange() {
		if (!this.select) {
			return;
		}
		let inputValString = '';
		for (const selectedOpts of this.select.selectedOptions) {
			inputValString += selectedOpts.text + ', \n';
		}
		inputValString = inputValString.substr(0, inputValString.length - 3);
		const showTooltip = inputValString && inputValString.length > 0;
		if (this.input) {
			this.input.placeholder = showTooltip ? inputValString : this.placeholder;
		}
		if (showTooltip) {
			this.tooltip = this.tooltip || document.createElement('zoo-tooltip');
			this.tooltip.slot = 'inputelement';
			this.tooltip.position = 'right';
			this.tooltip.text = inputValString;
			this.shadowRoot.querySelector('zoo-input').appendChild(this.tooltip);
		} else if (this.tooltip) {
			this.tooltip.remove();
		}
		if (!this.select.multiple) this.hideSelectOptions();
	}

	hideSelectOptions() {
		this.shadowRoot.querySelector('.box').classList.add('hidden');
		if (this.input) {
			this.input.value = null;
		}
		const options = this.select.querySelectorAll('option');
		for (const option of options) {
			option.style.display = 'block';
		}
	}

	handleCrossClick() {
		this.select.value = null;
		this.select.dispatchEvent(new Event("change"));
	}
}
window.customElements.define('zoo-searchable-select', SearchableSelect);

/**
 * @injectHTML
 */
class Preloader extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{position:absolute;width:100%;height:100%;top:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2}.bounce{text-align:center}.bounce>div{width:10px;height:10px;background-color:#333;border-radius:100%;display:inline-block;animation:1.4s ease-in-out infinite both sk-bouncedelay}.bounce .bounce1{animation-delay:-.32s}.bounce .bounce2{animation-delay:-.16s}@keyframes sk-bouncedelay{0%,100%,80%{transform:scale(0)}40%{transform:scale(1)}}</style><div class="bounce"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`;
	}
}
window.customElements.define('zoo-preloader', Preloader);

/**
 * @injectHTML
 */
class QuantityControl extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>button,div{display:flex}:host{--input-length:1ch}svg line{stroke-width:1.5;stroke:#fff}div{height:36px}button{border-width:0;min-width:30px;background:var(--primary-mid,#3c9700);align-items:center;justify-content:center;padding:4px;cursor:pointer}button:first-child{border-radius:5px 0 0 5px}button:last-child{border-radius:0 5px 5px 0}button:disabled{background:#f2f3f4;cursor:not-allowed}button:disabled svg line{stroke:#767676}::slotted(input){width:var(--input-length);min-width:30px;font-size:14px;line-height:20px;margin:0;border:none;color:#555;outline:0;box-sizing:border-box;-moz-appearance:textfield;background:#fff;text-align:center}zoo-input-info{display:block;margin-top:2px}::slotted(label){align-self:self-start;font-size:14px;line-height:20px;font-weight:800;color:#555;text-align:left}</style><slot name="label"><zoo-input-label></zoo-input-label></slot><div><button type="button"><svg height="18" width="18"><line y1="9" x1="0" x2="18" y2="9"></line></svg></button><slot name="input"></slot><button type="button"><svg height="18" width="18"><line y1="0" x1="9" x2="9" y2="18"></line><line y1="9" x1="0" x2="18" y2="9"></line></svg></button></div><zoo-input-info></zoo-input-info>`;
	}

	setInputWidth() {
		const length = this.input.value ? this.input.value.length || 1 : 1;
		this.shadowRoot.host.style.setProperty('--input-length', length + 1 + 'ch');
	}

	handleClick(type, disabled) {
		if (disabled || !this.input) return;
		const step = this.input.step || 1;
		this.input.value = this.input.value ? this.input.value : 0;
		this.input.value -= type == 'a' ? -step : step;
		this.input.dispatchEvent(new Event('change'));
		this.setInputWidth();
	}

	connectedCallback() {
		const inputSlot = this.shadowRoot.querySelector('slot[name="input"]');
		this.shadowRoot.querySelectorAll('button').forEach((btn, i) => {
			if (i == 0) btn.addEventListener('click', () => this.handleClick('s', this.decreasedisabled));
			if (i == 1) btn.addEventListener('click', () => this.handleClick('a', this.increasedisabled));
		});
		inputSlot.addEventListener('slotchange', () => {
			this.input = this.shadowRoot.querySelector('slot[name="input"]').assignedNodes()[0];
			this.setInputWidth();
		});
	}

	static get observedAttributes() {
		return ['labeltext', 'infotext', 'inputerrormsg', 'invalid', 'decreasedisabled', 'increasedisabled'];
	}

	get decreasedisabled() {
		return this.hasAttribute('decreasedisabled');
	}
	set decreasedisabled(disabled) {
		this.setAttribute('decreasedisabled', disabled);
		this.handleDecreaseDisabled(this.increasedisabled, disabled);
	}
	handleDecreaseDisabled(newVal) {
		const btn = this.shadowRoot.querySelector('button');
		if (this.decreasedisabled) {
			btn.disabled = true;
		} else {
			btn.disabled = false;
		}
	}

	get increasedisabled() {
		return this.hasAttribute('increasedisabled');
	}
	set increasedisabled(disabled) {
		this.setAttribute('increasedisabled', disabled);
		this.handleIncreaseDisabled(this.increasedisabled, disabled);
	}
	handleIncreaseDisabled(newVal) {
		const btn = this.shadowRoot.querySelectorAll('button')[1];
		if (this.increasedisabled) {
			btn.disabled = true;
		} else {
			btn.disabled = false;
		}
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (QuantityControl.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(newVal);
			} else {
				switch (attrName) {
					case 'increasedisabled':
						this.handleIncreaseDisabled(newVal);
						break;
					case 'decreasedisabled':
						this.handleDecreaseDisabled(newVal);
						break;
				}
			}
		}
	}
}

window.customElements.define('zoo-quantity-control', QuantityControl);

/**
 * @injectHTML
 */
class ToggleSwitch extends AbstractControl {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{height:100%;width:100%}div{position:relative;height:17px;width:40px;background:#e6e6e6;border-radius:10px;border-width:0;cursor:pointer}::slotted(input[type=checkbox]){position:absolute;top:-6px;transition:transform .2s;transform:translateX(-30%);width:60%;height:24px;background:#fff;border:1px solid #e6e6e6;border-radius:50%;display:flex;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:0;cursor:pointer}::slotted(input[type=checkbox]:checked){transform:translateX(80%);left:initial;background:var(--primary-mid,#3c9700)}::slotted(input[type=checkbox]:focus){border:1px solid #767676}::slotted(input[type=checkbox]:disabled){background:#f2f3f4;cursor:not-allowed}::slotted(label){display:flex;font-size:14px;line-height:20px;font-weight:800;color:#555;text-align:left;margin-bottom:10px}zoo-input-info{display:flex;margin-top:8px}</style><slot name="label"><zoo-input-label></zoo-input-label></slot><div><slot name="input"></slot></div><zoo-input-info></zoo-input-info>`;
	}

	connectedCallback() {
		const inputSlot = this.shadowRoot.querySelector('slot[name="input"]');
		inputSlot.addEventListener('slotchange', () => {
			this.shadowRoot.host.addEventListener('keypress', e => {
				inputSlot.assignedNodes()[0].click();
			});
		});
		this.shadowRoot.querySelector('div').addEventListener('click', e => {
			if (e.target !== inputSlot.assignedNodes()[0]) {
				e.preventDefault();
				e.stopPropagation();
				inputSlot.assignedNodes()[0].click();
			}
		});
	}

	static get observedAttributes() {
		return ['labeltext', 'infotext'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (ToggleSwitch.observedAttributes.includes(attrName)) {
			const fn = this.handlersMap.get(attrName);
			if (fn) {
				fn(newVal);
			}
		}
	}
}

window.customElements.define('zoo-toggle-switch', ToggleSwitch);

/**
 * @injectHTML
 */
class Button extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;max-width:330px;min-height:36px;position:relative}::slotted(button){display:flex;align-items:center;justify-content:center;color:#fff;border:0;border-radius:var(--zoo-btn-border-radius,5px);cursor:pointer;width:100%;min-height:100%;font-size:14px;line-height:20px;font-weight:700;text-align:center;background:linear-gradient(to right,var(--primary-mid,#3c9700),var(--primary-light,#66b100))}::slotted(button:focus),::slotted(button:hover){background:var(--primary-mid,#3c9700)}::slotted(button:active){background:var(--primary-dark,#286400);transform:translateY(1px)}::slotted(button:disabled){background:#f2f3f4!important;color:#767676!important;border:1px solid #e6e6e6!important;cursor:not-allowed;transform:translateY(0)}:host([type=secondary]) ::slotted(button){background:linear-gradient(to right,var(--secondary-mid,#ff6200),var(--secondary-light,--int-secondary-light))}:host([type=secondary]) ::slotted(button:focus),:host([type=secondary]) ::slotted(button:hover){background:var(--secondary-mid,#ff6200)}:host([type=secondary]) ::slotted(button:active){background:var(--secondary-dark,#cc4e00)}:host([type=hollow]) ::slotted(button){border:2px solid var(--primary-mid,#3c9700);color:var(--primary-mid,#3c9700);background:0 0}:host([type=hollow]) ::slotted(button:active),:host([type=hollow]) ::slotted(button:focus),:host([type=hollow]) ::slotted(button:hover){color:#fff;background:var(--primary-mid,#3c9700)}:host([type=hollow]) ::slotted(button:active){background:var(--primary-dark,#286400)}:host([type=empty]) ::slotted(button){color:initial;background:0 0}:host([type=empty]) ::slotted(button:focus),:host([type=empty]) ::slotted(button:hover){background:#e6e6e6}:host([size=medium]){min-height:46px}</style><slot></slot>`;
	}

	static get observedAttributes() {
		return ['type', 'size'];
	}

	get type() {
		return this.getAttribute('type');
	}
	set type(type) {
		if (type) {
			this.setAttribute('type', type);
		} else {
			this.removeAttribute('type');
		}
	}
	get size() {
		return this.getAttribute('size');
	}
	set size(size) {
		if (size) {
			this.setAttribute('size', size);
		} else {
			this.removeAttribute('size');
		}
	}
}
window.customElements.define('zoo-button', Button);

/**
 * @injectHTML
 */
class SegmentedButtons extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;height:46px}div{display:flex;justify-content:space-between;width:100%;height:100%;border:1px solid;border-radius:5px;padding:2px}::slotted(zoo-button){display:inline-flex;flex-grow:1}::slotted(zoo-button[type=primary]){padding:0 2px}</style><div><slot></slot></div>`;
	}

	connectedCallback() {
		const slot = this.shadowRoot.querySelector('slot');
		slot.addEventListener('slotchange', () => {
			const buttons = slot.assignedNodes().filter(e => e.tagName === 'ZOO-BUTTON');
			for (const btn of buttons) {
				if (!btn.hasAttribute('type')) {
					btn.type = 'empty';
				}
				if (btn.type !== 'empty') {
					this.prevActiveBtn = btn;
				}
			}
			this.shadowRoot.host.addEventListener('click', e => {
				const btn = buttons.find(b => b.contains(e.target));
				if (btn) {
					if (this.prevActiveBtn) {
						this.prevActiveBtn.type = 'empty';
					}
					this.prevActiveBtn = btn;
					this.prevActiveBtn.type = 'primary';
				}
			});
		});
	}

}
window.customElements.define('zoo-segmented-buttons', SegmentedButtons);

/**
 * @injectHTML
 */
class Grid extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>.box,.header-row{min-width:inherit}:host{contain:layout}.box{position:relative;max-height:inherit;max-width:inherit;min-height:inherit}.loading-shade{display:none;position:absolute;left:0;top:0;right:0;bottom:56px;z-index:9998;align-items:center;justify-content:center;height:100%;background:rgba(0,0,0,.15);pointer-events:none}.header-row{font-weight:600;color:#555;box-sizing:border-box;z-index:1}.header-row,::slotted([slot=row]){display:grid;grid-template-columns:var(--grid-column-sizes,repeat(var(--grid-column-num),minmax(50px,1fr)));padding:5px 10px;border-bottom:1px solid rgba(0,0,0,.2);min-height:50px;font-size:14px;line-height:20px}::slotted([slot=row]){overflow:visible;align-items:center;box-sizing:border-box}:host([resizable]) .header-row,:host([resizable]) ::slotted([slot=row]){display:flex}::slotted([slot=headercell]){display:flex;align-items:center;flex-grow:1}:host([resizable]) ::slotted([slot=headercell]){overflow:auto;resize:horizontal;height:inherit}:host(.dragging) ::slotted([ondrop]){border-radius:3px;box-shadow:inset 0 0 1px 1px rgba(0,0,0,.1)}:host(.dragging) ::slotted(.drag-over){box-shadow:inset 0 0 1px 1px rgba(0,0,0,.4)}::slotted([slot=row][column]){align-items:center}:host([stickyheader]) .header-row{top:0;position:sticky;background:#fff}::slotted([slot=row]:nth-child(odd)){background:#f2f3f4}::slotted([slot=row]:focus),::slotted([slot=row]:hover){background:#e6e6e6}::slotted([slot=norecords]){color:var(--warning-dark,#bd161c);grid-column:span var(--grid-column-num);text-align:center;padding:10px 0}zoo-grid-paginator{display:grid;position:sticky;grid-column:span var(--grid-column-num);bottom:0;background:#fff}:host([loading]) .loading-shade{display:flex}</style><div class="box"><div class="loading-shade"><zoo-spinner></zoo-spinner></div><div class="header-row"><slot name="headercell"></slot></div><slot name="row"></slot><slot name="norecords"></slot><slot name="paginator"><zoo-grid-paginator><slot name="pagesizeselector" slot="pagesizeselector"></slot></zoo-grid-paginator></slot></div>`;
	}

	static get observedAttributes() {
		return ['currentpage', 'maxpages', 'loading', 'resizable', 'reorderable'];
	}
	get resizable() {
		return this.getAttribute('resizable');
	}
	set resizable(resizable) {
		if (resizable) {
			this.setAttribute('resizable', '');
		} else {
			this.removeAttribute('resizable');
		}
	}
	get reorderable() {
		return this.getAttribute('reorderable');
	}
	set reorderable(reorderable) {
		if (reorderable) {
			this.setAttribute('reorderable', '');
		} else {
			this.removeAttribute('reorderable');
		}
	}
	get maxpages() {
		return this.getAttribute('maxpages');
	}
	set maxpages(maxpages) {
		if (maxpages) {
			this.setAttribute('maxpages', maxpages);
		} else {
			this.removeAttribute('maxpages');
		}
	}
	get currentpage() {
		return this.getAttribute('currentpage');
	}
	set currentpage(currentpage) {
		if (currentpage) {
			this.setAttribute('currentpage', currentpage);
		} else {
			this.removeAttribute('currentpage');
		}
	}
	get loading() {
		return this.hasAttribute('loading');
	}
	set loading(loading) {
		if (loading) {
			this.setAttribute('loading', '');
		} else {
			this.removeAttribute('loading');
		}
	}

	connectedCallback() {
		const root = this.shadowRoot;
		const headerSlot = root.querySelector('slot[name="headercell"]');
		headerSlot.addEventListener('slotchange', this.debounce(() => {
			const headers = headerSlot.assignedNodes();
			this.style.setProperty('--grid-column-num', headers.length);
			this.handleHeaders(headers);
			if (this.hasAttribute('reorderable')) {
				this.handleDraggableHeaders();
			}
		}));
		root.querySelector('slot[name="row"]').addEventListener('slotchange', this.debounce(() => {
			this.assignColumnNumberToRows();
		}));
		root.querySelector('.box').addEventListener('sortChange', e => this.handleSortChange(e));
		const paginator = root.querySelector('zoo-grid-paginator');
		if (paginator) {
			paginator.addEventListener('pageChange', e => this.dispatchPageEvent(e));
		}
	}

	handleHeaders(headers) {
		let i = 1;
		for (let header of headers) {
			header.setAttribute('column', i);
			i++;
		}
	}

	assignColumnNumberToRows() {
		const allRows = this.shadowRoot.querySelector('slot[name="row"]').assignedNodes();
		for (const row of allRows) {
			let i = 1;
			const rowChildren = row.children;
			for (const child of rowChildren) {
				child.setAttribute('column', i);
				i++;
			}
		}
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'resizable') {
			if (this.hasAttribute('resizable')) {
				this.handleResizableHeaders();
			}
		}
		if (attrName == 'reorderable' && this.hasAttribute('reorderable')) {
			this.handleDraggableHeaders();
		}
		if (attrName == 'maxpages') {
			const paginator = this.shadowRoot.querySelector('zoo-grid-paginator');
			if (paginator) {
				paginator.maxpages = newVal;
			}
		}
		if (attrName == 'currentpage') {
			const paginator = this.shadowRoot.querySelector('zoo-grid-paginator');
			if (paginator) {
				paginator.currentpage = newVal;
			}
		}
	}
	handleResizableHeaders() {
		this.createResizeObserver();
		this.resizeObserver.disconnect();
		const headers = this.shadowRoot.querySelector('slot[name="headercell"]').assignedNodes();
		for (let header of headers) {
			this.resizeObserver.observe(header);
		}
	}
	createResizeObserver() {
		if (this.resizeObserver) return;
		this.resizeObserver = new ResizeObserver(this.debounce(entries => {
			const host = this.shadowRoot.host;
			for (const entry of entries) {
				const columnNum = entry.target.getAttribute('column');
				const rowColumns = host.querySelectorAll(`:scope > [slot="row"] > [column="${columnNum}"]`);
				const headerColumn = host.querySelector(`:scope > [column="${columnNum}"]`);
				if (!headerColumn) return;
				const elements = [...rowColumns, headerColumn];
				const width = entry.contentRect.width;
				
				for (const columnEl of elements) {
					columnEl.style.width = `${width}px`;
				}
			}
		}));
	}

	debounce(func, wait) {
		let timeout;
		return function() {
			const later = () => {
				timeout = null;
				func.apply(this, arguments);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (!timeout) func.apply(this, arguments);
		};
	}

	handleDraggableHeaders() {
		const headers = this.shadowRoot.querySelector('slot[name="headercell"]').assignedNodes();
		const host = this.shadowRoot.host;
		for (let header of headers) {
			this.handleDraggableHeader(header, host);
		}
	}

	handleDraggableHeader(header, host) {
		// avoid attaching multiple eventListeners to the same element
		if (header.getAttribute('reorderable')) return;
		header.setAttribute('reorderable', true);
		header.setAttribute('ondragover', 'event.preventDefault()');
		header.setAttribute('ondrop', 'event.preventDefault()');

		header.addEventListener('dragstart', e => {
			this.classList.add('dragging');
			e.dataTransfer.setData("text/plain", header.getAttribute('column'));
		});
		header.addEventListener('dragend', e => {
			this.classList.remove('dragging');
			this.draggedOverHeader.classList.remove('drag-over');
		});
		header.addEventListener('dragenter', e => {
			// header is present and drag target is not its child -> some sibling of header
			if (this.draggedOverHeader && !this.draggedOverHeader.contains(e.target)) {
				this.draggedOverHeader.classList.remove('drag-over');
			}
			// already marked
			if (header.classList.contains('drag-over')) {
				return;
			}
			// dragging over a valid drop target or its child
			if (header == e.target || header.contains(e.target)) {
				header.classList.add('drag-over');
				this.draggedOverHeader = header;
			}
		});
		header.addEventListener('drop', e => {
			const sourceColumn = e.dataTransfer.getData('text');
			const targetColumn = e.target.getAttribute('column');
			if (targetColumn == sourceColumn) {
				return;
			}
			// move headers
			const sourceHeader = this.querySelector(`:scope > zoo-grid-header[column="${sourceColumn}"]`);
			if (targetColumn < sourceColumn) {
				e.target.parentNode.insertBefore(sourceHeader, e.target);
			} else {
				e.target.parentNode.insertBefore(e.target, sourceHeader);
			}
			// move rows
			const allRows = this.shadowRoot.querySelector('slot[name="row"]').assignedNodes();
			for (const row of allRows) {
				const sourceRowColumn = row.querySelector(`:scope > [column="${sourceColumn}"]`);
				const targetRowColumn = row.querySelector(`:scope > [column="${targetColumn}"]`);
				if (targetColumn < sourceColumn) {
					targetRowColumn.parentNode.insertBefore(sourceRowColumn, targetRowColumn);
				} else {
					targetRowColumn.parentNode.insertBefore(targetRowColumn, sourceRowColumn);
				}
			}
			this.assignColumnNumberToRows();
		});
	}

	dispatchPageEvent(e) {
		this.shadowRoot.host.dispatchEvent(new CustomEvent('pageChange', {
			detail: {pageNumber: e.detail.pageNumber}, bubbles: true
		}));
	};

	handleSortChange(e) {
		e.stopPropagation();
		const header = e.detail.header;
		const sortState = e.detail.sortState;
		if (this.prevSortedHeader && !header.isEqualNode(this.prevSortedHeader)) {
			this.prevSortedHeader.sortState = undefined;
		}
		this.prevSortedHeader = header;
		const detail = sortState ? {property: header.getAttribute('sortableproperty'), direction: sortState} : undefined;
		this.shadowRoot.host.dispatchEvent(new CustomEvent('sortChange', {
			detail: detail, bubbles: true
		}));
	}

	disconnectedCallback() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	}
}

window.customElements.define('zoo-grid', Grid);

/**
 * @injectHTML
 */
class GridHeader extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;align-items:center;width:100%;height:100%}.box{display:flex;align-items:center;width:100%;height:100%}.box:focus svg,.box:hover svg{opacity:1}.arrow,.swap{display:none;min-width:20px;width:20px;opacity:0;transition:opacity .1s;margin-left:5px;border-radius:5px;background:#f2f3f4}.arrow{cursor:pointer;transform:rotate(0)}.arrow:active{opacity:.5;transform:translateY(1px)}.swap{cursor:grab}.swap:active{cursor:grabbing}:host([reorderable]) .swap,:host([sortable]) .arrow{display:flex}:host([sortstate=asc]) .arrow{transform:rotate(180deg)}:host([sortstate]) .arrow{opacity:1;background:#f2f3f4}</style><div class="box"><slot></slot><svg class="arrow" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg> <svg class="swap" viewBox="0 0 24 24" width="18" height="18"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 11l-4 4 4 4v-3h7v-2H7v-3zm14-2l-4-4v3h-7v2h7v3l4-4z"/></svg></div>`;
	}

	connectedCallback() {
		const host = this.shadowRoot.host;
		host.addEventListener('dragend', () => host.removeAttribute('draggable'));
		this.shadowRoot.querySelector('.swap').addEventListener('mousedown', () => this.toggleHostDraggable());
		this.shadowRoot.querySelector('.arrow').addEventListener('click', () => this.handleSortClick());
		this.sortState = undefined;
	}

	handleSortClick() {
		if (!this.sortState) {
			this.sortState = 'desc';
		} else if (this.sortState == 'desc') {
			this.sortState = 'asc';
		} else if (this.sortState = 'asc') {
			this.sortState = undefined;
		}
		this.shadowRoot.querySelector('.arrow').sortState = this.sortState;
		const host = this.shadowRoot.host;
		host.dispatchEvent(new CustomEvent('sortChange', {detail: {sortState: this.sortState, header: host}, bubbles: true}));
	}

	toggleHostDraggable() {
		this.shadowRoot.host.setAttribute('draggable', true);
	}
	static get observedAttributes() {
		return ['sortState', 'sortable', 'reorderable'];
	}
	get sortState() {
		return this.getAttribute('sortState');
	}
	set sortState(sortState) {
		if (sortState) {
			this.setAttribute('sortState', sortState);
		} else {
			this.removeAttribute('sortState');
		}
	}
	get sortable() {
		return this.getAttribute('sortable');
	}
	set sortable(sortable) {
		if (sortable) {
			this.setAttribute('sortable', sortable);
		} else {
			this.removeAttribute('sortable');
		}
	}
	get reorderable() {
		return this.getAttribute('reorderable');
	}
	set reorderable(reorderable) {
		if (reorderable) {
			this.setAttribute('reorderable', reorderable);
		} else {
			this.removeAttribute('reorderable');
		}
	}
}

window.customElements.define('zoo-grid-header', GridHeader);

/**
 * @injectHTML
 */
class GridHeader$1 extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>.box,.btn.hidden{display:none}.btn,.page-element{cursor:pointer}:host{padding:10px;min-width:inherit;border-top:1px solid #e6e6e6}.box{font-size:14px;width:max-content;right:10px;justify-self:flex-end;position:sticky}.btn,.page-element-dots,.paging{display:flex}:host([currentpage]) .box{display:flex}.paging{align-items:center;border:1px solid #e6e6e6;border-radius:5px;margin:3px 0 3px 20px;padding:0 15px}.btn{opacity:1;transition:opacity .1s}.btn:active{opacity:.5}.btn.next{margin-left:5px}.btn.prev{margin-right:10px}svg{fill:#555}.arrow path{fill:var(--primary-mid,#3c9700)}.page-element,.page-element-dots{display:flex;align-items:center;justify-content:center;border-radius:5px;margin-right:5px;padding:4px 8px}.page-element:focus,.page-element:hover{background:#f2f3f4}.page-element.active{background:var(--primary-ultralight,#ebf4e5);color:var(--primary-mid,#3c9700)}.btn.next svg{transform:rotate(-90deg)}.btn.prev svg{transform:rotate(90deg)}</style><div class="box"><slot name="pagesizeselector"></slot><nav class="paging"><div class="btn prev"></div><div class="btn next"></div></nav></div><template id="dots"><div class="temp page-element-dots">...</div></template><template id="pages"><div class="temp page-element"></div></template><template id="arrow"><svg class="arrow" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg></template>`;
		this.prev = this.shadowRoot.querySelector('.btn.prev');
		this.next = this.shadowRoot.querySelector('.btn.next');
	}

	connectedCallback() {
		const root = this.shadowRoot;
		const arrowTemplateContent = root.querySelector('#arrow').content;
		this.prev.appendChild(arrowTemplateContent.cloneNode(true));
		this.next.appendChild(arrowTemplateContent.cloneNode(true));
		this.prev.addEventListener('click', () => this.goToPage(+this.currentpage-1));
		this.next.addEventListener('click', () => this.goToPage(+this.currentpage+1));
		this.shadowRoot.querySelector('.paging').addEventListener('click', e => {
			const target = e.target.getAttribute('page');
			if (target) {
				this.goToPage(target);
			}
		});
	}
	goToPage(pageNumber) {
		this.currentpage = pageNumber;
		this.shadowRoot.host.dispatchEvent(new CustomEvent('pageChange', {
			detail: {pageNumber: pageNumber}, bubbles: true, compose: true
		}));
	}

	static get observedAttributes() {
		return ['maxpages', 'currentpage'];
	}
	get maxpages() {
		return this.getAttribute('maxpages');
	}
	set maxpages(maxpages) {
		if (maxpages) {
			this.setAttribute('maxpages', maxpages);
		} else {
			this.removeAttribute('maxpages');
		}
	}
	get currentpage() {
		return this.getAttribute('currentpage');
	}
	set currentpage(currentpage) {
		if (currentpage) {
			this.setAttribute('currentpage', currentpage);
		} else {
			this.removeAttribute('currentpage');
		}
	}
	handleHideShowArrows() {
		if (this.currentpage == 1) {
			this.prev.classList.add('hidden');
		} else {
			this.prev.classList.remove('hidden');
		}
		if (+this.currentpage >= +this.maxpages) {
			this.next.classList.add('hidden');
		} else {
			this.next.classList.remove('hidden');
		}
	}
	rerenderPageButtons() {
		const root = this.shadowRoot;
		const oldNodes = root.querySelectorAll('.temp');
		for (const node of oldNodes) {
			node.remove();
		}
		const pageNum = +this.currentpage;
		const dots = root.querySelector('#dots').content;
		const pages = root.querySelector('#pages').content;
		for (let page=this.maxpages;page>0;page--) {
			//first, previous, current, next or last page
			if (page == 1 || page == pageNum - 1 || page == pageNum || page == pageNum + 1 || page == this.maxpages) {
				const pageNode = pages.cloneNode(true).firstElementChild;
				pageNode.setAttribute('page', page);
				if (pageNum == page) {
					pageNode.classList.add('active');
				}
				pageNode.innerHTML = page;
				this.prev.parentNode.insertBefore(pageNode, this.prev.nextSibling);
			} else if (page == pageNum-2 || pageNum+2 == page) {
				this.prev.parentNode.insertBefore(dots.cloneNode(true), this.prev.nextSibling);
			}
		}
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'currentpage' || attrName == 'maxpages') {
			this.handleHideShowArrows();
			if (oldVal != newVal) {
				this.rerenderPageButtons();
			}
		}
	}
}
window.customElements.define('zoo-grid-paginator', GridHeader$1);

/**
 * @injectHTML
 */
class Header extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{contain:style}header{display:flex;align-items:center;background:#fff;padding:0 25px;height:70px}::slotted(img){height:46px;display:inline-block;padding:5px 25px 5px 0;cursor:pointer}::slotted([slot=headertext]),h2{display:inline-block;color:var(--primary-mid,#3c9700)}@media only screen and (max-width:544px){::slotted(img){height:36px;display:inline-block;padding:5px 25px 5px 0;cursor:pointer}::slotted([slot=headertext]),h2{display:none}}</style><header><slot name="img"></slot><slot name="headertext"><h2></h2></slot><slot></slot></header>`;
	}

	static get observedAttributes() {
		return ['headertext'];
	}
	get headertext() {
		return this.getAttribute('headertext');
	}
	set headertext(text) {
		this.setAttribute('headertext', text);
		this.handleHeaderText(this.headertext, text);
	}
	handleHeaderText(newVal) {
		this.shadowRoot.querySelector('h2').innerHTML = newVal;
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'headertext') this.handleHeaderText(newVal);
	}
}

window.customElements.define('zoo-header', Header);

/**
 * @injectHTML
 */
class Modal extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:none;contain:style}.box{position:fixed;width:100%;height:100%;background:rgba(0,0,0,.8);opacity:0;transition:opacity .3s;z-index:9999;left:0;top:0;display:flex;justify-content:center;align-items:center;will-change:opacity;transform:translateZ(0)}.dialog-content{padding:0 20px 20px;box-sizing:border-box;background:#fff;overflow-y:auto;max-height:95%;border-radius:5px;animation-name:anim-show;animation-duration:.3s;animation-fill-mode:forwards}@media only screen and (max-width:544px){.dialog-content{padding:25px}}@media only screen and (max-width:375px){.dialog-content{width:100%;height:100%;top:0;left:0;transform:none}}.heading{display:flex;flex-direction:row;align-items:flex-start}span{font-size:24px;line-height:29px;font-weight:700;margin:30px 0}.close{cursor:pointer;background:0 0;border:0;padding:0;margin:30px 0 30px auto}.close path{fill:var(--primary-mid,#3c9700)}.show{opacity:1}.hide .dialog-content{animation-name:anim-hide}@keyframes anim-show{0%{opacity:0;transform:scale3d(.9,.9,1)}100%{opacity:1;transform:scale3d(1,1,1)}}@keyframes anim-hide{0%{opacity:1}100%{opacity:0;transform:scale3d(.9,.9,1)}}</style><div class="box"><div class="dialog-content"><div class="heading"><span></span> <button type="button" class="close"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 6l-1-1-6 6-6-6-1 1 6 6-6 6 1 1 6-6 6 6 1-1-6-6z"/></svg></button></div><div class="content"><slot></slot></div></div></div>`;
	}

	static get observedAttributes() {
		return ['headertext'];
	}
	get headertext() {
		return this.getAttribute('headertext');
	}
	set headertext(headertext) {
		this.setAttribute('headertext', headertext);
		this.handleText(this.headertext, headertext);
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'headertext') this.handleText(newVal);
	}
	handleText(newVal) {
		this.shadowRoot.querySelector('span').innerHTML = newVal;
	}
	connectedCallback() {
		this.hidden = true;
		this.shadowRoot.querySelector('.close').addEventListener('click', () => this.closeModal());
		const box = this.shadowRoot.querySelector('.box');
		box.addEventListener("click", e => {
			if(e.target == box) this.closeModal();
		});
	}
	openModal() {
		this.style.display = 'block';
		this.toggleModalClass();
	}
	closeModal() {
		if (this.timeoutVar) return;
		this.hidden = !this.hidden;
		this.toggleModalClass();
		this.timeoutVar = setTimeout(() => {
			this.style.display = 'none';
			this.dispatchEvent(new Event("modalClosed"));
			this.hidden = !this.hidden;
			this.timeoutVar = undefined;
		}, 300);
	}

	toggleModalClass() {
		const modalBox = this.shadowRoot.querySelector('.box');
		if (!this.hidden) {
			modalBox.classList.add('hide');
			modalBox.classList.remove('show');
		} else {
			modalBox.classList.add('show');
			modalBox.classList.remove('hide');
		}
	}
}

window.customElements.define('zoo-modal', Modal);

/**
 * @injectHTML
 */
class Footer extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{contain:style}nav{display:flex;justify-content:center;background:linear-gradient(to right,var(--primary-mid,#3c9700),var(--primary-light,#66b100));padding:10px 30px}div{font-size:12px;line-height:16px;text-align:left;background:#fff;color:#555;padding:10px 0 10px 30px}::slotted(zoo-link){width:max-content}@media only screen and (max-width:544px){div{text-align:center;padding:10px 0}}</style><footer><nav><slot></slot></nav><div></div></footer>`;
	}

	static get observedAttributes() {
		return ['copyright'];
	}
	get copyright() {
		return this.getAttribute('copyright');
	}
	set copyright(text) {
		this.setAttribute('copyright', text);
		handleCopyright(this.headertext, text);
	}
	handleCopyright(newVal) {
		this.shadowRoot.querySelector('div').innerHTML = `© ${newVal} ${new Date().getFullYear()}`;
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'copyright') this.handleCopyright(newVal);
	}
}

window.customElements.define('zoo-footer', Footer);

/**
 * @injectHTML
 */
class Feedback extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;align-items:center;box-sizing:border-box;font-size:14px;line-height:20px;border-left:3px solid;width:100%;height:100%;padding:5px 0;background:var(--info-ultralight,#ecf5fa);border-color:var(--info-mid,#459fd0)}svg{min-width:30px;min-height:30px;padding:0 10px 0 15px;fill:var(--info-mid,#459fd0)}::slotted(*){display:flex;align-items:center;height:100%;overflow:auto;box-sizing:border-box;padding:5px 5px 5px 0}:host([type=error]){background:var(--warning-ultralight,#fde8e9);border-color:var(--warning-mid,#ed1c24)}:host([type=error]) svg{fill:var(--warning-mid,#ed1c24)}:host([type=success]){background:var(--primary-ultralight,#ebf4e5);border-color:var(--primary-mid,#3c9700)}:host([type=success]) svg{fill:var(--primary-mid,#3c9700)}</style><svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 15.75a1.125 1.125 0 11.001 2.25A1.125 1.125 0 0112 15.75zm.75-2.25a.75.75 0 11-1.5 0V5.25a.75.75 0 111.5 0v8.25zm7.205-9.455l.53-.53c4.687 4.686 4.687 12.284 0 16.97-4.686 4.687-12.284 4.687-16.97 0-4.687-4.686-4.687-12.284 0-16.97 4.686-4.687 12.284-4.687 16.97 0l-.53.53zm0 0l-.53.53c-4.1-4.1-10.75-4.1-14.85 0s-4.1 10.75 0 14.85 10.75 4.1 14.85 0 4.1-10.75 0-14.85l.53-.53z"/></svg><slot></slot>`;
	}

	static get observedAttributes() {
		return ['type'];
	}
	get type() {
		return this.getAttribute('type');
	}
	set type(type) {
		this.setAttribute('type', type);
	}
}

window.customElements.define('zoo-feedback', Feedback);

/**
 * @injectHTML
 */
class Tooltip extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>.box,.tip::after{box-shadow:0 4px 15px 0 rgba(0,0,0,.1)}:host{z-index:9997;contain:layout;display:block;height:0;width:0}.box{pointer-events:initial;border-radius:5px;position:absolute;transform:translate(0,-50%)}.tooltip-content{padding:10px;font-size:12px;line-height:16px;font-weight:initial;position:relative;z-index:1;background:#fff;border-radius:5px}.tip,.tip::after{position:absolute}.tooltip-content span{white-space:pre;color:#000}.tip::after{content:"";width:16px;height:16px;top:-8px;transform:rotate(45deg);z-index:0;background:#fff}:host([position=top]) .tip{right:calc(50% + 8px)}:host([position=right]) .tip{bottom:50%;left:-8px}:host([position=bottom]) .tip{right:calc(50% + 8px);top:0}:host([position=left]) .tip{bottom:50%;right:8px}</style><div class="box"><div class="tooltip-content"><slot><span></span></slot></div><div class="tip"></div></div>`;
		this.box = this.shadowRoot.querySelector('.box');
	}

	static get observedAttributes() {
		return ['text', 'position', 'target'];
	}
	get position() {
		return this.getAttribute('position');
	}
	set position(position) {
		this.setAttribute('position', position);
	}
	get text() {
		return this.getAttribute('text');
	}
	set text(text) {
		this.setAttribute('text', text);
		this.handleText(this.text, text);
	}

	get target() {
		return this.getAttribute('target');
	}
	set target(targetId) {
		this.setAttribute('target', targetId);
	}
	handlePosition(targetId, position) {
		if (targetId) {
			console.log('changing position to ' + position);
			const target = document.querySelector(`#${targetId}`);
			const targetRect = target.getBoundingClientRect();
			const hostRect = this.shadowRoot.host.getBoundingClientRect();
			const boxRect = this.box.getBoundingClientRect();
			let x, y;

			switch (position) {
				case 'top':
					// half of target and half of tooltip width
					x = (targetRect.right - targetRect.left) / 2 - boxRect.width / 2;
					// distance between target and tooltip host and additional tooltip content height
					y = targetRect.top - hostRect.top - boxRect.height;
					break;
				case 'right':
					x = targetRect.right;
					// distance between target and tooltip host and middle of target
					y = targetRect.top - hostRect.top + targetRect.height / 2;
					break;
				case 'bottom':
					// half of target and half of tooltip width
					x = (targetRect.right - targetRect.left) / 2 - boxRect.width / 2;
					y = targetRect.bottom - hostRect.bottom;
					break;
				case 'left':
					x = targetRect.left - boxRect.width;
					// distance between target and tooltip host and middle of target
					y = targetRect.top - hostRect.top + targetRect.height / 2;
					break;
			}
			this.box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		}
	}
	handleText(newVal) {
		this.shadowRoot.querySelector('span').innerHTML = newVal;
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'text') this.handleText(newVal);
		if (attrName == 'position') setTimeout(() => this.handlePosition(this.target, this.position), 150);
	}

	connectedCallback() {
		let observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), {
			root: null,
			rootMargin: '0px',
			threshold: this.buildThresholdList()
		});
		this.defaultPosition = this.position;
		observer.observe(this.shadowRoot.querySelector('.box'));
		this.positions = ['top', 'right', 'bottom', 'left'];
		this.count = this.positions.indexOf(this.position);
		if (!this.target) this.target = this.shadowRoot.host.parentElement;
		setTimeout(() => this.handlePosition(this.target, this.position), 150);
	}

	intersectionObserverCallback(entries, observer) {
		entries.forEach(entry => {
			if (!entry.isIntersecting || entry.intersectionRatio > 0.7) return;
			this.handleIntersection(0);
		});
	}

	handleIntersection(recursiveCounter) {
		if (recursiveCounter > this.positions.length) {
			this.position = this.defaultPosition;
		}
		this.count++;
		if (this.count == 4) this.count = 0;
		if (this.canChangePosition(this.positions[this.count])) {
			this.position = this.positions[this.count];
		} else {
			this.handleIntersection(recursiveCounter++);
		}
	}

	canChangePosition(position) {
		const target = document.querySelector(`#${this.target}`);
		const targetRect = target.getBoundingClientRect();
		const boxRect = this.box.getBoundingClientRect();
		switch (position) {
			case 'top': 
				if (targetRect.top > boxRect.height) {
					this.position = 'top';
				}
				return true;
			case 'right': 
				if (targetRect.right > boxRect.width) {
					this.position = 'right';
				}
				return true;
			case 'bottom': 
				if (targetRect.bottom > boxRect.height) {
					this.position = 'bottom';
				}
				return true;
			case 'left': 
				if (targetRect.left > boxRect.width) {
					this.position = 'left';
				}
				return true;
		}
		return false;
	}

	buildThresholdList() {
		let thresholds = [];
		let numSteps = 10;

		for (let i = 1.0; i <= numSteps; i++) {
			let ratio = i / numSteps;
			thresholds.push(ratio);
		}

		thresholds.push(0);
		return thresholds;
	}
}

window.customElements.define('zoo-tooltip', Tooltip);

/**
 * @injectHTML
 */
class Link extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{contain:layout;display:flex;width:100%;height:100%;justify-content:center;align-items:center;position:relative;padding:0 5px}::slotted(a){text-decoration:none;font-size:12px;line-height:16px;padding:0 2px;color:#fff}::slotted(a:active),::slotted(a:focus),::slotted(a:hover){color:#fff;cursor:pointer}:host([type=primary]) ::slotted(a){color:var(--primary-mid,#3c9700)}:host([type=primary]) ::slotted(a:visited){color:var(--primary-light,#66b100)}:host([type=primary]) ::slotted(a:active),:host([type=primary]) ::slotted(a:focus),:host([type=primary]) ::slotted(a:hover){color:var(--primary-dark,#286400)}:host([type=grey]) ::slotted(a){color:#767676}:host([type=grey]) ::slotted(a:active),:host([type=grey]) ::slotted(a:focus),:host([type=grey]) ::slotted(a:hover){color:var(--primary-dark,#286400)}:host([type=warning]) ::slotted(a){color:#ed1c24}:host([type=warning]) ::slotted(a:active),:host([type=warning]) ::slotted(a:focus),:host([type=warning]) ::slotted(a:hover){color:var(--warning-dark,#bd161c)}:host([size=large]) ::slotted(a){font-size:18px;line-height:22px;font-weight:700}:host([size=bold]) ::slotted(a){font-weight:700}:host([size=bold]) ::slotted(a:active){background:#e6e6e6;border-radius:5px}</style><slot name="pre"></slot><slot name="anchor"></slot><slot name="post"></slot>`;
	}

	static get observedAttributes() {
		return ['type', 'size'];
	}
	get type() {
		return this.getAttribute('active');
	}
	set type(type) {
		this.setAttribute('type', type);
	}
	get size() {
		return this.getAttribute('size');
	}
	set size(size) {
		this.setAttribute('size', size);
	}
}
window.customElements.define('zoo-link', Link);

/**
 * @injectHTML
 */
class Navigation extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{contain:layout}nav{width:100%;height:56px;background:linear-gradient(to right,var(--primary-mid,#3c9700),var(--primary-light,#66b100))}::slotted(:first-child){display:flex;flex-direction:row;height:100%;overflow:auto;overflow-y:hidden;padding:0 20px}</style><nav><slot></slot></nav>`;
	}
}
window.customElements.define('zoo-navigation', Navigation);

/**
 * @injectHTML
 */
class Toast extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>button,button svg{padding:0}button,div{display:flex}:host{display:none;top:20px;right:20px;position:fixed;z-index:10001;contain:layout}div{max-width:330px;min-height:50px;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);border-left:3px solid;align-items:center;word-break:break-word;font-size:14px;line-height:20px;padding:15px;transition:transform .3s,opacity .4s;opacity:0;transform:translate3d(100%,0,0)}svg{padding-right:10px;min-width:48px}:host([type=info]) div{background:var(--info-ultralight,#ecf5fa);border-color:var(--info-mid,#459fd0)}:host([type=info]) div svg{fill:var(--info-mid,#459fd0)}:host([type=error]) div{background:var(--warning-ultralight,#fde8e9);border-color:var(--warning-mid,#ed1c24)}:host([type=error]) div svg{fill:var(--warning-mid,#ed1c24)}:host([type=success]) div{background:var(--primary-ultralight,#ebf4e5);border-color:var(--primary-mid,#3c9700)}:host([type=success]) div svg{fill:var(--primary-mid,#3c9700)}span{flex-grow:1}.show{opacity:1;transform:translate3d(0,0,0)}button{cursor:pointer;border:0;background:0 0}</style><div><svg width="30" height="30" viewBox="0 0 24 24"><path d="M14.2 21c.4.1.6.6.5 1a2.8 2.8 0 01-5.4 0 .7.7 0 111.4-.5 1.3 1.3 0 002.6 0c.1-.4.5-.6 1-.5zM12 0c.4 0 .8.3.8.8v1.5c4.2.4 7.4 3.9 7.4 8.2 0 3 .3 5.1.8 6.5l.4 1v.2c.6.4.3 1.3-.4 1.3H3c-.6 0-1-.7-.6-1.2.1-.2.4-.6.6-1.5.5-1.5.7-3.6.7-6.3 0-4.3 3.3-7.8 7.6-8.2V.8c0-.5.3-.8.7-.8zm0 3.8c-3.7 0-6.7 3-6.8 6.7a24.2 24.2 0 01-1 7.5h15.5l-.2-.5c-.5-1.6-.8-3.8-.8-7 0-3.7-3-6.8-6.7-6.8z"/></svg> <span></span> <button type="button"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 6l-1-1-6 6-6-6-1 1 6 6-6 6 1 1 6-6 6 6 1-1-6-6z"/></svg></button></div>`;
	}

	static get observedAttributes() {
		return ['type', 'text', 'timeout'];
	}
	get type() {
		return this.getAttribute('type');
	}
	set type(type) {
		this.setAttribute('type', type);
	}
	get text() {
		return this.getAttribute('text');
	}
	set text(text) {
		this.setAttribute('text', text);
		this.handleText(this.text, text);
	}
	handleText(newVal) {
		this.shadowRoot.querySelector('span').innerHTML = newVal;
	}
	get timeout() {
		return this.getAttribute('timeout');
	}
	set timeout(timeout) {
		this.setAttribute('timeout', timeout);
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (attrName == 'text') this.handleText(newVal);
	}
	connectedCallback() {
		this.hidden = true;
		this.timeout = this.getAttribute('timeout') || 3;
		this.type = this.getAttribute('type') || 'info';
		this.shadowRoot.querySelector('button').addEventListener('click', () => this.close());
	}
	show() {
		if (!this.hidden) return;
		const root = this.shadowRoot.host;
		root.style.display = 'block';
		this.timeoutVar = setTimeout(() => {
			this.hidden = !this.hidden;
			this.toggleToastClass();
			this.timeoutVar = setTimeout(() => {
				if (root && !this.hidden) {
					this.hidden = !this.hidden;
					this.timeoutVar = setTimeout(() => {root.style.display = 'none';}, 300);
					this.toggleToastClass();
				}
			}, this.timeout * 1000);
		}, 30);
	}
	close() {
		if (this.hidden) return;
		clearTimeout(this.timeoutVar);
		const root = this.shadowRoot.host;
		setTimeout(() => {
			if (root && !this.hidden) {
				this.hidden = !this.hidden;
				setTimeout(() => {root.style.display = 'none';}, 300);
				this.toggleToastClass();
			}
		}, 30);
	}

	toggleToastClass() {
		const toast = this.shadowRoot.querySelector('div');
		if (this.hidden) {
			toast.classList.remove('show');
		} else {
			toast.classList.add('show');
		}
	}
}

window.customElements.define('zoo-toast', Toast);

/**
 * @injectHTML
 */
class CollapsableList extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:flex;flex-direction:column}</style><slot></slot>`;
	}

	connectedCallback() {
		const slot = this.shadowRoot.querySelector('slot');
		slot.addEventListener('slotchange', () => {
			let items = slot.assignedNodes();
			items = items.filter(i => i.tagName == 'ZOO-COLLAPSABLE-LIST-ITEM');
			if (items[0]) {
				items[0].setAttribute('active', true);
				this.prevActiveItem = items[0];
			}

			for (const item of items) {
				item.addEventListener('click', () => {
					if (item.hasAttribute('active')) return;
					this.prevActiveItem.removeAttribute('active');
					this.prevActiveItem = item;
					item.setAttribute('active', true);
				});
			}
		});
	}
}
window.customElements.define('zoo-collapsable-list', CollapsableList);

/**
 * @injectHTML
 */
class CollapsableListItem extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{padding:0 10px;display:flex;flex-direction:column}:host([active]){border:1px solid var(--primary-mid,#3c9700);border-radius:3px}.header{display:flex;cursor:pointer}::slotted([slot=header]){display:inline-flex;color:var(--primary-mid,#3c9700);font-size:14px;line-height:20px;font-weight:700;align-items:center;padding:20px 0}:host([active]) ::slotted([slot=header]){color:var(--primary-dark,#286400)}::slotted([slot=content]){display:none}:host([active]) ::slotted([slot=content]){display:initial}svg{display:inline-flex;margin-left:auto;fill:var(--primary-mid,#3c9700);transition:transform .3s;padding:20px 0}:host([active]) svg{fill:var(--primary-dark,#286400);transform:rotateX(180deg)}</style><div class="header"><slot name="header"></slot><svg width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg></div><slot name="content"></slot>`;
	}
	static get observedAttributes() {
		return ['active'];
	}
	get active() {
		return this.hasAttribute('active');
	}
	set active(active) {
		if (active) {
			this.setAttribute('active', '');
		} else {
			this.removeAttribute('active');
		}
	}
}
window.customElements.define('zoo-collapsable-list-item', CollapsableListItem);

/**
 * @injectHTML
 */
class Spinner extends HTMLElement {
	constructor() {
		super(); let sr = this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{contain:layout}.spinner{position:absolute;left:calc(50% - 60px);top:calc(50% - 60px);right:0;bottom:0;height:120px;width:120px;transform-origin:center center;animation:2s linear infinite rotate;z-index:10002}.spinner circle{animation:1.5s ease-in-out infinite dash;stroke:var(--primary-mid,#3c9700);stroke-dasharray:1,200;stroke-dashoffset:0;stroke-linecap:round}@keyframes rotate{100%{transform:rotate(360deg)}}@keyframes dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}</style><svg class="spinner" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2.5" stroke-miterlimit="10"/></svg>`;
	}
}

window.customElements.define('zoo-spinner', Spinner);
//# sourceMappingURL=components.js.map
