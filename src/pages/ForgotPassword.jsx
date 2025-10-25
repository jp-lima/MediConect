import React, { useState } from 'react';
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                const response = await fetch("https://mock.apidog.com/m1/1053378-0-default/auth/v1/otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                if (response.ok) {
                    setAlert("E-mail de verificação enviado!");
                    console.log("Magic link enviado para:", email);
                } else {
                    setAlert("Não foi possível enviar o e-mail. Tente novamente.");
                }
            } catch (error) {
                setAlert("Erro ao enviar e-mail. Tente novamente.");
                console.error("Falha ao enviar magic link:", error);
            }
        } else {
            setAlert("Preencha o campo de e-mail!");
        }
    };

    return (
        <>
        <div className="mt-3 card-position">
            <div className="col-lg-5 col-12">
                <div className="card shadow-sm d-flex justify-content-between align-items-center">
                    <div id="auth-left">
                        <div className="auth-logo">
                            <br />
                            <Link to="/">
                                <h1 className="mb-4 text-center">MediConnect</h1>
                            </Link>
                        </div>
                        <h3 className="auth-title">Esqueci minha senha</h3>
                        <p className="auth-subtitle mb-5">
                            Informe seu e-mail e enviaremos um link para redefinir sua senha.
                        </p>
                        {alert && (
                            <div className="alert alert-info" role="alert">
                                {alert}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group position-relative has-icon-left mb-4">
                                <input
                                    type="email"
                                    className="form-control form-control-xl"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="form-control-icon">
                                    <i className="bi bi-envelope" />
                                </div>
                            </div>
                            <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">
                                Enviar
                            </button>
                        </form>
                        <div className="text-center mt-5 text-lg fs-4">
                            <p className="text-gray-600">
                                Lembrou da sua senha?
                                <Link className="font-bold" to={'/login'}>
                                    Entrar
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-7 d-none d-lg-block">
                        <div id="auth-right"></div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ForgotPassword;
