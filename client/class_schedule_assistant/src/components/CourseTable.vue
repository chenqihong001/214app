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
            <option v-for="week in totalWeeks" :key="week" :value="week">
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

    <!-- 课表主体部分 -->
    <div class="course-table">
      <!-- 表头 -->
      <div class="table-header">
        <div class="time-column">时间</div>
        <div v-for="day in weekDays" :key="day" class="day-column">
          {{ day }}
        </div>
      </div>
      
      <!-- 课表主体 -->
      <div class="table-body">
        <div v-for="(time, index) in timeSlots" :key="index" class="table-row">
          <div class="time-column">
            <div class="period">第{{ index + 1 }}节</div>
            <div class="time">{{ timeRanges[index] }}</div>
          </div>
          <div v-for="day in weekDays" :key="day" class="course-cell">
            <div v-if="getFilteredCourse(index, day)" 
                 class="course-item"
                 :style="{ backgroundColor: getCourseColor(index, day) }">
              <div class="course-name">{{ getFilteredCourse(index, day).name }}</div>
              <div class="course-info">
                {{ getFilteredCourse(index, day).location }}
                <div class="course-week">第{{ getFilteredCourse(index, day).week }}周</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseTable',
  data() {
    return {
      weekDays: ['周一', '周二', '周三', '周四', '周五'],
      timeSlots: [
        '第一节 8:00-9:35',
        '第二节 9:55-11:30',
        '第三节 13:30-15:05',
        '第四节 15:25-17:00',
        '第五节 18:30-20:05'
      ],
      timeRanges: [
        '8:00-9:35',
        '9:55-11:30',
        '13:30-15:05',
        '15:25-17:00',
        '18:30-20:05'
      ],
      // 学期数据
      semesters: [
        { id: 1, name: '2023-2024学年第一学期' },
        { id: 2, name: '2023-2024学年第二学期' }
      ],
      currentSemester: 1,
      currentWeek: 1,
      totalWeeks: 20,
      searchKeyword: '',
      selectedDate: '',
      
      // 课程数据增加周次信息
      courses: [
        { 
          day: '周一', 
          timeSlot: 0, 
          name: '高等数学', 
          location: '教学楼A101',
          semester: 1,
          week: 1,
          weekSpan: [1, 2, 3, 4, 5, 6, 7, 8] // 表示第1-8周上课
        },
        { 
          day: '周三', 
          timeSlot: 2, 
          name: '大学英语', 
          location: '教学楼B203',
          semester: 1,
          week: 1,
          weekSpan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          },
           { 
      day: '周五', 
    timeSlot: 4, 
    name: "云计算与大数据", 
    location: "教学楼C204",
    semester: 2,
    week: 2,
    weekSpan: [2, 3, 5, 7] 
  }
        
      ],
      courseColors: [
        '#FFE0E0', // 浅粉红
        '#E0F0FF', // 浅蓝
        '#E0FFE0', // 浅绿
        '#FFE8E0', // 浅橙
        '#E8E0FF', // 浅紫
        '#FFFFD0', // 浅黄
      ]
    }
  },
  methods: {
    getFilteredCourse(timeSlot, day) {
      return this.filteredCourses.find(course => 
        course.timeSlot === timeSlot && 
        course.day === day
      )
    },
    getCourseColor(timeSlot, day) {
      const course = this.getFilteredCourse(timeSlot, day)
      if (course) {
        const colorIndex = this.courses.findIndex(c => c.name === course.name)
        return this.courseColors[colorIndex % this.courseColors.length]
      }
      return 'transparent'
    },
    resetFilters() {
      this.currentWeek = 1
      this.searchKeyword = ''
      this.selectedDate = ''
    },
    // 根据日期获取对应的周次
    getWeekFromDate(date) {
      // 这里需要实现具体的日期转换周次的逻辑
      // 示例实现
      return 1
    }
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        // 学期筛选
        if (course.semester !== this.currentSemester) return false
        
        // 周次筛选
        if (!course.weekSpan.includes(this.currentWeek)) return false
        
        // 课程名称搜索
        if (this.searchKeyword && !course.name.includes(this.searchKeyword)) return false
        
        // 日期筛选
        if (this.selectedDate) {
          const weekFromDate = this.getWeekFromDate(this.selectedDate)
          if (!course.weekSpan.includes(weekFromDate)) return false
        }
        
        return true
      })
    }
  }
}
</script>

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
}

.time-column, .day-column {
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  font-size: 13px;
}

.table-row {
  display: grid;
  grid-template-columns: 80px repeat(5, minmax(80px, 1fr));
}

.time-column {
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  line-height: 1.2;
  height: 100%;
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

.course-week {
  font-size: 11px;
  color: #888;
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

  .course-info,
  .course-week {
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
</style> 