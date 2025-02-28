import {customElement, LitElement, property, TemplateResult, html, CSSResultArray, css} from 'lit-element';
import '../form-fields/text-field';
import '../form-fields/number-field';
import '../form-fields/scale-field';
import '../form-fields/wide-field';
import '@polymer/paper-input/paper-textarea';
import {SharedStyles} from '../styles/shared-styles';
import {pageLayoutStyles} from '../styles/page-layout-styles';
import {buttonsStyles} from '../styles/button-styles';
import {elevationStyles} from '../styles/elevation-styles';
import {CardStyles} from '../styles/card-styles';
import {FlexLayoutClasses} from '../styles/flex-layout-classes';
import {FormBuilderCardStyles} from '../styles/form-builder-card.styles';
import {InputStyles} from '../styles/input-styles';
import {fireEvent} from '../utils/fire-custom-event';
import {IFormBuilderAbstractGroup} from '../types/form-builder.interfaces';

export enum FieldTypes {
  FILE_TYPE = 'file',
  TEXT_TYPE = 'text',
  NUMBER_TYPE = 'number',
  BOOL_TYPE = 'bool',
  SCALE_TYPE = 'likert_scale',
  NUMBER_INTEGER_TYPE = 'number-integer',
  NUMBER_FLOAT_TYPE = 'number-float'
}

export enum StructureTypes {
  WIDE = 'wide',
  ADDITIONAL = 'additional',
  CARD = 'card',
  ABSTRACT = 'abstract',
  COLLAPSED = 'collapse',
  ATTACHMENTS_BUTTON = 'floating_attachments'
}

@customElement('form-builder-group')
export class FormBuilderGroup extends LitElement implements IFormBuilderAbstractGroup {
  @property({type: Object}) groupStructure!: BlueprintGroup;
  @property({type: Object}) metadata!: BlueprintMetadata;
  @property({type: String}) parentGroupName: string = '';
  @property({type: Boolean, attribute: 'readonly', reflect: true}) readonly: boolean = true;
  @property({type: Object}) value: GenericObject = {};

  /**
   * Setter for handling error.
   * Normally we wouldn't have errors as string or string[] for FormGroups.
   * In cases they appear - show toast with error text and reset it.
   * Otherwise it will be impossible to clear that error from field elements
   * @param errors
   */
  set errors(errors: GenericObject | string[] | null) {
    if (Array.isArray(errors)) {
      fireEvent(this, 'toast', {text: errors[0]});
      fireEvent(this, 'error-changed', {error: null});
    } else if (errors) {
      this._errors = errors;
    }
  }
  @property() protected _errors: GenericObject = {};

  render(): TemplateResult {
    if (!this.groupStructure || !this.metadata) {
      return html``;
    }

    return html`
      ${this.renderInlineStyles()}
      ${this.groupStructure.children.map((child: BlueprintGroup | BlueprintField) => this.renderChild(child))}
    `;
  }

  renderChild(child: BlueprintGroup | BlueprintField): TemplateResult {
    const type: string = child.type;
    switch (child.type) {
      case 'field':
        return this.renderField(child);
      case 'group':
        return this.renderGroup(child);
      default:
        console.warn(`FormBuilderGroup: Unknown group type ${type}. Please, specify rendering method`);
        return html``;
    }
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    const isWide: boolean = blueprintField.styling.includes(StructureTypes.WIDE);
    const isAdditional: boolean = blueprintField.styling.includes(StructureTypes.ADDITIONAL);
    if (isWide) {
      return html`
        <div class="${isAdditional ? 'additional-field' : ''}">
          ${this.renderWideField(blueprintField)}
        </div>
      `;
    } else {
      return html`
        <div class="${isAdditional ? 'additional-field finding-container' : 'finding-container'}">
          ${this.renderStandardField(blueprintField)}
        </div>
      `;
    }
  }

