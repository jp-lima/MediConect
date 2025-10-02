import React, { useState, useEffect, use } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../components/utils/AuthProvider';   
import API_KEY from '../components/utils/apiKeys';
function Login({ onEnterSystem }) {
    const { authTokens, setAuthTokens } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [alert, setAlert] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      var myHeaders = new Headers();
            myHeaders.append("apikey", API_KEY);
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
            "email": "riseup@popcode.com.br",
            "password": "riseup"
            });
            
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            
            redirect: 'follow'
            };
            
            fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password", requestOptions)
            .then(response => response.json())
            .then(data => {
                setAuthTokens(data);
                console.log(data);
            })
            .catch(error => console.log('error', error));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Tentando logar com:", form);
        if (form.username && form.password) {

          
           /* if (data.access_token) {
                console.log("Login bem-sucedido!");
                var myHeaders = new Headers();
            myHeaders.append("apikey", API_KEY);
            myHeaders.append("Authorization", `Bearer ${data.access_token}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            console.log(data.user.id)

            fetch(`https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/user-info`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result, "vamo ver se da certo"))
            .catch(error => console.log('error', error));
            }*/

            navigate(`/${form.username}/`);


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
                <h3 className="auth-title">Entrar</h3>
                <p className="auth-subtitle mb-5">
                Entre com os dados que você inseriu durante o registro.
                </p>
                {alert && (
                    <div className="alert alert-info" role="alert">
                        {alert}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                <div className="form-group position-relative has-icon-left mb-4">
                    <input
                    type="text"
                    name="username"
                    className="form-control form-control-xl"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    />
                    <div className="form-control-icon">
                    <i className="bi bi-person" />
                    </div>
                </div>
                <div className="form-group position-relative has-icon-left mb-4">
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control form-control-xl"
                    placeholder="Password"
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
                <div className="form-check form-check-lg d-flex align-items-end">
                    <input
                    className="form-check-input me-2"
                    type="checkbox"
                    defaultValue=""
                    id="flexCheckDefault"
                    />
                    <label
                    className="form-check-label text-gray-600"
                    htmlFor="flexCheckDefault"
                    >
                    Manter-me conectado
                    </label>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg shadow-lg mt-5" >
                Entrar
                </button>
                </form>
                <div className="text-center mt-5 text-lg fs-4">
                <p className="text-gray-600">
                    Não tem uma conta?
                    <Link className="font-bold" to={'/register'}>
                    Cadastre-se
                    </Link>
                    .
                </p>
                <p>
                    <Link className="font-bold" to={'/forgotPassword'}>
                    Esqueceu a senha?
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

export default Login;