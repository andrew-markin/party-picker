<template>
  <div id="app">
    <b-navbar type="dark" variant="dark" sticky class="noselect">
      <b-container>
        <b-navbar-brand exact to="/">
          Party Picker
        </b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="user" @click.prevent="party">Come Together!</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto mr-1">
            <b-nav-item-dropdown v-if="user" right>
              <template v-slot:button-content>
                {{user}}
              </template>
              <b-dropdown-item @click="logout">Log Out</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-else @click.prevent="login">Log In</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <login-modal ref="loginModal"></login-modal>
    <party-modal ref="partyModal"></party-modal>
    <b-container class="mt-3">
      <router-view/>
    </b-container>
  </div>
</template>

<script>

import LoginModal from './components/LoginModal.vue'
import PartyModal from './components/PartyModal.vue'

import user from './user'

export default {
  data () {
    return {
      user: user.name
    }
  },
  components: {
    LoginModal,
    PartyModal
  },
  methods: {
    login () {
      this.$refs.loginModal.show()
    },
    logout () {
      user.resetToken()
    },
    party () {
      this.$refs.partyModal.show()
    }
  },
  created () {
    this.$root.$on('user-needed', () => {
      this.login()
    })
    user.$on('changed', () => {
      this.user = user.name
    })
  }
}

</script>

<style>
@font-face {
  font-family: 'party-picker';
  src: url('./assets/party-picker.ttf');
}
.icon {
  font-family: 'party-picker';
}
.icon-smile:before {
  content: "\e9e2";
  color: #5cd65c;
}
.icon-sad:before {
  content: "\e9e6";
  color: #d65c5c;
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
</style>
