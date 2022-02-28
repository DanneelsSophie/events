import PropTypes from 'prop-types';

import React from 'react';
import Events from './Events';
import { useModal, useGetEvents } from './Events.hook';

function EventsContainer({ useModalFn, useGetEventsFn, EventsCmpt }) {
  const { open, handleOpen, handleClose } = useModalFn({});
  const { refetch, data, messageApi } = useGetEventsFn({});
  console.log(data);
  return (
    <EventsCmpt
      messageApi={messageApi}
      refetchGetEvents={refetch}
      openFormModalCt={open}
      openFormModalFn={handleOpen}
      closeFormModalFn={handleClose}
      events={data ?? []}
    />
  );
}

EventsContainer.propTypes = {
  useModalFn: PropTypes.func,
  useGetEventsFn: PropTypes.func,
  EventsCmpt: PropTypes.func,
};

EventsContainer.defaultProps = {
  useModalFn: useModal,
  useGetEventsFn: useGetEvents,
  EventsCmpt: Events,
};

export default EventsContainer;
