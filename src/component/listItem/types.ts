import {ViewStyle} from 'react-native'
import { RecentAnimeList } from '../../screens/home/types'

export type Props = {
    id:string
    title: string,
    image: string,
    styles?:ViewStyle,
    provider?:string,
    onPress:(id: string) => void
} 