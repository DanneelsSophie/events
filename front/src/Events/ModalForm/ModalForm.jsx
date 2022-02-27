import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  FormHelperText,
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';

import frLocale from 'date-fns/locale/fr';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import {
  NAME,
  START_DATE,
  END_DATE,
  DESCRIPTION,
  LABEL_NAME,
  LABEL_START_DATE,
  LABEL_DESCRIPTION,
  LABEL_END_DATE,
  ERROR_IS_BEFORE,
  ERROR_NAME,
  ERROR_DESCRIPTION,
  TITLE_MODAL,
  MIN_DATE,
  MAX_DATE,
} from './constants';

const ModalForm = ({
  handleCloseModalFormFn,
  fieldsFormModal,
  errorsFormModal,
  onChangeFormFn,
  stateNotification,
  isDisabledButtonForm,
  openModalForm,
  onSubmitModalFormFn,
  onCancelModalFormFn,
}) => (
  <>
    {stateNotification.open ? (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={stateNotification.open}
        key="topright"
      >
        <Alert severity={stateNotification.type} sx={{ width: '100%' }}>
          {stateNotification.message}
        </Alert>
      </Snackbar>
    ) : (
      <></>
    )}
    <Modal
      className="modal__form"
      open={openModalForm}
      onClose={handleCloseModalFormFn}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          maxWidth: '800px',
        }}
        className="Form"
      >
        <Stack className="modal__form-body" mt={2} direction="column" spacing={3}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {TITLE_MODAL}
          </Typography>
          <TextField
            required
            error={!!errorsFormModal[ERROR_NAME]}
            sx={{ width: '80%' }}
            helperText={errorsFormModal[ERROR_NAME]}
            id="standard-basic"
            label={LABEL_NAME}
            onChange={onChangeFormFn}
            variant="standard"
            {...fieldsFormModal[NAME]}
          />

          <LocalizationProvider dateAdapter={DateAdapter} locale={frLocale}>
            <DateTimePicker
              label={LABEL_START_DATE}
              value={fieldsFormModal[START_DATE].value}
              onChange={event => onChangeFormFn({ target: { name: START_DATE, value: event } })}
              renderInput={params => <TextField {...params} {...fieldsFormModal[START_DATE]} />}
              ampm={false}
              minDateTime={MIN_DATE}
              maxDateTime={MAX_DATE}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={DateAdapter} locale={frLocale}>
            <DateTimePicker
              label={LABEL_END_DATE}
              value={fieldsFormModal[END_DATE].value}
              onChange={event => onChangeFormFn({ target: { name: END_DATE, value: event } })}
              renderInput={params => <TextField {...params} {...fieldsFormModal[END_DATE]} />}
              ampm={false}
              minDateTime={MIN_DATE}
              maxDateTime={MAX_DATE}
            />
          </LocalizationProvider>
          {errorsFormModal[ERROR_IS_BEFORE] !== '' && (
            <FormHelperText error id="component-error-text" variant="outlined">
              {errorsFormModal[ERROR_IS_BEFORE]}
            </FormHelperText>
          )}
          <TextField
            required
            id="outlined-basic"
            error={!!errorsFormModal[ERROR_DESCRIPTION]}
            helperText={errorsFormModal[ERROR_DESCRIPTION]}
            label={LABEL_DESCRIPTION}
            multiline
            rows={4}
            variant="filled"
            onChange={onChangeFormFn}
            {...fieldsFormModal[DESCRIPTION]}
          />
        </Stack>
        <Stack
          mt={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Button
            sx={{
              backgroundColor: 'red',
              ':hover': { backgroundColor: 'red' },
            }}
            variant="contained"
            onClick={onCancelModalFormFn}
          >
            Annuler
          </Button>
          <Button disabled={isDisabledButtonForm} variant="contained" onClick={onSubmitModalFormFn}>
            Sauvegarder
          </Button>
        </Stack>
      </Box>
    </Modal>
  </>
);

ModalForm.propTypes = {
  handleCloseModalFormFn: PropTypes.func.isRequired,
  fieldsFormModal: PropTypes.shape({
    name: PropTypes.shape({ name: PropTypes.string, value: PropTypes.string }),
    description: PropTypes.shape({
      description: PropTypes.string,
      value: PropTypes.string,
    }),
    startDate: PropTypes.shape({
      startDate: PropTypes.string,
      value: PropTypes.instanceOf(Date),
    }),
    endDate: PropTypes.shape({
      endDate: PropTypes.string,
      value: PropTypes.instanceOf(Date),
    }),
  }).isRequired,
  errorsFormModal: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    isBefore: PropTypes.string,
  }).isRequired,
  onChangeFormFn: PropTypes.func.isRequired,
  stateNotification: PropTypes.shape({
    open: PropTypes.bool,
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  isDisabledButtonForm: PropTypes.bool.isRequired,
  openModalForm: PropTypes.bool.isRequired,
  onSubmitModalFormFn: PropTypes.func.isRequired,
  onCancelModalFormFn: PropTypes.func.isRequired,
};
ModalForm.defaultProps = {};

export default ModalForm;
