import Image from 'next/image'
import { Inter } from 'next/font/google'
import LoginBtn from './components/LoginBtn'

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
    >
      <LoginBtn />
     
    </main>
  )
}
