var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, customElement, LitElement, property, query } from 'lit-element';
import { template } from './checklist-attachments-popup.tpl';
import { fireEvent } from '../../utils/fire-custom-event';
import { AttachmentsStyles } from '../../styles/attachments.styles';
import { clone } from 'ramda';
import { SharedStyles } from '../../styles/shared-styles';
let ChecklistAttachmentsPopup = class ChecklistAttachmentsPopup extends LitElement {
    constructor() {
        super(...arguments);
        this.dialogOpened = true;
        this.saveBtnClicked = false;
        this.savingInProcess = false;
        this.attachments = [];
        this.readonly = false;
        this.popupTitle = '';
    }
    set dialogData({ attachments, title, metadata }) {
        this.popupTitle = title;
        this.attachments = clone(attachments);
        this.metadata = clone(metadata);
    }
    render() {
        return template.call(this);
    }
    onClose() {
        fireEvent(this, 'response', { confirmed: false });
    }
    saveChanges() {
        const fileTypeNotSelected = this.attachments.some((attachment) => !attachment.file_type);
        if (fileTypeNotSelected) {
            return;
        }
        fireEvent(this, 'response', { confirmed: true, attachments: this.attachments });
    }
    attachmentsUploaded(attachments) {
        try {
            const parsedAttachments = attachments.success.map((jsonAttachment) => JSON.parse(jsonAttachment));
            this.attachments = [...this.attachments, ...parsedAttachments].map((item) => {
                return {
                    attachment: `${item.attachment}`,
                    file_type: Number(item.file_type),
                    filename: item.filename,
                    url: item.url || item.file_link
                };
            });
        }
        catch (e) {
            console.error(e);
            fireEvent(this, 'toast', { text: 'Can not upload attachments. Please try again later' });
        }
    }
    downloadFile(attachment) {
        const url = attachment.url;
        this.link.href = url;
        this.link.click();
        window.URL.revokeObjectURL(url);
    }
    deleteAttachment(index) {
        this.attachments.splice(index, 1);
        this.performUpdate();
    }
    changeFileType(attachment, type) {
        const newType = type && type.value;
        if (newType && attachment.file_type !== newType) {
            attachment.file_type = newType;
            this.performUpdate();
        }
    }
    static get styles() {
        return [
            SharedStyles,
            AttachmentsStyles,
            css `
        .file-selector__type-dropdown {
          flex-basis: 25%;
        }
        .file-selector__filename {
          flex-basis: 35%;
        }
        .file-selector__download {
          flex-basis: 10%;
        }
        .file-selector__delete {
          flex-basis: 10%;
        }
        .file-selector-container.with-type-dropdown {
          flex-wrap: nowrap;
        }
        @media (max-width: 380px) {
          .file-selector-container.with-type-dropdown {
            justify-content: center;
          }
          .file-selector-container.with-type-dropdown etools-dropdown.type-dropdown {
            flex-basis: 90%;
          }
          .file-selector__filename {
            flex-basis: 90%;
          }
          .file-selector__download {
            flex-basis: 5%;
          }
          .file-selector__delete {
            flex-basis: 5%;
          }
        }
        @media (max-width: 600px) {
          etools-dropdown {
            padding: 0;
          }
          .file-selector-container.with-type-dropdown {
            border-bottom: 1px solid lightgrey;
            flex-wrap: wrap;
            padding-bottom: 10px;
          }
        }
      `
        ];
    }
};
__decorate([
    property()
], ChecklistAttachmentsPopup.prototype, "dialogOpened", void 0);
__decorate([
    property()
], ChecklistAttachmentsPopup.prototype, "saveBtnClicked", void 0);
__decorate([
    property()
], ChecklistAttachmentsPopup.prototype, "savingInProcess", void 0);
__decorate([
    property()
], ChecklistAttachmentsPopup.prototype, "attachments", void 0);
__decorate([
    property()
], ChecklistAttachmentsPopup.prototype, "metadata", void 0);
__decorate([
    query('#link')
], ChecklistAttachmentsPopup.prototype, "link", void 0);
ChecklistAttachmentsPopup = __decorate([
    customElement('checklist-attachments-popup')
], ChecklistAttachmentsPopup);
export { ChecklistAttachmentsPopup };
