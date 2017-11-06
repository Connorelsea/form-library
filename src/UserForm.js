import React from "react"
import Form from "./Form"
import { bind } from "decko"

export default class UserForm extends Form {
  isAdult(value) {
    return parseInt(value.split("-")[0]) < 1996
  }

  componentDidMount() {
    this.registerInput({
      name: "birthday",
      type: "date",
      onChange: ({ allInputs, value }) => ({
        ...allInputs,
        birthday: { value },
        adult: { checked: this.isAdult(value) },
      }),
      onValidate: ({ allInputs, value }) =>
        !this.isAdult(value) ? ["Must be 21"] : [],
      affectsGroup: "adult_info",
    })

    this.registerInput({ name: "adult", type: "checkbox" })
    this.registerInput({ name: "username", type: "text" })
    this.registerInput({ name: "password", type: "password" })

    this.registerInput({
      name: "social_security",
      type: "text",
      group: "adult_info",
    })

    this.registerGroup({
      name: "adult_info",
      isActivated: ({ allInputs, nameOfChangedInput, value }) =>
        allInputs["adult"].checked,
      activated: false,
    })
  }

  @bind
  onSubmit(e) {
    e.preventDefault()
    console.log(this.getValues())
  }

  Input = ({ name, label }) => (
    <div>
      <label for={name}>{label}</label>
      <input {...this.getInputProps(name)} />
      {this.getErrors(name)}
    </div>
  )

  renderInputs({ getInputProps, getSubmitProps, getErrors, isGroupActivated }) {
    const { Input } = this
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <h2>Account</h2>
          <Input label="Username" name="username" />
          <Input label="Password" name="password" />
        </div>

        <div>
          <h2>Age</h2>
          <Input label="Birthday" name="birthday" />
          <Input label="Is of Adult Age: " name="adult" />
        </div>

        {isGroupActivated("adult_info") && (
          <div>
            <h2>Adult Information</h2>
            <p>
              Conditionally displayed fields only available above a certain age
            </p>
            <Input label="Social Security " name="social_security" />
          </div>
        )}

        <button type="submit">Create Account</button>
        {/* <pre>{JSON.stringify(this.state, null, 2)}</pre> */}
      </form>
    )
  }
}