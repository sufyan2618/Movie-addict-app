import { View, Text, TouchableOpacity, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import { useEffect, useState, useCallback } from 'react';
import useMovieStore from '../../store/useMovieStore';
import { FontAwesome } from '@expo/vector-icons';
import { formatePostDate } from '../../util/formatDate';

const Home = () => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { token, Logout, isCheckingAuth } = useAuthStore();
    const { FetchMovies, isFetchingMovies, movies } = useMovieStore();

    useEffect(() => {
        async function initialFetch() {
            const response = await FetchMovies(1, token);
            if (response && response.totalPages) {
                setPage(1);
                setHasMore(response.totalPages > 1);
            }
        }
        initialFetch();
    }, [token]); 

    const handleLoadMore = useCallback(async () => {
        if (isFetchingMovies || !hasMore) {
            return;
        }

        const nextPage = page + 1;
        const response = await FetchMovies(nextPage, token);
        
        if (response && response.success) {
            setPage(nextPage);
            setHasMore(response.totalPages > nextPage);
        }
    }, [isFetchingMovies, hasMore, page, token]);

    const handleRefresh = useCallback(async () => {
        const response = await FetchMovies(1, token);
        if (response && response.success) {
            setPage(1);
            setHasMore(response.totalPages > 1);
        }
    }, [token]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <View key={i}>
                    <FontAwesome name={i <= rating ? "star" : "star-o"}
                        size={24} color={i <= rating ? "#800080" : "black"}
                        className="p-1"
                    />
                </View>
            );
        }
        return stars;
    };

    const renderMovies = ({ item }) => (
        <View className="m-4 p-5 h-auto w-auto rounded-2xl shadow-md bg-white">
            <View className="flex flex-row items-center mb-4">
                <Image
                    source={{ uri: item.user.profilePicture }}
                    className="w-16 h-16 rounded-full bg-red-400"
                />
                <Text className="text-xl text-center font-bold text-[#800080] ml-4">
                    {item.user.username}
                </Text>
            </View>
            <Image
                source={{ uri: item.image }}
                className="w-full h-[200px] rounded-xl " 
                resizeMode="cover"
            />
            <Text className="font-bold text-[#800080] pt-3 pl-2 text-2xl">
                {item.title}
            </Text>
            <View className="flex flex-row items-center justify-start bg-white mr-4 h-16 rounded-lg">
                {renderStars(item.rating)}
            </View>
            <Text className="pl-3 text-lg">
                {item.description}
            </Text>
            <Text className="text-md ml-3">
                {formatePostDate(item.createdAt)}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!isFetchingMovies || page === 1) return null;
        return <ActivityIndicator size="large" color="#800080" style={{ marginVertical: 20 }} />;
    };

    if(isCheckingAuth){
        return <ActivityIndicator size={'large'} />
    }

    return (
        <View className="flex-1 bg-[#e1c9f0]">
            <FlatList
                data={movies}
                keyExtractor={(item) => item._id}
                renderItem={renderMovies}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetchingMovies && page === 1} // Only show refresh spinner on page 1 fetch
                        onRefresh={handleRefresh}
                    />
                }
                ListHeaderComponent={
                    <View className="flex  items-center justify-center w-full p-4">
                         <Text className="text-3xl text-center font-bold text-[#800080]">
                            Movie Addicts
                        </Text>
                        <Text className="text-lg text-gray-800 text-center mt-1">
                            Discover the latest movies and TV shows
                        </Text>
                      </View>  
                }
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

export default Home;
