import { View, Text, StyleSheet } from 'react-native';
import Auth from '../components/Auth';

const SignupPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Please Sign In:</Text>
      <Auth/>
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
