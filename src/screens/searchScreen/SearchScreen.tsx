import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { GET } from '../../config/http-calls'
import { SerachAnimeType } from '../home/types'
import { FlatGrid } from 'react-native-super-grid'
import { TouchableOpacity } from 'react-native-gesture-handler'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'
import ListItem from '../../component/listItem/ListItem'

const SearchScreen = () => {
    const route = useRoute<RouteProp<HomeStackParams, 'SearchScreen'>>()
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams, 'SearchScreen'>>()
    const [searchedAnimesList, setSearchedAnimesList] = useState<SerachAnimeType[]>([])
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        onSearchAnimes(page)
    }, [page])

    const onSearchAnimes = (page?: number) => {
        GET(`/anime/gogoanime/${route.params.search}`, {}, { page: page }).then(response => {
            console.log("searching...", response);
            setHasNextPage(response.hasNextPage)
            if (page === 1) {
                setSearchedAnimesList(response.results);
            } else {
                const tempArr = [...searchedAnimesList, ...response.results];
                setSearchedAnimesList(tempArr)
            }
        }).catch(err => {
            console.log("ERROR:", err);
        })
    }
    return (
        <View style={{ backgroundColor: 'rgba(0,0,0,0.9)', flex: 1 }}>
            <HeaderComponent onBackPress={()=>navigation.goBack()}/>
            <Text style={styles.title}>Search results for "{route.params.search}"</Text>
            <FlatGrid
                itemDimension={170}
                onEndReached={() => {
                    hasNextPage && setPage(page + 1)
                }}
                onEndReachedThreshold={0}
                data={searchedAnimesList}
                renderItem={({ item }) => (<ListItem {...item}/>)}

            />
        </View>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    listItemView: {
        height: 280,
        marginBottom: 5
    },
    title: {
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 16,
        fontSize: 16
    },
    image: {
        height: '100%',
        width: '100%',
    },
})