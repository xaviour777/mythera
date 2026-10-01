import type { Metadata } from "next";
import "./studio.css";
import {ContentProvider} from "@/components/studio/content-provider";
import {getContent} from "@/lib/studio/content";

export const metadata: Metadata = {
  title:"MYTHRA Studios — Stories become worlds",
  description:"An AI-native story and IP studio creating original entertainment for a global audience. Discover The Mother's Monster, created by Zahid Iqbal.",
  metadataBase:new URL("https://mythrafilm.com"),
  icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},
};

export default async function StudioLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><ContentProvider content={await getContent()}>{children}</ContentProvider></body></html>}
