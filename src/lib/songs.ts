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

const testStaveNotes1 = parseStaveNotes('CCC-B.G.');

export type SongKey = 'music-1' | 'music-2'

export const songs: Record<SongKey, { staves: Stave[], tempo?: number }> = {
    'music-1': {
        staves: [
            { notes: testStaveNotes1, instrument: BOING, volume: .05 }
        ],
        tempo: 1.2
    },
    'music-2': {
        staves: [
            { instrument: BOING, notes: drunkenSailorBase, volume: .025 },
            { instrument: BOING, notes: drunkenSailorBaseHigher, volume: .025 },
            { instrument: SNARE, notes: beat, volume: .03 }
        ],
        tempo: 1.5
    }
}

