import React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import {
  AppBar,
  CardContent,
  Typography,
  Card,
  Toolbar,
  Button,
  CardMedia,
  Chip,
  Stack,
} from '@mui/material';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

import ModalForm from './ModalForm';
import { TITLE, STATUS } from './constants';
import './Events.scss';

const CardEvent = ({ name, description, startDate, endDate, status }) => (
  <Card className="events__list__event">
    <CardContent sx={{ display: 'flex' }}>
      <CardMedia
        component="img"
        sx={{ minWidth: '100px', width: '20%', marginRight: '10px' }}
        image="./event.jpg"
        alt="image évènement"
      />
      <Stack direction="column" spacing={2}>
        <Typography gutterBottom variant="h4" component="div">
          {name}
          <Chip
            className="events__list__event__badge"
            color={STATUS[status].color}
            label={STATUS[status].text}
            size="small"
          />
        </Typography>

        <Typography gutterBottom variant="h6" component="div">
          du {format(new Date(startDate), 'eee dd MMM yyyy à HH:mm (OOOO) ', { locale: fr })}
          au {format(new Date(endDate), 'eee dd MMM yyyy à HH:mm (OOOO)', { locale: fr })}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {description}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

CardEvent.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

const Events = ({
  messageApi,
  events,
  openFormModalCt,
  openFormModalFn,
  closeFormModalFn,
  refetchGetEvents,
  ModalFormCmpt,
}) => (
  <div className="events">
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">{TITLE}</Typography>
      </Toolbar>
    </AppBar>
    {messageApi !== '' ? (
      <h1>{messageApi}</h1>
    ) : (
      <div>
        <div className="events__list">
          {events &&
            events.map(({ _id, name, description, startDate, endDate, status }) => (
              <CardEvent
                key={_id}
                status={status}
                name={name}
                description={description}
                startDate={startDate}
                endDate={endDate}
              />
            ))}
        </div>
        <ModalFormCmpt
          openModalForm={openFormModalCt}
          handleCloseModalFormFn={closeFormModalFn}
          refetchGetEvents={refetchGetEvents}
        />
        <div className="events__button">
          <Button onClick={openFormModalFn} endIcon={<AddIcon />} variant="contained">
            Ajouter un évènement
          </Button>
        </div>
      </div>
    )}
  </div>
);

Events.propTypes = {
  messageApi: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      status: PropTypes.string,
    }),
  ).isRequired,
  openFormModalCt: PropTypes.bool.isRequired,
  openFormModalFn: PropTypes.func.isRequired,
  closeFormModalFn: PropTypes.func.isRequired,
  refetchGetEvents: PropTypes.func.isRequired,
  ModalFormCmpt: PropTypes.func,
};
Events.defaultProps = { ModalFormCmpt: ModalForm };

export default Events;
