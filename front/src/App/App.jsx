import PropTypes from 'prop-types';
import { QueryClientProvider, QueryClient } from 'react-query';

import Events from '../Events';

const queryClient = new QueryClient();
const App = ({ EventsCmpt }) => (
  <QueryClientProvider client={queryClient}>
    <EventsCmpt />
  </QueryClientProvider>
);

App.propTypes = {
  EventsCmpt: PropTypes.func,
};

App.defaultProps = {
  EventsCmpt: Events,
};

export default App;
