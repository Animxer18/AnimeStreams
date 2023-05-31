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

export type RootTabParams = {
    Animes: undefined;
    Manga: undefined;
    News: undefined;
    Profile: undefined;
};

export type HomeStackParams = {
    AnimesScreen: undefined;
    AnimeDetails: { id: string };
    AnimeWatch: AnimeWatchParam;
    SearchScreen: { search: string }
    TopAiring:undefined;
    RecentAnimes: undefined;
    GenreList:{name?: string} | undefined
    AllGenre: undefined
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
        </AniStack.Navigator>
    );
};

//   export type ExploreStackParams = {
//     Explore: undefined;
//     RestaurantScreen: {name: string};
//   };
//   const ExploreStack = createNativeStackNavigator<ExploreStackParams>();
//   const ExploreStacks = () => {
//     return (
//       <ExploreStack.Navigator initialRouteName="Explore" screenOptions={{headerShown : false}}>
//         <ExploreStack.Screen name="Explore" component={Explore} />
//         <ExploreStack.Screen
//           name="RestaurantScreen"
//           component={RestaurantScreen}
//           options={{
//             animation: 'none'
//           }}
//         />
//       </ExploreStack.Navigator>
//     );
//   };

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
        component: Manga,
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
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarAllowFontScaling: true,  }} tabBar={(props) => <TabBar {...props} />}>
            {tabs.map((_, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={_.name}
                        component={_.component}
                        options={{
                            tabBarLabel: _.name,
                            title: _.label

                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
};

export default RootStack;
