// File: components/LayoutContext.jsx
// This creates a React Context to share layout properties like AppBar height.
'use client';

import { createContext } from 'react';

// We export the context so other components can use it.
export const LayoutContext = createContext(null);