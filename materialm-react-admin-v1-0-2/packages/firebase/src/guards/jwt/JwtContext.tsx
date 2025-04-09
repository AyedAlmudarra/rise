import { createContext, useEffect, useReducer } from 'react';
import useSWRMutation from 'swr/mutation'

// utils
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { isValidToken, setSession } from './Jwt';
import useSWR from 'swr';

const authFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage

  // Prepare headers
  const headers = {
    'Content-Type': 'application/json', 
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }), 
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};

const getFetcher = (url:string) => authFetch(url).then((res) => {
  if(!res.ok){
    throw new Error("Failed to fetch data")
  }else{
    return res.json();
  }
})
const postfetcher = (url: string, { arg }: { arg: { email: string; password: string, firstName?: string, lastName?: string } }) =>
  authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  }).then((res) => {
    if (!res.ok) throw new Error('Something went wrong');
    return res.json();
  });



// ----------------------------------------------------------------------
export interface InitialStateType {
  isAuthenticated: boolean;
  isInitialized?: boolean;
  user?: any | null | undefined;
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: any = {
  INITIALIZE: (state: InitialStateType, action: any) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: InitialStateType, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: InitialStateType) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: InitialStateType, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: InitialStateType, action: any) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<any | null>({
  ...initialState,
  platform: 'JWT',
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

function AuthProvider({ children }: { children: React.ReactElement }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const { data } = useSWR('/api/account/my-account', getFetcher);
          const { user } = data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const signin = async (email: string, password: string) => {

    const { trigger } = useSWRMutation('/api/account/login', postfetcher);
    const data = await trigger({ email, password });
    const { accessToken, user } = data;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const { trigger } = useSWRMutation('/api/account/register', postfetcher);
    const data = await trigger({
      email,
      password,
      firstName,
      lastName,
    });

    const { accessToken, user } = data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        signin,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
