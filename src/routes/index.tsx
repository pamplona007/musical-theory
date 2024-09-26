import { createBrowserRouter, RouteObject } from 'react-router-dom';
import LayoutApp from 'src/components/LayoutApp';
import Home from 'src/pages/Home';
import NoteTranslation from 'src/pages/NoteTranslation';

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/note-translation',
        element: <NoteTranslation />,
    },
];

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <LayoutApp />,
        children: appRoutes,
    },
];

const router = createBrowserRouter(routes);

export default router;
