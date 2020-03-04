type GenericObject<T = any> = {
  [key: string]: T;
}

type Callback = (...args: any) => void;

type FieldOption = {
  value: any;
  label: string;
}

type FormBuilderAttachmentsPopupData = {
  attachments: GenericObject[];
  metadata: BlueprintMetadata;
  title: string;
};

type StoredAttachment = {
  agreement_reference_number: string;
  attachment: number;
  created: string;
  file_link: string;
  file_type: string;
  filename: string;
  id: number;
  object_link: string;
  partner: string;
  partner_type: string;
  pd_ssfa: null;
  pd_ssfa_number: string;
  source: string;
  uploaded_by: string;
  vendor_number: string;
};

type DefaultDropdownOption<T = number> = {
  value: T;
  display_name: string | Callback;
};


interface IDialog<D> {
  dialog: string;
  dialogData?: D;
  readonly?: boolean;
}

interface IEtoolsDialogResponse {
  confirmed: boolean;
}

interface IDialogResponse<R> extends IEtoolsDialogResponse {
  response?: R;
}
