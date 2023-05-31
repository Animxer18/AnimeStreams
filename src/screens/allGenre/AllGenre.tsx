import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { GET } from '../../config/http-calls'
import { COLORS, GenreList } from '../../config/common'
import { GenreListType } from './types'
import ListItem from '../../component/listItem/ListItem'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'

const AllGenre = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams, 'AllGenre'>>()
    const route = useRoute<RouteProp<HomeStackParams, 'AllGenre'>>()
    const [animebyGenreList, setAnimebyGenreList] = useState<GenreListType[]>([])
    const [loading, setLoading] = useState(false)
    let temp: GenreListType[] = [];

    useEffect(() => {

        setLoading(true)
        GenreList.forEach((genreList) => {
            getAnimes(genreList)
        })

        setTimeout(() => {
            setLoading(false)
        }, 700);
    }, [])


const getAnimes = useCallback((name: string) => {
    setLoading(true)

    GET(`/anime/gogoanime/genre/${name?.toLocaleLowerCase()}`)
        .then((response: any) => {
            temp = [...temp, { data: response.results, title: name }]
            setAnimebyGenreList(temp)
            // setLoading(false)

        }).catch(error => {
            setLoading(false)
            console.log("Anime List Error", error);
        })

},[])
    // const getAnimes = (name: string) => {
    //     setLoading(true)

    //     GET(`/anime/gogoanime/genre/${name?.toLocaleLowerCase()}`)
    //         .then((response: any) => {
    //             temp = [...temp, { data: response.results, title: name }]
    //             setAnimebyGenreList(temp)
    //             // setLoading(false)

    //         }).catch(error => {
    //             setLoading(false)
    //             console.log("Anime List Error", error);
    //         })

    // }
    function compare(a: any, b: any) {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    }

    if (loading) {

        return (<View style={styles.container}>
            <ActivityIndicator color={'limegreen'} size={'large'}/>
            <Text style={styles.title}>Loading...</Text>
        </View>)
    }
    return (
        <View style={styles.container}>
            <HeaderComponent onBackPress={() => navigation.goBack()} title='All Genre' />
            <FlatList
                data={animebyGenreList.sort(compare)}
                renderItem={({ item }) => {
                    return (<View style={styles.topView}>
                        <TouchableOpacity onPress={() => { navigation.navigate('GenreList', { name: item.title }) }}>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginRight: 16 }}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Ionicons name='ios-arrow-forward-outline' size={20} color={'limegreen'} />
                            </View>
                        </TouchableOpacity>
                        <FlatList
                            data={item.data}
                            contentContainerStyle={styles.horizontalScroll}
                            renderItem={({ item }) => {
                                return (<ListItem {...item} styles={{ height: 150, width: 120, aspectRatio: 3 / 4, marginRight: 8 }} />)
                            }}
                            horizontal
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>)
                }}
                keyExtractor={item => item.title}
                showsVerticalScrollIndicator={false}
            />
        </View >
    )
}


export default AllGenre

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 10,
        color: 'white'
    },
    horizontalScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16, marginTop: 10
    },
    topView: {
        marginVertical: 8
    }
})