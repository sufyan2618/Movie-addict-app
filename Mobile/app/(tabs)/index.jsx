import { View, Text, TouchableOpacity } from 'react-native'
import useAuthStore from '../../store/useAuthStore'

const Home = () => {

  const {Logout} = useAuthStore();

  return (
    <View className="items-center justify-center flex-1" >
      <TouchableOpacity
      className="border-2  border-s-sky-200"
      onPress={Logout}
      >
        <Text className="p-4">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home