import React, {useContext, useEffect, useReducer, useRef, useState} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return { value: action.val, isValid: action.val.includes('@') }
    }
    if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.includes('@') }
    }
    return { value: '', isValid: false }
}
const passwordReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return { value: action.val, isValid: action.val.trim().length > 6 }
    }
    if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.trim().length > 6 }
    }
    return { value: '', isValid: false }
}

const Login = (props) => {
    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, dispatchEmail] = useReducer(emailReducer, {
        value: '',
        isValid: undefined
    })
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
        value: '',
        isValid: undefined
    })

    const authCtx = useContext(AuthContext);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    // useEffect(() => {
    //     console.log('When mounted')
    //     return () => {
    //         console.log('When unmounted')
    //     }
    // }, [])

    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;

    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log('Validity check')
            setFormIsValid(emailState.isValid && passwordState.isValid)
        }, 500)
        return () => {
            console.log('CLEANUP');
            clearTimeout(identifier)
        }
    }, [emailIsValid, passwordIsValid])

    const emailChangeHandler = (event) => {
        dispatchEmail({
            type: 'USER_INPUT',
            val: event.target.value
        })

        // setFormIsValid(
        //     event.target.value.includes('@') &&
        //     passwordState.isValid
        // )
    };

    const passwordChangeHandler = (event) => {
        dispatchPassword({
            type: 'USER_INPUT',
            val: event.target.value
        })

        // setFormIsValid(
        //     event.target.value.trim().length > 6 &&
        //     emailState.value.includes('@')
        // )
    };

    const validateEmailHandler = () => {
        dispatchEmail({type: 'INPUT_BLUR'})
    };

    const validatePasswordHandler = () => {
        dispatchPassword({type: 'INPUT_BLUR'})
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            authCtx.onLogin(emailState.value, passwordState.value);
        } else if (!emailIsValid) {
            emailInputRef.current.focus();
        } else {
            passwordInputRef.current.focus();
        }

    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    id="email"
                    label="E-Mail"
                    type="email"
                    ref={emailInputRef}
                    value={emailState.value}
                    isValid={emailIsValid}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    ref={passwordInputRef}
                    value={passwordState.value}
                    isValid={passwordIsValid}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                />
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
