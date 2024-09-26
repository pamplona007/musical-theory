import { Flex, ScrollArea } from '@radix-ui/themes';
import classNames from 'classnames';
import { ForwardedRef, forwardRef, PropsWithChildren, useImperativeHandle, useRef } from 'react';
import { filterNotes, Note, noteName } from 'src/utils';
import { Synth } from 'tone';

import styles from './styles.module.scss';

type PianoProps = {
    onNotePress?: (note: Note) => void;
    startingOctave?: number;
    endingOctave?: number;
    european?: boolean;
    displayNames?: boolean;
}

export type PianoRef = {
    playNote: (note: Note) => void;
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
        displayNames = true,
    } = props;

    const simple = startingOctave === endingOctave;

    const synth = new Synth().toDestination();

    const handleNotePress = (note: Note) => {
        synth.triggerAttackRelease(noteName(note), '8n');
        onNotePress?.(note);
    };

    const filteredNotes = filterNotes(startingOctave, endingOctave);

    useImperativeHandle(ref, () => ({
        playNote: (note: Note) => {
            synth.triggerAttackRelease(noteName(note), '8n');
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
                        {displayNames && noteName(note, { simple, european })}
                    </NoteComponent>
                ))}
            </Flex>
        </ScrollArea>
    );
};

export default forwardRef<PianoRef, PianoProps>(Piano);
