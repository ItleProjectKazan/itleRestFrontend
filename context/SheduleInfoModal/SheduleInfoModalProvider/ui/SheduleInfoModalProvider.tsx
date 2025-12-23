import { ReactNode, useMemo, useState } from "react";
import { SheduleInfoModalContext } from "../../SheduleInfoModalContext";

interface SheduleInfoModalProviderProps {
    children?: ReactNode;
}

const SheduleInfoModalProvider = (props: SheduleInfoModalProviderProps) => {
    const { children } = props;

    const { Provider } = SheduleInfoModalContext;

    const [sheduleInfoModalOpen, changeSheduleInfoModalOpen] = useState<
        "todayImg" | "tomorrowImg" | "today" | "tomorrow" | false
    >(false);

    const defaultProps = useMemo(
        () => ({
            sheduleInfoModalOpen,
            changeSheduleInfoModalOpen,
        }),
        [sheduleInfoModalOpen]
    );

    return <Provider value={defaultProps}>{children}</Provider>;
};

export default SheduleInfoModalProvider;
