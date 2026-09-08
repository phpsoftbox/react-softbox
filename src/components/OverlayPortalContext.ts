import React from 'react';

// Popups belong to their overlay's stacking context, outside its scrollable panel.
export const OverlayPortalContext = React.createContext<React.RefObject<HTMLDivElement | null> | null>(null);
