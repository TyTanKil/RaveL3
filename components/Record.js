import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const RecordScreen = () => {
  const [recording, setRecording] = useState(false);
  const [recordedUris, setRecordedUris] = useState([]);
  const [counter, setCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [recordingName, setRecordingName] = useState('');
  
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordedUris((prevUris) => [...prevUris, { uri, name: `Enregistrement ${counter}` }]);
    setCounter((prevCounter) => prevCounter + 1);
    console.log('Recording stopped and stored at', uri);
  }

  async function playSound(uri) {
    try {
      if (isPlaying) {
        await currentSound.pauseAsync(); // Mettre en pause le son actuel
        setIsPlaying(false);
      } else {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: uri },
          { shouldPlay: true }
        );
        setIsPlaying(true);
        setCurrentSound(newSound);
      }
    } catch (error) {
      console.log('Failed to play/pause recording', error);
    }
  }

  async function downloadrecording() {
    try {
      // Check if the "recordings" directory exists, create it if it doesn't
      const dirInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + "recordings/"
      );
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "recordings/",
          { intermediates: true }
        );
      }

      // Define the new path for the recording file
      const newPath =
        FileSystem.documentDirectory +
        "recordings/" +
        recordingName.replace(/\s+/g, "") +
        ".wav";

      // Move the recording file to the new path
      await FileSystem.moveAsync({
        from: soundUri,
        to: newPath,
      });
    } catch (error) {
      console.log("Failed to save recording", error);
    }
  }
  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.audioItem} onPress={() => {playSound(item.uri);setSelectedRecordingUri(item.uri);}}>
      <View style={styles.audioItemContent}>
        <View style={styles.audioItemLeft}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="black" />
          <TextInput placeholder="Recording Name" value={recordingName} onChangeText={setRecordingName}></TextInput>
          <TouchableOpacity onPress={() => downloadrecording(item.uri)}>
            <Ionicons name="cloud-download-outline" size={24} color="blue" />
          </TouchableOpacity>
        </View>
        <View style={styles.audioItemRight}>
          <TouchableOpacity onPress={deleteRecording}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const deleteRecording = (uri) => {
    setRecordedUris((prevUris) => prevUris.filter((item) => item.uri !== uri));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Ionicons
          name={recording ? 'stop' : 'mic-outline'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <FlatList
        data={recordedUris}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
  },
  audioItem: {
    marginBottom: 10,
  },
  audioItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
  },
  audioItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioItemRight: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default RecordScreen;
