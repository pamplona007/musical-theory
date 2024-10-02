import { Card, Container, Grid, Heading, Text } from '@radix-ui/themes';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Link from 'src/components/Link';

import styles from './styles.module.scss';

type Exercise = {
    title: string;
    description: string;
    path?: string;
};

const ExerciseCard = ({ exercise, disabled = false }: { exercise: Exercise, disabled?: boolean }) => {
    const { t } = useTranslation();

    const classes = classNames(
        styles['exercise-card'],
        {
            [styles['-disabled']]: disabled,
        },
    );

    return (
        <Card
            className={classes}
        >
            <Heading>
                {t(exercise.title)}
            </Heading>
            <Text>
                {t(exercise.description)}
            </Text>
        </Card>
    );
};

const exercises = [
    {
        title: 'card.note_names.title',
        description: 'card.note_names.description',
        path: '/find-note',
    },
    {
        title: 'card.note_distances.title',
        description: 'card.note_distances.description',
        path: '/note-distance',
    },
    {
        title: 'card.scales.title',
        description: 'card.scales.description',
        path: '/scales',
    },
    {
        title: 'card.note_intervals.title',
        description: 'card.note_intervals.description',
    },
    {
        title: 'card.note_read.title',
        description: 'card.note_read.description',
    },
];

const Home = () => {
    return (
        <Container>
            <Grid
                width={'100%'}
                columns={{
                    initial: '1fr',
                    md: 'repeat(2, 1fr)',
                }}
                gap={'5'}
                justify={'center'}
            >
                {exercises.map((exercise, index) => exercise.path
                    ? (
                        <Link
                            key={index}
                            href={exercise.path}
                        >
                            <ExerciseCard
                                exercise={exercise}
                            />
                        </Link>
                    )
                    : (
                        <ExerciseCard
                            key={index}
                            exercise={exercise}
                            disabled
                        />
                    ))
                }
            </Grid>
        </Container>
    );
};

export default Home;
