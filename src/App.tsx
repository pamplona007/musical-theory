import { Theme, ThemePanel } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import router from './routes';

const App = () => {
    return (
        <Theme
            appearance={localStorage.getItem('appearance') as 'light' | 'dark' | undefined || 'light'}
            accentColor={'purple'}
            radius={'full'}
            scaling={'110%'}
        >
            <RouterProvider router={router} />
            <ThemePanel defaultOpen={false} />
        </Theme>
    );
};

export default App;
