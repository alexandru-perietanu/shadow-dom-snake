(function () {

    class Square extends HTMLElement {
        constructor() {
            super();

            const shadow = this.attachShadow({ mode: 'open' });
            const element = document.createElement('div');
            shadow.appendChild(element);
        }

        connectedCallback() {
            this.squareWidth = parseInt(this.getAttribute("square-width"));
            var element = this.shadowRoot.querySelector("div");
            this.x = parseInt(this.getAttribute("x"));
            this.y = parseInt(this.getAttribute("y"));
            element.style.width = `${this.squareWidth}px`;
            element.style.height = `${this.squareWidth}px`;
            this.style.top = `${this.y}px`;
            this.style.left = `${this.x}px`;
        }

        attributeChangedCallback(name, oldValue, newValue) {
            //FupdateStyle(this);
            if (name == "selected") {
                if (newValue == "true") {
                    this.style.background = "white";
                } else if (newValue== "false") {
                    this.style.background = "black";
                } else {
                    this.style.background = "green";
                }
            }
        }

        static get observedAttributes() { return ['selected']; }
    }

    customElements.define('square-element', Square);
})();

