import * as Service from '@/Lessons/Service'

export const Actions = {
  GET: 'lessons:GET'
}

export const LessonStore = {
  actions: {
    [Actions.GET]: async ({ commit, state }, lessonId) => {
      const lesson = await Service.getLesson(lessonId)
      return lesson
    }
  }
}
