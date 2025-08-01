import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({children}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  )
}
const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: "#e1c9f0",
  }
})

export default SafeScreen

