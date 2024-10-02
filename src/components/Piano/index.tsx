import { Box, Flex, IconButton, Kbd, ScrollArea, Slider } from '@radix-ui/themes';
import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
import classNames from 'classnames';
import { createContext, ForwardedRef, forwardRef, PropsWithChildren, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { filterNotes, Note, noteName } from 'src/utils';
import { PolySynth } from 'tone';
import { Time } from 'tone/build/esm/core/type/Units';

import styles from './styles.module.scss';

export type PianoProps = {
    onNotePress?: (note: Note) => void;
    startingOctave?: number;
    endingOctave?: number;
    european?: boolean;
    displayNames?: boolean;
    activeNotes?: string[] | false;
    successNotes?: string[];
    errorNotes?: string[];
}

export type PianoRef = {
    playNote: (note: Note, timing?: Time) => void;
    attackNote: (note: Note) => void;
    releaseNote: (note: Note, timing?: Time) => void;
    availableNotes: Note[];
}

type NoteComponentProps = {
    note: Note;
    handleNotePress?: (note: Note) => void;
    active?: boolean;
    keyboardKey?: string | false;
    success?: boolean;
    error?: boolean;
}

const keyboardKeys = ['a', 'w', 's', 'e', 'd', 'h', 'u', 'j', 'i', 'k', 'o', 'l'];
const PianoContext = createContext<PianoRef | null>(null);
const synth = new PolySynth().toDestination();

const NoteComponent = (props: PropsWithChildren<NoteComponentProps>) => {
    const {
        note,
        handleNotePress,
        children,
        active,
        keyboardKey,
        success,
        error,
    } = props;

    const isTouchDevice = 'ontouchstart' in window || 0 < navigator.maxTouchPoints;

    const {
        playNote,
        attackNote,
        releaseNote,
    } = useContext(PianoContext)!;

    const attackThisNote = useCallback(() => {
        attackNote(note);
        handleNotePress?.(note);
    }, [attackNote, handleNotePress, note]);

    const releaseThisNote = useCallback(() => {
        releaseNote(note);
    }, [releaseNote, note]);

    const playThisNote = useCallback(() => {
        playNote(note);
        handleNotePress?.(note);
    }, [playNote, note, handleNotePress]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === keyboardKey && !event.repeat) {
                attackThisNote();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === keyboardKey) {
                releaseThisNote();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [attackThisNote, keyboardKey, releaseThisNote]);

    return (
        <button
            className={classNames(
                styles.key,
                {
                    [styles.sharp]: note.isSharp,
                    [styles.active]: active,
                    [styles.success]: success,
                    [styles.error]: error,
                },
            )}
            onMouseLeave={() => releaseThisNote()}
            onMouseDown={() => !isTouchDevice && attackThisNote()}
            onMouseUp={() => !isTouchDevice && releaseThisNote()}
            onClick={() => isTouchDevice && playThisNote()}
        >
            {keyboardKey && (
                <Kbd
                    size={'2'}
                >
                    {keyboardKey}
                </Kbd>
            )}
            {children}
        </button>
    );
};

const Piano = (props: PianoProps, ref: ForwardedRef<PianoRef>) => {
    const {
        onNotePress,
        startingOctave = 3,
        endingOctave = 5,
        displayNames = true,
        activeNotes: externallyActiveNotes,
        successNotes,
        errorNotes,
    } = props;

    const [activeNotes, setActiveNotes] = useState<Note[]>([]);
    const [volume, setVolume] = useState(Number(localStorage.getItem('pianoVolume') || 0));

    const filteredNotes = useMemo(() => filterNotes(startingOctave, endingOctave), [startingOctave, endingOctave]);
    const isMuted = -50 === volume;

    const refValue: PianoRef = useMemo(() => ({
        playNote: (note, timing = '8n') => {
            synth.triggerAttackRelease(note.id, timing);
        },
        attackNote: (note) => {
            if (activeNotes.find(({ id }) => id === note.id)) {
                return;
            }

            setActiveNotes([...activeNotes, note]);
            synth.triggerAttack(note.id);
        },
        releaseNote: (note, timing) => {
            setActiveNotes(activeNotes.filter(({ id }) => id !== note.id));
            synth.triggerRelease(note.id, timing);
        },
        availableNotes: filteredNotes,
    }), [activeNotes, filteredNotes]);

    useImperativeHandle(ref, () => refValue);

    const simple = startingOctave === endingOctave;

    useEffect(() => {
        synth.volume.value = volume;
        localStorage.setItem('pianoVolume', volume.toString());

        if (!isMuted) {
            localStorage.setItem('unmutedPianoVolume', volume.toString());
        }
    }, [isMuted, volume]);

    useEffect(() => {
        for (const note of activeNotes) {
            if (!filteredNotes.find((filteredNote) => filteredNote.id === note.id)) {
                refValue.releaseNote(note, '+16n');
            }
        }
    }, [activeNotes, filteredNotes, refValue]);

    return (
        <PianoContext.Provider value={refValue}>
            <ScrollArea className={styles['piano-wrapper']}>
                <Flex
                    justify={'center'}
                    className={styles.piano}
                >
                    {filteredNotes.map((note, index) => (
                        <NoteComponent
                            key={note.id}
                            note={note}
                            handleNotePress={onNotePress}
                            keyboardKey={simple && keyboardKeys[index]}
                            active={activeNotes.includes(note) || (externallyActiveNotes && externallyActiveNotes.includes(note.id))}
                            success={successNotes?.includes(note.id)}
                            error={errorNotes?.includes(note.id)}
                        >
                            {displayNames && noteName(note, { simple })}
                        </NoteComponent>
                    ))}
                </Flex>
            </ScrollArea>
            <Flex
                justify={'center'}
                align={'center'}
                gap={'5'}
                mt={'3'}
            >
                <IconButton
                    variant={'ghost'}
                    onClick={() => setVolume(isMuted ? Number(localStorage.getItem('unmutedPianoVolume')) : -50)}
                >
                    {-50 === volume
                        ? (
                            <IconVolumeOff />
                        )
                        : (
                            <IconVolume />
                        )}
                </IconButton>
                <Box
                    maxWidth={'200px'}
                    width={'100%'}
                >
                    <Slider
                        defaultValue={[50]}
                        max={0}
                        min={-50}
                        onValueChange={(value) => setVolume(value[0])}
                        value={[volume]}
                        size={'1'}
                    />
                </Box>
            </Flex>
        </PianoContext.Provider>
    );
};

export default forwardRef<PianoRef, PianoProps>(Piano);
