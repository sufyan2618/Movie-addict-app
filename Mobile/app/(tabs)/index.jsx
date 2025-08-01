import { View, Text, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import useAuthStore from '../../store/useAuthStore'
import { useEffect, useState } from 'react'
import useMovieStore from '../../store/useMovieStore';
import { FontAwesome } from '@expo/vector-icons';
import { formatePostDate } from '../../util/formatDate';

const Home = () => {

  const [page, setPage] = useState(1);
  const [hasMore,setHasMore] = useState(true)
  const {token} = useAuthStore();
  const {FetchMovies, isFetchingMovies, movies} = useMovieStore()


  useEffect(() => {
    const response = FetchMovies(page, token);
    setHasMore(response.totalPages > page);
  }, []);
  console.log(hasMore)

  const renderStars = (rating) =>{
    const stars = []
    for (let i = 1; i <=5; i++) {
      stars.push(
        <View>
          <FontAwesome name={i <= rating ? "star" : "star-o"}
          size={24} color={i<=rating ? "#800080" : "black"} 
          className="p-1"
          />
        </View>
      )
    }
    return stars;
  }

  const renderMovies = ({ item }) => (
    <View className="m-4 ml-0 p-5 h-auto w-full rounded-2xl shadow-md bg-white"> 

      <View className="flex flex-row items-center mb-4">
        <Image
        source={{uri: item.user.profilePicture}}   
          className="w-16 h-16 rounded-full bg-red-400"

        />
        <Text className="text-lg text-center font-bold text-[#800080] ml-4">
          {item.user.username}
        </Text>
      </View>
      <Image
      source={{uri: item.image}}
      className="w-[300px] h-[300px] rounded-xl "
      />
      <Text className="font-bold text-[#800080] pt-3 pl-2 text-2xl">
        {item.title}
      </Text>
      <View className="flex flex-row items-center justify-start bg-white mr-4  h-16 rounded-lg">
              {renderStars(item.rating)}
      </View>
      <Text className=" pl-3 text-lg">
        {item.description}
      </Text>
      <Text className="text-md ml-3">
        {formatePostDate(item.createdAt)}
      </Text>
    </View>
  );
  


  return (
    <View className="flex-auto items-center justify-center bg-[#e1c9f0]">
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
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
          refreshing={isFetchingMovies}
          onRefresh={() => FetchMovies(1, token)}
           />
        }
        ListFooterComponent={isFetchingMovies ? <Text>Loading...</Text> : null}
      />
    </View>
  )
}

export default Home