# Kumojin

L’objectif est d’avoir une application basique de gestion des événements.

Un événement est caractérisé par son nom (32 caractères maximum), sa description et ses dates de début et de fin. Attention, les événements peuvent avoir lieu n’importe où dans le monde, n’oublie pas de prendre en compte la timezone.

Le back-end est une API REST qui retourne du JSON. Il doit gérer les opérations suivantes :

    Créer un événement
    Lister les événements

Le front-end doit permettre de :

    Créer un événement
    Lister les événements (optionnel)

Pré-requis :

Version :

    npm --version
    6.14.10
    node --version
    v14.15.4
    MongoDB server version: 4.0.3

# Installation

## Dossier front :

créer un fichier .env:

    REACT_APP_BASE_API_URL=http://localhost:8080/v1
    REACT_APP_PORT=3000

./front : ReactJS

    npm ci

## Dossier back :

./back: NestJS & bdd MONGODB

    npm ci

créer un fichier .env:

    MONGO_TEST_CONNECTION_URI=mongodb://localhost/test
    MONGO_CONNECTION_URI=mongodb://localhost/kumojin
    PORT=8080

# Lancement

## Dossier front :

./front : ReactJS
cd front
npm run start

## Dossier back :

./back: NestJS & bdd MONGODB

Ne pas oublier avant tout de faire un npm install

Lancement en local :
Lancement de la base de données

    cd back
    sudo mongo

Lancement de l'application

    cd back
    npm run start

Lancement des tests :

Front (cd front)
npm run cover (tdd) front avec le coverage seulement pour les tus

lancement des tests e2e, utlisation de cypress (lancement de deux processus) (j'ai laissé les vidéos en cas de problème de lancement de celui-ci)

    npm run start:test
    npm run cypress:open

ou

    npm run test:e2e:ci

ou

    npm run test:e2e:ci

Back :

    npm run test
    npm run test:e2e

---

Ce qui reste à faire :

- brancher un sonar pour réutiliser lcov et visualiser le taux de coverage et voir si des issues autre que ce que remonte le linter,
- j'ai branché un snyk (pour vérifier les vulnérabilités dans les dépendances), il faudrait rajouter même si sonar le fait actuellement un outil qui check les failles owasp
- les différents environnements
- Écrivant les Dockerfile qui construisent les applications front-end et back-end
- Écrivant les GitHub Action pour tester, builder et déployer dans Kubernetes
- Écrivant les manifests Kubernetes pour déployer les 2 applications avec un Ingress, on part du principe que le cluster possède un Nginx Ingress Controller
- la livedoc (les features sont faites, il faudrait mettre un specflow pour permettre d'heberger) d'ailleurs il y a un swagger qui est fait sur le côté back
