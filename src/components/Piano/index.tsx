import { Flex, ScrollArea } from '@radix-ui/themes';
import classNames from 'classnames';
import { ForwardedRef, forwardRef, PropsWithChildren, useImperativeHandle, useRef } from 'react';
import { filterNotes, Note, noteName } from 'src/utils';

import styles from './styles.module.scss';

type PianoProps = {
    onNotePress?: (note: Note) => void;
    startingOctave?: number;
    endingOctave?: number;
    european?: boolean;
}

export type PianoRef = {
    playNote: (note: Note) => void;
}

const audioCtx = new window.AudioContext();

function playNote(frequency: number, duration: number) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = 0.1;

    oscillator.start();

    setTimeout(() => {
        oscillator.stop();
    }, duration);
}

type NoteComponentProps = {
    note: Note;
    handleNotePress: (note: Note) => void;
}

const NoteComponent = (props: PropsWithChildren<NoteComponentProps>) => {
    const { note, handleNotePress, children } = props;

    const preventFiring = useRef(false);

    return (
        <button
            key={noteName(note)}
            className={classNames(
                styles.key,
                {
                    [styles.sharp]: note.isSharp,
                },
            )}
            onMouseDown={() => {
                if (preventFiring.current) {
                    preventFiring.current = false;
                    return;
                }

                handleNotePress(note);
            }}
        >
            {children}
        </button>
    );
};

const Piano = (props: PianoProps, ref: ForwardedRef<PianoRef>) => {
    const {
        onNotePress,
        startingOctave = 3,
        endingOctave = 5,
        european = false,
    } = props;

    const simple = startingOctave === endingOctave;

    const handleNotePress = (note: Note) => {
        playNote(note.frequency, 500);
        onNotePress?.(note);
    };

    const filteredNotes = filterNotes(startingOctave, endingOctave);

    useImperativeHandle(ref, () => ({
        playNote: (note: Note) => {
            playNote(note.frequency, 500);
        },
    }));

    return (
        <ScrollArea className={styles['piano-wrapper']}>
            <Flex
                justify={'center'}
                className={styles.piano}
            >
                {filteredNotes.map((note) => (
                    <NoteComponent
                        key={noteName(note)}
                        note={note}
                        handleNotePress={handleNotePress}
                    >
                        {noteName(note, { simple, european })}
                    </NoteComponent>
                ))}
            </Flex>
        </ScrollArea>
    );
};

export default forwardRef<PianoRef, PianoProps>(Piano);
