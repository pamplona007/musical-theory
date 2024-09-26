import { Flex, Text, TextField } from '@radix-ui/themes';
import { RootProps } from '@radix-ui/themes/src/components/text-field.js';

type InputProps = RootProps & {
    label: string;
};

const Input = (props: InputProps) => {
    const {
        label,
        size,
    } = props;

    return (
        <label>
            <Flex
                direction={'column'}
                gap={'4px'}
            >
                <Text
                    size={size}
                    weight={'medium'}
                >
                    {label}
                </Text>
                <TextField.Root
                    size={size}
                    {...props}
                />
            </Flex>
        </label>
    );
};

export default Input;
