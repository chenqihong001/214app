<script>
import CourseTable from './components/CourseTable.vue'

export default {
  name: 'App',
  components: {
    CourseTable
  }
}
</script>

<template>
  <div class="app">
    <h1>课程表</h1>
    <CourseTable />
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
