import { Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { GET } from '../../config/http-calls'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { Image } from 'react-native'
import { AnimeDetailsTypes } from './types'
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Ionicons from 'react-native-vector-icons/Ionicons'

const AnimeDetails = () => {
    const route = useRoute<RouteProp<HomeStackParams, 'AnimeDetails'>>()
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams, 'AnimeDetails'>>()
    const [animeDetails, setAnimeDetails] = useState<AnimeDetailsTypes>()
    const [isLoading, setLoading] = useState<boolean>(false)

    const getAnimeDetails = () => {
        setLoading(true)
        GET(`/anime/gogoanime/info/${route.params?.id}`).then((response: AnimeDetailsTypes) => {
            console.log("response: ", response);
            setAnimeDetails(response)
            setLoading(false)
        }).catch(err => {
            console.log("ERROR", err);
            setLoading(false)

        })
    }

    useEffect(() => {
        console.log("route", route.params);
        getAnimeDetails()
    }, [])

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
                    <Image source={{ uri: animeDetails?.image }} style={{ height: 200, width: '100%' }} />
                    <View style={{ flexDirection: 'row', width: '100%' }}>

                        <View style={styles.verticalImgWrapper}>
                            <Image source={{ uri: animeDetails?.image }} style={{ height: 170, width: '100%' }} resizeMode='cover' />
                        </View>

                        <View style={styles.titleView}>
                            <Text style={styles.title}>
                                {animeDetails?.title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ backgroundColor: 'grey', padding: 2, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                        {animeDetails?.releaseDate}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: 'green', marginLeft: 5, padding: 2, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                        {animeDetails?.status}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: 'green', marginLeft: 5, padding: 2, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12, textTransform: 'capitalize' }}>
                                        {animeDetails?.subOrDub}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: 'grey', marginLeft: 5, paddingHorizontal: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12, textTransform: 'capitalize' }}>
                                        {animeDetails?.totalEpisodes}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '80%', paddingRight: 2 }}>
                                <Text style={{ ...styles.subTitle, fontWeight: '700', color: 'green' }}>Genre: </Text><Text style={styles.subTitle}>{animeDetails?.genres?.join(', ')} </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.contentWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: 8  }}>
                        <Text style={{ fontSize: 16, color: 'green', fontWeight: '700' }}>Japanese: </Text>
                        <Text style={{ ...styles.subTitle, fontSize: 16,  }}>{animeDetails?.otherName}</Text>
                    </View>
                    <View style={{marginVertical: 8}}>
                        <Text style={styles.title}>Description</Text>
                        <Text style={styles.subTitle}>{animeDetails?.description}</Text>
                    </View>
                    <Text style={styles.title}>Espisodes</Text>
                    <View style={{ alignItems: 'center', width: '100%', }}>

                        <View style={styles.episodesWrapper}>
                            {animeDetails?.episodes?.map(item => {
                                return (<Pressable key={item.id} style={styles.episodeWrapper} onPress={() => { navigation.navigate('AnimeWatch', { ...item, animeDetails: animeDetails }) }}>
                                    <Text style={styles.subTitle}>{item.number}</Text>
                                </Pressable >)
                            })}
                        </View>
                    </View>
                </View>
            </SkeletonContent>

            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='ios-arrow-back' size={24} color={'limegreen'} />
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

export default AnimeDetails

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
    }
})