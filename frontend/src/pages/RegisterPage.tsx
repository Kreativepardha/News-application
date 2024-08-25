import React, { useState } from "react"
import useUserStore from "../store/useUserStore";
import axios from "axios";



export const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {  error, isLoading, register } = useUserStore(state => ({
        register: state.register,
        error: state.error,
        isLoading: state.isLoading
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await register(name, email, password);
    }   

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" disabled={isLoading}>
                    Register
                </button>
        {
            error && <p>{error}</p>
        }
            </form>
        </div>
    )















}