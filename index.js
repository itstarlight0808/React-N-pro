/**
 * @format
 */

import React, { Component } from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
// import App from './App';
import { personRef } from './src/RealmDB/index';
import {name as appName} from './app.json';
import { RealmProvider } from 'react-native-realm';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://50a69e2cd6144a71a7a28f0b4701a00a@o451216.ingest.sentry.io/5707194",
});

export default function Main() {
    return (
      <RealmProvider realm={personRef}>
        <App />
      </RealmProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Main);
