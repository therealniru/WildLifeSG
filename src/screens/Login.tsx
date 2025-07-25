import { useState } from 'react';
import { ScrollView, View, Text, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, ImageBackground } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import tw from 'twrnc';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

 
const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [Loading, setLoading] = useState(false);
const [error, setError] = useState('');
const auth = FIREBASE_AUTH;

const signIn = async () => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);  // firebase function to sign in user
        console.log("Login successful", response);
    }
    catch(error){
        console.log("Login failed", error);   // retrieve error message thrown by firebase
        if (error instanceof FirebaseError) {
            setError(error.message);   // set error message to state
        } else {
            setError(String(error));
        }
    }
    finally {
        setLoading(false);   // wether login is successful or not, set loading to false
    }
}

const signUp = async () => {
    setLoading(true);
    try{
        const response = await createUserWithEmailAndPassword(auth, email, password);   // firebase function to create user
        console.log("Sign up successful", response);
    }
    catch(error){
        console.log("Sign up failed", error);    
        if (error instanceof Error) {
            setError(error.message);   // set error message to state
        } else {
            setError(String(error));
        }
    }
    finally {
        setLoading(false);
    }
}
    
return (
    <ImageBackground
      source={require('../../assets/orbital_poster (3).png')}
      style={tw`flex-1`}
      resizeMode="stretch">
        <View style={tw`flex-1 justify-center items-center`}>
            <Text style = {tw`text-6xl font-bold mb-1 text-white`}>SGWildlife</Text>
            <Text style = {tw`text-sm mb--40 text-white`}>Let's Take Wildlife Spotting To The Next Level</Text>
            <KeyboardAvoidingView behavior="padding" style={tw`w-full h-full justify-center items-center`}>
                {/* Added a box around login to make it look more aesthetic*/}
                <View style={tw`flex-col items-center bg-[#e8eac5] rounded-2xl p-4 w-80`}>
                <Text style={tw`text-2xl font-bold mb-4 text-green-800`}>Login/Sign up</Text>    
                <TextInput style={tw`border border-gray-300 rounded-lg p-2 w-60 mb-4 bg-white`}
                placeholder = "Email address" autoCapitalize='none' onChange={(e) => setEmail(e.nativeEvent.text)} value={email} 
                />
                <TextInput style={tw`border border-gray-300 rounded-lg p-2 w-60 mb-4 bg-white`}
                placeholder = "Password" autoCapitalize = 'none' onChange = {(e) => setPassword(e.nativeEvent.text)} value={password} 
                secureTextEntry/>
                {error ? ( <Text style={tw`text-red-500 mb-4`}>{error}</Text> ) : null}   
                
                {Loading ? ( <ActivityIndicator size='large' color="0000ff" /> )    // conditional rendering based on loading state
                : (
                        // JSX expressions must have one parent element.
                <> 
                    <TouchableOpacity style={tw`bg-green-800 rounded p-2 w-20 mb-2`} onPress={signIn}>
                        <Text style={tw`text-white text-center`}>Login</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-sm mb-1 text-green-800`}>Don't have an account?</Text>
                    <TouchableOpacity style={tw`bg-green-800 rounded p-2 w-20 mb-4`} onPress={signUp}>
                        <Text style={tw`text-white text-center`}>Sign Up</Text>
                    </TouchableOpacity>
                </>
                )}
                </View>       
            </KeyboardAvoidingView>
        </View>
        </ImageBackground>
    );
}

export default Login;
