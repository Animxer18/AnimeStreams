import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RecentAnimeList } from '../home/types'
import { FlatGrid } from 'react-native-super-grid'
import { GET } from '../../config/http-calls'
import { COLORS } from '../../config/common'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'
import ListItem from '../../component/listItem/ListItem'


const RecentAnimes = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>()
    const [page, setPage] = useState<number>(0)
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [recentAnimeList, setRecentAnimeList] = useState<RecentAnimeList[]>([])


    useEffect(() => {
        getRecentReleasedAnimes(page)
    }, [page])

    const getRecentReleasedAnimes = (page: number) => {
        GET('/anime/gogoanime/recent-episodes', {}, { page: page, type: 1 })
            .then((response: any) => {
                console.log("recent Anime ", response)
                setHasNextPage(response.hasNextPage)
                if (page === 0) {
                    setRecentAnimeList(response?.results)
                } else {
                    const tempArr = [...recentAnimeList, ...response.results];
                    setRecentAnimeList(tempArr)
                }
            }).catch(error => {
                console.log("recent Anime Error", error);

            })
    }
    return (
        <View style={{ backgroundColor: COLORS.BACKGROUND, flex: 1 }}>
            <HeaderComponent onBackPress={() => navigation.goBack()} title='Recent Animes' />
            {/* <Text style={styles.mainTitle}>Recent Animes</Text> */}

            <FlatGrid
                itemDimension={170}
                data={recentAnimeList}
                onEndReached={() => {
                    hasNextPage && setPage(page + 1)
                }}
                onEndReachedThreshold={2}
                renderItem={({ item }) => (<ListItem {...item} />)}

            />
        </View>
    )
}

export default RecentAnimes

const styles = StyleSheet.create({
    mainTitle: {
        color: 'white',
        textAlign: 'center',
        // marginVertical: 5,
        marginHorizontal: 16,
        fontSize: 18,
        fontWeight: 'bold'
    },
})