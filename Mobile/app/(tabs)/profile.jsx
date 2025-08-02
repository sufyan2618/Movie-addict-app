import { View, Text, TouchableOpacity, FlatList, Alert, Image, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react'; 
import ProfileHeader from '../../components/ProfileHeader';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { formatePostDate } from '../../util/formatDate';
import AntDesign from '@expo/vector-icons/AntDesign';
import { sleep } from '../../constants/api';

const ProfileScreen = () => {
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { Logout, GetMovies, token, DeleteMovie, isDeletingMovie } = useAuthStore();
  const moviesCount = movies.length;

  const fetchMovies = useCallback(async () => {
    try {
      const response = await GetMovies(token);
      if (response && response.success) {
        setMovies(response.movies);
      } else {
        Alert.alert("Error", "Failed to fetch movies. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      Alert.alert("Error", "An unexpected error occurred while fetching movies.");
    }
  }, [token, GetMovies]);


  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); 

  const handleDelete = async (id) => {
    const response = await DeleteMovie(id);
    if (response && response.success) {
      setMovies(prevMovies => prevMovies.filter(movie => movie._id !== id));
      Alert.alert("Success", "Movie deleted successfully.");
    } else {
      Alert.alert("Error", "Failed to delete movie. Please try again later.");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this movie? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDelete(id) }
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  };
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <View key={i}>
          <FontAwesome
            name={i <= rating ? "star" : "star-o"}
            size={18}
            color={i <= rating ? "#800080" : "black"}
            style={{ marginRight: 4 }} 
          />
        </View>
      );
    }
    return stars;
  };


  const renderMovies = ({ item }) => (
    <View className="bg-white p-4 rounded-lg shadow-md mb-4 flex-row m-4">
      <Image
        source={{ uri: item.image }}
        className="w-20 h-32 rounded-lg" 
        resizeMode="cover"
      />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-[#800080] mb-2">{item.title}</Text>
        <View className="flex-row items-center">{renderStars(item.rating)}</View>
        <Text className="text-gray-600 mt-2" numberOfLines={3}>{item.description}</Text>
        <Text className="text-gray-500 mt-auto pt-2 text-xs">{formatePostDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => confirmDelete(item._id)}
        className="absolute top-2 right-2 p-2 rounded-full"
      >
        {isDeletingMovie ? (
          <AntDesign name="loading1" size={24} color="#800080" />
        ) : (
          <AntDesign name="delete" size={24} color="#800080" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-[#e1c9f0]">
      <ProfileHeader />
      <TouchableOpacity
        onPress={Logout}
        className="bg-[#800080] m-3 p-4 rounded-2xl">
        <Text className="text-white text-lg font-bold text-center">Logout</Text>
      </TouchableOpacity>
      <View className="flex flex-row items-center justify-between px-4 mt-4">
        <Text className="text-gray-800 text-xl font-bold">Your Recommendations</Text>
        <Text className="text-gray-600 text-lg">{moviesCount} Movies</Text>
      </View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item._id}
        renderItem={renderMovies}
        className="mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-600 text-lg text-center">
              No movies found. Pull down to refresh.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#800080"]}
          />
        }
      />
    </View>
  );
};

export default ProfileScreen;
