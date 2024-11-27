import SignInForm from './SignInForm'

export default function SideBar({ className }) {
    return (
        <div className={className}>
            <h1>SIDEBAR</h1>
            <SignInForm />
        </div>
    );
}