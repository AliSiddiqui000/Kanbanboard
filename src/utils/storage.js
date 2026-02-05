import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GDrive} from "@robinbobin/react-native-google-drive-api-wrapper";
import { Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export const uploadFileToGoogleDrive = async (setFileDetails) => {
    try {
        await GoogleSignin.configure({
            webClientId: '69936411006-3d1mf0v8k75lmc469dbbgimajkuqg9jl.apps.googleusercontent.com',
            offlineAccess: true,
            scopes: ['https://www.googleapis.com/auth/drive.file',
              'https://www.googleapis.com/auth/drive.readonly',
            ],
          });
      const isSignedIn = await GoogleSignin.signIn();
      if (!isSignedIn) {
        await GoogleSignin.signIn();
      }
  
      const gdrive = new GDrive();
      const tokens = await GoogleSignin.getTokens();
      gdrive.accessToken = tokens.accessToken;
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        const file = result[0];
        const fileId = file.uri;
        const fileName = file.name;
        const fileType = file.type;
        setFileDetails({ fileName, fileId, fileType });
  
      } catch (err) {
          console.warn('Error picking file:', err);
          Alert.alert('Error', 'Failed to pick a file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload the file.');
    }
  };