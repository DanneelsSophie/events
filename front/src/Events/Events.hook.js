import { useState } from 'react';
import { useQuery } from 'react-query';
import fetch from 'cross-fetch';

import {
  SERVICE_NAME,
  API_ERROR_MESSAGE,
  MESSAGE_LOADING,
  MESSAGE_ERROR,
  STATUS_KEY,
} from './constants';

export const getEvents = async ({ fetchFn = fetch, urlApi = process.env.REACT_APP_BASE_API_URL }) =>
  fetchFn(`${urlApi}/events`, {
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      throw new Error(API_ERROR_MESSAGE);
    }
    return res.json();
  });

export const getMessageApi = (isError, isLoading) => {
  if (isLoading) return MESSAGE_LOADING;
  if (isError) return MESSAGE_ERROR;
  return '';
};

export const getStatus = ({ startDate, endDate }) => {
  if (new Date(endDate) < new Date()) {
    return STATUS_KEY.PAST;
  }
  if (new Date(startDate) > new Date()) {
    return STATUS_KEY.NEXT;
  }
  return STATUS_KEY.CURRENT;
};

export const useGetEvents = ({ useQueryFn = useQuery, getMessageApiFn = getMessageApi }) => {
  const { data, refetch, isError, isLoading } = useQueryFn(SERVICE_NAME, getEvents);
  const messageApi = getMessageApiFn(isError, isLoading);

  return {
    data: data?.map(event => ({ ...event, status: getStatus(event) })),
    refetch,
    messageApi,
  };
};

export const useModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return { handleClose, handleOpen, open };
};
