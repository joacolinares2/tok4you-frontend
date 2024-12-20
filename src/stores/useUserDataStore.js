import { create } from 'zustand'

export const useUserDataStore = create( ( set ) => ( {
    userData: null,
    setUserData: ( data ) => set( { userData: data } ),
} ) );
