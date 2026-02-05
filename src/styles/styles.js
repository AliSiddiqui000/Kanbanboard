import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  column: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginRight: 16,
    width: 200,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rowList: {
    marginBottom: 8,
  },
  row: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  rowText: {
    fontSize: 16,
  },
  rowdes: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalheading:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  commentContainer:{
    marginVertical: 10,
  },
  commentText:{
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  imagePickerText: {
    color: 'blue',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default styles;