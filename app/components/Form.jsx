'use client';
import { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { useSelector,useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userDataSlice";
import { IoArrowBackOutline } from "react-icons/io5";

export default function Form({ showForm, showFormUpdate }) {
    
    const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSelected,setIsSelected]=useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        if (showForm === 2 && country.length > 0) {
            const fetchCountries = async () => {
                try {
                    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data.slice(0, 3).map(c => ({ name: c.name.common, flag: c.flags.png })));
                    } else {
                        setSuggestions([]);
                    }
                } catch (err) {
                    setSuggestions([]);
                }
            };
            fetchCountries();
        } else
            setSuggestions([]);

    }, [country, showForm]);


    const handleLogin = async () => {
        setError('');
        setIsSelected(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('jwtToken', data.token);
                showFormUpdate(0);
                dispatch(setUserData(data.user));//this will also set isLoggedIn to true in redux store
            } else {
                const errData = await res.json();
                setError(errData.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed');
        }
    };
    const handleSignup = async () => {
        setError('');
        setIsSelected(true);
        if (username.length < 4) {
            setError('Username should be of at least 4 characters');
            return;
        }

        if (password.length < 6) {
            setError('Password length must be at least 6 characters');
            return;
        }

        if (!suggestions.some(sugg => sugg.name.toLowerCase() === country.toLowerCase())) {
            setError('Please select a valid country from suggestions');
            return;
        }
        try {
            const res = await fetch('/api/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, country })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('jwtToken', data.token);
                showFormUpdate(0);
                dispatch(setUserData(data.user));
            } else {
                const errData = await res.json();
                setError(errData.message || 'Signup failed');
            }
        } catch (err) {
            setError('Signup failed');
        }
    };

    const checkUserName = (e) => {
        setError('');
        const value = e.target.value;
        if (/^[a-z0-9_.]*$/.test(value) && value.length <= 15)
            setUsername(value);
        else if (value.length > 15)
            setError('username length can not be of more than 15 characters');
        else
            setError('Only lowercase letters, numbers, _ and . are allowed in username');
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.backButton} onClick={() => showFormUpdate(0)}><IoArrowBackOutline/></div>
            <div className={styles.formTitle}>{showForm === 1 ? 'Login' : 'Sign Up'}</div>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => checkUserName(e)}
                className={styles.inputField1}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value);setError('')}}
                className={styles.inputField2}
                required
            />
            {showForm === 2 && (
                <div className={styles.countryFieldContainer}>
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => {setCountry(e.target.value);setError('');setIsSelected(false)}}
                        className={styles.inputField3}
                        required
                    />
                    {suggestions.length > 0 && !isSelected && (
                        <div className={styles.suggestionsContainer}>
                            {suggestions.map((sugg, index) => (
                                <div
                                    key={index}
                                    className={styles['suggestion'+index]}
                                    onClick={() => {
                                        setCountry(sugg.name);
                                        setIsSelected(true);
                                    }}
                                >
                                    {sugg.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
            )}
            {error && <div className={styles.errorMessage}>* {error}</div>}
            <div
                className={styles.submitButton}
                onClick={showForm === 1 ? handleLogin : handleSignup}
            >
                {showForm === 1 ? 'Login' : 'Sign Up'}
            </div>
        </div>
    );
}