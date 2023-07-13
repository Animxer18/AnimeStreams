import { Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { GET } from '../../config/http-calls'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams, MangaStackParams } from '../../navigation/AppNavigator'
import { Image } from 'react-native'
import { MangaDetailsType } from './types'
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../config/common'
const MangaDetails = () => {
    const route = useRoute<RouteProp<MangaStackParams, 'MangaDetails'>>()
    const navigation = useNavigation<NativeStackNavigationProp<MangaStackParams, 'MangaDetails'>>()
    const [mangaDetails, setMangaDetails] = useState<MangaDetailsType>()
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getMangaDetails()
    }, [])
    const getMangaDetails = () => {
        setLoading(true)
        GET(`/meta/anilist-manga/info/${route.params.id}`, {}, { provider: 'mangahere' }).then(response => {
            console.log("MANGA details", response);
            setMangaDetails(response)
            setLoading(false)
        }).catch(e => {
            setLoading(false)
            console.log("Error:=>", e);
        })
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 15, backgroundColor: 'black' }}>
            <SkeletonContent
                containerStyle={{ flex: 1 }}
                isLoading={isLoading}
                animationType='shiver'
                layout={[
                    { key: 'key1', height: 180, width: 100, marginTop: 160, marginLeft: 16, },
                    { key: 'key2', width: 200, height: 30, marginLeft: 130, marginTop: -130 },
                    { key: 'key3', width: 180, height: 20, marginLeft: 130, marginTop: 10 },
                    { key: 'key4', width: 180, height: 20, marginLeft: 130, marginTop: 10 },
                    { key: 'key5', width: 180, height: 20, marginTop: 50, marginLeft: 16 },
                    { key: 'key6', width: '90%', height: 130, marginTop: 10, marginLeft: 16 },
                    { key: 'key7', width: 180, height: 20, marginTop: 10, marginLeft: 16 },
                    { key: 'key8', width: 50, height: 30, marginTop: 10, marginLeft: 16 },
                ]}
                boneColor="grey"
            // highlightColor='#F2F8FC'
            >

                <View style={{ height: 320, width: '100%' }}>
                    <Image source={{ uri: mangaDetails?.cover ? mangaDetails?.cover : mangaDetails?.image }} style={{ height: 200, width: '100%' }} />
                    <View style={{ flexDirection: 'row', width: '100%' }}>

                        <View style={styles.verticalImgWrapper}>
                            <Image source={{ uri: mangaDetails?.image }} style={{ height: 170, width: '100%' }} resizeMode='cover' />
                        </View>

                        <View style={styles.titleView}>
                            <Text style={styles.title}>
                                {mangaDetails?.title.english}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ backgroundColor: 'grey', padding: 2, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                        {mangaDetails?.releaseDate}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: 'green', marginLeft: 5, padding: 2, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                        {mangaDetails?.status}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: COLORS.YELLOW, marginLeft: 5, padding: 2, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12, textTransform: 'capitalize' }}>
                                        {mangaDetails?.type}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: 'grey', marginLeft: 5, paddingHorizontal: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12, textTransform: 'capitalize' }}>
                                        {mangaDetails?.chapters.length}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '80%', paddingRight: 2 }}>
                                <Text style={{ ...styles.subTitle, fontWeight: '700', color: 'green' }}>Genre: </Text><Text style={styles.subTitle}>{mangaDetails?.genres?.join(', ')} </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.contentWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Text style={{ fontSize: 16, color: 'green', fontWeight: '700' }}>Japanese: </Text>
                        <Text style={{ ...styles.subTitle, fontSize: 16, }}>{mangaDetails?.title.native}</Text>
                    </View>
                    <View style={{ marginVertical: 8 }}>
                        <Text style={styles.title}>Description</Text>
                        <Text style={styles.subTitle}>{mangaDetails?.description}</Text>
                    </View>
                    <Text style={styles.title}>Characters</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: "row" }}>
                        {mangaDetails?.characters?.map(item => {
                            return <View style={styles.characterView}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <Text style={styles.subTitle} numberOfLines={1}>{item.name.first}</Text>
                            </View>
                        })}
                    </ScrollView>
                    <Text style={styles.title}>Chapters</Text>
                    <View style={{ alignItems: 'center', width: '100%', }}>

                        <View style={styles.episodesWrapper}>
                            {mangaDetails?.chapters?.map(item => {
                                return (
                                    <Pressable key={item.id} style={styles.episodeWrapper} onPress={() => { }}>
                                        <Text style={styles.subTitle}>{item.title?.split('.')[2]?.split('-')[0]}</Text>
                                    </Pressable >)
                            })}
                        </View>
                    </View>
                </View>
                <View>

                </View>
            </SkeletonContent>

            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='ios-arrow-back' size={24} color={COLORS.LIME} />
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

export default MangaDetails

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    contentWrapper: {
        paddingHorizontal: 16,
        flex: 1
    },
    verticalImgWrapper: {
        height: 180,
        width: 100,
        marginTop: -60,
        marginLeft: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 5
    },
    titleView: {
        width: '88%',
        marginLeft: 10
    },
    title: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
    },
    subTitle: {
        color: 'white',
    },
    episodeWrapper: {
        backgroundColor: 'grey',
        height: 30,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginVertical: 5
    },
    episodesWrapper: {
        flex: 1,
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginLeft: -10
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        height: 30,
        width: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    characterView: {
        width: 75,
        // justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', 
        marginVertical: 5
    },
    image: {
        width: 65,
        height: 65,
        borderRadius: 50, marginBottom: 3
    }
})