import { useState } from 'react';
import { supabase } from '../SupabaseClient';
import { useNavigate, Link } from 'react-router-dom';
//import { Auth } from '@supabase/auth-ui-react';
import { Alert } from '@mui/lab';
import NewUserForm from '../components/UserManagement/NewUserForm';



// MUI variables
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// URL for redirect after sign-in
const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";



export default function NewUserPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false); // reset states

    // Get form data
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    function handleSuccessfulSignUp() {
      return;
      //navigate('/signin');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      console.log(error);
      console.log(data);
      if (error) {
        throw new Error(error.message);
      }
      // IF SIGN UP SUCCEEDS
      setSuccess(true);
      alert("Account created successfully! Please verify your email via your inbox.");
      handleSuccessfulSignUp();
    } catch (err) {
      setError(err.message);
    }


  }

  return (
    <div>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Sign-up successful!</Alert>}
        <NewUserForm handleSignUp={handleSignUp} />
    </div>
  );
}