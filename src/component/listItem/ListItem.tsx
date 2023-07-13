import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Props } from './types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParams } from '../../navigation/AppNavigator'

const ListItem: FC<Props> = (item) => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>()

    return (
        <TouchableOpacity
            style={{ ...styles.listItemView, ...item.styles }}
            onPress={() => { 
                item.onPress(item.id)
                // navigation.navigate('AnimeDetails', { id: item.id, provider: item.provider })
            }}
        >
            <View style={{ height: 230, overflow: 'hidden' }}>
                <Image source={{ uri: item.image }} style={styles.image} resizeMode='cover' />
            </View>

            <Text style={styles.title} numberOfLines={2}>{item.title ? item.title : item.id.split('-').join(' ')}</Text>
        </TouchableOpacity>
    )
}

export default ListItem

const styles = StyleSheet.create({
    image: {
        height: '100%',
        width: '100%',
    },
    listItemView: {
        height: 280,
        // marginBottom: 5,
        width: 170, 
        alignSelf: 'center',
    },
    title: {
        color: 'white',
        textAlign: 'center',
        marginVertical: 5,
        marginHorizontal: 16
    },
})