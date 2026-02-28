import "./globals.css";

export const metadata = {
  title: "FB Reel Saver",
  description: "Download Facebook videos and Reels"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
