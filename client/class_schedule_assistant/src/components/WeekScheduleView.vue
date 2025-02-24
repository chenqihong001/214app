<template>
  <div class="week-schedule">
    <!-- 周次选择器 -->
    <div class="week-picker">
      <van-row type="flex" justify="space-between" align="center">
        <van-col span="6">
          <van-button 
            plain 
            hairline 
            size="small"
            :disabled="currentWeek <= 1"
            @click="changeWeek(-1)"
          >
            上一周
          </van-button>
        </van-col>
        <van-col span="12" class="week-text">
          第 {{ currentWeek }} 周
        </van-col>
        <van-col span="6">
          <van-button 
            plain 
            hairline 
            size="small"
            :disabled="currentWeek >= 20"
            @click="changeWeek(1)"
          >
            下一周
          </van-button>
        </van-col>
      </van-row>
    </div>

    <!-- 课表网格 -->
    <div class="schedule-grid">
      <!-- 时间列 -->
      <div class="time-column">
        <div class="time-cell header">节次</div>
        <div class="time-cell" v-for="time in timeList" :key="time.id">
          {{ time.name }}
        </div>
      </div>

      <!-- 星期几的课程列 -->
      <div 
        class="day-column" 
        v-for="day in 7" 
        :key="day"
      >
        <div class="day-cell header">
          {{ weekdays[day-1] }}
        </div>
        <div 
          class="course-cell"
          v-for="time in timeList"
          :key="time.id"
          @click="showCourseDetail(getCourse(day, time.id))"
        >
          <template v-if="getCourse(day, time.id)">
            <div class="course-content" :style="getCourseStyle(getCourse(day, time.id))">
              {{ getCourse(day, time.id).name }}
              <div class="course-location">{{ getCourse(day, time.id).location }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 课程详情弹窗 -->
    <van-popup
      v-model:show="showDetail"
      round
      position="bottom"
      :style="{ padding: '20px' }"
    >
      <div v-if="selectedCourse" class="course-detail">
        <h3>{{ selectedCourse.name }}</h3>
        <p>教师：{{ selectedCourse.teacher }}</p>
        <p>地点：{{ selectedCourse.location }}</p>
        <p>时间：{{ selectedCourse.time }}</p>
        <p>周次：{{ selectedCourse.weeks }}</p>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScheduleStore } from '@/stores/schedule'

const store = useScheduleStore()
const currentWeek = ref(store.currentWeek)
const showDetail = ref(false)
const selectedCourse = ref(null)

const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const timeList = [
  { id: 1, name: '1-2节' },
  { id: 2, name: '3-4节' },
  { id: 3, name: '5-6节' },
  { id: 4, name: '7-8节' },
  { id: 5, name: '9-10节' }
]

const changeWeek = (delta: number) => {
  currentWeek.value += delta
  store.setCurrentWeek(currentWeek.value)
}

const getCourse = (day: number, timeId: number) => {
  return store.getCourseByDayAndTime(day, timeId)
}

const getCourseStyle = (course: any) => {
  return {
    backgroundColor: course.color || '#1989fa',
    color: '#ffffff'
  }
}

const showCourseDetail = (course: any) => {
  if (course) {
    selectedCourse.value = course
    showDetail.value = true
  }
}
</script>

<style scoped>
.week-schedule {
  background-color: #ffffff;
  padding: 12px;
}

.week-picker {
  margin-bottom: 16px;
  padding: 8px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.week-text {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.schedule-grid {
  display: flex;
  overflow-x: auto;
  border: 1px solid #ebedf0;
  border-radius: 8px;
}

.time-column, .day-column {
  flex: 1;
  min-width: 60px;
}

.time-cell, .day-cell {
  height: 100px;
  border-bottom: 1px solid #ebedf0;
  border-right: 1px solid #ebedf0;
  padding: 4px;
}

.header {
  height: 40px;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.course-cell {
  height: 100px;
  padding: 2px;
}

.course-content {
  height: 100%;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-location {
  font-size: 10px;
  opacity: 0.9;
}

.course-detail {
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #323233;
  }
  
  p {
    margin: 8px 0;
    color: #646566;
  }
}
</style> 