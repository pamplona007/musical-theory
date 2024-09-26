import { Link as RadixLink, LinkProps as RadixLinkProps } from '@radix-ui/themes';
import { Link as RouterLink } from 'react-router-dom';

type LinkProps = RadixLinkProps & {
    href: string;
};

const Link = (props: LinkProps) => {
    const {
        href,
        children,
    } = props;

    return (
        <RadixLink
            asChild
            {...props}
        >
            <RouterLink
                to={href}
            >
                {children}
            </RouterLink>
        </RadixLink>
    );
};

export default Link;
