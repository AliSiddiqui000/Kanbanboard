import React, { useRef, useState } from 'react';
import { View, Text, Animated, Image, TextInput, Button, FlatList, PanResponder } from 'react-native';
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
import AntDesign from "react-native-vector-icons/dist/AntDesign";
import styles from '../styles/styles';

const Row = ({ row, onDropRow, columnId, onDeleteRow, onEditRow, onAddComment }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(row.comments || []);
    const [commentdis, setCommentDis] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({ x: pan.x._value, y: pan.y._value });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gestureState) => {
                onDropRow(gestureState.moveX, row, columnId);
                pan.flattenOffset();
                pan.setValue({ x: 0, y: 0 });
            },
        })
    ).current;

    const handleAddComment = () => {
        if (comment.trim()) {
            const newComments = [...comments, comment];
            setComments(newComments);
            onAddComment(row.id, columnId, newComments);
            setComment('');
        }
    };

    return (
        <Animated.View
            style={[styles.row, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
            {...panResponder.panHandlers}
        >
            <Text style={styles.rowText}>{row?.text}</Text>
            <Text style={styles.rowdes}>{row?.description}</Text>

            {/* Display Task Image */}
            {row?.image && (
                <Image source={{ uri: row.image }} style={{ height: 100, marginTop: 10 }} />
            )}

            {/* Display Google Drive File */}
            {row?.fileDetails && (
                <View style={{ marginVertical: 10 }}>
                    {row.fileDetails.fileType.startsWith('image/') ? (
                        <Image
                            source={{ uri: row.fileDetails.fileId }}
                            style={{ height: 100, marginTop: 10 }}
                        />
                    ) : (
                        <Text>File Name: {row.fileDetails.fileName}</Text>
                    )}
                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                <FontAwesome name="commenting-o" size={20} onPress={() => setCommentDis(!commentdis)} />
                <FontAwesome name="edit" size={20} onPress={() => onEditRow(row)} />
                <AntDesign name="delete" size={20} onPress={() => onDeleteRow(row.id, columnId)} />
            </View>

            {/* Comment Section */}
            {commentdis && (
                <View style={styles.commentContainer}>
                    <TextInput
                        placeholder="Add a comment"
                        value={comment}
                        onChangeText={setComment}
                        style={styles.input}
                    />
                    <Button title="Add Comment" onPress={handleAddComment} />
                </View>
            )}

            {/* Display Comments */}
            <FlatList
                data={row?.comments || []}
                renderItem={({ item }) => <Text style={styles.commentText}>{`Comment: ${item}`}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
        </Animated.View>

    );
};

export default Row;