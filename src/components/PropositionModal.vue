<template>
  <b-modal
    ref="modal"
    :title="title"
    scrollable
    hide-footer
    @hidden="resetModal">
    <h5
      v-for="rejector in rejectors"
      :key="rejector"
      class="text-truncate">
      <span class="icon icon-sad"></span>
      <span class="ml-1">{{rejector}}</span>
    </h5>
    <h5
      v-for="acceptor in acceptors"
      :key="acceptor"
      class="text-truncate">
      <span class="icon icon-smile"></span>
      <span class="ml-1">{{acceptor}}</span>
    </h5>
  </b-modal>
</template>

<script>

export default {
  data () {
    return {
      date: undefined,
      acceptors: [],
      rejectors: []
    }
  },
  computed: {
    title () {
      return this.date ? this.date.format('MMMM D, YYYY') : '';
    }
  },
  methods: {
    show (proposition) {
      this.date = proposition.date;
      this.acceptors = proposition.acceptors;
      this.rejectors = proposition.rejectors;
      this.$refs.modal.show()
    },
    resetModal () {
      this.date = undefined;
      this.acceptors = [];
      this.rejectors = [];
    }
  }
}

</script>
