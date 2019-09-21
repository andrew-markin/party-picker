<template>
  <b-row>
    <b-col cols="12">
      <calendar-grid></calendar-grid>
    </b-col>
  </b-row>
</template>

<script>

import CalendarGrid from '../components/CalendarGrid.vue'

export default {
  components: {
    CalendarGrid
  }
}

</script>