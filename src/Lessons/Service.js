import { LESSON_BY_ID } from './api.js'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const getLesson = async lessonId => {
  return apollo.query({
    query: LESSON_BY_ID,
    variables: {
      condition: {
        id: lessonId
      }
    }
  })
    .then(({ data: { getLessonById } }) => getLessonById)
}
