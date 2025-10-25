import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        username: "",
        userType: "",
        password: "",
        confirmPassword: ""
    });
    const [alert, setAlert] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (
            form.email &&
            form.username &&
            form.userType &&
            form.password &&
            form.confirmPassword
        ) {
            if (form.password !== form.confirmPassword) {
                setAlert("As senhas não coincidem!");
                return;
            }
            try {
                const response = await fetch("https://mock.apidog.com/m1/1053378-0-default/auth/v1/otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        username: form.username,
                        userType: form.userType,
                        password: form.password
                    })
                });
                if (response.ok) {
                    setAlert("Cadastro realizado! Verifique seu e-mail.");
                    console.log("Usuário cadastrado:", form.email);
                } else {
                    setAlert("Não foi possível cadastrar. Tente novamente.");
                }
            } catch (error) {
                setAlert("Erro ao cadastrar. Tente novamente.");
                console.error("Falha ao cadastrar usuário:", error);
            }
        } else {
            setAlert("Preencha todos os campos!");
        }
    };

    const loginWithPassword = async (email, password) => {
        try {
            const response = await fetch('https://mock.apidog.com/m1/1053378-0-default/auth/v1/token?grant_type=password', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer <seu-token>',
                    'apikey': '<sua-api-key>',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login bem-sucedido:", data);
                setAlert("Login realizado com sucesso!");
            } else {
                console.error("Falha no login:", data);
                setAlert(data.message || "E-mail ou senha incorretos.");
            }
        } catch (error) {
            console.error("Erro na chamada de login:", error);
            setAlert("Ocorreu um erro de rede ao tentar fazer login.");
        }
    };

    const sendMagicLink = async (email) => {
        const magicLinkEndpoint = "https://mock.apidog.com/m1/1053378-0-default/auth/v1/otp";
        
        try {
            const response = await fetch(magicLinkEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer <seu-token>',
                    'apikey': '<sua-api-key>',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Magic link enviado:", data);
                setAlert("Magic link enviado para o seu e-mail! Verifique sua caixa de entrada.");
            } else {
                console.error("Falha ao enviar magic link:", data);
                setAlert(data.message || "Não foi possível enviar o magic link.");
            }
        } catch (error) {
            console.error("Erro na chamada de envio de magic link:", error);
            setAlert("Ocorreu um erro de rede ao enviar o magic link.");
        }
    };

    return (
        <>
            <div className="mt-3 card-position">
                <div className="col-lg-5 col-6">
                    <div className="card w-10 shadow-sm d-flex justify-content-between align-items-center">
                        <div id="auth-left">
                            <div className="auth-logo">
                                <br />
                                <Link to="/">
                                    <h1 className="mb-4 text-center">MediConnect</h1>
                                </Link>
                            </div>
                            <h3 className="auth-title">Cadastre-se</h3>
                            <p className="auth-subtitle mb-5">
                                Insira seus dados para se registrar em nosso site.
                            </p>
                            {alert && (
                                <div className="alert alert-info" role="alert">
                                    {alert}
                                </div>
                            )}
                            <form>
                                <div className="form-group position-relative has-icon-left mb-4">
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control form-control-xl"
                                        placeholder="E-mail"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="form-control-icon">
                                        <i className="bi bi-envelope" />
                                    </div>
                                </div>
                               
                               
                                <div className="form-group position-relative has-icon-left mb-4">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control form-control-xl"
                                        placeholder="Senha"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="form-control-icon">
                                        <i className="bi bi-shield-lock" />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </button>
                                </div>
                                <div className="form-group position-relative has-icon-left mb-4">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className="form-control form-control-xl"
                                        placeholder="Confirmar senha"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="form-control-icon">
                                        <i className="bi bi-shield-lock" />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none" }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </button>
                                </div>
                                <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5"
                                    onClick={handleLogin}>
                                    Cadastrar
                                </button>
                            </form>
                            <div className="text-center mt-5 text-lg fs-4">
                                <p className="text-gray-600">
                                    Já tem uma conta?
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


export default Register;
