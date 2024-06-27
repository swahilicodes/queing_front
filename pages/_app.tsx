import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import { RecoilRoot } from "recoil";
import {Open_Sans} from '@next/font/google'

const roboto = Open_Sans({
  subsets: ['latin'],
  weight: ["300", "400", "500", "700"]
})

export default function App({ Component, pageProps }: AppProps) {
  return <RecoilRoot>
    <Layout>
    <main className={roboto.className}><Component {...pageProps} /></main>
    </Layout>
  </RecoilRoot>
}
