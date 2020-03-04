var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, LitElement, property, html, css } from 'lit-element';
import '../form-fields/text-field';
import '../form-fields/number-field';
import '../form-fields/scale-field';
import '../form-fields/wide-field';
import '@polymer/paper-input/paper-textarea';
import { SharedStyles } from '../styles/shared-styles';
import { pageLayoutStyles } from '../styles/page-layout-styles';
import { buttonsStyles } from '../styles/button-styles';
import { elevationStyles } from '../styles/elevation-styles';
import { CardStyles } from '../styles/card-styles';
import { FlexLayoutClasses } from '../styles/flex-layout-classes';
import { FormBuilderCardStyles } from '../styles/form-builder-card.styles';
import { InputStyles } from '../styles/input-styles';
import { fireEvent } from '../utils/fire-custom-event';
export var FieldTypes;
(function (FieldTypes) {
    FieldTypes["FILE_TYPE"] = "file";
    FieldTypes["TEXT_TYPE"] = "text";
    FieldTypes["NUMBER_TYPE"] = "number";
    FieldTypes["BOOL_TYPE"] = "bool";
    FieldTypes["SCALE_TYPE"] = "likert_scale";
    FieldTypes["NUMBER_INTEGER_TYPE"] = "number-integer";
    FieldTypes["NUMBER_FLOAT_TYPE"] = "number-float";
})(FieldTypes || (FieldTypes = {}));
export var StructureTypes;
(function (StructureTypes) {
    StructureTypes["WIDE"] = "wide";
    StructureTypes["ADDITIONAL"] = "additional";
    StructureTypes["CARD"] = "card";
    StructureTypes["ABSTRACT"] = "abstract";
    StructureTypes["COLLAPSED"] = "collapse";
    StructureTypes["ATTACHMENTS_BUTTON"] = "floating_attachments";
})(StructureTypes || (StructureTypes = {}));
let FormBuilderGroup = class FormBuilderGroup extends LitElement {
    constructor() {
        super(...arguments);
        this.parentGroupName = '';
        this.readonly = true;
        this.value = {};
        this._errors = {};
    }
    /**
     * Setter for handling error.
     * Normally we wouldn't have errors as string or string[] for FormGroups.
     * In cases they appear - show toast with error text and reset it.
     * Otherwise it will be impossible to clear that error from field elements
     * @param errors
     */
    set errors(errors) {
        if (Array.isArray(errors)) {
            fireEvent(this, 'toast', { text: errors[0] });
            fireEvent(this, 'error-changed', { error: null });
        }
        else if (errors) {
            this._errors = errors;
        }
    }
    render() {
        if (!this.groupStructure || !this.metadata) {
            return html ``;
        }
        return html `
      ${this.renderInlineStyles()}
      ${this.groupStructure.children.map((child) => this.renderChild(child))}
    `;
    }
    renderChild(child) {
        const type = child.type;
        switch (child.type) {
            case 'field':
                return this.renderField(child);
            case 'group':
                return this.renderGroup(child);
            default:
                console.warn(`FormBuilderGroup: Unknown group type ${type}. Please, specify rendering method`);
                return html ``;
        }
    }
    renderField(blueprintField) {
        const isWide = blueprintField.styling.includes(StructureTypes.WIDE);
        const isAdditional = blueprintField.styling.includes(StructureTypes.ADDITIONAL);
        if (isWide) {
            return html `
        <div class="${isAdditional ? 'additional-field' : ''}">
          ${this.renderWideField(blueprintField)}
        </div>
      `;
        }
        else {
            return html `
        <div class="${isAdditional ? 'additional-field finding-container' : 'finding-container'}">
          ${this.renderStandardField(blueprintField)}
        </div>
      `;
        }
    }
    renderWideField({ name, label, placeholder, required, validations }) {
        return html `
      <wide-field
        ?is-readonly="${this.readonly}"
        ?required="${required}"
        .value="${this.value[name]}"
        label="${label}"
        placeholder="${placeholder}"
        .validators="${validations.map((validation) => this.metadata.validations[validation])}"
        .errorMessage="${this.getErrorMessage(name)}"
        @value-changed="${(event) => this.valueChanged(event, name)}"
        @error-changed="${(event) => this.errorChanged(event, name)}"
      ></wide-field>
    `;
    }
    renderStandardField({ input_type, name, label, help_text, options_key, required, validations }) {
        var _a;
        switch (input_type) {
            case FieldTypes.TEXT_TYPE:
                return html `
          <text-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value[name]}"
            .validators="${validations.map((validation) => this.metadata.validations[validation])}"
            .errorMessage="${this.getErrorMessage(name)}"
            @value-changed="${(event) => this.valueChanged(event, name)}"
            @error-changed="${(event) => this.errorChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </text-field>
        `;
            case FieldTypes.NUMBER_TYPE:
            case FieldTypes.NUMBER_FLOAT_TYPE:
            case FieldTypes.NUMBER_INTEGER_TYPE:
                return html `
          <number-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value[name]}"
            .validators="${validations.map((validation) => this.metadata.validations[validation])}"
            .errorMessage="${this.getErrorMessage(name)}"
            @value-changed="${(event) => this.valueChanged(event, name)}"
            @error-changed="${(event) => this.errorChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </number-field>
        `;
            case FieldTypes.BOOL_TYPE:
            case FieldTypes.SCALE_TYPE:
                return html `
          <scale-field
            .options="${((_a = this.metadata.options[options_key || '']) === null || _a === void 0 ? void 0 : _a.values) || []}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value[name]}"
            .validators="${validations.map((validation) => this.metadata.validations[validation])}"
            .errorMessage="${this.getErrorMessage(name)}"
            @value-changed="${(event) => this.valueChanged(event, name)}"
            @error-changed="${(event) => this.errorChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </scale-field>
        `;
            default:
                console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
                return html ``;
        }
    }
    renderFieldLabel(label, helperText) {
        return html `
      <div class="layout vertical question-container">
        <div class="question-text">${label}</div>
        <div class="question-details">${helperText}</div>
      </div>
    `;
    }
    renderGroup(groupStructure) {
        const isAbstract = groupStructure.styling.includes(StructureTypes.ABSTRACT);
        const isCard = groupStructure.styling.includes(StructureTypes.CARD);
        const isCollapsed = groupStructure.styling.includes(StructureTypes.COLLAPSED);
        if (isAbstract) {
            return html `
        <form-builder-group
          .groupStructure="${groupStructure}"
          .value="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event) => this.errorChanged(event, groupStructure.name)}"
        ></form-builder-group>
      `;
        }
        else if (isCard && isCollapsed) {
            return html `
        <form-builder-collapsed-card
          .groupStructure="${groupStructure}"
          .value="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event) => this.errorChanged(event, groupStructure.name)}"
        ></form-builder-collapsed-card>
      `;
        }
        else if (isCard) {
            return html `
        <form-builder-card
          .groupStructure="${groupStructure}"
          .value="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event) => this.errorChanged(event, groupStructure.name)}"
        ></form-builder-card>
      `;
        }
        else {
            console.warn(`FormBuilderGroup: Unknown group type: ${groupStructure.styling}`);
            return html ``;
        }
    }
    valueChanged(event, name) {
        this.value[name] = event.detail.value;
        event.stopPropagation();
        fireEvent(this, 'value-changed', { value: this.value });
        this.performUpdate();
    }
    errorChanged(event, name) {
        const errorMessage = event.detail.error;
        if (errorMessage) {
            this._errors[name] = errorMessage;
        }
        else {
            delete this._errors[name];
        }
        event.stopPropagation();
        const errors = Object.keys(this._errors).length ? this._errors : null;
        fireEvent(this, 'error-changed', { error: errors });
    }
    renderInlineStyles() {
        return InputStyles;
    }
    getErrorMessage(fieldName) {
        const error = this._errors && this._errors[fieldName];
        return Array.isArray(error) ? error[0] : error || null;
    }
    static get styles() {
        // language=CSS
        return [
            SharedStyles,
            pageLayoutStyles,
            buttonsStyles,
            elevationStyles,
            CardStyles,
            FlexLayoutClasses,
            FormBuilderCardStyles,
            css `
        .save-button {
          margin-top: 8px;
          color: var(--primary-background-color);
          background-color: var(--primary-color);
        }

        .information-source {
          padding: 0.5% 2% 0.5% 1%;
        }

        .additional-field {
          padding-top: 15px;
          padding-bottom: 20px;
          background-color: var(--secondary-background-color);
        }

        .actions-container {
          padding: 0 25px 5px 45px;
          box-sizing: border-box;
        }

        .card-container.form-card {
          padding: 12px 0 15px;
        }
      `
        ];
    }
};
__decorate([
    property({ type: Object })
], FormBuilderGroup.prototype, "groupStructure", void 0);
__decorate([
    property({ type: Object })
], FormBuilderGroup.prototype, "metadata", void 0);
__decorate([
    property({ type: String })
], FormBuilderGroup.prototype, "parentGroupName", void 0);
__decorate([
    property({ type: Boolean, attribute: 'readonly', reflect: true })
], FormBuilderGroup.prototype, "readonly", void 0);
__decorate([
    property({ type: Object })
], FormBuilderGroup.prototype, "value", void 0);
__decorate([
    property()
], FormBuilderGroup.prototype, "_errors", void 0);
FormBuilderGroup = __decorate([
    customElement('form-builder-group')
], FormBuilderGroup);
export { FormBuilderGroup };
