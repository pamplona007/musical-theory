import { Box, DropdownMenu, Flex, IconButton, Link, Text, useThemeContext } from '@radix-ui/themes';
import { IconBrandGithub, IconHome, IconMoon, IconSun, IconWorld } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { languages } from 'src/translations/i18n';

const LayoutApp = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const theme = useThemeContext();

    const handleValueChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <>
            <Flex
                justify={'between'}
                p={'20px'}
            >
                <IconButton
                    variant={'ghost'}
                    onClick={() => navigate('/')}
                >
                    <IconHome />
                </IconButton>
                <Flex
                    gap={'15px'}
                >
                    <a href={'https://github.com/pamplona007/musical-theory'} target={'_blank'}>
                        <IconButton
                            variant={'ghost'}
                        >
                            <IconBrandGithub />
                        </IconButton>
                    </a>
                    <IconButton
                        variant={'ghost'}
                        onClick={() => {
                            const newAppearance = 'light' === theme.appearance ? 'dark' : 'light';
                            theme.onAppearanceChange(newAppearance);
                            localStorage.setItem('appearance', newAppearance);
                        }}
                    >
                        {'light' === theme.appearance
                            ? <IconSun />
                            : <IconMoon />
                        }
                    </IconButton>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <IconButton
                                variant={'ghost'}
                            >
                                <IconWorld />
                            </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.RadioGroup
                                onValueChange={handleValueChange}
                                value={i18n.language}
                            >
                                {languages.map(({ id, name }) => (
                                    <DropdownMenu.RadioItem
                                        key={id}
                                        value={id}
                                    >
                                        {name}
                                    </DropdownMenu.RadioItem>
                                ))}
                            </DropdownMenu.RadioGroup>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </Flex>
            </Flex>
            <Box
                minHeight={'calc(100vh - 150px)'}
                p={'20px'}
            >
                <Outlet />
            </Box>
            <footer>
                <Flex
                    height={'50px'}
                    justify={'center'}
                    align={'center'}
                >
                    <Text
                        size={'1'}
                    >
                        {'Made with ❤️ by '}
                        <Link href={'https://github.com/pamplona007'} target={'_blank'}>{'Lucas Pamplona'}</Link>
                    </Text>
                </Flex>
            </footer>
        </>
    );
};

export default LayoutApp;
