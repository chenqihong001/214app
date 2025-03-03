<script setup>
import { ref, computed, watch } from 'vue'

// 定义props（移至代码开头）
const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  }
})

// 响应式数据
const weekDays = ref(['周一', '周二', '周三', '周四', '周五'])
const timeRanges = ref([
  '8:00-9:35',
  '9:55-11:30',
  '13:30-15:05',
  '15:25-17:00',
  '18:30-20:05'
])

const semesters = ref([
  { id: 1, name: '2023-2024学年第一学期', startDate: '2023-09-04' },
  { id: 2, name: '2023-2024学年第二学期', startDate: '2024-03-01' }
])

const currentSemester = ref(1)
const currentWeek = ref(1)
const searchKeyword = ref('')
const selectedDate = ref('')
const showModal = ref(false)
const selectedCourse = ref(null)

// 修复后的计算属性
const filteredCourses = computed(() => {
  return props.courses.filter(course => {  // 移除错误的 .value
    const matchesSemester = course.semester === currentSemester.value
    const matchesWeek = course.weekSpan?.includes(currentWeek.value) ?? false
    const matchesSearch = !searchKeyword.value || 
      course.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return matchesSemester && matchesWeek && matchesSearch
  })
})

// 监听器保持不变
watch(selectedDate, (newVal) => {
  if (newVal) currentWeek.value = getWeekFromDate(newVal)
})

const getWeekFromDate = (dateStr) => {
  const selectedDate = new Date(dateStr)
  const semester = semesters.value.find(s => s.id === currentSemester.value)
  if (!semester) return 1
  
  const startDate = new Date(semester.startDate)
  const diff = selectedDate - startDate
  if (diff < 0) return 1
  
  return Math.floor(diff / (7 * 86400000)) + 1
}

// 优化后的课程获取方法
const getCourse = (timeSlot, day) => {
  return filteredCourses.value.find(c => 
    c.timeSlot === timeSlot && 
    c.day === day
  ) || null // 避免返回undefined
}

