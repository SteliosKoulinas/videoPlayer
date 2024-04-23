import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./nav";
import Footer from "./footer";
import Player from "./player"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Super Duper Video Player",
  description: "Awesome Video Player",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
