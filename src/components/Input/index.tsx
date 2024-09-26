import { Flex, Text, TextField } from '@radix-ui/themes';
import { RootProps } from '@radix-ui/themes/src/components/text-field.js';
import { ForwardedRef, forwardRef } from 'react';

type InputProps = RootProps & {
    label?: string;
};

const Input = (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
        label,
        size,
        ...rest
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
                    ref={ref}
                    {...rest}
                />
            </Flex>
        </label>
    );
};

export default forwardRef(Input);
