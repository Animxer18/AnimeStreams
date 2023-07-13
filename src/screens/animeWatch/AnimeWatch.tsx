import { StyleSheet, Text, View, Modal, ActivityIndicator, TouchableHighlight } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { HomeStackParams } from '../../navigation/AppNavigator'
import { GET } from '../../config/http-calls'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import VideoPlayer from 'react-native-video-controls';
import { StatusBar } from 'react-native'
import Orientation, { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
import { QualityType } from './types'
import { COLORS } from '../../config/common'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const AnimeWatch = () => {
    const route = useRoute<RouteProp<HomeStackParams, 'AnimeWatch'>>()
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams, 'AnimeWatch'>>()
    const videoPlayerRef = useRef()
    const [url, setUrl] = useState<string>()
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [qualityArray, setQualityArray] = useState<QualityType[]>([])
    const [quality, setQuality] = useState<number>(1080)
    const getAnimeURL = () => {
        setLoading(true)
        GET(`/anime/gogoanime/watch/${route.params?.id}`, {}, { server: "vidstreaming" }).then(response => {
            console.log("Response: ", response.sources[3].url);
            setUrl(response.sources[3].url);
            setQualityArray(
                [
                    { key: 360, value: response.sources[0].url },
                    { key: 480, value: response.sources[1].url },
                    { key: 720, value: response.sources[2].url },
                    { key: 1080, value: response.sources[3].url },
                ])
            setError(false)
            setLoading(false)
        }).catch(error => {
            console.log("Error: ", error);
            setError(true)
            setLoading(false)
        })
    }
    useEffect(() => {
        getAnimeURL()
        StatusBar.setHidden(true);

        console.log('Route:', route.params)
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });

    }, [])
    useEffect(() => {
        Orientation.lockToLandscape()
        return () => { Orientation.unlockAllOrientations() }
    })

    const calcVLCPlayerHeight = (windowWidth: number, aspetRatio: number) => {
        return windowWidth * aspetRatio;
    };
    const onBuffer = (e: any) => {
        console.log(e);
    }

    const videoError = (e: any) => {
        console.log(e);
    }


    const _getTime = (data = 0) => {
        let hourCourse = Math.floor(data / 3600);
        let diffCourse = data % 3600;
        let minCourse = Math.floor(diffCourse / 60);
        let secondCourse = Math.floor(diffCourse % 60);
        let courseReal = '';
        if (hourCourse) {
            if (hourCourse < 10) {
                courseReal += '0' + hourCourse + ':';
            } else {
                courseReal += hourCourse + ':';
            }
        }
        if (minCourse < 10) {
            courseReal += '0' + minCourse + ':';
        } else {
            courseReal += minCourse + ':';
        }
        if (secondCourse < 10) {
            courseReal += '0' + secondCourse;
        } else {
            courseReal += secondCourse;
        }
        return courseReal;
    };


    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <OrientationLocker
                orientation={LANDSCAPE}
                onChange={orientation => console.log('onChange', orientation)}
                onDeviceChange={orientation => console.log('onDeviceChange', orientation)}
            />

            {error && (
                <View style={styles.subContainer}>
                    <MaterialIcons name='info-outline' color={COLORS.GREY} />
                </View>
            )}
            {url && <View style={{ backgroundColor: 'red', height: "100%" }}>
                <VideoPlayer
                    source={{ uri: url }}
                    navigator={navigation}
                    ref={videoPlayerRef}               // Store reference
                    onBuffer={onBuffer}                // Callback when remote video is buffering
                    onError={videoError}               // Callback when video cannot be loaded
                    style={styles.backgroundVideo}
                    resizeMode='cover'
                    title={route.params?.animeDetails?.title}
                    seekColor={COLORS.LIME}
                    automaticallyWaitsToMinimizeStalling={true}
                    rate={1}
                    preventsDisplaySleepDuringVideoPlayback={true}
                    // fullscreenAutorotate={true}
                    fullscreenOrientation={'landscape'}
                    ignoreSilentSwitch={'ignore'}
                    disableFocus={false}
                    progressUpdateInterval={1000}
                    onQualityChange={(q: number) => { setQuality(q) }}
                    videoSources={qualityArray}
                    selectedVideoTrack={{
                        type: "resolution",
                        value: quality
                    }}
                />

            </View>}
            {loading && <View style={styles.subContainer}>
                <ActivityIndicator color={COLORS.LIME} size={22} />
                <Text>Loading...</Text>
            </View>}
        </View>
    )
}

export default AnimeWatch

const styles = StyleSheet.create({
    video: {
        height: 300,
        width: '100%'
    },
    backgroundVideo: {
        height: 300,
        width: '100%'
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row'
    }
})
