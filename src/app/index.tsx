import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { performOAuth, sendMagicLink } from '../components/Auth' // Import your auth functions

const SignupPage = () => {
  const [email, setEmail] = useState('');

  const handleOAuthSignIn = () => {
    performOAuth();
  };

  const handleSendMagicLink = () => {
    sendMagicLink();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Button onPress={handleOAuthSignIn} title="Sign in with Google" />
      <Button onPress={handleSendMagicLink} title="Send Magic Link" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default SignupPage;
