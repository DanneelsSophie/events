Feature: Affichage des évènements

    Scenario: Affichage de la page avec des évènements
        Given je suis un utilisateur
        And il y a 3 évènements sur la page
        When je suis sur la page principale
        Then je visualise les 3 évènements :
            | name                            | date                                                                              | description                                                                                                                                                                                                                                            | status   |
            | 012345678901234567890123456789  | du mar. 12 avr. 2022 à 6:00 (GMT+02:00) au dim. 12 avr. 2020 à 6:00 (GMT+02:00)   | Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee                                                    | en cours |
            | React Beer Lille - bonne reason | du ven. 18 févr. 2022 à 4:21 (GMT+01:00) au mer. 23 févr. 2022 à 9:10 (GMT+01:00) | Après 2 belles éditions, nous revoilà pour une 3ème édition dans un cadre exceptionnel ! 😎Pour cette nouvelle soirée, nous accueillons Thomas Haessle pour un talk autour de ReasonReact & toujours de bonnes bières ! On vous attend nombreux·ses 🍻 | passé    |
            | 2022 World IA Day Minneapolis   | du sam. 05 avr. 2025 à 7:10 (GMT+02:00) au sam. 05 avr. 2025 à 12:00 (GMT+02:00)  | Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre prov pour calibrer une mise en page, le texte défieee                                                    | futur    |

    Scenario: Affichage de la page avec aucun évènement
        Given je suis un utilisateur
        And il y a 0 évènements sur la page
        When je suis sur la page principale
        Then je visualise les 0 évènements :
            | name | date | description | status |

    Scenario: Affichage de la page avec une erreur api
        Given je suis un utilisateur
        And il y a une erreur de l'api
        When je suis sur la page principale
        Then je visualise les 0 évènements :
            | name | date | description | status |
        And sur la page il y a un message de chargement
        And sur la page il y a un message d'erreur