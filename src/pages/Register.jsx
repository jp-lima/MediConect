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

    const handleLogin = (e) => {
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
            // ...register logic...
            navigate('/secretaria/inicio');
        } else {
            setAlert("Preencha todos os campos!");
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
                                type="text"
                                name="username"
                                className="form-control form-control-xl"
                                placeholder="Nome de usuário"
                                value={form.username}
                                onChange={handleChange}
                                required
                                />
                                <div className="form-control-icon">
                                    <i className="bi bi-person" />
                                </div>
                            </div>
                            <div className="form-group position-relative has-icon-left mb-4">
                                <select
                                name="userType"
                                className="form-control form-control-xl"
                                value={form.userType}
                                onChange={handleChange}
                                required
                                >
                                    <option value="" disabled>
                                    Selecione o tipo de usuário
                                    </option>
                                    <option value="paciente">Paciente</option>
                                    <option value="secretaria">Secretaria</option>
                                    <option value="medico">Médico</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div className="form-control-icon">
                                    <i className="bi bi-person" />
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