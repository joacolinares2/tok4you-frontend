import { create } from 'zustand';

const useUserVerificationStateStore = create( ( set ) => ( {
    userAuthorizationState: {
        register: false,
        hasKYC: false,
        hasTOS: false,
    },
    setUserAuthorizationState: ( verificationStateData ) =>


        set( {
            userAuthorizationState: {
                register: verificationStateData.register,
                hasKYC: verificationStateData.hasKYC,
                hasTOS: verificationStateData.hasTOS,
            },
        } ),
} ) );

export default useUserVerificationStateStore;
