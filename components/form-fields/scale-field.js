var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, customElement, property } from 'lit-element';
import { BaseField } from './base-field';
import { repeat } from 'lit-html/directives/repeat';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
let ScaleField = class ScaleField extends BaseField {
    constructor() {
        super(...arguments);
        this.options = [];
    }
    controlTemplate() {
        return html `
      <style>
        .container {
          position: relative;
          min-height: 48px;
          display: flex;
          align-items: center;
          flex-direction: row;
        }

        .radio-group {
          display: flex;
          flex-direction: row;
        }

        :host([is-readonly]) paper-radio-group {
          pointer-events: none;
          opacity: 0.55;
        }

        @media (max-width: 1080px) {
          .container {
            flex-direction: column;
            align-items: flex-start;
          }
          .radio-group {
            flex-direction: column;
          }
          .radio-button {
            padding-left: 3px;
          }
          .clear-button {
            margin: 0;
            padding-left: 0;
          }
        }
      </style>

      <div class="container">
        <paper-radio-group
          class="radio-group"
          selected="${this.value}"
          @iron-select="${({ detail }) => this.onSelect(detail.item)}"
        >
          ${repeat(this.options, (option) => html `
              <paper-radio-button class="radio-button" name="${option.value}">
                ${option.label}
              </paper-radio-button>
            `)}
        </paper-radio-group>

        <paper-button ?hidden="${this.isReadonly}" @click="${() => this.valueChanged(null)}" class="clear-button">
          <iron-icon icon="clear"></iron-icon>Clear
        </paper-button>
      </div>
    `;
    }
    onSelect(item) {
        const newValue = item.get('name');
        this.valueChanged(newValue);
    }
    customValidation() {
        return null;
    }
};
__decorate([
    property({ type: Array })
], ScaleField.prototype, "options", void 0);
ScaleField = __decorate([
    customElement('scale-field')
], ScaleField);
export { ScaleField };
