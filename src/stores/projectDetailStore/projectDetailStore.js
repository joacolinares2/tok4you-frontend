import { create } from 'zustand';

export const useProjectDetailsStore = create( ( set ) => ( {
    projectDetails: null,
    setProjectDetailsInZustand: ( details ) => set( { projectDetails: details } ),
} ) );
