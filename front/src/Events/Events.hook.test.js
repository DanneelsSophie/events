import { renderHook, act } from '@testing-library/react-hooks';
import { useGetEvents, getEvents, useModal, getMessageApi } from './Events.hook';

describe('EventsHook', () => {
  describe(' - API', () => {
    describe('useGetEvents', () => {
      const returnedQuery = {
        data: { events: [{ name: 'Santane' }, { name: 'test' }] },
        refetch: () => 'value returned by refetch',
        hasErrors: false,
      };
      it('should return the message when the getEvents is called', () => {
        const useQueryFn = jest.fn().mockReturnValue(returnedQuery);
        const getMessageApiFn = jest.fn().mockReturnValue("Une erreur s'est produite");

        const res = useGetEvents({ useQueryFn, getMessageApiFn });
        expect(JSON.stringify(res)).toBe(
          JSON.stringify({
            data: { events: [{ name: 'Santane' }, { name: 'test' }] },
            messageApi: "Une erreur s'est produite",
            refetch: () => 'value returned by refetch',
          }),
        );
        expect(res.refetch()).toBe('value returned by refetch');
        expect(useQueryFn).toHaveBeenCalledWith('getEvents', expect.any(Function));
      });
      it('should return the message when the getEvents is called with getMessageByDefault', () => {
        const useQueryFn = jest.fn().mockReturnValue(returnedQuery);

        const res = useGetEvents({ useQueryFn });
        expect(JSON.stringify(res)).toBe(
          JSON.stringify({
            data: { events: [{ name: 'Santane' }, { name: 'test' }] },
            messageApi: '',
            refetch: () => 'value returned by refetch',
          }),
        );
        expect(res.refetch()).toBe('value returned by refetch');
        expect(useQueryFn).toHaveBeenCalledWith('getEvents', expect.any(Function));
      });
    });

    describe('getMessageApi', () => {
      it('should return the loading message when the isError: true and isLoading: true', () => {
        expect(getMessageApi(true, true)).toBe('Loading ...');
      });
      it('should return the loading message when the isError: false and isLoading: true', () => {
        expect(getMessageApi(false, true)).toBe('Loading ...');
      });
      it('should return the error message when the isError: true and isLoading: false', () => {
        expect(getMessageApi(true, false)).toBe(
          "Si vous voyez ce message, veuillez contacter le service technique. L'application n'est pas fonctionnelle",
        );
      });
      it('should return the empty message when the isError: false and isLoading: false', () => {
        expect(getMessageApi(false, false)).toBe('');
      });
    });

    describe('getEvents', () => {
      it('should return the data when the fetchGetEvents is successed', async () => {
        const fetchFn = jest.fn().mockResolvedValue({
          ok: true,
          json: () => 'Santane',
        });

        await expect(getEvents({ fetchFn })).resolves.toBe('Santane');
        expect(fetchFn).toHaveBeenCalledWith('http://localhost:2000/v1/events', { method: 'GET' });
      });

      it('should return the data when the fetchGetEvents is successed', async () => {
        const fetchFn = jest.fn().mockResolvedValue({
          ok: true,
          json: () => 'Santane',
        });

        await expect(getEvents({ fetchFn, urlApi: 'url-test-succes' })).resolves.toBe('Santane');
        expect(fetchFn).toHaveBeenCalledWith('url-test-succes/events', {
          method: 'GET',
        });
      });
      it('should return an error when the fetchGetEvents is failed', async () => {
        const fetchFn = jest.fn().mockResolvedValue({});

        await expect(getEvents({ fetchFn, urlApi: 'url-test-failed' })).rejects.toThrow(
          'Veuillez contacter le service technique !',
        );
        expect(fetchFn).toHaveBeenCalledWith('url-test-failed/events', {
          method: 'GET',
        });
      });
    });
  });
  describe(' - Modal', () => {
    it('should return open true when the handleOpen is called', () => {
      const { result } = renderHook(() => useModal({}));

      expect(result.current.open).toBeFalsy();
      act(() => result.current.handleOpen());
      expect(result.current.open).toBeTruthy();
    });

    it('should return open false when the handleClose is called', () => {
      const { result } = renderHook(() => useModal({}));

      expect(result.current.open).toBeFalsy();
      act(() => result.current.handleClose());
      expect(result.current.open).toBeFalsy();
    });
  });
});
