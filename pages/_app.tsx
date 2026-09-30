import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import { RecoilRoot } from "recoil";
import localFont from 'next/font/local';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/fonts.css';

const roboto = localFont({
  src: [
    {
      path: '../public/fonts/roboto/Roboto-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/roboto/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/roboto/Roboto-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/roboto/Roboto-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <main className={roboto.className}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </RecoilRoot>
  );
}

