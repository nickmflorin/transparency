import React from 'react'
import { FormGroup, FormControl, FormFeedback, Label, Input } from 'react-bootstrap';

const TextInput = ({name, label, error, type, ...rest}) => {
  const id = `id_${name}`
  const input_type = type ? type:"text"

  return (
    <FormGroup color={error?"danger":""} style={{marginTop: 5}}>
      {label?<Label htmlFor={id}>{label}</Label>: ""}
      <FormControl 
        id={id}
        type={input_type} 
        name={name} 
        className={error?"is-invalid":""}
        {...rest} 
      />

      {error?
         <FormControl.Feedback className="invalid-feedback">
           {error}
         </FormControl.Feedback>
         : ""
      }
    </FormGroup>
  )
}

export default TextInput