import Vue from 'vue'
import jwtDecode from 'jwt-decode';

export default new Vue({
  data: {
    token: null,
    id: undefined,
    name: undefined,
    resetTimeout: null
  },
  methods: {
    resetToken () {
      this.token = null;
      this.id = undefined;
      this.name = undefined;
      localStorage.removeItem('token');
      this.$emit('changed');
    },
    setToken (token) {
      if (!token) return this.resetToken();
      const decoded = jwtDecode(token);
      if (!decoded) return this.resetToken();
      const lifetime = decoded.exp * 1000 - Date.now();
      if (lifetime <= 0) return this.resetToken();

      // Save token values
      this.token = token;
      this.id = decoded.id;
      this.name = decoded.name;
      localStorage.setItem('token', token);
      this.$emit('changed');

      // Schedule reset on token expiration
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
      this.resetTimeout = setTimeout(() => { this.resetToken(); }, lifetime);
    }
  },
  created () {
    this.setToken(localStorage.token);
  }
});
