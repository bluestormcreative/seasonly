# Seasonly

A seasonal food app built on the MERN stack.
Check out v1.0 at [https://seasonly.bluestormserver.com/](https://seasonly.bluestormserver.com/)

## What Is It?

A simple app that will let you:

1. find your growing zone / plant hardiness zone by zip code (sorry international friends, currently US-only)
2. see what's in season in your area
3. select in-season items to create a market shopping list

## Road Map and Other Ideas

- Add update profile view to save a new zip/zone/email/password (WIP)
- Better styles/design/branding overall (WIP)
- Add filters to in-season view to show only veggies, only fruit, or all items (WIP)
- Add offline capabilities via localStorage and service workers.
- Have the images update based on the zip/zone input.
- Larger data set: more produce with more varieties.
- Possibly tie it into some recipe APIs.

## Built With

The zone data is sourced from [https://planthardiness.ars.usda.gov/](https://planthardiness.ars.usda.gov/)

The initial seed data set was created via reports on the 50-ish most popular vegetables/fruits in US growing zones, then faceted by ChatGPL.

React, TypeScript, Node.js, Express, Mongoose, MongoDB Atlas, MUI, Vite, react-hook-form, express-session, a cast of thousands; served on Akamai Cloud.
