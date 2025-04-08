import { useEffect, useRef } from "react";
import { Instrument, MusicControl, parseStaveNotes, playMusic, SoundDeck, StaveNote } from "sound-deck";

type Stave = {
    instrument: Instrument;
    notes: StaveNote[];
    volume?: number;
};

const testStaveNotes1 = parseStaveNotes('CCC-B.G.');
const testStaveNotes2 = parseStaveNotes('A.-.B.G.');

type SongKey = 'music-1' | 'music-2'

const songs: Record<SongKey, Stave[]> = {
    'music-1': [{
        notes: testStaveNotes1,
        instrument: {
            soundType: 'tone',
            type: 'sawtooth',
            volume: .05
        }
    }],
    'music-2': [{
        notes: testStaveNotes2,
        instrument: {
            soundType: 'tone',
            type: 'sine',
            volume: .1
        }
    }]
}


export const useBgm = (bgmInput: string | undefined, gamePaused: boolean, soundDeck: SoundDeck) => {


    const musicRef = useRef<MusicControl | null>(null)
    const songKeyRef = useRef<SongKey | undefined>(undefined)


    useEffect(() => {
        const songKey: SongKey | undefined = bgmInput && bgmInput in songs ? bgmInput as SongKey : undefined

        if (songKey !== songKeyRef.current) {
            console.log('changing', { from: songKeyRef.current, to: songKey })

            musicRef.current?.fadeOut(3)
            const fadePromise = musicRef.current ? musicRef.current.whenEnded : Promise.resolve(true)
            songKeyRef.current = songKey

            fadePromise.then(() => {
                if (songKey) {
                    console.log('starting', songKey)
                    const newMusicControl = playMusic(soundDeck)(songs[songKey], 2, true)
                    musicRef.current = newMusicControl
                }
            })

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