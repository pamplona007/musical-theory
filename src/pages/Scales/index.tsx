import { Box, Flex, Select, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Piano, { PianoRef } from 'src/components/Piano';
import { filterNotes, getScale, Note, noteName, scales } from 'src/utils';

const Scales = () => {
    const availableNotes = filterNotes(4, 4);

    const [scaleOfNote, setScaleOfNote] = useState<Note>(availableNotes[0]);
    const [selectedScale, setSelectedScale] = useState<string>(scales[0].name);
    const [hitNotes, setHitNotes] = useState<Note[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    const { t } = useTranslation();

    const pianoRef = useRef<PianoRef>(null);

    const scale = scaleOfNote && getScale(scaleOfNote, selectedScale);

    const next = useCallback(() => {
        if (!pianoRef.current) {
            return;
        }

        const note = availableNotes[Math.floor(Math.random() * availableNotes.length)];
        setScaleOfNote(note);
        setHitNotes([]);
        pianoRef.current.playNote(note);
    }, [availableNotes]);

    const correctHitNotes = hitNotes
        .filter((note) => scale?.includes(note))
        .sort((a, b) => a.midi - b.midi);
    const wrongHitNotes = hitNotes.filter((note) => !scale?.includes(note));

    useEffect(() => {
        if (correctHitNotes.length !== scale?.length || success) {
            return;
        }

        setSuccess(true);
        const timeBetweenNotes = 200;
        let i = 0;
        for (const note of scale) {
            setTimeout(() => {
                pianoRef.current?.playNote(note, '16n');
            }, 500 + (i * timeBetweenNotes));
            i++;
        }

        setTimeout(() => {
            next();
            setSuccess(false);
        }, 1000 + (scale.length * timeBetweenNotes));
    }, [correctHitNotes, next, scale, success]);

    return (
        <>
            <Flex
                justify={'center'}
                align={'center'}
                direction={'column'}
                mt={'3vh'}
            >
                <Select.Root
                    defaultValue={selectedScale}
                    onValueChange={(value) => setSelectedScale(value)}
                >
                    <Select.Trigger />
                    <Select.Content>
                        {scales.map((scale) => (
                            <Select.Item
                                key={scale.name}
                                value={scale.name}
                            >
                                {t(`scale.${scale.name}`)}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Flex>

            <Flex
                justify={'center'}
                align={'center'}
                mt={'2vh'}
                direction={'column'}
            >
                <button
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        pianoRef.current?.playNote(scaleOfNote);
                    }}
                >
                    <Text
                        size={'9'}
                        weight={'bold'}
                        color={'gray'}
                    >
                        {noteName(scaleOfNote, {
                            european: true,
                        })}
                    </Text>
                </button>
            </Flex>

            <Flex
                justify={'center'}
                align={'center'}
                gap={'2'}
                height={'50px'}
            >
                {correctHitNotes.map((note) => (
                    <Text
                        key={note.id}
                        size={'4'}
                        color={'green'}
                    >
                        {noteName(note, {
                            european: true,
                            simple: true,
                        })}
                    </Text>
                ))}
            </Flex>

            <Box
                mt={'9'}
            >
                <Piano
                    startingOctave={4}
                    endingOctave={5}
                    ref={pianoRef}
                    onNotePress={(note) => {
                        if (!hitNotes.includes(note)) {
                            setHitNotes([...hitNotes, note]);
                        }
                    }}
                    successNotes={correctHitNotes.map((note) => note.id)}
                    errorNotes={wrongHitNotes.map((note) => note.id)}
                />
            </Box>
        </>
    );
};

export default Scales;
