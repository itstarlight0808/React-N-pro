import { Platform, Alert } from 'react-native';
import {
    check,
    RESULTS,
    request,
    PERMISSIONS,
    openSettings
} from 'react-native-permissions';

export const permissionCamera = () => new Promise(async (resolve, reject) => {
    try {
        const cameraPermission = Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
            ios: PERMISSIONS.IOS.CAMERA
        })

        const resultCheck = await check(cameraPermission)
        console.log('AppUtil-permission-resultCheck', resultCheck)
        if (resultCheck == RESULTS.DENIED) {
            const resultRequest = await request(cameraPermission)
            console.log('AppUtil-permission-resultRequest', resultRequest)
            if (resultRequest == RESULTS.DENIED || resultRequest == RESULTS.BLOCKED) {
                Alert.alert(
                    'Permission required!',
                    'Please grant camera access to take profile picture.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Open Settings',
                            onPress: () => {
                                openSettings().catch(() => console.warn('cannot open settings'));
                            }
                        },
                    ],
                    { cancelable: true },
                );
                resolve({
                    hasPermission: false
                })
            } else if (resultRequest == RESULTS.GRANTED) {
                resolve({
                    hasPermission: true
                })
            } else {
                resolve({
                    hasPermission: false
                })
            }
        } else if (resultCheck == RESULTS.BLOCKED) {
            Alert.alert(
                'Permission required!',
                'Please grant camera access to take profile picture.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }
                    },
                ],
                { cancelable: true },
            );
            resolve({
                hasPermission: false
            })
        } else {
            resolve({
                hasPermission: true
            })
        }
    } catch (ex) {
        console.log('AppUtil-permission', ex)
        reject(ex)
    }
})