import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import useAuthStore from '../../store/useAuthStore'
import { useEffect, useState } from 'react'
import useMovieStore from '../../store/useMovieStore';

const Home = () => {

  const [page, setPage] = useState(1);
  const {token, Logout} = useAuthStore();
  console.log("Token:", token);
  const {FetchMovies, isFetchingMovies, movies} = useMovieStore()

  useEffect(() => {
    FetchMovies(page, token);
  }, []);

  const renderMovies = ({ item }) => (
    <View className="m-4 p-8 h-96 w-80 rounded-lg shadow-md bg-white"> 
    <TouchableOpacity
    onPress={Logout}
    >
      <Text className="text-white text-center">
        Logout
      </Text>
    </TouchableOpacity>
      <View className="flex flex-row items-center mb-4">
        <Image
        source='https://api.dicebear.com/7.x/avataaars/png?seed=sufyan'
        
          className="w-20 h-20 rounded-lg bg-red-400"

        />
        <Text className="text-lg text-center font-bold text-gray-800 ml-4">
          {item.user.username}
        </Text>
      </View>
    </View>
  );
  


  return (
    <View className="flex-1 items-center justify-center bg-[#e1c9f0]">
      <FlatList
        data={movies}
        keyExtractor={(item) => item._id}
        renderItem={renderMovies}
        // onEndReached={() => {
        //   if (!isFetchingMovies) {
        //     setPage((prevPage) => prevPage + 1);
        //     FetchMovies(page + 1, token);
        //   }
        // }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isFetchingMovies ? <Text>Loading...</Text> : null}
      />
    </View>
  )
}

export default Home