// 颜色生成函数保持不变
const getCourseColor = (course) => {
  if (!course) return 'transparent'
  const colors = [
    '#FFE0E0', '#E0F0FF', '#E0FFE0', 
    '#FFE8E0', '#E8E0FF', '#FFFFD0'
  ]
  let hash = 0
  for (let i = 0; i < course.name.length; i++) {
    hash = course.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// 其他方法保持不变
const resetFilters = () => {
  currentWeek.value = 1
  searchKeyword.value = ''
  selectedDate.value = ''
}

const showTeacherInfo = (course) => {
  selectedCourse.value = course
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCourse.value = null
}
</script>


<template>
  <div class="course-container">
    <!-- 查询条件区域 -->
    <div class="query-panel">
      <div class="query-row">
        <div class="semester-select">
          <label>学期</label>
          <select v-model="currentSemester">
            <option v-for="sem in semesters" :key="sem.id" :value="sem.id">
              {{ sem.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="query-row">
        <div class="week-select">
          <label>周次</label>
          <select v-model="currentWeek">
            <option v-for="week in 20" :key="week" :value="week">
              第{{ week }}周
            </option>
          </select>
        </div>

        <div class="date-select">
          <label>日期</label>
          <input type="date" v-model="selectedDate">
        </div>
      </div>

      <div class="query-row">
        <div class="course-search">
          <input type="text" v-model="searchKeyword" placeholder="搜索课程名称">
        </div>
        <button class="reset-btn" @click="resetFilters">重置</button>
      </div>
    </div>

    <!-- 课表主体 -->
    <div class="course-table">
      <div class="table-header">
        <div class="time-column">时间</div>
        <div v-for="day in weekDays" :key="day" class="day-column">
          {{ day }}
        </div>
      </div>
      
      <div class="table-body">
        <div v-for="(time, index) in timeRanges" :key="index" class="table-row">
          <div class="time-column">
            <div class="period">第{{ index + 1 }}节</div>
            <div class="time">{{ time }}</div>
          </div>
          <div v-for="day in weekDays" :key="day" class="course-cell">
            <template v-if="getCourse(index + 1, day)">
              <div class="course-item"
                   :style="{ backgroundColor: getCourseColor(getCourse(index + 1, day)) }"
                   @click="showTeacherInfo(getCourse(index + 1, day))">
                <div class="course-name">{{ getCourse(index + 1, day).name }}</div>
                <div class="course-info">
                  <div class="location">{{ getCourse(index + 1, day).location }}</div>
                  <div class="teacher">{{ getCourse(index + 1, day).teacher }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 教师信息弹窗 -->
    <div class="modal" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>课程信息</h3>
          <span class="close-btn" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="info-item">
            <label>课程名称：</label>
            <span>{{ selectedCourse?.name }}</span>
          </div>
          <div class="info-item">
            <label>任课教师：</label>
            <span>{{ selectedCourse?.teacher }}</span>
          </div>
          <div class="info-item">
            <label>教师职称：</label>
            <span>{{ selectedCourse?.teacherTitle }}</span>
          </div>
          <div class="info-item">
            <label>联系方式：</label>
            <span>{{ selectedCourse?.teacherContact }}</span>
          </div>
          <div class="info-item">
            <label>办公地点：</label>
            <span>{{ selectedCourse?.teacherOffice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.course-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  max-width: 100%;
  box-sizing: border-box;
}

.query-panel {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.query-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.query-row:last-child {
  margin-bottom: 0;
}

.semester-select,
.week-select,
.date-select {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.course-search {
  flex: 1;
}

label {
  font-size: 13px;
  white-space: nowrap;
  min-width: 35px;
}

select, input {
  width: 98%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
}
.reset-btn {
  padding: 5px 13px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  white-space: nowrap;
}

.course-table {
  width: 100%;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow-x: auto;
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 80px repeat(5, minmax(80px, 1fr));
  background-color: #f8f9fa;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
  min-height: 50px; /* 新增 */
}

.time-column, .day-column {
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  font-size: 13px;
  display: flex; /* 新增 */
  align-items: center; /* 新增 */
  justify-content: center; /* 新增 */
  box-sizing: border-box; /* 新增 */
  line-height: 1.4; /* 新增 */
  min-height: 100%; /* 新增 */
}

/* 单独调整时间列 */
.time-column.header-cell {
  padding: 10px 4px; /* 上下 padding 加大 */
}

.table-row {
  display: grid;
  grid-template-columns: 80px repeat(5, minmax(80px, 1fr));
}

.time-column {
  background-color: #f8f9fa;
  flex-direction: column; /* 修改为 flex 布局 */
  padding: 8px 4px; /* 统一为相同 padding */
  height: 100%; /* 新增 */
}

.period {
  font-size: 13px;
  color: #333;
  margin-bottom: 2px;
}

.time {
  font-size: 12px;
  color: #666;
}

.course-cell {
  height: 90px;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  padding: 3px;
  display: flex;
  align-items: stretch;
}

.course-item {
  height: 90%;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.course-item:hover {
  transform: scale(1.02);
}

.course-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.course-info {
  font-size: 11px;
  color: #666;
}

.location {
  margin-bottom: 2px;
}

.teacher {
  margin-top: 2px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .course-container {
    padding: 8px;
  }

  .query-row {
    flex-wrap: wrap;
  }

  .semester-select,
  .week-select,
  .date-select {
    min-width: calc(50% - 5px);
  }

  .time-column {
    font-size: 11px;
    padding: 2px;
  }

  .timeSlots {
    font-size: 11px;
  }

  select, input {
    padding: 6px;
    font-size: 13px;
  }

  .course-name {
    font-size: 12px;
  }

  .course-info {
    font-size: 10px;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 360px) {
  .semester-select,
  .week-select,
  .date-select {
    min-width: 100%;
  }

  .time-column {
    width: 60px;
  }

  .course-cell {
    height: 80px;
  }
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  cursor: pointer;
  font-size: 22px;
  color: #666;
}

.modal-body {
  padding: 15px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
}

.info-item label {
  width: 80px;
  color: #666;
  font-size: 14px;
}

.info-item span {
  flex: 1;
  font-size: 14px;
  color: #333;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .modal-content {
    width: 95%;
  }

  .info-item {
    font-size: 13px;
  }

  .info-item label {
    width: 70px;
  }
}
</style> 