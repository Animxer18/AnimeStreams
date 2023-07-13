import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Profile from '../screens/profile/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Home from '../screens/home/Home';
import AnimeDetails from '../screens/animeDetails/AnimeDetails';
import { AnimeWatchParam, TabType } from './types';
import AnimeWatch from '../screens/animeWatch/AnimeWatch';
import SearchScreen from '../screens/searchScreen/SearchScreen';
import TabBar from './TabBar';
import TopAiring from '../screens/topAiring/TopAiring';
import RecentAnimes from '../screens/recentAnimes/RecentAnimes';
import GenreList from '../screens/genreList/GenreList';
import News from '../screens/news/News';
import Manga from '../screens/manga/Manga';
import AllGenre from '../screens/allGenre/AllGenre';
import MangaList from '../screens/mangaList/MangaList';
import MangaDetails from '../screens/mangaDetails/MangaDetails';
import TrendingAnimes from '../screens/trendingAnimes/TrendingAnimes';

export type RootTabParams = {
    Animes: undefined;
    Manga: undefined;
    News: undefined;
    Profile: undefined;
};

export type HomeStackParams = {
    AnimesScreen: undefined;
    AnimeDetails: { id: string, provider?: string };
    AnimeWatch: AnimeWatchParam;
    SearchScreen: { search: string }
    TopAiring: undefined;
    RecentAnimes: undefined;
    GenreList: { name?: string } | undefined
    AllGenre: undefined;
    TrendingAnimes: undefined
};

const AniStack = createNativeStackNavigator<HomeStackParams>();

const AnimeStack = () => {
    return (
        <AniStack.Navigator initialRouteName="AnimesScreen" screenOptions={{ headerShown: false }}>
            <AniStack.Screen name="AnimesScreen" component={Home} />
            <AniStack.Screen name="AnimeDetails" component={AnimeDetails} />
            <AniStack.Screen name="AnimeWatch" component={AnimeWatch} />
            <AniStack.Screen name="SearchScreen" component={SearchScreen} />
            <AniStack.Screen name="TopAiring" component={TopAiring} />
            <AniStack.Screen name="RecentAnimes" component={RecentAnimes} />
            <AniStack.Screen name="GenreList" component={GenreList} />
            <AniStack.Screen name="AllGenre" component={AllGenre} />
            <AniStack.Screen name="TrendingAnimes" component={TrendingAnimes} />
        </AniStack.Navigator>
    );
};

export type MangaStackParams = {
    MangaScreen: undefined;
    MangaList: { search: string }
    MangaDetails:{ id: string, }
};
const MStack = createNativeStackNavigator<MangaStackParams>();
const MangaStack = () => {
    return (
        <MStack.Navigator initialRouteName="MangaScreen" screenOptions={{ headerShown: false }}>
            <MStack.Screen name="MangaScreen" component={Manga} />
            <MStack.Screen name="MangaList" component={MangaList} />
            <MStack.Screen name="MangaDetails" component={MangaDetails} />
        </MStack.Navigator>
    );
};

const Tab = createBottomTabNavigator<RootTabParams>();

const tabs: TabType[] = [
    {
        name: "Animes",
        label: 'movie-open-play',
        component: AnimeStack,
    },
    {
        name: 'Manga',
        label: 'book',
        component: MangaStack,
    },
    {
        name: "News",
        label: 'newspaper',
        component: News,
    },
    {
        name: "Profile",
        label: 'account',
        component: Profile,
    },
];
const RootStack = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarAllowFontScaling: true, }} tabBar={(props) => <TabBar {...props} />}>
            {tabs.map((tabs, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={tabs.name}
                        component={tabs.component}
                        options={{
                            tabBarLabel: tabs.name,
                            title: tabs.label

                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
};

export default RootStack;
