import React from 'react';
import PropTypes from 'prop-types';

import ModalForm from './ModalForm';
import { useForm, useCreateAnEvent, useNotification } from './ModalForm.hook';

export const combineOnSubmit = ({
  handleCloseModalFormFn,
  createAnEvent,
  onClearForm,
  stateForm,
}) => {
  handleCloseModalFormFn();
  createAnEvent.mutate(stateForm);
  onClearForm();
};

export const combineOnClear = ({ handleCloseModalFormFn, onClearForm }) => {
  handleCloseModalFormFn();
  onClearForm();
};

function ModalFormContainer({
  openModalForm,
  handleCloseModalFormFn,
  refetchGetEvents,
  ModalFormCmpt,
  useNotificationFn,
  useCreateAnEventFn,
  useFormFn,
  combineOnSubmitFn,
  combineOnClearFn,
}) {
  const { setStateNotification, stateNotification, handleCloseNotificationForm } =
    useNotificationFn({});
  const { createAnEvent } = useCreateAnEventFn({
    refetchGetEvents,
    setStateNotification,
  });
  const { onChangeForm, stateForm, onClearForm } = useFormFn({ openModalForm });

  const onSubmit = () =>
    combineOnSubmitFn({
      handleCloseModalFormFn,
      createAnEvent,
      onClearForm,
      stateForm,
    });

  const onCancel = () => combineOnClearFn({ handleCloseModalFormFn, onClearForm });

  const { fields, hasErrors, errors } = stateForm;
  return (
    <ModalFormCmpt
      fieldsFormModal={fields}
      errorsFormModal={errors}
      onChangeFormFn={onChangeForm}
      isDisabledButtonForm={hasErrors}
      openModalForm={openModalForm}
      onCancelModalFormFn={onCancel}
      onSubmitModalFormFn={onSubmit}
      handleCloseModalFormFn={handleCloseModalFormFn}
      handleCloseNotificationFormFn={handleCloseNotificationForm}
      stateNotification={stateNotification}
    />
  );
}

ModalFormContainer.propTypes = {
  openModalForm: PropTypes.bool.isRequired,
  refetchGetEvents: PropTypes.func.isRequired,
  ModalFormCmpt: PropTypes.func,
  useNotificationFn: PropTypes.func,
  useCreateAnEventFn: PropTypes.func,
  useFormFn: PropTypes.func,
  combineOnSubmitFn: PropTypes.func,
  combineOnClearFn: PropTypes.func,
  handleCloseModalFormFn: PropTypes.func.isRequired,
};

ModalFormContainer.defaultProps = {
  ModalFormCmpt: ModalForm,
  useNotificationFn: useNotification,
  useCreateAnEventFn: useCreateAnEvent,
  useFormFn: useForm,
  combineOnSubmitFn: combineOnSubmit,
  combineOnClearFn: combineOnClear,
};

export default ModalFormContainer;
