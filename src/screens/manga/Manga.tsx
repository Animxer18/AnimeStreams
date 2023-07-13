import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../config/common'
import { useNavigation } from '@react-navigation/native'
import { HomeStackParams, MangaStackParams } from '../../navigation/AppNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const Manga = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MangaStackParams>>()
  const [search, setSearch] = useState<string>('')
  const navigate = () => {
    navigation.navigate('MangaList',{search: search})
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <Text style={styles.title}>Search Manga</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder='Search Mangas...'
        style={styles.searchInput}
      />
      <TouchableHighlight onPress={navigate}>
        <View style={styles.searchBtn}>
          <Text style={styles.searchText}>Search</Text>
        </View>
      </TouchableHighlight>
    </KeyboardAvoidingView>
  )
}

export default Manga

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  title: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15
  },
  searchInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 50,
    height: 50,
    paddingHorizontal: 15, width: '100%'
  },
  searchBtn: {
    backgroundColor: COLORS.LIME,
    height: 40,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 6,
    elevation: 5
  },
  searchText: {
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.WHITE
  }
})