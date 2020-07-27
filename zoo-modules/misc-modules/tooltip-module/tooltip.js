/**
 * @injectHTML
 */
class Tooltip extends HTMLElement {
	constructor() {
		super();
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
			console.log('changing position to ' + position)
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
				default:
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