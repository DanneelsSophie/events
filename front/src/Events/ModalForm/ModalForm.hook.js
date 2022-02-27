import { useCallback, useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import fetch from 'cross-fetch';
import { isValid, isBefore, isEqual } from 'date-fns';

import {
  NAME,
  DESCRIPTION,
  START_DATE,
  END_DATE,
  STATUS_API,
  SERVICE_NAME,
  MAX_LENGHT_NAME,
  MAX_LENGHT_DESCRIPTION,
  ERROR_DESCRIPTION,
  ERROR_NAME,
  ERROR_IS_BEFORE,
  ERRORS_MESSAGE,
  MIN_DATE,
  MAX_DATE,
} from './constants';
import { API_ERROR_MESSAGE } from '../constants';

const now = () => {
  const d = new Date();
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

/** FORM HOOK */
const initStateForm = {
  fields: {
    [NAME]: { name: NAME, value: '' },
    [DESCRIPTION]: { name: DESCRIPTION, value: '' },
    [START_DATE]: { name: START_DATE, value: now() },
    [END_DATE]: { name: END_DATE, value: now() },
  },
  hasErrors: true,
  errors: { name: undefined, description: undefined, isBefore: undefined },
};

export const isIncorrectString = (minLength, maxLenght, value) =>
  !value || value.trim().length > maxLenght || value.trim().length < minLength;

export const isIncorrectName = (value, isIncorrectStringFn = isIncorrectString) =>
  isIncorrectStringFn(1, MAX_LENGHT_NAME, value);

export const isIncorrectDescription = (value, IncorrectStringFn = isIncorrectString) =>
  IncorrectStringFn(1, MAX_LENGHT_DESCRIPTION, value);

export const checkDatesIsAfterMinDate = (startDate, endDate) =>
  isBefore(endDate, MIN_DATE) || isBefore(startDate, MIN_DATE);

export const checkDatesIsAfterMaxDate = (startDate, endDate) =>
  isBefore(MAX_DATE, endDate) || isBefore(MAX_DATE, startDate);

export const checkDateMaxIsStrictBeforeDateMin = (startDate, endDate) =>
  isBefore(endDate, startDate) || isEqual(startDate, endDate);

export const isIncorrectBeforeDate = (name, value, fields) => {
  let startDate;
  let endDate;
  if (name === END_DATE) {
    startDate = fields[START_DATE].value;
    endDate = value;
  } else {
    startDate = value;
    endDate = fields[END_DATE].value;
  }

  const result =
    checkDatesIsAfterMinDate(startDate, endDate) ||
    checkDatesIsAfterMaxDate(startDate, endDate) ||
    checkDateMaxIsStrictBeforeDateMin(startDate, endDate) ||
    !startDate ||
    !endDate ||
    !isValid(startDate) ||
    !isValid(endDate);

  return result;
};
const validateFunctionsFields = {
  [ERROR_NAME]: isIncorrectName,
  [ERROR_DESCRIPTION]: isIncorrectDescription,
  [ERROR_IS_BEFORE]: isIncorrectBeforeDate,
};
export const getErrorMessage =
  (nameError, ...args) =>
  (validateFunctionsFieldsCt = validateFunctionsFields) =>
    validateFunctionsFieldsCt[nameError](...args) ? ERRORS_MESSAGE[nameError] : '';

export const genericHandleError = (
  { target: { name, value } },
  fields,
  errors,
  getErrorMessageFn = getErrorMessage,
) => {
  if (name === NAME) {
    return {
      ...errors,
      [ERROR_NAME]: getErrorMessageFn(ERROR_NAME, value)(),
    };
  }
  if (name === DESCRIPTION) {
    return {
      ...errors,
      [ERROR_DESCRIPTION]: getErrorMessageFn(ERROR_DESCRIPTION, value)(),
    };
  }
  if (name === END_DATE || name === START_DATE) {
    return {
      ...errors,
      [ERROR_IS_BEFORE]: getErrorMessageFn(ERROR_IS_BEFORE, name, value, fields)(),
    };
  }
  return errors;
};

export const genericHandleChange = (fields, { target: { name, value } }) => {
  if (fields[name]) {
    return {
      ...fields,
      [name]: {
        name,
        value,
      },
    };
  }
  return fields;
};

export const getHasErrors = handleErrors =>
  Object.keys(handleErrors).reduce(
    (previous, key) => previous || handleErrors[key] !== '' || handleErrors[key] === undefined,
    false,
  );

export const setonChangeForm = ({ fields, event, setStateForm, stateForm }) => {
  const handleFields = genericHandleChange(fields, event);
  const handleErrors = genericHandleError(event, fields, stateForm.errors, getErrorMessage);
  setStateForm({
    ...stateForm,
    fields: handleFields,
    errors: handleErrors,
    hasErrors: getHasErrors(handleErrors),
  });
};

export const useForm = ({ setOnChangeFormFn = setonChangeForm, openModalForm }) => {
  const [stateForm, setStateForm] = useState(initStateForm);
  const { fields } = stateForm;

  const onChangeForm = useCallback(
    event =>
      setOnChangeFormFn({
        fields,
        event,
        setStateForm,
        stateForm,
      }),
    [setOnChangeFormFn, fields, setStateForm, stateForm],
  );

  const onClearForm = () =>
    setStateForm({
      ...initStateForm,
      fields: {
        ...initStateForm.fields,
        [START_DATE]: { name: START_DATE, value: now() },
        [END_DATE]: { name: END_DATE, value: now() },
      },
    });
  useEffect(() => onClearForm(), [openModalForm]);

  return { onChangeForm, stateForm, onClearForm };
};

/** MODAL * */

export const postAnEvent = async (
  fields,
  urlApi = process.env.REACT_APP_BASE_API_URL,
  fetchFn = fetch,
) => {
  const response = await fetchFn(`${urlApi}/events`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: fields[NAME].value.trim(),
      description: fields[DESCRIPTION].value.trim(),
      startDate: fields[START_DATE].value,
      endDate: fields[END_DATE].value,
    }),
  });
  if (response.status !== STATUS_API.CREATED) {
    throw new Error(API_ERROR_MESSAGE);
  }

  return fields[NAME].value.trim();
};

export const onErrorResponseCreatedAnEvent = (setStateNotificationFn, { message }) => {
  setStateNotificationFn({
    open: true,
    type: 'error',
    message,
  });
};

export const onSuccessResponseCreatedAnEvent = (
  refetchGetEventsFn,
  setStateNotificationFn,
  nameEvent,
) => {
  refetchGetEventsFn();
  setStateNotificationFn({
    open: true,
    type: 'success',
    message: `l'ajout de l'évènement ${nameEvent} est un succès`,
  });
};

export const useCreateAnEvent = ({
  refetchGetEvents,
  setStateNotification,
  useMutationFn = useMutation,
}) => {
  const createAnEvent = useMutationFn(SERVICE_NAME, async ({ fields }) => postAnEvent(fields), {
    onError: error => {
      onErrorResponseCreatedAnEvent(setStateNotification, error);
    },
    onSuccess: response => {
      onSuccessResponseCreatedAnEvent(refetchGetEvents, setStateNotification, response);
    },
  });

  return { createAnEvent };
};

/** NOTIFICATION  */
const initStateNotification = {
  open: false,
  type: 'success',
  message: '',
};

export const useNotification = () => {
  const [stateNotification, setStateNotification] = useState(initStateNotification);
  const handleCloseNotificationForm = () => setStateNotification(initStateNotification);
  return { setStateNotification, stateNotification, handleCloseNotificationForm };
};
