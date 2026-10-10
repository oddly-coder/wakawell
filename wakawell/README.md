# City Router

A city navigation web app that helps you get around on foot, by bike, by car, or by bus. Search for a place, find the closest bus stops, see which bus lines serve them, and compare route options on an interactive map.

## Features

- Place search with autocomplete, or tap the map to drop a start and destination pin
- Routes for driving, cycling, and walking, with turn-by-turn steps, distance, and time
- Route alternatives, with the fastest highlighted
- Nearest bus stops within 1 km of your location, your start, or your destination
- Bus lines per stop, and a one-tap "Walk to this stop"

## Tech stack

React, Tailwind CSS, Vite, MapLibre GL JS, OpenStreetMap, OSRM (routing), Nominatim (search), Overpass API (bus stops and lines)

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── main.jsx              Entry point
├── App.jsx               Page layout and shared state (start, destination, mode)
├── config.js             Service URLs, travel modes, map style
├── components/
│   ├── MapView.jsx       Map, pins, bus stop dots, route lines
│   ├── PlaceInput.jsx    Search box with autocomplete
│   ├── ModeTabs.jsx      Drive / Cycle / Walk switch
│   ├── BusStopsPanel.jsx Nearby stops, bus lines, walk-to-stop
│   ├── RouteResult.jsx   Status messages, summary and steps
│   ├── RouteOptions.jsx  Fastest and alternative routes
│   └── RouteSteps.jsx    Turn-by-turn list
├── hooks/
│   ├── useMap.js         Creates the MapLibre map and route layers
│   ├── useRoutes.js      Fetches routes when inputs change
│   └── useBusStops.js    Finds stops and loads bus lines
└── lib/
    ├── routing.js        OSRM requests
    ├── geocode.js        Nominatim requests
    ├── overpass.js       Bus stop and bus line queries
    ├── geo.js            Distance and geolocation helpers
    ├── instructions.js   Turn text and direction icons
    └── format.js         Distance and time formatting
```

## Configuration

Service URLs live in `src/config.js`. The defaults are free public servers that are fine for development but not production. Before deploying, switch to your own routing, geocoding, Overpass, and tile services.

## Limitations

- Bus data depends on OpenStreetMap, and coverage varies widely between cities.
- It shows nearby stops and the lines that serve them, but doesn't plan multi-leg bus trips. That needs GTFS timetable data and a transit planner such as OpenTripPlanner.
- Route preview only: no live GPS tracking, re-routing, or voice guidance yet.

## Data and attribution

Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the ODbL.
