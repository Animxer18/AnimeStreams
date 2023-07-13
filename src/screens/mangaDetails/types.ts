import { MangaItemType } from "../mangaList/types"

export type CharacterType = {
    id: number,
    role: string,
    name: {
        first?: string
        last?: string
        full?: string
        native?: string
        userPreferred?: string
    },
    image: string,
}

export type ChaptersType = {
    id: string
    title: string
    chapterNumber: string
    volumeNumber: string
    pages: number
}

export type MangaDetailsType = {
    id: string,
    title: { romaji: string, english: string, native: string, userPreferred?: string },
    image?: string,
    popularity?: number,
    color?: string,
    cover?: string,
    description?: string,
    status?: string,
    releaseDate?: number,
    genres: string[],
    type?: string,
    recommendations: MangaItemType[],
    characters?: CharacterType[],
    relations: MangaItemType[],
    chapters: ChaptersType[]
}