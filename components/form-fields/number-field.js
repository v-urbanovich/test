var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, html } from 'lit-element';
import { BaseField } from './base-field';
import '@polymer/paper-input/paper-input';
let NumberField = class NumberField extends BaseField {
    controlTemplate() {
        return html `
      <style>
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      </style>
      <paper-input
        class="without-border no-padding-left"
        no-label-float
        .value="${this.value}"
        @value-changed="${({ detail }) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
    `;
    }
    valueChanged(newValue) {
        const formatted = Number(newValue);
        const isNumber = !isNaN(formatted) && `${newValue}` !== '' && `${newValue}` !== 'null';
        super.valueChanged(isNumber ? formatted : newValue);
    }
    customValidation(value) {
        return value && isNaN(value) ? 'Must be a number' : null;
    }
};
NumberField = __decorate([
    customElement('number-field')
], NumberField);
export { NumberField };
