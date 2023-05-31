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

const TopAiring = () => {
    const [topAiringList, setTopAiringList] = useState<RecentAnimeList[]>([])
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>()
    const [page, setPage] = useState<number>(0)
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)

    useEffect(() => {
        getTopAireingAnimes(page)
    }, [page])

    const getTopAireingAnimes = (page: number) => {
        GET('/anime/gogoanime/top-airing', {}, { page: page, type: 1 })
            .then((response: any) => {
                console.log("Top anime List", response)
                setHasNextPage(response.hasNextPage)
                if (page === 0) {
                    setTopAiringList(response?.results)
                } else {
                    const tempArr = [...topAiringList, ...response.results];
                    setTopAiringList(tempArr)
                }
            }).catch(error => {
                console.log("Top anime Error", error);

            })
    }
    return (
        <View style={{ backgroundColor: COLORS.BACKGROUND, flex: 1 }}>
            <HeaderComponent onBackPress={() => navigation.goBack()} title={'Top Airing'}/>

            {/* <Text style={styles.mainTitle}>Top Airing</Text> */}

            <FlatGrid
                itemDimension={170}
                data={topAiringList}
                onEndReached={() => {
                    hasNextPage && setPage(page + 1)
                }}
                onEndReachedThreshold={2}
                renderItem={({ item }) => (<ListItem {...item}/>)}

            />
        </View>
    )
}

export default TopAiring

const styles = StyleSheet.create({
    mainTitle: {
        color: 'white',
        textAlign: 'center',
        marginVertical: 5,
        marginHorizontal: 16,
        fontSize: 18,
        fontWeight: 'bold'
    },
})