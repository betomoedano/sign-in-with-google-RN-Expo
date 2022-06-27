import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "your cliend id goes here!",
    iosClientId: "your cliend id goes here!",
    androidClientId: "your cliend id goes here!"
  });

  React.useEffect(() => {
    if(response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken])

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const useInfo = await response.json();
    setUser(useInfo);
  }

  const ShowUserInfo = () => {
    if(user) {
      return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
          <Image source={{uri: user.picture}} style={{width: 100, height: 100, borderRadius: 50}} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.name}</Text>
        </View>
      )
    }
  }  

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null &&
          <>
          <Text style={{fontSize: 35, fontWeight: 'bold'}}>Welcome</Text>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'gray'}}>Please login</Text>
        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
            }} 
        >
          <Image source={require("./btn.png")} style={{width: 300, height: 40}} />
        </TouchableOpacity>
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
