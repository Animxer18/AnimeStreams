export interface EpisodeType {
    id: string;
    number: number;
    url: string;
}

export interface AnimeDetailsTypes  {
    description?: string;
    episodes?: EpisodeType[],
    genres?: [],
    id: string;
    image?: string;
    otherName?: string;
    releaseDate?: string;
    status?: string;
    subOrDub?: string;
    title?: string
    totalEpisodes?: number;
    type?: string
    url?: string
}