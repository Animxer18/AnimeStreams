import { StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'
import { COLORS } from '../../config/common'
import { FlatGrid } from 'react-native-super-grid'
import ListItem from '../../component/listItem/ListItem'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { RecentAnimeList } from '../home/types'
import { GET } from '../../config/http-calls'

const TrendingAnimes = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>()
    const [page, setPage] = useState<number>(1)
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [trendingAnimeList, setTrendingList] = useState<RecentAnimeList[]>([])
    const [refreshing, setRefreshing] = useState<boolean>(false)
    useEffect(() => {
        getTrendingAnime(page)
        console.log("page", page);
        
    }, [page])

    const getTrendingAnime = (page:number) => {
        setRefreshing(true)
        GET('/meta/anilist/trending', {}, { page: page, provider: "gogoanime", perPage: 20 })
            .then((response: any) => {
                console.log("Anime List", response)
                setHasNextPage(response.hasNextPage)
                const trendingArr = response.results.map((item: any) => {
                    return { ...item, title: item.title.romaji ? item.title.romaji : item.title.userPreferred, provider: 'anilist' }
                })
                console.log("trendingArr", trendingArr);
                setTrendingList(trendingArr)
                setRefreshing(false)
                if (page === 0) {
                    setTrendingList(trendingArr)
                } else {
                    const tempArr = [...trendingAnimeList, ...trendingArr];
                    setTrendingList(tempArr)

                }
            }).catch(error => {
                console.log("Anime List Error", error);
                setRefreshing(false)
            })
    }
    const navigateToScreen = (id: string) => {
        navigation.navigate('AnimeDetails', { id: id })
    }

    const onRefresh = () => {
        setRefreshing(true)
        getTrendingAnime(1)
    }
    return (
        <View style={{ backgroundColor: COLORS.BACKGROUND, flex: 1 }}>
            <HeaderComponent onBackPress={() => navigation.goBack()} title='Trending Animes' />
            {/* <Text style={styles.mainTitle}>Recent Animes</Text> */}

            <FlatGrid
                itemDimension={170}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLORS.LIME]}
                    progressBackgroundColor={COLORS.BLACK}
                />}
                data={trendingAnimeList}
                onEndReached={() => {
                    hasNextPage && setPage(prev => prev + 1)
                }}
                onEndReachedThreshold={0.75}
                renderItem={({ item }) => (<ListItem {...item} onPress={navigateToScreen} />)}

            />
        </View>
    )
}

export default TrendingAnimes

const styles = StyleSheet.create({})