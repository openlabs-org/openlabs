<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Desilo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!$store.state.isConnected"
        @click="$store.dispatch('connect')"
        text
      >
        Connect Metamask
      </v-btn>
      <v-btn v-else text @click="$store.dispatch('disconnect')">
        Disconnect
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
