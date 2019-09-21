<template>
  <b-modal
    ref="modal"
    title="Please Log In for Party Picking"
    ok-title="Log In"
    @shown="resetModal"
    @hidden="resetModal"
    @ok="handleOk">
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group>
        <b-form-checkbox
          id="registration"
          v-model="registration">
          Register me as a new user
        </b-form-checkbox>
      </b-form-group>
      <b-form-group
        :state="usernameState"
        label="Username"
        label-for="username"
        invalid-feedback="Valid username is required (acceptable: 0-9, A-Z, a-z and '-')">
        <b-form-input
          id="username"
          ref="username"
          v-model="username"
          :state="usernameState"
          type="text" required
          maxlength="32"
          @keydown.enter.native="$refs.password.focus()">
        </b-form-input>
      </b-form-group>
      <b-form-group
        :state="passwordState"
        label="Password"
        label-for="password"
        invalid-feedback="Non-empty password is required">
        <b-form-input
          id="password"
          ref="password"
          v-model="password"
          :state="passwordState"
          type="password" required
          maxlength="32"
          @keydown.enter.native="handlePasswordEnter(registration)">
        </b-form-input>
      </b-form-group>
      <b-form-group
        v-if="registration"
        :state="confirmationState"
        label="Confirm Password"
        label-for="confirmation"
        invalid-feedback="Password have to be confirmed for registration">
        <b-form-input
          id="confirmation"
          ref="confirmation"
          v-model="confirmation"
          :state="confirmationState"
          type="password" required
          maxlength="32"
          @keydown.enter.native="handlePasswordEnter()">
        </b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>

export default {
  data () {
    return {
      username: '',
      password: '',
      confirmation: '',
      registration: false,
      isBusy: false,
      usernameState: undefined,
      passwordState: undefined,
      confirmationState: undefined
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    resetModal () {
      this.username = '';
      this.password = '';
      this.confirmation = '';
      this.registration = false;
      this.resetInputStates();
      var usernameInput = this.$refs.username;
      if (usernameInput) usernameInput.focus();
    },
    resetInputStates () {
      this.usernameState = undefined;
      this.passwordState = undefined;
      this.confirmationState = undefined;
    },
    validateInputStates () {
      // eslint-disable-next-line
      var usernameRegex = /^[a-zA-Z0-9\-]+$/;
      this.usernameState = usernameRegex.test(this.username);
      this.passwordState = this.password.length > 0;
      this.confirmationState = this.registration ? 
          (this.confirmation.length > 0) && (this.password === this.confirmation) : 
          undefined;
    },
    handlePasswordEnter (skipToConfirmation) {
      if (skipToConfirmation) return this.$refs.confirmation.focus();
      this.handleSubmit()
    },
    handleOk(event) {
      event.preventDefault();
      this.handleSubmit();
    },
    handleSubmit () {
      this.validateInputStates();
      // TODO: Implement server interaction
    }
  }
}

</script>
