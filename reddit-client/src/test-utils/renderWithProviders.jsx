// Zentrale Test-Helferfunktionen für React-Komponenten mit Redux-Store und React Router.
// Diese Datei bündelt wiederverwendbare Test-Utilities, damit Tests kurz und gut lesbar bleiben (DRY, KISS).

import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";

// Import der echten Slices, damit der Test-Store sich wie der Produktiv-Store verhält.
import filtersReducer from "../features/filters/filtersSlice";
import postsReducer from "../features/posts/postsSlice";
import searchReducer from "../features/search/searchSlice";

/**
 * Erstellt einen Redux-Store für Tests mit optionalen Initial-States.
 * So können Tests gezielt bestimmte Szenarien simulieren (z. B. Fehlerzustände oder gefüllte Listen).
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
      posts: postsReducer,
      search: searchReducer,
    },
    preloadedState,
  });
}

/**
 * Rendert eine React-Komponente umschlossen von Redux-Provider und MemoryRouter.
 * - `ui`: Die zu testende React-Komponente.
 * - `options.route`: Initiale Route für Router-Tests (Standard ist "/").
 * - `options.preloadedState`: Optionaler Initial-State für den Test-Store.
 *
 * Rückgabewert enthält die normalen Testing-Library-Helfer sowie den erzeugten Store.
 */
export function renderWithProviders(
  ui,
  {
    route = "/",
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

