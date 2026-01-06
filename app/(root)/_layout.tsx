import { useGlobalContext } from "@/lib/global-provider";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    BallIndicator,
} from 'react-native-indicators';
import { ActivityIndicator } from "react-native";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
    const { loading, isLoggedIn } = useGlobalContext();

    if(loading) {
        return(
            <SafeAreaView className="bg-white h-full flex justify-center items-center">
                {/* <BallIndicator size={30} color="#0061FF" /> */}
                <ActivityIndicator className="text-primary-300" size="large" />
            </SafeAreaView>
        )
    }

    if(!isLoggedIn) {
        return <Redirect href="/sign-in" />
    }

    return <Slot />


}