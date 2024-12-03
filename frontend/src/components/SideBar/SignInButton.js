
export default function SignInButton({ handleClick }) {
  return (
    <>
        <p className="text-slate-900 dark:text-white">Login to see favourites!</p>
        <button variant="contained" onClick={handleClick} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >
        Sign In
        </button>
    </>
  );
}