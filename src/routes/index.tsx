import { createBrowserRouter, RouteObject } from 'react-router-dom';
import LayoutApp from 'src/components/LayoutApp';
import FindNote from 'src/pages/FindNote';
import GuitarTest from 'src/pages/GuitarTest';
import Home from 'src/pages/Home';
import IntervalExercise from 'src/pages/Intervals';
import NoteDistance from 'src/pages/NoteDistance';
import Scales from 'src/pages/Scales';

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/find-note',
        element: <FindNote />,
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
        path: '/intervals',
        element: <IntervalExercise />,
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
