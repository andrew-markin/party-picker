<template>
  <b-modal
    ref="modal"
    title="Let's Create a New Party!"
    ok-title="Create"
    @shown="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    :ok-disabled="isBusy">
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        :state="nameState"
        label="Please name it somehow:"
        label-for="name"
        invalid-feedback="Party name must be 5 characters long at least">
        <b-form-input
          id="name"
          ref="name"
          v-model="name"
          :state="nameState"
          type="text" required
          @keydown.enter.native="handleSubmit">
        </b-form-input>
      </b-form-group>
    </form>
    <b-alert variant="danger" :show="isFailed">
      Party creation failed due server error :(
    </b-alert>
  </b-modal>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      name: '',
      nameState: undefined,
      isBusy: false,
      isFailed: false,
    }
  },
  computed: {
    formIsValid () {
      return this.nameState;
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    resetModal () {
      this.name = '';
      this.resetInputStates();
      var nameInput = this.$refs.name;
      if (nameInput) nameInput.focus();
      this.isBusy = false;
      this.isFailed = false;
    },
    resetInputStates () {
      this.nameState = undefined;
    },
    validateInputStates () {
      this.nameState = this.name.length >= 5;
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
      axios.post('/parties', {
        name: this.name
      }).then(res => {
        this.isBusy = false
        this.$router.push({
          name: 'party',
          params: { id: res.data.party.id }
        });
        this.$refs.modal.hide();
      }).catch(err => {
        this.isBusy = false
        this.isFailed = true
        this.$refs.name.select();
        console.log('Party creation error:', err.message)
      })
    }
  }
}

</script>
