import * as React from 'react';
import { supabase } from '../SupabaseClient';
import { useNavigate } from 'react-router-dom';
//import { Auth } from '@supabase/auth-ui-react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';


// MUI variables
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// URL for redirect after sign-in
const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";




export default function CredentialsSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/items');
  }

  const handleSignIn = async (provider, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
          throw new Error(error.message);
      }
      alert(`Welcome back, ${email}!`);
      handleRedirect();
      return data;
    } catch (error) {
      alert(`Sign in failed: ${error.message}`);
      return null;
    }
  };


  return (
    <div>
        <AppProvider theme={theme}>
        <SignInPage signIn={handleSignIn} providers={providers} />
        </AppProvider>
    </div>
  );
}