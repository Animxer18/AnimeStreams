import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { GET } from '../../config/http-calls'
import { GenreAnimeType } from './types'
import ListItem from '../../component/listItem/ListItem'
import { FlatGrid } from 'react-native-super-grid'
import { COLORS } from '../../config/common'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'

const GenreList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams, 'GenreList'>>()
    const route = useRoute<RouteProp<HomeStackParams, 'GenreList'>>()
    const [page, setPage] = useState<number>(0)
    const [animebyGenreList, setAnimebyGenreList] = useState<GenreAnimeType[]>([])


    useEffect(() => {
        getAnimes(page)
    }, [page])

    const getAnimes = (page: number) => {
        GET(`/anime/gogoanime/genre/${route.params?.name?.toLocaleLowerCase()}`, {}, { page: page, type: 1 })
            .then((response: any) => {
                console.log("Anime Action List", response)
                if (page === 0) {
                    setAnimebyGenreList(response?.results)
                } else {
                    const tempArr = [...animebyGenreList, ...response.results];
                    setAnimebyGenreList(tempArr)
                }
            }).catch(error => {
                console.log("Anime List Error", error);

            })
    }
    return (

        <View style={styles.container}>
            <HeaderComponent onBackPress={() => navigation.goBack()} title={route.params?.name} />

            <Text>GenreList</Text>

            <View style={styles.episodesWrapper}>

                <FlatGrid
                    itemDimension={170}
                    data={animebyGenreList}
                    style={{marginTop: -15}}
                    contentContainerStyle={{ marginBottom: -10, marginTop: -10 }}
                    onEndReached={() => {
                        setPage(page + 1)
                    }}
                    onEndReachedThreshold={2}
                    renderItem={({ item }) => (<ListItem {...item} />)}

                />
            </View>
        </View>
    )
}

export default GenreList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND
    },
    episodesWrapper: {
        paddingHorizontal: 6, 
        alignItems: 'center'
    },
})