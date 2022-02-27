Feature: Création d'un évènement

    Scenario: Affichage de la modale de création
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        Then une modale apparaît
        And le titre de la modale est "Ajout d'un évènement"
        And un champ avec le label : "Nom de l'évènemenent"
        And un champ avec le label : "Date de début"
        And un champ avec le label : "Date de fin"
        And un champ avec le label : "Description"
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est désactivé

    Scenario: Affichage du formulaire sans erreurs
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "name" avec "Meet-up"
        And je remplis le champs "textarea" "description" avec "voici la description"
        And je remplis le champs "input" "startDate" avec "23/02/2022 04:26"
        And je remplis le champs "input" "endDate" avec "23/02/2022 10:20"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" n'est pas present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" n'est pas present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est activé

    Scenario: Affichage du formulaire cas limite (min)
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "name" avec "1"
        And je remplis le champs "textarea" "description" avec "v"
        And je remplis le champs "input" "startDate" avec "01/01/1900 00:00"
        And je remplis le champs "input" "endDate" avec "31/12/2199 23:59"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" n'est pas present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" n'est pas present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est activé

    Scenario: Affichage du formulaire cas limite (max)
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "name" avec "01234567890123456789012345678901"
        And je remplis le champs "textarea" "description" avec "Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défiee"
        And je remplis le champs "input" "startDate" avec "01/01/1900 00:00"
        And je remplis le champs "input" "endDate" avec "31/12/2199 23:59"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" n'est pas present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" n'est pas present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est activé

    Scenario: Affichage du formulaire avec erreurs
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "name" avec "012345678901234567890123456789012"
        And je remplis le champs "input" "startDate" avec "27/02/2022 04:26"
        And je remplis le champs "input" "endDate" avec "23/02/2022 10:20"
        And je remplis le champs "textarea" "description" avec "Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défieee"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" est present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" est present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est désactivé

    Scenario: Affichage du formulaire avec erreurs (date min)
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "name" avec "namecorrect"
        And je remplis le champs "input" "startDate" avec "31/12/1899 23:59"
        And je remplis le champs "input" "endDate" avec "01/02/2022 10:20"
        And je remplis le champs "textarea" "description" avec "correct"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" n'est pas present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" n'est pas present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est désactivé

    Scenario: Affichage du formulaire avec erreurs (date max)
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "name" avec "namecorrect"
        And je remplis le champs "input" "startDate" avec "31/12/2010 23:59"
        And je remplis le champs "input" "endDate" avec "01/01/2200 00:01"
        And je remplis le champs "textarea" "description" avec "correct"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" n'est pas present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" n'est pas present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est désactivé

    Scenario: Affichage du formulaire avec des dates incorrects
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je remplis le champs "input" "startDate" avec "31/12/1899 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And je remplis le champs "input" "startDate" avec "23/02/2022 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And je remplis le champs "input" "startDate" avec "31/12/2201 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And je remplis le champs "input" "startDate" avec "01/01/1900 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And je remplis le champs "input" "endDate" avec "31/12/1899 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And je remplis le champs "input" "endDate" avec "23/02/2022 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And je remplis le champs "input" "endDate" avec "31/12/2201 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And je remplis le champs "input" "endDate" avec "23/02/2022 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And je remplis le champs "input" "endDate" avec "31/02/2022 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And je remplis le champs "input" "endDate" avec "50/50/2022 04:26"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And je remplis le champs "input" "endDate" avec "31/12/2199 23:59"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present


    Scenario: Affichage du formulaire avec des champs vides
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And je supprime le contenu du champs "input" "name"
        And je remplis le champs "input" "name" avec "  "
        And je supprime le contenu du champs "input" "startDate"
        And je supprime le contenu du champs "input" "endDate"
        And je supprime le contenu du champs "textarea" "description"
        And je remplis le champs "textarea" "description" avec "  "
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" est present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" est present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" est present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est désactivé

    Scenario: Ajout d'un évènement avec succès
        Given je suis un utilisateur
        And j'ai cliqué sur "Ajouter un évènement"
        And j'ai remplis les champs
        When je clique sur "Sauvegarder"
        Then la modale d'ajout est fermée
        And une notification de succès est affichée
        And l'api getEvent est relancé

    Scenario: Ajout d'un évènement avec erreur
        Given je suis un utilisateur
        And il y a une erreur de l'api
        And j'ai cliqué sur "Ajouter un évènement"
        And j'ai remplis les champs
        When je clique sur "Sauvegarder"
        Then la modale d'ajout est fermée
        And une notification d'erreur est affichée

    Scenario: Annulation du formulaire
        Given je suis un utilisateur
        When je clique sur "Ajouter un évènement"
        And j'ai remplis les champs
        Then je clique sur "Annuler"
        And je clique sur "Ajouter un évènement"
        And je vois le champs "input" "name" avec ""
        And je vois le champs "textarea" "description" avec ""
        And je vois le champs "input" "startDate" avec "now"
        And je vois le champs "input" "endDate" avec "now"
        And le message d'erreur "La date de début doit être plus petite que la date de fin et compris entre le 01/01/1900 et 01/01/2200" n'est pas present
        And le message d'erreur "Le champ description doit être entre 1 et 200 caractères (et pas uniquement d'espaces)" n'est pas present
        And le message d'erreur "Le champ nom doit être entre 1 et 32 caractères (et pas uniquement d'espaces)" n'est pas present
        And le bouton "Annuler" est activé
        And le bouton "Sauvegarder" est désactivé