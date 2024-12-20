import create from "zustand";

const useUserStatusStore = create( ( set ) => ( {
    register: false,
    hasKYC: false,
    hasTOS: false,
    setUserStatus: ( status ) => set( ( state ) => ( { ...state, ...status } ) ),
} ) );

export default useUserStatusStore;