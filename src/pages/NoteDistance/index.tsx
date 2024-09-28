import { Box, Button, Container, Flex, Text } from '@radix-ui/themes';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from 'src/components/Input';
import Piano, { PianoRef } from 'src/components/Piano';
import { filterNotes, noteName } from 'src/utils';

const NoteDistance = () => {
    const [firstNoteIndex, setFirstNoteIndex] = useState<number | null>(null);
    const [secondNoteIndex, setSecondNoteIndex] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [consecutiveSuccess, setConsecutiveSuccess] = useState<number>(0);
    const [distanceValue, setDistanceValue] = useState<number>(0);

    const { t } = useTranslation();

    const inputRef = useRef<HTMLInputElement>(null);

    const beginner = 5 > consecutiveSuccess;
    const advanced = 10 <= consecutiveSuccess;
    const superAdvanced = 15 <= consecutiveSuccess;

    const startingOctave = advanced ? 3: 4;
    const endingOctave = advanced ? 5 : 4;

    const filteredNotes = useMemo(() => filterNotes(startingOctave, endingOctave), [startingOctave, endingOctave]);

    const firstNote = (firstNoteIndex || 0 === firstNoteIndex) ? filteredNotes[firstNoteIndex] : undefined;
    const secondNote = (secondNoteIndex || 0 === secondNoteIndex) ? filteredNotes[secondNoteIndex] : undefined;

    const pianoRef = useRef<PianoRef>(null);

    const next = useCallback(() => {
        const firstNoteIndex = Math.floor(Math.random() * (filteredNotes.length * 0.75));
        const secondNoteIndex = Math.floor(Math.random() * (filteredNotes.length - (firstNoteIndex + 1))) + firstNoteIndex;

        setFirstNoteIndex(firstNoteIndex);
        setSecondNoteIndex(null);

        setTimeout(() => {
            setSecondNoteIndex(secondNoteIndex);
        }, 1000);
    }, [filteredNotes]);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!firstNoteIndex || !secondNoteIndex || !inputRef.current) {
            return;
        }

        const distanceValue = inputRef.current.value;
        inputRef.current.value = '';
        const distance = secondNoteIndex - firstNoteIndex;

        if (distance === Number(distanceValue)) {
            setSuccess(true);
            setConsecutiveSuccess(consecutiveSuccess + 1);
            return;
        }

        setSuccess(false);
        setConsecutiveSuccess(0);
    }, [secondNoteIndex, firstNoteIndex, consecutiveSuccess]);

    useEffect(() => {
        if (!firstNote || !pianoRef.current) {
            return;
        }

        pianoRef.current.playNote(firstNote);
    }, [firstNote]);

    useEffect(() => {
        if (!secondNote || !pianoRef.current) {
            return;
        }

        pianoRef.current.playNote(secondNote);
    }, [secondNote]);

    useEffect(() => {
        setTimeout(() => {
            setSuccess(false);
            next();
        }, 1000);
    }, [next, consecutiveSuccess]);

    return (
        <Container>
            <Flex
                justify={'center'}
                align={'center'}
                mt={'15vh'}
                mb={'8'}
                direction={'column'}
            >

                <Flex
                    align={'center'}
                    gap={'5'}
                >
                    {firstNote && (
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                pianoRef.current?.playNote(firstNote);
                            }}
                        >
                            <Text
                                size={'9'}
                                weight={'bold'}
                                color={success ? 'green' : 'gray'}
                            >
                                {noteName(firstNote, {
                                    simple: startingOctave === endingOctave,
                                    european: true,
                                })}
                            </Text>
                        </button>
                    )}

                    {secondNote && (
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                pianoRef.current?.playNote(secondNote);
                            }}
                        >
                            <Text
                                size={'9'}
                                weight={'bold'}
                                color={success ? 'green' : 'gray'}
                            >
                                {noteName(secondNote, {
                                    simple: startingOctave === endingOctave,
                                    european: true,
                                })}
                            </Text>
                        </button>
                    )}
                </Flex>

                <Text
                    size={'4'}
                    weight={'bold'}
                    color={success ? 'green' : 'gray'}
                >
                    {t('hits', { count: consecutiveSuccess })}
                </Text>
            </Flex>

            <form
                onSubmit={handleSubmit}
            >
                <Flex
                    justify={'center'}
                    align={'center'}
                    direction={'column'}
                    gap={'3'}
                    mb={'8'}
                >
                    <Flex
                        justify={'center'}
                        align={'center'}
                        gap={'3'}
                    >
                        <Input
                            type={'number'}
                            placeholder={t('distance_in_semitones')}
                            ref={inputRef}
                            onChange={(event) => {
                                setDistanceValue(Number(event.target.value));
                            }}
                            name={'semitons'}
                        />
                        <Button
                            type={'submit'}
                        >
                            {t('confirm')}
                        </Button>
                    </Flex>
                    <Text>
                        {t('tones_and_semitones', {
                            tones: Math.floor(distanceValue / 2),
                            semitones: distanceValue % 2,
                        })}
                    </Text>
                </Flex>
            </form>

            <Box
                style={{
                    opacity: 1 - (0.2 * (consecutiveSuccess - 10)),
                }}
            >
                <Piano
                    startingOctave={startingOctave}
                    endingOctave={endingOctave}
                    displayNames={!superAdvanced}
                    activeNotes={beginner && [firstNote?.id, secondNote?.id].filter(Boolean) as string[]}
                    ref={pianoRef}
                />
            </Box>
        </Container>
    );
};

export default NoteDistance;
