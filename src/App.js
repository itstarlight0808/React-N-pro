/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useEffect} from 'react';
import {LogBox, StatusBar, View,Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {connectRealm} from 'react-native-realm';
import {requestPost, BASE_URL} from './utils/API';
import Preference from 'react-native-preference';

import moment from 'moment';

import Routing from './Routing';
import colors from './utils/colors';
import preferenceKeys from './utils/preferenceKeys';
import {sentryMessage} from "./utils/utils";

LogBox.ignoreAllLogs(true);
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor(colors.transparent);
StatusBar.setBarStyle('light-content');
// useEffect=()=>{
//     let temp = this.props.realm.objects('Questions')
//     console.log("App.JS",temp)
// }
sentryMessage('App Open');
const App = (props) => {
  return (
    <View style={{flex: 1}}>
      <Routing />
    </View>
  );
};
export default connectRealm(App, {
  schemas: ['HomeDates', 'Questions'],
  mapToProps(results, realm, ownProps) {
    return {
      realm,
    };
  },
});
