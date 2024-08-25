import React, { useState } from "react"
import useUserStore from "../store/useUserStore"




export const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, isLoading, error } = useUserStore(state => ({
        login: state.login,
        error: state.error,
        isLoading: state.isLoading
    }))

    const handleSubmit =  async (e: React.FormEvent) => {
        e.preventDefault()
        await login(email, password)
    }
    return (
        <div>
            <form onSubmit={handleSubmit} >
                <input type="email" value={email} onChange={(e) =>  setEmail(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button disabled={isLoading} type="submit">
                    login
                </button>
            </form>

        </div>
    )
}