import ActionCable from 'actioncable';
import React from 'react';

interface CableContext {
    cable: ActionCable.Cable;
}

const CableContext = React.createContext<CableContext | null>(null);

const CableProvider = ({ children }: { children: React.ReactNode }) => {
    const actionCableUrl = 'ws://localhost:3000/cable';

    const cableApp = {
        cable: ActionCable.createConsumer(actionCableUrl),
    };
    return (
        <CableContext.Provider value={cableApp}>
            {children}
        </CableContext.Provider>
    );
};

export { CableContext, CableProvider };
