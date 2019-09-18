<template>
  <div>
    <h1>{{message}}</h1>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      message: ''
    }
  },
  methods: {
    updateMessage () {
      axios.get('/').then(res => {
        this.message = res.data.success ? res.data.message : 'Invalid backend response :('
      }).catch(err => {
        console.log('Backend request error:', err)
        this.message = 'Backend request failed :('
      })
    }
  },
  mounted () {
    this.$nextTick(this.updateMessage)
  }
}

</script>
