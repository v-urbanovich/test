var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, customElement, property } from 'lit-element';
import { BaseField } from './base-field';
import '@polymer/paper-input/paper-textarea';
import { InputStyles } from '../styles/input-styles';
let WideField = class WideField extends BaseField {
    constructor() {
        super(...arguments);
        this.label = '';
        this.placeholder = '';
    }
    render() {
        return html `
      ${InputStyles}
      <style>
        paper-textarea {
          --paper-input-container-input: {
            font-size: 13px;
          }
        }
        paper-input {
          --paper-input-container-shared-input-style: {
            font-size: 13px;
            width: 100%;
          }
        }
      </style>
      <paper-textarea
        class="wide-input disabled-as-readonly"
        always-float-label
        .value="${this.value}"
        label="${this.label}"
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        ?required="${this.required}"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        @value-changed="${({ detail }) => this.valueChanged(detail.value)}"
      >
      </paper-textarea>
    `;
    }
    controlTemplate() {
        return html ``;
    }
    customValidation() {
        return null;
    }
};
__decorate([
    property()
], WideField.prototype, "label", void 0);
__decorate([
    property()
], WideField.prototype, "placeholder", void 0);
WideField = __decorate([
    customElement('wide-field')
], WideField);
export { WideField };
