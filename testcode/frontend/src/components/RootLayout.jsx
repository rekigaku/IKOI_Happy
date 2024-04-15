import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.css' // CSS モジュールのインポート


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <div className={`${styles.container} ${inter.className}`} lang="jp">
      {/* Header content */}
      <header className={`navbar ${styles.navbar}`}>
        <div className="navbar-start">
          <div className="ml-4 lg:ml-12">
            <Image src="/ikoi.png" alt="IKOI logo" width={150} height={50} />
          </div>
        </div>
        <div className="navbar-end">
          <Link href="/record-entry" passHref>
            <button className="btn text-lg mr-7">記録する</button>
          </Link>
          <Link href="/weekly" passHref>
            <button className="btn btn-active btn-primary text-lg mr-7">レポートをみる</button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Footer content */}
      <footer className={styles.footer}>
        <aside>
          <p className="text-lg">Copyright © 2024 - All rights reserved team IKOI</p>
        </aside>
      </footer>
    </div>
  )
}
