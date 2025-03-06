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
import { use, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connectionAttempt, emitJoinOrCreateRoom, selectIsConnected } from './redux/socketSlice';
import { login, logout, selectId, selectUsername } from './redux/userSlice';

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
          <main className="flex items-center justify-center min-h-screen bg-red-950">
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
  const user_id = useSelector((state) => selectId(state));
  const username = useSelector((state) => selectUsername(state));
  const navigate = useNavigate();
  const socketConnected = useSelector((state) => selectIsConnected(state));
  const regex = /^\/([^\/]+)\/([^\/]+)$/;
  const [checkRedirect, setCheckRedirect] = useState(false);
  const [roomJoined, setRoomJoined] = useState(false);

  useEffect(() => {
    // join or create room
    if (roomJoined || !socketConnected || location.pathname === '/' || location.pathname === '/room') {
      return;
    }
    if (user_id && username) {
      const match = location.pathname.match(regex);
      const room_name = match[1];
      console.log('user_id:', user_id);
      dispatch(emitJoinOrCreateRoom({ room_name: room_name, player_id: user_id }));
      setRoomJoined(true);
    }
  }, [socketConnected, username, user_id, location.pathname]);

  useEffect(() => {
    if (!user_id && location.pathname === '/room') {
      navigate('/');
    } else if (user_id && location.pathname === '/') {
      navigate('/room');
    } else if (socketConnected && location.pathname !== '/' && location.pathname !== '/room') {
      console.log('location.pathname:', location.pathname);
      const match = location.pathname.match(regex);
      console.log('Match:', match);
      //const room_path = match[1];
      const username_path = match[2];

      if (!username || !user_id || username !== username_path) {
        if (username || user_id) {
          dispatch(logout());
        }
        dispatch(login(username_path));
      }
    }
    setCheckRedirect(true);
  }, [socketConnected, location.pathname]);

  // check if user as been login
  useEffect(() => {
    if (user_id && username) {
      navigate('/room');
    }
  }, []);

  useEffect(() => {
    dispatch(connectionAttempt());
  }, []);

  if (!socketConnected || !checkRedirect) {
    return <div>Connecting...</div>;
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
