import React from 'react';
import { render } from '@testing-library/react';
import EventsContainer from './Events.container';

describe('<EventsContainer/>', () => {
  it('should verify functions is called when render EventContainer', () => {
    const events = [
      {
        _id: 'test',
        name: 'name',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    const useModalFn = jest.fn().mockReturnValue({
      open: true,
      handleOpen: jest.fn().mockReturnValue('handleOpen'),
      handleClose: jest.fn().mockReturnValue('handleClose'),
    });
    const useGetEventsFn = jest.fn().mockReturnValue({
      messageApi: 'Veuillez contacter...',
      refetch: jest.fn().mockReturnValue('refetch'),
      data: events,
    });
    const EventsCmpt = jest.fn().mockReturnValue('EventsCmpt');
    const { baseElement } = render(
      <EventsContainer
        useModalFn={useModalFn}
        useGetEventsFn={useGetEventsFn}
        EventsCmpt={EventsCmpt}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(useGetEventsFn).toHaveBeenCalled();
    expect(useModalFn).toHaveBeenCalled();
    expect(EventsCmpt).toHaveBeenCalledWith(
      {
        closeFormModalFn: expect.any(Function),
        openFormModalFn: expect.any(Function),
        events,
        messageApi: 'Veuillez contacter...',
        openFormModalCt: true,
        refetchGetEvents: expect.any(Function),
      },
      {},
    );
    expect(EventsCmpt.mock.calls[0][0].openFormModalFn()).toBe('handleOpen');
    expect(EventsCmpt.mock.calls[0][0].closeFormModalFn()).toBe('handleClose');
    expect(EventsCmpt.mock.calls[0][0].refetchGetEvents()).toBe('refetch');
  });
  it('should verify functions is called with empty array when render EventContainer and events is undefined', () => {
    const events = undefined;

    const useModalFn = jest.fn().mockReturnValue({
      open: true,
      handleOpen: jest.fn().mockReturnValue('handleOpen'),
      handleClose: jest.fn().mockReturnValue('handleClose'),
    });
    const useGetEventsFn = jest.fn().mockReturnValue({
      messageApi: '',
      refetch: jest.fn().mockReturnValue('refetch'),
      data: events,
    });
    const EventsCmpt = jest.fn().mockReturnValue('EventsCmpt');
    const { baseElement } = render(
      <EventsContainer
        useModalFn={useModalFn}
        useGetEventsFn={useGetEventsFn}
        EventsCmpt={EventsCmpt}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(useGetEventsFn).toHaveBeenCalled();
    expect(useModalFn).toHaveBeenCalled();
    expect(EventsCmpt).toHaveBeenCalledWith(
      {
        closeFormModalFn: expect.any(Function),
        openFormModalFn: expect.any(Function),
        messageApi: '',
        events: [],
        openFormModalCt: true,
        refetchGetEvents: expect.any(Function),
      },
      {},
    );
    expect(EventsCmpt.mock.calls[0][0].openFormModalFn()).toBe('handleOpen');
    expect(EventsCmpt.mock.calls[0][0].closeFormModalFn()).toBe('handleClose');
    expect(EventsCmpt.mock.calls[0][0].refetchGetEvents()).toBe('refetch');
  });
});
