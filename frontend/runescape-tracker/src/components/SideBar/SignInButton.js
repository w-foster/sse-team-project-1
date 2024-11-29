import Button from '@mui/material/Button';

export default function SignInButton({ handleClick }) {
  return (
    <>
        <p>Login to see favourites!</p>
        <Button variant="contained" onClick={handleClick} >
        Sign In
        </Button>
    </>
  );
}