import { Card, Container, Grid, Heading, Text } from '@radix-ui/themes';
import classNames from 'classnames';
import Link from 'src/components/Link';

import styles from './styles.module.scss';

type Exercise = {
    title: string;
    description: string;
    path?: string;
};

const ExerciseCard = ({ exercise, disabled = false }: { exercise: Exercise, disabled?: boolean }) => {
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
                {exercise.title}
            </Heading>
            <Text>
                {exercise.description}
            </Text>
        </Card>
    );
};

const exercises = [
    {
        title: 'Nome das notas',
        description: 'Vamos praticar o nome das notas musicais',
        path: '/note-translation',
    },
    {
        title: 'Distância entre notas',
        description: 'Diga a distância entre duas notas em tons e semitons',
        path: '/note-distance',
    },
    {
        title: 'Intervalos',
        description: 'Vamos praticar a identificação de intervalos musicais',
    },
    {
        title: 'Leitura de partituras',
        description: 'Pratique a leitura de partituras identificando notas',
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
                gap={'2'}
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
