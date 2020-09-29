<template>
  <div
    class="cell-container rounded"
    v-bind:class="{ 'cell-darkened': isDarkened }"
    @click="toggleUserChoice(!$event.altKey)"
    @contextmenu.prevent="showDetails">
    <div
      class="date"
      :class="{ 'today': isToday }">
      <div>
        <span v-if="monthNameIsRequired">{{ date.format('MMM') }} </span>
        {{ date.format('D') }}
      </div>
    </div>
    <div
      class="weekday"
      :class="{ 'weekend': isWeekend }">
      {{ date.format('ddd') }}
    </div>
    <div
      class="all-choices"
      @click.stop="showDetails">
      <span v-if="acceptorsCount > 0">
        <span class="icon icon-smile"></span>&times;{{ acceptorsCount }}&nbsp;&nbsp;
      </span>
      <span v-if="rejectorsCount > 0">
        <span class="icon icon-sad"></span>&times;{{ rejectorsCount }}
      </span>
    </div>
    <div class="user-choice">
      <span class="icon" :class="userChoiceIconClass"></span>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'now',
    'date',
    'value',
    'otherAcceptorsCount',
    'otherRejectorsCount'
  ],
  computed: {
    isToday () {
      return this.date.isSame(this.now, 'day')
    },
    isDarkened () {
      return this.date.month() % 2 !== this.now.month() % 2
    },
    monthNameIsRequired () {
      const start = this.now.clone().startOf('isoWeek')
      return (this.date.date() === 1) || this.date.isSame(start, 'day')
    },
    isWeekend () {
      const weekday = this.date.isoWeekday()
      return (weekday === 6) || (weekday === 7)
    },
    acceptorsCount () {
      return this.otherAcceptorsCount + (this.value === true ? 1 : 0)
    },
    rejectorsCount () {
      return this.otherRejectorsCount + (this.value === false ? 1 : 0)
    },
    userChoiceIconClass () {
      if (this.value === true) return 'icon-smile'
      if (this.value === false) return 'icon-sad'
      return undefined
    }
  },
  methods: {
    toggleUserChoice (choice) {
      if (this.value === null) {
        this.$root.$emit('user-needed')
        return
      }
      this.$emit('toggle', undefined)
      if (this.value !== choice) return this.$emit('input', choice)
      this.$emit('input', undefined)
    },
    showDetails () {
      this.$emit('details')
    }
  }
}

</script>

<style scoped>

.cell-container {
  position: relative;
  background: rgb(245, 245, 245);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.5em;
  flex: 1 0 auto;
  height: auto;
  cursor: pointer;
}
.cell-container:before {
  content:'';
  float:left;
  padding-bottom:100%;
}
.cell-container:hover {
  background: #ededed;
}
.cell-darkened {
  background: #e3e4e8;
}
.cell-darkened:hover {
  background: #dbdce1;
}
.date {
  font-size: 16px;
  color: #676f7e;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.today {
  color: #cc3333;
}
.weekday {
  position: absolute;
  top: 0;
  right: 0;
  color: rgb(170, 170, 170);
  font-size: 9px;
  padding-top: 2px;
  padding-right: 5px;
}
.weekend {
  color: #a65959;
}
.all-choices {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 9px;
  padding-left: 5px;
  padding-bottom: 2px;
}
.user-choice {
  font-size: 17px;
  padding-top: 1px;
  padding-left: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .date {
    font-size: 16px;
  }
  .weekday {
    font-size: 9px;
    padding-top: 2px;
    padding-right: 5px;
  }
  .all-choices {
    font-size: 9px;
    padding-left: 5px;
    padding-bottom: 2px;
  }
  .user-choice {
    font-size: 17px;
    padding-top: 1px;
    padding-left: 5px;
  }
}
/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .date {
    font-size: 16px;
    font-weight: bold;
  }
  .weekday {
    font-size: 12px;
    padding-top: 3px;
    padding-right: 7px;
  }
  .all-choices {
    font-size: 12px;
    padding-left: 7px;
    padding-bottom: 4px;
  }
  .user-choice {
    font-size: 23px;
    padding-top: 1px;
    padding-left: 7px;
  }
}
/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .date {
    font-size: 20px;
    font-weight: bold;
  }
  .weekday {
    font-size: 15px;
    padding-top: 4px;
    padding-right: 10px;
  }
  .all-choices {
    font-size: 15px;
    padding-left: 9px;
    padding-bottom: 5px;
  }
  .user-choice {
    font-size: 30px;
    padding-left: 9px;
  }
}
/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .date {
    font-size: 24px;
  }
  .weekday {
    font-size: 18px;
    padding-top: 4px;
    padding-right: 10px;
  }
  .all-choices {
    font-size: 18px;
    padding-left: 11px;
    padding-bottom: 5px;
  }
  .user-choice {
    font-size: 36px;
    padding-left: 11px;
  }
}

</style>
