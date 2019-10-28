import gql from 'graphql-tag'

export const LESSON_BY_ID = gql`
query lessonById($condition: CurriculumLessonCondition!){
  getLessonById(input:$condition){
    id
    name
    description
    metadata
    slides {
      id
      name
      description
      metadata
      priority
      type {
        name
      }
      assets {
        id
        url
      }
    }
  }
}
`
