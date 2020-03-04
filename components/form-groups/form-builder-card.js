var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, html, property } from 'lit-element';
import { translate } from 'lit-translate';
import { fireEvent } from '../utils/fire-custom-event';
import { clone, equals } from 'ramda';
import { FormBuilderGroup } from './form-builder-group';
let FormBuilderCard = class FormBuilderCard extends FormBuilderGroup {
    constructor() {
        super(...arguments);
        /**
         * Show save button only if value was changed by user
         */
        this.showSaveButton = false;
        this._value = {};
        this.originalValue = {};
    }
    /**
     * Overrides value property. Saves originalValue.
     * We need to update inner _value only if it wasn't change
     * @param value
     */
    set value(value) {
        if (!this.showSaveButton) {
            this._value = clone(value);
        }
        this.originalValue = value;
    }
    get value() {
        return this._value;
    }
    /**
     * Extends parent render method,
     * adds card-container html wrapper and dynamic save button
     */
    render() {
        return html `
      <section class="elevation page-content card-container form-card" elevation="1">
        ${super.render()}

        <iron-collapse ?opened="${this.showSaveButton}">
          <div class="layout horizontal end-justified card-buttons actions-container">
            <paper-button class="save-button" @tap="${() => this.saveChanges()}"
              >${translate('MAIN.BUTTONS.SAVE')}</paper-button
            >
          </div>
        </iron-collapse>
      </section>
    `;
    }
    /**
     * Updates value property, stops event propagation.
     * We need to fire value-changed event only after save button click
     */
    valueChanged(event, name) {
        this._value[name] = event.detail.value;
        event.stopPropagation();
        this.showSaveButton = !equals(this.value, this.originalValue);
    }
    saveChanges() {
        if (Object.keys(this._errors).length) {
            fireEvent(this, 'toast', { text: 'Please check all fields and try again' });
            return;
        }
        fireEvent(this, 'value-changed', { value: this.value });
        this.showSaveButton = false;
    }
};
__decorate([
    property()
], FormBuilderCard.prototype, "showSaveButton", void 0);
__decorate([
    property()
], FormBuilderCard.prototype, "_value", void 0);
FormBuilderCard = __decorate([
    customElement('form-builder-card')
], FormBuilderCard);
export { FormBuilderCard };
