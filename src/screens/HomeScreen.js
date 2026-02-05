import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Button,
  Modal,
  TextInput,
  Alert,
  Image,
  Text,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import Column from '../components/Column';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import styles from '../styles/styles';
import AntDesign from "react-native-vector-icons/dist/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import { uploadFileToGoogleDrive } from '../utils/storage';

const initialColumns = [
  { id: '1', title: 'To Do', rows: [] },
  { id: '2', title: 'In Progress', rows: [] },
  { id: '3', title: 'Done', rows: [] },
];

const HomeScreen = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskImage, setTaskImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const updatedColumns = initialColumns.map((column) => ({
        ...column,
        rows: tasks.filter(task => task.columnId === column.id),
      }));
      setColumns(updatedColumns);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (columns) => {
    try {
      if (!Array.isArray(columns)) {
        throw new Error('Invalid columns format');
      }
      const tasksToSave = columns.flatMap(column => 
        Array.isArray(column.rows) 
          ? column.rows.map(row => ({ ...row, columnId: column.id })) 
          : []
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
      console.log('Tasks saved successfully');
    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  };
  
  const triggerVibrationAfter15Minutes = () => {
    setTimeout(() => {
        Vibration.vibrate(5000);
        console.log('Vibration triggered');
    }, 900000); // Delay for 15 minutes (900,000 ms)
};
  
  const onDropRow = (x, row, fromColumnId) => {
    const screenWidth = Dimensions.get('window').width;
    const columnWidth = screenWidth / initialColumns.length;
    const sourceColumnIndex = columns.findIndex(col => col.id === fromColumnId);
    const targetColumnIndex = sourceColumnIndex + (x > columnWidth / 2 ? 1 : 0);
  
    if (targetColumnIndex < 0 || targetColumnIndex >= initialColumns.length) {
      return;
    }
  
    const targetColumn = columns[targetColumnIndex];
    const canMove =
      (fromColumnId === '1' && targetColumn.id === '2') ||
      (fromColumnId === '2' && targetColumn.id === '3');
  
    if (canMove) {
      setColumns((prevColumns) => {
        const updatedColumns = prevColumns.map((column) => {
          if (column.id === fromColumnId) {
            return { ...column, rows: column.rows.filter((item) => item.id !== row.id) };
          }
          if (column.id === targetColumn.id) {
            return { ...column, rows: [...column.rows, { ...row, columnId: targetColumn.id }] };
          }
          return column;
        });
  
        saveTasks(updatedColumns);
        return updatedColumns;
      });
      if(Platform.OS === 'android'){
        if (fromColumnId === '1' && targetColumn.id === '2') {
          console.log('Vibration will trigger.');
          triggerVibrationAfter15Minutes();
        }
      }
    }
  };
  
  const handleTaskSave = async () => {
    const newTask = {
      id: Date.now().toString(),
      text: taskName,
      description: taskDescription,
      image: taskImage,
      fileDetails,
      columnId: '1',
      comments: [],
    };
  
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      loadTasks();
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  const handleImagePick = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setTaskImage(response.assets[0].uri);
      }
    });
  };

  const handleCameraPick = () => {
    launchCamera({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        setTaskImage(response.assets[0].uri);
      }
    });
  };

  const resetForm = () => {
    setModalVisible(false);
    setTaskName('');
    setTaskDescription('');
    setTaskImage(null);
    setEditMode(false);
    setFileDetails(null);
  };

  const handleEditTask = (task) => {
    setTaskName(task.text);
    setTaskDescription(task.description);
    setTaskImage(task.image);
    setEditMode(true);
    setEditTaskId(task.id);
    setModalVisible(true);
  };

  const handleUpdateTask = async () => {
    try {
      const tasks = columns.flatMap(column => column.rows.map(row => ({ ...row })));
      const updatedTasks = tasks.map((task) => {
        if (task.id === editTaskId) {
          return {
            ...task,
            text: taskName,
            description: taskDescription,
            image: taskImage,
          };
        }
        return task;
      });

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      loadTasks();
      resetForm();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = (taskId, columnId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            setColumns((prevColumns) => {
              const updatedColumns = prevColumns.map((column) => {
                if (column.id === columnId) {
                  return { ...column, rows: column.rows.filter((row) => row.id !== taskId) };
                }
                return column;
              });
              saveTasks(updatedColumns);
              return updatedColumns;
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddComment = (taskId, columnId, comments) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            rows: column.rows.map((row) => {
              if (row.id === taskId) {
                return { ...row, comments };
              }
              return row;
            }),
          };
        }
        return column;
      });
      saveTasks(updatedColumns);
      return updatedColumns;
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={columns}
        renderItem={({ item }) => (
          <Column
            column={item}
            onDropRow={onDropRow}
            onDeleteRow={handleDeleteTask}
            onEditRow={handleEditTask}
            onAddComment={handleAddComment}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Button title="Add Task" onPress={() => setModalVisible(true)} />


      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
        <Text style={styles.modalheading}>{editMode ? "Update Task" : "Add Task"}</Text>
          <TextInput
            placeholder="Task Name"
            value={taskName}
            onChangeText={setTaskName}
            style={styles.input}
          />
          <TextInput
            placeholder="Task Description"
            value={taskDescription}
            onChangeText={setTaskDescription}
            style={styles.input}
          />
          {fileDetails && (
          <View style={{ marginVertical: 10 }}>
            {fileDetails.fileType && fileDetails.fileType.startsWith('image/') ? (
              <Image
                source={{ uri: fileDetails.fileId }}
                style={styles.image}
              />
            ) : (
              <Text>File Name: {fileDetails.fileName}</Text>
            )}
          </View>
        )}
        {taskImage && <Image source={{ uri: taskImage }} style={styles.image} />}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
            <AntDesign name='camerao' size={25} onPress={handleCameraPick} />
            <MaterialCommunityIcons name='view-gallery-outline' size={25} onPress={handleImagePick} />
            <MaterialCommunityIcons name='google-drive' size={25} onPress={()=>uploadFileToGoogleDrive((setFileDetails))} />
          </View>
          <View style={{marginVertical: 5}} />
          <Button
            title={editMode ? "Update Task" : "Add Task"}
            onPress={editMode ? handleUpdateTask : handleTaskSave}
          />
          <View style={{marginVertical: 5}} />
          <Button title="Cancel" onPress={resetForm} />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;