import { ReactNode, createContext } from 'react';

export interface SheduleInfoModalContextProps {
    sheduleInfoModalOpen?: "todayImg" | "tomorrowImg" | "today" | "tomorrow" | false;
    changeSheduleInfoModalOpen?: (newSheduleInfoModalOpen: "todayImg" | "tomorrowImg" | "today" | "tomorrow" | false) => void;
}

export const SheduleInfoModalContext = createContext<SheduleInfoModalContextProps>({});
