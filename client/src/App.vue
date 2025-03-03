<template>
  <div class="app">
    <h1>课程表</h1>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      课程表加载中...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-state">
      {{ error }}
      <button class="retry-btn" @click="loadCourses">重试</button>
    </div>

    <!-- 正常显示 -->
    <CourseTable 
      v-else
      :courses="data"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CourseTable from './components/CourseTable.vue'

// 响应式数据
const data = ref([])  // 改为数组类型初始值
const isLoading = ref(true)  // 新增加载状态
const error = ref(null)

// 封装数据加载方法
const loadCourses = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await axios.get('http://4dw9nm.natappfree.cc/api/courses')
    
    // 验证数据结构
    if (response.data?.code === 200 && Array.isArray(response.data.data)) {
      data.value = response.data.data.map(course => ({
        day: course.day,
        timeSlot: course.timeSlot,
        name: course.name,
        location: course.location,
        teacher: course.teacher,
        teacherTitle: course.teacherTitle,
        teacherContact: course.teacherContact,
        teacherOffice: course.teacherOffice,
        semester: course.semester,
        weekSpan: course.weekSpan || []  // 处理空数组的情况
      }))
    } else {
      throw new Error('无效的响应结构')
    }
  } catch (err) {
    error.value = '请求失败：' + err.message
  } finally {
    isLoading.value = false
  }
}

// 初始化加载
onMounted(loadCourses)
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

/* 加载状态样式 */
.loading-state {
  text-align: center;
  padding: 30px;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #ddd;
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-state {
  text-align: center;
  padding: 20px;
  background: #fee;
  border: 1px solid #f99;
  border-radius: 6px;
  color: #c00;
  margin: 20px 0;
}

.retry-btn {
  margin-top: 15px;
  padding: 8px 20px;
  background: #fff;
  border: 1px solid #c00;
  border-radius: 4px;
  color: #c00;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #c00;
  color: white;
}
</style>