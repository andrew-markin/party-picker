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
        v-model="day.latestChoice"
        :other-acceptors-count="day.otherAcceptors.length"
        :other-rejectors-count="day.otherRejectors.length"
        @details="showDetails(day)"
        @toggle="scheduleSubmit">
      </calendar-cell>
    </div>
    <proposition-modal ref="propositionModal"></proposition-modal>
  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment';

import user from '../user'
import CalendarCell from './CalendarCell.vue'
import PropositionModal from './PropositionModal.vue';

const getDayNumber = (date) => {
  return date.diff(moment(0), 'days');
}

export default {
  data () {
    return {
      config: null,
      submitTimeout: null
    }
  },
  props: [ 'party' ],
  components: {
    CalendarCell,
    PropositionModal
  },
  watch: { 
    party: function() {
      this.refresh();
    }
  },
  methods: {
    refresh () {
      if (!this.party) {
        this.config = null;
        return;
      }

      const userName = user.name;

      const now = moment();
      const min = now.clone().startOf('isoWeek');
      const max = now.clone().add(11, 'weeks').endOf('isoWeek');

      axios.get(`/parties/${this.party}/propositions`, {
        params: {
          min: getDayNumber(min),
          max: getDayNumber(max)
        }
      }).then(res => {
        var weeks = [];
        var date = min.clone();
        const weeksCount = max.diff(min, 'weeks') + 1;
        const propositions = res.data.propositions;

        for (let i = 0; i < weeksCount; i++) {
          let week = [];
          for (let j = 0; j < 7; j++) {
            var day = { date: date.clone() };

            const proposition = propositions[getDayNumber(date)] || {};
            const acceptors = proposition.acceptors || [];
            const rejectors = proposition.rejectors || [];

            if (userName) {
              day.otherAcceptors = acceptors.filter(item => item != userName);
              if (day.otherAcceptors.length < acceptors.length) day.storedChoice = true;
              day.otherRejectors = rejectors.filter(item => item != userName);
              if (day.otherRejectors.length < rejectors.length) day.storedChoice = false;
            } else {
              day.otherAcceptors = acceptors;
              day.otherRejectors = rejectors;
              day.storedChoice = null;
            }

            day.latestChoice = day.storedChoice;
            
            week.push(day);
            date.add(1, 'day');
          }
          weeks.push(week);
        }

        this.config = Object.assign({}, this.config, {
          now: now.clone(),
          userName: userName,
          weeks: weeks
        });
      }).catch(err => {
        console.log('Party propositions receiving error', err.message);
        this.config = null;
      });
    },
    showDetails (day) {
      var acceptors = day.otherAcceptors.slice();
      var rejectors = day.otherRejectors.slice();
      if (this.config.userName) {
        if (day.latestChoice === true) acceptors.push(this.config.userName);
        if (day.latestChoice === false) rejectors.push(this.config.userName);
      }
      acceptors.sort();
      rejectors.sort();
      if ((acceptors.length > 0) || (rejectors.length > 0)) {
        this.$refs.propositionModal.show({
          date: day.date,
          acceptors: acceptors,
          rejectors: rejectors
        });
      }
    },
    scheduleSubmit () {
      clearTimeout(this.submitTimeout);
      this.submitTimeout = null;
      this.submitTimeout = setTimeout(() => { this.submit(); }, 1000);
    },
    submit () {
      if (!this.party || !user.token || !this.config || !this.config.userName) return;
      var update = {
        accepts: [],
        rejects: [],
        resets: []
      }
      var updateDays = [];
      this.config.weeks.forEach(week => {
        week.forEach(day => {
          if (day.latestChoice === day.storedChoice) return;
          day.submitChoice = day.latestChoice;
          const dayNumber = getDayNumber(day.date);
          if (day.latestChoice === true) update.accepts.push(dayNumber);
          else if (day.latestChoice === false) update.rejects.push(dayNumber);
          else if (day.latestChoice === undefined) update.resets.push(dayNumber);
          updateDays.push(day);
        });
      });
      if (updateDays.length === 0) return;
      axios.put(`/parties/${this.party}/propositions`, update).then(() => {
        updateDays.forEach(day => {
          day.storedChoice = day.submitChoice;
        });
      }).catch(err => {
        this.$bvToast.toast(err.message, {
          title: 'Unable to save your choices :(',
          autoHideDelay: 5000,
          variant: 'danger',
          solid: true
        });
      });
    }
  },
  created () {
    user.$on('changed', () => {
      this.$nextTick(this.refresh)
    })
  },
  mounted () {
    this.$nextTick(this.refresh)
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