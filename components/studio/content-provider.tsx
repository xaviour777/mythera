'use client';
import {createContext,useContext} from 'react';
import defaults from '@/content/studio.json';
import type {StudioContent} from '@/lib/studio/content-schema';
const Context=createContext<StudioContent>(defaults as StudioContent);
export function ContentProvider({content,children}:{content:StudioContent,children:React.ReactNode}){return <Context.Provider value={content}>{children}</Context.Provider>}
export const useStudio=()=>useContext(Context);
