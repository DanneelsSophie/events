import { render, screen, fireEvent, within } from '@testing-library/react';
import ModalForm from './ModalForm';
import {
  NAME,
  START_DATE,
  END_DATE,
  DESCRIPTION,
  ERROR_IS_BEFORE,
  ERROR_NAME,
  ERROR_DESCRIPTION,
} from './constants';

describe('<ModalForm/>', () => {
  const stateModalForm = {
    handleCloseModalFormFn: jest.fn(),
    fieldsFormModal: {
      [NAME]: { name: NAME, value: 'Meet Up prog fonctionnel' },
      [START_DATE]: {
        name: START_DATE,
        value: new Date('2019-04-13T00:00:00.000'),
      },
      [END_DATE]: {
        name: END_DATE,
        value: new Date('2020-04-13T00:00:00.000'),
      },
      [DESCRIPTION]: { name: DESCRIPTION, value: 'description' },
    },
    errorsFormModal: {
      [ERROR_IS_BEFORE]: undefined,
      [ERROR_NAME]: undefined,
      [ERROR_DESCRIPTION]: undefined,
    },
    onChangeFormFn: jest.fn(),
    stateNotification: {
      open: true,
      message: 'ajout avec succès',
      type: 'success',
    },
    openModalForm: true,
    isDisabledButtonForm: true,
    onSubmitModalFormFn: jest.fn(),
    onCancelModalFormFn: jest.fn(),
  };

  test('should ModalForm render with errors undefined', () => {
    const { baseElement } = render(<ModalForm {...stateModalForm} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should ModalForm render without errors and button is active', () => {
    const { baseElement } = render(
      <ModalForm
        {...stateModalForm}
        errorsFormModal={{
          [ERROR_IS_BEFORE]: '',
          [ERROR_NAME]: '',
          [ERROR_DESCRIPTION]: '',
        }}
        isDisabledButtonForm={false}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  test('should ModalForm render when there are errors ', () => {
    const { baseElement } = render(
      <ModalForm
        {...stateModalForm}
        fieldsFormModal={{
          [NAME]: { name: NAME, value: 'Un texte trop long' },
          [START_DATE]: {
            name: START_DATE,
            value: new Date('2050-04-13T00:21:00.000'),
          },
          [END_DATE]: {
            name: END_DATE,
            value: new Date('2010-04-13T00:00:00.000'),
          },
          [DESCRIPTION]: { name: DESCRIPTION, value: '' },
        }}
        errorsFormModal={{
          [ERROR_IS_BEFORE]: 'erreur de date',
          [ERROR_NAME]: 'erreur de nom',
          [ERROR_DESCRIPTION]: 'erreur de description',
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
  test('should ModalForm render with notification error', () => {
    const { baseElement } = render(
      <ModalForm
        {...stateModalForm}
        stateNotification={{
          open: true,
          message: 'ajout avec échec',
          type: 'error',
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
  test('should ModalForm render with notification close', () => {
    const { baseElement } = render(
      <ModalForm
        {...stateModalForm}
        stateNotification={{
          open: false,
          message: 'ajout avec échec',
          type: 'error',
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
  test('should ModalForm render when modal is closed', () => {
    const { baseElement } = render(<ModalForm {...stateModalForm} openModalForm={false} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should call function onSubmitModalFormFn when the user clicks on the button Sauvegarder is active', () => {
    render(<ModalForm {...stateModalForm} isDisabledButtonForm={false} />);

    fireEvent.click(screen.getByText(/Sauvegarder/i));
    expect(stateModalForm.onSubmitModalFormFn).toHaveBeenCalled();
  });

  it('should call function onSubmitModalFormFn when the user clicks on the button Sauvegarder is disabled', () => {
    render(<ModalForm {...stateModalForm} />);

    fireEvent.click(screen.getByText(/Sauvegarder/i));
    expect(stateModalForm.onSubmitModalFormFn).not.toHaveBeenCalled();
  });

  it('should call function onCancelModalFormFn when the user clicks on the button Annuler', () => {
    render(<ModalForm {...stateModalForm} />);

    fireEvent.click(screen.getByText(/Annuler/i));
    expect(stateModalForm.onCancelModalFormFn).toHaveBeenCalled();
  });

  it('should call function when the user writes on the name field', () => {
    render(<ModalForm {...stateModalForm} />);
    const inputElement = screen.getByDisplayValue('Meet Up prog fonctionnel');

    fireEvent.change(inputElement, { target: { value: 'Meet up' } });
    expect(stateModalForm.onChangeFormFn).toHaveBeenCalled();
  });

  it.each`
    field            | valueField                    | value
    ${'description'} | ${'Meet Up prog fonctionnel'} | ${'nouvelle value Meet Up prog fonctionnel'}
    ${'name'}        | ${'description'}              | ${'nouvelle value description'}
  `('should call function when the user writes on the $field field', ({ valueField, value }) => {
    render(<ModalForm {...stateModalForm} />);
    const inputElement = screen.getByDisplayValue(valueField);

    fireEvent.change(inputElement, { target: { value } });
    expect(stateModalForm.onChangeFormFn).toHaveBeenCalled();
  });

  it('should call function when the user chooses on the endDate and the startDate field', () => {
    render(
      <ModalForm
        {...stateModalForm}
        fieldsFormModal={{
          [NAME]: { name: NAME, value: 'Un texte trop long' },
          [START_DATE]: {
            name: START_DATE,
            value: new Date('2010-04-13T00:21:00.000'),
          },
          [END_DATE]: {
            name: END_DATE,
            value: new Date('2010-04-14T00:00:00.000'),
          },
          [DESCRIPTION]: { name: DESCRIPTION, value: '' },
        }}
      />,
    );
    let modal = screen.getByRole('presentation');

    fireEvent.click(within(modal).getByLabelText('Choose date, selected date is 13 avr. 2010'));
    let date = screen.getByRole('button', {
      name: '1 avr. 2010',
    });
    fireEvent.click(date);
    expect(stateModalForm.onChangeFormFn).toHaveBeenCalled();

    fireEvent.click(within(modal).getByLabelText('Choose date, selected date is 14 avr. 2010'));
    date = screen.getByRole('button', {
      name: '2 avr. 2010',
    });
    fireEvent.click(date);
    expect(stateModalForm.onChangeFormFn).toHaveBeenCalled();
  });
});
