import { Instrument, parseStaveNotes, presetNoises, presetTones, StaveNote } from "sound-deck";

type Stave = {
    instrument: Instrument;
    notes: StaveNote[];
    volume?: number;
};

const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

const BELL: Instrument = {
    soundType: 'tone',
    ...presetTones.NEUTRAL_BELL
}

const DRONE: Instrument = {
    soundType: 'tone',
    type: 'sawtooth',
    playPattern: [
        { time: 0.01, vol: 1, },
        { time: 0.5, vol: 1, },
        { time: 0.9, vol: .5, },
    ]
}

const SNARE: Instrument = {
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

const irishBalladTreble = parseStaveNotes(`
-.......-.A3. |D4... D. D.E.F.  |E... D. D... A3.|D4.E.F. G.A.Bb.|
A......... A. |D5... D. D.C.Bb4.|A... A. A... F. |A... A. G.F.E. |
F... D. D...E.|F...F.G.A.Bb.    |A...A.D5....... |-.....D4.E.    | 
F.G.F.E.D.C.  |D......... D.    |E.........E.    |F.G.F.E.D.C.   |D.....`
)
const irishBalladBase = parseStaveNotes(`
D3.FG-.D.FG-. |D3...D.D...D.|D3...D.D...D. |D3...D.D...D.|
D3...D.D...D. | E...G.D...G.| F...A.D...A. | D...A.C...G.|
D...F.A2...C3.| D...A.G...B.| D...F.G.Bb.G.|Bb.G.-.......|
D...D. C... C.| D...D.D...D.| C...C.C... C.|D...D.C...C. |
D.FG-.C.EG-.`)
export type SongKey = 'cave-song' | 'main-theme' | 'irish-ballad'

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
    },
    'irish-ballad': {
        staves: [
            { instrument: DRONE, notes: irishBalladTreble, volume: .05 },
            { instrument: DRONE, notes: irishBalladBase, volume: .04 },
        ],
        tempo: 4
    }
}

export const deathJingle: Stave[] = [
    {
        instrument: BELL,
        notes: parseStaveNotes('C3 Eb C. G2. Eb3 | C3 Eb C3 Eb C...')
    }
]
