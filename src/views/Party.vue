<template>
  <div>
    <b-row>
      <b-col cols="12">
        <h2 v-if="name" class="text-truncate">{{name}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <calendar-grid :party="id" ref="grid"></calendar-grid>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import axios from 'axios'

import CalendarGrid from '../components/CalendarGrid.vue'

export default {
  data () {
    return {
      id: undefined,
      name: undefined
    };
  },
  watch: {
    '$route.params.id': function() {
      this.refresh()
    }
  },
  components: {
    CalendarGrid
  },
  methods: {
    refresh () {
      this.id = this.$route.params.id;
      axios.get(`/parties/${this.id}`).then(res => {
        this.name = res.data.party.name;
      }).catch(err => {
        console.log('Party receiving error', err.message);
        this.$router.replace({ name: 'about' });
      });
    }
  },
  mounted () {
    this.refresh();
  }
}

</script>
