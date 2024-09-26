import { Box } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';

const LayoutApp = () => {
    return (
        <Box
            p={'20px'}
        >
            <Outlet />
        </Box>
    );
};

export default LayoutApp;
