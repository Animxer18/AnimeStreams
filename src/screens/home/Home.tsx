import { FlatList, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Pressable,RefreshControl } from 'react-native'
import React, { useEffect, useState, FC } from 'react'
import { GET } from '../../config/http-calls'
import { RecentAnimeList, SerachAnimeType } from './types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'
import { COLORS, GenreList } from '../../config/common'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'
import ListItem from '../../component/listItem/ListItem'


const Home = () => {
    const [recentAnimeList, setRecentAnimeList] = useState<RecentAnimeList[]>([])
    const [topAiringList, setTopAiringList] = useState<RecentAnimeList[]>([])
    const [trendingList, setTrendingList] = useState<RecentAnimeList[]>([])
    const [searchOpen, setSearchOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [searchedAnimesList, setSearchedAnimesList] = useState<SerachAnimeType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>()


    useEffect(() => {
        getRecentAnimes()
        getTopAireingAnimes()
        getTrendingAnime()
    }, [])

    const getRecentAnimes = () => {
        setLoading(true)
        GET('/anime/gogoanime/recent-episodes', {}, { page: 1, type: 1 })
            .then((response: any) => {
                setRecentAnimeList(response?.results)
                setLoading(false)
                setRefreshing(false)

            }).catch(error => {
                console.log("Anime List Error", error);
                setLoading(false)
                setRefreshing(false)
            })
    }
    const getTopAireingAnimes = () => {
        setLoading(true)
        GET('/anime/gogoanime/top-airing', {}, { page: 1, type: 1 })
            .then((response: any) => {
                setTopAiringList(response?.results)
                setLoading(false)
                setRefreshing(false)
            }).catch(error => {
                console.log("Anime List Error", error);
                setLoading(false)
                setRefreshing(false)
            })
    }
    const getTrendingAnime = () => {
        setLoading(true)
        GET('/meta/anilist/trending', {}, { page: 1, provider: "gogoanime", perPage: 20 })
            .then((response: any) => {
                console.log("Anime List", response)
                const trendingArr = response.results.map((item: any) => {
                    return { ...item, title: item.title.romaji ? item.title.romaji : item.title.userPreferred, provider: 'anilist' }
                })
                console.log("trendingArr", trendingArr);
                setTrendingList(trendingArr)
                setRefreshing(false)

                setLoading(false)
            }).catch(error => {
                console.log("Anime List Error", error);
                setLoading(false)
                setRefreshing(false)
            })
    }

    const searchAnimes = (query: string) => {
        GET(`/anime/gogoanime/${query}`).then(response => {
            console.log("searching...", response);

            setSearchedAnimesList(response.results.slice(0, 5));

        }).catch(err => {
            console.log("ERROR:", err);

        })
    }

    const navigateToSearchAnimeList = () => {
        navigation.navigate("SearchScreen", { search: search })
    }
    const navigateToScreen = (id: string, provider?: string) => {
        navigation.navigate('AnimeDetails', { id: id, provider: provider })
    }

    const onRefresh = () =>{
        setRefreshing(true)
        getRecentAnimes()
        getTopAireingAnimes()
        getTrendingAnime()
    }
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps='handled'
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLORS.LIME]}
                    progressBackgroundColor={COLORS.BLACK}
                />
            }
        >
            <HeaderComponent onSearchOpen={() => { setSearchOpen(prev => !prev) }} from="home" />
            {searchOpen ? (
                <View style={styles.searchView}>
                    <TextInput
                        onChangeText={text => {
                            setSearch(text)
                            setTimeout(() => {
                                searchAnimes(text)
                            }, 400)

                        }}
                        value={search}
                        style={styles.search}

                        placeholder='Search animes...'
                    />
                    <TouchableOpacity style={styles.searchSmall} onPress={() => {
                        if (searchedAnimesList.length > 0) { setSearch(''); setSearchedAnimesList([]) } else { searchAnimes(search) }
                    }}>
                        <Ionicons name={searchedAnimesList.length > 0 ? "ios-close" : "search"} size={18} color={'black'} />
                    </TouchableOpacity>

                    {searchedAnimesList.length > 0 ? <View style={{ height: 370, position: 'absolute', top: 50, width: '90%', backgroundColor: COLORS.GREY }}>
                        <ScrollView contentContainerStyle={{ height: 300, zIndex: 99999, flexGrow: 1, padding: 10 }} keyboardShouldPersistTaps="handled">
                            {searchedAnimesList?.map(item => {
                                return (<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPress={() => navigation.navigate('AnimeDetails', { id: item.id })}>
                                    <Image source={{ uri: item?.image }} style={{ height: 55, width: 40 }} resizeMode='contain' />
                                    <View>
                                        <Text style={{ marginLeft: 10, color: 'white' }}>{item?.title}</Text>
                                    </View>
                                </TouchableOpacity>)
                            })}
                            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.seeAllText} onPress={navigateToSearchAnimeList}>{"View all results "}</Text>
                                <Ionicons name='ios-arrow-forward-outline' size={18} color={COLORS.LIME} />
                            </View>
                        </ScrollView>
                    </View> : null}
                </View>
            ) : null}
            <SkeletonContent
                containerStyle={{ flex: 1 }}
                isLoading={loading}
                animationType='shiver'
                duration={500}
                layout={[
                    { key: 'key1', width: 200, height: 30, marginLeft: 16, marginTop: 5 },
                    { key: 'key2', width: 100, height: 180, marginLeft: 16, marginTop: 20, },
                    { key: 'key3', width: 100, height: 180, marginLeft: 125, marginTop: -180 },
                    { key: 'key4', width: 100, height: 180, marginLeft: 234, marginTop: -180 },
                    { key: 'key5', width: 100, height: 180, marginLeft: 343, marginTop: -180 },
                    { key: 'key6', width: 200, height: 30, marginLeft: 16, marginTop: 25 },
                    { key: 'key7', width: 100, height: 180, marginLeft: 16, marginTop: 20, },
                    { key: 'key8', width: 100, height: 180, marginLeft: 125, marginTop: -180 },
                    { key: 'key9', width: 100, height: 180, marginLeft: 234, marginTop: -180 },
                    { key: 'key10', width: 100, height: 180, marginLeft: 343, marginTop: -180 },
                    { key: 'key11', width: 200, height: 30, marginLeft: 16, marginTop: 25 },
                    { key: 'key12', width: 100, height: 180, marginLeft: 16, marginTop: 20, },
                    { key: 'key13', width: 100, height: 180, marginLeft: 125, marginTop: -180 },
                    { key: 'key14', width: 100, height: 180, marginLeft: 234, marginTop: -180 },
                    { key: 'key15', width: 100, height: 180, marginLeft: 343, marginTop: -180 },
                ]}
                boneColor="grey"
                highlightColor='#F2F8FC'
            >
                <View style={{ zIndex: 0 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('RecentAnimes') }}>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginRight: 16 }}>
                            <Text style={styles.mainTitle}>Recent Episodes</Text>

                            <Ionicons name='ios-arrow-forward-outline' size={22} color={COLORS.LIME} />
                        </View>
                    </TouchableOpacity>

                    <FlatList
                        horizontal={true}
                        scrollEnabled={true}
                        keyExtractor={item => item.id}
                        data={recentAnimeList}
                        contentContainerStyle={{ paddingBottom: 5, marginLeft: 6, marginTop: 8 }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ marginLeft: 10 }}>
                                    <ListItem {...item} onPress={(id) => navigateToScreen(id)} />
                                </View>
                            )
                        }}
                    />
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('TrendingAnimes') }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginRight: 16 }}>
                        <Text style={styles.mainTitle}>Trending</Text>
                        <Ionicons name='ios-arrow-forward-outline' size={22} color={COLORS.LIME} />
                    </View>
                </TouchableOpacity>
                <FlatList
                    horizontal={true}
                    scrollEnabled={true}
                    keyExtractor={item => item.id}
                    data={trendingList}
                    contentContainerStyle={{ paddingBottom: 5, marginLeft: 6, marginTop: 8 }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginLeft: 10 }}>
                                <ListItem {...item} onPress={(id) => { navigateToScreen(id, 'anilist') }} />
                            </View>
                        )
                    }}
                />
                <TouchableOpacity onPress={() => { navigation.navigate('TopAiring') }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginRight: 16 }}>
                        <Text style={styles.mainTitle}>Top Airing</Text>
                        <Ionicons name='ios-arrow-forward-outline' size={22} color={COLORS.LIME} />
                    </View>
                </TouchableOpacity>
                <View style={styles.episodesWrapper}>

                    <FlatGrid
                        itemDimension={170}
                        data={topAiringList}
                        style={{ marginBottom: -8 }}
                        contentContainerStyle={{ marginBottom: -10 }}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (<ListItem {...item} onPress={(id) => navigateToScreen(id)} />)}
                    />
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('AllGenre') }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginRight: 16 }}>
                        <Text style={styles.mainTitle}>All Genre</Text>
                        <Ionicons name='ios-arrow-forward-outline' size={22} color={COLORS.LIME} />
                    </View>
                </TouchableOpacity>
                <View style={styles.genreView}>
                    {GenreList.map(item => {
                        return <Pressable key={item} style={styles.itemView} onPress={() => {
                            navigation.navigate('GenreList', { name: item })
                        }}>
                            <Text style={styles.genreText}>{item}</Text>
                        </Pressable>
                    })}
                </View>
            </SkeletonContent>
        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: '700',
        // marginVertical: 8,
        marginHorizontal: 16,
        color: 'white'
    },
    episodesWrapper: {
        paddingHorizontal: 6
    },
    searchView: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999999
    },
    search: {
        width: '90%',
        height: 45,
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 10,
        color: COLORS.BLACK
    },
    searchSmall: {
        position: 'absolute',
        right: "8%",
        top: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    seeAllText: {
        color: COLORS.LIME,
        textAlign: 'center',

    },
    itemView: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
        margin: 5
    },
    genreText: {
        color: COLORS.WHITE
    },
    genreView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        paddingHorizontal: 10,
    }
})