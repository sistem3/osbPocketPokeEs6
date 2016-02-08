'use strict';

(function() {
    let template = `
    	<style>
    	</style>
    	<main class="this-element-holder">
    		<h2>PocketPoke</h2>
    	</main>
    	`;
    class osbPocketPoke extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            this.$holder = this.shadowRoot.querySelector('.osb-pocket-poke-holder');
        };

        attachedCallback() {};

        attributeChangedCallback(attrName, oldVal, newVal) {};

        someFunction() {};
    }
    // Register Element
    document.registerElement('osb-pocket-poke', osbPocketPoke);
})();