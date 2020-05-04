# Darts Tracker

A pretty simple React Native app for locally persisted tracking of darts matches and practice games. The objective for this example app is merely to learn and experiment with Realm in local persistence mode.

## Why haven't I used classes for the models?

That was my initial intent but I ran into issues. I wanted a clean model that wasn't tightly coupled with the persistence method and so initially attempted to use classes which were unaware of Realm. Unfortunately I ran into issues when writing integration tests for the models using classes - the main issue being that using Realm.create on data created from model instances caused unusual errors in the unit tests. Since the aim of this project is a quick application to experiment with realm - I decided to use plain objects for model data and expose functions which act upon the models.