  renderWideField({name, label, placeholder, required, validations}: BlueprintField): TemplateResult {
    return html`
      <wide-field
        ?is-readonly="${this.readonly}"
        ?required="${required}"
        .value="${this.value[name]}"
        label="${label}"
        placeholder="${placeholder}"
        .validators="${validations.map((validation: string) => this.metadata.validations[validation])}"
        .errorMessage="${this.getErrorMessage(name)}"
        @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
        @error-changed="${(event: CustomEvent) => this.errorChanged(event, name)}"
      ></wide-field>
    `;
  }

  renderStandardField({
    input_type,
    name,
    label,
    help_text,
    options_key,
    required,
    validations
  }: BlueprintField): TemplateResult {
    switch (input_type) {
      case FieldTypes.TEXT_TYPE:
        return html`
          <text-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value[name]}"
            .validators="${validations.map((validation: string) => this.metadata.validations[validation])}"
            .errorMessage="${this.getErrorMessage(name)}"
            @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
            @error-changed="${(event: CustomEvent) => this.errorChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </text-field>
        `;
      case FieldTypes.NUMBER_TYPE:
      case FieldTypes.NUMBER_FLOAT_TYPE:
      case FieldTypes.NUMBER_INTEGER_TYPE:
        return html`
          <number-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value[name]}"
            .validators="${validations.map((validation: string) => this.metadata.validations[validation])}"
            .errorMessage="${this.getErrorMessage(name)}"
            @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
            @error-changed="${(event: CustomEvent) => this.errorChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </number-field>
        `;
      case FieldTypes.BOOL_TYPE:
      case FieldTypes.SCALE_TYPE:
        return html`
          <scale-field
            .options="${this.metadata.options[options_key || '']?.values || []}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value[name]}"
            .validators="${validations.map((validation: string) => this.metadata.validations[validation])}"
            .errorMessage="${this.getErrorMessage(name)}"
            @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
            @error-changed="${(event: CustomEvent) => this.errorChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </scale-field>
        `;
      default:
        console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
        return html``;
    }
  }

  renderFieldLabel(label: string, helperText: string): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${label}</div>
        <div class="question-details">${helperText}</div>
      </div>
    `;
  }

  renderGroup(groupStructure: BlueprintGroup): TemplateResult {
    const isAbstract: boolean = groupStructure.styling.includes(StructureTypes.ABSTRACT);
    const isCard: boolean = groupStructure.styling.includes(StructureTypes.CARD);
    const isCollapsed: boolean = groupStructure.styling.includes(StructureTypes.COLLAPSED);
    if (isAbstract) {
      return html`
        <form-builder-group
          .groupStructure="${groupStructure}"
          .value="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name)}"
        ></form-builder-group>
      `;
    } else if (isCard && isCollapsed) {
      return html`
        <form-builder-collapsed-card
          .groupStructure="${groupStructure}"
          .value="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name)}"
        ></form-builder-collapsed-card>
      `;
    } else if (isCard) {
      return html`
        <form-builder-card
          .groupStructure="${groupStructure}"
          .value="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name)}"
        ></form-builder-card>
      `;
    } else {
      console.warn(`FormBuilderGroup: Unknown group type: ${groupStructure.styling}`);
      return html``;
    }
  }

  valueChanged(event: CustomEvent, name: string): void {
    this.value[name] = event.detail.value;
    event.stopPropagation();
    fireEvent(this, 'value-changed', {value: this.value});
    this.performUpdate();
  }

  errorChanged(event: CustomEvent, name: string): void {
    const errorMessage: string | null = event.detail.error;
    if (errorMessage) {
      this._errors[name] = errorMessage;
    } else {
      delete this._errors[name];
    }
    event.stopPropagation();
    const errors: GenericObject | null = Object.keys(this._errors).length ? this._errors : null;
    fireEvent(this, 'error-changed', {error: errors});
  }

  renderInlineStyles(): TemplateResult {
    return InputStyles;
  }

  protected getErrorMessage(fieldName: string): string | null {
    const error: string | [string] = this._errors && this._errors[fieldName];
    return Array.isArray(error) ? error[0] : error || null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      SharedStyles,
      pageLayoutStyles,
      buttonsStyles,
      elevationStyles,
      CardStyles,
      FlexLayoutClasses,
      FormBuilderCardStyles,
      css`
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
}
