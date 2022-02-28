import { defineFeature, loadFeature } from 'jest-cucumber';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, waitFor } from '@testing-library/react';

import App from '../src/App';

const events = [
  {
    _id: '6214ab5d8b73a80588ed567e',
    endDate: '2043-04-12T16:00:00.000Z',
    startDate: '2020-04-12T16:00:00.000Z',
    description:
      'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee',
    name: '012345678901234567890123456789',
  },

  {
    _id: '6214ac29c89d49420d639878',
    endDate: '2013-04-12T16:00:00.000Z',
    startDate: '2012-04-12T16:00:00.000Z',
    description:
      'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défie',
    name: '012345678901234567890123456789',
  },
  {
    _id: '6214ac49c89d49420d63987b',
    endDate: '2053-04-12T16:00:00.000Z',
    startDate: '2050-04-12T16:00:00.000Z',
    description:
      'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défie',
    name: '012345678901234567890123456789',
  },
  {
    _id: '6214ac63c89d49420d63987e',
    endDate: '2043-04-12T16:00:00.000Z',
    startDate: '2020-04-12T16:00:00.000Z',
    description:
      'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee',
    name: '012345678901234567890123456789',
  },
];
const feature = loadFeature('Features/01 - Evenement/affichageDesEvenements.feature');
defineFeature(feature, test => {
  let apiGetCalled = 0;

  const worker = setupServer(
    rest.get('http://localhost:2000/v1/events', (req, res, ctx) => {
      apiGetCalled += 1;
      if (apiGetCalled == 1) return res(ctx.status(4532), ctx.json({}));
      else return res(ctx.status(200), {});
    }),
  );

  // establish API mocking before all tests
  beforeAll(() => {
    worker.listen();
  });
  // reset any request handlers that are declared as a part of our tests
  // (i.e. for testing one-time error scenarios)
  afterEach(() => {
    worker.resetHandlers();
  });
  // clean up once the tests are done
  afterAll(() => {
    worker.close();
    apiGetCalled = 0;
  });

  test.only('Affichage de la page avec des évènements', ({ given, when, then, and }) => {
    let modal;
    given('je suis un utilisateur', () => {});
    when('je suis sur la page principale', () => {
      render(<App />);
    });
    then('je visualise les évènements', async () => {
      //screen.debug();
      await waitFor(() =>
        expect(
          screen.getByText(
            "Si vous voyez ce message, veuillez contacter le service technique. L'application n'est pas fonctionnelle",
          ),
        ).toBeDefined(),
      );

      //expect(screen.getByAltText('Kumojin')).toBeDefined();
    });

    /**then(/^la modale apparait avec le titre : "(.*)"$/, titreModal => {
      //modal = screen.getByRole('presentation');
      // expect(within(modal).getByText(titreModal)).toBeDefined();
    });*/
  });
});
