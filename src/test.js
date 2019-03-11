import Test from './Test.svelte';
export { default as Header } from '../zoo-modules/header-module/Header.svelte';
export { default as Modal} from '../zoo-modules/modal-module/Modal.svelte';
export { default as Footer} from '../zoo-modules/footer-module/Footer.svelte';
export { default as Input} from '../zoo-modules/input-module/Input.svelte';
export { default as Button} from '../zoo-modules/button-module/Button.svelte';
export { default as Checkbox} from '../zoo-modules/checkbox-module/Checkbox.svelte';
export { default as Radio} from '../zoo-modules/radio-module/Radio.svelte';
export { default as Feedback} from '../zoo-modules/feedback-module/Feedback.svelte';
export { default as Tooltip} from '../zoo-modules/tooltip-module/Tooltip.svelte';
export { default as Select} from '../zoo-modules/select-module/Select.svelte';
export { default as SearchableSelect} from '../zoo-modules/searchable-select-module/SearchableSelect.svelte';
export { default as Link} from '../zoo-modules/link-module/Link.svelte';
export { default as InputInfo} from '../zoo-modules/shared-module/InputInfo.svelte';
export { default as Navigation} from '../zoo-modules/navigation-module/Navigation.svelte';
export { default as InputLabel} from '../zoo-modules/shared-module/InputLabel.svelte';
export { default as Toast} from '../zoo-modules/toast-module/Toast.svelte';

const testApp = new Test({
	target: document.body
});

export default testApp;