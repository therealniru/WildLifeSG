import { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import tw from 'twrnc';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

 
const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [Loading, setLoading] = useState(false);
// [error, setError] = useState('');
const auth = FIREBASE_AUTH;

const signIn = async () => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        console.log("Login successful", response);
    }
    catch(error){
        console.log("Login failed", error);

    }
    finally {
        setLoading(false);
    }
}

const signUp = async () => {
    setLoading(true);
    try{
        const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        console.log("Sign up successful", response);
    }
    catch(error){
        console.log("Sign up failed", error);
    }
    finally {
        setLoading(false);
    }
}
    
return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
        <TextInput style={tw`border border-gray-300 rounded p-2 w-80 mb-4`}
        placeholder = "Email address" autoCapitalize='none' onChange={(e) => setEmail(e.nativeEvent.text)} value={email} 
        />
        <TextInput style={tw`border border-gray-300 rounded p-2 w-80 mb-4`}
        placeholder = "Password" autoCapitalize = 'none' onChange = {(e) => setPassword(e.nativeEvent.text)} value={password} 
        secureTextEntry/>
        
        {Loading ? ( <ActivityIndicator size='large' color="0000ff" /> ) 
        : (
            //JSX expressions must have one parent element. ts(2657)
        <> 
            <TouchableOpacity style={tw`bg-blue-500 rounded p-2 w-80 mb-4`} onPress={signIn}>
                <Text style={tw`text-white text-center`}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={tw`bg-blue-500 rounded p-2 w-80 mb-4`} onPress={signUp}>
                <Text style={tw`text-white text-center`}>Sign Up</Text>
            </TouchableOpacity>
        </>  
        )}       
     </View>
);
}

export default Login;
