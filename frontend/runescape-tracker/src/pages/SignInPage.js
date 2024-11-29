import { useState } from 'react';
import { supabase } from '../SupabaseClient';
import { useNavigate, Link } from 'react-router-dom';
//import { Auth } from '@supabase/auth-ui-react';
import SignInForm from '../components/UserManagement/SignInForm';



// MUI variables
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// URL for redirect after sign-in
const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";



export default function CredentialsSignInPage() {
  const navigate = useNavigate();
  const [subtitleMessage, setSubtitleMessage] = useState(null);

  // Event handler for sign in button
  const handleSignIn = async (provider, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
          throw new Error(error.message);
      }
      navigate('/items');
      return data;
    } catch (error) {
      setSubtitleMessage(error.message);
      return null;
    }
  };

  // MUI LINK COMPONENTS
  function SignUpLink() {
    return (
      <Link to='/signup' variant="body2">
        Sign up
      </Link>
    );
  }
  
  function ForgotPasswordLink() {
    return (
      <Link to='/' variant="body2">
        Forgot password?
      </Link>
    );
  }

  return (
    <div>
        <SignInForm 
          handleSignIn={handleSignIn}
          SignUpLink={SignUpLink}
          ForgotPasswordLink={ForgotPasswordLink}
          subtitleMessage={subtitleMessage}
        />
    </div>
  );
}