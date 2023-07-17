import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { FC } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { HeaderType } from './types'
import { COLORS } from '../../config/common'
const HeaderComponent: FC<HeaderType> = ({ from, onSearchOpen, onBackPress, title }) => {
    return (
        <View style={styles.container}>
            {from === 'home' ? <View style={styles.headerComp}>
                <View style={styles.headerComp}>
                    <Text style={styles.mainTitle}>Kon'chiwa</Text>
                    <Image source={require('../../assets/img/hand.png')} style={styles.handImage} />
                    {/* <Ionicons name="ios-hand-left-sharp" size={22} color={'yellow'} style={[{transform:([{rotateZ: '-40deg'}, ])}]}/> */}

                </View>
                <TouchableOpacity style={styles.searchButton} onPress={() => onSearchOpen?.()}>
                    <Ionicons name="search" size={22} color={'white'} />
                </TouchableOpacity>
            </View>
                :
                (<View style={styles.backArrow}>
                    <TouchableOpacity onPress={onBackPress}>
                        <Ionicons name='ios-arrow-back' size={24} color={COLORS.LIME} />
                    </TouchableOpacity>
                    <Text style={styles.mainTitle} numberOfLines={1}>{title}</Text>
                </View>)}
        </View>
    )
}

export default HeaderComponent

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 1
    },
    headerComp: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60
    },
    searchButton: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',

    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginVertical: 8,
        marginHorizontal: 16,
        color: 'white'
    },
    backArrow: {
        paddingHorizontal: 16,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    handImage: {
        transform: ([{ rotateZ: '-10deg' },]),
        height: 30,
        width: 30,
        marginLeft: -10
    }
})