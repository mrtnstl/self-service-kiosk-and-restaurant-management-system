import { useSearchParams } from "react-router";

const AccountVerificationPage = () =>{
    let [searchParams] = useSearchParams();
    const token = searchParams.get("token")

    if(!token){
        return (
            <>
                <h1>Account verification is needed when a new manager type user is registered.</h1>
            </>
        )
    } else {
        return (
            <>
                <h1>Account Verification Page ({token})</h1>
            </>
        )
    }
};

export default AccountVerificationPage;