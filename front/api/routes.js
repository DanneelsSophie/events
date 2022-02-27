const express = require('express');
const app = express();

app.get('/events', (req, res) => {
  res.send(
    {
      _id: '6215f977b9d920637815d23a',
      status: 'CURRENT',
      endDate: '2083-04-12T23:00:00.000Z',
      startDate: '2019-04-12T23:00:00.000Z',
      description:
        'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee',
      name: 'TROP SUPER UN NOUVEAU MEET UP',
    },
    {
      _id: '6215f97db9d920637815d23c',
      status: 'NEXT',
      endDate: '2040-04-12T23:00:00.000Z',
      startDate: '2030-04-12T23:00:00.000Z',
      description:
        'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee',
      name: 'TROP SUPER UN NOUVEAU MEET UP',
    },
    {
      _id: '6214ac29c89d49420d639878',
      status: 'PAST',
      endDate: '2013-04-12T16:00:00.000Z',
      startDate: '2012-04-12T16:00:00.000Z',
      description:
        'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défie',
      name: '012345678901234567890123456789',
    },
    {
      _id: '6214ac49c89d49420d63987b',
      status: 'NEXT',
      endDate: '2053-04-12T16:00:00.000Z',
      startDate: '2050-04-12T16:00:00.000Z',
      description:
        'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défie',
      name: '012345678901234567890123456789',
    },
  );
});

app.post('/events', (req, res) => {
  res.send({});
});
app.listen(2000, () => {
  console.log("Serveur à l'écoute");
});
