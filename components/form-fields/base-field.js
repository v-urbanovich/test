var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement, property } from 'lit-element';
import { fireEvent } from '../utils/fire-custom-event';
import { FlexLayoutClasses } from '../styles/flex-layout-classes';
import { InputStyles } from '../styles/input-styles';
import { validate } from '../utils/validations.helper';
export class BaseField extends LitElement {
    constructor() {
        super(...arguments);
        this.questionText = '';
        this.isReadonly = false;
        this.required = false;
        this.value = null;
        this.validators = [];
        this._errorMessage = null;
    }
    set errorMessage(message) {
        this._errorMessage = message;
    }
    get errorMessage() {
        return this.isReadonly ? null : this._errorMessage;
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

      <div class="finding-container">
        <div class="question"><slot>${this.questionTemplate()}</slot></div>
        <div class="question-control">${this.controlTemplate()}</div>
      </div>
    `;
    }
    questionTemplate() {
        return html `
      <span class="question-text">${this.questionText}</span>
    `;
    }
    valueChanged(newValue) {
        this.validateField(newValue);
        if (newValue !== this.value) {
            this.value = newValue;
            fireEvent(this, 'value-changed', { value: newValue });
        }
    }
    validateField(value) {
        let errorMessage;
        if (this.required && !value) {
            errorMessage = 'This field is required!';
        }
        else {
            errorMessage = this.metaValidation(value);
        }
        if (this._errorMessage !== errorMessage) {
            fireEvent(this, 'error-changed', { error: errorMessage });
            this._errorMessage = errorMessage;
        }
    }
    metaValidation(value) {
        const message = validate(this.validators, value);
        return message ? message : this.customValidation(value);
    }
    static get styles() {
        // language=CSS
        return [
            FlexLayoutClasses,
            css `
        :host {
          display: block;
          width: 100%;
          padding: 0 25px 0 45px;
          box-sizing: border-box;
        }

        .finding-container {
          width: 100%;
          display: flex;
        }
        .flex-wrapping {
          flex-wrap: wrap;
        }

        .question-control,
        .question {
          min-height: 57px;
          display: flex;
          align-items: center;
        }
        .question {
          flex: 2;
        }
        .question-control {
          flex: 3;
        }

        paper-input,
        paper-textarea {
          width: 100%;
        }

        .question-text {
          font-weight: 500;
          font-size: 13px;
          color: var(--primary-text-color);
        }

        @media (max-width: 1080px) {
          :host {
            padding: 0 15px;
          }
          .finding-container {
            flex-direction: column;
          }
          .question,
          .question-control {
            flex: 0 1 auto;
          }
        }
      `
        ];
    }
}
__decorate([
    property({ type: String })
], BaseField.prototype, "questionText", void 0);
__decorate([
    property({ type: Boolean, attribute: 'is-readonly' })
], BaseField.prototype, "isReadonly", void 0);
__decorate([
    property({ type: Boolean, attribute: 'required', reflect: true })
], BaseField.prototype, "required", void 0);
__decorate([
    property()
], BaseField.prototype, "value", void 0);
__decorate([
    property()
], BaseField.prototype, "_errorMessage", void 0);
