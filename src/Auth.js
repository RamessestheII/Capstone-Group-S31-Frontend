import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

export const useAuth = () => {
  const auth = useAuthUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  const login = async (userId, token) => {
    await signIn({
        auth: {
          token: token
        },
        userState: {userId: userId}
      })
  };

  const logout = () => {
    signOut();
  };

  return { auth, login, logout };
};