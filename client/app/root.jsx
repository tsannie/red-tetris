import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from 'react-router';

import stylesheet from './app.css?url';
import store from './redux/store';
import { Provider, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connectionAttempt, emitExitRoom, emitJoinOrCreateRoom, selectIsConnected } from './redux/socketSlice';
import { selectRoomName, selectUsername, setRoomName, setUsername } from './redux/roomInfoSlice';

export const links = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <main className="bg-base text-ink min-h-screen">
            {children}
            <ScrollRestoration />
            <Scripts />
          </main>
        </Provider>
      </body>
    </html>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const username = useSelector((state) => selectUsername(state));
  const room_name = useSelector((state) => selectRoomName(state));
  const navigate = useNavigate();
  const socketConnected = useSelector((state) => selectIsConnected(state));
  const regex = /^\/([^\/]+)\/([^\/]+)$/;
  const [checkRedirect, setCheckRedirect] = useState(false);
  const [roomJoined, setRoomJoined] = useState(false);

  useEffect(() => {
    // join or create room
    if (
      roomJoined ||
      !socketConnected ||
      location.pathname === '/' ||
      location.pathname === '/rooms' ||
      !checkRedirect ||
      !username ||
      !room_name
    ) {
      return;
    }
    console.log('emitJoinOrCreateRoom', { room_name, username });
    dispatch(emitJoinOrCreateRoom({ room_name, username }));
    setRoomJoined(true);
  }, [socketConnected, username, location.pathname, checkRedirect, room_name]);

  useEffect(() => {
    // redirect
    if (!username && location.pathname === '/rooms') {
      navigate('/');
    } else if (username && location.pathname === '/') {
      navigate('/rooms');
    } else if (location.pathname !== '/' && location.pathname !== '/rooms') {
      const match = location.pathname.match(regex);
      dispatch(setUsername(match[2]));
      dispatch(setRoomName(match[1]));
    } else if ((location.pathname === '/' || location.pathname === '/rooms') && roomJoined) {
      dispatch(emitExitRoom());
      setRoomJoined(false);
    }
    setCheckRedirect(true);
  }, [socketConnected, location.pathname]);

  // detect leave room
  useEffect(() => {
    // join or create room
    if (
      socketConnected &&
      roomJoined &&
      username &&
      room_name &&
      (location.pathname === '/' || location.pathname === '/rooms')
    ) {
      //dispatch(emitExitRoom());
    }
  }, [location.pathname]);

  useEffect(() => {
    // connect to socket
    dispatch(connectionAttempt());
  }, []);

  if (!socketConnected || !checkRedirect) {
    return <div className="flex items-center justify-center min-h-screen text-muted">Connecting...</div>;
  } else {
    return <Outlet />;
  }
}

export function ErrorBoundary({ error }) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
