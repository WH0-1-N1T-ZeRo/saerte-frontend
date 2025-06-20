<template>
  <div>
    <component :is="currentView" @switch-view="switchView" />
  </div>
</template>

<script>
import LoginOtp from '@/views/Auth/LoginOtp.vue'
import LoginEmail from '@/views/Auth/LoginEmail.vue'

export default {
  name: 'LoginPage',
  components: {
    LoginOtp,
    LoginEmail
  },
  data() {
    return {
      viewMode: this.$route.query.mode || 'email', // default: 'otp'
    }
  },
  computed: {
    currentView() {
      return this.viewMode === 'email' ? 'LoginEmail' : 'LoginOtp'
    }
  },
  methods: {
    switchView(mode) {
      this.viewMode = mode
      this.$router.replace({ query: { mode } }) // update URL
    }
  }
}
</script>
