import { Instrument, parseStaveNotes, presetNoises, presetTones, StaveNote } from "sound-deck";

type Stave = {
    instrument: Instrument;
    notes: StaveNote[];
    volume?: number;
};

export const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

export const BELL: Instrument = {
    soundType: 'tone',
    ...presetTones.NEUTRAL_BELL
}

export const SNARE: Instrument = {
    soundType: 'noise',
    ...presetNoises.TAP,
}


const beat = parseStaveNotes("C6...-...F...C...".repeat(8))

const drunkenSailorBaseString = `
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2.D3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2...|`

const drunkenSailorBase = parseStaveNotes(drunkenSailorBaseString)
const drunkenSailorBaseHigher = parseStaveNotes(drunkenSailorBaseString.replace(/3/g, "4").replace(/2/g, "3"))

const caveMusicTreble = parseStaveNotes(' B4.C5#.F# G.F#.C#   | A4#.C5#.F#. G.F#.C#. | B4.C5#.F# G.F#.C# | G.F#.-F# D.B4.B4.');
const caveMusicBase = parseStaveNotes(' B2.. D3#.F#.D.|'.repeat(4));

export type SongKey = 'cave-song' | 'main-theme'

export const songs: Record<SongKey, { staves: Stave[], tempo?: number }> = {
    'cave-song': {
        staves: [
            { notes: caveMusicTreble, instrument: BELL, volume: .02 },
            { notes: caveMusicBase, instrument: BOING, volume: .06 },
        ],
        tempo: 2
    },
    'main-theme': {
        staves: [
            { instrument: BOING, notes: drunkenSailorBase, volume: .025 },
            { instrument: BOING, notes: drunkenSailorBaseHigher, volume: .025 },
            { instrument: SNARE, notes: beat, volume: .03 }
        ],
        tempo: 1.5
    }
}

export const deathJingle: Stave[] = [
    {
        instrument: BELL,
        notes: parseStaveNotes('C3 Eb C. G2. Eb3 | C3 Eb C3 Eb C...')
    }
]
