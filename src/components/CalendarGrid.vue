<template>
  <div
    v-if="config"
    class="noselect">
    <div
      v-for="(week) in config.weeks"
      :key="week[0].date.format()"
      class="week-container">
      <calendar-cell
        v-for="day in week"
        :key="day.date.format()"
        :now="config.now"
        :date="day.date"
        :others-true-votes-count="day.othersTrueVotesCount"
        :others-false-votes-count="day.othersFalseVotesCount"
        v-model="day.value">
      </calendar-cell>
    </div>
  </div>
</template>

<script>

import moment from 'moment';
import CalendarCell from './CalendarCell.vue'

function rnd(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  data () {
    return {
      config: null,
    }
  },
  props: [ 'date' ],
  components: {
    CalendarCell
  },
  methods: {
    init () {
      const now = moment();
      const start = now.clone().startOf('isoWeek');
      const end = now.clone().add(2, 'months').endOf('month').endOf('isoWeek');
      const weeksCount = end.diff(start, 'weeks') + 1;

      var weeks = [];
      var date = start.clone();

      for (let i = 0; i < weeksCount; i++) {
        let week = [];
        for (let j = 0; j < 7; j++) {
          week.push({
            date: date.clone(),
            votes: {},
            value: rnd(0, 100) < 20 ? true : (rnd(0, 100) < 10 ? false : undefined),
            othersTrueVotesCount: rnd(0, 100) < 20 ? rnd(0, 5) : 0,
            othersFalseVotesCount: rnd(0, 100) < 10 ? rnd(0, 5) : 0,
          });
          date.add(1, 'day');
        }
        weeks.push(week);
      }

      this.config = Object.assign({}, this.config, {
        now: now.clone(),
        weeks: weeks
      });
    }
  },
  mounted () {
    this.$nextTick(this.init)
  }
}
</script>

<style scoped>

.week-container {
  padding: 0;
  margin: 0;
  list-style: none;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
}

</style>