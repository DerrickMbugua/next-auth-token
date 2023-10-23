import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'

export default function LoginPage() {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const router = useRouter()
  const handleFormSubmit = async(e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    
    // Assuming your signIn function returns a promise
    await signIn("credentials", {
      username: email,
      password: password,
      redirect: true,
      callbackUrl: "/dashboard"
    });

    setEmail('');
    setPassword('');
    console.log("init")

  }

  return (
    <div>
      <h1>Login page</h1>
      <form onSubmit={handleFormSubmit}>
      <input type="text" placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary">Submit</button>
    </form>
    </div>
  )
}
