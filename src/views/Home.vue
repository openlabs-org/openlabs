<template>
  <v-container>
    <h3 class="text-h3">This is the home page</h3>
    <h4 class="text-h4">Balance : {{ balance }}</h4>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    balance: 0
  }),
  watch: {
    provider(value) {
      if (value) {
        this.fetchBalance()
      } else {
        this.balance = 0
      }
    }
  },
  computed: {
    provider() {
      return this.$store.state.provider
    }
  },
  methods: {
    async fetchBalance() {
      this.balance = await this.provider.getBalance('ethers.eth')
    }
  }
}
</script>
