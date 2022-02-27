export const ERROR_IS_BEFORE = 'isBefore';
export const ERROR_NAME = 'name';
export const ERROR_DESCRIPTION = 'description';

export const ERRORS_MESSAGE = {
  [ERROR_NAME]: "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)",
  [ERROR_DESCRIPTION]:
    "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)",
  [ERROR_IS_BEFORE]:
    'La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200',
};

export const MAX_LENGHT_NAME = 32;
export const MAX_LENGHT_DESCRIPTION = 200;

export const SERVICE_NAME = 'createAnEvent';

export const STATUS_HTTP = {
  CREATED: 201,
};
export const STATUS_API = {
  CREATED: STATUS_HTTP.CREATED,
};

// FIELDS
export const LABEL_NAME = "Nom de l'évènemenent";
export const LABEL_START_DATE = 'Date de début';
export const LABEL_END_DATE = 'Date de fin';
export const LABEL_DESCRIPTION = 'Description';

export const NAME = 'name';
export const DESCRIPTION = 'description';
export const START_DATE = 'startDate';
export const END_DATE = 'endDate';
export const TITLE_MODAL = "Ajout d'un évènement";

export const MIN_DATE = new Date('01/01/1900');
export const MAX_DATE = new Date('01/01/2200');
