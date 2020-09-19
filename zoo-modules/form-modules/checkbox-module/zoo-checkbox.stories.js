import { withKnobs, boolean, text, color } from '@storybook/addon-knobs';
import { attributesGroupId, cssVariablesGroupId } from '../../shared/groups';
import { html } from 'lit-html';
import mdx from './zoo-checkbox.mdx';
import './dist/checkbox.compiled';

export default {
	title: 'Docs/Checkbox',
	component: 'zoo-checkbox',
	decorators: [withKnobs],
	parameters: {
		docs: {
			page: mdx,
		},
	}
};

export const zooCheckbox = () => {
	let invalid = boolean('invalid', false, attributesGroupId);
	let highlighted = boolean('highlighted', true, attributesGroupId);
	let label = text('label', 'Label', attributesGroupId);
	let inputerrormsg = text('inputerrormsg', 'Value is invalid', attributesGroupId);
	let infotext = text('infotext', 'Additional information', attributesGroupId);
	let primaryMid = color('--primary-mid', '#3C9700', cssVariablesGroupId);
	let warningMid = color('--warning-mid', '#ED1C24', cssVariablesGroupId);
	return html`<zoo-checkbox style="--primary-mid: ${primaryMid}; --warning-mid: ${warningMid};"
			?invalid="${invalid}" ?highlighted="${highlighted}" infotext="${infotext}" inputerrormsg="${inputerrormsg}">
		<input type="checkbox" id="zoo-checkbox" slot="checkboxelement"/>
		<label for="zoo-checkbox" slot="checkboxlabel">${label}</label>
	</zoo-checkbox>`;
};

