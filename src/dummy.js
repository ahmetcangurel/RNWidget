import SharedGroupPreferences from 'react-native-shared-group-preferences';

const appGroupIdentifier = 'group.com.mytest';
const userData = {
  name: 'Vin Diesel',
  age: 34,
  friends: ['Lara Croft', 'Mike Meyers'],
};

export default class app extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
    };

    // Not the most professional way to ask for permissions: Just ask when the app loads.
    // But for brevity, we do this here.
    if (Platform.OS == 'android') {
      this.dealWithPermissions();
    } else {
      this.saveUserDataToSharedStorage(userData);
    }
  }

  async dealWithPermissions() {
    try {
      const grantedStatus = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      const writeGranted =
        grantedStatus['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const readGranted =
        grantedStatus['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED;
      if (writeGranted && readGranted) {
        this.saveUserDataToSharedStorage(userData);
      } else {
        // You can either limit the user in access to the app's content,
        // or do a workaround where the user's data is saved using only
        // within the user's local app storage using something like AsyncStorage
        // instead. This is only an android issue since it uses read/write external storage.
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async saveUserDataToSharedStorage(data) {
    try {
      await SharedGroupPreferences.setItem(
        'savedData',
        data,
        appGroupIdentifier,
      );
      this.loadUsernameFromSharedStorage();
    } catch (errorCode) {
      // errorCode 0 = There is no suite with that name
      console.log(errorCode);
    }
  }

  async loadUsernameFromSharedStorage() {
    try {
      const loadedData = await SharedGroupPreferences.getItem(
        'savedData',
        appGroupIdentifier,
      );
      this.setState({username: loadedData.name});
    } catch (errorCode) {
      // errorCode 0 = no group name exists. You probably need to setup your Xcode Project properly.
      // errorCode 1 = there is no value for that key
      console.log(errorCode);
    }
  }

  render() {
    return (
      <View>
        <Text>
          {this.state.username
            ? 'Loading...'
            : 'Welcome back ' + this.state.username}
        </Text>
      </View>
    );
  }
}
