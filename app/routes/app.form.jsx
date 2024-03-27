import React, { useState } from 'react';
import { Form, FormLayout, TextField, Button } from '@shopify/polaris';

const AppForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const[id,setmerchatid]=useState('');
  const [subscription,setSubscription] = useState('');

  const handleSubmit = () => {
    // Call onSubmit function passed from parent component with form data
    onSubmit({ name, email, phoneNumber });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          type="text"
          placeholder="Enter your name"
        />
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="Enter your email"
        />
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={setPhoneNumber}
          type="tel"
          placeholder="Enter your phone number"
        />
        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
  );
};

export default AppForm;
