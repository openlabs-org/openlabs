<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Desilo</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
