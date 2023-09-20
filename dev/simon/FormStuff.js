let form = document.getElementById('frm');

// On form submit I need to receive form data from 
// the input by getting name and its value.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  var formData = new FormData(form);
  // Display the key/value pairs
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
  }
});

// I need here to assign value to form data using input name and input value
class SomeTextFieldElement extends HTMLElement {
  // [The following function is listed in the web.dev article.
  // It's not needed to add data to the form on form
  // submission but it's kept here to be uncommented.]

  // Useful values for <input>
  //static get observedAttributes() {
  //    return ['name', 'disabled', 'placeholder', 'value'];
  //}

  static formAssociated = true;
  internals;
  shadowRoot;
  constructor() {
    super();
    this.internals = this.attachInternals();
    this.shadowRoot = this.attachShadow({
      mode: 'closed',
      delegatesFocus: true
    });
    this.shadowRoot.innerHTML = "<input name='test' autofocus>";
    this.input = this.shadowRoot.querySelector('input');

    // Your original code. The 'change' event is not necessary
    // as the value of the 'input' element (named 'test')
    // is added to the form's data by the function 
    // 'handleFormData()' below.
    //const input = this.shadowRoot.querySelector('input');
    //input.addEventListener('change', () => {
    //    this.internals.setFormValue(input.value, input.value);
    //});

    // Keep reference to <form> for cleanup
    this._form = null;
    this._handleFormData = this.handleFormData.bind(this);
  }

  // FormData event is sent on <form> submission, 
  // so we can modify the data before transmission.
  // It has a .formData property, and that's all we need.
  handleFormData({
    formData
  }) {
    // Add our name and value to the form's submission 
    // data if we're not disabled.
    if (!this.input.disabled) {
      // https://developer.mozilla.org/en-US/docs/Web/API/FormData
      formData.append(this.input.name, this.input.value);
    }
  }

  // [The following function is listed in the web.dev article.
  // It's not needed to add data to the form on form
  // submission but it's kept here to be uncommented.]

  // Sync observed attributes to <input>
  //attributeChangedCallback(name, oldValue, newValue) {
  //    const value = name === 'disabled' ? this.hasAttribute('disabled') : newValue;
  //    this.input[name] = value;
  //}

  // Find the <form>, and attach the `formdata` listener.
  // This function is called when the following line is
  // executed by the browser.
  // customElements.define('some-text-field', SomeTextFieldElement);
  connectedCallback() {
    this._form = this.findContainingForm();
    if (this._form) {
      this._form.addEventListener('formdata', this._handleFormData);
    }
  }

  // [The following function is listed in the web.dev article.
  // It's not needed to add data to the form on form
  // submission but it's kept here to be uncommented.]

  // Remove the `formdata` listener if we're removed
  //disconnectedCallback() {
  //    if (this._form) {
  //        this._form.removeEventListener('formdata', this._handleFormData);
  //        this._form = null;
  //    }
  //}

  // Find the <form> we are contained in
  findContainingForm() {
    // Can only be in a form in the same "scope", ShadowRoot or Document
    const root = this.getRootNode();
    const forms = Array.from(root.querySelectorAll('form'));
    // We can only be in one <form>, so the first
    // one to contain us is the correct one.
    return forms.find((form) => form.contains(this)) || null;
  }
}

customElements.define('some-text-field', SomeTextFieldElement);