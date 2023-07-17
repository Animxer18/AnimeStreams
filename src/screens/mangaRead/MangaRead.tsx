import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MangaStackParams } from '../../navigation/AppNavigator'
import { ChapterPagestypes } from './types'
import { GET } from '../../config/http-calls'
import { COLORS } from '../../config/common'
import HeaderComponent from '../../component/headerComponent/HeaderComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const MangaRead = () => {
    const route = useRoute<RouteProp<MangaStackParams, 'MangaRead'>>()
    const navigation = useNavigation<NativeStackNavigationProp<MangaStackParams, 'MangaRead'>>()
    const [chapterPages, setChapterPages] = useState<ChapterPagestypes[]>()
    const [isLoading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        getChapterPages()
    }, [])
    const getChapterPages = () => {
        setLoading(true)
        GET(`/manga/mangakakalot/read?id=${route.params.id}`, {}, { provider: 'mangahere' }).then(response => {
            console.log("ChapterPages", response);
            setChapterPages(response)
            setLoading(false)
        }).catch(e => {
            setLoading(false)
            console.log("Error:=>", e);
        })
    }
    return (
        <View style={styles.container}>
            <HeaderComponent title={route.params.title} onBackPress={()=>navigation.goBack()}/>
            <Text>MangaRead</Text>
            <FlatList
                data={chapterPages}
                keyExtractor={item=>item.title}
                renderItem={({ item }) => {
                    return (<View style={{height: "100%", width: '100%'}}>
                        <Image source={{uri: item.img}} style={{height: 400, width: '100%'}}/>
                    </View>)
                }}
            />
        </View>
    )
}

export default MangaRead

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,

    }
})