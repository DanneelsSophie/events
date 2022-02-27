import { renderHook, act } from '@testing-library/react-hooks';
import {
  getErrorMessage,
  isIncorrectString,
  isIncorrectBeforeDate,
  isIncorrectName,
  isIncorrectDescription,
  genericHandleError,
  genericHandleChange,
  getHasErrors,
  useForm,
  postAnEvent,
  useCreateAnEvent,
  onErrorResponseCreatedAnEvent,
  onSuccessResponseCreatedAnEvent,
  useNotification,
} from './ModalForm.hook';

describe('ModalFormHook', () => {
  describe(' - Form', () => {
    const validateArgs = jest.fn();
    const validateFunctions = {
      name: () => true,
      description: () => true,
      isBefore: () => true,
      test: () => false,
      argsTest: validateArgs,
    };

    describe('getErrorMessage', () => {
      it('should return messageName when getErrorMessage is called and validatefunction returns true', () => {
        expect(getErrorMessage('name', 'arg1')(validateFunctions)).toBe(
          "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)",
        );
      });
      it('should return messageDescription when getErrorMessage is called and validatefunction returns true', () => {
        expect(getErrorMessage('description', 'arg1')(validateFunctions)).toBe(
          "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)",
        );
      });
      it('should return messageIsBefore when getErrorMessage is called and validatefunction returns true', () => {
        expect(getErrorMessage('isBefore', 'arg2')(validateFunctions)).toBe(
          'La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200',
        );
      });
      it('should return empty string when getErrorMessage is called with condition false', () => {
        expect(getErrorMessage('test', 'args1', 2, { test: 'test' })(validateFunctions)).toBe('');
      });

      it('should check args when getErrorMessage is called', () => {
        getErrorMessage('argsTest', 'args1', 2, { test: 'test' })(validateFunctions);
        expect(validateArgs).toHaveBeenCalledWith('args1', 2, {
          test: 'test',
        });
      });
    });

    describe('isIncorrectString', () => {
      it.each`
        minLength | maxLength | value        | expected
        ${1}      | ${5}      | ${''}        | ${true}
        ${2}      | ${6}      | ${'a'}       | ${true}
        ${2}      | ${6}      | ${'  a  '}   | ${true}
        ${2}      | ${6}      | ${'0123456'} | ${true}
        ${2}      | ${6}      | ${'012345'}  | ${false}
        ${1}      | ${6}      | ${'a'}       | ${false}
      `(
        'should return $expected when isIncorrectString is called with value : $value and the length must between $minLength and $maxLength length without spaces',
        ({ minLength, maxLength, value, expected }) => {
          const result = isIncorrectString(minLength, maxLength, value);
          expect(result).toBe(expected);
        },
      );
    });

    describe('isIncorrectName', () => {
      it('should verify params isIncorrectString min, max and name when isIncorrectName is called', () => {
        const isIncorrectStringFn = jest.fn().mockReturnValue(true);
        expect(isIncorrectName('nameValue', isIncorrectStringFn)).toBeTruthy();
        expect(isIncorrectStringFn).toHaveBeenCalledWith(1, 32, 'nameValue');
      });
    });

    describe('isIncorrectDescription', () => {
      it('should verify params isIncorrectString min, max and name when isIncorrectDescription is called', () => {
        const isIncorrectStringFn = jest.fn().mockReturnValue(true);
        expect(isIncorrectDescription('descriptionValue', isIncorrectStringFn)).toBeTruthy();
        expect(isIncorrectStringFn).toHaveBeenCalledWith(1, 200, 'descriptionValue');
      });
    });

    describe('isIncorrectBeforeDate', () => {
      it.each`
        name           | value                                        | fields                                                                 | expected
        ${'endDate'}   | ${new Date('2018-04-13T00:00:00.000+01:00')} | ${{ startDate: { value: new Date('2019-04-13T00:00:00.000+01:00') } }} | ${true}
        ${'endDate'}   | ${new Date('2033-04-13T00:00:00.000+01:00')} | ${{ startDate: { value: new Date('2019-04-13T00:00:00.000+01:00') } }} | ${false}
        ${'startDate'} | ${new Date('2018-04-13T00:00:00.000+01:00')} | ${{ endDate: { value: new Date('2019-04-13T00:00:00.000+01:00') } }}   | ${false}
        ${'startDate'} | ${new Date('2033-04-13T00:00:00.000+01:00')} | ${{ endDate: { value: new Date('2019-04-13T00:00:00.000+01:00') } }}   | ${true}
        ${'endDate'}   | ${new Date('2019-04-13T00:00:00.000+01:00')} | ${{ startDate: { value: new Date('2019-04-13T00:00:00.000+01:00') } }} | ${true}
        ${'startDate'} | ${new Date('2019-04-13T00:00:00.000+01:00')} | ${{ endDate: { value: new Date('2019-04-13T00:00:00.000+01:00') } }}   | ${true}
      `(
        'should return $expected when isIncorrectBeforeDate with $name: $value and $fields',
        ({ name, value, fields, expected }) => {
          const result = isIncorrectBeforeDate(name, value, fields);
          expect(result).toBe(expected);
        },
      );
    });

    describe('genericHandleError', () => {
      const callParams = jest.fn();
      const getErrorMessageMock = (param, ...args) =>
        jest.fn().mockImplementation(() => {
          callParams(param, ...args);
          return 'updatedErrors';
        });

      it('should return updated errors when genericHandleError is called with name field', () => {
        const result = genericHandleError(
          { target: { name: 'name', value: 'value' } },
          {},
          { autre: 'test', name: 'erreur' },
          getErrorMessageMock,
        );
        expect(result).toStrictEqual({ autre: 'test', name: 'updatedErrors' });
        expect(callParams).toHaveBeenCalledWith('name', 'value');
      });

      it('should return updated errors when genericHandleError is called with description field', () => {
        const result = genericHandleError(
          { target: { name: 'description', value: 'value' } },
          {
            description: 'description',
            name: 'name',
            autre: 'autre',
            endDate: 'endDate',
            startDate: 'startDate',
          },
          { autre: 'test', name: 'erreur', description: 'updatedErrors' },
          getErrorMessageMock,
        );
        expect(result).toStrictEqual({
          autre: 'test',
          name: 'erreur',
          description: 'updatedErrors',
        });
        expect(callParams).toHaveBeenCalledWith('description', 'value');
      });

      it('should return updated errors when genericHandleError is called with startDate field ', () => {
        const result = genericHandleError(
          { target: { name: 'startDate', value: 'value' } },
          { endDate: 'endDate', startDate: 'startDate' },
          { autre: 'test', name: 'erreur' },
          getErrorMessageMock,
        );
        expect(result).toStrictEqual({
          autre: 'test',
          name: 'erreur',
          isBefore: 'updatedErrors',
        });
        expect(callParams).toHaveBeenCalledWith('isBefore', 'startDate', 'value', {
          endDate: 'endDate',
          startDate: 'startDate',
        });
      });

      it('should return updated errors when genericHandleError is called with endDate field ', () => {
        const result = genericHandleError(
          { target: { name: 'endDate', value: 'value' } },
          {
            description: 'description',
            name: 'name',
            autre: 'autre',
            endDate: 'endDate',
            startDate: 'startDate',
          },
          { autre: 'test', name: 'erreur' },
          getErrorMessageMock,
        );
        expect(result).toStrictEqual({
          autre: 'test',
          name: 'erreur',
          isBefore: 'updatedErrors',
        });
        expect(callParams).toHaveBeenCalledWith('isBefore', 'endDate', 'value', {
          description: 'description',
          name: 'name',
          autre: 'autre',
          endDate: 'endDate',
          startDate: 'startDate',
        });
      });

      it('should return errors when genericHandleError is called with others field ', () => {
        const result = genericHandleError(
          { target: { name: 'other', value: 'value' } },
          {},
          { autre: 'test', name: 'erreur' },
          getErrorMessageMock,
        );
        expect(result).toStrictEqual({ autre: 'test', name: 'erreur' });
        expect(callParams).not.toHaveBeenCalled();
      });
    });

    describe('genericHandleChange', () => {
      it('should return updated fields (name) when genericHandleChange is called', () => {
        const result = genericHandleChange(
          { description: 'description', name: 'name' },
          { target: { name: 'name', value: 'updateValue' } },
        );
        expect(result).toStrictEqual({
          description: 'description',
          name: { name: 'name', value: 'updateValue' },
        });
      });

      it('should return updated fields (description) when genericHandleChange is called', () => {
        const result = genericHandleChange(
          { description: 'description', name: 'name' },
          { target: { name: 'description', value: 'updateValue' } },
        );
        expect(result).toStrictEqual({
          description: { name: 'description', value: 'updateValue' },
          name: 'name',
        });
      });

      it('should return updated fields (autre) when genericHandleChange is called', () => {
        const result = genericHandleChange(
          { description: 'description', name: 'name' },
          { target: { name: 'autre', value: 'updatedValue' } },
        );
        expect(result).toStrictEqual({
          description: 'description',
          name: 'name',
        });
      });
    });

    describe('getHasErrors', () => {
      it.each`
        handleErrors                                                         | expected
        ${{ description: undefined, name: undefined, startDate: undefined }} | ${true}
        ${{ description: '', name: '', startDate: '' }}                      | ${false}
        ${{ description: 'erreur', name: '', startDate: '' }}                | ${true}
        ${{ description: '', name: 'erreur', startDate: '' }}                | ${true}
        ${{ description: 'erreur', name: 'erreur', startDate: 'erreur' }}    | ${true}
      `('should return $expected when getHasErrors is called ', ({ handleErrors, expected }) => {
        expect(getHasErrors(handleErrors)).toBe(expected);
      });
    });

    describe('useForm', () => {
      it('should return initState when useForm is called', () => {
        jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());
        const { result } = renderHook(() => useForm({}));
        expect(result.current.stateForm).toStrictEqual({
          errors: {
            description: undefined,
            isBefore: undefined,
            name: undefined,
          },
          fields: {
            description: { name: 'description', value: '' },
            endDate: {
              name: 'endDate',
              value: new Date('2020-01-01T00:00:00.000Z'),
            },
            name: { name: 'name', value: '' },
            startDate: {
              name: 'startDate',
              value: new Date('2020-01-01T00:00:00.000Z'),
            },
          },
          hasErrors: true,
        });
        jest.useRealTimers();
      });

      it('should verify setonChangeFormFn is called when onChangeForm is called', () => {
        const setOnChangeFormFn = jest.fn();
        const { result } = renderHook(() => useForm({ setOnChangeFormFn }));

        act(() => result.current.onChangeForm());
        expect(setOnChangeFormFn).toHaveBeenCalled();
      });
    });

    it('should return init is called when onClearForm is called', () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());
      const { result } = renderHook(() => useForm({}));
      act(() =>
        result.current.onChangeForm({
          target: { name: 'name', value: 'Santane' },
        }),
      );
      expect(result.current.stateForm).toStrictEqual({
        errors: { description: undefined, isBefore: undefined, name: '' },
        fields: {
          description: { name: 'description', value: '' },
          endDate: {
            name: 'endDate',
            value: new Date('2020-01-01T00:00:00.000Z'),
          },
          name: { name: 'name', value: 'Santane' },
          startDate: {
            name: 'startDate',
            value: new Date('2020-01-01T00:00:00.000Z'),
          },
        },
        hasErrors: true,
      });

      act(() => result.current.onClearForm());
      expect(result.current.stateForm).toStrictEqual({
        errors: {
          description: undefined,
          isBefore: undefined,
          name: undefined,
        },
        fields: {
          description: { name: 'description', value: '' },
          endDate: {
            name: 'endDate',
            value: new Date('2020-01-01T00:00:00.000Z'),
          },
          name: { name: 'name', value: '' },
          startDate: {
            name: 'startDate',
            value: new Date('2020-01-01T00:00:00.000Z'),
          },
        },
        hasErrors: true,
      });
      jest.useRealTimers();
    });
  });
  describe(' - API', () => {
    describe('postAnEvent', () => {
      const fields = {
        description: { name: '   a  description  ', value: 'descriptio' },
        endDate: {
          name: 'endDate',
          value: new Date('2018-04-13T00:00:00.000+01:00'),
        },
        name: { name: 'name', value: '   VisioConférence sur la dyslexie  ' },
        startDate: {
          name: 'startDate',
          value: new Date('2018-04-13T00:00:00.000+01:00'),
        },
      };
      it('should return created name and verify fetch is called when postAnEvent is called with successful', async () => {
        const fetchFn = jest.fn().mockResolvedValue({
          status: 201,
        });

        await expect(postAnEvent(fields, 'url-api-success-post-event', fetchFn)).resolves.toBe(
          'VisioConférence sur la dyslexie',
        );
        expect(fetchFn).toHaveBeenCalledWith('url-api-success-post-event/events', {
          body: '{"name":"VisioConférence sur la dyslexie","description":"descriptio","startDate":"2018-04-12T23:00:00.000Z","endDate":"2018-04-12T23:00:00.000Z"}',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
      });
      it('should return an error when the fetchGetEvents is failed with BAD_REQUEST', async () => {
        const fetchFn = jest.fn().mockResolvedValue({
          status: 400,
        });
        await expect(postAnEvent(fields, 'url-api-failed-post-event', fetchFn)).rejects.toThrow(
          'Veuillez contacter le service technique !',
        );
      });
      it('should return an error when the fetchGetEvents is failed without status', async () => {
        const fetchFn = jest.fn().mockResolvedValue({});
        await expect(postAnEvent(fields, 'url-api-failed-post-event', fetchFn)).rejects.toThrow(
          'Veuillez contacter le service technique !',
        );
      });
    });

    describe('useCreateAnEvent', () => {
      const createdAnEvent = {
        description: 'description',
        name: 'name',
        autre: 'autre',
        endDate: 'endDate',
        startDate: 'startDate',
      };

      it('should return the name of an event when the getEvents is called', () => {
        const useMutationFn = jest.fn().mockReturnValue(createdAnEvent);

        const res = useCreateAnEvent({
          useMutationFn,
        });
        expect(res).toStrictEqual({
          createAnEvent: {
            autre: 'autre',
            description: 'description',
            endDate: 'endDate',
            name: 'name',
            startDate: 'startDate',
          },
        });
        expect(useMutationFn).toHaveBeenCalledWith('createAnEvent', expect.any(Function), {
          onError: expect.any(Function),
          onSuccess: expect.any(Function),
        });
      });
      describe('onErrorResponseCreatedAnEvent', () => {
        it('should call setStateNotificationFn when the onErrorResponseCreatedAnEvent is called', () => {
          const setStateNotificationFn = jest.fn().mockReturnValue();
          const res = onErrorResponseCreatedAnEvent(setStateNotificationFn, {
            message: 'veuillez contacter le support du top',
          });
          expect(res).toBe(undefined);
          expect(setStateNotificationFn).toHaveBeenCalledWith({
            message: 'veuillez contacter le support du top',
            open: true,
            type: 'error',
          });
        });
        describe('onSuccessResponseCreatedAnEvent', () => {
          it('should refetchGetEventsFn,setStateNotificationFn are called when the onSuccessResponseCreatedAnEvent is called', () => {
            const refetchGetEventsFn = jest.fn().mockReturnValue();
            const setStateNotificationFn = jest.fn().mockReturnValue();

            const res = onSuccessResponseCreatedAnEvent(
              refetchGetEventsFn,
              setStateNotificationFn,
              'nom evenement',
            );
            expect(res).toBe(undefined);
            expect(setStateNotificationFn).toHaveBeenCalledWith({
              message: "l'ajout de l'évènement nom evenement est un succès",
              open: true,
              type: 'success',
            });
            expect(refetchGetEventsFn).toHaveBeenCalled();
          });
        });
      });
    });
    describe(' - Notification', () => {
      describe('useNotification', () => {
        it('should return initState when useNotification is called', () => {
          const { result } = renderHook(() => useNotification({}));
          expect(result.current.stateNotification).toStrictEqual({
            open: false,
            type: 'success',
            message: '',
          });
        });
        it('should return updated state when stateNotification is called', () => {
          const { result } = renderHook(() => useNotification({}));
          act(() =>
            result.current.setStateNotification({
              open: true,
              type: 'updatedType',
              message: 'messageTest',
            }),
          );
          expect(result.current.stateNotification).toStrictEqual({
            open: true,
            type: 'updatedType',
            message: 'messageTest',
          });
        });
        it('should change the inital state when handleCloseNotificationForm is called', () => {
          const { result } = renderHook(() => useNotification({}));
          act(() => {
            result.current.setStateNotification({
              open: true,
              type: 'updatedType',
              message: 'messageTest',
            }),
              result.current.handleCloseNotificationForm();
          });
          expect(result.current.stateNotification).toStrictEqual({
            open: false,
            type: 'success',
            message: '',
          });
        });
      });
    });
  });
});
