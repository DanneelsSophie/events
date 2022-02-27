import React from 'react';
import { render } from '@testing-library/react';
import ModalFormContainer, { combineOnClear, combineOnSubmit } from './ModalForm.container';

describe('<ModalFormContainer/>', () => {
  it('combineOnSubmit', () => {
    const handleCloseModalFormFn = jest.fn().mockReturnValue('handleCloseModalForm');
    const onClearForm = jest.fn().mockReturnValue('onClearForm');
    const functionMutate = jest.fn();
    const createAnEvent = {
      mutate: functionMutate,
    };

    combineOnSubmit({
      handleCloseModalFormFn,
      onClearForm,
      createAnEvent,
      stateForm: { name: 'CombineOnSubmit', value: 'testSurlaFonction' },
    });

    expect(handleCloseModalFormFn).toHaveBeenCalledWith();
    expect(onClearForm).toHaveBeenCalledWith();
    expect(functionMutate).toHaveBeenCalledWith({
      name: 'CombineOnSubmit',
      value: 'testSurlaFonction',
    });
  });

  it('combineOnClear', () => {
    const handleCloseModalFormFn = jest.fn().mockReturnValue('handleCloseModalForm');
    const onClearForm = jest.fn().mockReturnValue('onClearForm');

    combineOnClear({ handleCloseModalFormFn, onClearForm });

    expect(handleCloseModalFormFn).toHaveBeenCalledWith();
    expect(onClearForm).toHaveBeenCalledWith();
  });

  it('should verify functions is called when render EventContainer', () => {
    const useNotificationFn = jest.fn().mockReturnValue({
      stateNotification: { type: 'success' },
      setStateNotification: jest.fn().mockReturnValue('setStateNotification'),
    });
    const useCreateAnEventFn = jest.fn().mockReturnValue({
      createAnEvent: jest.fn().mockReturnValue('createAnEvent'),
    });
    const useFormFn = jest.fn().mockReturnValue({
      stateForm: { fields: { name: { name: 'name', value: 'Meet-up' } } },
      onChangeForm: jest.fn().mockReturnValue('onChangeForm'),
      onClearForm: jest.fn().mockReturnValue('onClearForm'),
    });

    const ModalFormCmpt = jest.fn().mockReturnValue('ModalFormCmpt');
    const handleCloseModalFormFn = jest.fn().mockReturnValue('handleCloseModalForm');
    const refetchGetEvents = jest.fn().mockReturnValue('refetchGetEvents');
    const combineOnSubmitFn = jest.fn().mockReturnValue('combineOnSubmitFn');
    const combineOnClearFn = jest.fn().mockReturnValue('combineOnClearFn');

    const { baseElement } = render(
      <ModalFormContainer
        openModalForm
        handleCloseModalFormFn={handleCloseModalFormFn}
        refetchGetEvents={refetchGetEvents}
        ModalFormCmpt={ModalFormCmpt}
        useNotificationFn={useNotificationFn}
        useCreateAnEventFn={useCreateAnEventFn}
        useFormFn={useFormFn}
        combineOnSubmitFn={combineOnSubmitFn}
        combineOnClearFn={combineOnClearFn}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(ModalFormCmpt).toHaveBeenCalledWith(
      {
        errorsFormModal: undefined,
        fieldsFormModal: { name: { name: 'name', value: 'Meet-up' } },
        handleCloseModalFormFn: expect.any(Function),
        isDisabledButtonForm: undefined,
        onCancelModalFormFn: expect.any(Function),
        onChangeFormFn: expect.any(Function),
        onSubmitModalFormFn: expect.any(Function),
        openModalForm: true,
        stateNotification: { type: 'success' },
      },
      {},
    );

    expect(ModalFormCmpt.mock.calls[0][0].handleCloseModalFormFn()).toBe('handleCloseModalForm');
    expect(ModalFormCmpt.mock.calls[0][0].onCancelModalFormFn()).toBe('combineOnClearFn');
    expect(combineOnClearFn).toHaveBeenCalledWith({
      handleCloseModalFormFn: expect.any(Function),
      onClearForm: expect.any(Function),
    });

    expect(ModalFormCmpt.mock.calls[0][0].onChangeFormFn()).toBe('onChangeForm');

    expect(ModalFormCmpt.mock.calls[0][0].onSubmitModalFormFn()).toBe('combineOnSubmitFn');
    expect(combineOnSubmitFn).toHaveBeenCalledWith({
      createAnEvent: expect.any(Function),
      handleCloseModalFormFn: expect.any(Function),
      onClearForm: expect.any(Function),
      stateForm: { fields: { name: { name: 'name', value: 'Meet-up' } } },
    });
  });
});
