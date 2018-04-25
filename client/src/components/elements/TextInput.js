import React from 'react'
import { FormGroup, FormControl, FormFeedback, Label, Input } from 'react-bootstrap';

export class TextInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.input_type = props.type ? props.type : "text"
  }
  render() {
    return (
      <div className="form-vertical-input-group">
          {this.props.label && 
            <label className="label form-vertical-label">{this.props.label}</label>
          }
          <input 
            type={this.input_type} 
            name={this.props.name} 
            className={this.props.error ? "error" : ""}
            {...this.props} 
          />
        </div>
    );
  }
}

