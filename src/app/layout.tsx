import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
const sans=Manrope({subsets:["latin"],variable:"--font-sans",display:"swap"});
const serif=Cormorant_Garamond({subsets:["latin"],variable:"--font-serif",display:"swap",weight:["400","500","600"]});
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"),title:{default:"Axis Day Hospital | Estrutura cirúrgica para médicos",template:"%s | Axis Day Hospital"},description:"Day Hospital em São Paulo com pacotes de cirurgias eletivas para médicos externos.",alternates:{canonical:"/"},openGraph:{title:"Axis Day Hospital",description:"Sua cirurgia. Nossa estrutura.",locale:"pt_BR",type:"website",images:[{url:"/images/RCZ_2199-HDR.jpg",width:1600,height:1067}]},twitter:{card:"summary_large_image",title:"Axis Day Hospital",description:"Sua cirurgia. Nossa estrutura.",images:["/images/RCZ_2199-HDR.jpg"]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR" className={`${sans.variable} ${serif.variable}`}><body>{children}</body></html>}
