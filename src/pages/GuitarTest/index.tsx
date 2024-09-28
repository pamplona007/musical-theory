import { Guitar } from 'src/Instruments/StringInstrument';

const GuitarTest = () => {
    const guitar = new Guitar();

    console.log(guitar);

    return (
        <div>{'GuitarTest'}</div>
    );
};

export default GuitarTest;
