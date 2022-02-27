import { render, screen, getByText, fireEvent } from '@testing-library/react';
import timezoneMock from 'timezone-mock';

import Events from './Events';

describe('<Events/>', () => {
  const openFormModalCt = true;
  const openFormModalFn = jest.fn();
  const closeFormModalFn = jest.fn();
  const refetchGetEvents = jest.fn();
  function ModalFormCmpt() {
    return <p>ModalForm</p>;
  }

  beforeAll(() => {
    timezoneMock.register('US/Pacific');
  });

  afterAll(() => {
    timezoneMock.unregister();
  });

  it('should Events render when API is KO or Loading displays a message', () => {
    const { baseElement } = render(
      <Events
        events={[]}
        messageApi="ERROR"
        openFormModalCt={openFormModalCt}
        openFormModalFn={openFormModalFn}
        closeFormModalFn={closeFormModalFn}
        refetchGetEvents={refetchGetEvents}
        ModalFormCmpt={ModalFormCmpt}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('ERROR')).toBeInTheDocument();
    expect(screen.queryByText('Ajouter un évènement')).toBeNull();
  });

  it('should Events render when API is OK with empty list events', () => {
    const { baseElement } = render(
      <Events
        messageApi=""
        events={[]}
        openFormModalCt={openFormModalCt}
        openFormModalFn={openFormModalFn}
        closeFormModalFn={closeFormModalFn}
        refetchGetEvents={refetchGetEvents}
        ModalFormCmpt={ModalFormCmpt}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should Events render when API is OK with one event', () => {
    const { baseElement } = render(
      <Events
        events={[
          {
            _id: '12',
            status: 'CURRENT',
            name: "nom de l'évènement",
            startDate: '1992-04-14T16:00:00.000Z',
            endDate: '2000-04-14T16:00:00.000Z',
            description:
              'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défiee',
          },
        ]}
        messageApi=""
        openFormModalCt={openFormModalCt}
        openFormModalFn={openFormModalFn}
        closeFormModalFn={closeFormModalFn}
        refetchGetEvents={refetchGetEvents}
        ModalFormCmpt={ModalFormCmpt}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should Events render when API is OK with three events', () => {
    const { baseElement } = render(
      <Events
        events={[
          {
            _id: '0',
            status: 'PAST',
            name: "nom de l'évènement",
            startDate: '2000-04-14T16:00:00.000Z',
            endDate: '2020-04-14T16:00:00.000Z',
            description:
              'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défiee',
          },
          {
            _id: '1',
            status: 'NEXT',
            name: "nom de l'évènement 1",
            startDate: '2001-04-14T16:00:00.000Z',
            endDate: '2021-04-14T16:00:00.000Z',
            description:
              'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défiee',
          },
          {
            _id: '2',
            status: 'CURRENT',
            name: "nom de l'évènement 1",
            startDate: '2001-04-14T16:00:00.000Z',
            endDate: '2030-04-14T16:00:00.000Z',
            description:
              'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défiee',
          },
        ]}
        messageApi=""
        openFormModalCt={openFormModalCt}
        openFormModalFn={openFormModalFn}
        closeFormModalFn={closeFormModalFn}
        refetchGetEvents={refetchGetEvents}
        ModalFormCmpt={ModalFormCmpt}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should call function openFormModalFn when the user clicks on the button  Ajouter un évènement', () => {
    render(
      <Events
        messageApi=""
        events={[]}
        openFormModalCt={openFormModalCt}
        openFormModalFn={openFormModalFn}
        closeFormModalFn={closeFormModalFn}
        refetchGetEvents={refetchGetEvents}
        ModalFormCmpt={ModalFormCmpt}
      />,
    );

    fireEvent.click(screen.getByText(/Ajouter un évènement/i));
    expect(openFormModalFn).toHaveBeenCalled();
  });
});
