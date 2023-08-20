import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";
import NavbarComponent from "./MyNavbar"; // Import your Navbar component

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <div>
        {/* Include your NavbarComponent here */}
        <NavbarComponent
          goHome={
            () =>
              router.push("/") /* Implement the logic to go to the home page */
          }
        />

        {/* Your PageTransition and Component */}
        <PageTransition
          timeout={300}
          classNames="page-transition"
          skipInitialTransition
        >
          <Component {...pageProps} key={router.route} />
        </PageTransition>
      </div>
    </SessionProvider>
  );
}
