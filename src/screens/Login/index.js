import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import styles from './loginStyle';
import { navigateToNestedRoute } from '../../navigators/RootNavigation';
import { getScreenParent } from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import auth from '@react-native-firebase/auth';
import userState from '../../store/state/userState';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('Login successfully');
      const userDoc = await firestore().collection('users').doc(auth().currentUser.uid).get();
      const userData = userDoc.data();
      const username = userData.username;

      nav.navigate('BottomStack', { screen: 'Profile', params: {username} });

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBackButton()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="gray" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContent}>
        <Text style={styles.largeText}>Welcome Back!</Text>
        <Text style={styles.smallText}>
          Log into your account &amp; manage {'\n'}your tasks
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={text => setPassword(text)}
          />
          <Octicons name="eye-closed" size={20} color="gray" />
        </View>
        <View style={styles.savePwdRow}>
          <Text style={styles.savePwdText}>Save Password</Text>
          <Switch
            trackColor={{ false: appTheme.INACTIVE_COLOR, true: appTheme.COLOR2 }}
            thumbColor="#fff"
            value={true}
          />
        </View>
        <TouchableOpacity style={styles.loginBtnWrapper} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpBtnWrapper}
          onPress={() => handleNavigation('SignUp')}>
          <Text style={styles.signUpBtnText}>
            Don't have an account? SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


