import { defineFeature, loadFeature } from 'jest-cucumber';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, fireEvent, within, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

const feature = loadFeature('Features/01 - Evenement/creationDUnEvenement.feature');
defineFeature(feature, test => {
  let apiGetCalled = 0;

  const worker = setupServer(
    rest.get('http://localhost:2000/v1/events', (req, res, ctx) => {
      apiGetCalled += 1;

      return res(
        ctx.status(200),
        ctx.json([
          {
            _id: '6215f977b9d920637815d23a',
            status: 'CURRENT',
            endDate: '2083-04-12T23:00:00.000Z',
            startDate: '2019-04-12T23:00:00.000Z',
            description:
              'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee',
            name: 'TROP SUPER UN NOUVEAU MEET UP',
          },
        ]),
      );
    }),

    rest.post('http://localhost:2000/v1/events', (req, res, ctx) => {
      if (req.body.name != 'erreur api ') {
        return res(ctx.status(201), ctx.json({}));
      } else {
        return res(ctx.status(500), ctx.json({ message: 'erreur' }));
      }
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
    apiGetCalled = 0;
  });
  // clean up once the tests are done
  afterAll(() => worker.close());

  test('Affichage de la modale de création', ({ given, when, then, and }) => {
    let modal;
    given('je suis un utilisateur', () => {
      render(<App />);
    });
    when(/^je clique sur "(.*)"$/, nomBoutton => {
      fireEvent.click(screen.getByText(/Ajouter un évènement/i));
    });
    then(/^la modale apparait avec le titre : "(.*)"$/, titreModal => {
      modal = screen.getByRole('presentation');
      expect(within(modal).getByText(titreModal)).toBeDefined();
    });
    and(/^un champ texte avec le label : "(.*)"$/, nom => {
      expect(within(modal).getByText(nom)).toBeDefined();
    });
    and(/^un champ date avec le label : "(.*)"$/, dateDeDebut => {
      expect(within(modal).getByLabelText(dateDeDebut)).toBeDefined();
    });
    and(/^un champ date avec le label : "(.*)"$/, dateDeFin => {
      expect(within(modal).getByLabelText(dateDeFin)).toBeDefined();
    });
    and(/^un champ texte avec le label : "(.*)"$/, description => {
      expect(within(modal).getByText(description)).toBeDefined();
    });
    and(/^le bouton "(.*)" est activé$/, nomBouton => {
      expect(within(modal).getByText(nomBouton).getAttribute('disabled')).toBe(null);
    });
    and(/^le bouton "(.*)" est désactivé$/, nomBouton => {
      expect(within(modal).getByText(nomBouton).getAttribute('disabled')).toBeDefined();
    });
  });
  test('Affichage du formulaire sans erreurs', ({ given, when, then, and }) => {
    let modal;
    let nameEvent;

    const ordresChamps = { name: 0 };
    given('je suis un utilisateur', () => {
      render(<App />);
    });
    when(/^je clique sur "(.*)"$/, nomBoutton => {
      fireEvent.click(screen.getByText(/Ajouter un évènement/i));
      modal = screen.getByRole('presentation');
    });
    and(/^je remplis le champs texte "(.*)" avec "(.*)"/, (name, value) => {
      const input = within(modal).getAllByRole('textbox')[0];
      nameEvent = 'Meet Up!';
      userEvent.type(input, nameEvent);
    });
    and(/^je remplis le champs texte "(.*)" avec "(.*)"/, titreModal => {
      const input = within(modal).getAllByRole('textbox', { hidden: true })[3];
      userEvent.type(
        input,
        'Lors de cette conférence nous parlerons de la ....,{enter}Une histoire incroyable n est ce pas!',
      );
    });
    and(/^je remplis le champs date "(.*)" avec "(.*)"/, async (name, value) => {
      fireEvent.click(
        within(modal).getAllByLabelText('Choose date, selected date is 20 févr. 2020')[0],
      );
      const date = screen.getByRole('button', {
        name: '2 févr. 2020',
      });
      fireEvent.click(date);
    });
    and(/^je remplis le champs date "(.*)" avec "(.*)"/, titreModal => {
      fireEvent.click(
        within(modal).getAllByLabelText('Choose date, selected date is 20 févr. 2020')[0],
      );
      const date = screen.getByRole('button', {
        name: '20 févr. 2020',
      });
      fireEvent.click(date);
    });

    then(/^je dois visualiser que le formulaire ne contient pas d'erreurs$/, () => {});
    and(/^le bouton "(.*)" est activé$/, nomBouton => {
      expect(within(modal).getByText(nomBouton).getAttribute('disabled')).toBe(null);
    });
    and(/^le bouton "(.*)" est activé$/, nomBouton => {
      expect(within(modal).getByText(nomBouton).getAttribute('disabled')).toBe(null);
    });
  });
  test.only("Ajout d'un évènement avec succès", ({ given, when, then, and }) => {
    let modal;
    let nameEvent;

    given('je suis un utilisateur', () => {
      render(<App />);
    });
    and(/^j'ai cliqué sur "(.*)"$/, nomBoutton => {
      fireEvent.click(screen.getByText(/Ajouter un évènement/i));
      modal = screen.getByRole('presentation');
    });

    and("j'ai remplis les champs", (name, value) => {
      const inputName = within(modal).getAllByRole('textbox')[0];
      nameEvent = 'Meet Up!';
      userEvent.type(inputName, nameEvent);

      const inputDescription = within(modal).getAllByRole('textbox', {
        hidden: true,
      })[3];
      userEvent.type(
        inputDescription,
        'Lors de cette conférence nous parlerons de la ....,{enter}Une histoire incroyable n est ce pas!',
      );

      fireEvent.click(
        within(modal).getAllByLabelText('Choose date, selected date is 20 févr. 2020')[0],
      );
      const startDate = screen.getByRole('button', {
        name: '21 févr. 2020',
      });
      fireEvent.click(startDate);

      fireEvent.click(
        within(modal).getAllByLabelText('Choose date, selected date is 20 févr. 2020')[0],
      );
      const endDate = screen.getByRole('button', {
        name: '22 févr. 2020',
      });
      fireEvent.click(endDate);
    });
    when(/^je clique sur le bouton "(.*)"$/, nomBoutton => {
      //fireEvent.click(screen.getByText(nomBoutton));
      //await waitFor(() => expect(apiGetCalled).toBe(2), { timeout: 100000000 });
      //await screen.findByText(`l'ajout de l'évènement ${nameEvent} est un succès`);
    });
    then("la modale d'ajout est fermée", () => {});
    and('une notification de succès est affichée', () => {});
  });
});
