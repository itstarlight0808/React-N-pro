import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Preference from 'react-native-preference';
import NetInfo from '@react-native-community/netinfo';
import {connectRealm} from 'react-native-realm';

//components
import FloatingLabelInputField from '../../../components/FloatingLabelInputField';
import Button from '../../../components/Button';

//assets
import images from '../../../assets/images';

//utils
import colors from '../../../utils/colors';
import preferenceKeys from '../../../utils/preferenceKeys';

import {requestPost, BASE_URL} from '../../../utils/API';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadingOnLogin: false,
      username: '',
      password: '',
      // username: '10359',
      // password: 'G359KIS$',
      showForm: false,
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedOpacityValue = new Animated.Value(0);
  }

  componentDidMount() {
    setTimeout(() => {
      this.moveLogo();
    }, 500);
  }

  verifyFields = () => {
    const {username, password} = this.state;
    if (username === '') {
      Alert.alert(null, 'Username is required');
      return false;
    } else if (password === '') {
      Alert.alert(null, 'Password is required');
      return false;
    }

    return true;
  };
  checkInternet() {
    NetInfo.fetch().then((state) => {
      this.LogInCheck(state.isConnected);
    });
  }
  LogInCheck(isConnected) {
    if (isConnected) {
      this.onLoginPress();
    } else {
      this.getCredentialsFromDB();
    }
  }

  getCredentialsFromDB() {
    const {username, password} = this.state;
    const {navigation} = this.props;
    let temp = this.props.realm.objects('LogInCredentials')[0];
    if (username == temp.userName && password == temp.password){
    let response = JSON.parse(temp.currentUser[0]);
    let responseAuthenticates = JSON.parse(temp.authenticate[0]);
    console.log('Local DB Data', responseAuthenticates);
    Preference.set(preferenceKeys.CURRENT_USER, response);
    Preference.set(preferenceKeys.USER_ID, temp.userName);
    Preference.set(preferenceKeys.HAS_SESSION, true);
    Preference.set(preferenceKeys.CLIENT_ID, responseAuthenticates.clientID);
    Preference.set(preferenceKeys.AUTHENTICATED, responseAuthenticates);
    navigation.reset({
      index: 0,
      routes: [{name: 'HomeStack'}],
    });
} else {
    alert("Please enter valid credentials or try to login with internet")
}
  }

  saveCredentials(data,response) {
      console.log("data-------",data,"----------","   response",response)
    const {realm} = this.props;
    const {username, password} = this.state;
    realm.write(() => {
      realm.delete(realm.objects("LogInCredentials"))
    })
    realm.write(() => {
      realm.create('LogInCredentials', {
        userName: username,
        password: password,
        currentUser: [JSON.stringify(data)],
        authenticate: [JSON.stringify(response)],
      });
      // realm.create('LogInCredentials',{password:"ahzam"})
    });
  }

  onLoginPress = () => {
    const {username, password} = this.state;

    if (this.verifyFields()) {
      Keyboard.dismiss();
      const bodyDetails = {
        service: 'login',
        username: username,
        password: password,
        appId: '1001',
      };
      this.setState({loadingOnLogin: true});
      requestPost(BASE_URL, JSON.stringify(bodyDetails))
        .then((response) => {
          this.setState({loadingOnLogin: false});
          console.log('API', 'requestPost-response', response);
          if (response.success) {
            Preference.set(preferenceKeys.CURRENT_USER, response);
            Preference.set(preferenceKeys.USER_ID, username);
            // this.saveCredentials(response);
            // console.log('response', response);
            this.authenticating(response);
          } else {
            Alert.alert(null, response.error);
          }
        })
        .catch((error) => {
          this.setState({loadingOnLogin: false});
          console.log('onLoginPress', 'error', error);
          Alert.alert(null, 'Something went wrong');
        });
    }
  };

  authenticating = (data) => {
    const {navigation} = this.props;
    const bodyDetails = {
      service: 'authenticate',
      clientID: data.clientID,
      company: data.objs[0].COMPANY,
      branch: data.objs[0].BRANCH,
      module: data.objs[0].MODULE,
      refid: data.objs[0].REFID,
    };
    this.setState({loadingOnLogin: true});
    requestPost(BASE_URL, JSON.stringify(bodyDetails))
      .then((response) => {
        this.setState({loadingOnLogin: false});
        // console.log('API', 'requestPost-response', response);
        if (response.success) {
          const {clientID} = response;
          Preference.set(preferenceKeys.HAS_SESSION, true);
          Preference.set(preferenceKeys.CLIENT_ID, clientID);
          Preference.set(preferenceKeys.AUTHENTICATED, response);
          this.saveCredentials(data,response)
          navigation.reset({
            index: 0,
            routes: [{name: 'HomeStack'}],
          });
        } else {
          Alert.alert(null, response.error);
        }
      })
      .catch((error) => {
        this.setState({loadingOnLogin: false});
        console.log('onLoginPress', 'error', error);
        Alert.alert(null, 'Something went wrong');
      });
  };

  moveLogo = () => {
    const {navigation} = this.props;
    const hasSession = Preference.get(preferenceKeys.HAS_SESSION);
    if (hasSession) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'HomeStack'}],
        });
      }, 200);
    } else {
      Animated.timing(this.animatedValue, {
        toValue: 1,
        easing: Easing.elastic(),
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        this.setState({showForm: true}, () => {
          Animated.timing(this.animatedOpacityValue, {
            toValue: 1,
            easing: Easing.elastic(),
            duration: 2000,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  };

  render() {
    const {loading, loadingOnLogin, username, password, showForm} = this.state;
    const {navigation} = this.props;

    const marginTopTemp = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    const opacity = this.animatedOpacityValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={styles.container}
          source={images.backgroundImage}>
          <KeyboardAwareScrollView
            innerRef={(ref) => {
              this.scroll = ref;
            }}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            style={{flexGrow: 1, width: '100%'}}>
            <View style={[styles.container]}>
              <Animated.Image
                style={{
                  width: '60%',
                  height: 67,
                  resizeMode: 'contain',
                  transform: [{translateY: marginTopTemp}],
                }}
                source={images.logoImage}></Animated.Image>
              <Animated.View
                style={{
                  width: '100%',
                  padding: 30,
                  marginTop: 0,
                  opacity: opacity,
                }}>
                <FloatingLabelInputField
                  value={username}
                  placeholder={'Username'}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    this.setState({username: text});
                  }}
                />
                <FloatingLabelInputField
                  value={password}
                  secureTextEntry={true}
                  placeholder={'Password'}
                  onChangeText={(text) => {
                    this.setState({password: text});
                  }}
                />
                <Button
                  activityIndicatorProps={{loading: loadingOnLogin}}
                  containerStyle={{
                    backgroundColor: colors.primary,
                    marginTop: 60,
                  }}
                  buttonTextStyle={{color: colors.white}}
                  buttonText={'Login'}
                  onPressButton={() => {
                    this.checkInternet();
                  }}
                />
              </Animated.View>
            </View>
          </KeyboardAwareScrollView>
          {loadingOnLogin && <View style={StyleSheet.absoluteFill} />}
        </ImageBackground>
      </View>
    );
  }
}
export default connectRealm(LoginScreen, {
  schemas: ['LogInCredentials'],
  mapToProps(results, realm, ownProps) {
    return {
      realm,
    };
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
