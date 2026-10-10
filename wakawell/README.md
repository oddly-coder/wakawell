# City Router (Google Maps version)

A city navigation web app that finds nearby bus stops, plans bus trips, and compares walking, cycling, and driving routes. Built with React, Tailwind CSS, and Google Maps Platform.

## Setup

1. In Google Cloud Console, create a project and **enable billing**.
2. Enable these three APIs: **Maps JavaScript API**, **Routes API**, **Places API (New)**.
3. Create an API key. Restrict it to your website's address and to those three APIs.
4. Set a budget alert and a daily quota so a bug or a leaked key can't run up a bill.
5. Run:

```bash
cp .env.example .env     # then paste your key into .env
npm install
npm run dev
```

## Features

- Place search with autocomplete, or tap the map to drop a start and destination pin
- Bus trip planning with the bus line, direction, stops to get on and off, and number of stops
- Walking, cycling, and driving routes with turn-by-turn steps
- Route alternatives, with the fastest highlighted
- Nearest bus stops within 1 km of your location, your start, or your destination
- "Walk to this stop" and "Bus from here" on each stop

## Project structure

```
src/
├── main.jsx               Entry point, loads the Google Maps script
├── App.jsx                Layout and shared state
├── config.js              API key, URLs, travel modes
├── components/            MapView, PlaceInput, ModeTabs, BusStopsPanel,
│                          RouteResult, RouteOptions, RouteSteps
├── hooks/                 useRoutes, useBusStops
└── lib/
    ├── google.js          Shared fetch for Routes and Places calls
    ├── routing.js         Routes API and step normalizing
    ├── places.js          Autocomplete, place details, nearby bus stops
    ├── polyline.js        Decodes Google route lines
    ├── geo.js, format.js  Helpers
```

## Notes

- Google doesn't offer a "which buses stop here" lookup. Bus lines appear when you plan a bus trip.
- Bus trip results depend on Google having transit data for your city. Test a few trips in Google Maps first.
- Google bills by usage. Check current pricing at https://mapsplatform.google.com/pricing.
- Google's terms require its routes and places to be shown on a Google map.
