import { createBrowserRouter, RouteObject } from 'react-router-dom';
import LayoutApp from 'src/components/LayoutApp';
import GuitarTest from 'src/pages/GuitarTest';
import Home from 'src/pages/Home';
import NoteDistance from 'src/pages/NoteDistance';
import NoteTranslation from 'src/pages/NoteTranslation';
import Scales from 'src/pages/Scales';

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/note-translation',
        element: <NoteTranslation />,
    },
    {
        path: '/note-distance',
        element: <NoteDistance />,
    },
    {
        path: '/note-distance',
        element: <NoteDistance />,
    },
    {
        path: '/scales',
        element: <Scales />,
    },
    {
        path: '/guitar-test',
        element: <GuitarTest />,
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
