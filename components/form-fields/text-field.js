var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, customElement } from 'lit-element';
import { BaseField } from './base-field';
import '@polymer/paper-input/paper-textarea';
let TextField = class TextField extends BaseField {
    controlTemplate() {
        return html `
      <style>
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      </style>
      <paper-textarea
        id="textarea"
        class="without-border no-padding-left"
        no-label-float
        .value="${this.value}"
        @value-changed="${({ detail }) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
      >
      </paper-textarea>
    `;
    }
    customValidation() {
        return null;
    }
};
TextField = __decorate([
    customElement('text-field')
], TextField);
export { TextField };
