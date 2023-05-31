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

const AnimeWatch = () => {
    const route = useRoute<RouteProp<HomeStackParams, 'AnimeWatch'>>()
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams, 'AnimeWatch'>>()
    const videoPlayerRef = useRef()
    const [url, setUrl] = useState<string>()
    const [qualityArray, setQualityArray] = useState<QualityType[]>([])
    const getAnimeURL = () => {
        GET(`/anime/gogoanime/watch/${route.params?.id}`, {}, { server: "vidstreaming" }).then(response => {
            console.log("Response: ", response.sources[3].url);
            setUrl(response.sources[0].url);
            setQualityArray(
                [
                    { key: 360, value: response.sources[0].url },
                    { key: 480, value: response.sources[1].url },
                    { key: 720, value: response.sources[2].url },
                    { key: 1080, value: response.sources[3].url },
                ])
        }).catch(error => {
            console.log("Error: ", error);

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


            {url ? <View style={{ backgroundColor: 'red', height: "100%" }}>
                <VideoPlayer
                    source={{ uri: url }}
                    navigator={navigation}
                    ref={videoPlayerRef}               // Store reference
                    onBuffer={onBuffer}                // Callback when remote video is buffering
                    onError={videoError}               // Callback when video cannot be loaded
                    style={styles.backgroundVideo}
                    resizeMode='cover'
                
                    title={route.params?.animeDetails?.title}
                    seekColor={'limegreen'}
                    automaticallyWaitsToMinimizeStalling={true}
                    rate={1}
                    preventsDisplaySleepDuringVideoPlayback={true}
                    // fullscreenAutorotate={true}
                    fullscreenOrientation={'landscape'}
                    ignoreSilentSwitch={'ignore'}
                    disableFocus={false}
                    progressUpdateInterval={1000}
                    videoSources={qualityArray}
                />

            </View> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <ActivityIndicator color={COLORS.WHITE} size={22} />
            </View>}
            {/* <Modal visible={qualitySelectorVisible} transparent={true} animationType='slide' style={{ justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar backgroundColor={"rgba(0,0,0,0.9)"} />
                <View style={{ backgroundColor: "rgba(0,0,0,0.9)", flex: 1, width: 200, height: 250, alignSelf: 'center', justifyContent: 'flex-end' }} >
                    {qualityArray?.map((item => {
                        return (<TouchableHighlight onPress={() => {
                            console.log("item", item);
                            setUrl(item.value);
                            setSelectedQuality(item)
                            setQualitySelectorVisible(false)
                        }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: COLORS.WHITE, marginVertical: 10 }}>{item.key}p</Text>
                            </View>
                        </TouchableHighlight>)
                    }))}
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: COLORS.WHITE }} onPress={() => { setQualitySelectorVisible(false) }}>Cancel</Text>
                </View>
            </Modal> */}
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
    }
})


{/* <VlCPlayerView
                url={"https://static.videezy.com/system/resources/previews/000/044/089/original/Line_Twirl_x264.mp4"}
                title={route.params?.animeDetails?.title}
                Volume={1}
                isFull={true}
                // initOptions={['--adaptive-logic=lowest']}


                // paused={paused}
                // showControls={true}
                onBuffering={(e: any) => {
                    console.log('buffering', e);
                }}
                showTitle={true}
                showLeftButton={true}
                showMiddleButton={true}
                showRightButton={true}
                showBack={true}
                onLeftPress={() => { navigation.goBack() }}
                onError={(e: any) => { console.log(e); navigation.goBack()}}
                onPlaying={(e: any) => { console.log(e);navigation.goBack() }}
                onEnded={(e: any) => { console.log(e);navigation.goBack()  }}
            >

                <VLCPlayer
                    style={[styles.video, { height: calcVLCPlayerHeight(Dimensions.get('window').width, 16 / 10), marginTop: 30 }]}
                    videoAspectRatio="16:9"
                    // autoAspectRatio={true}

                    source={{
                        initType: 2,
                        hwDecoderEnabled: 1,
                        hwDecoderForced: 1,
                        uri: url,

                    }}

                    Volume={1}
                    onError={(e: any) => { console.log(e); }}
                    onPlaying={(e: any) => { console.log(e); }}
                // resizeMode="cover"
                />
                
            </VlCPlayerView> */}