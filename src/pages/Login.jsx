import React, { useState, useEffect, use } from 'react';
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from '../components/utils/AuthProvider';   
import API_KEY from '../components/utils/apiKeys';
import { UserInfos } from '../components/utils/Functions-Endpoints/General';

function Login({ onEnterSystem }) {
    const {setAuthTokens } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [alert, setAlert] = useState("");
    const [showPassword, setShowPassword] = useState(false);
/*
    useEffect(async () => {
        
      var myHeaders = new Headers();
            myHeaders.append("apikey", API_KEY);
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
            "email": form.username,
            "password": form.password
            });
            
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            
            redirect: 'follow'
            };

            const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password", requestOptions);
            const data = await response.json();
            setAuthTokens(data);
            console.log(data);

        if(data.access_token){
            console.log('jasja')
            /*var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${data.access_token}`);
            myHeaders.append("apikey", API_KEY);

            var raw = JSON.stringify({
            "email": "secretaria@squad23.com",
            "password": "squad23!",
            "full_name": "Secretaria",
            "phone": "(11) 99999-9999",
            "role": "secretaria"
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));*/

            /* var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${data.access_token}`);
            myHeaders.append("apikey", API_KEY);
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/user_roles", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
    }, []);*/

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Tentando logar com:", form);
        if (form.username && form.password) {
             var myHeaders = new Headers();
            myHeaders.append("apikey", API_KEY);
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
            "email": form.username,
            "password": form.password
            });
            
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            
            redirect: 'follow'
            };

            const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password", requestOptions);
            const data = await response.json();
            setAuthTokens(data);
            console.log(data);

          
            if (data.access_token){
             

               const UserData = await UserInfos(`bearer ${data.access_token}`);
               console.log(UserData, 'Dados do usuário');

            if(UserData?.roles?.includes('admin')){
            navigate(`/admin/`);
        } else if(UserData?.roles?.includes('secretaria')){
            navigate(`/secretaria/`);
        } else if(UserData?.roles?.includes('medico')){
            navigate(`/medico/`);
        } else if(UserData?.roles?.includes('financeiro')){
            navigate(`/financeiro/`);
        }
        }

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