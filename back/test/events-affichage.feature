Feature: affichage de tous les évènements
        Given je suis un utilisateur
        When je décide de voir tous les évènements
        Then les évènements sont affichés

    Scenario: la requête renvoie tous les évènements
        Given je suis un utilisateur
        When je décide de voir tous les évènements
        Then les évènements sont affichés:
            | description                                                                    | endDate                  | name             | startDate                |
            | Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème | 2020-04-14T16:00:00.000Z | Meet-Up Green-It | 2020-04-12T16:00:00.000Z |
            | Nous allons voir comment créer un site todo                                    | 2025-04-15T19:00:00.000Z | Meet-Up VueJS    | 2025-04-15T20:00:00.000Z |
