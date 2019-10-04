<template>
  <b-modal
    ref="modal"
    title="Please Log In for Party Picking"
    ok-title="Log In"
    @shown="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    :ok-disabled="isBusy">
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group>
        <b-form-checkbox
          id="registration"
          v-model="registration"
          @change="$refs.name.select()">
          Register me as a new user
        </b-form-checkbox>
      </b-form-group>
      <b-form-group
        :state="nameState"
        label="Name:"
        label-for="name"
        invalid-feedback="Name must be 5-20 characters long (0-9, A-Z, a-z and '-')">
        <b-form-input
          id="name"
          ref="name"
          v-model="name"
          :state="nameState"
          type="text" required
          maxlength="20"
          @keydown.enter.native="$refs.password.select()">
        </b-form-input>
      </b-form-group>
      <b-form-group
        :state="passwordState"
        label="Password:"
        label-for="password"
        invalid-feedback="Password must be 8-32 characters long, include one lowercase letter, one uppercase letter, a number, and a special character (_@$!%*?&)">
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
        label="Confirm Password:"
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
    <template v-if="registration">
      <b-alert variant="danger" :show="isFailed">
        User registration failed due server error :(
      </b-alert>
      <b-alert variant="danger" :show="nameIsAlreadyInUse">
        This user name is already in use
      </b-alert>
    </template>
    <template v-else>
      <b-alert variant="danger" :show="isFailed">
        User authentication failed due server error :(
      </b-alert>
      <b-alert variant="danger" :show="nameOrPasswordAreWrong">
        Wrong user name or password
      </b-alert>
    </template>
  </b-modal>
</template>

<script>

import axios from 'axios'
import user from '../user'

export default {
  data () {
    return {
      name: '',
      password: '',
      confirmation: '',
      registration: false,
      nameState: undefined,
      passwordState: undefined,
      confirmationState: undefined,
      nameIsAlreadyInUse: undefined,
      nameOrPasswordAreWrong: undefined,
      isBusy: false,
      isFailed: false,
    }
  },
  computed: {
    formIsValid () {
      return this.nameState && this.passwordState &&
          (!this.registration || this.confirmationState);
    }
  },
  watch: {
    name: function() {
      this.nameIsAlreadyInUse = false;
      this.nameOrPasswordAreWrong = false;
    },
    password: function() {
      this.nameOrPasswordAreWrong = false;
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    resetModal () {
      this.name = '';
      this.password = '';
      this.confirmation = '';
      this.registration = false;
      this.nameState = undefined;
      this.passwordState = undefined;
      this.confirmationState = undefined;
      this.nameIsAlreadyInUse = false;
      this.nameOrPasswordAreWrong = false;
      var nameInput = this.$refs.name;
      if (nameInput) nameInput.focus();
      this.isBusy = false;
      this.isFailed = false;
    },
    validateInputStates () {
      // eslint-disable-next-line
      var nameRegex = /^[a-zA-Z0-9\-]{5,20}$/;
      this.nameState = nameRegex.test(this.name);
      var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{8,32}$/;
      this.passwordState = passwordRegex.test(this.password);
      this.confirmationState = this.registration ? 
          (this.confirmation.length > 0) && (this.password === this.confirmation) : 
          undefined;
    },
    handlePasswordEnter (skipToConfirmation) {
      if (skipToConfirmation) return this.$refs.confirmation.select();
      this.handleSubmit()
    },
    handleOk(event) {
      event.preventDefault();
      this.handleSubmit();
    },
    handleSubmit () {
      this.validateInputStates();
      if (!this.formIsValid || this.isBusy) return;
      this.isBusy = true;
      this.isFailed = false;
      if (this.registration) {
        axios.post('/users', {
          name: this.name,
          password: this.password
        }).then(res => {
          this.isBusy = false
          if (!res.data.success) {
            this.$refs.name.select();
            this.nameIsAlreadyInUse = true;
            return;
          }
          user.setToken(res.data.token);
          this.$refs.modal.hide();
        }).catch(err => {
          this.isBusy = false
          this.isFailed = true
          this.$refs.name.select();
          console.log('User registration error:', err.message);
        })
      } else {
        axios.post('/users/auth', {
          name: this.name,
          password: this.password
        }).then(res => {
          this.isBusy = false
          if (!res.data.success) {
            this.$refs.name.select();
            this.nameOrPasswordAreWrong = true;
            return;
          }
          user.setToken(res.data.token);
          this.$refs.modal.hide();
        }).catch(err => {
          this.isBusy = false
          this.isFailed = true
          this.$refs.name.select();
          console.log('User authentication error:', err.message);
        })
      }
    }
  }
}

</script>
