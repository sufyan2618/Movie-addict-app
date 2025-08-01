import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import {useState} from 'react'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import useMovieStore from '../../store/useMovieStore';
import useAuthStore from '../../store/useAuthStore';

const create = () => {

  const [title, settitle] = useState('');
  const [rating, setrating] = useState(1);
  const [picture, setPicture] = useState(null);
  const [caption, setCaption] = useState('');
  const {token} = useAuthStore()

  
  const {isUploading, UploadMovie} = useMovieStore()

  const ratingFunction = () => {
    let ratingArray = [];
    for (let i = 1; i <= 5; i++) {
      ratingArray.push(
        <TouchableOpacity
          key={i}
          onPress={() => setrating(i)}
        >
          <FontAwesome name="star" size={24} color={i<=rating ? "#800080" : "#d3d3d3"} />
        </TouchableOpacity>
      );
    }
    return ratingArray;
  }


  const selectImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // lower quality for smaller base64
      });

      if (!result.canceled) {
        setPicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };
  const handleSubmit = async () => {
    if (!title || !caption || !picture) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }
    const response = await UploadMovie(title, rating, picture, caption, token);
    if (response.error) {
      Alert.alert("Upload Failed", response.error);
    }
    else if (response.success) {
      Alert.alert("Success", "Your movie recommendation has been added!");
      settitle('');
      setrating(1);
      setPicture(null);
      setCaption('');
    }
  };


  return (
    <KeyboardAvoidingView
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    className="flex-1"
    >
      <ScrollView className="bg-[#d896ff] flex-1">
        <View className="flex-1 justify-center bg-white w-auto h-auto m-6 pt-6 rounded-xl">
          <Text className="text-center text-2xl font-bold" >
            Add Movie recommendation
          </Text>
          <Text className="mt-2 text-center"> 
            Share you favorite Movies with the world!
          </Text>
          <View className="mt-6 p-5 ">
            <Text className="font-bold">
              Title
            </Text>
            <View className="flex flex-row items-center bg-white mr-4 p-2 h-16 rounded-lg">
            <FontAwesome name="user" size={24} color="#800080"  />
            <TextInput
              value={title}
              onChangeText={settitle}
              className="bg-white ml-4 p-2 pr-10 h-16 w-auto rounded-lg border-black border-2"
              placeholder="Enter title of Movie"
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          </View>
          <View className="p-5">
            <Text>
              Rating
            </Text>
            <View className="flex flex-row items-center justify-between bg-white mr-4 p-2 h-16 rounded-lg">
              {ratingFunction()}
              </View>
          </View>
          <View className="p-5">
            <Text className="font-bold">
              Picture
            </Text>
            <TouchableOpacity onPress={selectImage} className="flex flex-col items-center justify-center bg-white h-[200px] w-200 rounded-lg pb-10">
              { picture ? (
                <Image source={{ uri: picture }} className="h-full w-full rounded-lg " />
              ) : (
                <View className="flex flex-col items-center justify-center bg-white ">
                  <FontAwesome name="picture-o" size={24} color="#800080" />
                  <Text className="text-center">Select Picture</Text>
                </View>
              ) }
            </TouchableOpacity>
          </View>
          <View className="p-5">
            <Text className="font-bold p-5">
              Caption
            </Text>
            <View className="flex flex-row items-center bg-white mr-4 p-2 h-16 rounded-lg">
              <FontAwesome name="comment" size={24} color="#800080" />
              <TextInput
                value={caption}
                onChangeText={setCaption}
                className="bg-white ml-4 mr-4 p-2 h-16 rounded-lg"
                placeholder="Enter caption for the movie"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect={false}
              />
            </View>
          </View>
          <TouchableOpacity 
          disabled={isUploading}
          className={`bg-[#800080] p-4 rounded-lg m-5 ${isUploading ? 'opacity-50' : ''}` }
          onPress={handleSubmit}>
            <Text className="text-white text-center font-bold text-lg">
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default create