import { View, Text, TouchableOpacity } from 'react-native'
import { useEffect , useState} from 'react'
import ProfileHeader from '../../components/ProfileHeader'
import useAuthStore from '../../store/useAuthStore';
const profile = () => {

  const [movies, setmovies] = useState([]);
  const { Logout, GetMovies, token } = useAuthStore();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await GetMovies();
        if (response && response.success) {
          setmovies(response.movies);
        } else {
          console.error("Failed to fetch movies:", response.message);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  })
  return (
    <View className="flex-1 bg-[#e1c9f0]">
      <ProfileHeader />
      <TouchableOpacity 
      onPress={Logout}
      className="bg-[#800080] m-3 p-4 rounded-2xl">
        <Text className="text-white text-lg font-bold text-center">
          Logout
        </Text>
      </TouchableOpacity>
      <View className="flex flex-col items-center justify-between mt-4">
      <Text className="text-gray-800 text-lg font-bold  mt-4">
        Your Recommendations
      </Text>
      <Text>
        {movies.length()}
      </Text>
      </View>
     
      
    </View>
  )
}

export default profile