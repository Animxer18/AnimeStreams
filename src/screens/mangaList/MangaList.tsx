import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MangaStackParams } from '../../navigation/AppNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { GET } from '../../config/http-calls'
import { MangaItemType } from './types'
import { COLORS } from '../../config/common'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'
import { FlatGrid } from 'react-native-super-grid'
import ListItem from '../../component/listItem/ListItem'

const MangaList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MangaStackParams, 'MangaList'>>()
    const route = useRoute<RouteProp<MangaStackParams, 'MangaList'>>()
    const [mangaList, setMangaList] = useState<MangaItemType[]>([])
    const [page, setPage] = useState<number>(0)
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    useEffect(() => {
        console.log(route.params?.search)
        getMangaList(page)
    }, [page])

    const getMangaList = (page: number) => {
        GET(`/meta/anilist-manga/${route.params?.search}`, {}, { page: page }).then(res => {
            console.log("res", res);
            // setHasNextPage(res.hasNextPage)
            if (page === 0) {
                setMangaList(res.results)
            } else {
                const temp = [...mangaList, ...res.result]
                setMangaList(temp)
            }
        }).catch(e => {
            console.log("ERROR:=>", e);

        })
    }
    const navigateToScreen = (id: string) => {
        navigation.navigate('MangaDetails', { id: id })
    }
    return (
        <View style={styles.container}>
            <HeaderComponent onBackPress={() => navigation.goBack()} />
            <Text style={styles.searchResultText}>Search result for "{route.params?.search}"...</Text>
            <FlatGrid
                itemDimension={170}
                data={mangaList}
                style={{ marginBottom: -8 }}
                contentContainerStyle={{ marginBottom: -10 }}
                keyExtractor={item => item.id}
                // onEndReached={() => {
                //     hasNextPage && setPage(page + 1)
                // }}
                // onEndReachedThreshold={2}
                renderItem={({ item }) => (<ListItem {...item} title={item.title.romaji} onPress={navigateToScreen} />)}

            />
        </View>
    )
}

export default MangaList

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.BACKGROUND,
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    searchResultText: {
        fontSize: 20,
        color: COLORS.LIME,
        fontWeight: '700'
    }
})