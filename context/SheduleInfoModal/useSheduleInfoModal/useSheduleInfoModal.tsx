import { ReactNode, useContext } from "react";
import { SheduleInfoModalContext } from "../SheduleInfoModalContext";

interface UseThemeResult {
    toggleSheduleInfoModal: (
        newData: "todayImg" | "tomorrowImg" | "today" | "tomorrow" | false
    ) => void;
    sheduleInfoModalOpen: ReactNode;
}

export const useSheduleInfoModal = (): UseThemeResult => {
    const { sheduleInfoModalOpen, changeSheduleInfoModalOpen } = useContext(
        SheduleInfoModalContext
    );

    const toggleSheduleInfoModal = (
        newData: "todayImg" | "tomorrowImg" | "today" | "tomorrow" | false
    ) => {
        changeSheduleInfoModalOpen?.(newData);
    };

    return {
        sheduleInfoModalOpen: sheduleInfoModalOpen,
        toggleSheduleInfoModal,
    };
};

//в коде const { sheduleInfoModal, toggleSheduleInfoModal } = useSheduleInfoModal();
