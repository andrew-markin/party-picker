<template>
  <div 
    class="cell-container rounded"
    v-bind:class="{ 'cell-darkened': isDarkened }"
    @click="toggleUserVote(!$event.altKey)">
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
    <div class="all-votes">
      <span v-if="trueVotesCount > 0">
        <span class="icon icon-smile"></span>&times;{{ trueVotesCount }}&nbsp;&nbsp;
      </span>
      <span v-if="falseVotesCount > 0">
        <span class="icon icon-sad"></span>&times;{{ falseVotesCount }}
      </span>
    </div>
    <div class="user-vote">
      <span class="icon" :class="userVoteIconClass"></span>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'now',
    'date',
    'value',
    'othersTrueVotesCount',
    'othersFalseVotesCount'
  ],
  computed: {
    isToday () {
      return this.date.isSame(this.now, 'day');
    },
    isDarkened () {
      return this.date.month() % 2 !== this.now.month() % 2;
    },
    monthNameIsRequired () {
      const start = this.now.clone().startOf('isoWeek');
      return (this.date.date() === 1) || this.date.isSame(start, 'day');
    },
    isWeekend () {
      const weekday = this.date.isoWeekday();
      return (weekday === 6) || (weekday === 7);
    },
    trueVotesCount () {
      return this.othersTrueVotesCount + (this.value === true ? 1 : 0);
    },
    falseVotesCount () {
      return this.othersFalseVotesCount + (this.value === false ? 1 : 0);
    },
    userVoteIconClass () {
      if (this.value === true) return 'icon-smile';
      if (this.value === false) return 'icon-sad';
      return undefined;
    }
  },
  methods: {
    toggleUserVote (vote) {
      if (this.value !== vote) return this.$emit('input', vote);
      this.$emit('input', undefined);
    }
  }
}

</script>

<style scoped>

.icon:before {
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
.cell-container {
  position: relative;
  background: rgb(245, 245, 245);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.5em;
  flex: 1 0 auto;
  height: auto;
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
.all-votes {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 9px;
  padding-left: 5px;
  padding-bottom: 2px;
}
.user-vote {
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
  .all-votes {
    font-size: 9px;
    padding-left: 5px;
    padding-bottom: 2px;
  }
  .user-vote {
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
  .all-votes {
    font-size: 12px;
    padding-left: 7px;
    padding-bottom: 4px;
  }
  .user-vote {
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
  .all-votes {
    font-size: 15px;
    padding-left: 9px;
    padding-bottom: 5px;
  }
  .user-vote {
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
  .all-votes {
    font-size: 18px;
    padding-left: 11px;
    padding-bottom: 5px;
  }
  .user-vote {
    font-size: 36px;
    padding-left: 11px;
  }
}

</style>