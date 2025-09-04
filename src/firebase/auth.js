import { auth } from "./firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { setUser } from "../redux/user";


export const handleLogin = async ({email, password, dispatch}) => {
    try {
        //sessionStorage.setItem('username', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const data = {
            email: userCredential.user.email,
            status: userCredential.operationType
        }
        dispatch(setUser(data))
        
    } catch (err) {
        console.log(err)
    }
};

export const handleLogout = async () => {
    await auth.signOut();
    //sessionStorage.removeItem('username');
};

export const handleSignedIn = async () => {
    //const user = sessionStorage.getItem('username');

    const status = onAuthStateChanged(auth, (user) => {
    if (user) {
        return true;
    } else {
        return false;
    }
    });

    return () => status();
}

 