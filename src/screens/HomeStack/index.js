import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Screens
import HomeScreen from './HomeScreen'
import TodaysAppointments from './TodaysAppointments'
import FacilityNameScreen from './FacilityNameScreen'
import VisitVerificationScreen from './VisitVerificationScreen'
import FacilityQuestionnaireScreen from './FacilityQuestionnaireScreen'
import CheckoutScreen from './CheckoutScreen'
import AppointmentDetails from './AppointmentDetails'
import QuestionnairHistoryScreen from './QuestionnairHistoryScreen';
import QuestionAnswer from './QuestionnaireAnswer/index';
import NoOFQuestionAnswered from './NoOfQuestionsAnswered/index';

//Utils
import colors from '../../utils/colors';

//Components
import DrawerComponent from '../../components/DrawerComponent';

/** Home Drawer */
const HomeDrawerStack = (props) => (
    <Drawer.Navigator
        drawerStyle={{ backgroundColor: colors.background }}
        headerMode="none"
        initialRouteName='HomeScreen'
        drawerType={'slide'}
        drawerContent={(contentProps) => <DrawerComponent {...contentProps} />}>
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        <Drawer.Screen name="TodaysAppointments" component={TodaysAppointments} />
        <Drawer.Screen name="QuestionnairHistoryScreen" component={QuestionnairHistoryScreen} />
        {/* <Drawer.Screen name="FacilityQuestionnaireScreen" component={FacilityQuestionnaireScreen} /> */}
    </Drawer.Navigator>
);

/** Home Stack */
const HomeStack = () => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName='HomeDrawerStack'>
        <Stack.Screen name="HomeDrawerStack" component={HomeDrawerStack} />
        <Drawer.Screen name="FacilityNameScreen" component={FacilityNameScreen} />
        <Drawer.Screen name="VisitVerificationScreen" component={VisitVerificationScreen} />
        <Drawer.Screen name="FacilityQuestionnaireScreen" component={FacilityQuestionnaireScreen} />
        <Drawer.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Drawer.Screen name="AppointmentDetails" component={AppointmentDetails} />
        <Drawer.Screen name="DateAppointments" component={TodaysAppointments} />
        <Drawer.Screen name="QuestionAnswer" component={QuestionAnswer} />
        <Drawer.Screen name="NoOFQuestionAnswered" component={NoOFQuestionAnswered} />
    </Stack.Navigator>
);

export default HomeStack
