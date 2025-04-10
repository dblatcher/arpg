import { useEffect, useRef } from "react";
import { MusicControl, playMusic, SoundDeck } from "sound-deck";
import { SongKey, songs } from "../lib/songs";


export const useBgm = (bgmInput: SongKey | undefined, gamePaused: boolean, soundDeck: SoundDeck) => {
    const musicRef = useRef<MusicControl | null>(null)
    const songKeyRef = useRef<SongKey | undefined>(undefined)

    useEffect(() => {
        const songKey: SongKey | undefined = bgmInput && bgmInput in songs ? bgmInput as SongKey : undefined
        if (songKey !== songKeyRef.current) {
            musicRef.current?.fadeOut(3)
            const fadePromise = musicRef.current ? musicRef.current.whenEnded : Promise.resolve(true)
            songKeyRef.current = songKey
            fadePromise.then(() => {
                if (songKey) {
                    const song = songs[songKey]
                    const newMusicControl = playMusic(soundDeck)(song.staves, song.tempo, true)
                    musicRef.current = newMusicControl
                }
            })
        }
        return () => {
            musicRef.current?.fadeOut(3)
        }
    }, [bgmInput, soundDeck])

    useEffect(() => {
        if (gamePaused) {
            musicRef.current?.pause()
        } else {
            musicRef.current?.resume()
        }
    }, [gamePaused])
}
