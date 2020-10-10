<template>
  <weather></weather>
  <router-view/>
</template>
<script>
import Weather from '@/components/Weather'
export default {
  components: { Weather }
}
</script>
