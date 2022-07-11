import {firebase} from '@react-native-firebase/database';
export const database = firebase
  .app()
  .database(
    'https://kupujemprodajem-2dd0e-default-rtdb.europe-west1.firebasedatabase.app/',
  );
