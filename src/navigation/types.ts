import { NavigatorScreenParams } from "@react-navigation/native";
import { AnimeDetailsTypes, EpisodeType } from "../screens/animeDetails/types";
import { FC } from 'react'
export type RootTabParams = {
  ExploreStack: undefined;
  Profile: undefined;
  RestaurantStack: NavigatorScreenParams<RestaurantStackParams>;
  RestaurantScreen: { name: string };
};

export type RestaurantStackParams = {
  Restaurant: undefined;
  RestaurantScreen: { name: string };
};

export interface AnimeWatchParam extends EpisodeType {
  animeDetails: AnimeDetailsTypes
}

export interface TabType {

  name: string,
  label: string,
  component: FC,
}