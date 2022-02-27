import { render } from '@testing-library/react';
import App from './App';

describe('<App/>', () => {
  test('should app render without crashing', () => {
    const Events = () => 'Events';
    const { baseElement } = render(<App EventsCmpt={Events} />);
    expect(baseElement).toMatchSnapshot();
  });
});
