import { AuthProvider } from "./context/authContext"; // Import AuthProvider
import "./globals.css";

export default function RootLayout({ children }) {
    return ( <
        html lang = "en" >
        <
        body > <
        AuthProvider > { children } <
        /AuthProvider> < /
        body > <
        /html>
    );
}
