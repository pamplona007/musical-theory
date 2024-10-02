import { Button, Flex, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Piano, { PianoRef } from 'src/components/Piano';
import useLeveling from 'src/hooks/useLeveling';
import { Note, noteName } from 'src/utils';

const startingLives = 3;

const FindNote = () => {
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [hitNotes, setHitNotes] = useState<Note[]>([]);
    const [lives, setLives] = useState<number>(startingLives);
    const {
        level,
        update,
        consecutiveSuccess,
        personalBest,
    } = useLeveling({
        localStorageKey: 'find-note-level',
    });

    const { t } = useTranslation();

    const pianoRef = useRef<PianoRef>(null);

    const startingOctave = 2 <= level ? 3: 4;
    const endingOctave = 2 <= level ? 5 : 4;

    const next = useCallback(() => {
        setHitNotes([]);
        setLives(startingLives);
        setCurrentNote((currentNote) => {
            let randomIndex;

            if (!pianoRef.current?.availableNotes.length) {
                return null;
            }

            while (randomIndex === undefined || pianoRef.current?.availableNotes[randomIndex].id === currentNote?.id) {
                randomIndex = Math.floor(Math.random() * pianoRef.current?.availableNotes.length);
            }

            return pianoRef.current?.availableNotes[randomIndex];
        });
    }, []);

    const onNotePress = (note: Note) => {
        if (!currentNote || success) {
            return;
        }

        setHitNotes((hitNotes) => [...hitNotes, note]);

        if (note.id !== currentNote.id) {
            setLives(lives - 1);
            return;
        }

        console.log('hitNotes', hitNotes);

        update(0 === hitNotes.length);
        setSuccess(true);

        setTimeout(() => {
            setSuccess(false);
            next();
        }, 1000);
    };

    useEffect(() => {
        if (!currentNote || !pianoRef.current) {
            return;
        }

        pianoRef.current.playNote(currentNote);
    }, [currentNote]);

    return (
        <>
            <Flex
                justify={'center'}
                align={'center'}
                height={'30vh'}
                direction={'column'}
            >
                {!currentNote && (
                    <Button
                        mb={'2'}
                        size={'4'}
                        onClick={next}
                    >
                        {t('start')}
                    </Button>
                )}
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
                                })}
                            </Text>
                        </button>
                        <Text
                            size={'4'}
                            weight={'bold'}
                            mt={'2'}
                            color={success ? 'green' : 'gray'}
                        >
                            {t('hits', { count: consecutiveSuccess })}
                        </Text>
                    </>
                )}
                <Text
                    size={'2'}
                    color={success ? 'green' : 'gray'}
                >
                    {t('personal_best', { count: personalBest })}
                </Text>
            </Flex>

            <Piano
                onNotePress={onNotePress}
                startingOctave={startingOctave}
                endingOctave={endingOctave}
                displayNames={0 === level || 2 === level}
                activeNotes={currentNote && 0 >= lives ? [currentNote.id] : []}
                ref={pianoRef}
                errorNotes={success ? [] : hitNotes.map((note) => note.id)}
                successNotes={success && currentNote ? [currentNote.id] : []}
                european
            />
        </>
    );
};

export default FindNote;
