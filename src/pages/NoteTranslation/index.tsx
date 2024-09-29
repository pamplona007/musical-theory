import { Flex, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Piano, { PianoRef } from 'src/components/Piano';
import { filterNotes, Note, noteName } from 'src/utils';

const NoteTranslation = () => {
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [consecutiveSuccess, setConsecutiveSuccess] = useState<number>(0);

    const { t } = useTranslation();

    const pianoRef = useRef<PianoRef>(null);

    const beginner = 5 > consecutiveSuccess;
    const advanced = 10 <= consecutiveSuccess;
    const superAdvanced = 15 <= consecutiveSuccess;

    const startingOctave = advanced ? 3: 4;
    const endingOctave = advanced ? 5 : 4;

    const filteredNotes = useMemo(() => filterNotes(startingOctave, endingOctave), [startingOctave, endingOctave]);

    const randomNote = useCallback(() => {
        setCurrentNote((currentNote) => {
            let randomIndex;

            while (randomIndex === undefined || filteredNotes[randomIndex].id === currentNote?.id) {
                randomIndex = Math.floor(Math.random() * filteredNotes.length);
            }

            return filteredNotes[randomIndex];
        });
    }, [filteredNotes]);

    const onNotePress = (note: Note) => {
        if (!currentNote || success) {
            return;
        }

        if (note.id !== currentNote.id) {
            setSuccess(false);
            setConsecutiveSuccess(0);
            return;
        }

        setSuccess(true);
        setConsecutiveSuccess(consecutiveSuccess + 1);

        setTimeout(() => {
            setSuccess(false);
        }, 1000);
    };

    useEffect(() => {
        if (!currentNote || !pianoRef.current) {
            return;
        }

        pianoRef.current.playNote(currentNote);
    }, [currentNote]);

    useEffect(() => {
        if (success) {
            return;
        }

        randomNote();
    }, [randomNote, success]);

    return (
        <>
            <Flex
                justify={'center'}
                align={'center'}
                height={'30vh'}
                direction={'column'}
            >
                {currentNote && (
                    <>
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                pianoRef.current?.playNote(currentNote);
                            }}
                        >
                            <Text
                                size={'9'}
                                weight={'bold'}
                                color={success ? 'green' : 'gray'}
                            >
                                {noteName(currentNote, {
                                    simple: startingOctave === endingOctave,
                                    european: true,
                                })}
                            </Text>
                        </button>
                        <Text
                            size={'4'}
                            weight={'bold'}
                            color={success ? 'green' : 'gray'}
                        >
                            {t('hits', { count: consecutiveSuccess })}
                        </Text>
                    </>
                )}
            </Flex>

            <Piano
                onNotePress={onNotePress}
                startingOctave={startingOctave}
                endingOctave={endingOctave}
                displayNames={!superAdvanced}
                activeNotes={currentNote && beginner ? [currentNote.id] : []}
                ref={pianoRef}
            />
        </>
    );
};

export default NoteTranslation;
