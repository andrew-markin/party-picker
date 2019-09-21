<template>
  <div id="app">
    <b-navbar type="dark" variant="dark" sticky class="noselect">
      <b-container>
        <b-navbar-brand exact to="/">
          Party Picker
        </b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto mr-1">
            <b-nav-item @click.prevent="login">Log In</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <login-modal ref="loginModal"></login-modal>
    <b-container id="main">
      <router-view/>
    </b-container>
  </div>
</template>

<script>

import LoginModal from './components/LoginModal.vue'

export default {
  components: {
    LoginModal
  },
  methods: {
    login () {
      this.$refs.loginModal.show();
    }
  }
}

</script>

<style>
@font-face {
  font-family: 'party-picker'; 
  src: url('./assets/party-picker.ttf');
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
</style>

<style scoped>
.navbar {
  padding-left: 0;
  padding-right: 0;
}
.navbar-expand > .container {
  padding-right: 15px;
  padding-left: 15px;
}
#main {
  padding-top: 1rem;
}
</style>
