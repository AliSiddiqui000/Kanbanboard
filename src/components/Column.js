import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Row from './Row';
import styles from '../styles/styles';

const Column = ({ column, onDropRow, onDeleteRow, onEditRow, onAddComment }) => {
  const renderRow = ({ item }) => (
    <Row
      row={item}
      onDropRow={onDropRow}
      columnId={column.id}
      onDeleteRow={onDeleteRow}
      onEditRow={onEditRow}
      onAddComment={onAddComment}
    />
  );

  return (
    <View style={styles.column}>
      <Text style={styles.columnTitle}>{column.title}</Text>
      <FlatList
        data={column.rows}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        style={styles.rowList}
      />
    </View>
  );
};

export default Column;