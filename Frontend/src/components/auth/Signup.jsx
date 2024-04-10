import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';
import { Link } from 'react-router-dom';
import { createUser } from '../../api/auth';
import { useNotification } from '../../hooks/index';

const validateUserInfo = ({ name, email, password }) => {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: 'Name is missing!' };
  if (!isValidName.test(name)) return { ok: false, error: 'Invalid name!' };

  if (!email.trim()) return { ok: false, error: 'Email is missing!' };
  if (!isValidEmail.test(email)) return { ok: false, error: 'Invalid email!' };

  if (!password.trim()) return { ok: false, error: 'Password is missing!' };
  if (password.length < 8)
    return { ok: false, error: 'Password must be 8 characters long!' };

  return { ok: true };
};

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { updateNotification } = useNotification();

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification('error', error);

    const response = await createUser(userInfo);
    console.log(response);
    if (response.error) return updateNotification('error', response.error);

    navigate('/auth/verification', {
      state: { user: response.user },
      replace: true,
    });
  };

  const { name, email, password } = userInfo;

  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center ">
      <Container>
        <form
          onSubmit={handleSubmit}
          className="bg-secondary rounded p-6 w-72 space-y-6"
        >
          <Title>Sign up</Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Name"
            placeholder="John Doe"
            name="name"
          />
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="john@email.com"
            name="email"
          />
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
            name="password"
          />
          <Submit value="Sign up" />

          <div className="flex justify-between">
            <Link
              className="text-dark-subtle hover:text-white transition"
              to="/auth/signin"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}
